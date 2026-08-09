import { SpecificClient, SpecificClients } from '@/app/libs/definitions';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { VehicleFormat } from '&/miscellaneous/vehicleFormat/VehicleFormat';
import { useFilters } from '../Filter/useFilters';
import CustomerListFilter from '../Filter';
import { formatVehicle, generateDealColumns } from '../utils/utils';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { PendingToFound } from '../pendingToFound/PendingToFound';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '&/table/coloredTable/v2';
import { StateButton } from './stateButon/StateButton';
import { ExtraTitleButtonsReports } from '&/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { DateFormats } from '&/miscellaneous/dateFormats/DateFormats';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { SplitSellersInfo } from '&/miscellaneous/splitSellersInfo/SplitSellersInfo';
import { NoteButton } from '&/miscellaneous/notesWindow/noteButton/NoteButton';
import { MultipleCustomers } from '@/app/ui/miscellaneous/customerName/multipleCustomers/MultipleCustomers';

export function PaidCustomers({ onCloseWindow }: { onCloseWindow?: () => void }) {
  // ------- global states -------
  const { closePaidCustomersList, openClosePendingToFund } = modalWindowStore();
  const { pendingToFund } = modalWindowStore();

  const { specificClientsData, specificClientsDataTwo, specificClientsDataThree } =
    adminDashboardStore();
  const { clearSpecificClientsData } = adminDashboardStore();

  const getSpecificClientsNotes = adminDashboardStore((state) => state.getSpecificClientsNotes);
  const setNoteFromIdSelected = adminDashboardStore((state) => state.setNoteFromIdSelected);
  const setNoteCustomerStatusIdSelected = adminDashboardStore(
    (state) => state.setNoteCustomerStatusIdSelected,
  );

  useEffect(() => {
    getSpecificClientsNotes('10');
    setNoteFromIdSelected(7);
    setNoteCustomerStatusIdSelected(10);
  }, []);

  // ------- local states -------

  const [doFetchOne, setDoFetchOne] = useState(false);
  const [doFetchTwo, setDoFetchTwo] = useState(false);
  const [doFetchThree, setDoFetchThree] = useState(false);

  const doFetchOneRef = useRef(doFetchOne);
  doFetchOneRef.current = doFetchOne;
  const doFetchTwoRef = useRef(doFetchTwo);
  doFetchTwoRef.current = doFetchTwo;
  const doFetchThreeRef = useRef(doFetchThree);
  doFetchThreeRef.current = doFetchThree;

  const triggerFetchOne = useCallback(() => setDoFetchOne(!doFetchOneRef.current), []);
  const triggerFetchTwo = useCallback(() => setDoFetchTwo(!doFetchTwoRef.current), []);
  const triggerFetchThree = useCallback(() => setDoFetchThree(!doFetchThreeRef.current), []);

  const [loading, setLoading] = useState(true);
  const [loadingTwo, setLoadingTwo] = useState(true);
  const [loadingThree, setLoadingThree] = useState(true);

  const [showFilter, setShowFilter] = useState(true);

  const {
    filters: filtersProcessing,
    filterCustomer: filterCustomerProcessing,
    updateFilter: updateFilterProcessing,
    clearFilters: clearFiltersProcessing,
  } = useFilters();
  const {
    filters: filtersFunded,
    filterCustomer: filterCustomerFunded,
    updateFilter: updateFilterFunded,
    clearFilters: clearFiltersFunded,
  } = useFilters();
  const {
    filters: filterReturned,
    filterCustomer: filterCustomerReturned,
    updateFilter: updateFilterReturned,
    clearFilters: clearFiltersReturned,
  } = useFilters();

  const processingData = useMemo(
    () =>
      filterCustomerProcessing(
        specificClientsData?.filter((client) => client.funding_list_status_id === 1),
      ),
    [specificClientsData, doFetchOne],
  );
  const fundedData = useMemo(
    () =>
      filterCustomerFunded(
        specificClientsDataTwo?.filter((client) => client.funding_list_status_id === 2),
      ),
    [specificClientsDataTwo, doFetchTwo],
  );
  const returnedData = useMemo(
    () =>
      filterCustomerReturned(
        specificClientsDataThree?.filter((client) => client.funding_list_status_id === 3),
      ),
    [specificClientsDataThree, doFetchThree],
  );

  const [pendingModalWindowData, setPendingModalWindowData] = useState<SpecificClients>();

  const columnStyles = {
    customer_name: { size: 180 },
    finance_manager: { size: 180 },
    vehicle: { size: 180 },
    sold_date: { size: 140 },
    bank: { size: 110 },
    paid: { size: 110 },
  };
  const initialColumnsDef = {
    id: true,
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
    pending: true,
    options: true,
  };

  const columnRenderers: {
    [key in keyof typeof initialColumnsDef]: (customer: SpecificClient) => any;
  } = {
    id: (customer) => customer.id,
    customer_name: (customer) => (
      <MultipleCustomers
        multipleCustomers={[
          {
            customerId: customer.id,
            customerName: `${customer.first_name} ${customer.last_name}`,
          },
          {
            customerId: customer.lead ? customer.lead[0].customer_cobuyer?.cobuyer.id : null,
            customerName: customer.lead
              ? `${customer.lead[0].customer_cobuyer?.cobuyer.first_name} ${customer.lead[0].customer_cobuyer?.cobuyer.last_name}`
              : null,
            label: 'CB:',
          },
        ]}
      />
    ),
    phone_number: (customer) => (
      <CustomerContactFormat
        color="#FFF"
        contact={customer.mobile_phone}
        customerId={customer.id}
      />
    ),
    assigned_to: (customer: SpecificClient) => <SplitSellersInfo client={customer} />,
    finance_manager: (customer) =>
      customer.finance_manager?.id
        ? `${customer.finance_manager.name} ${customer.finance_manager.last_name}`
        : '',
    vehicle: (customer) => (
      <VehicleFormat
        interestedVehicle={customer.interested_vehicle}
        clientIsSold={true}
        customerId={customer.id}
        enableSelector={true}
        onVehicleChange={() => {
          triggerFetchOne();
        }}
      />
    ),
    sold_date: (customer) =>
      customer.lead && customer.lead.length > 0 ? (
        <DateFormats date={customer.lead[0].sold_created_at} format={2} />
      ) : (
        ''
      ),
    bank: (customer) => generateDealColumns(customer as any).bank,
    down_payment: (customer) => generateDealColumns(customer as any).down_payment,
    paid: (customer) => generateDealColumns(customer as any).paid,
    deferred_money: (customer) => generateDealColumns(customer as any).deferred_money,
    front_end_profit: (customer) => generateDealColumns(customer as any).front_end_profit,
    back_end_profit: (customer) => generateDealColumns(customer as any).back_end_profit,
    total_profit: (customer) => generateDealColumns(customer as any).total_profit,
    pending: (customer) => (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => handleOpenPendingToFundWindow(customer)}
        data-id={customer.id}
        className="bg-[#C9EBE6] rounded-[1.041666vw] shadow-crmFormShadow text-[#41B4A0] px-[1.2vw] py-[0.7vh]"
      >
        Pending
      </motion.button>
    ),
    options: (customer) => (
      <StateButton
        customerId={customer.id}
        currentState={customer.funding_list_status_id}
        dealExists={!!(customer.deal && customer.deal.length > 0)}
      />
    ),
  };

  const { columns: columns1 } = useDynamicTableColumns<SpecificClient, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    // hideHeaderFor: ['_blank_button'],
    columnStyles,
    columnRenderers,
    accessorFnMapper: {
      customer_name: (el) => `${el.first_name}${el.last_name ? `${el.last_name}` : ''}`,
      phone_number: (el) => el.mobile_phone,
      assigned_to: (el) => {
        const activeLead = el.lead && el.lead.length > 0 ? el.lead[0] : null;
        if (
          activeLead &&
          activeLead.isSplitSold &&
          activeLead.sellersInSplitDeal &&
          activeLead.sellersInSplitDeal.length > 0
        ) {
          return activeLead.sellersInSplitDeal
            .map((seller) => `${seller.name || ''} ${seller.last_name || ''}`)
            .join(' / ');
        }
        return el.seller ? `${el.seller.name || ''} ${el.seller.last_name || ''}` : '';
      },
      finance_manager: (el) =>
        el.finance_manager
          ? `${el.finance_manager.name || ''} ${el.finance_manager.last_name || ''}`
          : '',
      vehicle: (el) => formatVehicle(el.interested_vehicle),
      sold_date: (el) => (el.lead && el.lead.length > 0 ? el.lead[0].sold_created_at : ''),
      bank: (el) => generateDealColumns(el as any).bank,
      down_payment: (el) => generateDealColumns(el as any).down_payment,
      paid: (el) => generateDealColumns(el as any).paid,
      deferred_money: (el) => generateDealColumns(el as any).deferred_money,
      front_end_profit: (el) => generateDealColumns(el as any).front_end_profit,
      back_end_profit: (el) => generateDealColumns(el as any).back_end_profit,
      total_profit: (el) => generateDealColumns(el as any).total_profit,
    },
    columnDataTypes: {
      sold_date: 'date',
    },
    disabledSortColumns: ['options', 'pending'],
  });

  const initialColumnsDef2 = {
    id: true,
    customer_name: true,
    phone_number: true,
    assigned_to: true,
    finance_manager: true,
    vehicle: true,
    sold_date: true,
    funded_date: true,
    bank: true,
    down_payment: true,
    paid: true,
    deferred_money: true,
    front_end_profit: true,
    back_end_profit: true,
    total_profit: true,
    source: true,
    options: true,
  };

  const columnRenderers2: {
    [key in keyof typeof initialColumnsDef2]: (customer: SpecificClient) => any;
  } = {
    id: (customer) => customer.id,
    customer_name: (customer) => (
      <MultipleCustomers
        multipleCustomers={[
          {
            customerId: customer.id,
            customerName: `${customer.first_name} ${customer.last_name}`,
          },
          {
            customerId: customer.lead ? customer.lead[0].customer_cobuyer?.cobuyer.id : null,
            customerName: customer.lead
              ? `${customer.lead[0].customer_cobuyer?.cobuyer.first_name} ${customer.lead[0].customer_cobuyer?.cobuyer.last_name}`
              : null,
            label: 'CB:',
          },
        ]}
        renderRules={{
          mxAuto: false,
        }}
      />
    ),
    phone_number: (customer) => (
      <CustomerContactFormat
        color="#FFF"
        contact={customer.mobile_phone}
        customerId={customer.id}
      />
    ),
    assigned_to: (customer: SpecificClient) => <SplitSellersInfo client={customer} />,
    finance_manager: (customer) =>
      customer.finance_manager?.id
        ? `${customer.finance_manager.name} ${customer.finance_manager.last_name}`
        : '',
    vehicle: (customer) => (
      <VehicleFormat
        interestedVehicle={customer.interested_vehicle}
        clientIsSold={true}
        customerId={customer.id}
        enableSelector={true}
        onVehicleChange={() => {
          triggerFetchTwo();
          triggerFetchThree();
        }}
      />
    ),
    sold_date: (customer) =>
      customer.lead && customer.lead.length > 0 ? (
        <DateFormats date={customer.lead[0].sold_created_at} format={2} />
      ) : (
        ''
      ),
    funded_date: (customer) =>
      customer.lead && customer.lead.length > 0 ? (
        <DateFormats date={customer.lead[0].funding_created_at} />
      ) : (
        ''
      ),
    bank: (customer) => generateDealColumns(customer as any).bank,
    down_payment: (customer) => generateDealColumns(customer as any).down_payment,
    paid: (customer) => generateDealColumns(customer as any).paid,
    deferred_money: (customer) => generateDealColumns(customer as any).deferred_money,
    front_end_profit: (customer) => generateDealColumns(customer as any).front_end_profit,
    back_end_profit: (customer) => generateDealColumns(customer as any).back_end_profit,
    total_profit: (customer) => generateDealColumns(customer as any).total_profit,
    source: (customer) => customer.lead_source?.source || '',
    options: (customer) => (
      <StateButton
        customerId={customer.id}
        currentState={customer.funding_list_status_id}
        dealExists={!!(customer.deal && customer.deal.length > 0)}
      />
    ),
  };

  const { columns: columns2 } = useDynamicTableColumns<SpecificClient, typeof initialColumnsDef2>({
    initialColumnsDef: initialColumnsDef2,
    excludeKeys: ['id'],
    // hideHeaderFor: ['options'],
    columnStyles,
    columnRenderers: columnRenderers2,
    accessorFnMapper: {
      customer_name: (el) => `${el.first_name}${el.last_name ? `${el.last_name}` : ''}`,
      phone_number: (el) => el.mobile_phone,
      assigned_to: (el) => {
        const activeLead = el.lead && el.lead.length > 0 ? el.lead[0] : null;
        if (
          activeLead &&
          activeLead.isSplitSold &&
          activeLead.sellersInSplitDeal &&
          activeLead.sellersInSplitDeal.length > 0
        ) {
          return activeLead.sellersInSplitDeal
            .map((seller) => `${seller.name || ''} ${seller.last_name || ''}`)
            .join(' / ');
        }
        return el.seller ? `${el.seller.name || ''} ${el.seller.last_name || ''}` : '';
      },
      finance_manager: (el) =>
        el.finance_manager
          ? `${el.finance_manager.name || ''} ${el.finance_manager.last_name || ''}`
          : '',
      vehicle: (el) => formatVehicle(el.interested_vehicle),
      sold_date: (el) => (el.lead && el.lead.length > 0 ? el.lead[0].sold_created_at : ''),
      funded_date: (el) => (el.lead && el.lead.length > 0 ? el.lead[0].funding_created_at : ''),
      bank: (el) => generateDealColumns(el as any).bank,
      down_payment: (el) => generateDealColumns(el as any).down_payment,
      paid: (el) => generateDealColumns(el as any).paid,
      deferred_money: (el) => generateDealColumns(el as any).deferred_money,
      front_end_profit: (el) => generateDealColumns(el as any).front_end_profit,
      back_end_profit: (el) => generateDealColumns(el as any).back_end_profit,
      total_profit: (el) => generateDealColumns(el as any).total_profit,
      source: (el) => el.lead_source?.source || '',
    },
    columnDataTypes: {
      sold_date: 'date',
      funded_date: 'date',
    },
    disabledSortColumns: ['options'],
  });

  const initialColumnsDef3 = {
    id: true,
    customer_name: true,
    phone_number: true,
    assigned_to: true,
    finance_manager: true,
    vehicle: true,
    sold_date: true,
    funded_date: true,
    bank: true,
    down_payment: true,
    paid: true,
    deferred_money: true,
    front_end_profit: true,
    back_end_profit: true,
    total_profit: true,
    source: true,
    note: true,
    options: true,
  };

  const { columns: columns3 } = useDynamicTableColumns<SpecificClient, typeof initialColumnsDef3>({
    initialColumnsDef: initialColumnsDef3,
    excludeKeys: ['id'],
    columnStyles,
    columnRenderers: {
      ...columnRenderers2,
      ...{ note: (customer) => <NoteButton customerId={customer.id} fromId={7} /> },
    },
    accessorFnMapper: {
      customer_name: (el) => `${el.first_name}${el.last_name ? `${el.last_name}` : ''}`,
      phone_number: (el) => el.mobile_phone,
      assigned_to: (el) => {
        const activeLead = el.lead && el.lead.length > 0 ? el.lead[0] : null;
        if (
          activeLead &&
          activeLead.isSplitSold &&
          activeLead.sellersInSplitDeal &&
          activeLead.sellersInSplitDeal.length > 0
        ) {
          return activeLead.sellersInSplitDeal
            .map((seller) => `${seller.name || ''} ${seller.last_name || ''}`)
            .join(' / ');
        }
        return el.seller ? `${el.seller.name || ''} ${el.seller.last_name || ''}` : '';
      },
      finance_manager: (el) =>
        el.finance_manager
          ? `${el.finance_manager.name || ''} ${el.finance_manager.last_name || ''}`
          : '',
      vehicle: (el) => formatVehicle(el.interested_vehicle),
      sold_date: (el) => (el.lead && el.lead.length > 0 ? el.lead[0].sold_created_at : ''),
      funded_date: (el) => (el.lead && el.lead.length > 0 ? el.lead[0].funding_created_at : ''),
      bank: (el) => generateDealColumns(el as any).bank,
      down_payment: (el) => generateDealColumns(el as any).down_payment,
      paid: (el) => generateDealColumns(el as any).paid,
      deferred_money: (el) => generateDealColumns(el as any).deferred_money,
      front_end_profit: (el) => generateDealColumns(el as any).front_end_profit,
      back_end_profit: (el) => generateDealColumns(el as any).back_end_profit,
      total_profit: (el) => generateDealColumns(el as any).total_profit,
      note: (customer) => '',
      source: (el) => el.lead_source,
    },
    columnDataTypes: {
      sold_date: 'date',
      funded_date: 'date',
    },
    disabledSortColumns: ['options'],
  });

  const handleCloseWindow = () => {
    clearSpecificClientsData();
    closePaidCustomersList();
    onCloseWindow?.();
  };

  const handleOpenPendingWindow = (
    e: React.MouseEvent<HTMLButtonElement>,
    list: SpecificClients,
  ) => {
    const clientBtnId = e.currentTarget.dataset.id;

    if (clientBtnId) {
      setPendingModalWindowData(
        list?.filter((customer) => {
          const customerId = customer.id;

          return customerId === parseInt(clientBtnId);
        }),
      );
    }

    openClosePendingToFund();
  };

  const handleOpenPendingToFundWindow = (customer: SpecificClient) => {
    setPendingModalWindowData([customer]);
    openClosePendingToFund();
  };

  return (
    <ModalWindow positionFixed top={0} minSizeFull overflowYScroll height={100}>
      <ModalContainer marginTop={5.555556} width={96.822917}>
        <ModalContainerTitle
          title="Funding"
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
          <Paragraph color="#00A78B" fontSize={2.777778} fontWeight={500} marginBottom={1}>
            In Process
          </Paragraph>
          {showFilter && (
            <aside className="mb-[1.5vh]">
              <CustomerListFilter
                filters={filtersProcessing}
                updateFilter={updateFilterProcessing}
                clearFilters={clearFiltersProcessing}
                doDataFetch={doFetchOne}
                setLoading={setLoading}
                setDoFetch={setDoFetchOne}
                specificCustomerStatusId={CustomersStatuses.Sold}
                visibleFiltersOptions={{
                  interestedVehicle: true,
                  leadSource: true,
                  asignedToFinanceManagerId: true,
                  dealBank: true,
                  soldDate: true,
                }}
              />
            </aside>
          )}
          <ColoredTableV2
            data={processingData || []}
            columns={columns1}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={10}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            height={54}
            rowSelectionIsActive={false}
            rowHighlightCondition={(originalRow: SpecificClient) => {
              if (!originalRow.deal || originalRow.deal.length === 0) return '#9ac2be'; //'#b2dfdb';
              return false;
            }}
          />
          <Paragraph
            color="#00A78B"
            fontSize={2.777778}
            fontWeight={500}
            marginTop={6.6296296}
            marginBottom={1}
          >
            Funded
          </Paragraph>
          {showFilter && (
            <aside className="mb-[1.5vh]">
              <CustomerListFilter
                filters={filtersFunded}
                updateFilter={updateFilterFunded}
                clearFilters={clearFiltersFunded}
                doDataFetch={doFetchTwo}
                setLoading={setLoadingTwo}
                setDoFetch={setDoFetchTwo}
                specificCustomerStatusTwoId={CustomersStatuses.Sold}
                visibleFiltersOptions={{
                  interestedVehicle: true,
                  leadSource: true,
                  asignedToFinanceManagerId: true,
                  dealBank: true,
                  soldDate: true,
                }}
              />
            </aside>
          )}
          <ColoredTableV2
            data={fundedData || []}
            columns={columns2}
            initialColumnsDef={initialColumnsDef2}
            itemsPerPage={10}
            loading={loadingTwo}
            paginationIsActive
            textColor="#FFF"
            height={54}
            rowSelectionIsActive={false}
            rowHighlightCondition={(originalRow: SpecificClient) => {
              if (!originalRow.deal || originalRow.deal.length === 0) return '#9ac2be'; //'#b2dfdb';
              return false;
            }}
          />
          <Paragraph
            color="#00A78B"
            fontSize={2.777778}
            fontWeight={500}
            marginTop={6.6296296}
            marginBottom={1}
          >
            Returned
          </Paragraph>
          {showFilter && (
            <aside className="mb-[1.5vh]">
              <CustomerListFilter
                filters={filterReturned}
                updateFilter={updateFilterReturned}
                clearFilters={clearFiltersReturned}
                doDataFetch={doFetchThree}
                setLoading={setLoadingThree}
                setDoFetch={setDoFetchThree}
                specificCustomerStatusThreeId={CustomersStatuses.Sold}
                visibleFiltersOptions={{
                  interestedVehicle: true,
                  leadSource: true,
                  asignedToFinanceManagerId: true,
                  dealBank: true,
                  soldDate: true,
                }}
              />
            </aside>
          )}
          <ColoredTableV2
            data={returnedData || []}
            columns={columns3}
            initialColumnsDef={initialColumnsDef3}
            itemsPerPage={10}
            loading={loadingThree}
            paginationIsActive
            textColor="#FFF"
            height={54}
            rowSelectionIsActive={false}
          />
        </ModalContent>
        <AnimatePresence>
          {pendingToFund && <PendingToFound customerData={pendingModalWindowData} />}
        </AnimatePresence>
      </ModalContainer>
    </ModalWindow>
  );
}
