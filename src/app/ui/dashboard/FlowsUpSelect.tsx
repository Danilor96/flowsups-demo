import { modalWindowStore } from '@/store/adminDashboard';
import { motion } from 'framer-motion';

export function FlowsUpSelect() {
  // ---- global state ----
  const { openCustomerList } = modalWindowStore();

  const handleOpenCustomerList = () => {
    openCustomerList();
  };

  return (
    <aside className="ml-[3vw] mt-4 w-fit h-fit">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpenCustomerList}
        type="button"
        name=""
        id=""
        className="w-[8.645833vw] h-[5.277778vh] rounded-[1.302083vw] text-[1.481481vh] font-medium leading-[2.222222vh] text-[#00A78B] border-[0.104166vw] bg-[#C9EBE6]"
      >
        Customer List
      </motion.button>
    </aside>
  );
}
