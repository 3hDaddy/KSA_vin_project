import Link from 'next/link';
import Header from '@/components/Header';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">VIN을 찾을 수 없습니다</h1>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          입력하신 차대번호에 해당하는 차량 정보가 없습니다.<br />
          차량등록증에서 17자리 VIN을 다시 확인해주세요.
        </p>
        <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3 mb-6 text-left max-w-sm w-full">
          <p className="font-semibold text-gray-600 mb-2">가능한 원인</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>차대번호 오기입</li>
            <li>국내 미등록 차량</li>
            <li>데이터 갱신 지연 (신규 등록 24시간 이내)</li>
          </ul>
        </div>
        <Link
          href="/"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition"
        >
          다시 입력하기
        </Link>
      </main>
    </div>
  );
}
