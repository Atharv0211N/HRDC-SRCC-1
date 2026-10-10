import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900">
      <div className="text-center space-y-6 max-w-md px-4">
        <h1 className="text-6xl font-bold text-[#0056D2] font-[family-name:var(--font-primary)]">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800">Page Not Found</h2>
        <p className="text-slate-600">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="pt-4">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md bg-[#0056D2] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
