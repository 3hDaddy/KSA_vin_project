import { getScoreGrade } from '@/lib/mockData';

export default function ScoreGauge({ score }: { score: number }) {
  const { label, color, bg, border } = getScoreGrade(score);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <div className={`flex items-center gap-5 rounded-xl border p-5 ${bg} ${border}`}>
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="40" cy="40" r={radius} fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${color}`}>
          {score}
        </span>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">종합 신뢰 점수</p>
        <p className={`text-2xl font-bold ${color}`}>{label}</p>
        <p className="text-xs text-gray-500 mt-1">
          {score >= 80 ? '특이사항 없는 우량 차량입니다.' :
           score >= 60 ? '경미한 사고 이력이 있으나 양호한 편입니다.' :
           score >= 40 ? '주의가 필요한 항목이 있습니다. 상세 확인 권장.' :
           '복수의 위험 요소가 발견되었습니다. 신중한 판단이 필요합니다.'}
        </p>
      </div>
    </div>
  );
}
