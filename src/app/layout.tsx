import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AnalyticsProvider } from '@/components/shared/analytics-provider';

export const metadata: Metadata = {
  title: {
    default: 'HRDC SRCC — Enable. Edify. Empower.',
    template: '%s | HRDC SRCC',
  },
  description:
    'The Human Resource Development Cell at Shri Ram College of Commerce — driving research, consulting, publications, and professional development since 2008.',
  keywords: [
    'HRDC',
    'SRCC',
    'Shri Ram College of Commerce',
    'Human Resource Development',
    'University of Delhi',
    'Student Organization',
    'Research',
    'Consulting',
    'Publications',
  ],
  authors: [{ name: 'HRDC SRCC' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'HRDC SRCC',
    title: 'HRDC SRCC — Enable. Edify. Empower.',
    description:
      'The Human Resource Development Cell at Shri Ram College of Commerce — driving research, consulting, publications, and professional development since 2008.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HRDC SRCC — Enable. Edify. Empower.',
    description:
      'The Human Resource Development Cell at Shri Ram College of Commerce — driving research, consulting, publications, and professional development since 2008.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0056D2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-[family-name:var(--font-primary)] antialiased">
        <div className="flex min-h-screen flex-col">
          {children}
          <AnalyticsProvider />
        </div>
      </body>
    </html>
  );
}
