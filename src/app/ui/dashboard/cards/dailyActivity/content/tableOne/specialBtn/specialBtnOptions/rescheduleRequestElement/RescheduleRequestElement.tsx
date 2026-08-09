import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { ToFromDateTimePicker } from '&/dateTimePicker/ToFromDateTimePicker';
import { ConfirmNotification } from '&/notifications/Notification';
import { DashboardPagesIndex } from '@/app/ui/dashboard/admin/AdminDashboard';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { adminDashboardStore, messagesStore } from '@/store/adminDashboard';
import { dateFormatsStore } from '@/store/dateFormats';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { useSocketStore } from '@/store/socketIo';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export function RescheduleRequestElement({
  appointmentId,
  preventedStartDate,
  preventedEndDate,
}: {
  appointmentId: number;
  preventedStartDate: Date | null;
  preventedEndDate: Date | null;
}) {
  // ----- global states -----
  const { data: session } = useSession();

  const userId = session?.user.id;

  const getMadeApp = adminDashboardStore((state) => state.getDailyMadeAppointments);
  const getDailyActivityAppointments = adminDashboardStore(
    (state) => state.getDailyActivityAppointments,
  );
  const madeApp = adminDashboardStore((state) => state.dailyMadeAppointments);
  const currentDashboardIndex = adminDashboardStore((state) => state.currentDashboardIndex);

  const { dateFormatted } = dateFormatsStore();

  const { setMessages } = messagesStore();

  const { updateDataWithSocket } = useSocketStore();

  const { dateTimePicked } = inputTypeDateFormatStore();

  // ----- local states -----

  const [date, setDate] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [showDateInputs, setShowDateInputs] = useState(false);

  const [notiChangeMssg, setNotiChangeMssg] = useState('');
  const [notiAcceptMssg, setNotiAcceptMssg] = useState('');

  const rescheduleText = `Request to change appointment date: `;
  const rescheduleDateText = `${dateFormatted(2, preventedStartDate)}, from ${dateFormatted(
    1,
    preventedStartDate,
  )} to ${dateFormatted(1, preventedEndDate)}.`;

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'reschedule') {
      setShowDateInputs(true);
    }

    if (identity === 'accept') {
      setNotiAcceptMssg('Are you sure you want to accept this reschedule?');
    }
  };

  const handleChange = (
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
      setNotiChangeMssg('Are you sure you want to reschedule this Appointment?');
    }

    if (name === 'btnCancel') {
      setShowDateInputs(false);
    }
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (notiAcceptMssg) {
        const apiUrl = `/api/adminDashboard/rescheduleDailyActivityAppointment/accept/${appointmentId}`;

        await makeAsyncFetch({
          apiUrl,
          method: 'PUT',
          permissionForFetch: 7,
          options: {
            onSuccess: () => {
              if (madeApp && userId) {
                getMadeApp(userId);
              }

              if (currentDashboardIndex === DashboardPagesIndex.DailyActivity) {
                getDailyActivityAppointments();
              }

              updateDataWithSocket('dailyAppointmentsList');
            },
          },
        });
      }

      if (notiChangeMssg) {
        const formData = new FormData();
        const dateFromPicked = (date && from && dateTimePicked(date, from)) || null;
        const dateToPicked = (date && to && dateTimePicked(date, to)) || null;

        formData.append('date', date);
        formData.append('from', from);
        formData.append('to', to);
        formData.append('dateFromPicked', dateFromPicked?.toISOString() || '');
        formData.append('dateToPicked', dateToPicked?.toISOString() || '');

        const apiUrl = `/api/adminDashboard/rescheduleDailyActivityAppointment/change/${appointmentId}`;

        await makeAsyncFetch({
          apiUrl,
          formData,
          method: 'PUT',
          permissionForFetch: 7,
          options: {
            onSuccess: () => {
              if (madeApp && userId) {
                getMadeApp(userId);
              }

              if (currentDashboardIndex === DashboardPagesIndex.DailyActivity) {
                getDailyActivityAppointments();
              }

              updateDataWithSocket('dailyAppointmentsList');
            },
          },
        });
      }

      setNotiChangeMssg('');
    } else {
      setNotiChangeMssg('');

      setNotiAcceptMssg('');
    }
  };

  return (
    <div className="absolute top-[5.5vh] right-[10vw] w-[25vw] h-fit flex flex-col gap-[1.3vh] px-[0.6vw] py-[1.2vh] text-wrap bg-white shadow-crmFormShadow rounded-md">
      <p className="text-[2vh] text-gray-700">
        {rescheduleText}
        <span className="text-[#3b82f6] font-semibold">{rescheduleDateText}</span>
      </p>
      <ButtonContainer marginTop={0} widthFull justify="center" gap={1.3}>
        <Button
          backgroundColor="#3b82f6"
          identity="reschedule"
          textColor="#FFF"
          buttonText="Change"
          onClick={handleButton}
        />
        <Button
          backgroundColor="#00A78B"
          identity="accept"
          textColor="#FFF"
          buttonText="Accept"
          onClick={handleButton}
        />
      </ButtonContainer>
      {showDateInputs && (
        <ToFromDateTimePicker
          datePicker={date}
          fromDateTime={from}
          toDateTime={to}
          fieldErrors={fieldErrors}
          right={0}
          top={0}
          onChange={handleChange}
        />
      )}
      {(notiChangeMssg || notiAcceptMssg) && (
        <ConfirmNotification
          notiMessage={notiChangeMssg || notiAcceptMssg}
          loading={loadingFetch}
          onDecision={handleDecision}
        />
      )}
    </div>
  );
}
