import { OneFireLead, ThreeFiresLead, TwoFiresLead } from '@/app/ui/icons/Icons';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { useMemo, useState } from 'react';
import { ButtonContainer } from '@/app/ui/buttons/ButtonContainer';
import CustomerListFilter from './Filter';
import { useFilters } from './Filter/useFilters';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { differenceInDays } from 'date-fns';
import { SpecificClient } from '@/app/libs/definitions';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';

export function NewCustomers() {
  // ------- global states -------

  const { closeNewCustomersList } = modalWindowStore();

  const { specificClientsData } = adminDashboardStore();
  const { clearSpecificClientsData } = adminDashboardStore();

  // ------- local states -------
  const [loading, setLoading] = useState<boolean>(true);
  const { filters, filterCustomer, updateFilter, clearFilters } = useFilters();
  const [showFilter, setShowFilter] = useState(true);
  const [doReload, setDoReload] = useState(false);

  // ------- functions -------
  const handleCloseWindow = () => {
    clearSpecificClientsData();
    closeNewCustomersList();
  };

  //   client days old
  const clientDaysOld = (creationDate: Date) => {
    const daysOld = Math.abs(differenceInDays(creationDate, new Date()));
    // const text = `${
    //   daysOld == 0 ? '0 days' : daysOld == 1 ? `${daysOld} day` : `${daysOld} days`
    // }`;

    const text = `${daysOld == 0 ? '0' : daysOld == 1 ? `${daysOld}` : `${daysOld}`}`;

    const textDate = new Intl.DateTimeFormat('default', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
      .format(new Date(creationDate))
      .replace(/\./g, '')
      .toUpperCase();

    return `${textDate} (${text})`;
  };

  // ------- computed values -------
  const filteredClients = useMemo(
    () => filterCustomer(specificClientsData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [specificClientsData, doReload],
  );

  const initialColumnsDef = {
    customer_name: true,
    phone_number: true,
    source: true,
    days_old: true,
    lead_temperatures: true,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: SpecificClient) => any } =
    {
      customer_name: (el) => (
        <CustomerName
          customer={`${el.first_name || ''} ${el.last_name || ''}`}
          customerId={el.id}
          salesRepId={el.seller?.id}
        />
      ),
      phone_number: (el) => (
        <CustomerContactFormat contact={el.mobile_phone} customerId={el.id} marginInlineAuto />
      ),
      source: (el) => el.lead_source?.source,
      days_old: (el) => el.created_at && clientDaysOld(el.created_at),
      lead_temperatures: (el) =>
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
    columnRenderers,
    accessorFnMapper: {
      customer_name: (el) => `${el.first_name || ''} ${el.last_name || ''}`,
      phone_number: (el) => el.mobile_phone,
      source: (el) => el.lead_source?.source,
      days_old: (el) => el.created_at && clientDaysOld(el.created_at),
      lead_temperatures: (el) => el.client_lead_temperature?.temperature,
    },
  });

  return (
    <ModalWindow top={-13.7}>
      <ModalContainer width={82.8125} marginTop={5.555556}>
        <ModalContainerTitle
          title="New"
          closeWindowFunction={handleCloseWindow}
          openNewTab
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={[]}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={async () => setDoReload(!doReload)}
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
              specificCustomerStatusId={1}
              setLoading={setLoading}
              setDoFetch={setDoReload}
              doDataFetch={doReload}
              disabledOptions={['Tomorrow', 'Upcoming']}
              visibleFiltersOptions={{
                assignedToSellerId: false,
                leadSource: true,
                leadTemperature: true,
              }}
            />
          )}
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={filteredClients || []}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              itemsPerPage={12}
              loading={loading}
              paginationIsActive
              printButtonIsActive
              lazyPrinting
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
