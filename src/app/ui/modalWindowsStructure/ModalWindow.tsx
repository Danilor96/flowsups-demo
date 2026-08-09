import { AnimatePresence, motion } from 'framer-motion';
import { FailNotification, SuccessNotification } from '&/notifications/Notification';
import { useEffect } from 'react';
import { messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { useElementScrollPosition } from '@/hooks/scrollHandler';

export function ModalWindow({
  children,
  top,
  bottom,
  right,
  left,
  zIndex,
  failMessage,
  successMessage,
  minSizeFull,
  positionFixed,
  overflowYScroll,
  height,
  fullScreen,
}: {
  children: React.ReactNode;
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
  zIndex?: number;
  successMessage?: string;
  failMessage?: string;
  minSizeFull?: boolean;
  positionFixed?: boolean;
  overflowYScroll?: boolean;
  height?: number;
  fullScreen?: boolean;
}) {
  const { messages } = messagesStore();
  const { clearMessages } = messagesStore();
  const { setCurrentScrollTop } = modalWindowStore();

  useEffect(() => {
    if (messages.successMessage || messages.serverError) {
      const timeoutMssg = setTimeout(() => {
        clearMessages();
      }, 4000);

      return () => clearTimeout(timeoutMssg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.serverError, messages.successMessage]);

  const { elementRef, scrollPosition } = useElementScrollPosition();

  useEffect(() => {
    setCurrentScrollTop(scrollPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  return (
    <motion.section
      ref={elementRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="right-0 left-0 bg-[#0000008A]"
      style={{
        // position: positionFixed ? 'fixed' : 'absolute',
        position: 'fixed',
        // top: `${top}vh`,
        top: `0vh`,
        bottom: `${bottom}vh`,
        right: `${right}vw`,
        left: `${left}vw`,
        zIndex: zIndex ? zIndex : 50,
        minHeight: `${!height ? (minSizeFull ? '100%' : '100vh') : ''}`,
        // height: fullScreen ? '100%' : `${height ? `${height}vh` : ''}`,
        height: '100%',
        // overflowY: overflowYScroll ? 'scroll' : 'auto',
        overflowY: 'scroll',
      }}
    >
      {/* modal window notifications messages */}
      <AnimatePresence>
        {messages.successMessage && <SuccessNotification apiMessage={messages.successMessage} />}
      </AnimatePresence>
      <AnimatePresence>
        {messages.serverError && <FailNotification apiMessage={messages.serverError} />}
      </AnimatePresence>

      {/* modal window content */}
      {children}
    </motion.section>
  );
}
