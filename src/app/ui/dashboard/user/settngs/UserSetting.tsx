'use client';

import { useLocalStorage } from '@/hooks/localStorage';
import { modalWindowStore, singleUserDataStore } from '@/store/adminDashboard';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export function UserSettings() {
  // ----- global states -----

  const session = useSession();
  const userId = session.data?.user.id;

  const { getSingleUserData } = singleUserDataStore();

  const { openSingleUser, openProfileOpenFromuUserOptions, toggleOpenInNewTab } =
    modalWindowStore();

  // ----- local states -----

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'profile' && userId) {
      getSingleUserData(userId.toString());
      openSingleUser();
      openProfileOpenFromuUserOptions();
    }
  };

  const [openInNewTab, setOpenInNewTab] = useLocalStorage('openInNewTab', false);

  useEffect(() => {
    toggleOpenInNewTab(openInNewTab);
  }, [openInNewTab, toggleOpenInNewTab]);

  return (
    <div className="w-[13.28125vw] h-fit flex flex-col py-[0.2vh] bg-[#FFF] rounded-[0.520833vw] shadow-crmFormShadow">
      <div className="w-fit h-[3vh] flex flex-row items-center pl-[1vw]">
        <input
          type="checkbox"
          name=""
          id=""
          className="w-[1.14375vw] h-[1.14375vw] accent-[#00A78B]"
          checked={openInNewTab}
          onChange={() => setOpenInNewTab(!openInNewTab)}
        />
        <p className="w-fit text-[1.65vh] font-medium leading-[2.440740vh] text-[#029B81] ml-[0.653646vw]">
          Open Link in a New Tab
        </p>
      </div>
      <button
        onClick={handleButton}
        data-identity="profile"
        className="w-full h-[6vh] text-[2vh] font-medium text-left leading-[2.440740vh] text-[#029B81] pl-[1vw] hover:bg-[#E6F6F3] transition-colors"
      >
        Profile
      </button>
      <button
        onClick={() => {
          signOut({ callbackUrl: '/' });
        }}
        className="w-full h-[6vh] text-[2vh] font-medium text-left leading-[2.440740vh] text-[#029B81] pl-[1vw] hover:bg-[#E6F6F3] transition-colors"
      >
        Log out
      </button>
    </div>
  );
}
