import { useCallback, useEffect, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { AnimatePresence } from 'framer-motion';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { MonthNavigator } from '&/miscellaneous/monthNavigator/MonthNavigator';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { StatisticsIcon } from '&/icons/Icons';
import { Button } from '&/buttons/Button';
import { Statistics } from '&/dashboard/reports/bdcLog/statistics/Statistics';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { BdcLogSummary } from '@/app/api/reports/bdcLog/types';
import { getData } from './bdcLog.services';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { CustomerName } from '@/app/ui/miscellaneous/customerName/CustomerName';
import { dateFormatsStore } from '@/store/dateFormats';
import { VehiclePicker } from '@/app/ui/miscellaneous/vehicelPicker/VehiclePicker';
import { UserPicker } from '@/app/ui/miscellaneous/userPicker/UserPicker';
import { useCalendarStore } from '@/store/monthNavigation';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';

export function BdcLog({ closeWindow }: CloseWindow) {
  // ----- global states -----

  const { dateFormatted } = dateFormatsStore();

  const { currentMonth, currentYear, resetMonthFilter, setFetchingData } = useCalendarStore();

  const getPromiseData = useCallback(() => {
    return [fetchData()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentYear]);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [openStatistics, setOpenStatistics] = useState<boolean>(false);

  const [data, setData] = useState<BdcLogSummary[]>([]);

  const fetchData = async () => {
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear);

    const bdcSummary = await getData(urlParams);

    setData(bdcSummary);
  };

  const columnRenderers: { [key: string]: (el: BdcLogSummary) => any } = {
    customer: (el) => <CustomerName customer={el.customerName} customerId={el.customerId} />,
    date: (el) => dateFormatted(5, el.soldFundingDate),
    sales_assigned: (el) => (
      <UserPicker
        leadId={el.leadId}
        customerId={el.customerId}
        salesRep={{
          id: el.salesRepId,
          userFullname: el.salesRep,
        }}
      />
    ),
    bdc_rep_assigned: (el) => (
      <UserPicker
        leadId={el.leadId}
        customerId={el.customerId}
        bdc={{
          id: el.bdcRepId,
          userFullname: el.bdcRep,
        }}
      />
    ),
    manager_assigned: (el) => (
      <UserPicker
        leadId={el.leadId}
        customerId={el.customerId}
        bdc={{
          id: el.managerRepId,
          userFullname: el.managerRep,
        }}
      />
    ),
  };

  const initialColumnsDef = {
    customer: true,
    date: true,
    sales_assigned: true,
    bdc_rep_assigned: true,
    manager_assigned: true,
  };

  const { columns } = useDynamicTableColumns<BdcLogSummary, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers,
    accessorFnMapper: {
      customer: (el) => el.customerName,
      date: (el) => el.soldFundingDate,
      sales_assigned: (el) => el.salesRep,
      bdc_rep_assigned: (el) => el.bdcRep,
      manager_assigned: (el) => el.managerRep,
    },
  });

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
  ];

  // handling close current window
  const handleCloseWindow = () => {
    resetMonthFilter();

    closeWindow(false);
  };

  useEffect(() => {
    setFetchingData(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <ModalWindow top={0}>
      <ModalContainer marginTop={5.555556} width={87.395833}>
        <ModalContainerTitle
          title="BDC Log"
          closeWindowFunction={handleCloseWindow}
          extraComponent={<MonthNavigator />}
        />
        <ModalContent>
          <ColoredTableV2
            data={data}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            textColor="#FFF"
            height={55.833333}
            rowSelectionIsActive={false}
            loading={loading}
            relativeBodyTr
            paginationIsActive
            itemsPerPage={8}
            printButtonIsActive
          />
          <ButtonContainer widthFull justify="right" marginTop={8.055556} gap={1.302083}>
            {buttonInfo.map((el) => (
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
        <AnimatePresence>
          {openStatistics && <Statistics closeWindow={setOpenStatistics} />}
        </AnimatePresence>
      </ModalContainer>
    </ModalWindow>
  );
}
