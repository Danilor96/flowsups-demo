import useUiHandler from '@/hooks/closeComponentsHandler';
import { useTwilioStore } from '@/store/phoneDevice';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { TransferBtn } from '../transferBtn/TransferBtn';
import { UserListSearch } from '@/app/ui/select/UserAssignmentSelector/UserListSearch';
import { adminDashboardStore, messagesStore } from '@/store/adminDashboard';
import { useState } from 'react';
import { useFloating, offset, flip, shift, autoUpdate, FloatingPortal, useClick, useDismiss, useInteractions } from '@floating-ui/react';

export function List({
  conferenceSid,
  conferenceName,
  phoneNumber,
  firstName,
  lastName,
  salesNumber,
  bdcNumber,
}: {
  conferenceSid: string;
  conferenceName: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  salesNumber?: string | null;
  bdcNumber?: string | null;
}) {
  // ----- global states ----
  const { call } = useTwilioStore();

  const { setTrasnferInProgressOrCompleted, setActiveCall, transferNoAnsweredConference } = useTwilioStore();
  
  const { formatPhoneNumber } = phoneNumbersFormatStore();
  const bdcUsers = adminDashboardStore((state) => state.bdc);

  // ----- local states -----

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setMessages } = messagesStore();

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: 'right-start',
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePress: (event) => {
      const target = event.target as Element;
      if (refs.floating.current?.contains(target)) {
        return false;
      }
      return true;
    },
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const handleReferenceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleButtonTransfer = async (bdcNumber?: string | null) => {
    setLoading(true);

    try {
      if (bdcNumber) {
        await transferNoAnsweredConference(conferenceName, conferenceSid, undefined, bdcNumber);
      }
    } catch (error) {
      setMessages('An error occurred');
    }

    setLoading(false);
  };

  const hasRepAssigned = bdcNumber || salesNumber;

  return (
    <li className="relative w-full">
      <div>
        <div
          ref={refs.setReference}
          {...getReferenceProps({
            onClick: handleReferenceClick,
          })}
          className="flex w-full items-center justify-between px-[1vh] py-[1vh] hover:bg-slate-50 transition-colors cursor-pointer"
          data-conferencesid={conferenceSid}
        >
          <div className="flex flex-col">
            <span className="font-semibold text-slate-600">{`${firstName || 'Unknow'} ${lastName || ''}`}</span>
            <span className="text-sm text-slate-500">{formatPhoneNumber(phoneNumber)}</span>
          </div>
          {/* <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors">
              <span className="material-symbols-outlined text-xl">call</span>
            </button>
            <button className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div> */}
        </div>
        {isOpen && hasRepAssigned && (
          <TransferBtn
            conferenceSid={conferenceSid}
            conferenceName={conferenceName}
            bdcNumber={bdcNumber}
            salesNumber={salesNumber}
            toggleOpen={() => setIsOpen(false)}
          />
        )}
        {isOpen && !hasRepAssigned && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, width: '20vw' }}
              {...getFloatingProps({
                onMouseDown: (e) => e.stopPropagation(),
                onClick: (e) => e.stopPropagation(),
              })}
              className="flex flex-col bg-white rounded-xl shadow-xl border border-slate-100 z-[2000] overflow-hidden"
            >
              <span className="px-4 mt-2 text-[2vh] font-semibold text-gray-600">BDC Transfer</span>
              <div>
                {bdcUsers && bdcUsers.length > 0 && (
                  <UserListSearch
                    users={bdcUsers}
                    selectedIds={[]}
                    toggleUser={() => {}}
                    userOnClick={user => {
                      handleButtonTransfer(user.mobile_phone);
                      setIsOpen(false);
                    }}
                  />
                )}
              </div>
            </div>
          </FloatingPortal>
        )}
      </div>
    </li>
  );
}
