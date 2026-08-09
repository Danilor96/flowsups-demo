import { CustomerColumn as CustomerColumnType } from '@/app/api/reports/storeReport/creditApp/types';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { dateFormatsStore } from '@/store/dateFormats';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';

export function CustomerColumn({ customer }: { customer: CustomerColumnType }) {
  // ----- global states -----

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { dateFormatted } = dateFormatsStore();

  // ----- local states -----

  return (
    <div className="w-fit flex flex-row justify-center items-start gap-[0.5vw]">
      <aside>
        <p className="w-fit flex flex-row justify-start gap-[0.5vw]">
          <span className="font-semibold">Full name:</span>
          <CustomerName customer={customer.customerName} customerId={customer.customerId} />
        </p>
        <p>
          <span className="font-semibold">Cell phone:</span>{' '}
          {` ${formatPhoneNumber(customer.cellPhone)}`}
        </p>
        <p>
          <span className="font-semibold">Home phone:</span>{' '}
          {` ${formatPhoneNumber(customer.homePhone)}`}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {` ${customer.email}`}
        </p>
        <p>
          <span className="font-semibold">DOB:</span> {` ${dateFormatted(2, customer.dateOfBirth)}`}
        </p>
      </aside>
      <aside>
        <p>
          <span className="font-semibold">City:</span> {` ${customer.city}`}
        </p>
        <p>
          <span className="font-semibold">State:</span> {` ${customer.state}`}
        </p>
        <p>
          <span className="font-semibold">Zip code:</span> {` ${customer.zip}`}
        </p>
      </aside>
    </div>
  );
}
