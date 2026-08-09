export const formatDateWithTime = (date: string, hour: string, minute: string) => {
  const fromDate = new Date(`${date}T00:00:00Z`);

  fromDate.setUTCHours(parseInt(hour), parseInt(minute), 0, 0);

  let hours = fromDate.getUTCHours();
  const minutes = fromDate.getUTCMinutes();

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutesFormatted} ${ampm}`;
};

export function formatDateClientWithAMPM(isoDate: string): string {
  const year = isoDate.substring(0, 4);
  const month = isoDate.substring(5, 7);
  const day = isoDate.substring(8, 10);
  let hour = parseInt(isoDate.substring(11, 13), 10);
  const minute = isoDate.substring(14, 16);
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12;
  hour = hour ? hour : 12;

  return `${month}-${day}-${year}, ${hour}:${minute} ${ampm}`;
}