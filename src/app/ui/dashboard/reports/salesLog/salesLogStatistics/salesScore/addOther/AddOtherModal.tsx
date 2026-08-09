'use client';

import { useEffect, useState } from 'react';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '&/inputs/Input';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { adminDashboardStore, messagesStore } from '@/store/adminDashboard';
import { AdderSelect } from '@/app/ui/select/adderSelect/AdderSelect';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';

export function AddOtherModal({ onClose, onSave }: { onClose: () => void, onSave: () => void }) {
  const { sellersData } = adminDashboardStore();
  const { getSellers } = adminDashboardStore();
  const { setMessages } = messagesStore();
  const { formatPhoneNumber, extractDigits } = phoneNumbersFormatStore();

  const [loadingSave, setLoadingSave] = useState(false);
  const [vehicle, setVehicle] = useState({
    vehicle_year: '',
    vehicle_make: '',
    vehicle_model: '',
    stock_no: '',
    vin: '',
  });

  const [customer, setCustomer] = useState({
    customer_firstname: '',
    customer_lastname: '',
    phone_number: '',
    email: '',
  });

  const [seller, setSeller] = useState<{ id: number | null; name: string }>({
    id: null,
    name: '',
  });

  const [fieldError, setFieldError] = useState<any>(null);

  useEffect(() => {
    getSellers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone_number') {
      const newValue = extractDigits(value);
      setCustomer(prev => ({ ...prev, [name]: newValue }));
      return;
    }
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const stile = {
    name: 'seller',
    value: seller,
    width: 25,
    optionsBackgroundColor: '#FFF',
    optionsHeight: 5,
    optionsNameColor: '#00A78B',
    optionsRadius: 0.2,
    optionsWidth: 2,
    optionsContainerHeight: 15,
  };

  const handleSave = async () => {
    try {
      setLoadingSave(true);
      const formData = new FormData();

      formData.append('customer_firstname', customer.customer_firstname);
      formData.append('customer_lastname', customer.customer_lastname);
      formData.append('phone_number', customer.phone_number);
      // formData.append('customer_email', customer.email);
      if (seller.id) formData.append('seller_id', seller.id.toString());
      formData.append('vehicle_year', vehicle.vehicle_year);
      formData.append('vehicle_make', vehicle.vehicle_make);
      formData.append('vehicle_model', vehicle.vehicle_model);
      formData.append('stock_no', vehicle.stock_no);
      formData.append('vin', vehicle.vin);

      const response = await fetch('/api/reports/salesLog/sales-score/add-other', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.successMessage) {
        setMessages(undefined, data.successMessage);
        onClose();
        setLoadingSave(true);
        onSave();
        return;
      }

      if (data.serverError) {
        setMessages(data.serverError);
      }

      if (data.fieldErrors) {
        console.log('fieldError: ', data.fieldErrors);
        setMessages('Error in the form fields');
        setFieldError(data.fieldErrors);
      }
      setLoadingSave(false);
    } catch (error) {
      console.log(error);
      setMessages('Error');
      setLoadingSave(false);
    }
  };

  return (
    <ModalWindow top={0} zIndex={60}>
      <ModalContainer marginTop={15} width={50}>
        <ModalContainerTitle title="Add Vehicle" closeWindowFunction={onClose} />
        <ModalContent loading={loadingSave}>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Customer First Name"
              name="customer_firstname"
              type="text"
              value={customer.customer_firstname}
              onChange={handleCustomerInputChange}
              width={0}
              widthFull
              fieldErrors={fieldError}
            />
            <Input
              label="Customer Last Name"
              name="customer_lastname"
              type="text"
              value={customer.customer_lastname}
              onChange={handleCustomerInputChange}
              width={0}
              widthFull
              fieldErrors={fieldError}
            />
            <Input
              label="Customer Phone Number"
              name="phone_number"
              type="text"
              placeholder="(XXX) XXX-XXXX"
              value={formatPhoneNumber(customer.phone_number)}
              onChange={handleCustomerInputChange}
              width={0}
              widthFull
              fieldErrors={fieldError}
            />
            <AdderSelect
              key={`2`}
              label={'Seller'}
              name={'seller_id'}
              value={seller.name}
              width={0}
              widthFull
              onChange={e => {
                const { name, value } = e.currentTarget;
                setSeller({
                  ...seller,
                  name: value,
                });
              }}
              options={sellersData?.map(el => {
                return { value: el.id.toString(), name: `${el.name} ${el.last_name}`, identity: 'seller' };
              })}
              iconTextGap={0}
              onClick={e => {
                const { name, value } = e.currentTarget;
                setSeller({
                  id: parseInt(value),
                  name: name,
                });
              }}
              optionsBackgroundColor="#FFF"
              optionsHeight={5}
              optionsNameColor="#00A78B"
              optionsRadius={0.2}
              optionsWidth={17.5}
              optionsContainerHeight={15}
              fieldErrors={fieldError}
            />
          </div>
          <div className="mt-[5vh]">
            <span className="font-semibold text-[2vh] text-gray-500">Vehicle Details</span>
            <div className="grid mt-[1vh] grid-cols-3 gap-4">
              <Input
                label="Year"
                name="vehicle_year"
                type="text"
                value={vehicle.vehicle_year}
                onChange={handleChange}
                width={0}
                widthFull
                fieldErrors={fieldError}
              />
              <Input
                label="Brand"
                name="vehicle_make"
                type="text"
                value={vehicle.vehicle_make}
                onChange={handleChange}
                width={0}
                widthFull
                fieldErrors={fieldError}
              />
              <Input
                label="Model"
                name="vehicle_model"
                type="text"
                value={vehicle.vehicle_model}
                onChange={handleChange}
                width={0}
                widthFull
                fieldErrors={fieldError}
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
          </div>
          <ButtonContainer marginTop={6} widthFull justify="right">
            <Button
              backgroundColor="#00A78B"
              identity="save-vehicle"
              textColor="#FFF"
              buttonText="Save"
              onClick={handleSave}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
