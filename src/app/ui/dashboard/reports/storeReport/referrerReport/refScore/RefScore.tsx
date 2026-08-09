import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { RefScoreSummary } from '@/app/api/reports/storeReport/referrerReport/type';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { ColoredTableV2 } from '&/table/coloredTable/v2';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { useCallback, useState } from 'react';
import { getData } from './refScore.services';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { VehiclePicker } from '&/miscellaneous/vehicelPicker/VehiclePicker';

export function RefScore({ closeWindow }: { closeWindow: () => void }) {
  // ----- global states -----

  const { formatPhoneNumber } = phoneNumbersFormatStore();

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
  }, [createDate]);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const fetchData = async (dateQueryString?: string | null) => {
    const res = await getData(dateQueryString);

    setData(res);
  };

  const [data, setData] = useState<RefScoreSummary[]>([]);

  const initialColumnsDef = {
    referral_name: true,
    customer_sold: true,
    customer_name: true,
    stock_number: true,
    vehicle: true,
    phone_number: true,
    sales_assigned: true,
    bdc_assigned: true,
  };

  const columnRenderers: { [key: string]: (el: RefScoreSummary) => any } = {
    referral_name: (el) => el.referralName,
    customer_sold: (el) => el.customerSold,
    customer_name: (el) => <CustomerName customer={el.customerName} customerId={el.customerId} />,
    stock_number: (el) => el.stockNumber,
    vehicle: (el) => (
      <VehiclePicker
        vehicleName={el.vehicle}
        customerId={el.customerId}
        interestedVehicleId={el.vehicleId}
        pickerParentAbsolutePos
      />
    ),
    phone_number: (el) => formatPhoneNumber(el.phoneNumber),
    sales_assigned: (el) => el.salesAssigned,
    bdc_assigned: (el) => el.bdcAssigned,
  };

  const { columns } = useDynamicTableColumns<RefScoreSummary, typeof initialColumnsDef>({
    initialColumnsDef,
    columnRenderers,
    accessorFnMapper: {
      referral_name: (el) => el.referralName,
      customer_sold: (el) => el.customerSold,
      customer_name: (el) => el.customerName,
      stock_number: (el) => el.stockNumber,
      vehicle: (el) => el.vehicle,
      phone_number: (el) => el.phoneNumber,
      sales_assigned: (el) => el.salesAssigned,
      bdc_assigned: (el) => el.bdcAssigned,
    },
  });

  return (
    <ModalWindow>
      <ModalContainer width={88} marginTop={3}>
        <ModalContainerTitle title="Referrer Score" closeWindowFunction={closeWindow} />
        <ModalContent>
          <ColoredTableV2
            data={data}
            columns={columns}
            printButtonIsActive
            paginationIsActive
            itemsPerPage={8}
            loading={loading}
            textColor="#FFF"
            relativeBodyTr
            bodyTrHeight={7}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
