import { Permissions } from '@/app/libs/definitions/permissions/permissions';
import { useCan } from '@/hooks/permissions';
import { modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function CustomerName({
  customer,
  customerId,
  fontSize,
  mxAuto = true,
  salesRepId,
}: {
  customer?: string | null;
  customerId?: number | null;
  fontSize?: number;
  mxAuto?: boolean;
  salesRepId?: number | null;
}) {
  // ----- global states -----

  const { data: session } = useSession();

  const userId = session?.user.id;

  const { getSingleClientData } = singleCLientDataStore();
  const { openClientDetail } = modalWindowStore();
  const openInNewTab = modalWindowStore((state) => state.openInNewTab);

  const { can } = useCan();

  // ----- local states -----

  const handleButton = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    const hasGlobalPermission = can(Permissions.CustomerViewAnyCustomer);

    let hasAccess = false;

    if (hasGlobalPermission) {
      hasAccess = !!userId;
    } else {
      hasAccess = !salesRepId || userId === salesRepId;
    }

    if (customerId && hasAccess) {
      getSingleClientData(customerId?.toString());

      openClientDetail();
    }
  };

  if (customer) {
    return (
      <aside
        onClick={
          openInNewTab
            ? (e) => {
                e.stopPropagation();
              }
            : handleButton
        }
        className={`w-fit h-fit transition-colors ${mxAuto && 'mx-auto'} ${
          customerId && 'underline cursor-pointer hover:text-[#EEE] transition-colors'
        }`}
        style={{
          fontSize: fontSize && `${fontSize}vh`,
        }}
      >
        {openInNewTab && (
          <Link href={`/dashboard/customer/${customerId}`} target="_blank" rel="noreferrer">
            {customer}
          </Link>
        )}
        {!openInNewTab && `${customer}`}
      </aside>
    );
  } else {
    return <p>No customer name</p>;
  }
}
