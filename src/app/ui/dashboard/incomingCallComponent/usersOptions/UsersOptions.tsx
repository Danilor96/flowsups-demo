import { UserListSearch } from '@/app/ui/select/UserAssignmentSelector/UserListSearch';
import { adminDashboardStore } from '@/store/adminDashboard';
import { IncomingCall, useTwilioStore } from '@/store/phoneDevice';
import { useSocketStore } from '@/store/socketIo';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export function UsersOptions({
  bdcLastname,
  bdcName,
  salesRepLastname,
  salesRepName,
  bdcNum,
  salesRepNum,
  left,
  top,
  toggleOpenOptions,
  activeCall,
}: {
  activeCall?: IncomingCall;
  salesRepName: string;
  salesRepLastname: string;
  salesRepNum: string;
  bdcName: string;
  bdcLastname: string;
  bdcNum: string;
  top?: number;
  left?: number;
  toggleOpenOptions?: () => void;
}) {
  // ----- global states -----

  const {
    callIncoming,
    trasnferInProgressOrCompleted,
    callSid,
    incomingCallsArray,
    outgoingCall,
    call,
    resetCallTiming,
    setCallArray,
    setCurrentCall,
  } = useTwilioStore();

  const { conferenceTransfer, setTrasnferInProgressOrCompleted } = useTwilioStore();
  const bdcUsers = adminDashboardStore((state) => state.bdc);

  const { socket } = useSocketStore();
  const { updateDataWithSocket } = useSocketStore();

  // ----- local states -----

  const handleTransfer = async ({
    salesrepnum,
    bdcnum,
  }: {
    salesrepnum?: string;
    bdcnum?: string;
  }) => {
    console.log({ call, para: call?.parameters });

    if (!outgoingCall) {
      const incomingCallsArrayCopy = structuredClone(incomingCallsArray);
      const activeCallIndex = incomingCallsArrayCopy.findIndex((call) => call.isActive);
      const nextActiveCallIndex = incomingCallsArrayCopy.findIndex((call) => !call.isActive);
      const activeCall = incomingCallsArrayCopy[activeCallIndex];
      // const nextActiveCall = incomingCallsArrayCopy[nextActiveCallIndex];

      if (
        (salesrepnum || bdcnum) &&
        callIncoming &&
        activeCall?.conferenceSid &&
        activeCall?.conferenceName
      ) {
        // setTrasnferInProgressOrCompleted(true);
        // incomingCallsArrayCopy[activeCallIndex].transferInProgress = true;
        if (nextActiveCallIndex >= 0) {
          incomingCallsArrayCopy[nextActiveCallIndex].isActive = true;
        }
        incomingCallsArrayCopy[activeCallIndex].isActive = false;
        incomingCallsArrayCopy.splice(activeCallIndex, 1);
        setCallArray(incomingCallsArrayCopy);

        updateDataWithSocket('trasnferInProgress', undefined, {
          conferenceName: activeCall.conferenceName,
        });

        if (call && call.customParameters?.get('To') === activeCall.conferenceName) {
          console.log('transfer directo');
          await conferenceTransfer(
            activeCall.conferenceName,
            activeCall.conferenceSid,
            salesrepnum,
            bdcnum,
          );
          call?.disconnect();
          setCurrentCall(null);
          resetCallTiming();
          return;
        }

        socket?.emit(
          'call:answer',
          {
            conferenceName: activeCall.conferenceName,
            conferenceSid: activeCall.conferenceSid,
            userAuthEmail: '',
          },
          async (response: any) => {
            if (response.success) {
              //perimitida
              await conferenceTransfer(
                activeCall.conferenceName,
                activeCall.conferenceSid,
                salesrepnum,
                bdcnum,
              );
            }
            if (!response.success) {
              console.log('not available');
            }
          },
        );
      }
    }

    if (outgoingCall && callSid && (salesrepnum || bdcnum)) {
      try {
        setTrasnferInProgressOrCompleted(true);

        const formData = new FormData();

        if (salesrepnum) formData.append('sellerPhoneNumber', salesrepnum);

        if (bdcnum) formData.append('bdcPhoneNumber', bdcnum);

        const res = await fetch(`/api/callTransfer/${callSid}`, { method: 'POST', body: formData });

        const json = await res.json();

        setTrasnferInProgressOrCompleted(false);
      } catch (error) {
        setTrasnferInProgressOrCompleted(false);
      }
    }
  };

  const isClientRegistered = outgoingCall ? true : activeCall?.incomingCallIdentity?.id;
  console.log({ isClientRegistered , outgoingCall, activeCall , incomingCallIdentity: activeCall?.incomingCallIdentity })
  
  useEffect(() => {
    console.log({ outgoingCall })
  }, [outgoingCall])

  if (!isClientRegistered) {
    return (
      <div className="absolute flex flex-col top-full/ left-[106%] w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        <span className="px-4 mt-2 text-[2vh] font-semibold text-gray-600">BDC Transfer</span>
        <div>
          {bdcUsers && bdcUsers.length > 0 && (
            <UserListSearch
              users={bdcUsers}
              selectedIds={[]}
              toggleUser={() => {}}
              userOnClick={(user) => {
                handleTransfer({ bdcnum: user.mobile_phone || '' });
                toggleOpenOptions?.();
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.ul
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={toggleOpenOptions}
      className="absolute z-10"
      style={{
        left: left ? `${left}vw` : '14vw',
        top: top ? `${top}vh` : '-2vh',
      }}
    >
      <li className="mb-[2.5vh]">
        <button
          onClick={(e) => handleTransfer({ salesrepnum: salesRepNum })}
          data-salesrepnum={salesRepNum}
          disabled={trasnferInProgressOrCompleted}
          className="w-fit h-fit flex justify-center items-center px-[0.5vw] py-[0.8vh] border-[1px] border-indigo-500 bg-white shadow-crmFormShadow rounded-[0.3vw] hover:bg-indigo-500 hover:text-white transition-colors ease-in-out group"
        >
          <p className="w-fit h-fit text-[1.8vh] text-gray-700 group-hover:text-white transition-colors ease-in-out text-nowrap">
            <span className="text-[#00A78B] group-hover:text-white transition-colors ease-in-out">
              Sales rep:
            </span>
            {` ${salesRepName} ${salesRepLastname}`}
          </p>
        </button>
      </li>
      <li>
        <button
          onClick={(e) => handleTransfer({ bdcnum: bdcNum })}
          data-bdcnum={bdcNum}
          disabled={trasnferInProgressOrCompleted}
          className="w-fit h-fit flex justify-center items-center px-[0.5vw] py-[0.8vh] border-[1px] border-indigo-500 bg-white shadow-crmFormShadow rounded-[0.3vw] hover:bg-indigo-500 hover:text-white transition-colors ease-in-out group"
        >
          <p className="w-fit h-fit text-[1.8vh] text-gray-700 group-hover:text-white transition-colors ease-in-out text-nowrap">
            <span className="text-[#00A78B] group-hover:text-white transition-colors ease-in-out">
              Bdc:
            </span>
            {` ${bdcName} ${bdcLastname}`}
          </p>
        </button>
      </li>
    </motion.ul>
  );
}
