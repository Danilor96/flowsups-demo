import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { MonthNavigator } from '&/miscellaneous/monthNavigator/MonthNavigator';
import { useCalendarStore } from '@/store/monthNavigation';
import { useCallback, useEffect, useState } from 'react';
import { WeekPicker } from '&/miscellaneous/monthNavigator/week/Week';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';
import { getData } from './bdc.services';
import { ComissionBdcSummary } from '@/app/api/reports/storeReport/comissionReport/types';
import { ColoredTableV2 } from '&/table/coloredTable/v2';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { SalesDetails } from './salesDetails/SalesDetails';
import { AnimatePresence } from 'framer-motion';
import { AmountForm } from '../amountForm/AmountForm';
import { numberFormatterStore } from '@/store/adminDashboard';

export function BdcReport({ closeFn }: { closeFn: () => void }) {
  // global states

  const { numberFormatter } = numberFormatterStore();

  const {
    currentMonth,
    currentYear,
    currentWeek,
    stateToDoFetch,
    resetMonthFilter,
    setFetchingData,
  } = useCalendarStore();

  const getPromiseData = useCallback(() => {
    return [fetchData()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentYear, currentWeek, stateToDoFetch]);

  const { loading } = useLoadingGetData(getPromiseData);

  // local states

  const [userId, setUserId] = useState<number | null>(null);
  const [type, setType] = useState<'spiff' | 'bonus' | 'salary' | null>(null);

  const [data, setData] = useState<ComissionBdcSummary[]>([]);

  const fetchData = async () => {
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear, currentWeek);

    const res = await getData(urlParams);

    setData(res);
  };

  const columnRenderers: { [key: string]: (el: ComissionBdcSummary) => any } = {
    bdc: (el) => el.bdc,
    sales: (el) => <button onClick={() => setUserId(el.bdcId)}>{el.sales}</button>,
    commission: (el) => numberFormatter(el.comission, undefined, 1),
    spiff: (el) => (
      <button
        onClick={() => {
          setUserId(el.bdcId);
          setType('spiff');
        }}
      >
        {numberFormatter(el.spiff, undefined, 1)}
      </button>
    ),
    bonus: (el) => (
      <button
        onClick={() => {
          setUserId(el.bdcId);
          setType('bonus');
        }}
      >
        {numberFormatter(el.bonus, undefined, 1)}
      </button>
    ),
    salary: (el) => (
      <button
        onClick={() => {
          setUserId(el.bdcId);
          setType('salary');
        }}
      >
        {numberFormatter(el.salary, undefined, 1)}
      </button>
    ),
  };

  const initialColumnsDef = {
    bdc: true,
    sales: true,
    commission: true,
    spiff: true,
    bonus: true,
    salary: true,
  };

  const { columns } = useDynamicTableColumns<ComissionBdcSummary, typeof initialColumnsDef>({
    columnRenderers,
    initialColumnsDef,
    accessorFnMapper: {
      bdc: (el) => el.bdc,
      sales: (el) => el.sales,
      commission: (el) => numberFormatter(el.comission, undefined, 1),
      spiff: (el) => numberFormatter(el.spiff, undefined, 1),
      bonus: (el) => numberFormatter(el.bonus, undefined, 1),
      salary: (el) => numberFormatter(el.salary, undefined, 1),
    },
  });

  useEffect(() => {
    setFetchingData(loading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <ModalWindow>
      <ModalContainer marginTop={3} width={88}>
        <ModalContainerTitle
          title="Bdc Commission"
          closeWindowFunction={() => {
            resetMonthFilter();

            closeFn();
          }}
          extraComponent={<MonthNavigator />}
        />
        <ModalContent>
          <aside className="mb-[1vh]">
            <WeekPicker />
          </aside>
          <ColoredTableV2
            columns={columns}
            data={data}
            initialColumnsDef={initialColumnsDef}
            textColor="#FFF"
            height={55.833333}
            paginationIsActive
            itemsPerPage={8}
            printButtonIsActive
            loading={loading}
          />
        </ModalContent>
      </ModalContainer>
      <AnimatePresence>
        {userId && !type && <SalesDetails userId={userId} closeFn={() => setUserId(null)} />}
        {userId && type && (
          <AmountForm
            userId={userId}
            type={type}
            closeFn={() => {
              setUserId(null);
              setType(null);
            }}
          />
        )}
      </AnimatePresence>
    </ModalWindow>
  );
}
