import { useEffect, useState } from 'react';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { PlusIcon } from '&/icons/Icons';
import { Button } from '&/buttons/Button';
import { AnimatePresence } from 'framer-motion';
import { AddOther } from '&/dashboard/reports/salesLog/salesLogStatistics/salesScore/addOther/AddOther';
import { AddRts } from '&/dashboard/reports/salesLog/salesLogStatistics/salesScore/addRts/AddRts';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { useCalendarStore } from '@/store/monthNavigation';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';
import { PaidCustomers } from '@/app/ui/dashboard/clientSystem/customerLists/fundedCustomers/PaidCustomers';

interface DealsBySalesData {
  id: number;
  fullName: string;
  totalStore: number;
  totalOther: number;
  totalRts: number;
}

export function SalesScore() {
  const { currentMonth, currentYear, resetMonthFilter, setFetchingData } = useCalendarStore();

  const [openAddOther, setOpenAddOther] = useState<boolean>(false);
  const [openAddRts, setOpenAddRts] = useState<boolean>(false);

  // table data
  const [tableData, setTableDate] = useState<DealsBySalesData[]>([]);
  const [loading, setLoading] = useState(false);

  // table totals data
  const [totalsData, setTotalsData] = useState<any[]>([
    {
      totals: 'Totals',
      store: 0,
      other: 0,
      rts: 0,
      total: 0,
    },
  ]);

  const initialColumnsDef = {
    sales_consultant: true,
    store: true,
    other: true,
    rts: true,
    total: true,
  };

  const { columns } = useDynamicTableColumns<DealsBySalesData, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    accessorFnMapper: {
      sales_consultant: row => row.fullName,
      store: row => row.totalStore,
      other: row => row.totalOther,
      rts: row => row.totalRts,
      total: row => row.totalStore + row.totalOther - row.totalRts,
    },
  });

  const fetchDealBySalesData = async (filter: object | null) => {
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear);
    try {
      setLoading(true);
      const dateQueryString = undefined; // buildDateQueryString(filter);
      const response = await fetch(`/api/reports/salesLog/sales-score?${urlParams || ''}`);
      const data = (await response.json()) as {
        dealsBySales: DealsBySalesData[];
      };
      setTableDate(data.dealsBySales);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deal counts:', error);
    }
  };

  useEffect(() => {
    fetchDealBySalesData(null);
  }, [currentMonth, currentYear]);

  // handling buttons
  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'addOther') {
      setOpenAddOther(true);
    }

    if (identity === 'addRts') {
      setOpenAddRts(true);
    }
  };

  // button info
  const btnInfo = [
    {
      key: 1,
      backgroundColor: '#FFF',
      height: 5.462963,
      identity: 'addOther',
      textColor: '#00A78B',
      width: 8.385417,
      border: 0.104167,
      borderColor: '#00A78B',
      buttonText: 'add other',
      buttonTextSize: 1.9,
      iconTextGap: 0.729167,
      buttonIcon: <PlusIcon />,
      onClick: handleButton,
    },
    {
      key: 2,
      backgroundColor: '#FFF',
      height: 5.462963,
      identity: 'addRts',
      textColor: '#00A78B',
      width: 8.385417,
      border: 0.104167,
      borderColor: '#00A78B',
      buttonText: 'add RTS',
      buttonTextSize: 1.9,
      iconTextGap: 0.729167,
      buttonIcon: <PlusIcon />,
      onClick: handleButton,
    },
  ];

  return (
    <ModalContent widthFull>
      <ButtonContainer marginTop={0} marginBottom={1.666667} widthFull justify="space-between" alignContentCenter>
        <Paragraph fontSize={2.777778} fontWeight={600} color="#00A78B">
          Sales Score
        </Paragraph>
        <ButtonContainer marginTop={0} gap={1.145833}>
          {btnInfo.map(el => (
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
      </ButtonContainer>
      {/* <ColoredTable
        height={65.8}
        tableData={tableData}
        textColor="#FFF"
        specialRow={totalsData}
        headTextCenter
      /> */}
      <ColoredTableV2
        data={tableData || []}
        columns={columns}
        loading={loading}
        initialColumnsDef={initialColumnsDef}
        textColor="#FFF"
        height={65.8}
        // specialRow={totalsData}
        rowSelectionIsActive={false}
      />
      <AnimatePresence>
        {openAddOther && <AddOther closeWindow={setOpenAddOther} />}
        {openAddRts && (
          // <AddRts closeWindow={setOpenAddRts} />
          <PaidCustomers onCloseWindow={() => setOpenAddRts(false)}/>
        )}
      </AnimatePresence>
    </ModalContent>
  );
}
