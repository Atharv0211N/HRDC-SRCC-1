export default function PublicLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#0056D2]"></div>
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">Loading...</p>
    </div>
  );
}
