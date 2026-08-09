import {
  startOfToday,
  endOfToday,
  startOfTomorrow,
  endOfTomorrow,
  startOfYesterday,
  endOfYesterday,
  subDays,
  subMonths,
  subYears,
  startOfQuarter,
  endOfQuarter,
  setQuarter,
  addDays,
  addMonths,
  addYears,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export const buildDateQueryString = (
  filter: {
    optionDate?: string | undefined;
    valueDate?: string | undefined;
    fromDate?: string | undefined;
    toDate?: string | undefined;
  } | null,
  customDateName?: string | null,
): string => {
  if (!filter) {
    return '';
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filter)) {
    if (value !== null && value !== undefined && value !== '') {
      const keyName = customDateName ? key.replace('Date', `${customDateName}Date`) : key;

      params.append(keyName, String(value));
    }
  }
  return params.toString();
};

export const getStartOfDay = (date: Date | string, timeZone: string) : Date => {
  // const pureDate = dateStr.split('T')[0]; 
    // 2. Forzamos las 00:00 en la zona del cliente
  // fromZonedTime(startOfDay(toZonedTime(date, timeZone)), timeZone);

  let datePart: string;
  
  if (date instanceof Date) {
    datePart = format(toZonedTime(date, timeZone), 'yyyy-MM-dd');
  } else {
    datePart = date.includes('T') ? date.split('T')[0] : date;
  }

  return fromZonedTime(`${datePart} 00:00:00`, timeZone);
}

export const getEndOfDay = (date: Date | string, timeZone: string) : Date => {
  // fromZonedTime(endOfDay(toZonedTime(new Date(date), timeZone)), timeZone);
  let datePart: string;

  if (date instanceof Date) {
    datePart = format(toZonedTime(date, timeZone), 'yyyy-MM-dd');
  } else {
    datePart = date.includes('T') ? date.split('T')[0] : date;
  }

  return fromZonedTime(`${datePart} 23:59:59.999`, timeZone);
}


export function buildDatePrismaFilter(
  filter: {
    option?: string | null;
    value?: string | null;
    from?: string | null;
    to?: string | null;
  } | null,
  timeZone: string = 'America/Chicago',
): { gte?: Date; lte?: Date } | undefined {
  if (!filter || !filter.option) {
    return undefined;
  }

  const { option, value, from, to } = filter;
  const now = new Date();
  const nowInClientZone = now //toZonedTime(now, timeZone);
  console.log({ timeZone, nowServer: now, nowInClientZone, get: getStartOfDay(nowInClientZone, timeZone) });

  switch (option) {
    case '2': // today
      return { gte: getStartOfDay(nowInClientZone, timeZone), lte: getEndOfDay(nowInClientZone, timeZone) };
    case '3': // tomorrow
      const tomorrow = addDays(nowInClientZone, 1);
      return { gte: getStartOfDay(tomorrow, timeZone), lte: getEndOfDay(tomorrow, timeZone) };
    case '12': // yesterday
      const yesterday = subDays(nowInClientZone, 1);
      return { gte: getStartOfDay(yesterday, timeZone), lte: getEndOfDay(yesterday, timeZone) };
    case '13': // between
      if (!from || !to) return undefined;
      if (from && !to) return { gte: getStartOfDay(from, timeZone) };
      console.log({
        fronString: from,
        toString: to,
        fromWhitStartOfDay: getStartOfDay(from, timeZone),
        toWhitEndOfDay: getEndOfDay(to, timeZone),
      });

      return { gte: getStartOfDay(from, timeZone), lte: getEndOfDay(to, timeZone) };
    case '4': // previous
      // 1. Calculamos el inicio y fin de "Hoy" en la zona del cliente
      const startOfTodayClient = startOfDay(nowInClientZone); // Sigue en zona cliente
      const endOfTodayClient = endOfDay(nowInClientZone); // Sigue en zona cliente
      let gteClient: Date;

      if (value === 'week') {
        gteClient = subDays(startOfTodayClient, 7);
      } else if (value === 'month') {
        gteClient = subMonths(startOfTodayClient, 1);
      } else if (value === 'year') {
        gteClient = subYears(startOfTodayClient, 1);
      } else {
        return undefined;
      }
      console.log({ startOfTodayClient, gteClient, endOfTodayClient, timeZone });
      return { gte: fromZonedTime(gteClient, timeZone), lte: fromZonedTime(endOfTodayClient, timeZone) };
    case '5': // upcoming
      const startOfToday = getStartOfDay(nowInClientZone, timeZone);
      if (value === 'week') {
        return { gte: startOfToday, lte: getEndOfDay(addDays(nowInClientZone, 7), timeZone) };
      }
      if (value === 'month') {
        return { gte: startOfToday, lte: getEndOfDay(addMonths(nowInClientZone, 1), timeZone) };
      }
      if (value === 'year') {
        return { gte: startOfToday, lte: getEndOfDay(addYears(nowInClientZone, 1), timeZone) };
      }
      return undefined;
    case '6':
    case '7':
    case '8':
    case '9': // Quarters
      const qMap: Record<string, number> = { '6': 1, '7': 2, '8': 3, '9': 4 };
      const qDate = setQuarter(nowInClientZone, qMap[option]);
      return {
        gte: fromZonedTime(startOfQuarter(qDate), timeZone),
        lte: fromZonedTime(endOfQuarter(qDate), timeZone),
      };
    case '10': // last x days
      if (!value) return undefined;
      return {
        gte: getStartOfDay(subDays(nowInClientZone, parseInt(value, 10)), timeZone),
        lte: getEndOfDay(nowInClientZone, timeZone),
      };
    case '11': // last x months
      if (!value) return undefined;
      return {
        gte: getStartOfDay(subMonths(nowInClientZone, parseInt(value, 10)), timeZone),
        lte: getEndOfDay(nowInClientZone, timeZone),
      };
    default:
      return undefined;
  }
}
