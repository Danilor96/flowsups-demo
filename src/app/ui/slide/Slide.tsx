import { AnimatePresence } from 'framer-motion';
import {
  FailNotification,
  SuccessNotification,
  ConfirmNotification,
} from '&/notifications/Notification';
import { messagesStore } from '@/store/adminDashboard';
import { useEffect } from 'react';

export function Slide({
  children,
  title,
  paddingTop,
  paddingInline,
  decisionMessage,
  loadingConfirmation,
  onDecision,
}: {
  children: React.ReactNode;
  title: string;
  paddingTop?: number;
  paddingInline?: number;
  decisionMessage?: string;
  loadingConfirmation?: boolean;
  onDecision?: (decision: boolean) => void;
}) {
  // ----- global state -----

  const { clearMessages, messages } = messagesStore();

  // ----- local state -----

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
      {/* modal window notifications messages */}
      <AnimatePresence>
        {messages.successMessage && <SuccessNotification apiMessage={messages.successMessage} />}
      </AnimatePresence>
      <AnimatePresence>
        {messages.serverError && <FailNotification apiMessage={messages.serverError} />}
      </AnimatePresence>
      <AnimatePresence>
        {decisionMessage && onDecision && (
          <ConfirmNotification
            notiMessage={decisionMessage}
            onDecision={onDecision}
            loading={loadingConfirmation}
          />
        )}
      </AnimatePresence>
      <h2 className="w-fit h-[5vh] mt-[1.203704vh] ml-[1.5vw] text-[3.333333vh] font-semibold text-[#01A087]">
        {title}
      </h2>
      <aside
        className="w-[84.270833vw] h-[68.425926vh] mt-[0.833333vh] rounded-[2.604167vw] bg-[#00A28A]"
        style={{
          paddingTop: `${paddingTop}vh`,
          paddingInline: paddingInline && `${paddingInline}vw`,
        }}
      >
        {children}
      </aside>
    </div>
  );
}
