import Image from 'next/image';
import { UserInfo } from './UserInfo';
import { auth } from '@/auth';
import { NavbarInformation } from '&/dashboard/NavbarInformation';
import { Notifications } from './notifications/Notifications';
import { MobileNavbar } from './MobileNavbar';

export async function Navbar() {
  const session = await auth();
  const roleId = session?.user?.user_has[0]?.role_id || 0;

  const name = session?.user?.name || '';
  const lastname = session?.user?.last_name || '';

  return (
    <nav className="none flex flex-row justify-center items-center gap-[1vw] w-screen pt-[4.259259vh] max-lg:w-full max-lg:pt-3 max-lg:px-3 max-lg:justify-between">
      <article>
        <Image
          className="w-[11.41vw] h-auto max-lg:w-28"
          width={219}
          height={52}
          src="/flowsups.png"
          alt="Logo of flowsups app"
        />
      </article>
      <aside className="w-[66.09375vw] h-[7.481481vh] px-[0.4vw] flex flex-row items-center justify-center bg-[#C9EBE6] gap-[0.729167vw] rounded-[2.083333vw] max-lg:hidden">
        <NavbarInformation roleId={roleId} />
      </aside>
      <div className="lg-only flex flex-row items-center gap-[1vw]">
        <Notifications />
        <UserInfo name={name} lastname={lastname} />
      </div>
      <MobileNavbar name={name} lastname={lastname} roleId={roleId} />
    </nav>
  );
}
