'use client';

import { useActionState } from 'react';
import { authenticate } from '@/actions/auth';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4">
      <div className="relative mx-auto flex w-full max-w-[420px] flex-col space-y-4">
        <div className="flex h-20 w-full items-center justify-center rounded-lg bg-[#0056D2] p-3 shadow-sm">
          <h1 className="text-3xl font-bold text-white tracking-tight text-center font-['Plus_Jakarta_Sans']">
            HRDC SRCC
          </h1>
        </div>
        
        <form action={formAction} className="space-y-4 bg-white p-6 rounded-[14px] shadow-sm border border-[#E2E8F0]">
          <div className="flex-1 rounded-lg">
            <h2 className="mb-6 text-xl font-semibold text-[#0F172A] font-['Plus_Jakarta_Sans']">
              Admin Login
            </h2>
            <div className="w-full space-y-4">
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-[#475569]"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    className="block w-full rounded-[10px] border border-[#E2E8F0] py-2 px-3 text-sm outline-none placeholder:text-[#64748B] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-[#475569]"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    className="block w-full rounded-[10px] border border-[#E2E8F0] py-2 px-3 text-sm outline-none placeholder:text-[#64748B] focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] transition-colors"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>
            
            <button
              className="mt-6 w-full bg-[#0056D2] hover:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-[10px] transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              aria-disabled={isPending}
              disabled={isPending}
            >
              {isPending ? 'Authenticating...' : 'Log In'}
            </button>
            
            <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage && (
                <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
