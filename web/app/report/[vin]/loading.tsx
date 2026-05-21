import Header from '@/components/Header';

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />;
}

export default function ReportLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        {/* vehicle card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
        {/* score */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        {/* summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
              <Skeleton className="h-4 w-16 mx-auto" />
              <Skeleton className="h-6 w-8 mx-auto" />
            </div>
          ))}
        </div>
        {/* sections */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </main>
    </div>
  );
}
