import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { Button } from '@/app/ui/buttons/Button';
import { FailIcon } from '@/app/ui/icons/Icons';
import { Loader } from '@/app/ui/miscellaneous/loader/Loader';
import { motion } from 'framer-motion';
import { DailyActivityContent } from '../../../cards/dailyActivity/content/DailyActivityContent';
import { messagesStore } from '@/store/adminDashboard';

export function DailyAppointmentSchedule({
  notiMessage,
  alterNotiMessage,
  alterNotiMessageColor,
  loading,
  textWidth,
  onDecision,
  children,
  childrenBottom,
}: {
  notiMessage: string;
  alterNotiMessage?: string;
  alterNotiMessageColor?: string;
  loading?: boolean;
  textWidth?: number;
  children?: React.ReactNode;
  childrenBottom?: boolean;
  onDecision: (decision: boolean) => void;
}) {
  return (
    <motion.div
      onClick={e => e.stopPropagation()}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-[6vh] left-0 right-0 z-50 w-full h-full flex justify-center items-center"
    >
      <article className="relative w-fit flex flex-col gap-[2vh] rounded-[1.3vw]  py-4 bg-white p-[0.7vw] text-[2.222222vh] text-gray-600 border-[0.15vw] border-[#00A78B] overflow-hidden">
        <p
          className="text-wrap flex gap-2 text-[#ED0000]"
          style={{
            width: textWidth ? `${textWidth}vh` : '',
          }}
        >
          <FailIcon />
          {notiMessage}
          <span
            style={{
              color: alterNotiMessageColor,
            }}
          >
            {alterNotiMessage}
          </span>
        </p>
        {!childrenBottom && children}
        <aside className="w-full flex flex-row justify-center gap-[1vw]">
          <Button
            backgroundColor="#FFF"
            identity="viewInDailyActivities"
            textColor="#00A78B"
            buttonText="View in Daily Activity"
            width={14.010417}
            border={0.104167}
            borderColor="#00A78B"
            iconTextGap={0.729167}
            onClick={() => onDecision(false)}
          />
          <Button
            backgroundColor="#9CA3AF"
            identity="accept"
            textColor="#FFF"
            buttonText="Accept"
            width={14.010417}
            border={0.104167}
            borderColor="#9CA3AF"
            // buttonIcon={<TrashIcon />}
            iconTextGap={0.729167}
            onClick={() => onDecision(true)}
          />
        </aside>
        {childrenBottom && children}
        {loading && <Loader />}
      </article>
    </motion.div>
  );
}

export const DailyActivityTable = ({
  closeWindowFunction,
}: {
  closeWindowFunction: () => void;
}) => {
  const messages  = messagesStore(state => state.messages);

  return (
    <ModalWindow
      top={0}
      minSizeFull
      positionFixed
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
    >
      <ModalContainer marginTop={8} width={95}>
        <ModalContainerTitle title="Daily Activity" closeWindowFunction={closeWindowFunction} />
        <ModalContent widthFull>
          <div className="w-full h-full bg-[#00A28A] rounded-[1.3vw] p-[0.7vw]">
            <DailyActivityContent />
          </div>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
};

export default DailyAppointmentSchedule;
