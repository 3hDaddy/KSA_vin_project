import Header from '@/components/Header';
import VinInput from '@/components/VinInput';
import { Car, FileSearch, ShieldAlert, Gauge } from 'lucide-react';
import Link from 'next/link';

const DEMO_VINS = [
  { vin: 'KMHXX00000X123456', label: '현대 아반떼 2021 (사고 1회)', grade: '양호' },
  { vin: 'KNAJX814X0X987654', label: '기아 K5 2020 (사고 2회·리콜)', grade: '주의' },
  { vin: 'DEMO00000000000001', label: '제네시스 G80 2022 (무사고)', grade: '우수' },
];

const FEATURES = [
  { icon: ShieldAlert, title: '사고 이력', desc: '보험 처리 횟수, 침수·전손 여부' },
  { icon: Car, title: '소유자 이력', desc: '명의 변경 횟수, 렌트·영업용 여부' },
  { icon: Gauge, title: '주행거리 검증', desc: '계기 조작 이상 탐지' },
  { icon: FileSearch, title: '리콜 정보', desc: '미완료 리콜 항목 확인' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              중고차 구매 전,<br />
              <span className="text-emerald-600">진짜 이력</span>을 확인하세요
            </h1>
            <p className="mt-4 text-gray-500 text-base">
              VIN(차대번호) 하나로 사고이력·소유자이력·주행거리·리콜 정보를 한 번에
            </p>
            <div className="mt-8">
              <VinInput />
            </div>
            <p className="mt-3 text-xs text-gray-400">
              차대번호는 차량등록증 또는 앞유리 하단(대시보드)에서 확인하실 수 있습니다
            </p>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
            확인 가능한 항목
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="font-semibold text-sm text-gray-800">{title}</p>
                <p className="text-xs text-gray-400 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Demo VINs */}
        <section className="max-w-2xl mx-auto px-4 pb-16">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">데모 VIN으로 바로 확인하기</h2>
          <div className="flex flex-col gap-2">
            {DEMO_VINS.map(({ vin, label, grade }) => (
              <Link
                key={vin}
                href={`/report/${vin}`}
                className="flex items-center justify-between bg-white border border-gray-200 hover:border-emerald-400 hover:shadow-sm rounded-xl px-4 py-3 transition group"
              >
                <div>
                  <p className="font-mono text-sm text-gray-700 group-hover:text-emerald-700">{vin}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  grade === '우수' ? 'bg-emerald-100 text-emerald-700' :
                  grade === '양호' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {grade}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-100">
        © 2025 VIN Check · MVP Demo · Mock 데이터 기반
      </footer>
    </div>
  );
}
