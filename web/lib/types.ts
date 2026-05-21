export interface VehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  engine: string;
  fuel: string;
  color: string;
  firstRegistered: string;
}

export interface AccidentRecord {
  date: string;
  type: string;
  estimatedCost: string;
  parts: string;
  insuranceClaim: boolean;
}

export interface OwnerRecord {
  order: number;
  from: string;
  to: string | null;
  type: '개인' | '법인' | '렌트' | '영업용';
  region: string;
}

export interface MileageRecord {
  date: string;
  mileage: number;
}

export interface RecallRecord {
  id: string;
  date: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface VehicleReport {
  vehicle: VehicleInfo;
  score: number;
  accidents: AccidentRecord[];
  owners: OwnerRecord[];
  mileage: MileageRecord[];
  recalls: RecallRecord[];
  floodDamage: boolean;
  totalLoss: boolean;
}
