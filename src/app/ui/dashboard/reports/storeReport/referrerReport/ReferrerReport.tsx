import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ReferrerSummary } from '@/app/api/reports/storeReport/referrerReport/type';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { useCallback, useState } from 'react';
import { getData } from './referrer.services';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { dateFormatsStore } from '@/store/dateFormats';
import { ColoredTableV2 } from '&/table/coloredTable/v2';
import { ButtonContainer } from '@/app/ui/buttons/ButtonContainer';
import { FilterGroupV2 } from '@/app/ui/miscellaneous/filterGroup/FilterGroupV2';
import { FilterableField } from '@/store/customerList/types';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { AmountInput } from './amountInput/AmountInput';
import { referrerStore } from '@/store/reports';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { Button } from '@/app/ui/buttons/Button';
import { StatisticsIcon } from '@/app/ui/icons/Icons';
import { RefScore } from './refScore/RefScore';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';

export function ReferrerReport({ closeFunction }: { closeFunction: () => void }) {
  // ----- global states -----

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { dateFormatted } = dateFormatsStore();

  const { amount, referrerId, setReferrerId, setAmount } = referrerStore();

  const createDate = reportsFiltersStore((store) => store.createDate);
  const { clearFilters, applyFilter } = reportsFiltersStore();

  const getPromiseData = useCallback(() => {
    const resultForQuery = transformDateToQuery(createDate);

    const dateQueryString = resultForQuery ? buildDateQueryString(resultForQuery) : null;

    if (
      resultForQuery?.optionDate === '13' &&
      (!resultForQuery.fromDate || !resultForQuery.toDate)
    ) {
      return [];
    }

    const options = ['4', '5', '10', '11'];
    if (
      options.includes(resultForQuery?.optionDate || '0') &&
      (!resultForQuery?.valueDate || resultForQuery?.valueDate === '0')
    ) {
      return [];
    }

    return [fetchData(dateQueryString)];
  }, [createDate]);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [data, setData] = useState<ReferrerSummary[]>([]);
  const [refScoreWindow, setRefScoreWindow] = useState(false);

  const fetchData = async (dateQueryString?: string | null) => {
    const res = await getData(dateQueryString);

    setData(res);
  };

  const columnRenderers: { [key: string]: (el: ReferrerSummary) => any } = {
    referrer_customer: (el) => (
      <CustomerName customerId={el.customerId} customer={el.customerName} />
    ),
    mobile_phone: (el) => formatPhoneNumber(el.mobilePhone),
    sales_rep: (el) => el.salesRep,
    contacted: (el) => (el.contacted ? 'Contacted' : 'No Contacted'),
    address: (el) => el.address,
    amount: (el) => <AmountInput value={el.amount} id={el.referrerDataId} />,
    stock_number: (el) => el.stockNumber,
    customer: (el) => (
      <CustomerName customerId={el.newCustomerNameId} customer={el.newCustomerName} />
    ),
    date: (el) => dateFormatted(5, el.date),
    fee: (el) => el.fee,
    funding_status: (el) => el.fundingStatus,
  };

  const initialColumnsDef = {
    referrer_customer: true,
    mobile_phone: true,
    sales_rep: true,
    contacted: true,
    address: true,
    amount: true,
    stock_number: true,
    customer: true,
    date: true,
    fee: true,
    funding_status: true,
  };

  const { columns } = useDynamicTableColumns<ReferrerSummary, typeof initialColumnsDef>({
    initialColumnsDef,
    columnRenderers,
    accessorFnMapper: {
      referrer_customer: (el) => el.customerName,
      mobile_phone: (el) => el.mobilePhone,
      sales_rep: (el) => el.salesRep,
      contacted: (el) => el.contacted,
      address: (el) => el.address,
      amount: (el) => el.amount,
      stock_number: (el) => el.stockNumber,
      customer: (el) => el.newCustomerName,
      date: (el) => el.date,
      fee: (el) => el.fee,
      funding_status: (el) => el.fundingStatus,
    },
  });

  const filterableFields: FilterableField[] = [
    { id: 'newCustomerName', label: 'Referrer Name', type: 'text' },
    { id: 'mobilePhone', label: 'Mobile Phone', type: 'text' },
    { id: 'salesRep', label: 'Sales Rep', type: 'text' },
    { id: 'address', label: 'Address', type: 'text' },
    { id: 'amount', label: 'Amount', type: 'text' },
    { id: 'stockNumber', label: 'Stock #', type: 'text' },
    { id: 'customerName', label: 'Customer', type: 'text' },
    { id: 'date', label: 'Created At', type: 'date' },
    { id: 'fee', label: 'Fee', type: 'text' },
    { id: 'fundingStatus', label: 'Status', type: 'text' },
  ];

  const filteredData = applyFilter(data);

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleSaveAmount = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();

    if (amount) formData.append('amount', amount);

    const apiUrl = `/api/reports/storeReport/referrerReport/amount/${referrerId}`;

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'PUT',
      options: {
        onSuccess() {
          setReferrerId(null);

          fetchData();
        },
      },
    });
  };

  const [showFilter, setShowFilter] = useState(true);
  const [reloading, setReloading] = useState(false);

  const reloadHandling = async () => {
    setReloading(true);

    const resultForQuery = transformDateToQuery(createDate);

    const dateQueryString = resultForQuery ? buildDateQueryString(resultForQuery) : null;

    if (
      resultForQuery?.optionDate === '13' &&
      (!resultForQuery.fromDate || !resultForQuery.toDate)
    ) {
      return;
    }

    const options = ['4', '5', '10', '11'];
    if (
      options.includes(resultForQuery?.optionDate || '0') &&
      (!resultForQuery?.valueDate || resultForQuery?.valueDate === '0')
    ) {
      return;
    }

    await fetchData(dateQueryString);

    setReloading(false);
  };

  return (
    <ModalWindow>
      <ModalContainer width={88} marginTop={3}>
        <ModalContainerTitle
          title="Referrer Report"
          closeWindowFunction={() => {
            clearFilters();

            setReferrerId(null);

            setAmount('');

            closeFunction();
          }}
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={filterableFields}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={reloadHandling}
            />
          }
        />
        <ModalContent>
          {showFilter && (
            <ButtonContainer marginTop={0} widthFull marginBottom={2}>
              <FilterGroupV2
                availableFilters={{
                  createDate: true,
                }}
                advancedFilterFields={filterableFields}
              />
            </ButtonContainer>
          )}
          <ColoredTableV2
            data={filteredData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            textColor="#FFF"
            height={55.833333}
            rowSelectionIsActive={false}
            loading={loading || loadingFetch || reloading}
            printButtonIsActive
            paginationIsActive
            itemsPerPage={8}
            onRowClick={(rowData) => {
              const newReferrerId =
                rowData.referrerDataId === referrerId ? null : rowData.referrerDataId;

              setReferrerId(newReferrerId);
            }}
          />
          <ButtonContainer marginTop={2} widthFull justify="right" gap={1.5}>
            <Button
              backgroundColor="#FFF"
              identity="refScore"
              textColor="#00A78B"
              border={0.104167}
              width={10}
              height={5.462963}
              borderColor="#00A78B"
              buttonText="Referral Score"
              iconTextGap={0.729167}
              buttonTextSize={1.9}
              buttonIcon={<StatisticsIcon />}
              disabled={loading || loadingFetch}
              onClick={() => setRefScoreWindow(true)}
            />
            <Button
              backgroundColor="#00a78b"
              identity="save"
              textColor="#FFF"
              buttonText="Save"
              disabled={loading || loadingFetch}
              buttonTextSize={1.9}
              onClick={handleSaveAmount}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
      {refScoreWindow && <RefScore closeWindow={() => setRefScoreWindow(false)} />}
    </ModalWindow>
  );
}
