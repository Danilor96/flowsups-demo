import useUiHandler from '@/hooks/closeComponentsHandler';
import { Paragraph } from '../paragraph/Paragraph';
import { useEffect, useState } from 'react';
import { Picker } from './picker/Picker';
import { vehiclesDataStore } from '@/store/inventory';
import { Can } from '&/auth/Can';

export function VehiclePicker({
  customerId,
  interestedVehicleId,
  vehicleName,
  onSuccess,
  pickerParentAbsolutePos,
  leadId,
}: {
  customerId: number;
  interestedVehicleId?: number | null;
  vehicleName?: string;
  onSuccess?: () => void;
  pickerParentAbsolutePos?: boolean;
  leadId?: number;
}) {
  // ----- global states -----

  const { vehicles } = vehiclesDataStore();

  useEffect(() => {
    if (!interestedVehicleId) {
      setLoading(false);
    }
  }, [interestedVehicleId]);

  useEffect(() => {
    if (vehicles) {
      setLoading(false);
    }
  }, [vehicles]);

  // ----- local states -----

  const [loading, setLoading] = useState(true);

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const vehicleFiltered = vehicles
    ? vehicles?.length > 0
      ? vehicles?.find((vehicle) => vehicle.id === interestedVehicleId)
      : undefined
    : undefined;

  const year = vehicleFiltered?.vehicle_manufacture_years?.year;
  const brand = vehicleFiltered?.vehicle_brands.brand.toUpperCase();
  const model = vehicleFiltered?.vehicle_models.model;
  const vin = vehicleFiltered?.vehicle_identification_numbers.vin;
  const lastSixVin = vin?.slice(-6);

  if (loading) {
    return (
      <Paragraph fontSize={2} color="#FFF">
        Loading vehicle
      </Paragraph>
    );
  }

  return (
    <Can
      requiredPermission={68}
      fallback={
        interestedVehicleId ? (
          <VehicleFormatName brand={brand} year={year} model={model} lastSixVin={lastSixVin} />
        ) : (
          'No vehicle assigned'
        )
      }
    >
      <div
        ref={ref}
        className={
          pickerParentAbsolutePos ? 'absolute top-[50%] translate-y-[-50%] w-[9vw]' : 'relative'
        }
      >
        {!isOpen && (
          <button onClick={toggleOpen} className="hover:opacity-80 transition-all">
            {isOpen ? (
              ''
            ) : interestedVehicleId && vehicleFiltered ? (
              <VehicleFormatName brand={brand} year={year} model={model} lastSixVin={lastSixVin} />
            ) : (
              'Assign Vehicle'
            )}
          </button>
        )}
        {isOpen && <Picker customerId={customerId} onSuccess={onSuccess} leadId={leadId} />}
      </div>
    </Can>
  );
}

export function VehicleFormatName({
  brand,
  lastSixVin,
  model,
  year,
  vehicleName,
}: {
  year?: string;
  brand?: string;
  model?: string;
  lastSixVin?: string;
  vehicleName?: string;
}) {
  if (vehicleName) {
    const vehicleNameArray = vehicleName.split(' ');
    const [year, brand, modelAndVin] = vehicleNameArray;

    return (
      <>
        <p>{`${year} ${brand}`}</p>
        <p>{modelAndVin}</p>
      </>
    );
  }

  return (
    <aside className="w-fit h-fit flex flex-col mx-auto">
      <p>{`${year} ${brand}`}</p>
      <p>{`${model}[${lastSixVin}]`}</p>
    </aside>
  );
}
