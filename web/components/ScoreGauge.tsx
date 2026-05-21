'use client';

import { useEffect, useRef } from 'react';
import { getScoreGrade } from '@/lib/mockData';

interface BreakdownItem {
  label: string;
  value: number; // 0–100
  color: string;
}

function BreakdownBar({ label, value, color }: BreakdownItem) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-6 text-right text-gray-400">{value}</span>
    </div>
  );
}

export default function ScoreGauge({
  score,
  accidentCount,
  recallCount,
  ownerCount,
}: {
  score: number;
  accidentCount: number;
  recallCount: number;
  ownerCount: number;
}) {
  const { label, color, bg, border } = getScoreGrade(score);

  const R = 52;
  const STROKE = 10;
  const SIZE = (R + STROKE) * 2 + 4;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const circumference = 2 * Math.PI * R;

  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    const target = circumference * (1 - score / 100);
    el.style.transition = 'none';
    el.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)';
        el.style.strokeDashoffset = String(target);
      });
    });
  }, [score, circumference]);

  const breakdown: BreakdownItem[] = [
    {
      label: '사고 이력',
      value: Math.max(0, 100 - accidentCount * 25),
      color: accidentCount === 0 ? 'bg-emerald-400' : accidentCount === 1 ? 'bg-amber-400' : 'bg-red-400',
    },
    {
      label: '소유자',
      value: Math.max(0, 100 - (ownerCount - 1) * 20),
      color: ownerCount <= 2 ? 'bg-emerald-400' : 'bg-amber-400',
    },
    {
      label: '리콜',
      value: Math.max(0, 100 - recallCount * 25),
      color: recallCount === 0 ? 'bg-emerald-400' : 'bg-red-400',
    },
  ];

  return (
    <div className={`rounded-xl border p-5 ${bg} ${border}`}>
      <div className="flex items-center gap-6">
        {/* Gauge */}
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} className="-rotate-90">
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={STROKE}
            />
            <circle
              ref={circleRef}
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              className={color}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold leading-none ${color}`}>{score}</span>
            <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
          </div>
        </div>

        {/* Grade + Breakdown */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-0.5">종합 신뢰 점수</p>
          <p className={`text-2xl font-bold mb-1 ${color}`}>{label}</p>
          <p className="text-xs text-gray-500 mb-3">
            {score >= 80 ? '특이사항 없는 우량 차량입니다.' :
             score >= 60 ? '경미한 사고 이력이 있으나 양호한 편입니다.' :
             score >= 40 ? '주의가 필요한 항목이 있습니다. 상세 확인을 권장합니다.' :
             '복수의 위험 요소가 발견되었습니다. 신중한 판단이 필요합니다.'}
          </p>
          <div className="space-y-1.5">
            {breakdown.map(b => <BreakdownBar key={b.label} {...b} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
