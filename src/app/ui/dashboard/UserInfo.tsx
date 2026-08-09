/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import { DropMenu } from '&/icons/Icons';
// import { useEffect } from 'react';
import { UserSettings } from './user/settngs/UserSetting';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
// import { adminDashboardStore } from '@/store/adminDashboard';
import useUiHandler from '@/hooks/closeComponentsHandler';

export function UserInfo({ name, lastname }: { name: string; lastname: string }) {
  const { data: session } = useSession();

  // const userId = session?.user.id;

  const roleName = session?.user.user_has[0].role.role;
  const username = session?.user.username;

  // global states

  // const { userImage } = adminDashboardStore();
  // const { getUserImage } = adminDashboardStore();

  // useEffect(() => {
  //   if (userId) {
  //     getUserImage(userId.toString());
  //   }
  // }, [userId]);

  // local states

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const fullName = username ? username : `${name?.split(' ')[0]} ${lastname?.split(' ')[0]}`;

  return (
    <div ref={ref} className="relative w-fit h-[6.833333vh] flex flex-row items-center justify-between">
      <aside
        className="w-[12.552083vw] h-fit shadow-crmFormShadow rounded-[2.083333vw] flex flex-row items-center gap-[0.621354vw] cursor-pointer"
        onClick={toggleOpen}
      >
        <img
          width={55}
          height={55}
          src={`${session?.user.img ? session?.user.img : '/users/flowsups_default_avatar.png'}`}
          alt="Image of the user"
          className="w-[3.0411458vw] h-[6.9vh] object-contain object-center rounded-full"
        />
        <p className="flex flex-col justify-center w-fit">
          <span className="w-fit flex flex-row text-[1.94vh] text-[#B3B3B3] capitalize">
            {fullName}
            <span className="mt-[1vh] ml-[0.5vw]">
              <DropMenu />
            </span>
          </span>
          <span className="w-fit capitalize text-[1.94vh] text-[#9CCCFF]">{roleName}</span>
        </p>
      </aside>
      <AnimatePresence>
        {isOpen && (
          <motion.article className="absolute w-fit h-fit top-[8vh] right-0 flex justify-center z-10">
            {/* <LogoutButton /> */}
            <UserSettings />
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
}
