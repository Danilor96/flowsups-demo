import { useCallback, useEffect, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { MonthNavigator } from '&/miscellaneous/monthNavigator/MonthNavigator';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '&/table/coloredTable/v2';
import { FundingLogStatisticsSummary } from '@/app/api/reports/fundingLog/types';
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

  const [data, setData] = useState<FundingLogStatisticsSummary[]>([]);

  const fetchData = async () => {
    const urlParams = getMonthDateRangeParams(currentSecondMonth, currentSecondYear);

    const res = await getData(urlParams);

    setData(res);
  };

  const columnRenderers: { [key: string]: (el: FundingLogStatisticsSummary) => any } = {
    sales_consultant: (el) => el.salesRep,
    pending: (el) => el.pending,
    funded: (el) => el.funded,
    returned: (el) => el.returned,
    total: (el) => el.total,
  };

  const initialColumnsDef = {
    sales_consultant: true,
    pending: true,
    funded: true,
    returned: true,
    total: true,
  };

  const { columns } = useDynamicTableColumns<FundingLogStatisticsSummary, typeof initialColumnsDef>(
    {
      initialColumnsDef,
      excludeKeys: ['id'],
      columnRenderers,
      accessorFnMapper: {
        sales_consultant: (el) => el.salesRep,
        pending: (el) => el.pending,
        funded: (el) => el.funded,
        returned: (el) => el.returned,
        total: (el) => el.total,
      },
    },
  );

  // handling close current window
  const handleCloseWindow = () => {
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
          closeWindowFunction={() => {
            setSecondFilterActive(false);

            handleCloseWindow();
          }}
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
