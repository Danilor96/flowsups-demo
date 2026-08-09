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

export function ShowUpCustomers() {
  // ------- global states -------

  const { closeShowUpCustomersList } = modalWindowStore();

  const { specificClientsData } = adminDashboardStore();
  const {
    getSpecificClientsNotes,
    clearSpecificClientsData,
    clearSpecificClientsNotes,
    setNoteFromIdSelected,
    setNoteCustomerStatusIdSelected,
  } = adminDashboardStore();

  useEffect(() => {
    getSpecificClientsNotes('7');
    setNoteFromIdSelected(2);
    setNoteCustomerStatusIdSelected(7);
  }, [getSpecificClientsNotes, setNoteFromIdSelected, setNoteCustomerStatusIdSelected]);

  // ------- local states -------

  const [doFetch, setDoFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const { filters, filterCustomer, updateFilter, clearFilters } = useFilters();
  const [showFilter, setShowFilter] = useState(true);
  const handleCloseWindow = () => {
    clearSpecificClientsData();
    clearSpecificClientsNotes();
    closeShowUpCustomersList();
  };

  // ------- computed values -------
  const showUpCustomersListFiltered = useMemo(
    () => filterCustomer(specificClientsData),
    [doFetch, specificClientsData],
  );

  const initialColumnsDef = {
    customer_name: true,
    phone_number: true,
    assigned_to: true,
    visit_date: true,
    last_contacted_day: true,
    days_old: true,
    days_in: true,
    interested_vehicle: true,
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
      visit_date: (el) =>
        el.appointment?.find((el) => el.end_date)?.end_date ? (
          <DateFormats date={el.appointment?.find((el) => el.end_date)?.end_date} format={2} />
        ) : (
          ''
        ),
      last_contacted_day: (el) =>
        el.last_activity ? <DateFormats date={el.last_activity} format={2} /> : '',
      days_old: (el) => el.created_at && daysOld(el.created_at),
      days_in: (el) => (el.client_status_changed_at ? daysOld(el.client_status_changed_at) : 'N/A'),
      interested_vehicle: (el) => <VehicleFormat interestedVehicle={el.interested_vehicle} />,
      note: (el) => <NoteButton customerId={el.id} />,
    };

  const { columns } = useDynamicTableColumns<SpecificClient, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: {
      customer_name: { size: 180 },
      phone_number: { size: 170 },
      days_old: { size: 130 },
      days_in: { size: 120 },
      visit_date: { size: 135 },
      last_contacted_day: { size: 200 },
      note: { size: 130 },
      interested_vehicle: { size: 200 },
    },
    columnRenderers,
    accessorFnMapper: {
      customer_name: (el) => `${el.first_name || ''} ${el.last_name || ''}`,
      phone_number: (el) => el.mobile_phone,
      assigned_to: (el) =>
        `${el.seller?.id ? `${el.seller.name || ''} ${el.seller.last_name || ''}` : ''}`,
      visit_date: (el) => el.appointment?.find((el) => el.end_date)?.end_date || '',
      last_contacted_day: (el) => el.last_activity,
      days_old: (el) => el.created_at && daysOld(el.created_at),
      days_in: (el) => (el.client_status_changed_at ? daysOld(el.client_status_changed_at) : 'N/A'),
      interested_vehicle: (el) =>
        el.interested_vehicle ? formatVehicle(el.interested_vehicle) : '',
    },
    disabledSortColumns: ['note', 'id'],
    filterableColumns: [
      'customer_name',
      'phone_number',
      'assigned_to',
      'visit_date',
      'last_contacted_day',
      'days_old',
      'days_in',
      'interested_vehicle',
    ],
    columnDataTypes: {
      last_contacted_day: 'date',
      visit_date: 'date',
    },
  });

  return (
    <ModalWindow top={-13.7}>
      <ModalContainer marginTop={2.555556} width={96.822917}>
        <ModalContainerTitle
          title="Show Up"
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
              specificCustomerStatusId={7}
              visibleFiltersOptions={{
                interestedVehicle: true,
                lastActivity: true,
                daysIn: true,
                visitDate: true,
              }}
            />
          )}
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={showUpCustomersListFiltered || []}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              itemsPerPage={10}
              loading={loading}
              paginationIsActive
              textColor="#FFF"
              height={showFilter ? 54 : 65}
              rowSelectionIsActive={false}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
