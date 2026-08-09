import { ClientDetailCallIcon, EmailIcon, MessageIcon } from '&/icons/Icons';
import { DropdownContent } from '&/modalWindowsStructure/dropdownContent/DropdownContent';
import { Button } from '&/buttons/Button';
import { modalWindowStore } from '@/store/adminDashboard';
import { useTwilioStore } from '@/store/phoneDevice';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { AnimatePresence } from 'framer-motion';
import { SmsModal } from '../smsModal/SmsModal';
import { EmailComponent } from '../../emailComponent/EmailComponent';
import { OutgoingCallComponent } from '../../outgoingCallComponent/OutgoingCallComponent';
import { Can } from '@/app/ui/auth/Can';

export function Contact() {
  // ----- global states -----

  const { smsModal, showEmailModal, showCallModal } = modalWindowStore();
  const { openSmsModal, setShowCallModal, setShowEmailModal } = modalWindowStore();

  const { callIncoming, incomingCallsArray } = useTwilioStore();
  const { setShowDashboardCallHandler } = useTwilioStore();

  // ----- local states -----

  const handleOpenCallComponent = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!callIncoming && incomingCallsArray.length < 1) {
      setShowDashboardCallHandler(false);
      setShowCallModal(true);
    }
  };

  const buttonData = [
    {
      id: 1,
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      identity: 'sms',
      text: 'SMS',
      width: 10.416667,
      height: 10.416667,
      icon: <MessageIcon />,
      border: 0.05,
      borderColor: '#C9EBE6',
      borderRadius: 1.041667,
      textSize: 2,
      onClick: openSmsModal,
      can: 64,
    },
    {
      id: 2,
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      identity: 'call',
      text: 'Call',
      width: 10.416667,
      height: 10.416667,
      icon: <ClientDetailCallIcon />,
      border: 0.05,
      borderColor: '#C9EBE6',
      borderRadius: 1.041667,
      textSize: 2,
      onClick: handleOpenCallComponent,
      can: 65,
    },
    {
      id: 3,
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      identity: 'email',
      text: 'Email',
      width: 10.416667,
      height: 10.416667,
      icon: <EmailIcon />,
      border: 0.05,
      borderColor: '#C9EBE6',
      borderRadius: 1.041667,
      textSize: 2,
      onClick: () => setShowEmailModal(true),
      can: 66,
    },
  ];

  return (
    <Can requiredPermission={[64, 65, 66]}>
      <DropdownContent title="Contact" height={30} itemsCenter>
        <AnimatePresence>
          {smsModal && (
            <Can requiredPermission={64}>
              <SmsModal />
            </Can>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showEmailModal && (
            <Can requiredPermission={66}>
              <EmailComponent />
            </Can>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showCallModal && (
            <Can requiredPermission={65}>
              <OutgoingCallComponent />
            </Can>
          )}
        </AnimatePresence>
        <ContentRow cols={3} widthFull gap={7} justifyContent="center" alignItems="center">
          {buttonData.map((el, index) => (
            <Can key={`${el.id - 90}contactdsds${index * 33 - index}`} requiredPermission={el.can}>
              <Button
                backgroundColor={el.backgroundColor}
                textColor={el.textColor}
                identity={el.identity}
                buttonText={el.text}
                width={el.width}
                height={el.height}
                buttonIcon={el.icon}
                heightVw
                iconAbove
                border={el.border}
                borderColor={el.borderColor}
                borderRadius={el.borderRadius}
                buttonTextSize={el.textSize}
                iconTextGap={0.7}
                onClick={el.onClick}
              />
            </Can>
          ))}
        </ContentRow>
      </DropdownContent>
    </Can>
  );
}
