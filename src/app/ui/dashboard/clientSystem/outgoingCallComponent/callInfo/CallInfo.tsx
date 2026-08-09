import { singleCLientDataStore } from '@/store/adminDashboard';
import { useTwilioStore } from '@/store/phoneDevice';
import { useEffect } from 'react';

export function CallInfo() {
  // ----- global states -----

  const { call, callTimingInterval, trasnferInProgressOrCompleted } = useTwilioStore();

  const { singleCLientData } = singleCLientDataStore();

  const { returnCallTimingWithFormat, resetCallTiming } = useTwilioStore();

  useEffect(() => {
    if (!call && callTimingInterval) {
      clearInterval(callTimingInterval);
      resetCallTiming();
    }
  }, [call, callTimingInterval, resetCallTiming]);

  // ----- local states -----

  return (
    <aside className="flex flex-col justify-center items-center gap-[5vh] w-full pt-[8.055556vh]">
      <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B]">{`${singleCLientData?.first_name} ${singleCLientData?.last_name}`}</p>
      <p className="w-fit text-[2.851852vh] font-normal leading-[1.805556vh] text-[#959595]">
        {returnCallTimingWithFormat()}
      </p>
      {trasnferInProgressOrCompleted && (
        <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B] animate-pulse">
          There is a transfer in progress
        </p>
      )}
    </aside>
  );
}
