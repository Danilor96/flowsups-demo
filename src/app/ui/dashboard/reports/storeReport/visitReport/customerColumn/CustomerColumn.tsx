import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';

export function CustomerColumn({
  cellPhone,
  email,
  fullName,
  homePhone,
  salesRepName,
}: {
  fullName: string;
  homePhone: string;
  cellPhone: string;
  email: string;
  salesRepName: string;
}) {
  // ----- global states -----

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  // ----- local states -----

  return (
    <div className="h-fit flex flex-col items-start">
      <p className="text-nowrap">{fullName}</p>
      <p className="text-nowrap">{`H: ${formatPhoneNumber(homePhone)}`}</p>
      <p className="text-nowrap">{`C: ${formatPhoneNumber(cellPhone)}`}</p>
      <p className="text-nowrap">{`Email: ${email}`}</p>
      <p className="text-nowrap">{`Sales Rep: ${salesRepName}`}</p>
    </div>
  );
}

// w-[11.5vw]
