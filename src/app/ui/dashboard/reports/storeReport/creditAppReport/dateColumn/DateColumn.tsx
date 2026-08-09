import { DateColumn as DateColumnType } from '@/app/api/reports/storeReport/creditApp/types';
import { dateFormatsStore } from '@/store/dateFormats';

export function DateColumn({ dateData }: { dateData: DateColumnType }) {
  // ----- global states -----

  const { dateFormatted } = dateFormatsStore();

  // ----- local states -----

  return (
    <div className="w-fit">
      <p>
        <span className="font-semibold">Created:</span>
        {` ${dateFormatted(2, dateData.createdAt)}`}
      </p>
      <p>
        <span className="font-semibold">Sales rep assigned:</span>
        {` ${dateData.salesRep}`}
      </p>
      <p>
        <span className="font-semibold">Days old:</span>
        {` ${dateData.daysOld}`}
      </p>
      <p>
        <span className="font-semibold">Last contacted day:</span>
        {` ${dateFormatted(2, dateData.lastContactedDay)}`}
      </p>
    </div>
  );
}
