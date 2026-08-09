import { dateFormatsStore } from '@/store/dateFormats';

export function MessageDate({ messageDate }: { messageDate: Date | null }) {
  // ----- global states -----

  const { dateFormatted } = dateFormatsStore();

  // ----- local states -----

  const handleMessageDate = (date: Date | null) => {
    let newDate = dateFormatted(3, date);

    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);

    if (date && new Date(date) > new Date(todayStart) && new Date(date) < new Date(todayEnd)) {
      newDate = `today ${dateFormatted(1, date)}`;
    }

    return newDate;
  };

  return <p className="text-[1.666667vh] text-[#FFF]">{handleMessageDate(messageDate)}</p>;
}
