import { useCallback, useEffect, useState, useRef } from 'react';
import { ClientType, CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { ReportsFilter } from '&/miscellaneous/reportsFilter/ReportsFilter';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { CustomerName } from '@/app/ui/miscellaneous/customerName/CustomerName';
import { CustomerContactFormat } from '@/app/ui/miscellaneous/customerContactFormat/CustomerContactFormat';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { useReportAndFilter } from '@/hooks/reportAndFiltrGenerator';
import { VehicleFormat } from '@/app/ui/miscellaneous/vehicleFormat/VehicleFormat';
import { daysOld, formatVehicle } from '../../../clientSystem/customerLists/utils/utils';
import { UserAssignedName } from '@/app/ui/miscellaneous/userAssignedName/UserAssignedName';
import { DateFormats } from '@/app/ui/miscellaneous/dateFormats/DateFormats';
import { AnimatePresence } from 'framer-motion';
import { Can } from '@/app/ui/auth/Can';
import { SetUpADeal } from './SetUpADeal';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { BetweenFilterConfig, dateOptions, DynamicFilterGroup, FilterConfig, IconedSelectConfig, InputFieldConfig } from '@/app/ui/miscellaneous/filterGroup/FilterGroup';
import { AdvancedFiltersPanel } from '@/app/ui/miscellaneous/advanceFilterPanel/AdvanceFilterPanel';
import { SortButtons } from '@/app/ui/miscellaneous/extraTitleButtonsReports/reportsButtons/addReportModal/advanceFilter/sortButton/SortButton';
import { FilterableField } from '@/store/customerList/types';
// import { PdfContainerForSold } from '@/app/ui/miscellaneous/pdf/pdfContainer/PdfContainer.v3';
import { FilterGroupV2 } from '@/app/ui/miscellaneous/filterGroup/FilterGroupV2';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';

export function SoldCustomer({ closeWindow }: CloseWindow) {
  // ----- global states -----
  const { clearFilters, applyFilter } = reportsFiltersStore();
  const soldDate = reportsFiltersStore((store) => store.soldDate);
  const soldDateRef = useRef(soldDate);
  soldDateRef.current = soldDate;

  const triggerRefetch = useCallback(() => {
    fetchData(transformDateToQuery(soldDateRef.current));
  }, []);

  // ----- local states -----

  // table data
  const [tableData, setTableData] = useState<any[]>([
    {
      id: '',
      customer: '',
      vehicle_sold: '',
      lead_info: '',
      date: '',
      deal_info: '',
    },
  ]);

  const [showFilter, setShowFilter] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [soldCustomerData, setSoldCustomerData] = useState<ClientType[]>([]);
  const [setUpDealShow, setSetUpDealShow] = useState(false);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const [showPdfContainer, setShowPdfContainer] = useState(false);

  const editDealOnclick = (el: ClientType, dealId: number) => {
    setSelectedDealId(dealId);
    setSetUpDealShow(true);
  };

  const initialColumnsDef = {
    customer: true,
    vehicle_sold: true,
    lead_info: true,
    date: true,
    deal_info: true,
  };

  const columsRenderers: { [key in keyof typeof initialColumnsDef]?: (el: ClientType) => any } = {
    customer: (el: ClientType) => (
      <div className="grid grid-cols-2/ gap-6/ min-w-[32rem]/ pl-4 h-full">
        <div className="flex flex-col gap-1">
          <div className="w-full flex items-start justify-start">
            <CustomerName customer={`${el.first_name} ${el.last_name}`} customerId={el.id} mxAuto={false} />
          </div>
          <div className="flex gap-1 items-center justify-center w-fit minw-32">
            <span className="font-semibold w-fit">Cell Phone:</span>
            <CustomerContactFormat contact={el.mobile_phone || undefined} noIcon marginInlineAuto />
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold flex-nowrap">Home Phone:</span>
            <CustomerContactFormat contact={el.home_phone || ''} noIcon marginInlineAuto />
          </div>
          <div className="flex gap-1 justify-center w-fit">
            <span className="font-semibold">Email:</span>
            <p className="max-w-40/ text-wrap/ break-words ">{`${el.email || ''}`}</p>
          </div>
        </div>
      </div>
    ),
    vehicle_sold: (el: ClientType) =>
      el.interested_vehicle?.id ? (
        <VehicleFormat
          interestedVehicle={el.interested_vehicle}
          mxAuto={false}
          clientIsSold={true}
          customerId={el.id}
          enableSelector={true}          
          onVehicleChange={(id, vehicle) => {
            triggerRefetch();
          }}
        />
      ) : (
        ''
      ),
    lead_info: (el: ClientType) => (
      <div className="grid grid-cols-2/ gap-6/ min-w-[28rem]/ max-w-[32rem]/ h-full">
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 justify-center w-fit">
            <span className="font-semibold">Sales Rep:</span>
            <UserAssignedName userName={el.seller?.name || ' '} userLastname={el.seller?.last_name || ''} />
          </div>
          <div className="flex gap-1 justify-center w-fit">
            <span className="font-semibold">BDC Rep:</span>
            <UserAssignedName userName={el.bdc?.name || ' '} userLastname={el.bdc?.last_name || ''} />
          </div>
          <div className="flex gap-1 justify-center w-fit">
            <span className="font-semibold">Manager:</span>
            <UserAssignedName
              userName={el.sales_manager?.name || ' '}
              userLastname={el.sales_manager?.last_name || ' '}
            />
          </div>
          <div className="flex gap-1 justify-center w-fit">
            <span className="font-semibold">Finance Rep:</span>
            <UserAssignedName
              userName={el.finance_manager?.name || ' '}
              userLastname={el.sales_manager?.last_name || ' '}
            />
          </div>
          <div className="flex gap-1 items-center justify-center w-fit">
            <span className="font-semibold">Source:</span>
            <p>{el.lead_source.source || ' '}</p>
          </div>
        </div>
      </div>
    ),
    date: (el: ClientType) => (
      <div className="flex flex-col gap-1 max-w-[16rem] h-full items-start">
        <div className="flex gap-1 items-center justify-center w-fit">
          <span className="font-semibold">Created</span>
          <DateFormats date={el.created_at} format={2} />
        </div>
        <div className="flex gap-1 items-center justify-center w-fit">
          <span className="font-semibold">Sales Assigned:</span>
          <div>{el.last_activity ? <DateFormats date={el.last_activity} format={2} /> : ''}</div>
        </div>
        <div className="flex gap-1 items-center justify-center w-fit">
          <span className="font-semibold">Sold:</span>
          <div>
            {el.client_status_changed_at ? (
              <DateFormats date={el.client_status_changed_at || undefined} format={2} />
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="flex gap-1 items-center justify-center w-fit">
          <span className="font-semibold">Delivered:</span>
          <div>
            {el.vehicle_delivery &&
            el.vehicle_delivery.length > 0 &&
            el.vehicle_delivery[el.vehicle_delivery.length - 1].start_date ? (
              <DateFormats
                date={el.vehicle_delivery[el.vehicle_delivery.length - 1].start_date || undefined}
                format={5}
              />
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="flex gap-1 items-center justify-center w-fit">
          <span className="font-semibold">Vehicle Days Old:</span>
          <div>
            {el.interested_vehicle && el.interested_vehicle.entry_stock
              ? daysOld(el.interested_vehicle.entry_stock)
              : ''}
          </div>
        </div>
      </div>
    ),

    deal_info: (el: ClientType) => {
      const dealInfo = el.deal.length > 0 ? el.deal[el.deal.length - 1] : null;
      const bank = dealInfo ? dealInfo.bank?.bank : ' ';
      const downPayment = dealInfo ? dealInfo.downpayment : '0';
      const paid = dealInfo ? dealInfo.paid : '';
      const deferredMoney = dealInfo ? dealInfo.deferredDownpayment[0] : '0';
      const frontend = dealInfo ? dealInfo.frontend : '0';
      const backend = dealInfo ? dealInfo.backend : '0';
      const totalProfit = dealInfo ? dealInfo.totalProfit : '0';
      const bonus = dealInfo ? dealInfo.bonus : '0';
      const totalDeferredDownpayment =
        parseFloat(downPayment.replaceAll(',', '')) -
        parseFloat(paid.replaceAll(',', '')) -
        parseFloat(bonus.replaceAll(',', ''));

      return (
        <div
          className="grid bg-red-100/ grid-cols-2 w-full gap-6 min-w-[28rem] max-w-[32rem]/ h-full hover:cursor-pointer"
          onClick={() => {
            if (dealInfo) editDealOnclick(el, dealInfo.id);
          }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Frontend:</span>
              <p>{frontend || ''}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Backend:</span>
              <p>{backend || ''}</p>
            </div>
            <div className="flex gap-1 justify-center w-fit">
              <span className="font-semibold">Total:</span>
              <p>{totalProfit || ''}</p>
            </div>
            <div className="flex gap-1 justify-center w-fit">
              <span className="font-semibold">Lender:</span>
              <p>{bank || ''}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 justify-center w-fit">
              <span className="font-semibold">Money Down:</span>
              <p>{paid || ''}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Deferred:</span>
              <p>{totalDeferredDownpayment || ''}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Bonus:</span>
              <p>{bonus || '0'}</p>
            </div>
            <div className="flex gap-1 items-center justify-center w-fit">
              <span className="font-semibold">Total down:</span>
              <p>{downPayment || '0'}</p>
            </div>
          </div>
        </div>
      );
    },
  };

  const { columns } = useDynamicTableColumns<ClientType, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: {
      deal_info: { size: 300 },
      vehicle_sold: { size: 120 },
      customer: { size: 200 },
    },
    columnRenderers: columsRenderers,
    accessorFnMapper: {
      customer: (el: ClientType) => `${el.first_name} ${el.last_name}`,
      vehicle_sold: (el: ClientType) => { el.interested_vehicle ? formatVehicle(el.interested_vehicle) : '' },
      lead_info: (el: ClientType) => '',
      date: (el: ClientType) => '',
      deal_info: (el: ClientType) => '',
    },
  });

  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
    clearFilters();
  };

  // handling buttons
  const handleButtons = (e: React.MouseEvent<HTMLButtonElement>) => {};

  // handling search input

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {};
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
    data: soldCustomerData,
    accessorMap: {
      customerName: 'name_lastname',
      soldDate: 'client_status_changed_at',
    },
  });
  
  // soldCustomerData[0].name_lastname
  
  const fetchData = useCallback(async (filter: object | null) => {
    setLoading(true);
    try {
      const queryString = buildDateQueryString(filter);
      const url = `/api/reports/storeReport/sold-customers?${queryString}`;
      const res = await fetch(url);
      const data = await res.json();
      setSoldCustomerData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    const dateToExternalFilter = transformDateToQuery(soldDate);
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
    fetchData(dateToExternalFilter);
  }, [soldDate]);

  const filterableFields: FilterableField[] = [
    { id: 'name_lastname', label: 'Rep', type: 'text' },
    // { id : '_count.frontend', label: 'Frontend', type: 'number' },
    // { id : '_count.backend', label: 'Backend', type: 'number' },
    // { id : '_count.total', label: 'Total', type: 'number' },
  ];

  const filteredData = applyFilter(soldCustomerData, { 
    customerFirstName: 'first_name',
    customerLastName: 'last_name',
    customerFullName: 'name_lastname',
    customerMobilePhone: 'mobile_phone',
    leadSource: 'lead_source.id',
  });

  return (
    <ModalWindow top={0}>
      <ModalContainer width={97.395833} marginTop={1.759259}>
        <ModalContainerTitle
          title="Sold Customer"
          closeWindowFunction={handleCloseWindow}
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={filterableFields}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={async () => {
                fetchData(transformDateToQuery(soldDate));
              }}
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
                      customerName: true,
                      soldDate: true,
                      leadSource: true,
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
            data={filteredData || []}
            loading={loading}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={12}
            paginationIsActive
            textColor="#FFF"
            // height={63.2}
            rowSelectionIsActive={false}
            printButtonIsActive
            customPrint={() => setShowPdfContainer(true)}
            height={!showFilter ? 75 : 63.2}
          />
          <AnimatePresence>
            {setUpDealShow && selectedDealId && (
              <Can requiredPermission={[73, 57]}>
                <SetUpADeal
                  dealId={selectedDealId}
                  closeModalFromParent={() => {
                    setSelectedDealId(null);
                    setSetUpDealShow(false);
                  }}
                />
              </Can>
            )}
          </AnimatePresence>
          {/* <AnimatePresence>
            <div className={`${showPdfContainer ? 'block' : 'hidden'}`}>
              <PdfContainerForSold
                // pagination={pagination}
                handleCloseWindow={() => setShowPdfContainer(false)}
                dataTable={filteredData}
                // visibleColumns={visibleColumns}
              />
            </div>
          </AnimatePresence> */}
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}