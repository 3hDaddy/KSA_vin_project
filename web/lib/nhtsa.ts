const DECODE_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';
const RECALLS_BASE = 'https://api.nhtsa.gov/recalls';

export interface NhtsaVehicleInfo {
  make: string;
  model: string;
  year: number;
  trim: string;
  engineCC: string;
  fuelType: string;
  plantCountry: string;
}

export interface NhtsaRecall {
  campaignNumber: string;
  date: string;
  component: string;
  summary: string;
  remedy: string;
}

function pick(results: Array<{ Variable: string; Value: string | null }>, key: string): string {
  return results.find(r => r.Variable === key)?.Value?.trim() || '';
}

export async function decodeVin(vin: string): Promise<NhtsaVehicleInfo | null> {
  try {
    const res = await fetch(`${DECODE_BASE}/DecodeVin/${vin}?format=json`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const results: Array<{ Variable: string; Value: string | null }> = data.Results ?? [];

    const make = pick(results, 'Make');
    const model = pick(results, 'Model');
    const yearStr = pick(results, 'Model Year');
    const year = parseInt(yearStr, 10);

    if (!make || !model || !year) return null;

    return {
      make,
      model,
      year,
      trim: pick(results, 'Trim') || pick(results, 'Series'),
      engineCC: pick(results, 'Displacement (CC)'),
      fuelType: pick(results, 'Fuel Type - Primary'),
      plantCountry: pick(results, 'Plant Country'),
    };
  } catch {
    return null;
  }
}

export async function getRecalls(make: string, model: string, year: number): Promise<NhtsaRecall[]> {
  try {
    const params = new URLSearchParams({ make, model, modelYear: String(year) });
    const res = await fetch(`${RECALLS_BASE}/recallsByVehicle?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data = await res.json();
    const results: Array<Record<string, string>> = data.results ?? data.Results ?? [];

    return results.map(r => ({
      campaignNumber: r.NHTSACampaignNumber ?? '',
      date: formatDate(r.ReportReceivedDate ?? ''),
      component: r.Component ?? '',
      summary: r.Summary ?? '',
      remedy: r.Remedy ?? '',
    }));
  } catch {
    return [];
  }
}

function formatDate(raw: string): string {
  if (!raw) return '-';
  // /Date(1234567890000)/
  const ms = raw.match(/\/Date\((\d+)\)\//);
  if (ms) {
    const d = new Date(parseInt(ms[1], 10));
    return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
  }
  // ISO or YYYY-MM-DD
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
  return raw;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}
