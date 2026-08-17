'use client';

import {
  AddManagerTaskIcon,
  AddNewCarIcon,
  AddProspectIcon,
  Calculator,
  MarketingArrow,
  NewMarketingIcon,
  NutIcon,
  PrinterIcon,
  SearchLensGreen,
  SheetIcon,
} from '&/icons/Icons';
import { modalWindowStore } from '@/store/adminDashboard';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { IconedSelect } from '@/app/ui/select/iconedSelect/IconedSelect';
import { userActionStore } from '@/store/inventory';
import { DashboardSearch } from '&/dashboard/dashboardOptions/dashboardSearch/DashboardSearch';
import { Can } from '&/auth/Can';
import { useCan } from '@/hooks/permissions';

export function DashboardOptions() {
  // ---- global states ----
  const {
    openInventorySystem,
    openClientSystem,
    openWorkInProgress,
    openSettings,
    openAddManagerTask,
    openReports,
  } = modalWindowStore();

  const { setAddNewVehicle } = userActionStore();

  const { can } = useCan();

  const addSelectOptions = [
    can(29) ? { value: '1', name: 'Add Manager task', icon: <AddManagerTaskIcon /> } : {},
    can(30) ? { value: '2', name: 'Add Vehicle', icon: <AddNewCarIcon /> } : {},
    can(31) ? { value: '3', name: 'Add Prospect', icon: <AddProspectIcon /> } : {},
  ];

  // ---- local states ----
  const session = useSession();
  const name = session.data?.user.name;
  const lastname = session.data?.user.last_name;

  const [hoverPrint, setHoverPrint] = useState(false);
  const [hoverMarketing, setHoverMarketing] = useState(false);
  const [hoverSettings, setHoverSettings] = useState(false);
  const [hoverReports, setHoverReports] = useState(false);

  const handleAddSomething = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;

    if (value === '1') {
      openAddManagerTask();
    }

    if (value === '2') {
      setAddNewVehicle(true);
      openInventorySystem();
    }

    if (value === '3') {
      openClientSystem();
    }
  };

  return (
    <article className="w-[70.677083vw] h-[7.5vh] flex flex-row justify-end items-end gap-[1.041667vw] ml-[27.708333vw] mt-[2.037037vh] pr-[14vw] max-lg:w-full max-lg:h-auto max-lg:justify-center max-lg:items-center max-lg:flex-wrap max-lg:gap-2 max-lg:ml-0 max-lg:mt-3 max-lg:pr-0 max-lg:px-3">
      <DashboardSearch />
      {/* <motion.button
        initial={{
          width: '2.7vw',
        }}
        whileHover={{
          width: '6.979167vw',
        }}
        whileTap={{
          scale: 0.9,
        }}
        onHoverStart={() => setHoverPrint(true)}
        onHoverEnd={() => setHoverPrint(false)}
        onClick={openWorkInProgress}
        className="w-[2.7vw] h-[6.074074vh] rounded-[1.5vw] px-[0.885417vw] py-[0.925926vh] flex flex-row justify-center items-center gap-[0.520833vw] bg-[#00A78B]"
      >
        <motion.p
          animate={hoverPrint ? 'visible' : 'hidden'}
          variants={{
            visible: {
              position: 'static',
              opacity: 1,
            },
            hidden: {
              position: 'absolute',
              opacity: 0,
            },
          }}
          className="text-[2vh]  text-[#FFFFFF] opacity-0 absolute"
        >
          Print
        </motion.p>
        <PrinterIcon />
      </motion.button> */}
      {/* <motion.button
        initial={{
          width: '2.7vw',
        }}
        whileHover={{
          width: '9.583333vw',
        }}
        whileTap={{
          scale: 0.9,
        }}
        onHoverStart={() => setHoverMarketing(true)}
        onHoverEnd={() => setHoverMarketing(false)}
        onClick={openWorkInProgress}
        type="button"
        className="w-[2.7vw] h-[6.074074vh] rounded-[1.5vw] px-[0.885417vw] py-[0.925926vh] flex flex-row justify-center items-center gap-[0.520833vw] bg-[#00A78B]"
      >
        <motion.p
          animate={hoverMarketing ? 'visible' : 'hidden'}
          variants={{
            visible: {
              position: 'static',
              opacity: 1,
            },
            hidden: {
              position: 'absolute',
              opacity: 0,
            },
          }}
          className="text-[2vh] text-[#FFFFFF] opacity-0 absolute"
        >
          Marketing
        </motion.p>
        <NewMarketingIcon />
      </motion.button> */}
      <Can requiredPermission={27}>
        <motion.button
          initial={{
            width: '2.7vw',
          }}
          whileHover={{
            width: '9.583333vw',
          }}
          whileTap={{
            scale: 0.9,
          }}
          onHoverStart={() => setHoverSettings(true)}
          onHoverEnd={() => setHoverSettings(false)}
          onClick={openSettings}
          type="button"
          className="w-[2.7vw] h-[6.074074vh] px-[0.885417vw] py-[0.925926vh] flex flex-row gap-[0.520833vw] bg-[#00A78B] text-[#FFFFFF] justify-center items-center rounded-[1.5vw] text-[2vh] !max-lg:w-10 !max-lg:h-10 max-lg:gap-1 !max-lg:px-0 max-lg:text-sm"
        >
          <motion.p
            animate={hoverSettings ? 'visible' : 'hidden'}
            variants={{
              visible: {
                position: 'static',
                opacity: 1,
              },
              hidden: {
                position: 'absolute',
                opacity: 0,
              },
            }}
            className="opacity-0 absolute"
          >
            Settings
          </motion.p>
          <NutIcon />
        </motion.button>
      </Can>
      <Can requiredPermission={28}>
        <motion.button
          initial={{
            width: '2.7vw',
          }}
          whileHover={{
            width: '6.990104vw',
          }}
          whileTap={{
            scale: 0.9,
          }}
          onHoverStart={() => setHoverReports(true)}
          onHoverEnd={() => setHoverReports(false)}
          onClick={openReports}
          className="w-[2.7vw] h-[6.074074vh] rounded-[1.5vw] px-[0.885417vw] py-[0.925926vh] flex flex-row justify-center items-center gap-[0.520833vw] bg-[#00A78B] text-[#FFFFFF] text-[2vh] !max-lg:w-10 !max-lg:h-10 max-lg:gap-1 !max-lg:px-0 max-lg:text-sm"
        >
          <motion.p
            animate={hoverReports ? 'visible' : 'hidden'}
            variants={{
              visible: {
                position: 'static',
                opacity: 1,
              },
              hidden: {
                position: 'absolute',
                opacity: 0,
              },
            }}
            className="opacity-0 absolute"
          >
            Reports
          </motion.p>
          <SheetIcon />
        </motion.button>
      </Can>
      {/* add function select */}
      <Can requiredPermission={[29, 30, 31]}>
        <IconedSelect
          width={8.125}
          height={6.074074}
          border={0.104167}
          borderColor="#00A78B"
          borderRadius={1.302083}
          backgroundColor="#FFF"
          defaultText="Add"
          textColor="#00A78B"
          optionsWidth={11.5}
          optionsHeight={4.907407}
          iconTextGap={0.3125}
          optionsRadius={0.5}
          optionsBackgroundColor="#FFF"
          optionsNameColor="#00A78B"
          optionsRight={-1.8}
          options={addSelectOptions.filter((el) => el.name)}
          onClick={handleAddSomething}
        />
      </Can>
      {/* <select
        name=""
        id=""
        defaultValue=""
        onChange={handleChangeUser}
        className="w-[13.489583vw] h-[6.074074vh] rounded-[1.5vw] px-[0.885417vw] border-[0.104167vw] border-[#00A78B] text-[#00A78B] bg-[#C9EBE6] text-[2vh]"
      >
        <option value="">
          {name} {lastname}
        </option>
        <option value={1}>1</option>
        <option value={2}>2</option>
      </select> */}
    </article>
  );
}
