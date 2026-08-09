import { useEffect, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { MonthNavigator } from '&/miscellaneous/monthNavigator/MonthNavigator';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { currencyFormat } from '../../utils';
import { useCalendarStore } from '@/store/monthNavigation';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';

interface DefferedData {
  sellerId: number;
  sellerFullName: string;
  moneyOweCurrentMonth: string;
  moneyOwePreviousMonth: string;
  bonus: string;
}

export function Statistics({ closeWindow }: CloseWindow) {
  // ----- global states -----
  const { currentMonth, currentYear, resetMonthFilter, setFetchingData } = useCalendarStore();

  // ----- local states -----

  const [tableData, setTableData] = useState<DefferedData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const initialColumnsDef = {
    sales_consultant: true,
    bonus: true,
    money_owe_current_month: true,
    money_owe_months_before: true,
    total_money_owe: true,
  };

  const { columns: colomnsToSalesLog } = useDynamicTableColumns<DefferedData, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    // columnRenderers: columsRenderers,
    accessorFnMapper: {
      sales_consultant: (el) => el.sellerFullName,
      bonus: (el) => currencyFormat.format(parseFloat(el.bonus || '0')),
      money_owe_current_month: (el) => currencyFormat.format(parseFloat(el.moneyOweCurrentMonth || '0')),
      money_owe_months_before: (el) => currencyFormat.format(parseFloat(el.moneyOwePreviousMonth || '0')),
      total_money_owe: (el) => {
        const moneyOweCurrentMonth = parseFloat(el.moneyOweCurrentMonth || '0');
        const moneyOwePreviousMonth = parseFloat(el.moneyOwePreviousMonth || '0');

        return currencyFormat.format(moneyOweCurrentMonth + moneyOwePreviousMonth);
      }
    },
  });

  const fetchSaleLogData = async (filter: object | null) => {
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear);
    try {
      setLoading(true);
      setFetchingData(true);
      const response = await fetch(`/api/reports/differed/sales-statistics?${urlParams || ''}`);
      const data = (await response.json()) as {
        data: DefferedData[];
      };
      setTableData(data.data);
      setLoading(false);
      setFetchingData(false);
    } catch (error) {
      setLoading(false);
      setFetchingData(false);
      console.error('Error fetching activity counts:', error);
    }
  };

  useEffect(() => {
    const dateToExternalFilter = null;
    fetchSaleLogData(dateToExternalFilter);
  }, [currentYear, currentMonth]);

  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  return (
    <ModalWindow top={0}>
      <ModalContainer marginTop={8} width={87.395833} height={80}>
        <ModalContainerTitle
          title="Statistics"
          closeWindowFunction={handleCloseWindow}
          extraComponent={<MonthNavigator />}
        />
        <ModalContent overflowVisible>
          <ColoredTableV2
            data={tableData}
            loading={loading}
            columns={colomnsToSalesLog}
            initialColumnsDef={initialColumnsDef}
            textColor="#FFF"
            height={60}
            rowSelectionIsActive={false}
            printButtonIsActive
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
