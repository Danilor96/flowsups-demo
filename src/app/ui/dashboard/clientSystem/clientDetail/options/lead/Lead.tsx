import { adminDashboardStore, messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { LeadOptions } from './leadOptions/LeadOptions';
import { LeadHistory } from './leadHistory/LeadHistory';
import { leadsStore } from '@/store/leads';

export function Lead({
  closeAddNoteFromCAllHistory,
}: {
  closeAddNoteFromCAllHistory?: () => void;
}) {
  // ---- global states ----
  const { closeClientLead } = modalWindowStore();

  const { messages } = messagesStore();

  const setCheatCount = leadsStore((state) => state.setCheatCountForFetch);

  const { getClientDetailLead } = adminDashboardStore();

  useEffect(() => {
    getClientDetailLead().finally(() => setLoading(false));
  }, [getClientDetailLead]);

  // ---- local states ----

  const [loading, setLoading] = useState(true);

  function LeadHistoryTitle() {
    return (
      <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B] ml-[13vw]">
        Lead History
      </p>
    );
  }

  return (
    <ModalWindow
      top={0}
      bottom={0}
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
      minSizeFull
      positionFixed
      overflowYScroll
    >
      <ModalContainer width={82.8125} marginTop={4.5}>
        <ModalContainerTitle
          closeWindowFunction={() => {
            setCheatCount(0);

            if (closeAddNoteFromCAllHistory) closeAddNoteFromCAllHistory();

            closeClientLead();
          }}
          title="Lead"
          extraComponent={<LeadHistoryTitle />}
        />
        <ModalContent
          flexbox
          flexRow
          overflowVisible
          loading={loading}
          minHeight={61}
          alignItems="start"
        >
          <LeadOptions />
          <LeadHistory />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
