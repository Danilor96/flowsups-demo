import { SpecificClient, SpecificClients } from '@/app/libs/definitions';
import { ThreeDotsIcon } from '&/icons/Icons';
import { VehicleFormat } from '&/miscellaneous/vehicleFormat/VehicleFormat';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { useCallback, useMemo, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { useFilters } from '../Filter/useFilters';
import CustomerListFilter from '../Filter';
import { ButtonContainer } from '@/app/ui/buttons/ButtonContainer';
import { DateFormats } from '@/app/ui/miscellaneous/dateFormats/DateFormats';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { StateButton } from './stateButton/StateButton';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { el } from 'date-fns/locale';
import { formatVehicle } from '../utils/utils';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';

export function DeliveryCustomers() {
  // ------- global states -------

  const { closeDeliveryCustomersList } = modalWindowStore();

  const { specificClientsData } = adminDashboardStore();
  const { getSpecificClients, clearSpecificClientsData, getClientStatuses } = adminDashboardStore();

  const getPromiseData = useCallback(() => {
    return [getClientStatuses(), getSpecificClients('4')];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading } = useLoadingGetData(getPromiseData);

  // ------- local states -------

  const { filters, filterCustomer, updateFilter, clearFilters } = useFilters();
  const [reloadLoading, setReloadLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(true);

  const reloadHandling = async () => {
    setReloadLoading(true);
    await Promise.all(getPromiseData());
    setReloadLoading(false);
  };

  const handleCloseWindow = () => {
    clearSpecificClientsData();
    closeDeliveryCustomersList();
  };

  // ------- computed values -------

  const filteredDeliveryCustomers = useMemo(() => filterCustomer(specificClientsData), [specificClientsData, filters]);
  const hasClientsData = filteredDeliveryCustomers && filteredDeliveryCustomers?.length > 0;

  const initialColumnsDef = {
    customer: true,
    mobile_phone: true,
    in_charge: true,
    delivery_time: true,
    vehicle: true,
    state: true,
  };

  const columnRenderers: { [key in keyof typeof initialColumnsDef]: (el: SpecificClient) => any } = {
    customer: el => <CustomerName customer={`${el.first_name || ''} ${el.last_name || ''}`} customerId={el.id} />,
    mobile_phone: el => <CustomerContactFormat contact={el.mobile_phone} customerId={el.id} marginInlineAuto />,
    in_charge: el => `${el.seller?.name || ''} ${el.seller?.last_name || ''}`,
    delivery_time: el =>
      el.vehicle_delivery && el.vehicle_delivery.length > 0 ? (
        <DateFormats date={el.vehicle_delivery[el.vehicle_delivery.length - 1].end_date} format={5} />
      ) : (
        'N/A'
      ),
    vehicle: el => <VehicleFormat interestedVehicle={el.interested_vehicle} />,
    state: el => <StateButton customerId={el.id} />,
  };

  const { columns } = useDynamicTableColumns<SpecificClient, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnStyles: { state: { size: 80 } },
    columnRenderers,
    accessorFnMapper: {
      customer: el => `${el.first_name || ''} ${el.last_name || ''}`,
      mobile_phone: el => el.mobile_phone,
      in_charge: el => `${el.seller?.name || ''} ${el.seller?.last_name || ''}`,
      delivery_time: el =>
        el.vehicle_delivery && el.vehicle_delivery.length > 0
          ? el.vehicle_delivery[el.vehicle_delivery.length - 1].start_date
          : '',
      vehicle: el => formatVehicle(el.interested_vehicle),
    },
    disabledSortColumns: ['state'],
    filterableColumns: ['customer', 'mobile_phone', 'in_charge', 'delivery_time', 'vehicle'],
  });

  return (
    <ModalWindow top={-13.7}>
      <ModalContainer marginTop={5.555556} width={96.822917}>
        <ModalContainerTitle
          title="Delivery"
          closeWindowFunction={handleCloseWindow}
          openNewTab
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={[]}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={reloadHandling}
              options={{ moreOptionsIsVisible: false }}
            />
          }
        />
        <ModalContent>
          {showFilter && (
            <CustomerListFilter
              filters={filters}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              visibleFiltersOptions={{ interestedVehicle: true, deliveryTime: true, status: true }}
            />
          )}
          <ButtonContainer marginTop={1.5} block widthFull>
            <ColoredTableV2
              data={filteredDeliveryCustomers || []}
              columns={columns}
              initialColumnsDef={initialColumnsDef}
              itemsPerPage={8}
              loading={loading || reloadLoading}
              paginationIsActive
              textColor="#FFF"
              height={showFilter ? 54 : 60}
              rowSelectionIsActive={false}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
