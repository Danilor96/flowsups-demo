import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { CustomersStatuses, FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { Permissions } from '@/app/libs/definitions/permissions/permissions';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';
import { useCan } from '@/hooks/permissions';
import { modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';

export function CustomerInfo({
  id,
  name,
  phoneNumber,
  status,
  dataLength,
  index,
  bdcId,
  sellerId,
  customerStatusId,
  customerFundingListStatusId,
}: {
  id: number;
  name: string;
  phoneNumber?: string | null;
  status: string;
  dataLength: number;
  index: number;
  sellerId?: number | null;
  bdcId?: number | null;
  customerStatusId?: number | null;
  customerFundingListStatusId?: number | null;
}) {
  // ----- global states -----

  const { data: session } = useSession();

  const userRoleId = session?.user.user_has[0].role_id;
  const userId = session?.user.id;

  const { getSingleClientData } = singleCLientDataStore();
  const { openClientDetail } = modalWindowStore();

  const { can } = useCan();

  // ----- local states -----

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const hasGlobalPermission = can(Permissions.CustomerViewAnyCustomer);
    const isNewAndUnassigned = !sellerId && Number(status) === CustomersStatuses.New;
    const isOwner = !!userId && userId === sellerId;

    let hasAccess = false;

    if (hasGlobalPermission) {
      hasAccess = !!userId;
    } else {
      hasAccess = isNewAndUnassigned || isOwner;
    }

    if (id && hasAccess) {
      getSingleClientData(id.toString());

      openClientDetail();
    }
  };

  const firstRadiusStyleCondition = dataLength > 1 && index === 0 ? '0.520833vw' : '';

  const secondRadiusStyleCondition = index === dataLength - 1 ? '0.520833vw' : '';

  const customerIsReturnedStatus =
    customerStatusId === CustomersStatuses.Sold &&
    customerFundingListStatusId === FundingStatuses.Returned;

  const customerIsFundedStatus =
    customerStatusId === CustomersStatuses.Sold && customerFundingListStatusId === FundingStatuses.Funded;

  const customerStatus = customerIsReturnedStatus ? 'Returned' : customerIsFundedStatus ? 'Funded' : status;

  return (
    <li
      onClick={handleClick}
      className="w-full odd:bg-[#E6F6F3] even:bg-[#FFFFFF] hover:bg-[#f3f3f3] transition-colors"
      style={{
        borderTopRightRadius: firstRadiusStyleCondition,
        borderTopLeftRadius: firstRadiusStyleCondition,
        borderBottomRightRadius: secondRadiusStyleCondition,
        borderBottomLeftRadius: secondRadiusStyleCondition,
      }}
    >
      <div className="w-full flex flex-col text-left p-[0.7vw]">
        <Paragraph color="#00A78B">{name}</Paragraph>
        <aside className="w-fit flex flex-row justify-center items-center gap-[0.3vw] pointer-events-none">
          <Paragraph color="#00A78B">Phone:</Paragraph>
          <CustomerContactFormat contact={phoneNumber || ''} color="#B3B3B3" noIcon fontSize={1.8} />
        </aside>
        <aside className="w-fit flex flex-row justify-center items-center gap-[0.3vw]">
          <Paragraph color="#00A78B">Status: </Paragraph>
          <Paragraph color="#B3B3B3">{handlingCapitalWords(customerStatus)}</Paragraph>
        </aside>
      </div>
    </li>
  );
}
