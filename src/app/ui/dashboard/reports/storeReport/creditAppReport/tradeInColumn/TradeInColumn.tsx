import { TradeInVehicleColumn } from '@/app/api/reports/storeReport/creditApp/types';

export function TradeInColumn({ vehicle }: { vehicle?: TradeInVehicleColumn }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <div className="w-fit">
      <p>{`${vehicle?.vehicle}`}</p>
      <p>
        <span className="font-semibold">VIN:</span> {` ${vehicle?.vin}`}
      </p>
      <p>
        <span className="font-semibold">Millage:</span> {` ${vehicle?.millage}`}
      </p>
      <p>
        <span className="font-semibold">Price:</span> {` $${vehicle?.price}`}
      </p>
    </div>
  );
}
