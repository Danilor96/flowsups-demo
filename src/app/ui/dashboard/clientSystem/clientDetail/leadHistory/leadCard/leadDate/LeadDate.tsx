import { dateFormatsStore } from '@/store/dateFormats';

export function LeadDate({ date }: { date?: Date }) {
  // ----- global states -----

  const { dateFormatted } = dateFormatsStore();

  // ----- local states -----

  return (
    <p className="text-[1.7vh] text-[#585858] font-light leading-[1.805556.vh]">
      {dateFormatted(6, date)}
    </p>
  );
}
