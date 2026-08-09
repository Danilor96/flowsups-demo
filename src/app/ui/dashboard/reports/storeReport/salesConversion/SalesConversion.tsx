import { useCallback, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '&/table/coloredTable/v2';
import {
  SalesConversionSummary,
  SalesConversionSummaryColsTotal,
} from '@/app/api/reports/storeReport/salesConversion/types';
import { getData } from './salesConversion.services';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { ExtraTitleButtonsReports } from '&/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { FilterableField } from '@/store/customerList/types';
import { FilterGroupV2 } from '&/miscellaneous/filterGroup/FilterGroupV2';
import { SmsPorcentValWatching } from '@/app/ui/miscellaneous/smsPorcentValWatching/SmsPorcentValWatching';
import { CustomersDetail } from './customersDetail/CustomersDetail';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { AnimatePresence } from 'framer-motion';
import { SmsDetailSubTable } from '@/app/ui/miscellaneous/smsDetailSubTable/SmsDetailSubTable';

export function SalesConversion({ closeWindow }: CloseWindow) {
  // ----- global states -----

  const createDate = reportsFiltersStore((store) => store.createDate);
  const { clearFilters, applyFilter } = reportsFiltersStore();

  const getPromiseData = useCallback(() => {
    const resultForQuery = transformDateToQuery(createDate);

    const dateQueryString = resultForQuery ? buildDateQueryString(resultForQuery) : null;

    if (
      resultForQuery?.optionDate === '13' &&
      (!resultForQuery.fromDate || !resultForQuery.toDate)
    ) {
      return [];
    }

    const options = ['4', '5', '10', '11'];
    if (
      options.includes(resultForQuery?.optionDate || '0') &&
      (!resultForQuery?.valueDate || resultForQuery?.valueDate === '0')
    ) {
      return [];
    }

    return [fetchData(dateQueryString)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDate]);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [data, setData] = useState<SalesConversionSummary[]>([]);
  const [dataColsTotals, setDataColsTotals] = useState<SalesConversionSummaryColsTotal>();
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState('');
  const [customerStatusId, setCustomerStatusId] = useState<number | null>(null);

  const fetchData = async (dateQueryString?: string | null) => {
    const res = await getData(dateQueryString);

    setData(res.salesConversionSummary);

    setDataColsTotals(res.colsTotals);
  };

  const rowTotals = {
    assigned_rep: 'Totals',
    total_lead: dataColsTotals?.totalColLeads || 0,
    new: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColNew || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
    contacted: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColContacted || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
    credit_app: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColCreditApp || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
    delivery: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColDelivery || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
    undelivered: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColUndelivered || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
    appointment: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColAppointment || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
    show_up: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColShowUp || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
    no_show_up: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColNoShowUp || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
    deposit: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColDeposit || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
    sold: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColSold || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
    funding: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColFunding || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
    lost: (
      <SmsPorcentValWatching
        skipCircleChart
        barColor="#00A78B"
        count={dataColsTotals?.totalColLost || 0}
        total={dataColsTotals?.totalColLeads || 0}
      />
    ),
  };

  const columnRenderers: { [key: string]: (el: SalesConversionSummary) => any } = {
    assigned_rep: (el) => el.assignedRep,
    total_lead: (el) => el.totalLead,
    new: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.New);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.new} total={el.totalLead} />
      </button>
    ),
    contacted: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.Contacted);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.contacted} total={el.totalLead} />
      </button>
    ),
    credit_app: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.CreditApp);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.creditApp} total={el.totalLead} />
      </button>
    ),
    delivery: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.Delivery);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.delivery} total={el.totalLead} />
      </button>
    ),
    undelivered: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.Undelivery);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.undelivered} total={el.totalLead} />
      </button>
    ),
    appointment: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.Appointment);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.appointment} total={el.totalLead} />
      </button>
    ),
    show_up: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.Show);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.showUp} total={el.totalLead} />
      </button>
    ),
    no_show_up: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.NoShowUp);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.noShowUp} total={el.totalLead} />
      </button>
    ),
    deposit: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.Deposit);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.deposit} total={el.totalLead} />
      </button>
    ),
    sold: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.Sold);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.sold} total={el.totalLead} />
      </button>
    ),
    funding: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.Funded);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.funding} total={el.totalLead} />
      </button>
    ),
    lost: (el) => (
      <button
        onClick={() => {
          setUserId(el.assignedRepId);
          setUser(el.assignedRep);
          setCustomerStatusId(CustomersStatuses.Lost);
        }}
      >
        <SmsPorcentValWatching barColor="#FFF" count={el.lost} total={el.totalLead} />
      </button>
    ),
  };

  const initialColumnsDef = {
    assigned_rep: true,
    total_lead: true,
    new: true,
    contacted: true,
    credit_app: true,
    delivery: true,
    undelivered: true,
    appointment: true,
    show_up: true,
    no_show_up: true,
    deposit: true,
    sold: true,
    funding: true,
    lost: true,
  };

  const { columns } = useDynamicTableColumns<SalesConversionSummary, typeof initialColumnsDef>({
    initialColumnsDef,
    columnRenderers,
    accessorFnMapper: {
      assigned_rep: (el) => el.assignedRep,
      total_lead: (el) => el.totalLead,
      new: (el) => el.new,
      contacted: (el) => el.contacted,
      credit_app: (el) => el.creditApp,
      delivery: (el) => el.delivery,
      undelivered: (el) => el.undelivered,
      appointment: (el) => el.appointment,
      show_up: (el) => el.showUp,
      no_show_up: (el) => el.noShowUp,
      deposit: (el) => el.deposit,
      sold: (el) => el.sold,
      funding: (el) => el.funding,
      lost: (el) => el.lost,
    },
  });

  const filterableFields: FilterableField[] = [
    { id: 'assignedRep', label: 'Assigned Rep', type: 'text' },
    { id: 'totalLead', label: 'Total Lead', type: 'text' },
    { id: 'new', label: 'New', type: 'text' },
    { id: 'contacted', label: 'Contacted', type: 'text' },
    { id: 'creditApp', label: 'Credit App', type: 'text' },
    { id: 'delivery', label: 'Delivery', type: 'text' },
    { id: 'undelivered', label: 'Undelivered', type: 'text' },
    { id: 'appointment', label: 'Appointment', type: 'text' },
    { id: 'showUp', label: 'Show Up', type: 'text' },
    { id: 'noShowUp', label: 'No Show Up', type: 'text' },
    { id: 'deposit', label: 'Deposit', type: 'text' },
    { id: 'sold', label: 'Sold', type: 'text' },
    { id: 'funding', label: 'Funding', type: 'text' },
    { id: 'lost', label: 'Lost', type: 'text' },
  ];

  const filteredData = applyFilter(data);

  const [showFilter, setShowFilter] = useState(true);
  const [reloading, setReloading] = useState(false);

  const reloadHandling = async () => {
    setReloading(true);

    const resultForQuery = transformDateToQuery(createDate);

    const dateQueryString = resultForQuery ? buildDateQueryString(resultForQuery) : null;

    if (
      resultForQuery?.optionDate === '13' &&
      (!resultForQuery.fromDate || !resultForQuery.toDate)
    ) {
      return;
    }

    const options = ['4', '5', '10', '11'];
    if (
      options.includes(resultForQuery?.optionDate || '0') &&
      (!resultForQuery?.valueDate || resultForQuery?.valueDate === '0')
    ) {
      return;
    }

    await fetchData(dateQueryString);

    setReloading(false);
  };

  const handleCloseWindow = () => {
    clearFilters();

    closeWindow(false);
  };

  return (
    <ModalWindow top={0}>
      <ModalContainer width={97.395833} marginTop={1.759259}>
        <ModalContainerTitle
          title="Sales Conversion"
          closeWindowFunction={handleCloseWindow}
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={filterableFields}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={reloadHandling}
            />
          }
        />
        <ModalContent>
          {showFilter && (
            <ButtonContainer marginTop={0} widthFull marginBottom={2}>
              <FilterGroupV2
                availableFilters={{
                  createDate: true,
                }}
                advancedFilterFields={filterableFields}
              />
            </ButtonContainer>
          )}
          <ColoredTableV2
            data={filteredData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={12}
            paginationIsActive
            textColor="#FFF"
            height={63.2}
            bodyTextCenter
            rowSelectionIsActive={false}
            printButtonIsActive
            headerTextCenter
            specialRow={rowTotals}
            loading={loading || reloading}
          />
        </ModalContent>
      </ModalContainer>
      <AnimatePresence>
        {userId && customerStatusId && user && (
          <CustomersDetail
            userId={userId}
            customerStatusId={customerStatusId}
            user={user}
            closeFn={() => {
              setUserId(null);
              setCustomerStatusId(null);
              setUser('');
            }}
          />
        )}
      </AnimatePresence>
    </ModalWindow>
  );
}
