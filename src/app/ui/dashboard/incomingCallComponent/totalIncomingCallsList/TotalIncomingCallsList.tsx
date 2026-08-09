import { useTwilioStore } from '@/store/phoneDevice';
import { List } from './list/List';

export function TotalIncomingCallsList() {
  // ----- global states -----

  const { incomingCallsArray } = useTwilioStore();

  // ----- local states -----

  return (
    <div className="bg-white dark:bg-slate-900">
      <ul className="divide-y divide-slate-200 pt-[1vh] overflow-y-auto h-[35vh]">
        {/* <div className="flex items-center justify-between px-8 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Maria Garcia</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">(305) 555-0129</span>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
              <span className="material-symbols-outlined text-xl">call</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-8 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Robert Chen</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">(415) 555-2348</span>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
              <span className="material-symbols-outlined text-xl">call</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div> */}
        {incomingCallsArray.filter(callInfo => !callInfo.isActive).length > 0 &&
          incomingCallsArray
            .filter(callInfo => !callInfo.isActive)
            .map((conferenceInfo, index) => {
              return (
                <List
                  key={`$$${index * 13}--=${conferenceInfo.conferenceSid}`}
                  conferenceSid={conferenceInfo.conferenceSid}
                  conferenceName={conferenceInfo.conferenceName}
                  phoneNumber={conferenceInfo.phoneNumber}
                  firstName={conferenceInfo?.incomingCallIdentity?.first_name}
                  lastName={conferenceInfo?.incomingCallIdentity?.last_name}
                  salesNumber={conferenceInfo.incomingCallIdentity?.seller?.mobile_phone}
                  bdcNumber={conferenceInfo.incomingCallIdentity?.bdc?.mobile_phone}
                />
              );
            })}
      </ul>
    </div>
  );
}
