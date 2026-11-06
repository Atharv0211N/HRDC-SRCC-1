'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Application Error]:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900">
      <div className="text-center space-y-6 max-w-md px-4">
        <h2 className="text-2xl font-semibold text-slate-800 font-[family-name:var(--font-primary)]">Something went wrong!</h2>
        <p className="text-slate-600 text-sm">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        {error?.message && (
          <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 text-xs text-red-700 text-left font-mono break-all max-h-36 overflow-auto">
            <span className="font-semibold block mb-1">Error details:</span>
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-[10px] bg-[#0056D2] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Try again
          </button>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-[10px] border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
