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
import { daysOld } from './utils/utils';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';

export function UndeliveredCustomers() {
  // ------- global states -------

  const { closeUndeliveredCustomersList } = modalWindowStore();

  const { specificClientsData } = adminDashboardStore();
  const {
    getSpecificClientsNotes,
    clearSpecificClientsData,
    clearSpecificClientsNotes,
    setNoteFromIdSelected,
    setNoteCustomerStatusIdSelected,
  } = adminDashboardStore();

  useEffect(() => {
    getSpecificClientsNotes('5');
    setNoteFromIdSelected(6);
    setNoteCustomerStatusIdSelected(5);
  }, [getSpecificClientsNotes, setNoteFromIdSelected, setNoteCustomerStatusIdSelected]);

  // ------- local states -------
  const [doFetch, setDoFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const { filters, filterCustomer, updateFilter, clearFilters } = useFilters();
  const [showFilter, setShowFilter] = useState(true);

  const handleCloseWindow = () => {
    clearSpecificClientsData();
    clearSpecificClientsNotes();
    closeUndeliveredCustomersList();
  };

  // ------- computed values -------
  const undeliveredCustomersListFiltered = useMemo(
    () => filterCustomer(specificClientsData),
    [specificClientsData, doFetch],
  );

  const hasClientsData =
    undeliveredCustomersListFiltered && undeliveredCustomersListFiltered?.length > 0;
  const tableData = hasClientsData
    ? undeliveredCustomersListFiltered.map((el) => ({
        id: el.id,
        customer_name: (
          <CustomerName
            customer={`${el.first_name || ''} ${el.last_name || ''}`}
            customerId={el.id}
          />
        ),
        phone_number: (
          <CustomerContactFormat
            contact={el.mobile_phone || ''}
            customerId={el.id}
            marginInlineAuto
          />
        ),
        assigned_to: `${
          el.seller?.id ? `${el.seller.name || ''} ${el.seller.last_name || ''}` : ''
        }`,
        delivery_date:
          el.vehicle_delivery && el.vehicle_delivery.length > 0 ? (
            <DateFormats
              date={el.vehicle_delivery[el.vehicle_delivery.length - 1].end_date || undefined}
              format={2}
            />
          ) : (
            'N/A'
          ),
        last_contacted_day: el.last_activity ? (
          <DateFormats date={el.last_activity} format={2} />
        ) : (
          ''
        ),
        days_old: el.created_at && daysOld(el.created_at),
        days_in: el.client_status_changed_at ? daysOld(el.client_status_changed_at) : '',
        interested_vehicle: <VehicleFormat interestedVehicle={el.interested_vehicle} />,
        note: <NoteButton customerId={el.id} />,
      }))
    : [
        {
          id: '',
          customer_name: '',
          phone_number: '',
          assigned_to: '',
          delivery_date: '',
          last_contacted_day: '',
          days_old: '',
          days_in: '',
          interested_vehicle: '',
          note: '',
        },
      ];

  const initialColumnsDef = {
    customer_name: true,
    phone_number: true,
    assigned_to: true,
    delivery_date: true,
    last_contacted_day: true,
    days_old: true,
    days_in: true,
    interested_vehicle: true,
    note: true,
  };

  const { columns } = useDynamicTableColumns({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: {
      days_old: { size: 100 },
      days_in: { size: 100 },
      delivery_date: { size: 140 },
      note: { size: 130 },
      interested_vehicle: { size: 170 },
      last_contacted_day: { size: 170 },
    },
  });

  return (
    <ModalWindow top={-13.7}>
      <ModalContainer marginTop={2.555556} width={96.822917}>
        <ModalContainerTitle
          title="Undelivered"
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
              specificCustomerStatusId={5}
              visibleFiltersOptions={{
                interestedVehicle: true,
                deliveryTime: true,
                daysIn: true,
                lastActivity: true,
              }}
            />
          )}
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={tableData}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              itemsPerPage={8}
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
