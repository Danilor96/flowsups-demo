import { Loader } from '@/app/ui/miscellaneous/loader/Loader';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useCallback, useEffect, useState } from 'react';
import { GenericSelector } from '@/app/ui/select/GenericSelector/GenericSelector';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';

export function EndVisitVehiclePicker({
  vehicleId,
  onClick,
  label,
  bgColor = '#FFF',
}: {
  vehicleId?: string;
  onClick: (e: string) => void;
  label?: string;
  bgColor?: string;
}) {
  // ----- global states -----

  const [vehicles, setVehicles] = useState<any[]>([]);

  const getVehiclesData = useCallback(async ({ excludeSold }: { excludeSold?: boolean }) => {
    const params = new URLSearchParams();
    if (excludeSold) params.append('excludeSold', 'true');

    const queryString = params.toString();
    const url = `/api/inventory/vehicle${queryString ? '?' + queryString : ''}`;

    const res = await fetch(url);
    const data = await res.json();

    setVehicles(data);
    return data;
  }, []);

  const getPromiseData = useCallback(() => {
    return [getVehiclesData({ excludeSold: true })];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getVehiclesData]);

  const { loading } = useLoadingGetData(getPromiseData, []);

  useEffect(() => {
    const vehicleExists = vehicles?.some((v: any) => v.id.toString() === vehicleId);

    if (vehicleId && vehicles && !vehicleExists) {
      getVehiclesData({ excludeSold: true });
    }
  }, [vehicleId, vehicles, getVehiclesData]);

  const formatVehicleLabel = (v: any) => {
    const year = v?.vehicle_manufacture_years?.year;
    const brand = v?.vehicle_brands?.brand;
    const model = v?.vehicle_models?.model;
    const stock_no = v?.stock_no;
    const text = `${year ? `${year} ` : ''}${brand} ${model} - [${stock_no || ''}]`;

    return handlingCapitalWords(text);
  };

  return (
    <aside className="relative w-full">
      <GenericSelector
        label={label}
        options={(vehicles as any) || []}
        selectedIds={vehicleId ? [vehicleId] : []}
        isMultiSelect={false}
        onChange={ids => {
          onClick(ids[0] || '');
        }}
        getOptionId={(v: any) => v?.id?.toString() || ''}
        getOptionLabel={formatVehicleLabel}
        placeholder="Select Vehicle"
        width="w-full"
        bgColor={bgColor}
        enableFloating={true}
      />
      {loading && <Loader />}
    </aside>
  );
}
