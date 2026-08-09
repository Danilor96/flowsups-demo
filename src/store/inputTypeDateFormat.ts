import { create } from 'zustand';
import { isExists, format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { DayTime } from '@/app/libs/definitions';
import { adminDashboardStore } from './adminDashboard';
import { timeFormattedStore } from './dateFormats';

interface InputValue {
  formatDate: (value?: string, timeValue?: string) => string;
  formatIncomingObjectDate: (
    date: Date | null | undefined,
    useInNativeInput?: { useInNativeInput: boolean },
  ) => string;
  formatIncomingObjectDateForInputTypeDate: (date: Date | null | undefined) => string;
  checkTimeForSelectedDate: (timeAvailableOptions: DayTime, timeSelected?: string) => string;
  addTwoHours: (timeSelected: string) => string;
  dateTimePicked: (date: string, time: string) => Date;
}

const inputTypeDateFormatStore = create<InputValue>((set, get) => ({
  formatDate: (value, timeValue) => {
    if (value) {
      let newValue: string = value.replace(/\D/g, '').slice(0, 8);

      if (newValue.length <= 2) {
        return `${newValue}`;
      }

      if (newValue.length > 2 && newValue.length <= 4) {
        return `${newValue.slice(0, 2)}/${newValue.slice(2)}`;
      }

      const year = parseInt(newValue.slice(4));
      const month = parseInt(newValue.slice(0, 2)) - 1;
      const day = parseInt(newValue.slice(2, 4));

      if (newValue.length === 8 && !isExists(year, month, day)) {
        return '';
      }

      if (value.length === 19) {
        return `${newValue.slice(0, 2)}/${newValue.slice(2, 4)}/${newValue.slice(4)}`;
      }

      return `${newValue.slice(0, 2)}/${newValue.slice(2, 4)}/${newValue.slice(4)}${
        timeValue ? (newValue.length === 8 ? `, ${timeValue}` : '') : ''
      }`;
    } else {
      return '';
    }
  },
  formatIncomingObjectDate: (date, useInNativeInput) => {
    if (typeof date === 'undefined' || date === null) return '';

    let dateFormatted = '';

    const dateObj = new Date(date);

    const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;

    const dateInUtc = new Date(dateObj.getTime() + userTimezoneOffset);

    if (useInNativeInput?.useInNativeInput) {
      dateFormatted = format(dateInUtc, 'yyyy-MM-dd');
    } else {
      dateFormatted = format(dateInUtc, 'MM/dd/yyyy', { locale: es });
    }

    return dateFormatted;
  },
  formatIncomingObjectDateForInputTypeDate: (date) => {
    if (date && typeof date !== 'undefined' && date !== null) {
      const dateFormatted = format(date, 'yyyy-MM-dd', { locale: enUS });

      return dateFormatted;
    } else {
      return '';
    }
  },
  checkTimeForSelectedDate: (timeAvailableOptions, timeSelected) => {
    if (timeSelected && timeAvailableOptions) {
      const availableTime = timeAvailableOptions.find((time) => time.time === timeSelected);

      if (availableTime) availableTime.time;
    }

    return '';
  },
  addTwoHours: (timeSelected) => {
    const { dayTime } = adminDashboardStore.getState();

    if (dayTime && dayTime.length > 0) {
      const timeSelectedId = dayTime.find((time) => time.time === timeSelected)?.id;

      if (timeSelectedId) {
        const twoHoursAdded = dayTime.find((time) => time.id === timeSelectedId + 4);

        if (twoHoursAdded) return twoHoursAdded.time;
      }
    }

    return '';
  },
  dateTimePicked: (date, time) => {
    const { convertTimeTo24HourFormat } = timeFormattedStore.getState();

    const [year, month, day] = date.split('-');

    const timeFormatted = convertTimeTo24HourFormat(time);
    const [hour, minute] = timeFormatted.split(':');

    const dateFormatted = `${year}-${month}-${day}`;
    return new Date(`${dateFormatted}T${timeFormatted}:00`);
  },
}));

export default inputTypeDateFormatStore;
