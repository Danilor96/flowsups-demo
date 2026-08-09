import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { TrashIcon } from '&/icons/Icons';
import { ConfirmNotification } from '&/notifications/Notification';
import { Can } from '@/app/ui/auth/Can';
import { deleteClientStore, messagesStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useSocketStore } from '@/store/socketIo';
import { useState } from 'react';

export function BottomButtons() {
  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();

  const { doDeleteClient } = deleteClientStore();

  const { setMessages } = messagesStore();

  // ----- local states -----

  const [loadingDecision, setLoadingDecision] = useState(false);

  const [deleteConfirmationMessage, setDeleteConfirmationMessage] = useState('');

  const handleDeleteClient = () => {
    setDeleteConfirmationMessage('Are you sure you want to delete this user?');
  };

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (deleteConfirmationMessage) {
        if (singleCLientData && singleCLientData?.id) {
          setLoadingDecision(true);

          try {
            await doDeleteClient(`${singleCLientData?.id}`);
          } catch (error) {
            setMessages('An error occurred');
          }

          setLoadingDecision(false);
        }
      }
    } else {
      setDeleteConfirmationMessage('');
    }
  };

  return (
    <Can requiredPermission={80}>
      <ButtonContainer marginTop={8.240741} widthFull justify="right">
        {deleteConfirmationMessage && (
          <ConfirmNotification
            notiMessage={deleteConfirmationMessage}
            onDecision={handleDecision}
            loading={loadingDecision}
          />
        )}
        <Button
          backgroundColor="#FFF"
          identity="deleteCustomer"
          textColor="#00A78B"
          buttonText="Delete Customer"
          width={14.010417}
          border={0.104167}
          borderColor="#00A78B"
          buttonIcon={<TrashIcon />}
          iconTextGap={0.729167}
          onClick={handleDeleteClient}
        />
      </ButtonContainer>
    </Can>
  );
}
