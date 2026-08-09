import { SmsIcon } from '&/icons/Icons';
import {
  adminDashboardStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';

export function CustomerContactIndicator({ width }: { width: number }) {
  // ----- global states -----

  const { getSingleClientData } = singleCLientDataStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { singleClientTasks } = adminDashboardStore();

  const { openSmsModal } = modalWindowStore();

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
        value={
          formatPhoneNumber(singleClientTasks?.customer?.mobile_phone || '') ||
          'No customer mobile phone'
        }
        disabled
        className="w-[87%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
      />
      <button
        type="button"
        onClick={() => {
          if (
            singleClientTasks &&
            singleClientTasks.customer &&
            singleClientTasks.customer.mobile_phone &&
            singleClientTasks.customer_id
          ) {
            getSingleClientData(singleClientTasks.customer_id.toString());

            openSmsModal();
          }
        }}
        className="w-[13%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw] px-[0.15vw] py-[0.18vh]"
      >
        <SmsIcon />
      </button>
    </aside>
  );
}
