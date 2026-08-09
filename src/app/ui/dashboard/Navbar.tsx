import Image from 'next/image';
import { UserInfo } from './UserInfo';
import { auth } from '@/auth';
import { NavbarInformation } from '&/dashboard/NavbarInformation';
import { Notifications } from './notifications/Notifications';

export async function Navbar() {
  const session = await auth();
  const roleId = session?.user?.user_has[0]?.role_id || 0;

  const name = session?.user?.name || '';
  const lastname = session?.user?.last_name || '';

  return (
    <nav className="none flex flex-row justify-center items-center gap-[1vw] w-screen pt-[4.259259vh]">
      <article>
        <Image
          className="w-[11.41vw] h-auto"
          width={219}
          height={52}
          src="/flowsups.png"
          alt="Logo of flowsups app"
        />
      </article>
      <aside className="w-[66.09375vw] h-[7.481481vh] px-[0.4vw] flex flex-row items-center justify-center bg-[#C9EBE6] gap-[0.729167vw] rounded-[2.083333vw]">
        <NavbarInformation roleId={roleId} />
      </aside>
      <Notifications />
      <UserInfo name={name} lastname={lastname} />
    </nav>
  );
}
