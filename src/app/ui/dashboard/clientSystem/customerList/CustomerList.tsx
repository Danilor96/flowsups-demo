import {
  adminDashboardStore,
  currentSectionStore,
  modalWindowStore,
  numberFormatterStore,
} from '@/store/adminDashboard';
import { useEffect, useMemo, useState } from 'react';
import { Clients, ClientType } from '@/app/libs/definitions';
// import { Button } from '&/buttons/Button';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { importStore } from '@/store/importExportData';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
// import { ColoredTable } from '&/table/coloredTable/ColoredTable';
import ExtraTitleButtons from './ExtraTitleButtons';
import CustomerListFilter from '../customerLists/Filter';
import { CheckboxInput } from '&/inputs/CheckboxInput';
import { useSortTable } from './useSortTable';
import { ColumnDef, ColumnOrderState, VisibilityState } from '@tanstack/react-table';
import { AnimatePresence, motion } from 'framer-motion';
import { AdvancedFiltersPanel } from './AdvancedFilters/AdvanceFilters';
import { PdfContainerForCustomer } from '&/miscellaneous/pdf/pdfContainer/PdfContainer.v2';
import { MultiSelectIcon, NoMultiSelectIcon } from '&/icons/Icons';
import { BulkActions } from './bulkActions/BulkActions';
import SortButtons from './SortButtons/SortButtons';
import { SaveReportAsModal } from './ReportButtons/SaveAsModal';
import { customerListStore } from '@/store/customerList/customerList.store';
import { ListViewTypes } from '@/store/customerList/types';
import { useFiltersForCustomerList } from '../customerLists/Filter/useFiltersForCustomerList';
import AddNewCustomerReportModal from './NewOneCustomerReport/AddReportModal';
import { BulkActionsModals } from './bulkActionsModals/BulkActionsModals';
import { SendReportModal } from './ReportButtons/SendEmailReport/SendReportEmail';
import PermisionModal from './ReportButtons/Permision/Permision';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { Can } from '@/app/ui/auth/Can';
// import { Button } from '@/app/ui/buttons/Button';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { CustomerName } from '@/app/ui/miscellaneous/customerName/CustomerName';
import { UserAssignedName } from '@/app/ui/miscellaneous/userAssignedName/UserAssignedName';
import { DateFormats } from '@/app/ui/miscellaneous/dateFormats/DateFormats';
import { VehicleFormat } from '@/app/ui/miscellaneous/vehicleFormat/VehicleFormat';
import { CustomerContactFormat } from '@/app/ui/miscellaneous/customerContactFormat/CustomerContactFormat';
import { daysOld, formatVehicle } from '../customerLists/utils/utils';
import { transformDateToQuery } from '@/store/filtersHandling';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';

const totalsColumnsInit = {
  customer_name: true,
  lead_info: false, // DetailView
  date: false, // DetailView
  assigned_to: true,
  phone_number: true,
  credit_app: true,
  source: true,
  city: true,
  state: true,
  status: true,
  created_date: true,
  created_by: true,
  interested_vehicle: true,
};

export function CustomerList() {
  // ---- global states ----
  const { closeCustomerList } = modalWindowStore();

  const { selectedCustomersIds, clients } = adminDashboardStore();
  const { setSelectedCustomersIds, setClients } = adminDashboardStore();

  const { openImportData, toggleOpenInNewTab } = modalWindowStore();
  const { openInNewTab } = modalWindowStore();

  const { numberFormatter } = numberFormatterStore();

  const { getCurrentSection } = currentSectionStore();

  const { setApiUrl } = importStore();
  const showSaveAsModal = customerListStore((state) => state.showSaveAsModal);
  const advancedFilters = customerListStore((state) => state.advancedFilters);
  const columnsConfig = customerListStore((state) => state.columnsConfig);
  const currentCustomerReport = customerListStore((state) => state.currentCustomerReport);
  const setCurrentCustomerReport = customerListStore((state) => state.setCurrentCustomerReport);
  const viewType = customerListStore((state) => state.viewType);
  const setViewType = customerListStore((state) => state.setViewType);
  const refreshCustomersList = customerListStore((state) => state.refreshCustomersList);
  const showNewCustomerReportModal = customerListStore((state) => state.showNewCustomerReportModal);
  const showSendReportModal = customerListStore((state) => state.showSendReportModal);
  const showPermissionsModal = customerListStore((state) => state.showPermissionsModal);
  const fetchData = customerListStore((state) => state.fetchingData);

  useEffect(() => {
    getCurrentSection('Customers list');
    setApiUrl('/api/customerData');
  }, [getCurrentSection, setApiUrl]);

  // ---- local states ----
  const [loading, setLoading] = useState<boolean>(true);
  const [toggleFilter, setToggleFilter] = useState(true);
  const [showMultiSelect, setShowMultiSelect] = useState(false);
  const { clearFilters, filterCustomer, filters, updateFilter } = useFiltersForCustomerList();
  const {
    requestSort,
    getSortDirectionLabel,
    setShowSortOptions,
    sortClients,
    showSortOptions,
    sortConfig,
    sortOptions,
    setSortConfig,
  } = useSortTable();
  const [showPdfContainer, setShowPdfContainer] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 9,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    select: showMultiSelect,
    ...totalsColumnsInit,
  });
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(Object.keys(totalsColumnsInit));

  const fetchClientsFromAPI = async (filtersToApply: AppliedFilter[]) => {
    try {
      const resultForQuery = transformDateToQuery(filters.dateFilter);

      const dateQueryString = resultForQuery
        ? buildDateQueryString(resultForQuery, 'Default')
        : null;

      // if (
      //   resultForQuery?.optionDate === '13' &&
      //   (!resultForQuery.fromDate || !resultForQuery.toDate)
      // ) {
      //   return;
      // }

      // const options = ['4', '5', '10', '11'];
      // if (
      //   options.includes(resultForQuery?.optionDate || '0') &&
      //   (!resultForQuery?.valueDate || resultForQuery?.valueDate === '0')
      // ) {
      //   return;
      // }

      setLoading(true);
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch(
        `/api/adminDashboard/clients/by-filters${dateQueryString ? `?${dateQueryString}&timeZone=${timeZone}` : ''}`,
        {
          method: 'POST',
          body: JSON.stringify({ filters: filtersToApply }),
        },
      );
      const clients = await response.json();
      setClients(clients);
      setLoading(false);
      return clients;
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentCustomerReport) return;
    fetchClientsFromAPI(advancedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCustomersList, fetchData]);

  const onApplyFilters = (filters: AppliedFilter[]) => {
    fetchClientsFromAPI(filters);
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'import') {
      openImportData();
    }
  };

  const handleCloseCustomerList = () => {
    closeCustomerList();
    toggleOpenInNewTab(false);
    setCurrentCustomerReport(null);
  };
  const handleRefreshData = () => {
    setLoading(true);
    fetchClientsFromAPI(advancedFilters);
  };

  // ---- Computed values ----

  const filteredClients = useMemo(() => {
    const hasClients = clients && clients?.length > 0; //clientsData && clientsData?.length > 0;
    if (!hasClients) return [];

    return sortClients(filterCustomer(clients) as Clients);
  }, [sortConfig, clients]);

  const hasClientsData = filteredClients && filteredClients?.length > 0;

  // const tableData = useMemo(() => {
  //   return hasClientsData ? generateDataTable(filteredClients as Clients, viewType) : [];
  // }, [filteredClients, viewType, hasClientsData]);

  // visible columns for Pdf
  const visibleColumns = useMemo(() => {
    if (!columnsConfig || columnsConfig.length === 0) return [];
    let visibleCols = columnsConfig.filter((col) => col.checked);
    if (viewType === ListViewTypes.ListView) {
      visibleCols = visibleCols.filter((col) => col.id !== 'date' && col.id !== 'lead_info');
    }
    return visibleCols.map((col) => col.id);
  }, [viewType, columnsConfig, refreshCustomersList]);

  // update column visibility for table
  useEffect(() => {
    let newVisibleColsObject: Record<string, boolean> = { ...columnVisibility };
    const columnsKeys = Object.keys(totalsColumnsInit);
    const hasColumnsConfig = columnsConfig && columnsConfig.length > 0;

    if (!hasColumnsConfig) {
      columnsKeys.forEach((key) => {
        newVisibleColsObject[key] = true;
      });
    }

    let visibleColsFromConfig = columnsConfig ? [...columnsConfig] : [];
    if (viewType === ListViewTypes.ListView && hasColumnsConfig) {
      visibleColsFromConfig = visibleColsFromConfig.filter(
        (col) => col.id !== 'date' && col.id !== 'lead_info',
      );
    }

    if (visibleColsFromConfig.length > 0) {
      //pasar a false todos los que ya estan visibles
      columnsKeys.forEach((key) => {
        newVisibleColsObject[key] = false;
      });
      //y luego pasar a true los que estan en el config
      visibleColsFromConfig.forEach((col) => {
        newVisibleColsObject[col.id] = col.checked;
      });
    }
    setColumnVisibility({ ...newVisibleColsObject, select: showMultiSelect });
  }, [refreshCustomersList, viewType, columnsConfig, showMultiSelect]);

  // const columns: ColumnDef<any>[] = useMemo(() => {
  //   if (!tableData || tableData.length === 0) return [];

  //   const firstRowKeys = Object.keys(tableData[0]);
  //   const columnsToDisplay = firstRowKeys.filter((key) => key !== 'id');
  //   const columnsStyles: Record<string, { size?: number }> = {
  //     customer_name: { size: viewType === ListViewTypes.ListView ? 185 : 500 },
  //     assigned_to: { size: 240 },
  //     phone_number: { size: 170 },
  //     credit_app: { size: 132 },
  //     source: { size: 120 },
  //     city: { size: 140 },
  //     state: { size: 140 },
  //     status: { size: 135 },
  //     created_date: { size: 160 },
  //     created_by: { size: 140 },
  //     interested_vehicle: { size: viewType === ListViewTypes.ListView ? 225 : 350 },
  //     // DetailView
  //     date: { size: 280 },
  //     lead_info: { size: 480 },
  //   };

  //   return columnsToDisplay.map((columnId) => {
  //     return {
  //       id: columnId,
  //       accessorKey: columnId,
  //       header: () => {
  //         let headerText = columnId;
  //         if (columnId.includes('_')) {
  //           headerText = columnId
  //             .split('_')
  //             .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
  //             .join(' ');
  //         } else {
  //           headerText = `${columnId.charAt(0).toUpperCase()}${columnId.slice(1)}`;
  //         }
  //         return headerText;
  //       },
  //       cell: (info) => info.getValue(),
  //       // minSize: 250,
  //       size: columnsStyles[columnId]?.size || undefined,
  //       enableResizing: true,
  //     };
  //   });
  // }, [tableData]);

  const initialColumnsDef = {
    customer_name: true,
    assigned_to: true,
    phone_number: true,
    credit_app: true,
    source: true,
    city: true,
    state: true,
    status: true,
    created_date: true,
    created_by: true,
    interested_vehicle: true,
  };

  const initialDetailViewColumnsDef = {
    customer_name: true,
    lead_info: true,
    date: true,
    interested_vehicle: true,
  };

  const listViewColumnRenderers: {
    [key in keyof typeof initialColumnsDef]: (el: ClientType) => any;
  } = {
    customer_name: (el) => (
      <CustomerName
        customer={`${el.first_name} ${el.last_name}`}
        customerId={el.id}
        mxAuto={false}
      />
    ),
    assigned_to: (el) => (
      <div className="w-[40rem]/ text-left truncate">
        <div className="flex items-center w-full gap-1 truncate">
          <span className="font-semibold truncate">Sales Rep:</span>
          <UserAssignedName
            userName={el.seller?.name || 'N/A'}
            userLastname={el.seller?.last_name || ''}
          />
        </div>
        <div className="flex items-center w-full gap-1">
          <span className="font-semibold">BDC Rep:</span>
          <UserAssignedName
            userName={el.bdc?.name || 'N/A'}
            userLastname={el.bdc?.last_name || ''}
          />
        </div>
        <div className="flex items-center w-full gap-1 s">
          <span className="font-semibold">Manager:</span>
          <UserAssignedName
            userName={el.sales_manager?.name || 'N/A'}
            userLastname={el.sales_manager?.last_name || ''}
          />
        </div>
      </div>
    ),
    phone_number: (el) => <CustomerContactFormat contact={el.mobile_phone || undefined} noIcon />,
    credit_app: (el) => (el.credit_app_list_status_id ? 'Yes' : 'No'),
    source: (el) => `${el.lead_source?.source}`,
    city: (el) => `${el.client_address?.city || ''}`,
    state: (el) => `${el.client_address?.state?.state || ''}`,
    status: (el) => (
      <div className="flex items-center min-w-[7rem] w-full ">
        <div className="flex items-center justify-center rounded-[1.5rem] min-w-[4.5rem] w-full max-w-[8rem] py-[6px] px-[12px] bg-[#C9EBE6] text-[#00A78B] font-bold text-[0.9rem] font-sans capitalize">
          {el.lead && el.lead.length > 0 ? el.lead[0].customer_status?.status : el.client_status?.status}
        </div>
      </div>
    ),
    created_date: (el) => <DateFormats date={el.created_at} format={2} />,
    created_by: (el) => <UserAssignedName userName={'User'} userLastname={'Admin'} />,
    interested_vehicle: (el) => (
      <VehicleFormat interestedVehicle={el.interested_vehicle} mxAuto={false} />
    ),
  };

  const detailViewColumnRenderers: {
    [key in keyof typeof initialDetailViewColumnsDef]: (el: ClientType) => any;
  } = {
    customer_name: (el) => (
      <div className="grid grid-cols-2 gap-6 min-w-[32rem] pl-4 h-full">
        <div className="flex flex-col gap-1">
          <div className="w-full flex items-start justify-start">
            <CustomerName
              customer={`${el.first_name} ${el.last_name}`}
              customerId={el.id}
              mxAuto={false}
            />
          </div>
          <div className="flex gap-1 items-center justify-center w-fit minw-32">
            <span className="font-semibold w-fit">Cell Phone:</span>
            <CustomerContactFormat contact={el.mobile_phone || undefined} noIcon marginInlineAuto />
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold flex-nowrap">Home Phone:</span>
            <CustomerContactFormat contact={el.home_phone || 'N/A'} noIcon marginInlineAuto />
          </div>
          <div className="flex gap-1 justify-center w-fit">
            <span className="font-semibold">Email:</span>
            <p className="max-w-40 text-wrap break-words text-sm">{`${el.email || 'N/A'}`}</p>
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">DOB:</span>
            <DateFormats date={el.born_date || new Date()} format={2} />
          </div>
        </div>
        <div className="flex flex-col gap-1 px-2">
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">City:</span>
            <p>{el.client_address?.city || ''}</p>
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">State:</span>
            <p>{el.client_address?.state?.state || ''}</p>
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">Zip Code:</span>
            <p>{el.client_address?.zip || ''}</p>
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">Income:</span>
            <p>{el.other_income || ''}</p>
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">Cash Down:</span>
            <p>{el.cash_down || ''}</p>
          </div>
        </div>
      </div>
    ),
    lead_info: (el) => (
      <div className="grid grid-cols-2 gap-6 min-w-[28rem] max-w-[32rem] h-full">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">Status:</span>
            <p>{el.client_status?.status || 'No status stablished'}</p>
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">Credit App:</span>
            <p>{el.credit_app_list_status_id ? 'Yes' : 'No'}</p>
          </div>
          <div className="flex gap-1 justify-center w-fit">
            <span className="font-semibold">Sales Rep:</span>
            <UserAssignedName
              userName={el.seller?.name || 'N/A'}
              userLastname={el.seller?.last_name || ''}
            />
          </div>
          <div className="flex gap-1 justify-center w-fit">
            <span className="font-semibold">BDC Rep:</span>
            <UserAssignedName
              userName={el.bdc?.name || 'N/A'}
              userLastname={el.bdc?.last_name || ''}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 justify-center w-fit">
            <span className="font-semibold">Manager:</span>
            <UserAssignedName
              userName={el.sales_manager?.name || 'N/A'}
              userLastname={el.sales_manager?.last_name || ''}
            />
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">Source:</span>
            <p>{el.lead_source.source || 'N/A'}</p>
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">Type:</span>
            <p>{el.lead_type.type || 'N/A'}</p>
          </div>
        </div>
      </div>
    ),
    date: (el) => (
      <div className="flex flex-col gap-1 max-w-[16rem] h-full items-start">
        <div className="flex gap-1 items-center justify-center w-fit">
          <span className="font-semibold">Created</span>
          <DateFormats date={el.created_at} format={2} />
        </div>

        <div className="flex gap-1 items-center justify-center w-fit">
          <span className="font-semibold">Last Contacted Day:</span>
          <div>
            {el.last_activity ? <DateFormats date={el.last_activity} format={2} /> : 'No activity'}
          </div>
        </div>
        <div className="flex gap-1 items-center justify-center w-fit">
          <span className="font-semibold">Visit Date:</span>
          <div>
            {el.last_activity ? <DateFormats date={el.last_activity} format={2} /> : 'No activity'}
          </div>
        </div>
      </div>
    ),
    interested_vehicle: (el) =>
      el.interested_vehicle?.id ? (
        <div className="flex w-full gap-16 h-full items-start">
          <div className="flex flex-col gap-1">
            <div className=" gap-1 items-center justify-center w-fit">
              <VehicleFormat interestedVehicle={el.interested_vehicle} flexRow={true} />
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Price:</span>
              <p>{`$ ${el.interested_vehicle?.title_license?.asking_price || 'N/A'}`}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">
                {`${
                  el.interested_vehicle.vehicle_mileages?.mileage
                    ? el.interested_vehicle.vehicle_mileages?.mileage + 'mil'
                    : 'N/A'
                }`}
                {el.interested_vehicle && el.interested_vehicle?.entry_stock
                  ? ' ! ' + daysOld(el.interested_vehicle?.entry_stock)
                  : 'N/A'}
              </span>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="">
                {el.interested_vehicle?.vehicle_identification_numbers.vin.toUpperCase() || 'N/A'}
              </span>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Stock #:</span>
              <p>{`${el.interested_vehicle?.general_info?.stock_no || 'N/A'}`}</p>
            </div>
          </div>
          <div className="flex self-center items-center gap-1 max-w-[160px] h-auto border-2 border-white rounded-[10px] overflow-hidden">
            {!el.interested_vehicle?.vehicle_image?.path && (
              <div className="w-[130px] h-[130px] bg-gray-200"></div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {el.interested_vehicle?.vehicle_image?.path && (
              <img
                className="w-full h-full"
                src={el.interested_vehicle?.vehicle_image?.path || ''}
                alt=""
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex w-full gap-16 h-full items-start">
          <span className="font-semibold">Unassigned</span>
        </div>
      ),
  };

  const { columns } = useDynamicTableColumns<
    ClientType,
    typeof initialColumnsDef | typeof initialDetailViewColumnsDef
  >({
    initialColumnsDef:
      viewType === ListViewTypes.ListView ? initialColumnsDef : initialDetailViewColumnsDef,
    excludeKeys: ['id'],
    columnRenderers:
      viewType === ListViewTypes.ListView ? listViewColumnRenderers : detailViewColumnRenderers,
    accessorFnMapper: {
      customer_name: (el) => `${el.first_name || ''} ${el.last_name || ''}`,
      assigned_to: (el) => {
        const sellerName = `${el.seller?.name || ''} ${el.seller?.last_name || ''}`;
        const bdcName = `${el.bdc?.name || ''} ${el.bdc?.last_name || ''}`;
        const salesManagerName = `${el.sales_manager?.name || ''} ${
          el.sales_manager?.last_name || ''
        }`;
        return `Sales rep: ${sellerName}, BDC rep: ${bdcName}, Manager: ${salesManagerName}`;
      },
      phone_number: (el) => el.mobile_phone,
      source: (el) => el.lead_source?.source,
      city: (el) => el.client_address?.city || '',
      state: (el) => el.client_address?.state?.state || '',
      status: (el) => el.client_status?.status || '',
      created_date: (el) => el.created_at,
      created_by: (el) => 'System',
      interested_vehicle: (el) =>
        el.interested_vehicle ? formatVehicle(el.interested_vehicle) : '',
    },
    columnDataTypes: {
      created_date: 'date',
    },
    columnStyles: {
      customer_name: { size: viewType === ListViewTypes.ListView ? 185 : 500 },
      assigned_to: { size: 240 },
      phone_number: { size: 170 },
      credit_app: { size: 132 },
      source: { size: 120 },
      city: { size: 140 },
      state: { size: 140 },
      status: { size: 135 },
      created_date: { size: 160 },
      created_by: { size: 140 },
      interested_vehicle: { size: viewType === ListViewTypes.ListView ? 225 : 350 },
      // DetailView
      date: { size: 280 },
      lead_info: { size: 480 },
    },
    disabledSortColumns:
      viewType === ListViewTypes.DetailView ? ['date', 'lead_info'] : (undefined as any),
    sortableColumns:
      viewType === ListViewTypes.DetailView
        ? ['customer_name', 'interested_vehicle']
        : (undefined as any),
    dynamicRenderVariable: viewType,
  });

  return (
    <>
      <ModalWindow top={-17}>
        <ModalContainer width={95.583333} marginTop={3}>
          <ModalContainerTitle
            title="Customer List"
            closeWindowFunction={handleCloseCustomerList}
            extraTitleComponent={
              <ExtraTitleButtons
                filterToggle={() => setToggleFilter((prevState) => !prevState)}
                isFilterVisible={toggleFilter}
                tableViewOnChange={(number: number) => setViewType(number)}
                viewType={viewType}
                handleRefreshButtonClick={handleRefreshData}
              />
            }
          />
          <ModalContent>
            <div
              className={`transition-all duration-300 ease-in-out ${
                toggleFilter
                  ? 'opacity-100 translate-y-0/ max-h-[1000px]/'
                  : 'opacity-0 max-h-0 overflow-hidden'
              }`}
            >
              <CustomerListFilter
                updateFilter={updateFilter}
                filters={filters}
                clearFilters={clearFilters}
                visibleFiltersOptions={{
                  leadSource: true,
                  leadType: true,
                  status: true,
                  asignedToManagerId: true,
                  asignedToBdcId: true,
                  interestedVehicle: false,
                }}
                setLoading={setLoading}
                filtersToApply={advancedFilters}
                disabledOptions={['Tomorrow', 'Upcoming']}
              />
            </div>
            <div className={'mt-5 flex justify-between'}>
              <div className="flex gap-3">
                <Can requiredPermission={[57, 58, 59, 60, 61, 62, 63]}>
                  <button
                    className="bg-[#00A78B] py-2 px-4 rounded-[20px] font-normal text-sm text-white flex items-center 
              justify-center gap-2 hover:scale-105 transition-all"
                    onClick={() => setShowMultiSelect(!showMultiSelect)}
                  >
                    {showMultiSelect ? <MultiSelectIcon /> : <NoMultiSelectIcon />}
                    Show Multi-Select{' '}
                    {`${showMultiSelect ? `(${selectedCustomersIds.length})` : ''}`}
                  </button>
                  {showMultiSelect && <BulkActions />}
                </Can>
                <div className="self-center ml-4">
                  <CheckboxInput
                    chekcboxText="Open detail in new tab"
                    name="openInNewTab"
                    onChange={(e) => toggleOpenInNewTab(e.target.checked)}
                    checked={openInNewTab}
                  />
                </div>
              </div>
              <div className="relative flex items-center gap-2">
                <AdvancedFiltersPanel onApplyFilters={onApplyFilters} />
                <SortButtons
                  requestSort={requestSort}
                  setSortConfig={setSortConfig}
                  sortOptions={sortOptions}
                  sortConfig={sortConfig}
                />
              </div>
            </div>
            <ButtonContainer marginTop={1} block widthFull heightFull>
              <div className={`${!hasClientsData && !loading ? 'hidden' : ''}`}>
                <ColoredTableV2
                  data={filteredClients}
                  columns={columns}
                  columnVisibility={columnVisibility}
                  setColumnVisibility={setColumnVisibility}
                  columnOrder={columnOrder}
                  setColumnOrder={setColumnOrder}
                  loading={loading}
                  paginationIsActive
                  textColor="#FFF"
                  // width={tableWidth}
                  height={toggleFilter ? 55 : 65}
                  printButtonIsActive
                  customPrint={() => setShowPdfContainer(true)}
                  rowSelectionIsActive={showMultiSelect}
                  onSelectionChange={(selectedRows) =>
                    setSelectedCustomersIds(selectedRows.map((row) => row.id))
                  }
                />
              </div>
              <div
                className={`${
                  !hasClientsData && !loading ? 'flex' : 'hidden'
                } justify-center items-center h-[50vh]`}
              >
                <h6 className="font-semibold text-gray-400 text-2xl">Data not found</h6>
              </div>
            </ButtonContainer>
            {/* <ButtonContainer marginTop={0} widthFull justify="right">
              <div className="flex gap-2 w-ful items-center pt-4 h-full">
                <Button
                  backgroundColor="#FFF"
                  buttonText="Import"
                  textColor="#00A78B"
                  identity="import"
                  border={0.104167}
                  borderColor="#00A78B"
                  onClick={handleButton}
                />
                <Button
                  backgroundColor="#FFF"
                  buttonText="Print"
                  textColor="#00A78B"
                  identity="import"
                  border={0.104167}
                  borderColor="#00A78B"
                  onClick={() => setShowPdfContainer(true)}
                />
              </div>
            </ButtonContainer> */}
          </ModalContent>
        </ModalContainer>
      </ModalWindow>
      <AnimatePresence>
        {showPdfContainer && (
          <div className="block">
            <PdfContainerForCustomer
              pagination={pagination}
              handleCloseWindow={() => setShowPdfContainer(false)}
              dataTable={filteredClients}
              visibleColumns={visibleColumns}
            />
          </div>
        )}
      </AnimatePresence>                                                                      

      <AnimatePresence>{showSaveAsModal && <SaveReportAsModal />}</AnimatePresence>
      <AnimatePresence>
        {showNewCustomerReportModal && <AddNewCustomerReportModal />}
      </AnimatePresence>
      <AnimatePresence>{showPermissionsModal && <PermisionModal />}</AnimatePresence>

      <AnimatePresence>
        {showSendReportModal && (
          <SendReportModal
            customers={filteredClients}
            visibleColumnIds={visibleColumns}
            reportName={currentCustomerReport?.name || ''}
          />
        )}
      </AnimatePresence>
      <BulkActionsModals />
    </>
  );
}
