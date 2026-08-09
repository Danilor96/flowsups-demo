import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { consentMessageStore, modalWindowStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { Sms } from './sms/Sms';
import { Email } from './email/Email';

export function CreditApp() {
  // ----- global states -----

  const { openCloseSendCreditApp } = modalWindowStore();

  const { sendCreditAppMessage } = consentMessageStore();

  useEffect(() => {
    if (sendCreditAppMessage) {
      setSendSmsCreditApp(sendCreditAppMessage);
    }
  }, [sendCreditAppMessage]);

  // ----- local states -----

  const [sms, setSms] = useState(false);
  const [email, setEmail] = useState(false);

  const [sendSmsCreditApp, setSendSmsCreditApp] = useState('');

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'sms') {
      setSms(!sms);

      setEmail(false);
    }

    if (identity === 'email') {
      setEmail(!email);

      setSms(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.currentTarget;

    if (name === 'message') {
      setSendSmsCreditApp(value);
    }
  };

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer marginTop={6} width={60}>
        <ModalContainerTitle title="Send Credit App" closeWindowFunction={openCloseSendCreditApp} />
        <ModalContent minHeight={60}>
          {/* <ButtonContainer widthFull marginTop={0} justify="center" gap={2}>
            <Button
              backgroundColor={sms ? '#00a78b' : '#FFF'}
              identity="sms"
              textColor={sms ? '#FFF' : '#00a78b'}
              border={0.05}
              borderColor="#00a78b"
              buttonText="Send Sms"
              buttonTextSize={2.5}
              width={9}
              onClick={handleButton}
            />
            <Button
              backgroundColor={email ? '#00a78b' : '#FFF'}
              identity="email"
              textColor={email ? '#FFF' : '#00a78b'}
              border={0.05}
              borderColor="#00a78b"
              buttonText="Send Email"
              buttonTextSize={2.5}
              width={9}
              onClick={handleButton}
            />
          </ButtonContainer> */}
          <Sms sms={sendSmsCreditApp} onChange={handleChange} />
          {/* {sms && !email && <Sms sms={sendSmsCreditApp} onChange={handleChange} />}
          {email && !sms && <Email />} */}
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
