import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { ConfirmNotification } from '&/notifications/Notification';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { messagesStore } from '@/store/adminDashboard';
import { useSocketStore } from '@/store/socketIo';
import { useState } from 'react';

export function CancelRequestElement({
  appointmentId,
  cancelReason,
}: {
  appointmentId: number;
  cancelReason: string | null;
}) {
  // ----- global states -----

  const { setMessages } = messagesStore();

  const { updateDataWithSocket } = useSocketStore();

  // ----- local states -----

  const [notiAcceptMssg, setNotiAcceptMssg] = useState('');
  const [notiCancelMssg, setNotiCancelMssg] = useState('');

  const buttonData = [
    {
      id: 1,
      backgroundColor: '#FFF',
      textColor: '#4b5563',
      identity: 'cancel',
      border: 0.15,
      borderColor: '#4b5563',
      buttonText: 'Cancel',
    },
    {
      id: 2,
      backgroundColor: '#FFF',
      textColor: '#ef4444',
      identity: 'accept',
      border: 0.15,
      borderColor: '#ef4444',
      buttonText: 'Accept',
    },
  ];

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'accept') {
      setNotiAcceptMssg('Are you sure you want to cancel this appointment?');
    }

    if (identity === 'cancel') {
      setNotiCancelMssg(
        'Are you sure you want to cancel this request? This appointment will return to its original flow',
      );
    }
  };

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (notiAcceptMssg) {
        const apiUrl = `/api/adminDashboard/cancelDailyActivityAppointment/accept/${appointmentId}`;

        await makeAsyncFetch({
          apiUrl,
          method: 'PUT',
          permissionForFetch: 6,
          options: {
            onSuccess: () => {
              updateDataWithSocket('dailyAppointmentsList');

              setNotiAcceptMssg('');
            },
          },
        });
      }

      if (notiCancelMssg) {
        const apiUrl = `/api/adminDashboard/cancelDailyActivityAppointment/cancel/${appointmentId}`;

        await makeAsyncFetch({
          apiUrl,
          method: 'PUT',
          permissionForFetch: 6,
          options: {
            onSuccess: () => {
              updateDataWithSocket('dailyAppointmentsList');

              setNotiCancelMssg('');
            },
          },
        });
      }
    } else {
      setNotiAcceptMssg('');
      setNotiCancelMssg('');
    }
  };

  return (
    <div className="absolute top-[5.5vh] right-[10vw] w-[25vw] h-fit flex flex-col gap-[1.3vh] px-[0.6vw] py-[1.2vh] text-wrap bg-white shadow-crmFormShadow rounded-md">
      <aside className="flex flex-col gap-[0.6vh]">
        <p className="w-full text-gray-600 text-wrap">Reason to cancel this appointment:</p>
        <p className="w-full text-[#00A78B] text-wrap">{cancelReason}</p>
      </aside>
      <ButtonContainer marginTop={0} widthFull justify="center" gap={1}>
        {buttonData.map((el, index) => (
          <Button
            key={`${el.id + index}_-_-__-${index + (12 * index + 3)}`}
            backgroundColor={el.backgroundColor}
            textColor={el.textColor}
            identity={el.identity}
            border={el.border}
            borderColor={el.borderColor}
            buttonText={el.buttonText}
            buttonTextSize={2}
            onClick={handleButton}
          />
        ))}
      </ButtonContainer>
      {(notiAcceptMssg || notiCancelMssg) && (
        <ConfirmNotification
          notiMessage={notiAcceptMssg || notiCancelMssg}
          loading={loadingFetch}
          onDecision={handleDecision}
        />
      )}
    </div>
  );
}
