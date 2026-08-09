import { ThreeGreenDots } from '&/icons/Icons';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';

export function CustomerEmailIndicator({ width }: { width: number }) {
  // ----- global states -----

  const { singleClientTasks } = adminDashboardStore();

  const { openEmailModal } = modalWindowStore();

  // ----- local states -----

  return (
    <aside
      className="flex flex-row h-[5.277778vh]"
      style={{
        width: `${width}vw`,
      }}
    >
      <input
        type="text"
        name="clientName"
        id="clientName"
        value={singleClientTasks?.customer?.email || 'No customer email'}
        disabled
        className="w-[87%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
      />
      <button
        type="button"
        onClick={() => {
          if (singleClientTasks && singleClientTasks.customer && singleClientTasks.customer.email) {
            openEmailModal();
          }
        }}
        className="w-[13%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw] px-[0.15vw] py-[0.18vh]"
      >
        <ThreeGreenDots />
      </button>
    </aside>
  );
}
