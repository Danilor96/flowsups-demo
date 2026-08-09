import { VerticalThreeDots, XIcon } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { adminDashboardStore } from '@/store/adminDashboard';
import { motion } from 'framer-motion';
import { Options } from './options/Options';

export function HandleCustomersList() {
  // ----- global states -----

  const { setSelectedCustomersIds } = adminDashboardStore();

  // ----- local states -----

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    switch (identity) {
      case 'clean':
        setSelectedCustomersIds([]);
        break;

      case 'options':
        toggleOpen();
        break;
    }
  };

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <aside
      ref={ref}
      className="relative w-[10%] flex flex-row justify-end items-center gap-[0.3vw]"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        data-identity="clean"
        className="w-[40%] h-[6vh] flex justify-center items-center shadow-crmFormShadow rounded"
        onClick={handleButton}
      >
        <XIcon />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        data-identity="options"
        className="w-[40%] h-[6vh] flex justify-center items-center shadow-crmFormShadow rounded"
        onClick={handleButton}
      >
        <VerticalThreeDots color="#00a78b" />
      </motion.button>
      {isOpen && <Options />}
    </aside>
  );
}
