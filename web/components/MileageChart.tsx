import { MileageRecord } from '@/lib/types';

export default function MileageChart({ records }: { records: MileageRecord[] }) {
  if (records.length < 2) return <p className="text-sm text-gray-400">주행거리 데이터가 부족합니다.</p>;

  const W = 480, H = 160, PAD = { top: 16, right: 16, bottom: 32, left: 56 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxMileage = Math.max(...records.map(r => r.mileage));
  const xStep = chartW / (records.length - 1);

  const toX = (i: number) => PAD.left + i * xStep;
  const toY = (m: number) => PAD.top + chartH - (m / maxMileage) * chartH;

  const points = records.map((r, i) => `${toX(i)},${toY(r.mileage)}`).join(' ');
  const area = `${PAD.left},${PAD.top + chartH} ${points} ${toX(records.length - 1)},${PAD.top + chartH}`;

  const yLabels = [0, maxMileage * 0.5, maxMileage].map(v => ({
    y: toY(v),
    label: v >= 10000 ? `${Math.round(v / 1000)}만` : `${v}`,
  }));

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[280px]" style={{ maxHeight: 160 }}>
        {/* grid */}
        {yLabels.map(({ y, label }) => (
          <g key={label}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{label}</text>
          </g>
        ))}
        {/* area fill */}
        <polygon points={area} fill="#d1fae5" opacity="0.6" />
        {/* line */}
        <polyline points={points} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
        {/* dots + labels */}
        {records.map((r, i) => (
          <g key={i}>
            <circle cx={toX(i)} cy={toY(r.mileage)} r="4" fill="#10b981" />
            <text
              x={toX(i)} y={H - 6}
              textAnchor={i === 0 ? 'start' : i === records.length - 1 ? 'end' : 'middle'}
              fontSize="9" fill="#6b7280"
            >
              {r.date.slice(0, 7)}
            </text>
          </g>
        ))}
      </svg>
      <p className="text-xs text-gray-400 mt-1">
        최종 기록: <span className="font-semibold text-gray-600">{records[records.length - 1].mileage.toLocaleString()}km</span>
      </p>
    </div>
  );
}
