import { Options } from '&/miscellaneous/optionsButton/options/Options';
import { adminDashboardStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { CancelationInput } from './cancelationInput/CancelationInput';
import { RescheduleInputs } from './rescheduleInputs/RescheduleInputs';
import { ConfirmNotification } from '&/notifications/Notification';
import { useCan } from '@/hooks/permissions';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { Can } from '&/auth/Can';
import { useSession } from 'next-auth/react';
import { DashboardPagesIndex } from '@/app/ui/dashboard/admin/AdminDashboard';

export function DailyActivityOptions({
  appointmentId,
  customerId,
  customerVisit,
  onChangeSuccess,
}: {
  appointmentId: number;
  customerId: number;
  customerVisit: boolean;
  onChangeSuccess?: () => Promise<void>;
}) {
  // ----- global states -----

  const session = useSession();

  const userId = session.data?.user.id;

  const { getDailyActivityAppointments, getDailyMadeAppointments } = adminDashboardStore();
  const { dailyMadeAppointments, currentDashboardIndex } = adminDashboardStore();

  // ----- local states -----

  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [options, setOptions] = useState<{ id: number; option: string }[]>([]);

  const [notiMssg, setNotiMssg] = useState('');

  const { can } = useCan();

  useEffect(() => {
    const addOptions: typeof options = [];

    if (can(2)) {
      addOptions.push({
        id: 1,
        option: 'Visit',
      });
    }

    if (can(3)) {
      addOptions.push({
        id: 2,
        option: 'Cancel Appointment',
      });
    }

    if (can(4)) {
      addOptions.push({
        id: 3,
        option: 'Reschedule Appointment',
      });
    }

    setOptions(addOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const options = [
  //   {
  //     id: 1,
  //     option: 'Visit',
  //   },
  //   {
  //     id: 2,
  //     option: 'Cancel Appointment',
  //   },
  //   {
  //     id: 3,
  //     option: 'Reschedule Appointment',
  //   },
  // ];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;

    // visit
    if (value === '1') {
      setNotiMssg('Are you sure you want to change the status of this Appointment?');
    }

    // cancel appointment
    if (value === '2') {
      setShowCancel(!showCancel);
    }

    // reschedule appointment
    if (value === '3') {
      setShowReschedule(!showReschedule);
    }
  };

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleDecision = async (e: boolean) => {
    if (e) {
      const formData = new FormData();

      formData.append('action', '2');

      const apiUrl = `/api/adminDashboard/dailyActvityAppointments/${appointmentId}`;

      await makeAsyncFetch({
        apiUrl: apiUrl,
        method: 'PUT',
        formData: formData,
        permissionForFetch: 2,
        options: {
          onSuccess: async () => {
            if (dailyMadeAppointments && userId) {
              getDailyMadeAppointments(userId);
            }

            if (currentDashboardIndex === DashboardPagesIndex.DailyActivity) {
              await getDailyActivityAppointments();
            }

            onChangeSuccess?.();
          },
        },
      });

      setNotiMssg('');
    } else {
      setNotiMssg('');
    }
  };

  return (
    <>
      {notiMssg && (
        <div className="absolute z-50 min-w-[40rem]">
          <ConfirmNotification
            notiMessage={notiMssg}
            onDecision={handleDecision}
            loading={loadingFetch}
          />
        </div>
      )}
      <Options
        identity=""
        itemId={1}
        optionsBackgroundColor="#FFF"
        optionsHeight={5.5}
        optionsRadius={0.5}
        optionsWidth={0}
        // optionsRight={customerVisit ? 5 : 7}
        // optionsTop={0}
        options={options}
        loading={loadingFetch}
        onClick={handleClick}
      />
      {showCancel && (
        <Can requiredPermission={3}>
          <CancelationInput
            appointmentId={appointmentId}
            customerId={customerId}
            customerVisit={customerVisit}
            onCancelClick={() => setShowCancel(false)}
            onChangeSuccess={onChangeSuccess}
          />
        </Can>
      )}
      {showReschedule && (
        <Can requiredPermission={4}>
          <RescheduleInputs
            appointmentId={appointmentId}
            customerId={customerId}
            customerVisit={customerVisit}
            onClickClose={() => setShowReschedule(false)}
            onChangeSuccess={onChangeSuccess}
          />
        </Can>
      )}
    </>
  );
}
