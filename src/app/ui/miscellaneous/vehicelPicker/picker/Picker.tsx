import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { vehiclesDataStore } from '@/store/inventory';
import { useSocketStore } from '@/store/socketIo';
import { useState } from 'react';

export function Picker({
  customerId,
  onSuccess,
  leadId,
}: {
  customerId: number;
  onSuccess?: () => void;
  leadId?: number;
}) {
  // ----- global states -----

  const { vehicles } = vehiclesDataStore();

  const { updateDataWithSocket } = useSocketStore();

  // local states -----

  const [selectedVehicleName, setSelectedVehicleName] = useState('');

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;

    setSelectedVehicleName(name);

    const formData = new FormData();

    formData.append('vehicleId', value);

    if (leadId) formData.append('leadId', leadId.toString());

    const apiUrl = `/api/vehiclePicker/${customerId}`;

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'PUT',
      permissionForFetch: 68,
      options: {
        onSuccess: () => {
          updateDataWithSocket('dailyAppointmentsList');

          updateDataWithSocket('customersList');

          updateDataWithSocket('singleClient');

          if (onSuccess) onSuccess();
        },
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setSelectedVehicleName(value);
  };

  const options = vehicles?.map((vehicle) => {
    return {
      value: vehicle.id.toString(),
      name: `${vehicle.vehicle_brands.brand || ''} ${vehicle.vehicle_models.model || ''}`,
    };
  });

  return (
    <aside className="w-full absolute/ top-[50%]/ translate-y-[-50%]/ right-[50%]/ translate-x-[50%]/">
      <AdderSelect
        onChange={handleChange}
        onClick={handleButton}
        label=""
        name=""
        iconTextGap={0}
        optionsBackgroundColor="#FFF"
        optionsHeight={7}
        optionsNameColor="#00a78b"
        textColor="#00a78b"
        optionsRadius={0.5}
        optionsWidth={7}
        value={selectedVehicleName}
        width={7}
        widthFull
        optionsContainerHeight={14}
        optionsWidthFull
        options={options}
        loading={loadingFetch}
      />
    </aside>
  );
}
