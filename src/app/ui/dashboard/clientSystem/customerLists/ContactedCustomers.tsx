import { SpecificClient } from '@/app/libs/definitions';
import { OneFireLead, ThreeFiresLead, TwoFiresLead } from '&/icons/Icons';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { VehicleFormat } from '&/miscellaneous/vehicleFormat/VehicleFormat';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import CustomerListFilter from './Filter';
import { useFilters } from './Filter/useFilters';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { DateFormats } from '&/miscellaneous/dateFormats/DateFormats';
import { dateFormatsStore } from '@/store/dateFormats';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { formatVehicle } from './utils/utils';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { UserAssignedName } from '@/app/ui/miscellaneous/userAssignedName/UserAssignedName';

export function ContactedCustomers() {
  // ------- global states -------

  const { closeContactedCustomersList } = modalWindowStore();

  const { specificClientsData } = adminDashboardStore();
  const { clearSpecificClientsData } = adminDashboardStore();

  const { dateFormatted } = dateFormatsStore();

  // ------- local states -------
  const [loading, setLoading] = useState(true);
  const { filters, filterCustomer, updateFilter, clearFilters } = useFilters();
  const [showFilter, setShowFilter] = useState(true);

  const handleCloseWindow = () => {
    clearSpecificClientsData();
    closeContactedCustomersList();
  };

  const clientDaysOld = (creationDate: Date) => {
    const today = DateTime.now().toISO().split('T', 1)[0];

    const clientCreation = new Date(creationDate).toISOString().split('T', 1)[0];

    const formatedTodayDate = DateTime.fromISO(today);

    const formatedCreationDate = DateTime.fromISO(clientCreation);

    const diffInDays = formatedTodayDate.diff(formatedCreationDate, 'days');

    return `${
      diffInDays.toObject().days == 0
        ? 'Created today'
        : diffInDays.toObject().days == 1
          ? `${diffInDays.toObject().days} day`
          : `${diffInDays.toObject().days} days`
    }`;
  };

  const [doFetch, setDoFetch] = useState(false);

  // ------- computed values -------
  const contactedClientsFiltered = useMemo(
    () => filterCustomer(specificClientsData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [specificClientsData, doFetch],
  );

  const initialColumnsDef = {
    customer_name: true,
    phone_number: true,
    assigned_to: true,
    last_contacted_day: true,
    contact_time: true,
    interested_vehicle: true,
    days_old: true,
    days_in: true,
    lead_temperature: true,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: SpecificClient) => any } =
    {
      customer_name: (el) => (
        <CustomerName
          customer={`${el.first_name || ''} ${el.last_name || ''}`}
          customerId={el.id}
        />
      ),
      phone_number: (el) => (
        <CustomerContactFormat contact={el.mobile_phone} customerId={el.id} marginInlineAuto />
      ),
      assigned_to: (el) => el.seller?.id ? <UserAssignedName seller={el.seller} /> : 'No Assignations',
      last_contacted_day: (el) => dateFormatted(3, el.last_activity),
      contact_time: (el) => el.contact_time?.time,
      interested_vehicle: (el) => <VehicleFormat interestedVehicle={el.interested_vehicle} />,
      days_old: (el) => `${el.created_at && clientDaysOld(el.created_at)}`,
      days_in: (el) =>
        el.client_status_changed_at ? (
          <DateFormats date={el.client_status_changed_at} format={2} />
        ) : (
          'N/A'
        ),
      lead_temperature: (el) =>
        el.client_lead_temperature?.id == 1 ? (
          <OneFireLead color="#FFF" />
        ) : el.client_lead_temperature?.id == 2 ? (
          <TwoFiresLead color="#FFF" />
        ) : el.client_lead_temperature?.id == 3 ? (
          <ThreeFiresLead color="#FFF" />
        ) : (
          false
        ),
    };

  const { columns } = useDynamicTableColumns<SpecificClient, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: {
      customer_name: { size: 220 },
      assigned_to: { size: 180 },
      contact_time: { size: 180 },
      last_contacted_day: { size: 230 },
      interested_vehicle: { size: 200 },
      phone_number: { size: 180 },
      days_old: { size: 130 },
      days_in: { size: 130 },
      lead_temperature: { size: 200 },
    },
    columnRenderers,
    accessorFnMapper: {
      customer_name: (el) => `${el.first_name || ''} ${el.last_name || ''}`,
      phone_number: (el) => el.mobile_phone,
      assigned_to: (el) => `${el.seller?.id ? 'Sales Consultant' : 'No Assignations'}`,
      last_contacted_day: (el) => dateFormatted(3, el.last_activity),
      contact_time: (el) => el.contact_time?.time,
      interested_vehicle: (el) => formatVehicle(el.interested_vehicle),
      days_old: (el) => `${el.created_at && clientDaysOld(el.created_at)}`,
      days_in: (el) =>
        el.client_status_changed_at ? `${clientDaysOld(el.client_status_changed_at)}` : '',
      lead_temperature: (el) => el.client_lead_temperature?.temperature,
    },
    filterableColumns: [
      'customer_name',
      'phone_number',
      'assigned_to',
      'last_contacted_day',
      'contact_time',
      'interested_vehicle',
      'days_old',
      'days_in',
    ],
  });

  return (
    <ModalWindow top={-13.7}>
      <ModalContainer width={95.8125} marginTop={3.555556}>
        <ModalContainerTitle
          title="Contacted"
          closeWindowFunction={handleCloseWindow}
          openNewTab
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={[]}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={async () => setDoFetch(!doFetch)}
              options={{ moreOptionsIsVisible: false }}
            />
          }
        />
        <ModalContent>
          {showFilter && (
            <CustomerListFilter
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              setLoading={setLoading}
              setDoFetch={setDoFetch}
              doDataFetch={doFetch}
              specificCustomerStatusId={2}
              visibleFiltersOptions={{
                contactTimeId: true,
                leadTemperature: true,
                interestedVehicle: true,
                daysIn: true,
              }}
            />
          )}
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={contactedClientsFiltered || []}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              itemsPerPage={8}
              loading={loading}
              paginationIsActive
              textColor="#FFF"
              height={showFilter ? 54 : 60}
              rowSelectionIsActive={false}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
