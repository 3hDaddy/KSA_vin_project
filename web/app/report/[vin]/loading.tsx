import Header from '@/components/Header';

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} style={style} />;
}

export default function ReportLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto w-full px-4 py-6 space-y-4">
        {/* back nav */}
        <Skeleton className="h-4 w-24" />

        {/* vehicle card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <div className="flex gap-3">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-52" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>

        {/* score gauge */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-6">
          <Skeleton className="w-[124px] h-[124px] rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-48" />
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        </div>

        {/* summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 text-center">
              <Skeleton className="w-5 h-5 rounded mx-auto" />
              <Skeleton className="h-3 w-12 mx-auto" />
              <Skeleton className="h-6 w-10 mx-auto" />
            </div>
          ))}
        </div>

        {/* sections */}
        {[160, 200, 130].map((h, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className={`h-[${h}px] w-full`} style={{ height: h }} />
          </div>
        ))}
      </main>
    </div>
  );
}
