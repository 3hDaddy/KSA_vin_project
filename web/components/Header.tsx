import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          VIN Check
        </Link>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">MVP · Mock 데이터</span>
      </div>
    </header>
  );
}
