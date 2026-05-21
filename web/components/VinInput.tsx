'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function VinInput() {
  const [vin, setVin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function validate(value: string) {
    if (!value) return 'VIN을 입력해주세요.';
    if (value.length !== 17) return `VIN은 17자리입니다. (현재 ${value.length}자리)`;
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(value)) return 'VIN에 사용할 수 없는 문자가 포함되어 있습니다.';
    return '';
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = vin.trim().toUpperCase();
    const err = validate(trimmed);
    if (err) { setError(err); return; }
    router.push(`/report/${trimmed}`);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/gi, '').slice(0, 17);
    setVin(val);
    if (error) setError(validate(val));
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={vin}
            onChange={handleChange}
            placeholder="VIN 17자리 입력 (예: KMHXX00000X123456)"
            maxLength={17}
            className={`w-full h-12 px-4 pr-12 rounded-xl border text-sm font-mono tracking-widest outline-none transition
              ${error
                ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                : 'border-gray-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
              }`}
            autoComplete="off"
            spellCheck={false}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 tabular-nums">
            {vin.length}/17
          </span>
        </div>
        <button
          type="submit"
          className="h-12 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition whitespace-nowrap"
        >
          <Search className="w-4 h-4" />
          조회
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
