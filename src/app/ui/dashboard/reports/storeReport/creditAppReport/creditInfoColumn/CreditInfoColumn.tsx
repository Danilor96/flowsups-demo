import { CreditInfoColumn } from '@/app/api/reports/storeReport/creditApp/types';

export function CreditAppInfoColumn({ creditAppInfo }: { creditAppInfo: CreditInfoColumn }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <div className="w-fit">
      <p>
        <span className="font-semibold">Bank Account:</span> {` ${creditAppInfo.bank}`}
      </p>
      <p>
        <span className="font-semibold">Income Type:</span> {` ${creditAppInfo.incomeType}`}
      </p>
      <p>
        <span className="font-semibold">SSN/ITIN:</span> {` ${creditAppInfo.ssnTin}`}
      </p>
      <p>
        <span className="font-semibold">Cash down:</span> {` $${creditAppInfo.cashDown}`}
      </p>
    </div>
  );
}
