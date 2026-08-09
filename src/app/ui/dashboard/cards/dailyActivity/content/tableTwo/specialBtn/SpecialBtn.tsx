import { Button } from '&/buttons/Button';
import { EndVisit } from '&/dashboard/endVisit/EndVisit';
import { Can } from '@/app/ui/auth/Can';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { adminDashboardStore } from '@/store/adminDashboard';

export function SpecialBtn({
  appointmentId,
  salesRep,
  sellerId,
  leadType,
  customer,
  homePhone,
  address,
  workPhone,
  email,
  mobilePhone,
  vehicleId,
  customerId,
  salesManagerId,
}: {
  appointmentId: number;
  salesRep: string;
  sellerId?: number | null;
  leadType: string;
  customer: string;
  homePhone: string;
  address: string;
  workPhone: string;
  email: string;
  mobilePhone: string;
  vehicleId?: number;
  customerId: number;
  salesManagerId?: number;
}) {
  // ----- global states -----

  const { depositOpenedFromEndVisit, endVisitWithDeposit } = adminDashboardStore();

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler('floating-portal-container');

  return (
    <div ref={ref}>
      <Can requiredPermission={8}>
        <Button
          backgroundColor="#C9EBE6"
          textColor="#41B4A0"
          border={0.138889}
          borderColor="#00A78B"
          buttonTextSize={2}
          width={5.15625}
          borderRadius={1.2}
          buttonText="End Visit"
          identity=""
          onClick={toggleOpen}
        />
        {(isOpen || endVisitWithDeposit || depositOpenedFromEndVisit) && (
          <EndVisit
            appointmentId={appointmentId.toString()}
            salesRep={salesRep}
            sellerId={sellerId}
            leadType={leadType}
            customer={customer}
            homePhone={homePhone}
            address={address}
            workPhone={workPhone}
            email={email}
            mobilePhone={mobilePhone}
            vehicleId={vehicleId}
            customerId={customerId}
            salesManagerId={salesManagerId}
            toggleOpen={toggleOpen}
          />
        )}
      </Can>
    </div>
  );
}
