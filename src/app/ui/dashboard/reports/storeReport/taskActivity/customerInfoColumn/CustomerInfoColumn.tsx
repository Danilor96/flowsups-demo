import { CustomerName } from '@/app/ui/miscellaneous/customerName/CustomerName';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';

export function CustomerInfoColumn({
  email,
  fullname,
  phoneNumber,
  subject,
  customerId,
}: {
  fullname: string;
  phoneNumber: string;
  email: string;
  subject: string;
  customerId: number | null;
}) {
  // ----- global status -----

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  // ----- local status -----

  return (
    <aside className="flex flex-col text-wrap">
      <p className="w-fit flex flex-row gap-[0.25vw]">
        Full name: <CustomerName customer={fullname} customerId={customerId} />
      </p>
      <p>{`Cell phone: ${formatPhoneNumber(phoneNumber)}`}</p>
      <p>{`Email: ${email}`}</p>
      <p>{`Subject: ${subject}`}</p>
    </aside>
  );
}
