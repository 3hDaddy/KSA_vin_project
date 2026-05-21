import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildReport } from '@/lib/reportService';
import { getScoreGrade } from '@/lib/mockData';
import Header from '@/components/Header';
import ScoreGauge from '@/components/ScoreGauge';
import MileageChart from '@/components/MileageChart';
import {
  ArrowLeft, Car, ShieldAlert, Users, Gauge,
  FileSearch, AlertTriangle, CheckCircle2, Database, FlaskConical,
} from 'lucide-react';

function SourceBadge({ source }: { source: 'nhtsa' | 'mock' }) {
  if (source === 'nhtsa') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
        <Database className="w-3 h-3" /> NHTSA
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
      <FlaskConical className="w-3 h-3" /> Mock
    </span>
  );
}

function Section({ title, icon: Icon, badge, children }: {
  title: string;
  icon: React.ElementType;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
        <Icon className="w-4 h-4 text-emerald-600" />
        {title}
        {badge}
      </h2>
      {children}
    </section>
  );
}

export default async function ReportPage({ params }: { params: Promise<{ vin: string }> }) {
  const { vin } = await params;

  const report = await buildReport(vin.toUpperCase());
  if (!report) notFound();

  const { vehicle, score, accidents, owners, mileage, recalls, floodDamage, totalLoss, dataSource } = report;

  const summaryCards = [
    {
      icon: ShieldAlert,
      label: '사고 이력',
      value: `${accidents.length}회`,
      status: accidents.length === 0 ? 'good' : accidents.length === 1 ? 'warn' : 'bad',
    },
    {
      icon: Users,
      label: '소유자',
      value: `${owners.length}명`,
      status: owners.length <= 2 ? 'good' : 'warn',
    },
    {
      icon: Gauge,
      label: '주행거리',
      value: mileage.length > 0 ? `${mileage[mileage.length - 1].mileage.toLocaleString()}km` : '-',
      status: 'good',
    },
    {
      icon: FileSearch,
      label: '리콜',
      value: recalls.filter(r => !r.completed).length === 0 ? '없음' : `${recalls.filter(r => !r.completed).length}건`,
      status: recalls.filter(r => !r.completed).length === 0 ? 'good' : 'bad',
    },
  ];

  const statusColor = {
    good: 'text-emerald-700 bg-emerald-50',
    warn: 'text-amber-700 bg-amber-50',
    bad: 'text-red-700 bg-red-50',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        {/* Back + VIN */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 transition">
            <ArrowLeft className="w-4 h-4" />
            새 조회
          </Link>
          <span className="text-gray-300">|</span>
          <span className="font-mono text-sm text-gray-500">{vin}</span>
        </div>

        {/* Vehicle Info */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <SourceBadge source={dataSource} />
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{vehicle.trim} · {vehicle.engine} · {vehicle.fuel}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                <span>색상: <strong className="text-gray-700">{vehicle.color}</strong></span>
                <span>최초등록: <strong className="text-gray-700">{vehicle.firstRegistered}</strong></span>
              </div>
            </div>
          </div>

          {(floodDamage || totalLoss) && (
            <div className="mt-3 flex gap-2">
              {floodDamage && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> 침수 이력
                </span>
              )}
              {totalLoss && (
                <span className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> 전손 이력
                </span>
              )}
            </div>
          )}
        </section>

        {/* Score */}
        <ScoreGauge score={score} />

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summaryCards.map(({ icon: Icon, label, value, status }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <Icon className="w-5 h-5 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-lg font-bold px-2 py-0.5 rounded-lg inline-block ${statusColor[status as keyof typeof statusColor]}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Accident History */}
        <Section title="사고 이력" icon={ShieldAlert} badge={<SourceBadge source="mock" />}>
          {accidents.length === 0 ? (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">조회된 사고 이력이 없습니다.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400">
                    <th className="text-left pb-2">날짜</th>
                    <th className="text-left pb-2">유형</th>
                    <th className="text-left pb-2">수리 부위</th>
                    <th className="text-right pb-2">수리비 추정</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {accidents.map((a, i) => (
                    <tr key={i}>
                      <td className="py-2.5 text-gray-600 whitespace-nowrap">{a.date}</td>
                      <td className="py-2.5">
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{a.type}</span>
                      </td>
                      <td className="py-2.5 text-gray-600">{a.parts}</td>
                      <td className="py-2.5 text-right font-semibold text-gray-800">{a.estimatedCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* Mileage */}
        <Section title="주행거리 추이" icon={Gauge} badge={<SourceBadge source="mock" />}>
          <MileageChart records={mileage} />
        </Section>

        {/* Owner History */}
        <Section title="소유자 이력" icon={Users} badge={<SourceBadge source="mock" />}>
          <div className="space-y-3">
            {owners.map((o, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                  {o.order}
                </div>
                <div className="flex-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="text-gray-700 font-medium">
                    {o.from} — {o.to ?? '현재'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    o.type === '렌트' || o.type === '영업용'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {o.type}
                  </span>
                  <span className="text-xs text-gray-400">{o.region}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Recall */}
        <Section
          title="리콜 정보"
          icon={FileSearch}
          badge={<SourceBadge source={dataSource === 'nhtsa' ? 'nhtsa' : 'mock'} />}
        >
          {recalls.length === 0 ? (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">해당 차량에 적용되는 리콜이 없습니다.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {recalls.map((r) => (
                <div key={r.id} className={`rounded-lg border p-3 ${r.completed ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800">{r.title}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      r.completed ? 'bg-gray-200 text-gray-600' : 'bg-red-200 text-red-700'
                    }`}>
                      {r.completed ? '완료' : '미완료'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{r.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{r.date} · {r.id}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center pb-4">
          차량 기본정보·리콜은 NHTSA 실제 데이터 / 사고·소유자·주행거리는 Mock 데이터입니다.
        </p>
      </main>
    </div>
  );
}
