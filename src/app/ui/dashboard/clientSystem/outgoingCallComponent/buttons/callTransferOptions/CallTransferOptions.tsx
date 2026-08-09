import { singleCLientDataStore } from '@/store/adminDashboard';
import { useTwilioStore } from '@/store/phoneDevice';

export function CallTransferOptions({ toggleOpen }: { toggleOpen: () => void }) {
  // ----- global states -----

  const { call, callSid } = useTwilioStore();
  const { setTrasnferInProgressOrCompleted } = useTwilioStore();

  const { singleCLientData } = singleCLientDataStore();

  // ----- local states -----

  const handleTransfer = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (call) {
      try {
        setTrasnferInProgressOrCompleted(true);

        const formData = new FormData();

        if (
          identity === 'sales' &&
          singleCLientData?.seller &&
          singleCLientData.seller?.mobile_phone
        ) {
          formData.append('sellerPhoneNumber', singleCLientData.seller.mobile_phone);
        }

        if (identity === 'bdc' && singleCLientData?.bdc && singleCLientData.bdc?.mobile_phone) {
          formData.append('bdcPhoneNumber', singleCLientData.bdc.mobile_phone);
        }

        const res = await fetch(`/api/callTransfer/${callSid}`, { method: 'POST', body: formData });

        const json = await res.json();

        setTrasnferInProgressOrCompleted(false);

        toggleOpen();
      } catch (error) {
        setTrasnferInProgressOrCompleted(false);
      }
    }
  };

  return (
    <div className="absolute left-[5.5vw] w-fit flex flex-col justify-start items-start gap-[2.5vh]">
      <button
        onClick={handleTransfer}
        className="px-[0.5vw] py-[0.8vh] border-[1px] border-indigo-500 bg-white shadow-crmFormShadow rounded-[0.3vw] hover:bg-indigo-500 hover:text-white transition-colors ease-in-out group"
        data-identity="sales"
      >
        <p className="w-fit h-fit text-[1.8vh] text-gray-700 group-hover:text-white transition-colors ease-in-out text-nowrap">
          <span className="text-[#00A78B] group-hover:text-white transition-colors ease-in-out">
            Sales rep:
          </span>
          {singleCLientData?.seller &&
            ` ${singleCLientData?.seller?.name} ${singleCLientData.seller.last_name}`}
        </p>
      </button>
      <button
        onClick={handleTransfer}
        className="px-[0.5vw] py-[0.8vh] border-[1px] border-indigo-500 bg-white shadow-crmFormShadow rounded-[0.3vw] hover:bg-indigo-500 hover:text-white transition-colors ease-in-out group"
        data-identity="bdc"
      >
        <p className="w-fit h-fit text-[1.8vh] text-gray-700 group-hover:text-white transition-colors ease-in-out text-nowrap">
          <span className="text-[#00A78B] group-hover:text-white transition-colors ease-in-out">
            Bdc:
          </span>
        </p>
      </button>
    </div>
  );
}
