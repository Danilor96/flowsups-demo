import { Metadata } from 'next';
import { Navbar } from '&/dashboard/Navbar';
import { auth } from '@/auth';
import { IdleTimer } from '../ui/auth/idleTimer/IdleTimer';
import { DesktopOnlyBadge } from '&/dashboard/DesktopOnlyBadge';

export const metadata: Metadata = {
  description: 'Flowsups dashboard page',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const roleId = session?.user?.user_has[0]?.role_id;

  return (
    <main className="w-[100vw] h-[100vh] overflow-hidden max-lg:w-full max-lg:h-auto max-lg:min-h-screen max-lg:overflow-x-hidden max-lg:overflow-y-auto">
      <Navbar />
      <IdleTimer />
      <DesktopOnlyBadge />
      <div className="">{children}</div>
    </main>
  );
}
