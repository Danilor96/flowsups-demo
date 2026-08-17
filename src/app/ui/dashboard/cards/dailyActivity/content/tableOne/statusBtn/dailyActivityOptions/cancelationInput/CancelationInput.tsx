import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Loader } from '&/miscellaneous/loader/Loader';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSocketStore } from '@/store/socketIo';
import { ConfirmNotification } from '&/notifications/Notification';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { adminDashboardStore } from '@/store/adminDashboard';
import { DashboardPagesIndex } from '@/app/ui/dashboard/dashboardPagesIndex';

export function CancelationInput({
  appointmentId,
  customerId,
  customerVisit,
  onCancelClick,
  onChangeSuccess,
}: {
  appointmentId: number;
  customerId: number;
  customerVisit: boolean;
  onCancelClick: () => void;
  onChangeSuccess?: () => Promise<void>;
}) {
  // ----- global states -----

  const { data: session } = useSession();

  const userId = session?.user.id;

  const { updateDataWithSocket } = useSocketStore();

  const getMadeApp = adminDashboardStore((state) => state.getDailyMadeAppointments);
  const getDailyActivityAppointments = adminDashboardStore(
    (state) => state.getDailyActivityAppointments,
  );
  const madeApp = adminDashboardStore((state) => state.dailyMadeAppointments);
  const currentDashboardIndex = adminDashboardStore((state) => state.currentDashboardIndex);

  // ----- local states -----

  const [reason, setReason] = useState('');

  const [notiMssg, setNotiMssg] = useState('');

  const info =
    'Please, enter the reason for cancellation. The answer will be sent to the managers in order to be confirmed by them. Until the managers confirm this action, the current status of the appointment will remain but the interactions will be disabled.';

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setNotiMssg('Are you sure you want to cancel this Appointment?');
  };

  const buttonData = [
    {
      backgroundColor: '',
      identity: 'cancel',
      textColor: '#020617',
      buttonText: 'Cancel',
      borderColor: '#6b7280',
      border: 0.15,
      onClick: onCancelClick,
    },
    {
      backgroundColor: '',
      identity: 'confirm',
      textColor: '#dc2626',
      buttonText: 'Confirm',
      borderColor: '#dc2626',
      border: 0.15,
      onClick: handleButton,
    },
  ];

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleDecision = async (e: boolean) => {
    if (e) {
      const formData = new FormData();

      formData.append('cancelReason', reason);
      userId && formData.append('cancelBy', `${userId}`);
      customerId && formData.append('customerId', `${customerId}`);

      const apiUrl = `/api/adminDashboard/cancelDailyActivityAppointment/${appointmentId}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 3,
        options: {
          onSuccess: () => {
            onCancelClick();

            if (madeApp && userId) {
              getMadeApp(userId);
            }

            if (currentDashboardIndex === DashboardPagesIndex.DailyActivity) {
              getDailyActivityAppointments();
            }

            onChangeSuccess?.();

            updateDataWithSocket('dailyAppointmentsList');

            updateDataWithSocket('managerTasks');

            setReason('');
          },
        },
      });

      setNotiMssg('');
    } else {
      setNotiMssg('');
    }
  };

  return (
    <div
      className="absolute top-0 z-[5] w-[30vw] h-fit flex flex-col justify-center items-center gap-[3vh] px-[1vw] py-[1vh] bg-[#FFF] rounded-[0.58vw] overflow-hidden"
      style={{
        right: customerVisit ? '3.7vw' : '7vw',
      }}
    >
      {notiMssg && (
        <ConfirmNotification
          notiMessage={notiMssg}
          onDecision={handleDecision}
          loading={loadingFetch}
        />
      )}
      <Paragraph color="#00A28A" fontWeight={500} fontSize={2}>
        {info}
      </Paragraph>
      <textarea
        className="w-full h-[11vh] rounded-[0.520833vw] bg-[#F4F4F4] outline-[#92CEC3] px-[0.6vw] text-[1.9vh] font-medium text-[#959595] resize-none"
        value={reason}
        name=""
        id=""
        autoComplete="off"
        onChange={(e) => setReason(e.currentTarget.value)}
      />
      {fieldErrors && (
        <p className="absolute top-[27vh] text-[1.8vh] text-[#ef4444]">
          {fieldErrors.cancelReason}
        </p>
      )}
      <ButtonContainer marginTop={0} widthFull justify="center" gap={3}>
        {buttonData.map((el, index) => (
          <Button
            key={`cancelBTN${index - index * 13}--${index + 111}`}
            backgroundColor={el.backgroundColor}
            identity={el.identity}
            textColor={el.textColor}
            buttonText={el.buttonText}
            border={el.border}
            borderColor={el.borderColor}
            buttonTextSize={2}
            onClick={el.onClick}
          />
        ))}
      </ButtonContainer>
      {loadingFetch && <Loader />}
    </div>
  );
}
