'use client';

import { ConfirmNotification } from '&/notifications/Notification';
import { VehicleData } from '@/app/libs/definitions';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { GenericListSearch } from '../../select/GenericSelector/GenericListSearch';
import { VehicleCard, VehicleCardWithOptions } from '../customerVehiclePicker/vehiclesList/vehicleCard/VehicleCard';

export interface VehicleSelectorPopupProps {
  children: React.ReactNode;
  isOpen: boolean;
  showFullSelector: boolean;
  isLoadingVehicles: boolean;
  loadingSwap: boolean;
  confirmModalOpen: boolean;
  selectorOptions: VehicleData[];
  vehicleAsigned?: VehicleData | null;
  openSelector: () => void;
  closeSelector: () => void;
  setShowFullSelector: (show: boolean) => void;
  handleVehicleSelect: (id: string) => void;
  handleSwapConfirm: (decision: boolean) => void;
  getVehiclesData: () => Promise<void>;
  getVehicleLabel: (v: VehicleData) => string;
  placement?: Placement;
  popupWidth?: string;
  disabled?: boolean;
}

export function VehicleSelectorPopup({
  children,
  isOpen,
  showFullSelector,
  isLoadingVehicles,
  loadingSwap,
  confirmModalOpen,
  selectorOptions,
  vehicleAsigned,
  openSelector,
  closeSelector,
  setShowFullSelector,
  handleVehicleSelect,
  handleSwapConfirm,
  getVehiclesData,
  getVehicleLabel,
  placement = 'bottom-start',
  popupWidth = '26vw',
  disabled = false,
}: VehicleSelectorPopupProps) {
  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (disabled) return;
      if (open) {
        openSelector();
      } else {
        closeSelector();
      }
    },
    middleware: [offset(10), flip({ fallbackAxisSideDirection: 'end' }), shift()],
    placement,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  useEffect(() => {
    if (isOpen && showFullSelector) {
      getVehiclesData();
    }
  }, [isOpen, showFullSelector, getVehiclesData]);

  const renderVehicleOption = (el: VehicleData, isSelected: boolean) => {
    if (isSelected || el?.id === vehicleAsigned?.id) return null;
    return (
      <div
        onClick={() => handleVehicleSelect(el.id.toString())}
        className={`w-full h-fit cursor-pointer mb-1 rounded-lg ${
          isSelected
            ? 'bg-[#c4e9e2] border border-[#00A78B]'
            : 'bg-[#FFF] hover:bg-slate-50 border border-transparent'
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

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        style={{ display: 'inline-block' }}
        className={disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      >
        {children}
      </span>
      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: popupWidth,
                zIndex: 9999,
              }}
              {...getFloatingProps()}
              className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
            >
              {vehicleAsigned && !showFullSelector ? (
                <div className="w-full h-fit rounded-lg">
                  <VehicleCardWithOptions
                    vehicle={vehicleAsigned}
                    changeVehicleOnClick={() => setShowFullSelector(true)}
                    editVehicleOnClickEffect={e => {
                      closeSelector();
                    }}
                  />
                </div>
              ) : (
                <div className="max-h-[50vh] overflow-y-auto">
                  <GenericListSearch
                    options={selectorOptions}
                    selectedIds={vehicleAsigned ? [vehicleAsigned.id.toString()] : []}
                    toggleOption={id => handleVehicleSelect(id)}
                    getOptionLabel={getVehicleLabel}
                    getOptionId={(v: VehicleData) => v.id.toString()}
                    getSearchLabel={(v: VehicleData) => `${getVehicleLabel(v)} ${v.stock_no || ''}`}
                    renderOption={(option, isSelected, toggle) => renderVehicleOption(option, isSelected)}
                    loading={isLoadingVehicles}
                  />
                </div>
              )}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
      <AnimatePresence>
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
            onDecision={handleSwapConfirm}
          />
        )}
      </AnimatePresence>
    </>
  );
}