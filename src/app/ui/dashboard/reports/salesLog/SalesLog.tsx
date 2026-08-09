import { useCallback, useEffect, useState, useRef } from 'react';
import { ClientType, CloseWindow, SpecificClients } from '@/app/libs/definitions';
import { AnimatePresence } from 'framer-motion';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { SalesLogEspecialTable } from '&/table/salesLogEspecialTable/SalesLogEspecialTable';
import { MonthNavigator } from '&/miscellaneous/monthNavigator/MonthNavigator';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { DownloadIcon, GreenPrinterIcon, PlusIcon, SalesLogStatisticsIcon } from '&/icons/Icons';
import { DownloadWindow } from '&/dashboard/reports/salesLog/downloadWindow/DownloadWindow';
import { SalesLogStatistics } from '&/dashboard/reports/salesLog/salesLogStatistics/SalesLogStatistics';
import { AddChargeBack } from '&/dashboard/reports/salesLog/addChargeBack/AddChargeBack';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { dateFormatsStore } from '@/store/dateFormats';
import { DateFormats } from '@/app/ui/miscellaneous/dateFormats/DateFormats';
import { CustomerName } from '@/app/ui/miscellaneous/customerName/CustomerName';
import { daysOld, formatVehicle } from '../../clientSystem/customerLists/utils/utils';
import { VehicleFormat } from '@/app/ui/miscellaneous/vehicleFormat/VehicleFormat';
import { currencyFormat } from '../utils';
import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { editVehicleStore, userActionStore } from '@/store/inventory';
import { modalWindowStore } from '@/store/adminDashboard';
import { useCalendarStore } from '@/store/monthNavigation';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';
import { PendingToFound } from '../../clientSystem/customerLists/pendingToFound/PendingToFound';
import { endOfMonth, isWithinInterval, startOfMonth } from 'date-fns';
import { SplitSellersInfo } from '@/app/ui/miscellaneous/splitSellersInfo/SplitSellersInfo';

interface SalesLogData {
  id: number;
  customer: ClientType & {
    ad_id: any;
    lead_source: any;
    funding_list_status_id: number | null;
    funding_list_status: {
      id: number;
      status: string;
    } | null;
  };
  lead: {
    id: number;
    customer_funding_list_status_id: number | null;
    customer_funding_returned_at: Date | null;
    sold_created_at: Date | null;
    isSplitSold?: boolean;
    sellersInSplitDeal?: {
      id: number;
      name: string | null;
      last_name: string | null;
    }[];
  },
  customer_id: number;
  created_at: Date;
  seller_id: number | null;
  downpayment: string;
  paid: string;
  bonus: string;
  moneyDuePaid: string;
  frontend: string;
  backend: string;
  totalProfit: string;
  deferredDownpayment: string;
  bank: {
    id: number;
    bank: string;
  };
  sellerCommission: string;
  bdcCommission: string;
}

const getMonthDateRange = ({ monthIndex, year }: { monthIndex: number; year: number }) => {
  const date = new Date(year, monthIndex, 1);

  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);

  return { startDate, endDate };
};


export function SalesLog({ closeWindow }: CloseWindow) {
  // ----- global states -----
  const { dateFormatted } = dateFormatsStore();
  const { setAddNewVehicle } = userActionStore();
  const { openInventorySystem, openInNewTab } = modalWindowStore();
  const { getVehicleData } = editVehicleStore();

  const openClosePendingToFund  = modalWindowStore((state) => state.openClosePendingToFund);
  const pendingToFund = modalWindowStore((state) => state.pendingToFund);

  // const { setDealId, dealIdSelected, resetDealData, dealData } = dealStore();
  
  const { currentMonth, currentYear, resetMonthFilter, setFetchingData } = useCalendarStore();

  const monthRef = useRef(currentMonth);
  monthRef.current = currentMonth;
  const yearRef = useRef(currentYear);
  yearRef.current = currentYear;
  
  // ----- local state -----

  const [openDownloadWindow, setOpenDownloadWindow] = useState<boolean>(false);
  const [openSalesLogStatisticsWindow, setOpenSalesLogStatisticsWindow] = useState<boolean>(false);
  const [openAddChargeBackWindow, setOpenAddChargeBackWindow] = useState<boolean>(false);
  const [pendingModalWindowData, setPendingModalWindowData] = useState<ClientType | null>();


  // table data
  const [salesLogData, setSalesLogData] = useState<SalesLogData[]>([]);
  const [totalData, setTotalData] = useState<{
    totalCharges: string;
    totalNet: number;
    returnedCurrentMonth: number;
    returnedLastMonth: number;
    monthUnitsSold: number;
    totalUnitsSold: number;
  }>({
    totalCharges: '0',
    totalNet: 0,
    returnedCurrentMonth: 0,
    returnedLastMonth: 0,
    monthUnitsSold: 0,
    totalUnitsSold: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const initialColumnsDef = {
    date: true,
    customer_name: true,
    vehicle: true,
    car_age: true,
    sales_assigned: true,
    sales_manager: true,
    finance_manager: true,
    front_end: true,
    back_end: true,
    total_profit: true,
    ad_id: true,
    lender: true,
    source: true,
    funding_status: true,
  };

  const handleOpenVehicleWindow = (id?: number | null) => {
    if (id) {
      //&& can(25)
      if (openInNewTab) {
        window.open(`/dashboard/inventory-${id}`);

        return;
      }

      setAddNewVehicle(false);
      openInventorySystem();
      getVehicleData(id.toString());
    }
  };

  const handleOpenPendingWindow = (customerId?: number, customer: ClientType | null = null) => {
    if (!customerId) return;

    setPendingModalWindowData(customer);

    openClosePendingToFund();
  };


  const columsRenderers: { [key in keyof typeof initialColumnsDef]?: (el: SalesLogData) => any } = {
    date: el => el.lead.sold_created_at ?  <DateFormats date={el.lead.sold_created_at} format={2} /> : '',
    sales_assigned: el => <SplitSellersInfo client={{ seller: el.customer.seller, lead: el.lead }} />,
    customer_name: el => (
      <CustomerName customer={`${el.customer.first_name} ${el.customer.last_name}`} customerId={el.customer_id} />
    ),
    vehicle: el =>
      el.customer.interested_vehicle ? (
          <VehicleFormat
            interestedVehicle={el.customer.interested_vehicle}
            mxAuto={false}
            clientIsSold={true}
            customerId={el.customer_id}
            enableSelector={true}
            onVehicleChange={() => {
              triggerRefetch();
            }}
          />
      ) : (
        ''
      ), // formatVehicle(el.customer.interested_vehicle) : '',
    car_age: el =>
      el.customer.interested_vehicle?.entry_stock ? daysOld(el.customer.interested_vehicle.entry_stock) : '',
    funding_status: el => {
      const fundingStatusId = el.customer?.funding_list_status_id || null;
      if (!fundingStatusId) return '';

      if (fundingStatusId === FundingStatuses.InProcess) {
        return (
          <button
            className="bg-[#C9EBE6] rounded-[1.041666vw] shadow-crmFormShadow text-[#41B4A0] px-[1.2vw] py-[0.7vh]
            hover:scale-105"
            onClick={() => handleOpenPendingWindow(el.customer?.id, el.customer)}
          >
            Pending
          </button>
        );
      }

      return el.customer.funding_list_status?.status
    }
  };

  const getMonth = () => {
    return { month: currentMonth, year: currentYear };
  }

  const { columns: colomnsToSalesLog } = useDynamicTableColumns<SalesLogData, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers: columsRenderers,
    accessorFnMapper: {
      date: el => el.lead.sold_created_at ?  el.lead.sold_created_at  : '',
      customer_name: el => `${el.customer.first_name} ${el.customer.last_name}`,
      vehicle: el => (el.customer.interested_vehicle ? formatVehicle(el.customer.interested_vehicle) : ''),
      car_age: el =>
        el.customer.interested_vehicle?.entry_stock ? daysOld(el.customer.interested_vehicle.entry_stock) : '',
      sales_assigned: el => (el.customer.seller ? `${el.customer.seller.name} ${el.customer.seller.last_name}` : ''),
      sales_manager: el =>
        el.customer.sales_manager ? `${el.customer.sales_manager.name} ${el.customer.sales_manager.last_name}` : '',
      finance_manager: el =>
        el.customer.finance_manager
          ? `${el.customer.finance_manager.name} ${el.customer.finance_manager.last_name}`
          : '',
      front_end: el => {
        const dateRange = getMonthDateRange({ monthIndex: currentMonth, year: currentYear });
        const isReturned = el.lead.customer_funding_list_status_id === FundingStatuses.Returned;
        const fundingReturnedAt = el.lead.customer_funding_returned_at;
        const dealCreatedAt = el.created_at;
        const isDealCreatedAtCurrentMonth = isWithinInterval(dealCreatedAt, {
          start: dateRange.startDate,
          end: dateRange.endDate,
        });
        const isDealReturnedAtCurrentMonth =
          isReturned &&
          fundingReturnedAt &&
          isWithinInterval(fundingReturnedAt, {
            start: dateRange.startDate,
            end: dateRange.endDate,
          });

        if (isDealCreatedAtCurrentMonth && isDealReturnedAtCurrentMonth) return 0;
        if (!isDealCreatedAtCurrentMonth && isDealReturnedAtCurrentMonth) return -el.frontend;
        return el.frontend;
      },
      back_end: el => {
        const dateRange = getMonthDateRange({ monthIndex: currentMonth, year: currentYear });
        const isReturned = el.lead.customer_funding_list_status_id === FundingStatuses.Returned;
        const fundingReturnedAt = el.lead.customer_funding_returned_at;
        const dealCreatedAt = el.created_at;
        const isDealCreatedAtCurrentMonth = isWithinInterval(dealCreatedAt, {
          start: dateRange.startDate,
          end: dateRange.endDate,
        });
        const isDealReturnedAtCurrentMonth =
          isReturned &&
          fundingReturnedAt &&
          isWithinInterval(fundingReturnedAt, {
            start: dateRange.startDate,
            end: dateRange.endDate,
          });

        if (isDealCreatedAtCurrentMonth && isDealReturnedAtCurrentMonth) return 0;
        if (!isDealCreatedAtCurrentMonth && isDealReturnedAtCurrentMonth) return -el.backend;
        return el.backend;
      },
      total_profit: el => {
        const dateRange = getMonthDateRange({ monthIndex: currentMonth, year: currentYear });
        const isReturned = el.lead.customer_funding_list_status_id === FundingStatuses.Returned;
        const fundingReturnedAt = el.lead.customer_funding_returned_at;
        const dealCreatedAt = el.created_at;
        const isDealCreatedAtCurrentMonth = isWithinInterval(dealCreatedAt, {
          start: dateRange.startDate,
          end: dateRange.endDate,
        });
        const isDealReturnedAtCurrentMonth =
          isReturned &&
          fundingReturnedAt &&
          isWithinInterval(fundingReturnedAt, {
            start: dateRange.startDate,
            end: dateRange.endDate,
          });

        if (isDealCreatedAtCurrentMonth && isDealReturnedAtCurrentMonth) return 0;
        if (!isDealCreatedAtCurrentMonth && isDealReturnedAtCurrentMonth) return -el.totalProfit;
        return el.totalProfit;
      },
      ad_id: el => el.customer.ad_id,
      lender: el => (el.bank ? el.bank.bank : ''),
      source: el => (el.customer.lead_source ? el.customer.lead_source.source : ''),
      funding_status: el => (el.customer.funding_list_status ? el.customer.funding_list_status.status : ''),
    },
    dynamicRenderVariable: currentMonth,
  });

  // sales log especial table content data
  const [especialTableData1, setEspecialTableData1] = useState<
    [
      {
        key: number;
        totalFrontend: string;
        perUnitFrontend: string;
      },
      {
        key: number;
        totalBackend: string;
        perUnitBackend: string;
      },
      {
        key: number;
        totalTotalGross: string;
        perUnitTotalGross: string;
      },
    ]
  >([
    {
      key: 1,
      totalFrontend: '0',
      perUnitFrontend: '0',
    },
    {
      key: 2,
      totalBackend: '0',
      perUnitBackend: '0',
    },
    {
      key: 3,
      totalTotalGross: '0',
      perUnitTotalGross: '0',
    },
  ]);

  const [especialTableData2, setEspecialTableData2] = useState<
    [
      { key: number; chargeback: string },
      { key: number; totalNet: number },
      { key: number; returnedLastMonth: number },
      { key: number; totalUnitsSold: number },
    ]
  >([
    {
      key: 1,
      chargeback: '0',
    },
    {
      key: 2,
      totalNet: 0,
    },
    {
      key: 3,
      returnedLastMonth: 0,
    },
    {
      key: 4,
      totalUnitsSold: 0,
    },
  ]);

  const fetchSaleLogData = useCallback(async (filter: object | null) => {
    const urlParams = getMonthDateRangeParams(monthRef.current, yearRef.current);
    try {
      setLoading(true);
      setFetchingData(true);
      const response = await fetch(`/api/reports/salesLog?${urlParams || ''}`);
      const data = (await response.json()) as {
        deals: SalesLogData[];
        totalCharges: string;
        totalFront: number;
        totalBack: number;
        totalGross: number;
        totalNet: number;
        returnedCurrentMonth: number;
        returnedLastMonth: number;
        monthUnitSold: number;
        totalUnitsSold: number;
      };
      setSalesLogData(data.deals);
      setTotalData({
        totalCharges: data.totalCharges,
        totalNet: data.totalNet,
        returnedCurrentMonth: data.returnedCurrentMonth,
        returnedLastMonth: data.returnedLastMonth,
        monthUnitsSold: data.monthUnitSold,
        totalUnitsSold: data.totalUnitsSold,
      });
      const totalUnitSoldForPromedio = data.totalUnitsSold === 0 ? 1 : data.totalUnitsSold;
      setEspecialTableData1([
        {
          key: 1,
          totalFrontend: currencyFormat.format(data.totalFront),
          perUnitFrontend: currencyFormat.format((data.totalFront / totalUnitSoldForPromedio) || 0),
        },
        {
          key: 2,
          totalBackend: currencyFormat.format(data.totalBack),
          perUnitBackend: currencyFormat.format((data.totalBack / totalUnitSoldForPromedio) || 0),
        },
        {
          key: 3,
          totalTotalGross: currencyFormat.format(data.totalGross),
          perUnitTotalGross: currencyFormat.format((data.totalGross / totalUnitSoldForPromedio) || 0),
        },
      ]);
      setLoading(false);
      setFetchingData(false);
    } catch (error) {
      setLoading(false);
      setFetchingData(false);
      console.error('Error fetching activity counts:', error);
    }
  }, []);

  const triggerRefetch = useCallback(() => {
    fetchSaleLogData(null);
  }, [fetchSaleLogData]);

  useEffect(() => {
    const dateToExternalFilter = null; //transformDateToQuery(createDate);
    // if (dateToExternalFilter) {
    //   // between
    //   if (dateToExternalFilter.optionDate === '13' && (!dateToExternalFilter.fromDate || !dateToExternalFilter.toDate))
    //     return;
    //   // previous / upcoming / last x days / last x months
    //   const options = ['4', '5', '10', '11'];
    //   if (
    //     options.includes(dateToExternalFilter.optionDate || '0') &&
    //     (!dateToExternalFilter.valueDate || dateToExternalFilter.valueDate === '0')
    //   )
    //     return;
    // }
    fetchSaleLogData(dateToExternalFilter);
  }, [currentYear, currentMonth]);

  // handling buttons
  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'download') {
      setOpenDownloadWindow(true);
    }

    if (identity === 'salesLogStatistics') {
      setOpenSalesLogStatisticsWindow(true);
    }

    if (identity === 'addChargeBack') {
      setOpenAddChargeBackWindow(true);
    }
  };

  // handle close current window
  const handleCloseWindow = () => {
    closeWindow(false);
    resetMonthFilter();
  };

  // buttons info
  const buttonsInfo = [
    {
      key: 1,
      backgroundColor: '#FFF',
      height: 5.462963,
      identity: 'addChargeBack',
      textColor: '#00A78B',
      width: 12.083333,
      border: 0.104167,
      borderColor: '#00A78B',
      buttonText: 'Add Charge Back',
      buttonTextSize: 1.9,
      iconTextGap: 0.729167,
      buttonIcon: <PlusIcon />,
      onClick: handleButton,
    },
    {
      key: 2,
      backgroundColor: '#FFF',
      height: 5.462963,
      identity: 'salesLogStatistics',
      textColor: '#00A78B',
      width: 12.65625,
      border: 0.104167,
      borderColor: '#00A78B',
      buttonText: 'Sales Log statistics',
      buttonTextSize: 1.9,
      iconTextGap: 0.729167,
      buttonIcon: <SalesLogStatisticsIcon />,
      onClick: handleButton,
    },
    {
      key: 4,
      backgroundColor: '#FFF',
      height: 5.462963,
      identity: 'download',
      textColor: '#00A78B',
      width: 8.125,
      border: 0.104167,
      borderColor: '#00A78B',
      buttonText: 'Download',
      buttonTextSize: 1.9,
      iconTextGap: 0.729167,
      buttonIcon: <DownloadIcon />,
      onClick: handleButton,
    },
  ];

  const totalDataTable: [
    { key: number; chargeback: string },
    { key: number; totalNet: string },
    { key: number; returnedLastMonth: number },
    { key: number; returnedCurrentMonth: number },
    { key: number; monthUnitsSold: number },
    { key: number; totalUnitsSold: number },
  ] = [
    {
      key: 1,
      chargeback: currencyFormat.format(Number(totalData.totalCharges || 0)),
    },
    {
      key: 2,
      totalNet: currencyFormat.format(totalData.totalNet || 0),
    },
    {
      key: 3,
      returnedLastMonth: totalData.returnedLastMonth || 0,
    },
    {
      key: 4,
      returnedCurrentMonth: totalData.returnedCurrentMonth || 0,
    },
    {
      key: 5,
      monthUnitsSold: totalData.monthUnitsSold || 0,
    },
    {
      key: 6,
      totalUnitsSold: totalData.totalUnitsSold || 0,
    },
  ];

  return (
    <ModalWindow top={0}>
      <ModalContainer marginTop={4.259259} width={96.458333}>
        <ModalContainerTitle
          title="Sales Log"
          closeWindowFunction={handleCloseWindow}
          extraComponent={<MonthNavigator />}
        />
        <ModalContent>
          {/* <ColoredTable
            tableData={tableData}
            height={55.833333}
            textColor="#FFF"
            paginationTable
            itemsPerPage={7}
            printButton
          /> */}
          <ColoredTableV2
            data={salesLogData}
            loading={loading}
            columns={colomnsToSalesLog}
            initialColumnsDef={initialColumnsDef}
            textColor="#FFF"
            height={55.833333}
            rowSelectionIsActive={false}
            printButtonIsActive
            rowHighlightCondition={(originalRow: SalesLogData) => {
              return originalRow.customer?.funding_list_status_id === FundingStatuses.Returned;
            }}
            highlightColor="rgba(185, 67, 67, 1)"
          />
          <SalesLogEspecialTable
            marginTop={2.592593}
            height={22.1296296}
            width={30.364583}
            textColor="#FFF"
            tableData1={especialTableData1}
            tableData2={totalDataTable}
            headTextCenter
            headBackgroundColor="#43B9A5"
            bodyFirstColor="#00A78B"
            bodySecondColor="#43B9A5"
          />
          <ButtonContainer marginTop={6.388889} gap={1.302083} widthFull justify="right">
            {buttonsInfo.map(el => (
              <Button
                key={el.key}
                backgroundColor={el.backgroundColor}
                height={el.height}
                identity={el.identity}
                textColor={el.textColor}
                width={el.width}
                border={el.border}
                borderColor={el.borderColor}
                buttonText={el.buttonText}
                buttonTextSize={el.buttonTextSize}
                buttonIcon={el.buttonIcon}
                iconTextGap={el.iconTextGap}
                onClick={el.onClick}
              />
            ))}
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
      <AnimatePresence>
        {openDownloadWindow && <DownloadWindow closeWindow={setOpenDownloadWindow} />}
        {openSalesLogStatisticsWindow && <SalesLogStatistics closeWindow={setOpenSalesLogStatisticsWindow} />}
        {openAddChargeBackWindow && <AddChargeBack closeWindow={setOpenAddChargeBackWindow} />}
        {pendingToFund && pendingModalWindowData && <PendingToFound customerData={[pendingModalWindowData] as any} />}
      </AnimatePresence>
    </ModalWindow>
  );
}