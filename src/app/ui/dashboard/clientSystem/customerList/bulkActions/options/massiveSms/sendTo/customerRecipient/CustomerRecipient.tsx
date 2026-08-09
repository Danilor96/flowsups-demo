import { XIcon } from '@/app/ui/icons/Icons';
import { adminDashboardStore, singleCLientDataStore } from '@/store/adminDashboard';
import Link from 'next/link';

export function CustomerRecipient({
  id,
  email,
  firstname,
  lastname,
  showEmails,
}: {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  showEmails?: boolean;
}) {
  // ----- global

  const setSelectedCustomersIds = adminDashboardStore((state) => state.setSelectedCustomersIds);
  const selectedCustomersIds = adminDashboardStore((state) => state.selectedCustomersIds);

  const singleCLientData = singleCLientDataStore((state) => state.singleCLientData);

  // ----- local

  const colSpanHandler = (name: string, lastName: string) => {
    const MAX_LETTERS = 12;

    if (typeof name !== 'string' || typeof lastName !== 'string') {
      return false;
    }

    const totalLetters = name.length + lastName.length;

    return totalLetters > MAX_LETTERS;
  };

  const handleRemoveCustomer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { customer } = e.currentTarget.dataset;

    if (customer) {
      const newData = selectedCustomersIds.filter((el) => el.toString() !== customer);

      setSelectedCustomersIds(newData);
    }
  };

  return (
    <article
      className={`w-fit flex flex-row gap-[0.6vw] justify-center items-center px-[0.2vw] py-[0.3vh] rounded-md text-[#00a78b] bg-[#C9EBE6] ${
        colSpanHandler(showEmails ? email || '' : firstname, showEmails ? '' : lastname) &&
        'col-span-2'
      }`}
      style={{
        height: showEmails ? '4.9vh' : '4.5vh',
      }}
    >
      <Link
        href={`/dashboard/customer/${id}`}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col gap-[0.6vh] justify-center items-center text-[2vh] font-normal text-wrap"
      >
        {showEmails && <p className="text-[1.7vh]">{`(${firstname} ${lastname})`}</p>}
        <p>{`${showEmails ? email : firstname} ${showEmails ? '' : lastname}`}</p>
      </Link>
      {!singleCLientData && (
        <aside className="h-full flex justify-center items-center">
          <button
            className="w-fit h-fit rounded-full"
            data-customer={id}
            onClick={handleRemoveCustomer}
          >
            <XIcon width={12.5} height={12.5} />
          </button>
        </aside>
      )}
    </article>
  );
}
