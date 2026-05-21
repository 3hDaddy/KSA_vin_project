import { decodeVin, getRecalls } from './nhtsa';
import { getReport as getMockReport } from './mockData';
import { VehicleReport, AccidentRecord, OwnerRecord, MileageRecord, RecallRecord } from './types';

// --- deterministic mock helpers (for non-demo VINs) ---

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

function mockAccidents(vin: string): AccidentRecord[] {
  const h = hash(vin);
  const count = h % 3;
  if (count === 0) return [];
  const typeList = ['보험 처리', '자차 처리'];
  const partsList = ['후범퍼', '전범퍼', '운전석 도어', '조수석 휀더', '트렁크 리드'];
  return Array.from({ length: count }, (_, i) => ({
    date: `${2021 + (h % 3)}.${String((h % 11) + 1).padStart(2, '0')}.${String((h % 27) + 1).padStart(2, '0')}`,
    type: typeList[(h + i) % typeList.length],
    estimatedCost: `${(((h + i) % 30) + 5) * 100000}원`,
    parts: partsList[(h + i) % partsList.length],
    insuranceClaim: true,
  }));
}

function mockOwners(vin: string, year: number): OwnerRecord[] {
  const h = hash(vin);
  const count = (h % 3) + 1;
  const typeList: Array<'개인' | '렌트' | '영업용' | '법인'> = ['개인', '개인', '렌트', '법인'];
  const regions = ['서울', '경기', '인천', '부산', '대구', '광주'];
  const owners: OwnerRecord[] = [];
  let fromYear = year;
  let fromMonth = 1 + (h % 11);

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1;
    const toYear = isLast ? null : fromYear + 1 + (h % 2);
    const toMonth = toYear ? 1 + ((h + i) % 11) : null;
    owners.push({
      order: i + 1,
      from: `${fromYear}.${String(fromMonth).padStart(2, '0')}`,
      to: toYear ? `${toYear}.${String(toMonth).padStart(2, '0')}` : null,
      type: typeList[(h + i) % typeList.length],
      region: regions[(h + i) % regions.length],
    });
    if (toYear && toMonth) { fromYear = toYear; fromMonth = toMonth; }
  }
  return owners;
}

function mockMileage(vin: string, year: number): MileageRecord[] {
  const h = hash(vin);
  const annualKm = 12000 + (h % 13000);
  const currentYear = new Date().getFullYear();
  const records: MileageRecord[] = [{ date: `${year}.01`, mileage: 0 }];
  let cumulative = 0;

  for (let y = year; y <= Math.min(currentYear, year + 4); y++) {
    for (const month of [7, 1]) {
      if (y === year && month <= 1) continue;
      if (y > currentYear || (y === currentYear && month > new Date().getMonth() + 1)) break;
      cumulative += Math.round((annualKm / 2) * (0.85 + (h % 3) * 0.075));
      records.push({ date: `${y}.${String(month).padStart(2, '0')}`, mileage: cumulative });
    }
  }
  return records;
}

function calcScore(accidents: AccidentRecord[], recalls: RecallRecord[], owners: OwnerRecord[]): number {
  let score = 100;
  score -= accidents.length * 12;
  score -= recalls.filter(r => !r.completed).length * 10;
  if (owners.some(o => o.type === '렌트' || o.type === '영업용')) score -= 8;
  if (owners.length >= 3) score -= 5;
  return Math.max(10, Math.min(100, score));
}

function translateFuel(fuel: string): string {
  const map: Record<string, string> = {
    'Gasoline': '가솔린',
    'Diesel': '디젤',
    'Electric': '전기',
    'Flex Fuel (FFV)': '플렉스퓨얼',
    'Hybrid (Gasoline/Electric)': '하이브리드',
    'Plug-in Hybrid (PHEV)': '플러그인 하이브리드',
    'Natural Gas': '천연가스',
    'Hydrogen': '수소',
  };
  return map[fuel] || fuel || '정보 없음';
}

// --- main entry ---

export async function buildReport(vin: string): Promise<VehicleReport | null> {
  // 1. Demo VINs → mock data
  const mock = getMockReport(vin);
  if (mock) return { ...mock, dataSource: 'mock' };

  // 2. NHTSA decode
  const info = await decodeVin(vin);
  if (!info) return null;

  // 3. NHTSA recalls (parallel with mock generation)
  const [nhtsaRecalls, accidents, owners, mileage] = await Promise.all([
    getRecalls(info.make, info.model, info.year),
    Promise.resolve(mockAccidents(vin)),
    Promise.resolve(mockOwners(vin, info.year)),
    Promise.resolve(mockMileage(vin, info.year)),
  ]);

  const recalls: RecallRecord[] = nhtsaRecalls.map(r => ({
    id: r.campaignNumber,
    date: r.date,
    title: r.component,
    description: r.summary,
    completed: false,
  }));

  const score = calcScore(accidents, recalls, owners);

  return {
    vehicle: {
      vin,
      make: info.make,
      model: info.model,
      year: info.year,
      trim: info.trim || '-',
      engine: info.engineCC ? `${Math.round(parseFloat(info.engineCC)).toLocaleString()}cc` : '-',
      fuel: translateFuel(info.fuelType),
      color: '정보 없음',
      firstRegistered: `${info.year}.01`,
    },
    score,
    accidents,
    owners,
    mileage,
    recalls,
    floodDamage: false,
    totalLoss: false,
    dataSource: 'nhtsa',
  };
}
