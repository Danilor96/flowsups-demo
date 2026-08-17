import { currentSectionStore, messagesStore } from '@/store/adminDashboard';
import { FlowsUpSelect } from '&/dashboard/FlowsUpSelect';
import { useEffect } from 'react';
import { FlowsupsContent } from '&/dashboard/flowsupsContent/FlowsupsContent';
import { AnimatePresence } from 'framer-motion';
import { FailNotification, SuccessNotification } from '@/app/ui/notifications/Notification';

export function FlowsUp() {
  // global states
  const { getCurrentSection } = currentSectionStore();

  useEffect(() => {
    getCurrentSection('Flowsup slide');
  }, [getCurrentSection]);

  const { messages, clearMessages } = messagesStore();

  // local states

  useEffect(() => {
    if (messages.successMessage || messages.serverError) {
      const timeoutMssg = setTimeout(() => {
        clearMessages();
      }, 4000);

      return () => clearTimeout(timeoutMssg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.serverError, messages.successMessage]);

  return (
    <div>
      <AnimatePresence>
        {messages.successMessage && <SuccessNotification apiMessage={messages.successMessage} />}
      </AnimatePresence>
      <AnimatePresence>
        {messages.serverError && <FailNotification apiMessage={messages.serverError} />}
      </AnimatePresence>
      <h2 className="w-fit h-[5vh] mt-[1.203704vh] ml-[1.5vw] text-[3.333333vh] font-semibold text-[#01A087] max-lg:h-auto max-lg:mt-2 max-lg:ml-4 max-lg:text-2xl">
        FlowsUps
      </h2>
      <div className="relative w-[84.270833vw] h-[68.425926vh] mt-[0.833333vh] rounded-[2.604167vw] bg-[#00A28A] pt-[0.003vh] shadow-crmFormShadow max-lg:w-full max-lg:h-auto max-lg:min-h-[55vh] max-lg:rounded-2xl max-lg:overflow-hidden">
        <FlowsUpSelect />
        <FlowsupsContent />
      </div>
    </div>
  );
}
