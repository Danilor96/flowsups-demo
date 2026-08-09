import { CustomersStatuses, FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { Permissions } from '@/app/libs/definitions/permissions/permissions';
import { useCan } from '@/hooks/permissions';
import { singleCLientDataStore } from '@/store/adminDashboard';
import { leadsStore } from '@/store/leads';

export function StatusContainer({
  status,
  statusId,
  onClick,
}: {
  status: string;
  statusId: number;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();
  const { leads, currentLead } = leadsStore();

  const { can } = useCan();

  // ----- local states -----

  const handleActiveStatus = (statusID: number) => {
    const activeLeadStatus =
      leads &&
      leads.length > 0 &&
      leads.find((el) => el.id.toString() === currentLead)?.customer_status?.id;
    const customerStatus = singleCLientData?.client_status?.id;
    const customerIsFundedStatus =
      singleCLientData?.client_status?.id === CustomersStatuses.Sold &&
      singleCLientData?.funding_list_status_id === FundingStatuses.Funded;

    if (customerIsFundedStatus && statusID === CustomersStatuses.Funded) return true;

    if (customerIsFundedStatus && statusID === CustomersStatuses.Sold) return false;
    return activeLeadStatus ? activeLeadStatus === statusID : customerStatus === statusID;
  };

  const leadActive = singleCLientData?.lead && singleCLientData?.lead.length > 0 ? singleCLientData?.lead[0] : null;
  const customerIsReturned =
    leadActive?.customer_status_id === CustomersStatuses.Sold &&
    leadActive?.customer_funding_list_status_id === FundingStatuses.Returned;

  const statusRender = customerIsReturned && statusId === CustomersStatuses.Sold ? 'Returned' : status;

  return (
    <button
      onClick={onClick}
      value={statusId}
      className={`w-[10.953646vw] h-[4.093519vh] capitalize flex justify-center items-center text-[1.759259vh] font-semibold leading-[1.805556vh] text-[#00A78B] rounded-[0.520833vw] border-[0.15625vw] border-[#00A78B] transition-colors ${
        handleActiveStatus(statusId)
          ? 'bg-[#C9EBE6] border-[#C9EBE6]'
          : can([79]) ||
              (statusId === CustomersStatuses.Lost && can(Permissions.CustomerMarkAsLost)) ||
              (statusId === CustomersStatuses.Sold && can(Permissions.CustomerMarkAsSold))
            ? 'hover:bg-[#00A78B] hover:text-white'
            : 'cursor-default'
      }`}
      disabled={handleActiveStatus(statusId)}
    >
      {statusRender}
    </button>
  );
}
