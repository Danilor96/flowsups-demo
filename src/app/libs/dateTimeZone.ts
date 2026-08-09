import { startOfDay, endOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz';

const timeZone = 'America/New_York';

export function getStartOfTodayInUTC() {
  const now = new Date();
  const zoned = toZonedTime(now, timeZone);

  return fromZonedTime(startOfDay(zoned), timeZone);
}

export function getEndOfTodayInUTC() {
  const now = new Date();
  const zoned = toZonedTime(now, timeZone);
  const end = endOfDay(zoned);
  return fromZonedTime(end, timeZone);
}

export function zonedTime(date: Date) {
  return toZonedTime(date, timeZone);
}


  const convertTo24Hours = (time: string) => {
    const [hour, minutes, period] = time.split(/:| /);
    let hora24 = parseInt(hour);

    if (period.toLowerCase() === 'pm' && hora24 !== 12) {
      hora24 += 12;
    } else if (period.toLowerCase() === 'am' && hora24 === 12) {
      hora24 = 0;
    }

    return {
      hour: hora24,
      minutes: parseInt(minutes),
    };
  };

export function dateToUTCfromInputDateString(inputDateString: string) {
  const [datePart, timePart] = inputDateString.split(', ');

  if (!datePart || !timePart) return inputDateString;

  const [month, day, year] = datePart.split('/');

  const timeTo24 = convertTo24Hours(timePart);

  const isoDateString = `${year}-${month}-${day}T${timeTo24.hour.toString().padStart(2, '0')}:${timeTo24.minutes.toString().padStart(2, '0')}:00`;
  const localDate = new Date(isoDateString);
  console.log({ isoDateString , localDate});

  return localDate.toISOString();
}