import { VehicleReport, DataSource } from './types';

const SOURCE: DataSource = 'mock';

export const MOCK_REPORTS: Record<string, VehicleReport> = {
  KMHXX00000X123456: {
    vehicle: {
      vin: 'KMHXX00000X123456',
      make: '현대',
      model: '아반떼 CN7',
      year: 2021,
      trim: '1.6 스마트',
      engine: '1,598cc',
      fuel: '가솔린',
      color: '화이트 펄',
      firstRegistered: '2021.03.15',
    },
    score: 78,
    floodDamage: false,
    totalLoss: false,
    accidents: [
      {
        date: '2022.08.14',
        type: '보험 처리',
        estimatedCost: '1,200,000원',
        parts: '후범퍼, 트렁크 리드',
        insuranceClaim: true,
      },
    ],
    owners: [
      { order: 1, from: '2021.03', to: '2023.05', type: '개인', region: '서울' },
      { order: 2, from: '2023.05', to: null, type: '개인', region: '경기' },
    ],
    mileage: [
      { date: '2021.03', mileage: 0 },
      { date: '2021.12', mileage: 12000 },
      { date: '2022.06', mileage: 24500 },
      { date: '2022.12', mileage: 37000 },
      { date: '2023.06', mileage: 49200 },
      { date: '2024.01', mileage: 58700 },
    ],
    recalls: [],
    dataSource: SOURCE,
  },
  KNAJX814X0X987654: {
    vehicle: {
      vin: 'KNAJX814X0X987654',
      make: '기아',
      model: 'K5 DL3',
      year: 2020,
      trim: '2.0 프레스티지',
      engine: '1,999cc',
      fuel: '가솔린',
      color: '쉬머링 실버',
      firstRegistered: '2020.07.22',
    },
    score: 45,
    floodDamage: false,
    totalLoss: false,
    accidents: [
      {
        date: '2021.02.10',
        type: '보험 처리',
        estimatedCost: '3,800,000원',
        parts: '전면부, 에어백, 라디에이터',
        insuranceClaim: true,
      },
      {
        date: '2022.11.05',
        type: '보험 처리',
        estimatedCost: '950,000원',
        parts: '운전석 도어',
        insuranceClaim: true,
      },
    ],
    owners: [
      { order: 1, from: '2020.07', to: '2021.09', type: '렌트', region: '인천' },
      { order: 2, from: '2021.09', to: '2023.02', type: '개인', region: '부산' },
      { order: 3, from: '2023.02', to: null, type: '개인', region: '대구' },
    ],
    mileage: [
      { date: '2020.07', mileage: 0 },
      { date: '2021.01', mileage: 28000 },
      { date: '2021.07', mileage: 52000 },
      { date: '2022.01', mileage: 71000 },
      { date: '2022.07', mileage: 86000 },
      { date: '2023.01', mileage: 98000 },
      { date: '2023.07', mileage: 108000 },
    ],
    recalls: [
      {
        id: 'RC-2021-KIA-045',
        date: '2021.06.01',
        title: '연료 펌프 결함',
        description: '연료 펌프 불량으로 시동 꺼짐 현상 발생 가능. 무상 교체 대상.',
        completed: false,
      },
    ],
    dataSource: SOURCE,
  },
  DEMO00000000000001: {
    vehicle: {
      vin: 'DEMO00000000000001',
      make: '제네시스',
      model: 'G80 RG3',
      year: 2022,
      trim: '2.5T 프리미엄 라인',
      engine: '2,497cc 터보',
      fuel: '가솔린',
      color: '마티라 블루',
      firstRegistered: '2022.01.10',
    },
    score: 92,
    floodDamage: false,
    totalLoss: false,
    accidents: [],
    owners: [
      { order: 1, from: '2022.01', to: null, type: '개인', region: '서울' },
    ],
    mileage: [
      { date: '2022.01', mileage: 0 },
      { date: '2022.07', mileage: 8500 },
      { date: '2023.01', mileage: 18200 },
      { date: '2023.07', mileage: 27400 },
      { date: '2024.01', mileage: 35800 },
    ],
    recalls: [],
    dataSource: SOURCE,
  },
};

export function getReport(vin: string): VehicleReport | null {
  const upper = vin.toUpperCase();
  return MOCK_REPORTS[upper] ?? null;
}

export function getScoreGrade(score: number): {
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  if (score >= 80) return { label: '우수', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (score >= 60) return { label: '양호', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' };
  if (score >= 40) return { label: '주의', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
  return { label: '위험', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' };
}
