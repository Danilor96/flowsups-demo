/* eslint-disable @next/next/no-img-element */
import { VehicleColumn as VehicleColumnType } from '@/app/api/reports/storeReport/creditApp/types';
import { numberFormatterStore } from '@/store/adminDashboard';

export function VehicleColumn({ vehicle }: { vehicle?: VehicleColumnType }) {
  // ----- global states -----

  const { numberFilter } = numberFormatterStore();

  // ----- local states -----

  return (
    <div className="w-fit flex flex-row justify-center items-center gap-[0.5vw]">
      <aside>
        <p>{`${vehicle?.vehicle}`}</p>
        <p>
          <span className="font-semibold">Price:</span> {` $${numberFilter(vehicle?.price || '0')}`}
        </p>
        <p>{`${vehicle?.millage}`}</p>
        <p>{`${vehicle?.vin}`}</p>
        <p>
          <span className="font-semibold">Stock #:</span> {` ${vehicle?.stockNumber}`}
        </p>
      </aside>
      <aside className="w-[8vw] h-[16vh] rounded-[0.52vw] border-[0.25vw] border-white overflow-hidden">
        <img
          src={vehicle?.img || ''}
          alt="Interesting vehicle image"
          className="w-full h-full object-cover"
        />
      </aside>
    </div>
  );
}
