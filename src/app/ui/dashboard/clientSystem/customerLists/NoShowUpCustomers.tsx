import { SpecificClient } from '@/app/libs/definitions';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { useEffect, useMemo, useState } from 'react';
import { VehicleFormat } from '&/miscellaneous/vehicleFormat/VehicleFormat';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { NoteButton } from '&/miscellaneous/notesWindow/noteButton/NoteButton';
import { useFilters } from './Filter/useFilters';
import CustomerListFilter from './Filter';
import { ButtonContainer } from '@/app/ui/buttons/ButtonContainer';
import { DateFormats } from '@/app/ui/miscellaneous/dateFormats/DateFormats';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { daysOld, formatVehicle } from './utils/utils';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';

export function NoShowUpCustomers() {
  // ------- global states -------

  const { closeNoShowUpCustomersList } = modalWindowStore();

  const { specificClientsData } = adminDashboardStore();
  const {
    getSpecificClientsNotes,
    clearSpecificClientsData,
    clearSpecificClientsNotes,
    setNoteFromIdSelected,
    setNoteCustomerStatusIdSelected,
  } = adminDashboardStore();

  useEffect(() => {
    getSpecificClientsNotes('8');
    setNoteFromIdSelected(4);
    setNoteCustomerStatusIdSelected(8);
  }, [getSpecificClientsNotes, setNoteFromIdSelected, setNoteCustomerStatusIdSelected]);

  // ------- local states -------

  const [doFetch, setDoFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const { filters, filterCustomer, updateFilter, clearFilters } = useFilters();
  const [showFilter, setShowFilter] = useState(true);

  const handleCloseWindow = () => {
    clearSpecificClientsData();
    clearSpecificClientsNotes();
    closeNoShowUpCustomersList();
  };

  // ------- computed values -------
  const NoShowUpCustomersListFiltered = useMemo(
    () => filterCustomer(specificClientsData),
    [doFetch, specificClientsData],
  );

  const initialColumnsDef = {
    customer_name: true,
    phone_number: true,
    assigned_to: true,
    appt_date: true,
    last_contacted_day: true,
    interested_vehicle: true,
    days_old: true,
    days_in: true,
    note: true,
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
      assigned_to: (el) =>
        `${el.seller?.id ? `${el.seller.name || ''} ${el.seller.last_name || ''}` : ''}`,
      appt_date: (el) =>
        el.appointment
          ?.find((el) => el.end_date && new Date(el.end_date).getTime() >= new Date().getTime())
          ?.end_date?.toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
      last_contacted_day: (el) =>
        el.last_activity ? <DateFormats date={el.last_activity} format={2} /> : '',
      interested_vehicle: (el) => <VehicleFormat interestedVehicle={el.interested_vehicle} />,
      days_old: (el) => el.created_at && daysOld(el.created_at),
      days_in: (el) => (el.client_status_changed_at ? daysOld(el.client_status_changed_at) : 'N/A'),
      note: (el) => <NoteButton customerId={el.id} />,
    };

  const { columns } = useDynamicTableColumns<SpecificClient, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: {
      customer_name: { size: 180 },
      phone_number: { size: 170 },
      days_old: { size: 140 },
      days_in: { size: 130 },
      note: { size: 180 },
      interested_vehicle: { size: 200 },
      last_contacted_day: { size: 210 },
    },
    columnRenderers,
    accessorFnMapper: {
      customer_name: (el) => `${el.first_name || ''} ${el.last_name || ''}`,
      phone_number: (el) => el.mobile_phone,
      assigned_to: (el) =>
        `${el.seller?.id ? `${el.seller.name || ''} ${el.seller.last_name || ''}` : ''}`,
      appt_date: (el) =>
        el.appointment?.find(
          (el) => el.end_date && new Date(el.end_date).getTime() >= new Date().getTime(),
        )?.end_date || null,
      last_contacted_day: (el) => el.last_activity,
      days_old: (el) => el.created_at && daysOld(el.created_at),
      days_in: (el) => (el.client_status_changed_at ? daysOld(el.client_status_changed_at) : ''),
      interested_vehicle: (el) =>
        el.interested_vehicle ? formatVehicle(el.interested_vehicle) : '',
    },
    disabledSortColumns: ['note'],
    filterableColumns: [
      'customer_name',
      'phone_number',
      'assigned_to',
      'appt_date',
      'last_contacted_day',
      'days_old',
      'days_in',
      'interested_vehicle',
    ],
    columnDataTypes: {
      appt_date: 'date',
      last_contacted_day: 'date',
    },
  });

  return (
    <ModalWindow top={-13.7}>
      <ModalContainer marginTop={5.555556} width={96.822917}>
        <ModalContainerTitle
          title="No Show"
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
              specificCustomerStatusId={8}
              visibleFiltersOptions={{
                interestedVehicle: true,
                daysIn: true,
                lastActivity: true,
                visitDate: true,
              }}
            />
          )}
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={NoShowUpCustomersListFiltered || []}
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
