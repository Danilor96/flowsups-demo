import { SalesConversionCustomersDetail } from '@/app/api/reports/storeReport/salesConversion/types';
import { useCallback, useState } from 'react';
import { getData } from './customersDetail.services';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { dateFormatsStore } from '@/store/dateFormats';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ColoredTableV2 } from '&/table/coloredTable/v2';
import { customerStatusName } from '@/app/libs/customer/customersFunctions';

export function CustomersDetail({
  userId,
  user,
  customerStatusId,
  closeFn,
}: {
  userId: number;
  user: string;
  customerStatusId: number;
  closeFn: () => void;
}) {
  // global states

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { dateFormatted } = dateFormatsStore();

  const createDate = reportsFiltersStore((store) => store.createDate);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading } = useLoadingGetData(getPromiseData);

  // local states

  const [data, setData] = useState<SalesConversionCustomersDetail[]>([]);

  const fetchData = async (dateQueryString?: string | null) => {
    const res = await getData(userId, customerStatusId, dateQueryString);

    setData(res);
  };

  const columnRenderers: { [key: string]: (el: SalesConversionCustomersDetail) => any } = {
    customer: (el) => <CustomerName customer={el.customer} customerId={el.id} />,
    phone_number: (el) => formatPhoneNumber(el.phoneNumber),
    home_phone: (el) => formatPhoneNumber(el.homePhone),
    email: (el) => el.email,
    source: (el) => el.source,
    dob: (el) => dateFormatted(2, el.dateOfBirth),
    total_count: (el) => el.total,
  };

  const initialColumnsDef = {
    customer: true,
    phone_number: true,
    home_phone: true,
    email: true,
    source: true,
    dob: true,
    total_count: true,
  };

  const { columns } = useDynamicTableColumns<
    SalesConversionCustomersDetail,
    typeof initialColumnsDef
  >({
    columnRenderers,
    initialColumnsDef,
    accessorFnMapper: {
      customer: (el) => el.customer,
      phone_number: (el) => el.phoneNumber,
      home_phone: (el) => el.homePhone,
      email: (el) => el.email,
      source: (el) => el.source,
      dob: (el) => el.dateOfBirth,
      total_count: (el) => el.total,
    },
  });

  return (
    <ModalWindow>
      <ModalContainer marginTop={3} width={80}>
        <ModalContainerTitle
          title={`${user}'s ${customerStatusName[customerStatusId]} customers`}
          closeWindowFunction={closeFn}
        />
        <ModalContent>
          <ColoredTableV2
            data={data}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            textColor="#FFF"
            paginationIsActive
            itemsPerPage={10}
            printButtonIsActive
            loading={loading}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
