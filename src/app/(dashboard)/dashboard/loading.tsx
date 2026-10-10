export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="h-4 w-24 bg-slate-200 rounded mb-4 animate-pulse"></div>
            <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
      
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 w-full bg-slate-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
