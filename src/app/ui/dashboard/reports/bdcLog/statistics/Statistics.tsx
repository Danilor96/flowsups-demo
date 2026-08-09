import { useCallback, useEffect, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { MonthNavigator } from '&/miscellaneous/monthNavigator/MonthNavigator';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { BdcLogStatisticsSummary } from '@/app/api/reports/bdcLog/types';
import { getData } from './statistics.services';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useCalendarStore } from '@/store/monthNavigation';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';

export function Statistics({ closeWindow }: CloseWindow) {
  // ----- global states -----

  const { currentSecondMonth, currentSecondYear, setSecondFilterActive, setFetchingData } =
    useCalendarStore();

  const getPromiseData = useCallback(() => {
    return [fetchData()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSecondMonth, currentSecondYear]);

  const { loading } = useLoadingGetData(getPromiseData);

  useEffect(() => {
    setSecondFilterActive(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- local states -----

  const [data, setData] = useState<BdcLogStatisticsSummary[]>([]);

  const fetchData = async () => {
    const urlParams = getMonthDateRangeParams(currentSecondMonth, currentSecondYear);

    const res = await getData(urlParams);

    setData(res);
  };

  const columnRenderers: { [key: string]: (el: BdcLogStatisticsSummary) => any } = {
    bdc: (el) => el.bdc,
    sold: (el) => el.sold,
    other: (el) => el.other,
    rts: (el) => el.rts,
    total: (el) => el.total,
  };

  const initialColumnsDef = {
    bdc: true,
    sold: true,
    other: true,
    rts: true,
    total: true,
  };

  const { columns } = useDynamicTableColumns<BdcLogStatisticsSummary, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers,
    accessorFnMapper: {
      bdc: (el) => el.bdc,
      sold: (el) => el.sold,
      other: (el) => el.other,
      rts: (el) => el.rts,
      total: (el) => el.total,
    },
  });

  // handling close current window
  const handleCloseWindow = () => {
    setSecondFilterActive(false);

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
          title="Statistics"
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
            paginationIsActive
            itemsPerPage={8}
            printButtonIsActive
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
