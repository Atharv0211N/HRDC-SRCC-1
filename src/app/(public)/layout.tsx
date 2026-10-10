import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';
import { prisma } from '@/lib/prisma';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.siteSettings.findFirst();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar recruitmentOpen={settings?.recruitmentOpen ?? false} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
