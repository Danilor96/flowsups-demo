'use client';

import { useState, useCallback } from 'react';
import { VehicleData } from '@/app/libs/definitions';
import { messagesStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';

export interface UseVehicleSelectorProps {
  vehicleAsigned?: VehicleData | null;
  clientIsSold?: boolean;
  customerId?: number;
  userId?: number;
  onChangeSuccess?: (id: string, vehicle?: VehicleData) => void;
  onSelect?: (id: string, vehicle?: VehicleData) => void;
}

export interface UseVehicleSelectorReturn {
  // States
  vehicles: VehicleData[];
  isOpen: boolean;
  showFullSelector: boolean;
  isLoadingVehicles: boolean;
  loadingSwap: boolean;
  confirmModalOpen: boolean;
  pendingVehicleId: string | null;
  selectorOptions: VehicleData[];

  // Actions
  openSelector: () => void;
  closeSelector: () => void;
  setShowFullSelector: (show: boolean) => void;
  handleVehicleSelect: (id: string) => void;
  handleSwapConfirm: (decision: boolean) => void;
  getVehiclesData: () => Promise<void>;
  getVehicleLabel: (v: VehicleData) => string;
}

export function useVehicleSelector({
  vehicleAsigned,
  clientIsSold,
  customerId,
  userId,
  onChangeSuccess,
  onSelect,
}: UseVehicleSelectorProps): UseVehicleSelectorReturn {
  const { data: session } = useSession();
  const userIdAuth = session?.user.id;

  // ----- States -----
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showFullSelector, setShowFullSelector] = useState(false);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [loadingSwap, setLoadingSwap] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingVehicleId, setPendingVehicleId] = useState<string | null>(null);

  const setMessage = messagesStore(store => store.setMessages);

  // ----- Computed -----
  const selectorOptions = vehicleAsigned
    ? [vehicleAsigned, ...(vehicles?.filter(v => v.id !== vehicleAsigned.id) || [])]
    : vehicles || [];

  // ----- Actions -----
  const getVehiclesData = useCallback(async () => {
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
      console.error('Error fetching vehicles:', error);
    } finally {
      setIsLoadingVehicles(false);
    }
  }, []);

  const openSelector = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSelector = useCallback(() => {
    setIsOpen(false);
    setShowFullSelector(false);
  }, []);

  const getVehicleLabel = useCallback((v: VehicleData) => {
    const brand = v.vehicle_brands?.brand || '';
    const model = v.vehicle_models?.model || '';
    const year = v.vehicle_manufacture_years?.year || '';
    return `${year} ${brand} ${model}`;
  }, []);

  const handleSwapSoldVehicle = useCallback(
    async (overrideId?: string) => {
      const targetId = overrideId || pendingVehicleId;
      const currentUserId = userId || userIdAuth;

      if (!targetId || !customerId || !currentUserId) return;

      setLoadingSwap(true);
      try {
        const response = await fetch('/api/inventory/swapSoldVehicle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId,
            oldVehicleId: vehicleAsigned?.id,
            newVehicleId: targetId,
            userId: currentUserId,
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
          onChangeSuccess?.(targetId, updatedVehicle);
          closeSelector();
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
    },
    [
      pendingVehicleId,
      customerId,
      userId,
      vehicleAsigned,
      selectorOptions,
      onChangeSuccess,
      closeSelector,
      getVehiclesData,
      setMessage,
    ],
  );

  const handleVehicleSelect = useCallback(
    (id: string) => {
      if (vehicleAsigned && id === vehicleAsigned.id.toString()) return;

      if (clientIsSold) {
        setPendingVehicleId(id);
        setConfirmModalOpen(true);
        setShowFullSelector(false);
        setIsOpen(false);
        return;
      }

      const selectedVehicle = selectorOptions.find(v => v.id.toString() === id);
      onSelect?.(id, selectedVehicle);
      closeSelector();
    },
    [vehicleAsigned, clientIsSold, selectorOptions, onSelect, closeSelector],
  );

  const handleSwapConfirm = useCallback(
    (decision: boolean) => {
      if (decision && pendingVehicleId) {
        handleSwapSoldVehicle();
      } else {
        setPendingVehicleId(null);
        setConfirmModalOpen(false);
      }
    },
    [pendingVehicleId, handleSwapSoldVehicle],
  );

  return {
    vehicles,
    isOpen,
    showFullSelector,
    isLoadingVehicles,
    loadingSwap,
    confirmModalOpen,
    pendingVehicleId,
    selectorOptions,
    openSelector,
    closeSelector,
    setShowFullSelector,
    handleVehicleSelect,
    handleSwapConfirm,
    getVehiclesData,
    getVehicleLabel,
  };
}
