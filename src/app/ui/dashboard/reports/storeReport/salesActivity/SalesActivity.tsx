import { useEffect, useState, useCallback } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { ReportsFilter } from '&/miscellaneous/reportsFilter/ReportsFilter';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import ExtraTitleButtons from '../../../clientSystem/customerList/ExtraTitleButtons';
import { AnimatePresence } from 'framer-motion';
import { CustomerListByUser } from './CustomerList';
import { TasksList } from './TasksList'; // Import the new component
import { AppointmentsList } from './AppointmentsList';
import { Filters } from '../callActivity/filters/Filters';
import { AdvancedFiltersPanel } from '@/app/ui/miscellaneous/advanceFilterPanel/AdvanceFilterPanel';
import { SortButtons } from '@/app/ui/miscellaneous/extraTitleButtonsReports/reportsButtons/addReportModal/advanceFilter/sortButton/SortButton';
import { useReportAndFilter } from '@/hooks/reportAndFiltrGenerator';
import { FilterableField } from '@/store/customerList/types';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { CallDetailSubTable } from '@/app/ui/miscellaneous/callDetailSubTable/CallDetailSubTable';
import { SmsDetailSubTable } from '@/app/ui/miscellaneous/smsDetailSubTable/SmsDetailSubTable';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { FilterGroupV2 } from '@/app/ui/miscellaneous/filterGroup/FilterGroupV2';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';

const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

enum TaskStatus {
  Pending = 1,
  Completed = 2,
  Cancelled = 3,
  Late = 4,
}

enum AppointmentStatus {
  Agended = 1,
  Completed = 2,
  Cancelled = 3,
  Reschedule = 4,
  Visit = 5,
  Confirmed = 6,
  Late = 7,

  Made = 5000,
}

interface SalesActivity {
  id: number;
  name: string | null;
  last_name: string | null;
  username: string | null;
  full_name: string;
  _count: {
    client_seller: number;
    pending_tasks: number;
    late_tasks: number;
    completed_tasks: number;
    inbound_calls: number;
    outbound_calls: number;
    made_appointments: number;
    cancelled_appointments: number;
    rescheduled_appointments: number;
    completed_appointments: number;
    manual_email: number;
    auto_email: number;
    manual_sms: number;
    auto_sms: number;

    sold_unit: number;
    frontend: number;
    backend: number;
    total: number;
  };
}

export function SalesActivity({ closeWindow }: CloseWindow) {
  // ----- global states -----
  const { clearFilters, applyFilter } = reportsFiltersStore();
  const createdDate = reportsFiltersStore((store) => store.createDate);

  // ... (existing states)
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);
  const [openCustomerList, setOpenCustomerList] = useState<boolean>(false);
  const [openTasksList, setOpenTasksList] = useState<boolean>(false); // State for the new modal
  const [openAppointmentsList, setOpenAppointmentsList] = useState<boolean>(false);
  const [taskStatusId, setTaskStatusId] = useState<number | null>(null);
  const [createdBy, setCreatedBy] = useState<number | null>(null);
  const [apptStatusId, setApptStatusId] = useState<number | null>(null);

  // ... (existing code)
  const [loading, setLoading] = useState<boolean>(false);
  // table data
  const [countersData, setCountersData] = useState<any[]>([]);
  const [showFilter, setShowFilter] = useState(true);

  // table category

  const [tableCategory, setTableCategory] = useState<{ category: string; colSpan: number }[]>([
    {
      category: 'comp',
      colSpan: 2,
    },
    {
      category: 'tasks',
      colSpan: 3,
    },
    {
      category: 'calls',
      colSpan: 2,
    },
    {
      category: 'email',
      colSpan: 2,
    },
    {
      category: 'sms',
      colSpan: 2,
    },
    {
      category: 'appt',
      colSpan: 4,
    },
    {
      category: '_blank',
      colSpan: 4,
    },
  ]);

  // table totals data
  const [totalsData, setTotalsData] = useState<any[]>([
    {
      totals: 'Totals',
      leads: 0,
      open: 0,
      late: 0,
      comp: 0,
      outbound: 0,
      inbound: 0,
      manual: 0,
      auto: 0,
      _manual: 0,
      _auto: 0,
      made: 0,
      missed: 0,
      reschedule: 0,
      completed: 0,
      sold_unit: 0,
      frontend: 0,
      backend: 0,
      total: 0,
    },
  ]);

  let initialColumnsDef = {
    rep: true,
    leads: true,
    open: true,
    late: true,
    comp: true,
    outbound: true,
    inbound: true,
    manual: true,
    auto: true,
    _manual: true,
    _auto: true,
    made: true,
    missed: true,
    reschedule: true,
    completed: true,
    sold_unit: true,
    frontend: true,
    backend: true,
    total: true,
  };

  const handleDetailTask = (el: SalesActivity, status: number) => {
    setOpenTasksList(true);
    setUser({ id: el.id, name: `${el.name || ''} ${el.last_name || ''}` });
    setTaskStatusId(status);
  };
  const hanldeDeatilAppt = (el: SalesActivity, status: number) => {
    setOpenAppointmentsList(true);
    setUser({ id: el.id, name: `${el.name || ''} ${el.last_name || ''}` });
    setApptStatusId(status);
    if (status !== AppointmentStatus.Made) {
      setCreatedBy(null);
    }
  };

  const columsRenderer: { [key in keyof typeof initialColumnsDef]?: (el: SalesActivity) => any } = {
    leads: (data: any) => (
      <div
        className="px-4"
        onClick={() => {
          setOpenCustomerList(true);
          setUser({ id: data.id, name: `${data.name || ''} ${data.last_name || ''}` });
        }}
      >
        {data._count.client_seller}
      </div>
    ),
    open: (el) => (
      <div className="px-4" onClick={() => handleDetailTask(el, TaskStatus.Pending)}>
        {el._count.pending_tasks}
      </div>
    ),
    late: (el) => (
      <div className="px-4" onClick={() => handleDetailTask(el, TaskStatus.Late)}>
        {el._count.late_tasks}
      </div>
    ),
    comp: (el) => (
      <div className="px-4" onClick={() => handleDetailTask(el, TaskStatus.Completed)}>
        {el._count.completed_tasks}
      </div>
    ),
    outbound: (el) => (
      <CallDetailSubTable
        statistics={el._count.outbound_calls}
        userId={el.id}
        inbound={false}
        userName={el.full_name}
      />
    ),
    inbound: (el) => (
      <CallDetailSubTable
        statistics={el._count.inbound_calls}
        userId={el.id}
        inbound={true}
        userName={el.full_name}
      />
    ),
    _manual: (el) => (
      <SmsDetailSubTable statistics={el._count.manual_sms} userId={el.id} userName={el.full_name} />
    ),
    _auto: (el) => (
      <SmsDetailSubTable
        statistics={el._count.auto_sms}
        userId={el.id}
        userName={el.full_name}
        auto
      />
    ),

    made: (el) => (
      <div
        onClick={() => {
          setCreatedBy(el.id);
          hanldeDeatilAppt(el, 5000);
        }}
      >
        {el._count.made_appointments}
      </div>
    ),
    missed: (el) => (
      <div onClick={() => hanldeDeatilAppt(el, AppointmentStatus.Cancelled)}>
        {el._count.cancelled_appointments}
      </div>
    ),
    reschedule: (el) => (
      <div onClick={() => hanldeDeatilAppt(el, AppointmentStatus.Reschedule)}>
        {el._count.rescheduled_appointments}
      </div>
    ),
    completed: (el) => (
      <div onClick={() => hanldeDeatilAppt(el, AppointmentStatus.Completed)}>
        {el._count.completed_appointments}
      </div>
    ),
    sold_unit: (el) => <div>{el._count.sold_unit}</div>,
    frontend: (el) => currencyFormat.format(el._count.frontend),
    backend: (el) => currencyFormat.format(el._count.backend),
    total: (el) => currencyFormat.format(el._count.total),
  };

  const { columns } = useDynamicTableColumns<SalesActivity, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: {
      comp: { size: 40 },
      rep: { size: 200 },
      leads: { size: 120 },
      outbound: { size: 130 },
      manual: { size: 100 },
      _auto: { size: 100 },
      // made: { size: 100 },
      reschedule: { size: 200 },
      completed: { size: 100 },
      total: { size: 70 },
    },
    columnGroups: {
      tasks: ['open', 'late', 'comp'],
      calls: ['outbound', 'inbound'],
      email: ['manual', 'auto'],
      sms: ['_manual', '_auto'],
      appt: ['made', 'missed', 'reschedule', 'completed'],
      deals: ['sold_unit', 'frontend', 'backend', 'total'],
    },
    columnRenderers: columsRenderer,
    accessorFnMapper: {
      rep: (row) => `${row.name || ''} ${row.last_name || ''}`,
      leads: (row) => row._count.client_seller,
      open: (row) => row._count.pending_tasks,
      late: (row) => row._count.late_tasks,
      comp: (row) => row._count.completed_tasks,
      outbound: (row) => row._count.outbound_calls,
      inbound: (row) => row._count.inbound_calls,
      manual: (row) => row._count.manual_email,
      auto: (row) => row._count.auto_email,
      _manual: (row) => row._count.manual_sms,
      _auto: (row) => row._count.auto_sms,
      made: (row) => row._count.made_appointments,
      missed: (row) => row._count.cancelled_appointments,
      reschedule: (row) => row._count.rescheduled_appointments,
      completed: (row) => row._count.completed_appointments,
      sold_unit: (row) => row._count.sold_unit,
      frontend: (row) => row._count.frontend,
      backend: (row) => row._count.backend,
      total: (row) => row._count.total,
    },
  });
  initialColumnsDef = {
    cam: true,
    tasks: true,
    Calls: true,
    Email: true,
    SMS: true,
    Appt: true,
    Deals: true,
    ...initialColumnsDef,
  } as any;

  const filterableFields: FilterableField[] = [
    { id: 'full_name', label: 'Rep', type: 'text' },
    { id: '_count.client_seller', label: 'Leads', type: 'number' },
    { id: '_count.pending_tasks', label: 'Open Task ', type: 'number' },
    { id: '_count.late_tasks', label: 'Late Task', type: 'number' },
    { id: '_count.completed_tasks', label: 'Completed Task', type: 'number' },
    { id: '_count.outbound_calls', label: 'Outbound Call', type: 'number' },
    { id: '_count.inbound_calls', label: 'Inbound Call', type: 'number' },
    { id: '_count.manual_email', label: 'Manual Email', type: 'number' },
    { id: '_count.auto_email', label: 'Auto Email', type: 'number' },
    { id: '_count.manual_sms', label: 'Manual SMS', type: 'number' },
    { id: '_count.auto_sms', label: 'Auto SMS', type: 'number' },
    { id: '_count.made_appointments', label: 'Made Appt', type: 'number' },
    { id: '_count.cancelled_appointments', label: 'Missed Appt', type: 'number' },
    { id: '_count.rescheduled_appointments', label: 'Reschedule Appt', type: 'number' },
    { id: '_count.completed_appointments', label: 'Completed Appt', type: 'number' },
    { id: '_count.sold_unit', label: 'Sold Unit', type: 'number' },
    // { id : '_count.frontend', label: 'Frontend', type: 'number' },
    // { id : '_count.backend', label: 'Backend', type: 'number' },
    // { id : '_count.total', label: 'Total', type: 'number' },
  ];

  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  // handling buttons
  const handleButtons = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;
  };

  // handling search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const fetchData = useCallback(async (filter: object | null) => {
    setLoading(true);
    try {
      const queryString = buildDateQueryString(filter);
      const url = `/api/reports/storeReport/salesActivity?${queryString}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      setCountersData(data);
      // setTableCategory(data.tableCategory);
      // setTotalsData(data.totalsData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    const dateToExternalFilter = transformDateToQuery(createdDate);
    if (dateToExternalFilter) {
      // between
      if (
        dateToExternalFilter.optionDate === '13' &&
        (!dateToExternalFilter.fromDate || !dateToExternalFilter.toDate)
      )
        return;

      // previous / upcoming / last x days / last x months
      const options = ['4', '5', '10', '11'];
      if (
        options.includes(dateToExternalFilter.optionDate || '0') &&
        (!dateToExternalFilter.valueDate || dateToExternalFilter.valueDate === '0')
      )
        return;
    }
    fetchData(dateToExternalFilter);
  }, [createdDate]);

  const reloadHandling = async () => {
    const dateToExternalFilter = transformDateToQuery(createdDate);
    await fetchData(dateToExternalFilter);
  };

  const filteredData = applyFilter(countersData, {
    salesRep: 'id',
  });

  return (
    <ModalWindow top={0}>
      <ModalContainer width={97.395833} marginTop={1.759259}>
        <ModalContainerTitle
          title="Sales Activity"
          closeWindowFunction={() => {
            handleCloseWindow();
            clearFilters();
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
            <ButtonContainer marginTop={0} marginBottom={1.5} widthFull alignContentCenter>
              <FilterGroupV2
                advancedFilterFields={filterableFields}
                availableFilters={{
                  createDate: true,
                  createDateLabel: 'Date',
                  salesRep: true,
                }}
              />
              {/* {JSON.stringify({ betweenFrom, betweenTo, salesRep, createdDateAlterInput, dateToExternalFilter })} */}
              {/* <div className="flex flex-row gap-[0.5vw]">
                <AdvancedFiltersPanel filterableFields={filterableFields} onApplyFilters={filterHandler} />
                <SortButtons
                  sortOptions={filterableFields}
                  sortConfig={sortConfig}
                  sortHandler={sortHandler}
                  clearSort={clearSort}
                />
              </div> */}
            </ButtonContainer>
          )}
          <ColoredTableV2
            data={filteredData || []}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={8}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            height={!showFilter ? 75 : 60.2}
            rowSelectionIsActive={false}
            headerTextCenter
            bodyTextCenter
            headerBorder
            printButtonIsActive
          />
          <AnimatePresence>
            {user && openCustomerList && (
              <CustomerListByUser user={user} close={() => setOpenCustomerList(false)} />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {user && openTasksList && taskStatusId && (
              <TasksList
                closeWindow={() => setOpenTasksList(false)}
                user={user}
                taskStatusId={taskStatusId}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {user && apptStatusId && openAppointmentsList && (
              <AppointmentsList
                user={user}
                appointmentStatusId={apptStatusId}
                createdBy={createdBy}
                closeWindow={() => setOpenAppointmentsList(false)}
              />
            )}
          </AnimatePresence>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
