import { create } from 'zustand';
import {
  startOfToday,
  endOfToday,
  startOfTomorrow,
  endOfTomorrow,
  startOfYesterday,
  endOfYesterday,
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfQuarter,
  endOfQuarter,
  subQuarters,
  startOfYear,
  endOfYear,
  subYears,
  isWithinInterval,
  addDays,
  addMonths,
  addQuarters,
  addYears,
  subDays,
  startOfDay,
  endOfDay,
  parseISO,
  differenceInDays,
  setQuarter,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';
import { adminDashboardStore } from './adminDashboard';

// dates formats for parsing dates strings

export interface DateFormats {
  dateFormatted: (format: number, date?: Date | null) => string;
  dateFromNotifications: (notiDescription: string) => string;
}

export const dateFormatsStore = create<DateFormats>((set, get) => ({
  dateFormatted: (format, date) => {
    let newDateFormat = {};

    if (date) {
      switch (format) {
        case 1:
          newDateFormat = {
            hour: '2-digit',
            minute: '2-digit',
          };
          break;

        case 2:
          newDateFormat = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          };
          break;

        case 3:
          newDateFormat = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          };
          break;

        case 4:
          newDateFormat = {
            month: 'long',
          };
          break;

        case 5:
          newDateFormat = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          };
          break;

        case 6:
          newDateFormat = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          };
          break;

        case 7:
          newDateFormat = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          };
          break;

        case 8:
          newDateFormat = {
            weekday: 'short',
            month: 'long',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          };
          break;
      }

      return new Date(date).toLocaleString('en-US', newDateFormat);
    } else {
      return '';
    }
  },
  dateFromNotifications: (notiDescription) => {
    const { dateFormatted } = get();

    let messageFormatted = notiDescription;

    const regexStartDate = /date\.start\{(.*?)\}/;
    const regexEndDate = /date\.end\{(.*?)\}/;

    const matchStartDate = messageFormatted.match(regexStartDate);
    const matchEndDate = messageFormatted.match(regexEndDate);

    if (matchStartDate) {
      const startDate = matchStartDate[1];

      messageFormatted = messageFormatted.replace(
        regexStartDate,
        dateFormatted(5, new Date(startDate)),
      );
    }

    if (matchEndDate) {
      const endDate = matchEndDate[1];

      messageFormatted = messageFormatted.replace(
        regexEndDate,
        dateFormatted(1, new Date(endDate)),
      );
    }

    return messageFormatted;
  },
}));

// time formats for parsing times to strings or times to dates

export interface TimeFormatted {
  timeFormatted: (time: string) => string;
  parsedDayTimeHourMinutes: (time: string) => { hour: number; minutes: number };
  parseFromTimeSelectedToDate: (date: Date, time: string) => Date;
  convertTimeTo24HourFormat: (time12Hour: string) => string;
}

export const timeFormattedStore = create<TimeFormatted>((set) => ({
  timeFormatted: (time) => {
    let formattedTime: string = '';
    const splittedTime = time.split(' ').slice(0, 1).join('');
    const hour = splittedTime.split(':')[0];
    const minute = splittedTime.split(':')[1];

    switch (time.includes('AM')) {
      case true:
        hour === '12' ? (formattedTime = `00:${minute}`) : (formattedTime = `${hour}:${minute}`);
        break;

      case false:
        hour === '12'
          ? (formattedTime = `${hour}:${minute}`)
          : (formattedTime = `${parseInt(hour) + 12}:${minute}`);
        break;
    }

    return formattedTime;
  },
  parsedDayTimeHourMinutes: (time) => {
    const currentDateString = new Date().toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const newDayTimeFormat = new Date(`${currentDateString}, ${time}`);

    return {
      hour: newDayTimeFormat.getHours(),
      minutes: newDayTimeFormat.getMinutes(),
    };
  },
  parseFromTimeSelectedToDate: (date, time) => {
    const dateSelectedToString = date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const dateWithTimeSelected = new Date(`${dateSelectedToString}, ${time}`);

    return dateWithTimeSelected;
  },
  convertTimeTo24HourFormat: (time12Hour: string) => {
    const [time, period] = time12Hour.split(' ');
    const [hoursStr, minutes] = time.split(':');
    let hours = parseInt(hoursStr, 10);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    const hours24 = hours.toString().padStart(2, '0');
    const minutes24 = minutes.padStart(2, '0');

    return `${hours24}:${minutes24}`;
  },
}));

// functions for calculate times spans

export interface TimeSpans {
  todaySpan: (date: Date) => boolean;
  tomorrowSpan: (date: Date) => boolean;
  yesterdaySpan: (date: Date) => boolean;
  previousSpans: (span: string, date: Date) => boolean;
  upcomingSpans: (span: string, date: Date) => boolean;
  quarters: (quarter: number, date: Date) => boolean;
  days: (days: string, date: Date) => boolean;
  months: (months: string, date: Date) => boolean;
  betweenSpans: (from: string, to: string, date: Date) => boolean;
}

export const timeSpansStore = create<TimeSpans>((set, get) => ({
  todaySpan: (date) => {
    return isWithinInterval(date, { start: startOfToday(), end: endOfToday() });
  },
  tomorrowSpan: (date) => {
    return isWithinInterval(date, { start: startOfTomorrow(), end: endOfTomorrow() });
  },
  yesterdaySpan: (date) => {
    return isWithinInterval(date, { start: startOfYesterday(), end: endOfYesterday() });
  },
  betweenSpans: (from, to, date) => {
    return isWithinInterval(date, {
      start: startOfDay(from || new Date()),
      end: endOfDay(to || new Date()),
    });
  },
  previousSpans: (span: string, date) => {
    const today = new Date();

    let startDate = today;
    let endDate = today;

    // previus span
    switch (span) {
      // week
      case '1':
        const lastWeek = subWeeks(today, 1);
        startDate = startOfWeek(lastWeek, { weekStartsOn: 1 }); // ISO (lunes a domingo)
        endDate = endOfWeek(lastWeek, { weekStartsOn: 1 });
        break;

      // month
      case '2':
        const lastMonth = subMonths(today, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;

      // quarter
      case '3':
        const lastQuarter = subQuarters(today, 1);
        startDate = startOfQuarter(lastQuarter);
        endDate = endOfQuarter(lastQuarter);
        break;

      // year
      case '4':
        const lastYear = subYears(today, 1);
        startDate = startOfYear(lastYear);
        endDate = endOfYear(lastYear);
        break;
    }

    return isWithinInterval(date, { start: startDate, end: endDate });
  },
  upcomingSpans: (span, date) => {
    const today = new Date();

    let startDate = today;
    let endDate = today;

    // upcoming span
    switch (span) {
      // week from today
      case '1':
        startDate = startOfWeek(addDays(today, 7));
        endDate = endOfWeek(addDays(today, 7));
        break;

      // month from today
      case '2':
        startDate = startOfMonth(addMonths(today, 1));
        endDate = endOfMonth(addMonths(today, 1));
        break;

      // quarter from today
      case '3':
        startDate = startOfQuarter(addQuarters(today, 1));
        endDate = endOfQuarter(addQuarters(today, 1));
        break;

      // year from today
      case '4':
        startDate = startOfYear(addYears(today, 1));
        endDate = endOfYear(addYears(today, 1));
        break;
    }

    return isWithinInterval(date, { start: startDate, end: endDate });
  },
  quarters: (quarter, date) => {
    // const today = new Date();
    // let quarterStart: Date = startOfQuarter(today);
    // let quarterEnd: Date = endOfQuarter(today);

    // // quarters options
    // switch (quarter) {
    //   // first quarter from today
    //   case 1:
    //     quarterStart = startOfQuarter(subQuarters(today, 3));
    //     quarterEnd = endOfQuarter(subQuarters(today, 3));
    //     break;

    //   // second quarter from today
    //   case 2:
    //     quarterStart = startOfQuarter(subQuarters(today, 2));
    //     quarterEnd = endOfQuarter(subQuarters(today, 2));

    //     break;

    //   // third quarter from today
    //   case 3:
    //     quarterStart = startOfQuarter(subQuarters(today, 1));
    //     quarterEnd = endOfQuarter(subQuarters(today, 1));
    //     break;

    //   // fourth quarter from today
    //   case 4:
    //     quarterStart = startOfQuarter(subQuarters(today, 0));
    //     quarterEnd = endOfQuarter(subQuarters(today, 0));
    //     break;
    // }

    const year = new Date().getFullYear();

    const quarterStart = startOfQuarter(setQuarter(new Date(year, 0, 1), quarter));
    const quarterEnd = endOfQuarter(quarterStart);

    return isWithinInterval(date, { start: quarterStart, end: quarterEnd });
  },
  days: (days, date) => {
    const today = new Date();
    const parsedDays = parseInt(days);
    const startDate = startOfDay(subDays(today, parsedDays));
    const endDate = endOfDay(today);

    return isWithinInterval(date, { start: startDate, end: endDate });
  },
  months: (months, date) => {
    const today = new Date();
    const parsedMonth = parseInt(months);
    const startDate = startOfMonth(subMonths(today, parsedMonth));
    const endDate = endOfMonth(today);

    return isWithinInterval(date, { start: startDate, end: endDate });
  },
}));

// Function to calculate the days after the client was created or days after an event ocurred

interface DaysSinceCreationOrEvent {
  daysSinceCreationOrEvent: (creationOrEventDate: Date) => string;
}

export const daysSinceCreationOrEventStore = create<DaysSinceCreationOrEvent>((set) => ({
  daysSinceCreationOrEvent: (creationOrEventDate) => {
    try {
      const date = new Date(creationOrEventDate);

      const currentDate = new Date();

      const daysElapsed = differenceInDays(currentDate, date);

      const res = daysElapsed === 0 ? '0 day' : daysElapsed === 1 ? '1 day' : `${daysElapsed} days`;

      return res;
    } catch (error) {
      return '';
    }
  },
}));

// function for task settings span/limit

interface TaskSettingsLimits {
  setLimit: (customerCreationDate: Date) => null | { date: null | Date; span: null | number };
}

const timeSpans = [3, 6, 12, 24, 48, 72];

export const taskSettingsLimitsStore = create<TaskSettingsLimits>(() => ({
  setLimit: (customerCreationDate) => {
    const { taskSettings } = adminDashboardStore.getState();

    if (!taskSettings) return null;

    let limitDate: null | Date = null;
    let span: null | number = null;

    const daysSinceCreation = differenceInDays(new Date(), customerCreationDate);

    if (daysSinceCreation < 2 && taskSettings.first_span_limit_id) {
      limitDate = returnDate(timeSpans[taskSettings.first_span_limit_id - 1]);

      span = timeSpans[taskSettings.first_span_limit_id - 1];
    }

    if (daysSinceCreation >= 2 && daysSinceCreation <= 3 && taskSettings.second_span_limit_id) {
      limitDate = returnDate(timeSpans[taskSettings.second_span_limit_id - 1]);

      span = timeSpans[taskSettings.second_span_limit_id - 1];
    }

    if (daysSinceCreation > 3 && taskSettings.third_span_limit_id) {
      limitDate = returnDate(timeSpans[taskSettings.third_span_limit_id - 1]);

      span = timeSpans[taskSettings.third_span_limit_id - 1];
    }

    return { date: limitDate, span: span };
  },
}));

const returnDate = (spanLimit: number) => {
  if (!spanLimit) return null;

  const todayMidNight = endOfDay(new Date());
  const hoursLeft = differenceInHours(todayMidNight, new Date());

  const days =
    spanLimit < 24 && spanLimit < hoursLeft
      ? new Date()
      : spanLimit < 24 && spanLimit > hoursLeft
        ? addDays(new Date(), 1)
        : spanLimit >= 24 &&
            spanLimit < 48 &&
            spanLimit <= differenceInHours(endOfDay(addDays(new Date(), 1)), new Date())
          ? addDays(new Date(), 1)
          : spanLimit >= 24 &&
              spanLimit < 48 &&
              spanLimit > differenceInHours(endOfDay(addDays(new Date(), 1)), new Date())
            ? addDays(new Date(), 2)
            : spanLimit >= 48 && spanLimit < 72
              ? addDays(new Date(), 2)
              : addDays(new Date(), 3);

  return days;
};
