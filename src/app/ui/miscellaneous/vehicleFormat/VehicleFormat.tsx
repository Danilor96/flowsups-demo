'use client';

import { VehicleData, InterestedVehicle } from '@/app/libs/definitions';
import { useVehicleSelector, VehicleSelectorPopup } from '../vehicleSelector';

// Type that accepts both InterestedVehicle and VehicleData
type VehicleForDisplay = InterestedVehicle | VehicleData | null | undefined;

export interface VehicleFormatProps {
  interestedVehicle?: VehicleForDisplay;
  flexRow?: boolean;
  mxAuto?: boolean;
  clientIsSold?: boolean;
  customerId?: number;
  userId?: number;
  onVehicleChange?: (id: string, vehicle?: VehicleData) => void;
  disabled?: boolean;
  enableSelector?: boolean;
}

export function VehicleFormat({
  interestedVehicle,
  flexRow = false,
  mxAuto = true,
  clientIsSold,
  customerId,
  userId,
  onVehicleChange,
  disabled = false,
  enableSelector = false,
}: VehicleFormatProps) {
  const vehicleSelector = useVehicleSelector({
    vehicleAsigned: interestedVehicle as VehicleData | null | undefined,
    clientIsSold,
    customerId,
    userId,
    onChangeSuccess: (id, vehicle) => {
      onVehicleChange?.(id, vehicle);
    }
  });

  if (!interestedVehicle) {
    return <p>No Vehicle Assigned</p>;
  }

  const year = interestedVehicle?.vehicle_manufacture_years?.year;
  const brand = interestedVehicle?.vehicle_brands?.brand?.toUpperCase();
  const model = interestedVehicle?.vehicle_models?.model;
  const vin = interestedVehicle?.vehicle_identification_numbers?.vin;
  const lastSixVin = vin?.slice(vin.length - 6, vin.length);
  const stockNumber = interestedVehicle?.stock_no;

  const asideContent = (
    <aside
      className={`w-fit h-fit flex ${flexRow ? 'flex-row gap-1' : 'flex-col gap-[0.2vh]'} ${mxAuto ? 'mx-auto' : ''} ${enableSelector ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity`}
    >
      <p>{`${year} ${brand}`}</p>
      <p>{`${model}${flexRow ? '' : ` [${stockNumber || lastSixVin}]`}`}</p>
    </aside>
  );

  if (!enableSelector) {
    return asideContent;
  }

  return (
    <VehicleSelectorPopup
      {...vehicleSelector}
      vehicleAsigned={interestedVehicle as VehicleData}
      disabled={disabled}
      popupWidth="26vw"
      placement="bottom-start"
    >
      {asideContent}
    </VehicleSelectorPopup>
  );
}
