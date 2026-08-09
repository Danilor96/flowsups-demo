import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { AnimatePresence } from 'framer-motion';
import { MassiveSms } from '&/dashboard/clientSystem/customerList/bulkActions/options/massiveSms/MassiveSms';
import { ReassignLeads } from '&/dashboard/clientSystem/customerList/bulkActions/options/reassignLeads/ReassignLeads';
import { CustomerStatus } from '&/dashboard/clientSystem/customerList/bulkActions/options/customerStatus/CustomerStatus';
import { LeadTemperature } from '&/dashboard/clientSystem/customerList/bulkActions/options/leadTemperature/LeadTemperature';
import { ConsentSms } from '&/dashboard/clientSystem/customerList/bulkActions/options/consentSms/ConsentSms';
import { MassiveEmails } from '&/dashboard/clientSystem/customerList/bulkActions/options/massiveEmails/MassiveEmails';
import { SetUpADeal } from '&/dashboard/clientSystem/clientDetail/middleButtonsOptions/setUpADeal/SetUpADeal';
import { Can } from '&/auth/Can';

export function BulkActionsModals() {
  // ----- global states -----

  const {
    bulkSetUpADeal,
    massiveSms,
    massiveEmails,
    reassignLeads,
    customerStatus,
    bulkLeadTemperature,
    bulkConsentSms,
  } = modalWindowStore();

  const { selectedCustomersIds } = adminDashboardStore();

  // ----- local states -----

  return (
    <AnimatePresence>
      {bulkSetUpADeal && selectedCustomersIds.length > 0 && (
        <Can requiredPermission={57}>
          <SetUpADeal />
        </Can>
      )}
      {massiveSms && (
        <Can requiredPermission={58}>
          <MassiveSms />
        </Can>
      )}
      {massiveEmails && (
        <Can requiredPermission={59}>
          <MassiveEmails />
        </Can>
      )}
      {reassignLeads && (
        <Can requiredPermission={60}>
          <ReassignLeads />
        </Can>
      )}
      {customerStatus && (
        <Can requiredPermission={61}>
          <CustomerStatus />
        </Can>
      )}
      {bulkLeadTemperature && (
        <Can requiredPermission={62}>
          <LeadTemperature />
        </Can>
      )}
      {bulkConsentSms && (
        <Can requiredPermission={63}>
          <ConsentSms />
        </Can>
      )}
    </AnimatePresence>
  );
}
