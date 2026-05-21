import { MileageRecord } from '@/lib/types';

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i - 1][0] + pts[i][0]) / 2;
    d += ` C ${cpx},${pts[i - 1][1]} ${cpx},${pts[i][1]} ${pts[i][0]},${pts[i][1]}`;
  }
  return d;
}

function smoothArea(pts: [number, number][], baseY: number): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0]},${baseY} L ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = (pts[i - 1][0] + pts[i][0]) / 2;
    d += ` C ${cpx},${pts[i - 1][1]} ${cpx},${pts[i][1]} ${pts[i][0]},${pts[i][1]}`;
  }
  d += ` L ${pts[pts.length - 1][0]},${baseY} Z`;
  return d;
}

export default function MileageChart({ records }: { records: MileageRecord[] }) {
  if (records.length < 2) {
    return <p className="text-sm text-gray-400">주행거리 데이터가 부족합니다.</p>;
  }

  const W = 520, H = 200;
  const PAD = { top: 20, right: 24, bottom: 36, left: 60 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxMileage = Math.max(...records.map(r => r.mileage));
  const xStep = chartW / (records.length - 1);

  const toX = (i: number) => PAD.left + i * xStep;
  const toY = (m: number) => PAD.top + chartH - (m / maxMileage) * chartH;

  const pts: [number, number][] = records.map((r, i) => [toX(i), toY(r.mileage)]);

  // detect anomaly: mileage decrease between consecutive records
  const anomalySegs: number[] = [];
  for (let i = 1; i < records.length; i++) {
    if (records[i].mileage < records[i - 1].mileage) anomalySegs.push(i);
  }

  const GRID_LINES = 4;
  const yLabels = Array.from({ length: GRID_LINES + 1 }, (_, i) => {
    const v = (maxMileage / GRID_LINES) * i;
    return {
      y: toY(v),
      label: v === 0 ? '0' : v >= 10000 ? `${Math.round(v / 1000)}만` : `${Math.round(v / 1000)}천`,
    };
  });

  const lastRecord = records[records.length - 1];

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[300px]" style={{ maxHeight: 200 }}>
          <defs>
            <linearGradient id="mileageGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="anomalyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* grid lines */}
          {yLabels.map(({ y, label }) => (
            <g key={label}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 3" />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                {label}
              </text>
            </g>
          ))}

          {/* area */}
          <path d={smoothArea(pts, PAD.top + chartH)} fill="url(#mileageGrad)" />

          {/* anomaly segments */}
          {anomalySegs.map(i => {
            const segPts: [number, number][] = [pts[i - 1], pts[i]];
            return (
              <g key={i}>
                <path d={smoothArea(segPts, PAD.top + chartH)} fill="url(#anomalyGrad)" />
                <path d={smoothPath(segPts)} fill="none" stroke="#ef4444"
                  strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 3" />
              </g>
            );
          })}

          {/* main line */}
          <path d={smoothPath(pts)} fill="none" stroke="#10b981"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* dots */}
          {pts.map(([x, y], i) => {
            const isAnomaly = anomalySegs.includes(i);
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="5" fill="white"
                  stroke={isAnomaly ? '#ef4444' : '#10b981'} strokeWidth="2.5" />
                {/* mileage label on last point */}
                {i === pts.length - 1 && (
                  <text x={x} y={y - 10} textAnchor="end" fontSize="10"
                    fill="#10b981" fontWeight="600">
                    {lastRecord.mileage.toLocaleString()}km
                  </text>
                )}
              </g>
            );
          })}

          {/* x-axis date labels (show first, middle-ish, last) */}
          {records.map((r, i) => {
            const show = i === 0 || i === records.length - 1 || i === Math.floor(records.length / 2);
            if (!show) return null;
            return (
              <text key={i}
                x={toX(i)} y={H - 6}
                textAnchor={i === 0 ? 'start' : i === records.length - 1 ? 'end' : 'middle'}
                fontSize="10" fill="#6b7280">
                {r.date}
              </text>
            );
          })}

          {/* anomaly warning label */}
          {anomalySegs.map(i => (
            <text key={i} x={(pts[i - 1][0] + pts[i][0]) / 2}
              y={Math.min(pts[i - 1][1], pts[i][1]) - 8}
              textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="600">
              ⚠ 감소
            </text>
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
        <span>
          {anomalySegs.length > 0
            ? <span className="text-red-500 font-medium">⚠ 주행거리 감소 구간이 탐지되었습니다. 계기 조작 가능성을 확인하세요.</span>
            : '주행거리 이상 없음'}
        </span>
        <span>최종: <strong className="text-gray-600">{lastRecord.mileage.toLocaleString()}km</strong></span>
      </div>
    </div>
  );
}
