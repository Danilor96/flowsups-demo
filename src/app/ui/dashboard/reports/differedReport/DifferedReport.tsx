import { useEffect, useState } from 'react';
import { ClientType, CloseWindow } from '@/app/libs/definitions';
import { CheckboxInput } from '@/app/ui/inputs/CheckboxInput';
import { AnimatePresence } from 'framer-motion';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { MonthNavigator } from '&/miscellaneous/monthNavigator/MonthNavigator';
import { ColoredTable } from '&/table/coloredTable/ColoredTable';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { GreenPrinterIcon, StatisticsIcon } from '&/icons/Icons';
import { Button } from '&/buttons/Button';
import { Statistics } from '&/dashboard/reports/differedReport/statistics/Statistics';
import { AddReceiptModal } from './addReceipt/AddReceiptModal';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { VehicleFormat } from '@/app/ui/miscellaneous/vehicleFormat/VehicleFormat';
import { CustomerName } from '@/app/ui/miscellaneous/customerName/CustomerName';
import { daysOld, formatVehicle } from '../../clientSystem/customerLists/utils/utils';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { useCalendarStore } from '@/store/monthNavigation';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';
import { currencyFormat } from '../utils';
import { SetUpADeal } from '../../clientSystem/clientDetail/middleButtonsOptions/setUpADeal/SetUpADeal';
import { Can } from '@/app/ui/auth/Can';
import { SplitSellersInfo } from '@/app/ui/miscellaneous/splitSellersInfo/SplitSellersInfo';

interface DealsData {
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
    isSplitSold?: boolean;
    sellersInSplitDeal?: {
      id: number;
      name: string | null;
      last_name: string | null;
    }[];
  };
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

export function DifferedReport({ closeWindow }: CloseWindow) {
  // ----- global states -----
  const { currentMonth, currentYear, resetMonthFilter, setFetchingData } = useCalendarStore();
  // ----- local states -----

  const [openStatistics, setOpenStatistics] = useState<boolean>(false);
  const [openAddReceiptModal, setOpenAddReceiptModal] = useState<boolean>(false);
  const [selectedDealId, setSelectedDealId] = useState<number | null>(null);
  const [setUpDealShow, setSetUpDealShow] = useState<boolean>(false);
  const [onlyPending, setOnlyPending] = useState<boolean>(true);

  // table data
  const [tableData, setTableData] = useState<DealsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const initialColumnsDef = {
    customer_name: true,
    phone_number: true,
    vehicle: true,
    sales_rep: true,
    down_payment: true,
    paid: true,
    money_due_paid: true,
    differed: true,
    bonus: true,
    // transferred: true,
    // bonus_available: true,
    downpayment_fee: true,
    actions: true,
  };

  const handleAddReceipt = (dealId: number) => {
    setSelectedDealId(dealId);
    setOpenAddReceiptModal(true);
  };

  const columsRenderers: { [key in keyof typeof initialColumnsDef]?: (el: DealsData) => any } = {
    customer_name: el => (
      <CustomerName customer={`${el.customer.first_name} ${el.customer.last_name}`} customerId={el.customer_id} />
    ),
    sales_rep: el => <SplitSellersInfo client={{ seller: el.customer.seller, lead: el.lead }} />,
    vehicle: el =>
      el.customer.interested_vehicle ? (
        <div onClick={() => { }}>
          <VehicleFormat interestedVehicle={el.customer.interested_vehicle} mxAuto={false} />
        </div>
      ) : (
        ''
      ), // formatVehicle(el.customer.interested_vehicle) : '',
    actions: el => (
      <div className="flex items-center gap-2">
        <Button
          identity="view"
          backgroundColor="#6cccbcff"
          textColor="#FFF"
          buttonText="Add Receipt"
          onClick={(e) => {
            e.stopPropagation();
            handleAddReceipt(el.id);
          }}
        // disabled={loading}
        />
      </div>
    ),
  };

  const { columns: colomnsToSalesLog } = useDynamicTableColumns<DealsData, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    hideHeaderFor: ['actions'],
    columnRenderers: columsRenderers,
    accessorFnMapper: {
      customer_name: el => `${el.customer.first_name} ${el.customer.last_name}`,
      phone_number: el => el.customer.mobile_phone,
      vehicle: el => (el.customer.interested_vehicle ? formatVehicle(el.customer.interested_vehicle) : ''),
      sales_rep: el => (el.customer.seller ? `${el.customer.seller.name} ${el.customer.seller.last_name}` : ''),
      down_payment: el => currencyFormat.format(Number(el.downpayment || 0)),
      paid: el => currencyFormat.format(Number(el.paid || 0)),
      money_due_paid: el => currencyFormat.format(Number(el.moneyDuePaid || 0)),
      differed: el => currencyFormat.format(Number(el.deferredDownpayment || 0)),
      bonus: el => currencyFormat.format(Number(el.bonus || 0)),
      // transferred: el => '',
      // bonus_available: el => '',
      downpayment_fee: el => {
        const deferredDownpayment = Number(el.deferredDownpayment || 0);
        const bonus = Number(el.bonus || 0);
        const downpaymentFee = deferredDownpayment - bonus;
        return currencyFormat.format(downpaymentFee);
      },
    },
    disabledSortColumns: ['actions'],
    filterableColumns: ['customer_name', 'phone_number', 'vehicle', 'sales_rep', 'down_payment', 'paid', 'money_due_paid', 'differed', 'bonus', 'downpayment_fee'],
  });

  const fetchSaleLogData = async (filter: object | null) => {
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear);
    const query = new URLSearchParams(urlParams);
    if (onlyPending) query.append('onlyPending', 'true');

    try {
      setLoading(true);
      setFetchingData(true);
      const response = await fetch(`/api/reports/differed?${query.toString()}`);
      const data = (await response.json()) as {
        deals: DealsData[];
      };
      setTableData(data.deals);
      setLoading(false);
      setFetchingData(false);
    } catch (error) {
      setLoading(false);
      setFetchingData(false);
      console.error('Error fetching activity counts:', error);
    }
  };

  useEffect(() => {
    fetchSaleLogData(null);
  }, [currentMonth, currentYear, onlyPending]);

  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  // handling buttons
  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'statistics') {
      setOpenStatistics(true);
    }
  };

  // button data
  const buttonInfo = [
    {
      key: 1,
      backgroundColor: '#FFF',
      height: 5.462963,
      identity: 'statistics',
      textColor: '#00A78B',
      width: 8.125,
      border: 0.104167,
      borderColor: '#00A78B',
      buttonText: 'Statistics',
      buttonTextSize: 1.9,
      iconTextGap: 0.729167,
      buttonIcon: <StatisticsIcon />,
      onClick: handleButton,
    },
    // {
    //   key: 2,
    //   backgroundColor: '#FFF',
    //   height: 5.462963,
    //   identity: 'print',
    //   textColor: '#00A78B',
    //   width: 8.125,
    //   border: 0.104167,
    //   borderColor: '#00A78B',
    //   buttonText: 'Print',
    //   buttonTextSize: 1.9,
    //   iconTextGap: 0.729167,
    //   buttonIcon: <GreenPrinterIcon />,
    //   onClick: handleButton,
    // },
  ];

  return (
    <ModalWindow top={0}>
      <ModalContainer width={96.458333} marginTop={5.740741}>
        <ModalContainerTitle
          title="Differed Report"
          closeWindowFunction={handleCloseWindow}
          extraComponent={<MonthNavigator />}
        />
        <ModalContent>
          <div className="w-full h-auto flex justify-start items-center mb-[2vh]">
            <CheckboxInput
              name="onlyPending"
              chekcboxText="Only Pending"
              checked={onlyPending}
              onChange={() => setOnlyPending(!onlyPending)}
            />
          </div>
          {/* <ColoredTable height={55.833333} textColor="#FFF" tableData={tableData} /> */}
          <ColoredTableV2
            data={tableData}
            loading={loading}
            columns={colomnsToSalesLog}
            initialColumnsDef={initialColumnsDef}
            textColor="#FFF"
            height={55.833333}
            rowSelectionIsActive={false}
            printButtonIsActive
            onRowClick={(rowOriginal) => {
              setSelectedDealId(rowOriginal.id);
              setSetUpDealShow(true);
            }}
          />
          <ButtonContainer marginTop={8.611111} gap={1.302083} widthFull justify="right">
            {buttonInfo.map(el => (
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
        <AnimatePresence>{openStatistics && <Statistics closeWindow={setOpenStatistics} />}</AnimatePresence>
        <AnimatePresence>
          {openAddReceiptModal && selectedDealId && (
            <AddReceiptModal onSave={() => {
              // setOpenAddReceiptModal(false);
              fetchSaleLogData(null);
            }} closeWindow={setOpenAddReceiptModal} dealId={selectedDealId} />
          )}
        </AnimatePresence>
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
      </ModalContainer>
    </ModalWindow>
  );
}
