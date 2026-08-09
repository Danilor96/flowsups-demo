import { useTwilioStore } from '@/store/phoneDevice';
import { TotalIncomingCallsList } from '../totalIncomingCallsList/TotalIncomingCallsList';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { FilterIcon, NextPagIcon } from '@/app/ui/icons/Icons';

export function TotalIncomingCallsIndicator() {
  // ----- global states -----

  const { incomingCallsArray, outgoingCall } = useTwilioStore();

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div ref={ref} className="absolute/ bottom-0/ w-full">
      <div className="mt-6 pt-4 border-t w-full border-slate-100">
        <button
          className="w-full group flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all duration-200"
          onClick={toggleOpen}
        >
          <div className="flex items-center gap-3">
            {/* <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                  <span className="material-icons-outlined text-primary text-xl">{'<'}</span>
                </div> */}
            <span className="text-slate-600 font-medium">Total incoming calls</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center px-2.5 py-0.5 rounded-full bg-teal-500/10 text-[#0a646f] text-sm font-bold">
              {incomingCallsArray.length}
            </span>
            <span className="text-slate-400 group-hover:text-teal-700 transition-colors">
              <ArrowIcon rotate={isOpen ? -90 : 90} />
            </span>
          </div>
        </button>
      </div>
      {/* <button
        onClick={toggleOpen}
        className="w-fit flex justify-center items-center px-[0.3vw] rounded-bl-[0.012vw] bg-[#FFF] border-[0.12vw] border-[#00A78B]"
        disabled={
          incomingCallsArray.length > 1 || (outgoingCall && incomingCallsArray.length > 0)
            ? false
            : true
        }
      >
        <p className="text-[2vh] text-[#1b57ed]">
          <span className="text-[#00A78B]">{'Total incoming calls: '}</span>
          {incomingCallsArray.length}
        </p>
      </button> */}
      <aside className="relative">
        {isOpen && (incomingCallsArray.length > 1 || (outgoingCall && incomingCallsArray.length > 0)) && (
          <TotalIncomingCallsList />
        )}
      </aside>
    </div>
  );
}

const ArrowIcon = ({rotate}: {rotate: number}) => {
  return (
    <svg
      width="1.3vw"
      height="2vh"
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{rotate: `${rotate}deg`}}
    >
      <path d="M0.589844 10.58L5.16984 6L0.589844 1.41L1.99984 0L7.99984 6L1.99984 12L0.589844 10.58Z" fill="currentColor" />
    </svg>
  );
};