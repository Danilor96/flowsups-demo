import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { SmsData } from '@/app/api/reports/storeReport/callActivity/smsDetail/types';
import { PropSmsChat } from './propSmsChat/PropSmsChat';

export function SmsContainer({
  onClose,
  customerName,
  smsData,
}: {
  onClose: () => void;
  customerName?: string;
  smsData: SmsData[];
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <ModalWindow>
      <ModalContainer width={47.520833} marginTop={5}>
        <ModalContainerTitle
          closeWindowFunction={onClose}
          title={customerName ? customerName : 'Unregistered Customer'}
        />
        <ModalContent paddingRight={0.5}>
          <PropSmsChat smsData={smsData} />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
