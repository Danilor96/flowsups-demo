import { useCallback, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { adminDashboardStore } from '@/store/adminDashboard';
import { ColoredTableV2 } from '&/table/coloredTable/v2';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { CallActivitySummary } from '@/app/api/reports/storeReport/callActivity/route';
import { ExtraTitleButtonsReports } from '&/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { FilterableField } from '@/store/customerList/types';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { CallDetailSubTable } from '&/miscellaneous/callDetailSubTable/CallDetailSubTable';
import { SmsDetailSubTable } from '&/miscellaneous/smsDetailSubTable/SmsDetailSubTable';
import { AnimatePresence } from 'framer-motion';
import { CustomerListByUser } from '&/dashboard/reports/storeReport/salesActivity/CustomerList';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { FilterGroupV2 } from '@/app/ui/miscellaneous/filterGroup/FilterGroupV2';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';

export function CallActivity({ closeWindow }: CloseWindow) {
  // ----- global states -----

  const { callActivityCalls } = adminDashboardStore();
  const { getCallActivity } = adminDashboardStore();

  const createDate = reportsFiltersStore((store) => store.createDate);
  const { clearFilters, applyFilter } = reportsFiltersStore();

  const getPromiseData = useCallback(() => {
    const resultForQuery = transformDateToQuery(createDate);

    const dateQuery = resultForQuery ? buildDateQueryString(resultForQuery) : null;

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

    return [getCallActivity(dateQuery)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDate]);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [showFilter, setShowFilter] = useState(true);

  const [reloading, setReloading] = useState(false);

  const [user, setUser] = useState<{ id: number; name: string } | null>(null);

  const [openCustomerList, setOpenCustomerList] = useState<boolean>(false);

  type CallActivityArray = Exclude<CallActivitySummary[], undefined>;

  type CallActivityItem = CallActivityArray[number];

  const columnRenderers: { [key: string]: (el: CallActivityItem) => any } = {
    sales_rep: (el) => el.salesRep,
    leads: (el) => (
      <div
        className="cursor-pointer"
        onClick={() => {
          setOpenCustomerList(true);
          setUser({ id: el.salesRepId, name: el.salesRep });
        }}
      >
        {el.leads}
      </div>
    ),
    outbound: (el) => (
      <CallDetailSubTable
        statistics={el.outbound}
        userId={el.salesRepId}
        inbound={false}
        userName={el.salesRep}
      />
    ),
    inbound: (el) => (
      <CallDetailSubTable
        statistics={el.inbound}
        userId={el.salesRepId}
        inbound={true}
        userName={el.salesRep}
      />
    ),
    manual: (el) => (
      <SmsDetailSubTable statistics={el.manual} userId={el.salesRepId} userName={el.salesRep} />
    ),
    auto: (el) => (
      <SmsDetailSubTable statistics={el.auto} userId={el.salesRepId} userName={el.salesRep} auto />
    ),
  };

  let initialColumnsDef = {
    sales_rep: true,
    leads: true,
    outbound: true,
    inbound: true,
    manual: true,
    auto: true,
  };

  const { columns } = useDynamicTableColumns<CallActivitySummary, typeof initialColumnsDef>({
    initialColumnsDef,
    columnGroups: {
      calls: ['outbound', 'inbound'],
      sms: ['manual', 'auto'],
    },
    columnRenderers,
    accessorFnMapper: {
      sales_rep: (el) => el.salesRep,
      leads: (el) => el.leads,
      outbound: (el) => el.outbound,
      inbound: (el) => el.inbound,
      manual: (el) => el.manual,
      auto: (el) => el.auto,
    },
  });

  initialColumnsDef = {
    Calls: true,
    Sms: true,
    ...initialColumnsDef,
  } as any;

  const filterableFields: FilterableField[] = [
    { id: 'salesRep', label: 'Sales Rep', type: 'text' },
    { id: 'leads', label: 'Leads', type: 'number' },
    { id: 'outbound', label: 'Outbound', type: 'number' },
    { id: 'inbound', label: 'Inbound', type: 'number' },
    { id: 'manual', label: 'Manual', type: 'number' },
    { id: 'auto', label: 'Auto', type: 'number' },
  ];

  const filteredData = applyFilter(callActivityCalls, { salesRep: 'salesRepId' });

  const reloadHandling = async () => {
    setReloading(true);

    const resultForQuery = transformDateToQuery(createDate);

    const dateQuery = resultForQuery ? buildDateQueryString(resultForQuery) : null;

    await getCallActivity(dateQuery);

    setReloading(false);
  };

  return (
    <ModalWindow top={0}>
      <ModalContainer width={97.395833} marginTop={1.759259}>
        <ModalContainerTitle
          title="Call Activity"
          closeWindowFunction={() => {
            clearFilters();

            closeWindow(false);
          }}
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
            <ButtonContainer marginTop={0} marginBottom={1.5} widthFull alignContentEnd>
              <FilterGroupV2
                availableFilters={{
                  createDate: true,
                  salesRep: true,
                }}
                advancedFilterFields={filterableFields}
              />
            </ButtonContainer>
          )}
          <ColoredTableV2
            data={filteredData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={8}
            paginationIsActive
            textColor="#FFF"
            height={63.2}
            rowSelectionIsActive={false}
            headerTextCenter
            bodyTextCenter
            headerBorder
            loading={loading || reloading}
            printButtonIsActive
          />
        </ModalContent>
      </ModalContainer>
      <AnimatePresence>
        {user && openCustomerList && (
          <CustomerListByUser user={user} close={() => setOpenCustomerList(false)} />
        )}
      </AnimatePresence>
    </ModalWindow>
  );
}
