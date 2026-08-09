import {
  adminDashboardStore,
  currentSectionStore,
  modalWindowStore,
  numberFormatterStore,
} from '@/store/adminDashboard';
import { useEffect, useMemo, useState } from 'react';
import { Clients, ClientType, SpecificClient } from '@/app/libs/definitions';
import { Button } from '&/buttons/Button';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { importStore } from '@/store/importExportData';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
// import { ColoredTable } from '&/table/coloredTable/ColoredTable';
import { CheckboxInput } from '&/inputs/CheckboxInput';
import { ColumnDef, ColumnOrderState, VisibilityState } from '@tanstack/react-table';
import { AnimatePresence, motion } from 'framer-motion';
// import { PdfContainerForCustomer } from '&/miscellaneous/pdf/pdfContainer/PdfContainer.v2';
import { MultiSelectIcon, NoMultiSelectIcon } from '&/icons/Icons';
// import { SaveReportAsModal } from './ReportButtons/SaveAsModal';
import { customerListStore } from '@/store/customerList/customerList.store';
import { ListViewTypes } from '@/store/customerList/types';
// import AddNewCustomerReportModal from './NewOneCustomerReport/AddReportModal';
// import { SendReportModal } from './ReportButtons/SendEmailReport/SendReportEmail';
// import PermisionModal from './ReportButtons/Permision/Permision';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { Can } from '@/app/ui/auth/Can';
import { generateDataTable } from '../../../clientSystem/customerList/generateTables';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { CustomerName } from '@/app/ui/miscellaneous/customerName/CustomerName';
import { UserAssignedName } from '@/app/ui/miscellaneous/userAssignedName/UserAssignedName';
import { DateFormats } from '@/app/ui/miscellaneous/dateFormats/DateFormats';
import { VehicleFormat } from '@/app/ui/miscellaneous/vehicleFormat/VehicleFormat';
import { CustomerContactFormat } from '@/app/ui/miscellaneous/customerContactFormat/CustomerContactFormat';
import { formatVehicle } from '../../../clientSystem/customerLists/utils/utils';
import { storeReportsStore } from '@/store/reports';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';

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

interface props {
  close: () => void;
  user: {
    id: number;
    name: string;
    excludeClientStatus?: number[];
  };
  excludeClientStatus?: number[];
}

export function CustomerListByUser({ close , user, excludeClientStatus  }: props) {
  // ---- global states ----

  const createdDate = reportsFiltersStore((store) => store.createDate);
  const dateToExternalFilter = transformDateToQuery(createdDate);
  
  const { openInNewTab } = modalWindowStore();

  const { numberFormatter } = numberFormatterStore();

  // ---- local states ----
  const [loading, setLoading] = useState<boolean>(true);
  const [clients, setClients] = useState<Clients>([]);
  const [toggleFilter, setToggleFilter] = useState(true);
  const [showMultiSelect, setShowMultiSelect] = useState(false);

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
    const dateQuery = dateToExternalFilter ? buildDateQueryString(dateToExternalFilter) : undefined;
    const excludeClientStatusString = excludeClientStatus?.join(',') || null;
    try {
      setLoading(true);
      const response = await fetch(`/api/adminDashboard/clients/by-filters?userId=${user.id}${excludeClientStatusString ? `&excludeClientStatus=${excludeClientStatusString}` : '' }${dateQuery && !excludeClientStatus ? `&${dateQuery}` : ''}`, {
        method: 'POST',
        body: JSON.stringify({ filters: filtersToApply }),
      });
      const clients = await response.json();
      setClients(clients);
      setLoading(false);
      return clients;
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!currentCustomerReport) return;
  //   fetchClientsFromAPI(advancedFilters);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [refreshCustomersList]);

  useEffect(() => {
    fetchClientsFromAPI([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApplyFilters = (filters: AppliedFilter[]) => {
    fetchClientsFromAPI(filters);
  };

  const handleRefreshData = () => {
    setLoading(true);
    fetchClientsFromAPI([]);
  };
  const viewType = ListViewTypes.ListView;
  // ---- Computed values ----
  const hasClientsData = clients && clients.length > 0;
  const tableData = useMemo(() => {
    return hasClientsData ? generateDataTable(clients as ClientType[], viewType) : [];
  }, [clients, hasClientsData]);

  //visible columns for Pdf
  // const visibleColumns = useMemo(() => {
  //   if (!columnsConfig || columnsConfig.length === 0) return [];
  //   let visibleCols = columnsConfig.filter((col) => col.checked);
  //   if (viewType === ListViewTypes.ListView) {
  //     visibleCols = visibleCols.filter((col) => col.id !== 'date' && col.id !== 'lead_info');
  //   }
  //   return visibleCols.map((col) => col.id);
  // }, [viewType, columnsConfig, refreshCustomersList]);

  const columnRenderers: { [key in keyof typeof totalsColumnsInit]?: (el: SpecificClient) => any } = {
    customer_name: el => (
      <CustomerName customer={`${el.first_name} ${el.last_name}`} customerId={el.id} mxAuto={false} />
    ),
    assigned_to: el => (
      <div className="w-[40rem]/ text-left truncate">
        <div className="flex items-center w-full gap-1 truncate">
          <span className="font-semibold truncate">Sales Rep:</span>
          <UserAssignedName userName={el.seller?.name || 'N/A'} userLastname={el.seller?.last_name || ''} />
        </div>
        <div className="flex items-center w-full gap-1">
          <span className="font-semibold">BDC Rep:</span>
          <UserAssignedName userName={el.bdc?.name || 'N/A'} userLastname={el.bdc?.last_name || ''} />
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
    phone_number: el => <CustomerContactFormat contact={el.mobile_phone} noIcon />,
    credit_app: el => (el.credit_app_list_status_id ? 'Yes' : 'No'),
    source: el => el.lead_source?.source || '',
    city: el => el.client_address?.city || '',
    state: el => el.client_address?.state?.state || '',
    status: el => (
      <div className="flex items-center min-w-[7rem] w-full ">
        <div className="flex items-center justify-center rounded-[1.5rem] min-w-[4.5rem] w-full max-w-[8rem] py-[6px] px-[12px] bg-[#C9EBE6] text-[#00A78B] font-bold text-[0.9rem] font-sans capitalize">
          {el.client_status?.status}
        </div>
      </div>
    ),
    created_date: el => <DateFormats date={el.created_at} format={2} />,
    created_by: el => <UserAssignedName userName={'User'} userLastname={'Admin'} />,
    interested_vehicle: el => <VehicleFormat interestedVehicle={el.interested_vehicle} mxAuto={false} />,
  };

  const { columns } = useDynamicTableColumns<SpecificClient, typeof totalsColumnsInit>({
    initialColumnsDef: totalsColumnsInit,
    excludeKeys: ['id'],
    columnStyles: {
      customer_name: { size: viewType === ListViewTypes.ListView ? 185 : 500 },
      assigned_to: { size: 240 },
      phone_number: { size: 170 },
      credit_app: { size: 150 },
      source: { size: 120 },
      city: { size: 140 },
      state: { size: 140 },
      status: { size: 135 },
      created_date: { size: 160 },
      created_by: { size: 140 },
      interested_vehicle: { size: viewType === ListViewTypes.ListView ? 225 : 350 },
    },
    columnRenderers,
    accessorFnMapper: {
      customer_name: el => `${el.first_name || ''} ${el.last_name || ''}`,
      assigned_to: el => {
        if (el.seller && el.seller.id === user.id) return `${el.seller.name || ''} ${el.seller.last_name || ''}`;
        if (el.bdc && el.bdc.id === user.id) `${el.bdc?.name || ''} ${el.bdc?.last_name || ''}`;
        if (el.sales_manager && el.sales_manager.id === user.id)
          `${el.sales_manager?.name || ''} ${el.sales_manager?.last_name || ''}`;
      },
      phone_number: el => el.mobile_phone,
      credit_app: el => (el.credit_app_list_status_id ? 'Yes' : 'No'),
      source: el => el.lead_source?.source || '',
      city: el => el.client_address?.city || '',
      state: el => el.client_address?.state?.state || '',
      status: el => el.client_status?.status || '',
      created_date: el => el.created_at || '',
      created_by: el => '',
      interested_vehicle: el => (el.interested_vehicle ? formatVehicle(el.interested_vehicle) : ''),
    },
    filterableColumns: [
      'customer_name',
      'assigned_to',
      'phone_number',
      'credit_app',
      'source',
      'city',
      'state',
      'status',
      'created_date',
      'created_by',
      'interested_vehicle',
    ],
    columnDataTypes: {
      created_date: 'date',
    }
  });

  return (
    <>
      <ModalWindow top={-17}>
        <ModalContainer width={95.583333} marginTop={6}>
          <ModalContainerTitle
            title={`Customers Assigned to ${user.name}`}
            closeWindowFunction={close}
            // extraTitleComponent={
            //   <ExtraTitleButtons
            //     filterToggle={() => setToggleFilter((prevState) => !prevState)}
            //     isFilterVisible={toggleFilter}
            //     tableViewOnChange={(number: number) => setViewType(number)}
            //     viewType={viewType}
            //     handleRefreshButtonClick={handleRefreshData}
            //   />
            // }
          />
          <ModalContent>
            {/* <div
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
              />
            </div> */}
            {/* <div className={'mt-5 flex justify-between'}>
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
            </div> */}
            <ButtonContainer marginTop={1} block widthFull heightFull>
              <div className={`${!hasClientsData && !loading ? 'hidden' : ''}`}>
                <ColoredTableV2
                  data={clients || []}
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
                  // printButtonIsActive
                  customPrint={() => setShowPdfContainer(true)}
                  rowSelectionIsActive={showMultiSelect}
                  // onSelectionChange={(selectedRows) =>
                  //   setSelectedCustomersIds(selectedRows.map((row) => row.id))
                  // }
                />
              </div>
              <div
                className={`${!hasClientsData && !loading ? 'flex' : 'hidden'} justify-center items-center h-[50vh]`}
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
      {/* <AnimatePresence>
        <div className={`${showPdfContainer ? 'block' : 'hidden'}`}>
          <PdfContainerForCustomer
            pagination={pagination}
            handleCloseWindow={() => setShowPdfContainer(false)}
            dataTable={filteredClients}
            visibleColumns={visibleColumns}
          />
        </div>
      </AnimatePresence> */}

      {/* <AnimatePresence>{showSaveAsModal && <SaveReportAsModal />}</AnimatePresence>
      <AnimatePresence>
        {showNewCustomerReportModal && <AddNewCustomerReportModal />}
      </AnimatePresence>
      <AnimatePresence>{showPermissionsModal && <PermisionModal />}</AnimatePresence> */}

      <AnimatePresence>
        {/* {showSendReportModal && (
          <SendReportModal
            customers={filteredClients}
            visibleColumnIds={visibleColumns}
            reportName={currentCustomerReport?.name || ''}
          />
        )} */}
      </AnimatePresence>
      {/* <BulkActionsModals /> */}
    </>
  );
}
