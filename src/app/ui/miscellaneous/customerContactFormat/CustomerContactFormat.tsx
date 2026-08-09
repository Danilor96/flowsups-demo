import { CustomerContactIcon } from '&/icons/Icons';
import { modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';

export function CustomerContactFormat({
  contact,
  customerId,
  marginInlineAuto,
  noIcon,
  fontSize,
  color,
}: {
  contact?: string;
  customerId?: number;
  marginInlineAuto?: boolean;
  noIcon?: boolean;
  fontSize?: number;
  color?: string;
}) {
  //   ----- global states -----

  const { openDashboardSmsModal } = modalWindowStore();
  const { getSingleClientData } = singleCLientDataStore();

  // ----- local states -----

  const contactCleaned = contact?.replace(/\D/g, '').slice(-10);

  const customerContactArray =
    contactCleaned && contactCleaned.length > 10 ? contactCleaned.slice(-10).split('') : contactCleaned?.split('');

  const customerContactFormatted = `${customerContactArray
    ?.slice(0, 3)
    .join('')}-${customerContactArray?.slice(3, 6).join('')}-${customerContactArray
    ?.slice(6, 10)
    .join('')}`;

  // handling open sms modal

  const handleSmsModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    customerId && getSingleClientData(customerId?.toString());

    customerId && openDashboardSmsModal();
  };

  // handling is a number

  const isANumber = (contactNumber: string) => {
    let isANumber: boolean = true;

    const parsingString = parseInt(contactNumber);

    const verifyingNumber = isNaN(parsingString);

    if (verifyingNumber) {
      isANumber = false;
    }

    return isANumber;
  };

  if (contact) {
    return (
      <div
        onClick={handleSmsModal}
        className="w-fit flex flex-row justify-center items-center gap-[.3vw]"
        style={{
          marginInline: marginInlineAuto ? 'auto' : '',
          cursor: customerId ? 'pointer' : 'default',
        }}
      >
        <p
          style={{
            fontSize: `${fontSize}vh`,
            color: color,
          }}
        >
          {customerContactFormatted}
        </p>
        {!noIcon && <CustomerContactIcon />}
      </div>
    );
  } else {
    return (
      <p
        style={{
          fontSize: `${fontSize}vh`,
          color: color,
        }}
      >
        No contact number
      </p>
    );
  }
}
