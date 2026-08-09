import { SpecificClient } from '@/app/libs/definitions';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { useEffect, useMemo, useState } from 'react';
import { VehicleFormat } from '&/miscellaneous/vehicleFormat/VehicleFormat';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { NoteButton } from '&/miscellaneous/notesWindow/noteButton/NoteButton';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { dateFormatsStore } from '@/store/dateFormats';
import { differenceInDays } from 'date-fns';
import { useFilters } from './Filter/useFilters';
import CustomerListFilter from './Filter';
import { ButtonContainer } from '@/app/ui/buttons/ButtonContainer';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { formatVehicle } from './utils/utils';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';

export function LostCustomers() {
  // ------- global states -------
  const { closeLostCustomersList } = modalWindowStore();

  const { dateFormatted } = dateFormatsStore();

  const { specificClientsData } = adminDashboardStore();
  const {
    getSpecificClientsNotes,
    clearSpecificClientsData,
    clearSpecificClientsNotes,
    setNoteFromIdSelected,
    setNoteCustomerStatusIdSelected,
  } = adminDashboardStore();

  useEffect(() => {
    setNoteFromIdSelected(3);
    setNoteCustomerStatusIdSelected(12);
    getSpecificClientsNotes('12');
  }, [getSpecificClientsNotes, setNoteCustomerStatusIdSelected, setNoteFromIdSelected]);

  // ------- local states -------

  const [loading, setLoading] = useState(true);
  const { filters, filterCustomer, updateFilter, clearFilters } = useFilters();
  const [showFilter, setShowFilter] = useState(true);
  const [doFetch, setDoFetch] = useState(false);

  const handleCloseWindow = () => {
    clearSpecificClientsData();
    clearSpecificClientsNotes();
    setNoteFromIdSelected(null);
    setNoteCustomerStatusIdSelected(null);
    closeLostCustomersList();
  };

  // ------- computed values -------
  const lostCustomersList = useMemo(
    () => filterCustomer(specificClientsData),
    [specificClientsData, doFetch],
  );

  const initialColumnsDef = {
    customer_name: true,
    phone_number: true,
    assigned_to: true,
    last_contacted_day: true,
    lost_date: true,
    days_old: true,
    days_in: true,
    interested_vehicle: true,
    lost_reason: true,
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
      assigned_to: (el) => (el.seller?.id ? `${el.seller.name} ${el.seller.last_name}` : ''),
      last_contacted_day: (el) => dateFormatted(2, el.last_activity),
      lost_date: (el) => dateFormatted(2, el.lost_date),
      days_old: (el) => differenceInDays(new Date(), el.created_at) + ' Days',
      days_in: (el) =>
        el?.client_status_changed_at
          ? differenceInDays(new Date(), el.client_status_changed_at)
          : '',
      interested_vehicle: (el) => <VehicleFormat interestedVehicle={el.interested_vehicle} />,
      lost_reason: (el) => <NoteButton customerId={el.id} lostReasonId={el.lost_reason_id} />,
    };

  const { columns } = useDynamicTableColumns<SpecificClient, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: { days_old: { size: 130 }, interested_vehicle: { size: 200 } },
    columnRenderers,
    accessorFnMapper: {
      customer_name: (el) => `${el.first_name || ''} ${el.last_name || ''}`,
      phone_number: (el) => el.mobile_phone,
      assigned_to: (el) => (el.seller?.id ? `${el.seller.name} ${el.seller.last_name}` : ''),
      last_contacted_day: (el) => el.last_activity,
      lost_date: (el) => el.lost_date,
      days_old: (el) => differenceInDays(new Date(), el.created_at),
      days_in: (el) =>
        el?.client_status_changed_at
          ? differenceInDays(new Date(), el.client_status_changed_at)
          : '',
      interested_vehicle: (el) => formatVehicle(el.interested_vehicle),
    },
    disabledSortColumns: ['lost_reason'],
    filterableColumns: [
      'customer_name',
      'phone_number',
      'assigned_to',
      'interested_vehicle',
      'last_contacted_day',
      'lost_date',
      'days_old',
      'days_in',
    ],
  });

  return (
    <ModalWindow top={-13.7}>
      <ModalContainer marginTop={2.555556} width={96.822917}>
        <ModalContainerTitle
          title="Lost"
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
              visibleFiltersOptions={{
                asignedToFinanceManagerId: true,
                leadSource: true,
                lastActivity: true,
                daysIn: true,
                interestedVehicle: true,
                lostDate: true,
                lostReason: true,
              }}
              specificCustomerStatusId={12}
            />
          )}
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={lostCustomersList || []}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              itemsPerPage={8}
              loading={loading}
              paginationIsActive
              textColor="#FFF"
              height={showFilter ? 54 : 68}
              rowSelectionIsActive={false}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
