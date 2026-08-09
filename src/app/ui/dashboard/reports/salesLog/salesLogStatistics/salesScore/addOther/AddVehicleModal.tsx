'use client';

import { useState, useEffect } from 'react';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '&/inputs/Input';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { messagesStore, numberFormatterStore } from '@/store/adminDashboard';

interface Vehicle {
  id: number;
  year: string;
  brand: string;
  model: string;
  stock_no: string;
  vin: string;
}

export function AddOtherVehicleModal({
  onClose,
  onSave,
  vehicleId,
}: {
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
  vehicleId?: number;
}) {
  const { setMessages } = messagesStore();
  const numberFilter = numberFormatterStore((state) => state.numberFilter);
  const [vehicle, setVehicle] = useState<Omit<Vehicle, 'id'>>({
    year: '',
    brand: '',
    model: '',
    stock_no: '',
    vin: '',
  });
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<any>(null);

  useEffect(() => {
    if (vehicleId) {
      const fetchVehicle = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/adminDashboard/otherVehicle?id=${vehicleId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch vehicle');
          }
          const data = await response.json();
          setVehicle({
            year: data.year,
            brand: data.brand,
            model: data.model,
            stock_no: data.stock_no,
            vin: data.vin,
          });
        } catch (error) {
          console.error(error);
          setMessages('Failed to load vehicle details');
          onClose();
        } finally {
          setLoading(false);
        }
      };
      fetchVehicle();
    }
  }, [vehicleId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'vin' && value.length > 17) return;

    let val = value;

    if (name === 'year') val = numberFilter(value);

    setVehicle((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setFieldError(null);
    try {
      const isEditing = !!vehicleId;
      const method = isEditing ? 'PUT' : 'POST';
      const body: any = {
        year: vehicle.year,
        make: vehicle.brand,
        model: vehicle.model,
        stock_no: vehicle.stock_no,
        vin: vehicle.vin,
      };

      if (isEditing) {
        body.id = vehicleId;
      }

      const response = await fetch('/api/adminDashboard/otherVehicle', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fieldErrors) return setFieldError(data.fieldErrors);
        return setMessages(data.serverError || 'Something went wrong');
      }

      setMessages(
        undefined,
        isEditing ? 'Vehicle updated successfully' : 'Vehicle added successfully',
      );
      onSave({
        id: data.id,
        ...vehicle,
      });
      onClose();
    } catch (error) {
      console.error(error);
      setMessages('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWindow top={0} zIndex={60}>
      <ModalContainer marginTop={15} width={40}>
        <ModalContainerTitle
          title={vehicleId ? 'Edit Vehicle' : 'Add Vehicle'}
          closeWindowFunction={onClose}
        />
        <ModalContent loading={loading}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Year"
              name="year"
              type="text"
              value={vehicle.year}
              onChange={handleChange}
              width={0}
              widthFull
              fieldErrors={fieldError}
            />
            <Input
              label="Brand"
              name="brand"
              type="text"
              value={vehicle.brand}
              onChange={handleChange}
              width={0}
              widthFull
              fieldErrors={fieldError}
              capitalString
            />
            <Input
              label="Model"
              name="model"
              type="text"
              value={vehicle.model}
              onChange={handleChange}
              width={0}
              widthFull
              fieldErrors={fieldError}
              capitalString
            />
            <Input
              label="Stock Number"
              name="stock_no"
              type="text"
              value={vehicle.stock_no}
              onChange={handleChange}
              width={0}
              widthFull
              fieldErrors={fieldError}
            />
            <Input
              label="VIN"
              name="vin"
              type="text"
              value={vehicle.vin}
              onChange={handleChange}
              width={0}
              widthFull
              fieldErrors={fieldError}
            />
          </div>
          <ButtonContainer marginTop={6} widthFull justify="right">
            <Button
              backgroundColor="#00A78B"
              identity="save-vehicle"
              textColor="#FFF"
              buttonText={loading ? 'Saving...' : 'Save'}
              onClick={handleSubmit}
              disabled={loading}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
