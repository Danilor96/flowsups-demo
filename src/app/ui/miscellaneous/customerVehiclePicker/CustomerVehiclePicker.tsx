import { ConfirmNotification } from '&/notifications/Notification';
import { VehicleData } from '@/app/libs/definitions';
import { GenericSelector } from '@/app/ui/select/GenericSelector/GenericSelector';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { VehicleCard, VehicleCardWithOptions } from './vehiclesList/vehicleCard/VehicleCard';
import { messagesStore } from '@/store/adminDashboard';
import { leadsStore } from '@/store/leads';

interface CustomerVehiclePickerProps {
  width: number;
  selectedId?: string;
  onSelect: (id: string, vehicle?: VehicleData) => void;
  label?: string;
  fieldErrors?: {
    [key: string]: [string | undefined];
  };
  name?: string;
  disabled?: boolean;
  vehicleAsigned?: VehicleData | null;
  clientIsSold?: boolean;
  customerId?: number;
  userId?: number;
}

export function CustomerVehiclePicker({
  width,
  selectedId,
  onSelect,
  label = 'Vehicle',
  fieldErrors,
  name,
  disabled,
  vehicleAsigned,
  clientIsSold,
  customerId,
  userId,
}: CustomerVehiclePickerProps) {
  // ----- global states -----
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [showFullSelector, setShowFullSelector] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingVehicleId, setPendingVehicleId] = useState<string | null>(null);
  const [loadingSwap, setLoadingSwap] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const currentLead = leadsStore(store => store.currentLead);

  const setMessage = messagesStore(store => store.setMessages);

  const selectorOptions = vehicleAsigned
    ? [vehicleAsigned, ...(vehicles?.filter(v => v.id !== vehicleAsigned.id) || [])]
    : vehicles || [];

  const getVehiclesData = async () => {
    try {
      setIsLoadingVehicles(true);
      const params = new URLSearchParams();
      params.append('excludeSold', 'true');
      const queryString = params.toString();
      const url = `/api/inventory/vehicle?${queryString}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setIsLoadingVehicles(false);
    }
  };

  const handleOpenSelector = async (isOpen: boolean, isShowFullSelector: boolean) => {
    setIsSelectorOpen(isOpen);
    if (!isOpen) return setShowFullSelector(false);
  };

  useEffect(() => {
    if (isSelectorOpen && (showFullSelector || !vehicleAsigned)) {
      getVehiclesData();
    }
  }, [isSelectorOpen, showFullSelector, vehicleAsigned]);

  // ----- renderers -----
  const renderVehicleOption = (el: any, isSelected: boolean, toggle: () => void) => {
    if (isSelected || el?.id === vehicleAsigned?.id) return;
    return (
      <div
        onClick={() => {
          toggle()
        }}
        className={`w-full h-fit cursor-pointer mb-1 rounded-md ${
          isSelected ? 'bg-[#c4e9e2] border border-[#00A78B]': 'bg-[#FFF] hover:bg-slate-50 border border-transparent'
        }`}
      >
        <VehicleCard
          brand={el.vehicle_brands?.brand || ''}
          model={el.vehicle_models?.model || ''}
          year={el.vehicle_manufacture_years?.year || ''}
          extColor={el.exterior_vehicle_colors?.color || ''}
          mileage={el.vehicle_mileages?.mileage || ''}
          price={el.vehicle_prices?.price || ''}
          status={el.vehicle_status?.status || ''}
          vin={el.vehicle_identification_numbers?.vin || ''}
          stockNo={el.stock_no || ''}
        />
      </div>
    );
  };

  const getVehicleLabel = (v: VehicleData) => {
    const brand = v.vehicle_brands?.brand || '';
    const model = v.vehicle_models?.model || '';
    const year = v.vehicle_manufacture_years?.year || '';
    const text = `${year} ${brand} ${model}`;
    return text;
  };

  const handleSwapSoldVehicle = async (overrideId?: string) => {
    const targetId = overrideId || pendingVehicleId;
    if (!targetId || !customerId || !userId) return;

    setLoadingSwap(true);
    try {
      const response = await fetch('/api/inventory/swapSoldVehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          oldVehicleId: vehicleAsigned?.id,
          newVehicleId: targetId,
          userId,
          leadId: currentLead || null,
        }),
      });
      const responseJson = await response.json();
      if (response.ok) {
        const selectedVehicle = selectorOptions.find(v => v.id.toString() === targetId);

        let updatedVehicle = selectedVehicle;
        if (selectedVehicle) {
          updatedVehicle = {
            ...selectedVehicle,
            vehicle_status_id: 3,
            vehicle_status: {
              ...(selectedVehicle.vehicle_status || {}),
              id: 3,
              status: 'Sold',
            } as any,
          };
        }
        setMessage(undefined, responseJson.message);
        onSelect(targetId, updatedVehicle);
        setShowFullSelector(false);
        setIsSelectorOpen(false);
        getVehiclesData();
        return;
      }
      if (responseJson.serverError) {
        setMessage(responseJson.serverError);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSwap(false);
      setPendingVehicleId(null);
      setConfirmModalOpen(false);
    }
  };

  const onChangeGenericSelector = (ids: string[]) => {
    const id = ids[0] || '';

    if (vehicleAsigned && id === vehicleAsigned.id.toString()) return;

    if (clientIsSold) {
      setPendingVehicleId(id);
      setConfirmModalOpen(true);
      return;
    }

    const selectedVehicle = selectorOptions.find(v => v.id.toString() === id);
    onSelect(id, selectedVehicle);
    if (ids.length === 1) {
      setShowFullSelector(false);
      setIsSelectorOpen(false);
    }
  };

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: `${width}vw`,
      }}
    >
      <GenericSelector
        options={selectorOptions}
        selectedIds={selectedId ? [selectedId] : []}
        isMultiSelect={false}
        open={isSelectorOpen}
        onOpenChange={isOpen => {
          handleOpenSelector(isOpen, showFullSelector);
        }}
        onChange={ids => onChangeGenericSelector(ids)}
        getOptionId={(v: any) => v.id.toString()}
        getOptionLabel={getVehicleLabel}
        getSearchLabel={(v: any) => `${getVehicleLabel(v)} ${v.stock_no || ''}`}
        renderOption={renderVehicleOption}
        label={label}
        placeholder="Select Vehicle"
        width="w-full"
        bgColor="#F4F4F4"
        enableFloating={true}
        capitalWords
        moveSelectedToTop
        disabled={disabled}
        disableRemove={vehicleAsigned?.vehicle_status_id === 3}
        loading={isLoadingVehicles}
      >
        {vehicleAsigned && !showFullSelector && (
          <div className="w-[25vw]">
            <VehicleCardWithOptions
              vehicle={vehicleAsigned}
              changeVehicleOnClick={() => setShowFullSelector(true)}
              editVehicleOnClickEffect={(e) => setIsSelectorOpen(false)}
            />
          </div>
        )}
      </GenericSelector>
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute text-[1.666667vh] text-[#F00] bottom-[-2.1vh]"
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
        {confirmModalOpen && (
          <ConfirmNotification
            notiMessage={vehicleAsigned ? 'Important:' : 'Client is sold.'}
            alterNotiMessage={
              vehicleAsigned
                ? ` Replacing this Sold vehicle will revert its status to 'In Inventory' and mark the new one as 'Sold'. Do you want to proceed?`
                : ' The selected vehicle will be marked as Sold in the inventory. Do you want to proceed?'
            }
            alterNotiMessageColor=""
            textWidth={60}
            loading={loadingSwap}
            onDecision={decision => {
              if (decision && pendingVehicleId) {
                handleSwapSoldVehicle();
              } else {
                setPendingVehicleId(null);
                setConfirmModalOpen(false);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}