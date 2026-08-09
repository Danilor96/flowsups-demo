import { ButtonContainer } from '&/buttons/ButtonContainer';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { CloseWindow } from '@/app/libs/definitions';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';
import { AdvancedFiltersPanel } from '@/app/ui/miscellaneous/advanceFilterPanel/AdvanceFilterPanel';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { SortButtons } from '@/app/ui/miscellaneous/extraTitleButtonsReports/reportsButtons/addReportModal/advanceFilter/sortButton/SortButton';
import { MonthNavigator } from '@/app/ui/miscellaneous/monthNavigator/MonthNavigator';
import { SmsPorcentValWatching } from '@/app/ui/miscellaneous/smsPorcentValWatching/SmsPorcentValWatching';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { useReportAndFilter } from '@/hooks/reportAndFiltrGenerator';
import { FilterableField } from '@/store/customerList/types';
import { reportsFiltersStore } from '@/store/filtersHandling';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { useCalendarStore } from '@/store/monthNavigation';
import { ColumnOrderState } from '@tanstack/react-table';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { currencyFormat } from '../../utils';
import { CustomerListByUser } from '../salesActivity/CustomerList';
// import DailyTargetUserInput from './DailyTargetInput';
import { messagesStore } from '@/store/adminDashboard';

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
  active_leads: number;
  sold_leads: number;
  user: {
    name: string;
    last_name: string;
    id: number;
    sales_points_today: number;
    sales_points_total: number;
    daily_points_target: number | null;
    monthly_vehicle_sales_goal: number | null;
    monthly_goals: {
      id: number;
      sales_goal: number;
    }[];
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

export function SalesLeaderBoard({ closeWindow }: CloseWindow) {
  // ----- global states -----
  // const users = adminDashboardStore(state => state.users);
  // const getUsers = adminDashboardStore(state => state.getUsers);
  const formatIncomingObjectDate = inputTypeDateFormatStore(state => state.formatIncomingObjectDate);
  const { clearFilters, applyFilter } = reportsFiltersStore();
  const { currentMonth, currentYear, resetMonthFilter, setFetchingData } = useCalendarStore();
  const setMessages = messagesStore(state => state.setMessages);
  
  
  // ----- local states -----
  const [activityCounts, setActivityCounts] = useState<ActivityCounts[]>([]);
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

  const fetchActivityCounts = async ({ month, year }: { month: number; year: number }) => {
    const urlParams = getMonthDateRangeParams(month,year);
    
    try {
      setLoading(true);
      setFetchingData(true);
      const response = await fetch(`/api/reports/storeReport/salesRepScoreLeader?${urlParams || ''}`);
      const data = (await response.json()) as { activityCounts: ActivityCounts[]; businessSalesGoalsConfig: any };
      if(response.ok){
        setActivityCounts(data.activityCounts);
      } else {
        console.log('Error fetching data', response);
        setMessages('Error fetching data');
      }
      setFetchingData(false);
      setLoading(false);
    } catch (error) {
      setFetchingData(false);
      setLoading(false);
      setMessages('Error fetching data');
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchActivityCounts({ month: currentMonth, year: currentYear });
  }, [currentMonth, currentYear]);

  const handleRefreshButtonClick = async () => {
    await fetchActivityCounts({month: currentMonth, year: currentYear});
  };

  // handling close current window
  const handleCloseWindow = () => {
    resetMonthFilter();
    closeWindow(false);
  };

  const initialColumnsDef = {
    rep: true,
    monthly_goal: true,
    goal_attained: true,
    active_leads: true,
    sold_leads: true,
    pace: true,
    front_gross: true,
    backend_gross: true,
    total_gross: true,
  };

  const columsRenderers: { [key in keyof typeof initialColumnsDef]?: (el: ActivityCounts) => any } = {
    monthly_goal: item => {
      const currentMonthlyTarget = item.user?.monthly_goals[0]?.sales_goal || 0;
      return (
        <DailyTargetUserInput
          userId={item.userId}
          currentDailyTarget={currentMonthlyTarget}
          onSave={({ currentMonth, currentYear }) => fetchActivityCounts({ month: currentMonth, year: currentYear })}
        />
      );
    },
    goal_attained: item => {
      const currentMonthlyTarget = item.user?.monthly_goals[0]?.sales_goal || 0;
      return <SmsPorcentValWatching showCount={false} barColor="#FFF" count={item.sold_leads || 0} total={currentMonthlyTarget} />;
    },
    active_leads: item => {
      return <div onClick={() => { 
        setOpenCustomerList(true);
        setSelectedUser({ id: item.userId, name: `${item.user?.name || ''} ${item.user?.last_name || ''}`  });
      }}>
        {item.active_leads || 0}</div>;
    },
    pace: item => {
      const sold = item.sold_leads || 0;
      const goal = item.user?.monthly_goals[0]?.sales_goal || 0;
      if (!goal) return '0%';

      const today = new Date();
      const currentDay = today.getDate();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

      const goalAttainment = sold / goal;
      const pace = (daysInMonth * goalAttainment) / currentDay;
      
      return `${(pace * 100).toFixed(0)}%`;
    },
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
      monthly_goal: item => item.user?.monthly_goals[0]?.sales_goal || 0,
      goal_attained: item => `${item.sold_leads || 0} / ${item.user?.monthly_goals[0]?.sales_goal || 1}`,
      active_leads: item => item.active_leads || 0,
      sold_leads: item => item.sold_leads || 0,
      pace: item => {
        const sold = item.sold_leads || 0;
        const goal = item.user?.monthly_goals[0]?.sales_goal || 0;
        if (!goal) return '0%';

        const today = new Date();
        const currentDay = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        const goalAttainment = sold / goal;
        const pace = (daysInMonth * goalAttainment) / currentDay;

        return `${(pace * 100).toFixed(0)}%`;
      },
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
          title="Sales Leader Board"
          closeWindowFunction={handleCloseWindow}
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={filterableFields}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={handleRefreshButtonClick}
            />
          }
          extraComponent={
            <div className="ml-[-20vw]">
              <MonthNavigator />
            </div>
          }
        />
        <ModalContent>
          <ButtonContainer marginTop={0} marginBottom={2.5} widthFull justify="space-between" alignContentCenter>
            {showFilter && (
              <>
                <div className="h-full flex flex-col justify-between">
                  {/* <FilterGroupV2
                    availableFilters={{
                      createDate: true
                    }}
                  /> */}
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
              <CustomerListByUser
                user={selectedUser}
                close={() => setOpenCustomerList(false)}
                excludeClientStatus={[10, 12]} // lost, sold
              />
            )}
          </AnimatePresence>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}


const DailyTargetUserInput = ({
  userId,
  currentDailyTarget,
  onSave
}: {
  currentDailyTarget: number;
  userId: number;
  onSave?: ({ currentMonth, currentYear }: { currentMonth: number; currentYear: number }) => Promise<void>;
}) => {
  const setMessages = messagesStore(state => state.setMessages);
  const { currentMonth, currentYear } = useCalendarStore();

  const [inputValue, setInputValue] = useState<number | null>(currentDailyTarget);
  const [loading, setLoading] = useState<boolean>(false);
  const inputEditedRef = useRef<NodeJS.Timeout | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const updateDailyTargetPut = async (userId: number, dailyTarget: number | null) => {
    const formData = new FormData();
    dailyTarget && formData.append('salesGoal', dailyTarget.toString());
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear);

    try {
      setLoading(true);
      const response = await fetch(
        `/api/reports/storeReport/salesRepScoreLeader/${userId}/monthly-goals?${urlParams || ''}`,
        {
          method: 'PUT',
          body: formData
        }
      );
      const data = await response.json();
      if (data.serverError || data.error) {
        setMessages(data.serverError || data.error);
        return;
      }
      onSave?.({ currentMonth, currentYear });
      setMessages(undefined, 'Daily target updated successfully');
      setIsFocused(false);
    } catch (error) {
      setMessages('Error updating daily target');
      console.error('Error updating daily target:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleUpdateDailyTarget = async (userId: number, dailyTarget: number | null) => {
  //   if (inputEditedRef.current) clearTimeout(inputEditedRef.current);

  //   inputEditedRef.current = setTimeout(async () => {
  //     await updateDailyTargetPut(userId, dailyTarget);
  //   }, 1000);
  // };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? null : parseInt(e.target.value);
    setInputValue(newValue);
    // handleUpdateDailyTarget(userId, newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleUpdateDailyTarget = async ({ userId, inputValue }: { userId: number; inputValue: number | null }) => {
    await updateDailyTargetPut(userId, inputValue);
  };

  return (
    <div
      className="flex gap-1 relative items-center"
      onFocus={handleFocus}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false);
        }
      }}
    >
      <input
        type="number"
        value={inputValue || ''}
        className="w-[4rem] h-full px-2 p-1 bg-transparent transition-colors outline-none
          text-white border border-transparent hover:border-white focus:border-white
        "
        onChange={e => onChange(e)}
      />
      {!loading && isFocused && (
        <button
          title="Save cost"
          className="hover:scale-105 transition-all"
          onClick={event => {
            event?.preventDefault();
            event?.stopPropagation();
            if (inputValue === null) {
              handleUpdateDailyTarget({ userId, inputValue: 0 });
              return;
            }
            handleUpdateDailyTarget({ userId, inputValue });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/90 hover:text-white transition-colors"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
            <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M14 4l0 4l-6 0l0 -4" />
          </svg>
        </button>
      )}
      {loading && (
        <svg
          className="size-5 animate-spin text-white z-[10]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </div>
  );
};