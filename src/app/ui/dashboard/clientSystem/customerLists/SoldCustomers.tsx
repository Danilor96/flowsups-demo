import { ClientType, SpecificClient, SpecificClients } from '@/app/libs/definitions';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { VehicleFormat } from '&/miscellaneous/vehicleFormat/VehicleFormat';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { useMemo, useState, useRef, useCallback } from 'react';
import { useFilters } from './Filter/useFilters';
import CustomerListFilter from './Filter';
import { ButtonContainer } from '@/app/ui/buttons/ButtonContainer';
import { generateDealColumns } from './utils/utils';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { DateFormats } from '@/app/ui/miscellaneous/dateFormats/DateFormats';
import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { SplitSellersInfo } from '@/app/ui/miscellaneous/splitSellersInfo/SplitSellersInfo';

export function SoldCustomers() {
  // ------- global states -------

  const { closeSoldCustomersList } = modalWindowStore();

  const { specificClientsData } = adminDashboardStore();
  const { clearSpecificClientsData } = adminDashboardStore();

  // ------- local states -------

  const [doFetch, setDoFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const { filters, filterCustomer, updateFilter, clearFilters } = useFilters();
  const [showFilter, setShowFilter] = useState(true);

  const doFetchRef = useRef(doFetch);
  doFetchRef.current = doFetch;

  const triggerRefetch = useCallback(() => {
    setDoFetch(!doFetchRef.current);
  }, []);

  const handleCloseWindow = () => {
    clearSpecificClientsData();
    closeSoldCustomersList();
  };

  // ------- computed values -------
  const soldCustomersListFiltered = useMemo(
    () => filterCustomer(specificClientsData),
    [doFetch, specificClientsData],
  );

  const initialColumnsDef = {
    customer_name: true,
    phone_number: true,
    assigned_to: true,
    finance_manager: true,
    vehicle: true,
    sold_date: true,
    bank: true,
    down_payment: true,
    paid: true,
    deferred_money: true,
    front_end_profit: true,
    back_end_profit: true,
    total_profit: true,
    source: true,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: SpecificClient) => any } = {
    customer_name: (el: SpecificClient) => (
      <CustomerName customer={`${el.first_name || ''} ${el.last_name || ''}`} customerId={el.id} />
    ),
    phone_number: (el: SpecificClient) => <CustomerContactFormat contact={el.mobile_phone || ''} customerId={el.id} />,
    assigned_to: (el: SpecificClient) => <SplitSellersInfo client={el} />,
    finance_manager: (el: SpecificClient) =>
      el.finance_manager ? `${el.finance_manager.name || ''} ${el.finance_manager.last_name || ''}` : 'N/A',
    vehicle: (el: SpecificClient) => (
      <VehicleFormat
        interestedVehicle={el.interested_vehicle}
        enableSelector={true}
        clientIsSold={true}
        customerId={el.id}
        onVehicleChange={() => {
          triggerRefetch();
        }}
      />
    ),
    sold_date: (el: SpecificClient) =>
      el.lead && el.lead.length > 0 ? <DateFormats date={el.lead[0].sold_created_at} format={2} /> : '',
    bank: (el: SpecificClient) => generateDealColumns(el as any).bank,
    down_payment: (el: SpecificClient) => generateDealColumns(el as any).down_payment,
    paid: (el: SpecificClient) => generateDealColumns(el as any).paid,
    deferred_money: (el: SpecificClient) => generateDealColumns(el as any).deferred_money,
    front_end_profit: (el: SpecificClient) => generateDealColumns(el as any).front_end_profit,
    back_end_profit: (el: SpecificClient) => generateDealColumns(el as any).back_end_profit,
    total_profit: (el: SpecificClient) => generateDealColumns(el as any).total_profit,
    source: (el: SpecificClient) => generateDealColumns(el as any).source,
  };

  const { columns } = useDynamicTableColumns<SpecificClient, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnDataTypes: { sold_date: 'date' },
    columnRenderers,
    accessorFnMapper: {
      customer_name: el => `${el.first_name || ''} ${el.last_name || ''}`,
      phone_number: el => el.mobile_phone,
      source: el => el.lead_source?.source,
      assigned_to: el => {
        const activeLead = el.lead && el.lead.length > 0 ? el.lead[0] : null;
        if (activeLead && activeLead.isSplitSold && activeLead.sellersInSplitDeal && activeLead.sellersInSplitDeal.length > 0) {
          return activeLead.sellersInSplitDeal
            .map(seller => `${seller.name || ''} ${seller.last_name || ''}`)
            .join(' / ');
        }
        return (el.seller ? `${el.seller.name || ''} ${el.seller.last_name || ''}` : '');
      },
      sold_date: el => (el.lead && el.lead.length > 0 ? el.lead[0].sold_created_at : ''),
    },
    columnStyles: {
      customer_name: { size: 180 },
      phone_number: { size: 170 },
      finance_manager: { size: 170 },
      sold_date: { size: 110 },
      vehicle: { size: 170 },
      paid: { size: 100 },
    },
  });

  return (
    <ModalWindow top={-13.7}>
      <ModalContainer marginTop={3.555556} width={96.822917}>
        <ModalContainerTitle
          title="Sold"
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
              specificCustomerStatusId={10}
              visibleFiltersOptions={{
                interestedVehicle: true,
                leadSource: true,
                asignedToFinanceManagerId: true,
                dealBank: true,
                soldDate: true,
              }}
            />
          )}
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={soldCustomersListFiltered}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              itemsPerPage={8}
              loading={loading}
              paginationIsActive
              textColor="#FFF"
              height={showFilter ? 54 : 65}
              rowSelectionIsActive={false}
              rowHighlightCondition={(originalRow: SpecificClient) => {
                if(!originalRow.lead || originalRow.lead.length === 0) return false;
                const isReturned = originalRow.lead[0].customer_funding_list_status_id === FundingStatuses.Returned;
                if(isReturned) return true
                if (!originalRow.deal || originalRow.deal.length === 0) return '#9ac2be'; //'#b2dfdb';

                return false
              }}
              highlightColor="rgba(185, 67, 67, 1)"
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
