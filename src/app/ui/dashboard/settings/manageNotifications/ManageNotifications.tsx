import { messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { VoiceAndSms } from '&/dashboard/settings/manageNotifications/voiceAndSms/VoiceAndSms';
import { AutomaticEmails } from '&/dashboard/settings/manageNotifications/automaticEmails/AutomaticEmails';
import { AutomaticSms } from '&/dashboard/settings/manageNotifications/automaticSms/AutomaticSms';
import { EmailTemplates } from '&/dashboard/settings/manageNotifications/emailTemplates/EmailTemplates';
import { SmsTemplate } from '&/dashboard/settings/manageNotifications/smsTemplate/SmsTemplate';
import { NotificationsPreference } from './notificationsPreference/NotificationsPreference';
import { TabNavigation } from '&/miscellaneous/tabNavigation/TabNavigation';

export function ManageNotifications() {
  // ----- global states -----

  const { closeManageNotifications } = modalWindowStore();

  const { messages } = messagesStore();

  // ----- local states -----

  return (
    <ModalWindow
      top={0}
      failMessage={messages.serverError}
      successMessage={messages.successMessage}
    >
      <ModalContainer width={82.916667} marginTop={7.407407} positionRelative>
        <ModalContainerTitle
          title="Messaging Settings"
          closeWindowFunction={closeManageNotifications}
        />
        <TabNavigation
          renderedElements={[
            <VoiceAndSms key={1} />,
            <AutomaticEmails key={2} />,
            <AutomaticSms key={3} />,
            <EmailTemplates key={4} />,
            <SmsTemplate key={5} />,
            <NotificationsPreference key={6} />,
          ]}
          optionDescription={[
            'Voice and SMS',
            'Automatic Emails',
            'Automatic Sms',
            'Email Templates',
            'Sms Template',
            'Notifications Preference',
          ]}
          canByPosition={[[48], [49], [50], [51], [52], [53]]}
        />
      </ModalContainer>
    </ModalWindow>
  );
}
