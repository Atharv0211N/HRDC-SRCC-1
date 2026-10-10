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
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-slate-900">
      <div className="text-center space-y-6 max-w-md px-4">
        <h2 className="text-2xl font-semibold text-slate-800 font-[family-name:var(--font-primary)]">Something went wrong!</h2>
        <p className="text-slate-600">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-[#0056D2] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
