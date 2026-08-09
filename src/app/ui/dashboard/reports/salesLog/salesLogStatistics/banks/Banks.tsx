import { useEffect, useState } from 'react';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { currencyFormat } from '../../../utils';
import { useCalendarStore } from '@/store/monthNavigation';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';

interface DealsByBankData {
  id: string;
  name: string;
  sold: number;
  profit: string;
}

export function Banks() {
  const { currentMonth, currentYear, resetMonthFilter, setFetchingData } = useCalendarStore();
  
  const [tableData, setTableDate] = useState<DealsByBankData[]>([]);
  const [loading, setLoading] = useState(false);

  // table totals data
  const [totalsData, setTotalsData] = useState<any[]>([
    {
      totals: 'Totals',
      sold: 0,
      profit: 0,
      per_unit: 0,
    },
  ]);

  const initialColumnsDef = {
    // _blank: true,
    bank: true,
    sold: true,
    profit: true,
    per_unit: true,
  };

  const { columns } = useDynamicTableColumns<DealsByBankData, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    accessorFnMapper: {
      bank: el => el.name,
      sold: el => el.sold,
      profit: el => currencyFormat.format(Number(el.profit) || 0),
      per_unit: el => currencyFormat.format(Number(el.profit) / el.sold || 0),
    },
  });

  const fetchDealBySourcesData = async (filter: object | null) => {
    try {
      setLoading(true);
      const urlParams = getMonthDateRangeParams(currentMonth, currentYear);
      const response = await fetch(`/api/reports/salesLog/banks?${urlParams || ''}`);
      const data = (await response.json()) as {
        dealsByBank: DealsByBankData[];
      };
      setTableDate(data.dealsByBank);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deal counts:', error);
    }
  };

  useEffect(() => {
    fetchDealBySourcesData(null);
  }, [currentMonth, currentYear]);

  return (
    <ModalContent widthFull>
      <Paragraph fontSize={2.777778} fontWeight={600} color="#00A78B" marginBottom={1.666667}>
        Banks
      </Paragraph>
      <ColoredTableV2
        data={tableData}
        columns={columns}
        initialColumnsDef={initialColumnsDef}
        loading={loading}
        height={67}
        textColor="#FFF"
        // specialRow={totalsData}
      />
    </ModalContent>
  );
}
