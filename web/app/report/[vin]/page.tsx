import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildReport } from '@/lib/reportService';
import { getScoreGrade } from '@/lib/mockData';
import Header from '@/components/Header';
import ScoreGauge from '@/components/ScoreGauge';
import MileageChart from '@/components/MileageChart';
import {
  ArrowLeft, Car, ShieldAlert, Users, Gauge,
  FileSearch, AlertTriangle, CheckCircle2,
  Database, FlaskConical, AlertCircle,
} from 'lucide-react';

/* ── Source badge ── */
function SourceBadge({ source }: { source: 'nhtsa' | 'mock' }) {
  if (source === 'nhtsa') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
        <Database className="w-3 h-3" /> NHTSA
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
      <FlaskConical className="w-3 h-3" /> Mock
    </span>
  );
}

/* ── Section wrapper ── */
function Section({ title, icon: Icon, badge, children }: {
  title: string;
  icon: React.ElementType;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="flex items-center gap-2 font-semibold text-gray-800 mb-4 flex-wrap">
        <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
        {title}
        {badge}
      </h2>
      {children}
    </section>
  );
}

/* ── Risk banner ── */
function RiskBanner({ score, floodDamage, totalLoss, accidentCount, recallCount }: {
  score: number; floodDamage: boolean; totalLoss: boolean;
  accidentCount: number; recallCount: number;
}) {
  const risks: string[] = [];
  if (floodDamage) risks.push('침수 이력이 확인되었습니다');
  if (totalLoss) risks.push('전손 이력이 확인되었습니다');
  if (accidentCount >= 2) risks.push(`사고 이력이 ${accidentCount}회 확인되었습니다`);
  if (recallCount > 0) risks.push(`미완료 리콜 ${recallCount}건이 있습니다`);
  if (risks.length === 0 || score >= 60) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-red-700 mb-1">주의가 필요한 차량입니다</p>
        <ul className="text-xs text-red-600 space-y-0.5">
          {risks.map(r => <li key={r}>• {r}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* ── Owner timeline ── */
function OwnerTimeline({ owners }: { owners: import('@/lib/types').OwnerRecord[] }) {
  return (
    <div className="relative pl-4">
      {/* vertical line */}
      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gray-200" />

      <div className="space-y-4">
        {owners.map((o, i) => {
          const isLast = i === owners.length - 1;
          const isRental = o.type === '렌트' || o.type === '영업용';
          return (
            <div key={i} className="relative flex gap-3">
              {/* dot */}
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 z-10
                ${isLast
                  ? 'bg-emerald-500 border-emerald-500'
                  : isRental
                  ? 'bg-amber-400 border-amber-400'
                  : 'bg-white border-gray-400'}`}
              />
              <div className="flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    {o.order}번째 소유자
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${isRental ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                    {o.type}
                  </span>
                  {isLast && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      현재
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {o.from} — {o.to ?? '현재'} · {o.region}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Page ── */
export default async function ReportPage({ params }: { params: Promise<{ vin: string }> }) {
  const { vin } = await params;
  const report = await buildReport(vin.toUpperCase());
  if (!report) notFound();

  const { vehicle, score, accidents, owners, mileage, recalls, floodDamage, totalLoss, dataSource } = report;
  const uncompletedRecalls = recalls.filter(r => !r.completed);

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
      value: uncompletedRecalls.length === 0 ? '없음' : `${uncompletedRecalls.length}건`,
      status: uncompletedRecalls.length === 0 ? 'good' : 'bad',
    },
  ];

  const statusColor: Record<string, string> = {
    good: 'text-emerald-700 bg-emerald-50',
    warn: 'text-amber-700 bg-amber-50',
    bad: 'text-red-700 bg-red-50',
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        {/* Back + VIN */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 transition">
            <ArrowLeft className="w-4 h-4" />새 조회
          </Link>
          <span className="text-gray-300">|</span>
          <span className="font-mono text-xs text-gray-400 truncate">{vin}</span>
        </div>

        {/* Risk Banner */}
        <RiskBanner
          score={score}
          floodDamage={floodDamage}
          totalLoss={totalLoss}
          accidentCount={accidents.length}
          recallCount={uncompletedRecalls.length}
        />

        {/* Vehicle Info */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <SourceBadge source={dataSource} />
              </div>
              <p className="text-sm text-gray-500">{vehicle.trim} · {vehicle.engine} · {vehicle.fuel}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                <span className="text-xs text-gray-400">
                  색상 <strong className="text-gray-600 ml-1">{vehicle.color}</strong>
                </span>
                <span className="text-xs text-gray-400">
                  최초등록 <strong className="text-gray-600 ml-1">{vehicle.firstRegistered}</strong>
                </span>
              </div>
            </div>
          </div>

          {(floodDamage || totalLoss) && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              {floodDamage && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> 침수 이력
                </span>
              )}
              {totalLoss && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-1 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> 전손 이력
                </span>
              )}
            </div>
          )}
        </section>

        {/* Score Gauge */}
        <ScoreGauge
          score={score}
          accidentCount={accidents.length}
          recallCount={uncompletedRecalls.length}
          ownerCount={owners.length}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summaryCards.map(({ icon: Icon, label, value, status }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <Icon className="w-5 h-5 mx-auto mb-2 text-gray-400" />
              <p className="text-xs text-gray-400 mb-1.5">{label}</p>
              <p className={`text-base font-bold px-2 py-0.5 rounded-lg inline-block ${statusColor[status]}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Accident History */}
        <Section title="사고 이력" icon={ShieldAlert} badge={<SourceBadge source="mock" />}>
          {accidents.length === 0 ? (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">조회된 사고 이력이 없습니다.</span>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400">
                    <th className="text-left pb-2 px-1">날짜</th>
                    <th className="text-left pb-2 px-1">유형</th>
                    <th className="text-left pb-2 px-1">수리 부위</th>
                    <th className="text-right pb-2 px-1">수리비 추정</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {accidents.map((a, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2.5 px-1 text-gray-600 whitespace-nowrap">{a.date}</td>
                      <td className="py-2.5 px-1">
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          {a.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-1 text-gray-600">{a.parts}</td>
                      <td className="py-2.5 px-1 text-right font-semibold text-gray-800">{a.estimatedCost}</td>
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
          <OwnerTimeline owners={owners} />
        </Section>

        {/* Recall */}
        <Section
          title="리콜 정보"
          icon={FileSearch}
          badge={<SourceBadge source={dataSource === 'nhtsa' ? 'nhtsa' : 'mock'} />}
        >
          {recalls.length === 0 ? (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium">해당 차량에 적용되는 리콜이 없습니다.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {recalls.map((r) => (
                <div key={r.id} className={`rounded-lg border p-3.5 ${r.completed ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{r.title}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0
                      ${r.completed ? 'bg-gray-200 text-gray-600' : 'bg-red-200 text-red-700'}`}>
                      {r.completed ? '완료' : '미완료'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{r.description}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{r.date} · {r.id}</p>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center pb-6">
          차량 기본정보·리콜은 NHTSA 실데이터 / 사고·소유자·주행거리는 Mock 데이터입니다.
        </p>
      </main>
    </div>
  );
}
