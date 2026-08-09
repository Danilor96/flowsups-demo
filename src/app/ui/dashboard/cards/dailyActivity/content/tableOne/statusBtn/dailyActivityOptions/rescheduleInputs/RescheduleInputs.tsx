import { ToFromDateTimePicker } from '&/dateTimePicker/ToFromDateTimePicker';
import { ConfirmNotification } from '&/notifications/Notification';
import { DashboardPagesIndex } from '@/app/ui/dashboard/admin/AdminDashboard';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { adminDashboardStore } from '@/store/adminDashboard';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { useSocketStore } from '@/store/socketIo';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export function RescheduleInputs({
  appointmentId,
  customerId,
  customerVisit,
  onClickClose,
  onChangeSuccess,
}: {
  appointmentId: number;
  customerId: number;
  customerVisit: boolean;
  onClickClose: () => void;
  onChangeSuccess?: () => Promise<void>;
}) {
  // ----- global states -----

  const { data: session } = useSession();

  const userId = session?.user.id;

  const { getDailyActivityAppointments, getDailyMadeAppointments } = adminDashboardStore();
  const { dailyMadeAppointments, currentDashboardIndex } = adminDashboardStore();

  const { updateDataWithSocket } = useSocketStore();

  const { dateTimePicked } = inputTypeDateFormatStore();

  // ----- local states -----

  const [notiMssg, setNotiMssg] = useState('');

  const [date, setDate] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    const { name, value } = e.currentTarget;

    if (name === 'date') {
      setDate(value);
    }

    if (name === 'from') {
      setFrom(value);
    }

    if (name === 'to') {
      setTo(value);
    }

    if (name === 'btn') {
      setNotiMssg('Are you sure you want to reschedule this Appointment?');
    }

    if (name === 'btnCancel') {
      onClickClose();
    }
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleDecision = async (e: boolean) => {
    if (e) {
      const formData = new FormData();

      const dateFromPicked = (date && from && dateTimePicked(date, from)) || null;
      const dateToPicked = (date && to && dateTimePicked(date, to)) || null;

      formData.append('date', date);
      formData.append('from', from);
      formData.append('to', to);
      formData.append('dateFromPicked', dateFromPicked?.toISOString() || '');
      formData.append('dateToPicked', dateToPicked?.toISOString() || '');
      userId && formData.append('userId', `${userId}`);
      customerId && formData.append('customerId', `${customerId}`);

      const apiUrl = `/api/adminDashboard/rescheduleDailyActivityAppointment/${appointmentId}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 4,
        options: {
          onSuccess: () => {
            if (dailyMadeAppointments && userId) {
              getDailyMadeAppointments(userId);
            }

            if (currentDashboardIndex === DashboardPagesIndex.DailyActivity) {
              getDailyActivityAppointments();
            }

            onChangeSuccess?.();
            
            updateDataWithSocket('dailyAppointmentsList');

            updateDataWithSocket('managerTasks');

            onClickClose();
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
      <ToFromDateTimePicker
        datePicker={date}
        toDateTime={to}
        fromDateTime={from}
        right={customerVisit ? 2.25 : 7}
        top={0}
        zIndex={5}
        height={16.5}
        identity="reschedule"
        fieldErrors={fieldErrors}
        loading={loadingFetch}
        onChange={handleChange}
      />
      {notiMssg && (
        <ConfirmNotification
          notiMessage={notiMssg}
          onDecision={handleDecision}
          loading={loadingFetch}
        />
      )}
    </>
  );
}
