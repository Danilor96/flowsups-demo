import { useEffect, useRef, useState } from 'react';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { currencyFormat } from '../../../utils';
import { useCalendarStore } from '@/store/monthNavigation';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';
import { messagesStore } from '@/store/adminDashboard';

interface DealsBySourceData {
  source: string;
  value: {
    sourceId: number;
    totalSold: number;
    totalProfit: string;
    marketingCost: {
      amount: string;
      sourceId: number;
    } | null;
  };
}

export function Sources() {
  const { currentMonth, currentYear, resetMonthFilter, setFetchingData } = useCalendarStore();

  // table data
  const [tableData, setTableDate] = useState<DealsBySourceData[]>([]);

  // table totals data
  const [totalsData, setTotalsData] = useState<any[]>([
    {
      totals: 'Totals',
      source: 0,
      sold: 0,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const initialColumnsDef = {
    // _blank: true,
    source: true,
    sold: true,
    profit: true,
    profit_per_unit: true,
    cost: true,
    net_profit: true,
    net_profit_per_unit: true,
  };

  const { columns } = useDynamicTableColumns<DealsBySourceData, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers: {
      cost: (el: DealsBySourceData) => (
        <MarketingCostInput
          onSave={({ currentMonth, currentYear }) => fetchDealBySourcesData({ currentMonth, currentYear })}
          currentCostAmount={el.value?.marketingCost?.amount || null}
          sourceId={el.value.sourceId}
        />
      ),
    },
    accessorFnMapper: {
      source: el => el.source,
      sold: el => el.value.totalSold,
      profit: el => currencyFormat.format(Number(el.value?.totalProfit || 0) || 0),
      profit_per_unit: el => currencyFormat.format(Number(el.value?.totalProfit || 0) / el.value?.totalSold || 0),
      cost: el => currencyFormat.format(Number(el.value?.marketingCost?.amount) || 0),
      net_profit: el => {
        const cost = el.value?.marketingCost?.amount ? Number(el.value?.marketingCost?.amount) : 0;
        return currencyFormat.format(Number(el.value?.totalProfit || 0) - cost);
      },
      net_profit_per_unit: el => {
        const cost = el.value?.marketingCost?.amount ? Number(el.value?.marketingCost?.amount) : 0;
        const totalProfit = Number(el.value?.totalProfit) || 0;
        const totalSold = el.value?.totalSold || 1;
        return currencyFormat.format((totalProfit - cost) / totalSold);
      },
    },
    columnStyles: {
      sold: { size: 100 },
      net_profit_per_unit: { size: 200 },
    },
  });

  const fetchDealBySourcesData = async ({currentMonth, currentYear}: { currentMonth: number; currentYear: number }) => {
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear);
    try {
      setLoading(true);
      // const dateQueryString = undefined; // buildDateQueryString(filter);
      const response = await fetch(`/api/reports/salesLog/sources?${urlParams|| ''}`);
      const data = (await response.json()) as {
        dealsBySource: DealsBySourceData[];
      };
      setTableDate(data.dealsBySource);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deal counts:', error);
    }
  };

  useEffect(() => {
    fetchDealBySourcesData({currentMonth, currentYear});
  }, [currentMonth, currentYear]);

  return (
    <ModalContent widthFull>
      <Paragraph fontSize={2.777778} fontWeight={600} color="#00A78B" marginBottom={1.666667}>
        Marketing
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

export const MarketingCostInput = ({
  marketingCostId,
  sourceId,
  currentCostAmount,
  onSave,
}: {
  marketingCostId?: number | null;
  sourceId: number;
  currentCostAmount: string | null;
  onSave?: ({ currentMonth, currentYear }: { currentMonth: number; currentYear: number }) => Promise<void>;
}) => {
  const setMessages = messagesStore(state => state.setMessages);
  const { currentMonth, currentYear } = useCalendarStore();

  const [displayValue, setDisplayValue] = useState(
    currentCostAmount ? currencyFormat.format(Number(currentCostAmount)) : '',
  );
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const inputEditedRef = useRef<NodeJS.Timeout | null>(null);

  const updateMarketingCostPut = async (sourceId: number, amount: string | null) => {
    const formData = new FormData();
    amount && formData.append('amount', amount);
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear);
    try {
      setLoading(true);
      const response = await fetch(`/api/reports/salesLog/sources/${sourceId}/marketing-cost?${urlParams || ''}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (data.serverError || data.error) {
        setMessages(data.serverError || data.error);
      }
      if (data.successMessage) {
        handleBlur();
        onSave && onSave({ currentMonth, currentYear });
      }
      setLoading(false);
    } catch (error) {
      setMessages('An error occurred');
      setLoading(false);
      console.error('Error updating marketing cost:', error);
    }
  };

  const handleUpdateMarketingCost = async (sourceId: number, amount: string | null) => {
    await updateMarketingCostPut(sourceId, amount);
    // if (inputEditedRef.current) clearTimeout(inputEditedRef.current);

    // inputEditedRef.current = setTimeout(async () => {
    // await updateMarketingCostPut(sourceId, amount);
    // }, 1000);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (displayValue && displayValue.length > 0) {
      setDisplayValue(displayValue.replace('$', '').replaceAll(',', ''));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    const parsedValue = parseFloat(displayValue.replaceAll('$', '').replaceAll(',', ''));
    if (!isNaN(parsedValue) && parsedValue !== 0) {
      setDisplayValue(currencyFormat.format(parsedValue));
    } else {
      // onChange(null); // Limpiamos el valor si es inválido o cero
    }
  };

  // 4. ONCHANGE: Mientras el usuario está escribiendo.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    console.log('on change', text);
    // Regex que solo permite un patrón numérico con hasta 2 decimales
    // Ej: "123" o "123.45" o "123."
    // No permite: "abc", "1.2.3", "1.234"
    const regex = /^\d*(\.\d{0,2})?$/;
    if (text === '') {
      setDisplayValue('');
      // handleUpdateMarketingCost(sourceId, null);
      return;
    }
    if (text !== '' && regex.test(text)) {
      // Si el texto es válido, actualizamos el 'displayValue' local.
      setDisplayValue(text);
      console.log('amount for put: ', text);
      // handleUpdateMarketingCost(sourceId, text);
    }
    // Si el texto es inválido (ej: "123a"), no actualizamos el estado,
    // y el input "rechaza" visualmente el carácter.
  };

  return (
    <div
      className="flex gap-1 relative items-center"
      onFocus={handleFocus}
      onBlur={e => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          handleBlur();
        }
      }}
    >
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        className="w-full h-full px-2 p-1 bg-transparent transition-colors outline-none
          text-white border border-transparent hover:border-white focus:border-white
        "
        onChange={e => {
          handleChange(e);
        }}
        // onFocus={handleFocus}
        placeholder={currencyFormat.format(0)} // Muestra "$0.00"
      />
      {!loading && isFocused && (
        <button
          title="Save cost"
          className="hover:scale-105 transition-all"
          onClick={event => {
            event?.preventDefault();
            event?.stopPropagation();
            if (displayValue === '') {
              handleUpdateMarketingCost(sourceId, null);
              return;
            }
            handleUpdateMarketingCost(sourceId, displayValue.replaceAll('$', '').replaceAll(',', ''));
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/90 hover:text-white transition-colors"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
            <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
            <path d="M14 4l0 4l-6 0l0 -4" />
          </svg>
        </button>
      )}
      {loading && (
        <svg
          className="size-5 animate-spin text-white z-[10]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </div>
  );
};
