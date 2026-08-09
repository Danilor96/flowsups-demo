import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useState } from 'react';
import { VehicleFormat } from '&/miscellaneous/vehicleFormat/VehicleFormat';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { NoteButton } from '&/miscellaneous/notesWindow/noteButton/NoteButton';
import { CreditAppDecisionButton } from '&/miscellaneous/changeBetweenCreditAppTables/creditAppDecisionButton/CreditAppDecisionButton';
import { useFilters } from './Filter/useFilters';
import CustomerListFilter from './Filter';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { SpecificClient } from '@/app/libs/definitions';
import { DateFormats } from '&/miscellaneous/dateFormats/DateFormats';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { daysOld, formatVehicle } from './utils/utils';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';

export function CreditAppCustomers() {
  // ----- global states -----
  const { closeCreditAppCustomersList } = modalWindowStore();

  const { specificClientsData, specificClientsDataTwo, specificClientsDataThree } =
    adminDashboardStore();
  const {
    getSpecificClientsNotes,
    clearSpecificClientsData,
    clearSpecificClientsNotes,
    getCreditAppListStatus,
    setNoteCustomerStatusIdSelected,
    setNoteFromIdSelected,
  } = adminDashboardStore();

  useEffect(() => {
    getSpecificClientsNotes('3');
    getCreditAppListStatus();
    setNoteFromIdSelected(1);
    setNoteCustomerStatusIdSelected(3);
  }, [
    getSpecificClientsNotes,
    getCreditAppListStatus,
    setNoteCustomerStatusIdSelected,
    setNoteFromIdSelected,
  ]);

  // ----- local states -----

  const [doFetchOne, setDoFetchOne] = useState(false);
  const [doFetchTwo, setDoFetchTwo] = useState(false);
  const [doFetchThree, setDoFetchThree] = useState(false);

  const [loadingOne, setLoadingOne] = useState(true);
  const [loadingTwo, setLoadingTwo] = useState(true);
  const [loadingThree, setLoadingThree] = useState(true);
  const [showFilter, setShowFilter] = useState(true);
  const {
    filters: filtersWorking,
    filterCustomer: filterCustomerWorking,
    updateFilter: updateFilterWorking,
    clearFilters: clearFiltersWorking,
  } = useFilters();
  const {
    filters: filtersApproved,
    filterCustomer: filterCustomerApproved,
    updateFilter: updateFilterApproved,
    clearFilters: clearFiltersApproved,
  } = useFilters();
  const {
    filters: filtersTurndown,
    filterCustomer: filterCustomerTurndown,
    updateFilter: updateFilterTurndown,
    clearFilters: clearFiltersTurndown,
  } = useFilters();

  const handleCloseWindow = () => {
    clearSpecificClientsData();
    clearSpecificClientsNotes();
    closeCreditAppCustomersList();
  };

  const workingData1 = useMemo(
    () =>
      filterCustomerWorking(
        specificClientsData?.filter((client) => client.credit_app_list_status_id === 1),
      ),
    [specificClientsData, doFetchOne],
  );
  const approvedData2 = useMemo(
    () =>
      filterCustomerApproved(
        specificClientsDataTwo?.filter((client) => client.credit_app_list_status_id === 2),
      ),
    [specificClientsDataTwo, doFetchTwo],
  );
  const turdownData3 = useMemo(
    () =>
      filterCustomerTurndown(
        specificClientsDataThree?.filter((client) => client.credit_app_list_status_id === 3),
      ),
    [specificClientsDataThree, doFetchThree],
  );

  const initialColumnsDef = {
    customer_name: true,
    phone_number: true,
    assigned_to: true,
    last_contacted_day: true,
    interested_vehicle: true,
    days_old: true,
    days_in: true,
    note: true,
    _blank_button: true,
    customerIdForSingleClientData: false,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: SpecificClient) => any } =
    {
      customerIdForSingleClientData: (el) => el.credit_app_list_status_id,
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
        el.seller ? `${el.seller.name || ''} ${el.seller.last_name || ''}` : '',
      last_contacted_day: (el) => <DateFormats date={el.last_activity || undefined} format={2} />,
      interested_vehicle: (el) => <VehicleFormat interestedVehicle={el.interested_vehicle} />,
      days_old: (el) => `${el.created_at && daysOld(el.created_at)}`,
      days_in: (el) => `${el.client_status_changed_at ? daysOld(el.client_status_changed_at) : ''}`,
      note: (el) => <NoteButton customerId={el.id} fromId={1} />,
      _blank_button: (el) => (
        <CreditAppDecisionButton
          customerId={el.id}
          customerName={`${el.first_name || ''} ${el.last_name || ''}`}
        />
      ),
    };

  const { columns } = useDynamicTableColumns<SpecificClient, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    hideHeaderFor: ['_blank_button'],
    columnStyles: {
      customer_name: { size: 200 },
      phone_number: { size: 180 },
      assigned_to: { size: 170 },
      interested_vehicle: { size: 200 },
      last_contacted_day: { size: 220 },
      days_old: { size: 150 },
      days_in: { size: 130 },
    },
    disableTruncateOnColumns: ['_blank_button'],
    columnRenderers,
    accessorFnMapper: {
      customer_name: (el) => `${el.first_name || ''} ${el.last_name || ''}`,
      phone_number: (el) => el.mobile_phone,
      assigned_to: (el) =>
        el.seller ? `${el.seller.name || ''} ${el.seller.last_name || ''}` : '',
      last_contacted_day: (el) => el.last_activity,
      interested_vehicle: (el) => formatVehicle(el.interested_vehicle),
      days_old: (el) => `${el.created_at && daysOld(el.created_at)}`,
      days_in: (el) =>
        el.client_status_changed_at ? `${clientDaysOld(el.client_status_changed_at)}` : '',
    },
    filterableColumns: [
      'customer_name',
      'phone_number',
      'assigned_to',
      'last_contacted_day',
      'interested_vehicle',
      'days_old',
      'days_in',
    ],
    disabledSortColumns: ['note', '_blank_button'],
    columnDataTypes: {
      last_contacted_day: 'date',
    },
  });

  return (
    <ModalWindow top={-13.7}>
      <ModalContainer width={96.822917} marginTop={5.555556}>
        <ModalContainerTitle
          title="Credit App"
          closeWindowFunction={handleCloseWindow}
          openNewTab
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={[]}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={async () => {
                setDoFetchOne(!doFetchOne);
                setDoFetchTwo(!doFetchTwo);
                setDoFetchThree(!doFetchThree);
              }}
              options={{ moreOptionsIsVisible: false }}
            />
          }
        />
        <ModalContent>
          <Paragraph fontSize={3} color="#00A78B" marginBottom={2}>
            Working
          </Paragraph>
          {showFilter && (
            <CustomerListFilter
              filters={filtersWorking}
              updateFilter={updateFilterWorking}
              clearFilters={clearFiltersWorking}
              doDataFetch={doFetchOne}
              setLoading={setLoadingOne}
              setDoFetch={setDoFetchOne}
              specificCustomerStatusId={3}
              visibleFiltersOptions={{ contactTimeId: true, interestedVehicle: true, daysIn: true }}
            />
          )}
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={workingData1 || []}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              loading={loadingOne}
              textColor="#FFF"
              height={54}
              rowSelectionIsActive={false}
            />
          </ButtonContainer>
          <Paragraph fontSize={3} color="#00A78B" marginBottom={2} marginTop={4}>
            Approved
          </Paragraph>
          {showFilter && (
            <CustomerListFilter
              filters={filtersApproved}
              updateFilter={updateFilterApproved}
              clearFilters={clearFiltersApproved}
              doDataFetch={doFetchTwo}
              setLoading={setLoadingTwo}
              setDoFetch={setDoFetchTwo}
              specificCustomerStatusTwoId={3}
              visibleFiltersOptions={{ contactTimeId: true, interestedVehicle: true, daysIn: true }}
            />
          )}
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={approvedData2 || []}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              loading={loadingTwo}
              textColor="#FFF"
              height={54}
              rowSelectionIsActive={false}
            />
          </ButtonContainer>
          <Paragraph fontSize={3} color="#00A78B" marginBottom={2} marginTop={4}>
            Turndown
          </Paragraph>
          {showFilter && (
            <CustomerListFilter
              filters={filtersTurndown}
              updateFilter={updateFilterTurndown}
              clearFilters={clearFiltersTurndown}
              doDataFetch={doFetchThree}
              setLoading={setLoadingThree}
              setDoFetch={setDoFetchThree}
              specificCustomerStatusThreeId={3}
              visibleFiltersOptions={{ contactTimeId: true, interestedVehicle: true, daysIn: true }}
            />
          )}
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={turdownData3 || []}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              loading={loadingThree}
              textColor="#FFF"
              height={54}
              rowSelectionIsActive={false}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}

function clientDaysOld(creationDate: Date) {
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
}
