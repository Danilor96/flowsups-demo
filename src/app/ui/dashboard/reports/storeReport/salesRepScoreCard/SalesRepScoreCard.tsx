import { useEffect, useMemo, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { ColumnDef, ColumnOrderState, VisibilityState } from '@tanstack/react-table';
import { adminDashboardStore } from '@/store/adminDashboard';
import { ReportsFilter } from './ReportsFilter';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import DailyTargetUserInput from './DailyTargetInput';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { FilterGroupV2 } from '@/app/ui/miscellaneous/filterGroup/FilterGroupV2';
import { AdvancedFiltersPanel } from '@/app/ui/miscellaneous/advanceFilterPanel/AdvanceFilterPanel';
import { SortButtons } from '@/app/ui/miscellaneous/extraTitleButtonsReports/reportsButtons/addReportModal/advanceFilter/sortButton/SortButton';
import { FilterableField } from '@/store/customerList/types';
import { useReportAndFilter } from '@/hooks/reportAndFiltrGenerator';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { currencyFormat } from '../../utils';
import { AnimatePresence } from 'framer-motion';
import { CustomerListByUser } from '../salesActivity/CustomerList';

export const enum ActivityType {
  SMS_SENT = 'SMS_SENT',
  EMAIL_SENT = 'EMAIL_SENT',
  CALL_MADE = 'CALL_MADE',
  APPOINTMENT_COMPLETED = 'APPOINTMENT_COMPLETED',
  APPOINTMENT_MADE = 'APPOINTMENT_MADE',
  CUSTOMER_SOLD = 'CUSTOMER_SOLD',
}

export type ActivityCounts = {
  userId: number;
  activities: Record<ActivityType, number>;
  active_leads: number;
  user: {
    name: string;
    last_name: string;
    id: number;
    sales_points_today: number;
    sales_points_total: number;
    daily_points_target: number | null;
  } | null;

  businessSalesGoalsConfig: number | null | undefined;
  frontend: number;
  backend: number;
  total: number;
};

const totalsColumnsInit = {
  // id: true,
  rep: true,
  daily_target: true,
  points_attained: true,
  active_leads: false,
  emails_send: true,
  sms_send: true,
  calls_made: true,
  appts_completed: true,
  appts_made: true,
  sold_leads: true,
  front_gross: false,
  total_gross: false,
};

export function SalesRepScoreCard({ closeWindow }: CloseWindow) {
  // ----- global states -----
  // const users = adminDashboardStore(state => state.users);
  // const getUsers = adminDashboardStore(state => state.getUsers);
  const formatIncomingObjectDate = inputTypeDateFormatStore(state => state.formatIncomingObjectDate);
  const { clearFilters, applyFilter } = reportsFiltersStore();
  const createDate = reportsFiltersStore(store => store.createDate);
  
  // ----- local states -----
  const [activityCounts, setActivityCounts] = useState<ActivityCounts[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [selectedDateInput, setSelectedDateInput] = useState<string | null>(formatIncomingObjectDate(new Date()));
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
  const [openCustomerList, setOpenCustomerList] = useState<boolean>(false);

  // table data
  const [reportData, setReportData] = useState<ActivityCounts[]>([]);

  // table totals data
  const [totalsData, setTotalsData] = useState<any[]>([
    {
      totals: 'Totals',
      daily_target: 0,
      points_attained: 0,
      active_leads: 0,
      emails_send: 0,
      sms_send: 0,
      calls_made: 0,
      appts_completed: 0,
      sold_leads: 0,
      front_gross: 0,
      total_gross: 0,
    },
  ]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 9,
  });
  // const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ select: false, ...totalsColumnsInit });
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(Object.keys(totalsColumnsInit));
  const [loading, setLoading] = useState<boolean>(true);
  const [showFilter, setShowFilter] = useState(true);

  const fetchActivityCounts = async (filter: object | null) => {
    try {
      setLoading(true);
      const dateQueryString = buildDateQueryString(filter);
      const response = await fetch(`/api/reports/storeReport/salesRepScore?${dateQueryString}`);
      const data = (await response.json()) as { activityCounts: ActivityCounts[]; businessSalesGoalsConfig: any };
      setActivityCounts(data.activityCounts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activity counts:', error);
    }
  };

  useEffect(() => {
    const dateToExternalFilter = transformDateToQuery(createDate);
    if (dateToExternalFilter) {
      // between
      if (dateToExternalFilter.optionDate === '13' && (!dateToExternalFilter.fromDate || !dateToExternalFilter.toDate))
        return;
      // previous / upcoming / last x days / last x months
      const options = ['4', '5', '10', '11'];
      if (
        options.includes(dateToExternalFilter.optionDate || '0') &&
        (!dateToExternalFilter.valueDate || dateToExternalFilter.valueDate === '0')
      )
        return;
    }
    fetchActivityCounts(dateToExternalFilter);
  }, [createDate]);

  const handleRefreshButtonClick = async () => {
    const dateToExternalFilter = transformDateToQuery(createDate);
    await fetchActivityCounts(dateToExternalFilter);
  };

  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  // handling buttons
  const handleButtons = (e: React.MouseEvent<HTMLButtonElement>) => {};

  // handling search input
  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setSelectedDateInput(formatIncomingObjectDate(date));
  };

  const initialColumnsDef = {
    rep: true,
    daily_target: true,
    points_attained: true,
    active_leads: true,
    emails_send: true,
    sms_send: true,
    calls_made: true,
    appts_completed: true,
    appts_made: true,
    sold_leads: true,
    front_gross: true,
    backend_gross: true,
    total_gross: true,
  };

  //     rep: `${user.name || ''} ${user.last_name || ''}`,
  //     daily_target: <DailyTargetUserInput userId={item.userId} currentDailyTarget={currentDailyTarget} />,
  //     points_attained: user.sales_points_total,
  //     active_leads: 0,
  //     emails_send: item.activities.EMAIL_SENT,
  //     sms_send: item.activities.SMS_SENT,
  //     calls_made: item.activities.CALL_MADE,
  //     appts_completed: item.activities.APPOINTMENT_COMPLETED,
  //     appts_made: item.activities.APPOINTMENT_MADE,
  //     sold_leads: item.activities.CUSTOMER_SOLD,
  //     front_gross: 0,
  //     total_gross: 0,

  const columsRenderers: { [key in keyof typeof initialColumnsDef]?: (el: ActivityCounts) => any } = {
    daily_target: item => {
      const currentDailyTarget = item.user?.daily_points_target || item.businessSalesGoalsConfig || 0;
      return <DailyTargetUserInput userId={item.userId} currentDailyTarget={currentDailyTarget} />;
    },
    active_leads: item => {
      return <div onClick={() => { 
        setOpenCustomerList(true);
        setSelectedUser({ id: item.userId, name: `${item.user?.name || ''} ${item.user?.last_name || ''}`  });
      }}>
        {item.active_leads || 0}</div>;
    }
  };

  const { columns } = useDynamicTableColumns<ActivityCounts, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers: columsRenderers,
    accessorFnMapper: {
      rep: (item: ActivityCounts) => {
        if (!item.user) return '';
        const user = item.user;
        return `${user.name || ''} ${user.last_name || ''}`;
      },
      daily_target: item => item.user?.daily_points_target || item.businessSalesGoalsConfig || 0,
      points_attained: item => item.user?.sales_points_total || 0,
      active_leads: item => item.active_leads || 0,
      emails_send: item => item.activities.EMAIL_SENT || 0,
      sms_send: item => item.activities.SMS_SENT || 0,
      calls_made: item => item.activities.CALL_MADE || 0,
      appts_completed: item => item.activities.APPOINTMENT_COMPLETED || 0,
      appts_made: item => item.activities.APPOINTMENT_MADE || 0,
      sold_leads: item => item.activities.CUSTOMER_SOLD || 0,
      front_gross: item => currencyFormat.format(item.frontend || 0),
      backend_gross: item => currencyFormat.format(item.backend || 0),
      total_gross: item => currencyFormat.format(item.total || 0),
    },
  });

    const {
      // tableData: filteredTableData,
      filterHandler,
      sortConfig,
      sortHandler,
      clearSort,
      regularFilters,
      // dateToExternalFilter,
      resetGeneralFilter,
    } = useReportAndFilter({
      data: activityCounts,
      // accessorMap: {
      //   customerName: 'name_lastname',
      //   soldDate: 'client_status_changed_at',
      // },
    });

  // const columns: ColumnDef<any>[] = useMemo(() => {
  //   const firstRowKeys = Object.keys(totalsColumnsInit);
  //   const columnsToDisplay = firstRowKeys.filter(key => key !== 'id');
  //   // const columnsStyles: Record<string, { size?: number }>  = {
  //   //   customer_name: { size: viewType === ListViewTypes.ListView ? 170 : 500 },
  //   //   assigned_to: { size: 240 },
  //   //   phone_number: { size: 160 },
  //   //   credit_app: { size: 120 },
  //   //   source: { size: 120 },
  //   //   city: { size: 140 },
  //   //   state: { size: 140 },
  //   //   status: { size: 130 },
  //   //   created_date: { size: 130 },
  //   //   created_by: { size: 140 },
  //   //   interested_vehicle: { size: viewType === ListViewTypes.ListView ? 190 : 350 },
  //   //   // DetailView
  //   //   date: { size: 280 },
  //   //   lead_info: { size: 480 },
  //   // };

  //   return columnsToDisplay.map(columnId => {
  //     return {
  //       id: columnId,
  //       accessorKey: columnId,
  //       header: () => {
  //         let headerText = columnId;
  //         if (columnId.includes('_')) {
  //           headerText = columnId
  //             .split('_')
  //             .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
  //             .join(' ');
  //         } else {
  //           headerText = `${columnId.charAt(0).toUpperCase()}${columnId.slice(1)}`;
  //         }
  //         return headerText;
  //       },
  //       cell: info => info.getValue(),
  //       // minSize: 250,
  //       // size: columnsStyles[columnId]?.size || undefined,
  //       enableResizing: true,
  //     };
  //   });
  // }, []);

  const filterableFields: FilterableField[] = [
    { id: 'user.name', label: 'Rep', type: 'text' },
    // { id : '_count.frontend', label: 'Frontend', type: 'number' },
    // { id : '_count.backend', label: 'Backend', type: 'number' },
    // { id : '_count.total', label: 'Total', type: 'number' },
  ];

  return (
    <ModalWindow top={0}>
      <ModalContainer width={97.395833} marginTop={1.759259}>
        <ModalContainerTitle
          title="Sales Rep Score Card"
          closeWindowFunction={handleCloseWindow}
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={filterableFields}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={handleRefreshButtonClick}
            />
          }
        />
        <ModalContent>
          <ButtonContainer marginTop={0} marginBottom={2.5} widthFull justify="space-between" alignContentCenter>
            {showFilter && (
              <>
                <div className="h-full flex flex-col justify-between">
                  <FilterGroupV2
                    availableFilters={{
                      createDate: true,
                    }}
                  />
                </div>
                <div className="flex flex-row gap-[0.5vw] mt-auto">
                  <AdvancedFiltersPanel filterableFields={filterableFields} onApplyFilters={filterHandler} />
                  <SortButtons
                    sortOptions={filterableFields}
                    sortConfig={sortConfig}
                    sortHandler={sortHandler}
                    clearSort={clearSort}
                  />
                </div>
              </>
            )}
          </ButtonContainer>
          <ColoredTableV2
            data={activityCounts || []}
            initialColumnsDef={initialColumnsDef}
            columns={columns}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            // width={tableWidth}
            height={showFilter ? 61.2 : 71}
            headerTextCenter
            bodyTextCenter
            rowSelectionIsActive={false}
            printButtonIsActive
          />
          <AnimatePresence>
            {selectedUser && openCustomerList && (
              <CustomerListByUser user={selectedUser} close={() => setOpenCustomerList(false)}
                excludeClientStatus={[10,12]} // lost, sold
              />
            )}
          </AnimatePresence>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
