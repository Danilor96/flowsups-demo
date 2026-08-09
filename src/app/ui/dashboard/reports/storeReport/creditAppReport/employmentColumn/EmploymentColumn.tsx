import { EmploymentColumn as EmploymentColumnType } from '@/app/api/reports/storeReport/creditApp/types';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';

export function EmploymentColumn({ employer }: { employer: EmploymentColumnType }) {
  // ----- global states -----

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  // ----- local states -----

  return (
    <div className="w-fit">
      <p>
        <span className="font-semibold">Employer name:</span>
        {` ${employer.employerName}`}
      </p>
      <p>
        <span className="font-semibold">Occupation:</span>
        {` ${employer.occupation}`}
      </p>
      <p>
        <span className="font-semibold">Length at job:</span>
        {` ${employer.lengthAtJob}`}
      </p>
      <p>
        <span className="font-semibold">Income:</span>
        {` $${employer.income}`}
      </p>
      <p>
        <span className="font-semibold">Work phone:</span>
        {` ${formatPhoneNumber(employer.workPhone)}`}
      </p>
    </div>
  );
}
