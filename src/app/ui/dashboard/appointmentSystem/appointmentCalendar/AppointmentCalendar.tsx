import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DropMenu } from '&/icons/Icons';
import { adminDashboardStore, dailyTotalsStore, modalWindowStore } from '@/store/adminDashboard';
import { Appointments } from '@/app/libs/definitions';
import { DatePickerFilter } from '&/dashboard/appointmentSystem/appointmentCalendar/datePickerFilter/DatePickerFilter';
import { DateRange } from 'react-day-picker';
import { CalendarAppointmentForm } from '&/dashboard/appointmentSystem/appointmentCalendar/calendarAppointmentForm/CalendarAppointmentForm';
import { dateFormatsStore } from '@/store/dateFormats';
import { EventDropArg } from '@fullcalendar/core/index.js';
import { ConfirmNotification } from '&/notifications/Notification';
import { useSocketStore } from '@/store/socketIo';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { CalendarInfo } from '&/dashboard/appointmentSystem/appointmentCalendar/calendarInfo/CalendarInfo';
import { format, parseISO } from 'date-fns';
import DailyAppointmentSchedule, {
  DailyActivityTable,
} from '&/dashboard/clientSystem/clientDetail/middleButtonsOptions/DailyAppointmentSchedule';
import { useCan } from '@/hooks/permissions';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';

export function AppointmentCalendar() {
  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();

  const { appointmentsData } = adminDashboardStore();

  const { getClients } = adminDashboardStore();

  const { dateFormatted } = dateFormatsStore();

  const { todayAppointments } = dailyTotalsStore();

  const { can } = useCan();

  const { createCallendarAppointment, callendarAppointmentDetail } = modalWindowStore();
  const { openCloseCreateCallendarAppointment, openCloseCallendarAppointmentDetail } =
    modalWindowStore();

  useEffect(() => {
    getClients();
  }, [getClients]);

  // ----- local states -----

  const [showDatePicker, setShowDatePicker] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const [appointmentsList, setAppointmentsList] = useState<Appointments>(undefined);

  useEffect(() => {
    if (appointmentsData && appointmentsData.length > 0) {
      setAppointmentsList(appointmentsData);
    }
  }, [appointmentsData]);

  const stablishAppointmentBackgroundColor = (statusId: number) => {
    let color = '';

    switch (statusId) {
      case 1:
        color = '#c9a516';
        break;

      case 6:
        color = '#00A78B';
        break;

      case 3:
        color = '#ef4444';
        break;
    }

    return color;
  };

  useEffect(() => {
    if (appointmentsList && appointmentsList.length > 0) {
      const calendarApi = calendarRef?.current?.getApi();

      if (calendarApi) {
        calendarApi.removeAllEvents();

        appointmentsList.forEach((el) => {
          calendarApi.addEvent({
            id: el.id.toString(),
            title: `${el.customers.first_name} ${el.customers.last_name}, Bdc: ${
              el.customers.bdc?.name ? el.customers.bdc?.name : ''
            } ${el.customers.bdc?.last_name ? el.customers.bdc?.last_name : ''}, Sales Rep: ${
              el.customers.seller?.name ? el.customers.seller?.name : ''
            } ${el.customers.seller?.last_name ? el.customers.seller?.last_name : ''}, Note: ${
              el.lead_appointment
                ? el.lead_appointment.length > 0
                  ? el.lead_appointment[0].note_assigned?.note || ''
                  : ''
                : ''
            }`,
            start: el.start_date && new Date(el.start_date),
            end: el.end_date && new Date(el.end_date),
            appointmentId: el.id,
            backgroundColor: stablishAppointmentBackgroundColor(el.appointments_status.id),
          });
        });
      }
    } else {
      const calendarApi = calendarRef?.current?.getApi();

      if (calendarApi) {
        calendarApi.removeAllEvents();
      }
    }
  }, [appointmentsList]);

  // set the appointment in calendar

  const handleDateClick = (arg: DateClickArg) => {
    if (can(75)) {
      openCloseCreateCallendarAppointment();

      const startDate = dateFormatted(5, parseISO(arg.date.toISOString()));

      setStartDate(startDate);
    }
  };

  // drop event handling

  const [showMoveAppointmentConfirm, setShowMoveAppointmentConfirm] = useState(false);
  const [oldStartDate, setOldStartDate] = useState<Date | null>(null);
  const [oldEndData, setOldEndData] = useState<Date | null>(null);
  const [newStartData, setNewStartDate] = useState<Date | null>(null);
  const [newEndData, setNewEndData] = useState<Date | null>(null);
  const [appointmentMovedId, setAppointmentMovedId] = useState('');
  const [showDailyActivityTable, setShowDailyActivityTable] = useState(false);
  const [showErrorReschedule, setShowErrorReschedule] = useState(false);
  const [appointmentScheduleErrorMessage, setAppointmentScheduleErrorMessage] = useState('');

  const handleEventDrop = (arg: EventDropArg) => {
    if (can(76)) {
      if (arg.oldEvent.start) setOldStartDate(parseISO(arg.oldEvent.start.toISOString()));

      if (arg.oldEvent.end) setOldEndData(parseISO(arg.oldEvent.end.toISOString()));

      if (arg.event.start) setNewStartDate(parseISO(arg.event.start.toISOString()));

      if (arg.event.end) setNewEndData(parseISO(arg.event.end.toISOString()));

      setAppointmentMovedId(arg.event.id);

      setShowMoveAppointmentConfirm(true);
    }
  };

  const appointmentRescheduleConfirmationMessage = `Move this appointment${
    newStartData && newEndData
      ? ` to: ${dateFormatted(5, newStartData)} - ${dateFormatted(1, newEndData)}`
      : ''
  }?`;

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleConfirmMoveAppointment = async (decision: boolean) => {
    const calendarApi = calendarRef?.current?.getApi();

    if (decision && newStartData && newEndData) {
      const formData = new FormData();

      formData.append('startDate', new Date(newStartData).toISOString());
      formData.append('endDate', new Date(newEndData).toISOString());

      const apiUrl = `/api/adminDashboard/appointments/${appointmentMovedId}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 76,
        options: {
          onSuccess() {
            updateDataWithSocket('appointments');

            updateDataWithSocket('dailyAppointmentsList');
          },
          onError(json) {
            if (json.timeConflict) {
              const startDate = json.startDate ? format(new Date(json.startDate), 'h:mm:ss a') : '';
              const endDate = json.endDate ? format(new Date(json.endDate), 'h:mm:ss a') : '';
              handleScheduleTimeConflict?.(json.serverError + ` (${startDate} - ${endDate})`);
              // close window decision
              if (oldStartDate && appointmentMovedId && calendarApi && oldEndData) {
                const event = calendarApi.getEventById(appointmentMovedId);

                event?.setStart(oldStartDate);
                event?.setEnd(oldEndData);
              }
            }
          },
        },
      });

      setShowMoveAppointmentConfirm(false);
    } else {
      if (oldStartDate && appointmentMovedId && calendarApi && oldEndData) {
        const event = calendarApi.getEventById(appointmentMovedId);

        event?.setStart(oldStartDate);
        event?.setEnd(oldEndData);
      }
      setShowMoveAppointmentConfirm(false);
    }
  };

  // show edit option

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');

  const handleEventDetail = (e: React.MouseEvent<HTMLDivElement>) => {
    const { appointment_id } = e.currentTarget.dataset;

    if (appointment_id) {
      setSelectedAppointmentId(appointment_id);

      openCloseCallendarAppointmentDetail(appointment_id);
    }
  };

  // show the date inputs

  const handleShowDateRange = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (showDatePicker) {
      setShowDatePicker(false);
      return;
    }
    setShowDatePicker(true);
  };

  // date filter

  const [fromSelected, setFromSelected] = useState<Date | undefined>(undefined);
  const [toSelected, setToSelected] = useState<Date | undefined>(undefined);

  const handleDateRange = (e: DateRange | undefined) => {
    setFromSelected(e?.from);
    setToSelected(e?.to);
  };

  const handleClearOrSetTodayDateFilter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'clearDateFilter') {
      setFromSelected(undefined);
      setToSelected(undefined);
    }

    if (identity === 'today') {
      setFromSelected(new Date());
      setToSelected(undefined);
    }
  };

  useEffect(() => {
    let newAppointmentList = appointmentsData;

    if (fromSelected) {
      newAppointmentList = newAppointmentList?.filter((el) => {
        const startDate = new Date(el.start_date).getDate();
        const dateSelected = new Date(fromSelected).getDate();

        return startDate == dateSelected;
      });
    }

    if (fromSelected && toSelected) {
      newAppointmentList = appointmentsData?.filter((el) => {
        const startDate = new Date(el.start_date).getDate();
        const startSelected = new Date(fromSelected).getDate();
        const endSelected = new Date(toSelected).getDate();

        return startDate === startSelected || startDate <= endSelected;
      });
    }

    setAppointmentsList(newAppointmentList);
  }, [fromSelected, toSelected, appointmentsData]);

  // handle create new appointment

  const [startDate, setStartDate] = useState<string>('');

  const handleErrorAppointmentDecision = (decision: boolean) => {
    if (decision) {
      setShowDailyActivityTable(false);
      setShowErrorReschedule(false);
      setAppointmentScheduleErrorMessage('');
    } else {
      setShowErrorReschedule(false);
      setShowDailyActivityTable(true);
    }
  };

  const handleScheduleTimeConflict = (message: string) => {
    setAppointmentScheduleErrorMessage(message);
    setShowErrorReschedule(true);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setShowDatePicker(false);
      }}
      className="relative w-full h-full"
      data-customsearch="no"
    >
      <aside className="absolute left-[16vw] top-[-1vh] flex flex-row gap-[2vw] items-center justify-between">
        <button
          type="button"
          onClick={handleShowDateRange}
          className="w-[16.458333vw] h-[5.277778vh] border-[0.104167vw] border-[#00A78B] rounded-[1.302083vw] flex flex-row justify-between items-center pl-[1.40625vw] pr-[0.9375vw] text-[1.7vh] text-[#00A78B]"
        >
          <p className="text-center">{`${fromSelected ? dateFormatted(2, fromSelected) : ''} - ${
            toSelected ? (toSelected !== fromSelected ? dateFormatted(2, toSelected) : '') : ''
          }`}</p>
          <DropMenu />
        </button>
        {showDatePicker && (
          <DatePickerFilter
            selectedFromRange={fromSelected}
            selectedToDate={toSelected}
            handleDateRange={handleDateRange}
            handleClearOrSetTodayDateFilter={handleClearOrSetTodayDateFilter}
          />
        )}
        <Paragraph
          color="#00A78B"
          fontSize={2.5}
        >{`Today's appointments: ${todayAppointments}`}</Paragraph>
        <CalendarInfo />
      </aside>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView={'timeGridWeek'}
        headerToolbar={{
          left: 'today prev,next',
          center: '',
          right: 'timeGridWeek,dayGridMonth,timeGridDay',
        }}
        eventContent={(event) => {
          return (
            <div
              onClick={handleEventDetail}
              data-appointment_id={event.event.extendedProps.appointmentId}
              className="h-full overflow-y-scroll"
            >
              <p>{event.event.title.split(',')[0]}</p>
              <p>{event.event.title.split(',')[1]}</p>
              <p>{event.event.title.split(',')[2]}</p>
              <p>{event.event.title.split(',')[3]}</p>
            </div>
          );
        }}
        selectable={true}
        editable={can(76)}
        dateClick={handleDateClick}
        droppable={can(76)}
        eventDrop={handleEventDrop}
        slotMinTime={'07:00:00'}
        slotMaxTime={'22:00:00'}
        allDaySlot={false}
      />
      <AnimatePresence>
        {createCallendarAppointment && (
          <CalendarAppointmentForm
            startDate={startDate}
            handleTimeConflict={handleScheduleTimeConflict}
          />
        )}
      </AnimatePresence>
      {showMoveAppointmentConfirm && (
        <ConfirmNotification
          loading={loadingFetch}
          notiMessage={appointmentRescheduleConfirmationMessage}
          onDecision={handleConfirmMoveAppointment}
        />
      )}
      {showErrorReschedule && (
        <DailyAppointmentSchedule
          onDecision={handleErrorAppointmentDecision}
          notiMessage={appointmentScheduleErrorMessage}
        />
      )}
      {showDailyActivityTable && (
        <DailyActivityTable closeWindowFunction={() => setShowDailyActivityTable(false)} />
      )}
    </div>
  );
}
