import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '&/inputs/Input';
import { keyInfoSchema } from '@/app/ui/dashboard/cards/inventory/details/keyInfo/keyInfoSchema';
import { inventoryStore, messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { ZodError } from 'zod';
import {
  addVehicleStore,
  clearAllInventorySystemFieldsStore,
  detailGeneralInfoStore,
  detailsInventorySystemIndexStore,
  detailTitleLicenseStore,
  editVehicleStore,
  inventorySystemIndexStore,
  userActionStore,
  vehiclesDataStore,
} from '@/store/inventory';

export function KeyInfo() {
  // ----- global states -----

  const { closeInventorySystem } = modalWindowStore();

  const { paymentMethod } = inventoryStore();
  const { getPaymentMethod } = inventoryStore();

  const { vehicleAdded } = addVehicleStore();
  const { generalInfo } = detailGeneralInfoStore();
  const { titleLicense } = detailTitleLicenseStore();

  const { setDetailsIndex } = detailsInventorySystemIndexStore();

  const { setIndex } = inventorySystemIndexStore();

  const { vehicleData } = editVehicleStore();
  const { getVehicleData } = editVehicleStore();

  const { getVehiclesData } = vehiclesDataStore();

  const { setMessages } = messagesStore();

  const { clearAllFields } = clearAllInventorySystemFieldsStore();

  const { setAddNewVehicle } = userActionStore();

  useEffect(() => {
    getPaymentMethod();
  }, [getPaymentMethod]);

  // ----- local states -----

  const [inputs, setInputs] = useState<{
    decalNo: string;
    ignitionCode: string;
    doorKeyCode: string;
    valetKeyCode: string;
    duplicateKey: string;
    lienholder: string;
    lienAccountNo: string;
    payoffAmount: string;
    dueDate: string;
    datePaidOff: string;
    paymentMethod: string;
    perDiem: string;
    memo: string;
  }>({
    decalNo: '',
    ignitionCode: '',
    doorKeyCode: '',
    valetKeyCode: '',
    duplicateKey: '1',
    lienholder: '',
    lienAccountNo: '',
    payoffAmount: '',
    dueDate: '',
    datePaidOff: '',
    paymentMethod: '1',
    perDiem: '',
    memo: '',
  });

  useEffect(() => {
    if (vehicleData && vehicleData.id) {
      setInputs({
        decalNo: vehicleData.key_info?.decal_no || '',
        ignitionCode: vehicleData.key_info?.ignition_code || '',
        doorKeyCode: vehicleData.key_info?.door_key_code || '',
        valetKeyCode: vehicleData.key_info?.valet_key_code || '',
        duplicateKey: vehicleData.key_info?.duplicate_key ? '1' : '2',
        lienholder: vehicleData.key_info?.lienholder || '',
        lienAccountNo: vehicleData.key_info?.lien_account_no || '',
        payoffAmount: vehicleData.key_info?.payoff_amount || '',
        dueDate: vehicleData.key_info?.due_date?.toLocaleString().split('T')[0] || '',
        datePaidOff: vehicleData.key_info?.date_paid_off?.toLocaleString().split('T')[0] || '',
        paymentMethod: vehicleData.key_info?.payment_method_id?.toString() || '',
        perDiem: vehicleData.key_info?.per_diem || '',
        memo: vehicleData.key_info?.memo || '',
      });
    }
  }, [vehicleData]);

  const [fieldErrors, setFieldErrors] = useState<{
    decalNo: [string | undefined];
    ignitionCode: [string | undefined];
    doorKeyCode: [string | undefined];
    valetKeyCode: [string | undefined];
    duplicateKey: [string | undefined];
    lienholder: [string | undefined];
    lienAccountNo: [string | undefined];
    payoffAmount: [string | undefined];
    dueDate: [string | undefined];
    datePaidOff: [string | undefined];
    paymentMethod: [string | undefined];
    perDiem: [string | undefined];
    memo: [string | undefined];
  }>({
    decalNo: [''],
    ignitionCode: [''],
    doorKeyCode: [''],
    valetKeyCode: [''],
    duplicateKey: [''],
    lienholder: [''],
    lienAccountNo: [''],
    payoffAmount: [''],
    dueDate: [''],
    datePaidOff: [''],
    paymentMethod: [''],
    perDiem: [''],
    memo: [''],
  });

  // handling changing inputs

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handling buttons

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'saveAndClose') {
      try {
        keyInfoSchema.parse(inputs);

        const formData = new FormData();

        formData.append('entryStock', new Date().toISOString());

        for (const [name, value] of Object.entries(inputs)) {
          formData.append(name, value);
        }

        for (const [name, value] of Object.entries(vehicleAdded)) {
          value && formData.append(name, value);
        }

        for (const [name, value] of Object.entries(generalInfo)) {
          formData.append(name, value);
        }

        for (const [name, value] of Object.entries(titleLicense)) {
          formData.append(name, value);
        }

        const res = await (
          await fetch('/api/inventory/vehicle', { method: 'POST', body: formData })
        ).json();

        if (res.successMessage) {
          vehicleData?.id && getVehicleData(vehicleData.id.toString());
          getVehiclesData();
          setMessages(undefined, res.successMessage);

          setAddNewVehicle(false);

          setDetailsIndex(1);
          setIndex(1);

          clearAllFields();

          closeInventorySystem();
        }

        if (res.serverError) {
          setMessages(res.serverError);
        }

        if (res.fieldErrors) {
          setMessages('Check Inputs');
        }
      } catch (error) {
        if (error instanceof ZodError) {
          const newErrors: typeof fieldErrors = {
            decalNo: [''],
            ignitionCode: [''],
            doorKeyCode: [''],
            valetKeyCode: [''],
            duplicateKey: [''],
            lienholder: [''],
            lienAccountNo: [''],
            payoffAmount: [''],
            dueDate: [''],
            datePaidOff: [''],
            paymentMethod: [''],
            perDiem: [''],
            memo: [''],
          };

          error.errors.forEach((error) => {
            const fieldName = error.path[0] as keyof typeof newErrors;

            newErrors[fieldName] = [error.message];
          });

          setFieldErrors(newErrors);
        }
      }
    }

    if (identity === 'save') {
      try {
        const formData = new FormData();

        for (const [name, value] of Object.entries(inputs)) {
          formData.append(name, value);
        }

        const res = await (
          await fetch(`/api/inventory/keyInfo/${vehicleData?.id}`, {
            method: 'PUT',
            body: formData,
          })
        ).json();

        if (res.successMessage) {
          setMessages(undefined, res.successMessage);
        }

        if (res.serverError) {
          setMessages(res.serverError);
        }

        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
      } catch (error) {
        setMessages('An error occurred');
      }
    }

    if (identity === 'prevPage') {
      setDetailsIndex(2);
    }
  };

  // handling inputs info

  const inputsInfo1 = [
    {
      key: 1,
      label: 'Decal No',
      value: inputs.decalNo,
      name: 'decalNo',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 2,
      label: 'Ignition Code',
      value: inputs.ignitionCode,
      name: 'ignitionCode',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 3,
      label: 'Door Key Code',
      value: inputs.doorKeyCode,
      name: 'doorKeyCode',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 4,
      label: 'Valet Key Code',
      value: inputs.valetKeyCode,
      name: 'valetKeyCode',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 5,
      label: 'Duplicate Key',
      value: inputs.duplicateKey,
      name: 'duplicateKey',
      width: 21.71875,
      type: 'select',
      options: [
        { value: 1, option: 'Yes' },
        { value: 2, option: 'No' },
      ],
      onChange: handleChange,
      colSpan: 2,
    },
  ];

  const inputsInfo2 = [
    {
      key: 1,
      label: 'Lienholder',
      value: inputs.lienholder,
      name: 'lienholder',
      width: 21.71875,
      type: 'text',
      onChange: handleChange,
      colSpan: 2,
    },
    {
      key: 2,
      label: 'Lien Account No.',
      value: inputs.lienAccountNo,
      name: 'lienAccountNo',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 3,
      label: 'Payoff Amount',
      value: inputs.payoffAmount,
      name: 'payoffAmount',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 4,
      label: 'Due Date',
      value: inputs.dueDate,
      name: 'dueDate',
      width: 10.208333,
      type: 'date',
      onChange: handleChange,
    },
    {
      key: 5,
      label: 'Date Paid Off',
      value: inputs.datePaidOff,
      name: 'datePaidOff',
      width: 10.208333,
      type: 'date',
      onChange: handleChange,
    },
    {
      key: 6,
      label: 'Payment Method',
      value: inputs.paymentMethod,
      name: 'paymentMethod',
      width: 10.208333,
      type: 'select',
      options: paymentMethod?.map((el) => {
        return { value: el.id, option: el.method };
      }),
      onChange: handleChange,
    },
    {
      key: 7,
      label: 'Per Diem',
      value: inputs.perDiem,
      name: 'perDiem',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 8,
      label: 'Memo',
      value: inputs.memo,
      name: 'memo',
      width: 44.166667,
      type: 'text',
      onChange: handleChange,
      colSpan: 4,
    },
  ];

  return (
    <ModalContent>
      <ContentRow cols={2} gap={3} centerContent alignItems="center">
        <BorderedContent width={27} title="Key Info">
          <ContentRow cols={2} gap={2} centerContent>
            {inputsInfo1.map((el) => (
              <ButtonContainer key={el.key} marginTop={0} gap={0.520833} colSpan={el.colSpan}>
                <Input
                  label={el.label}
                  name={el.name}
                  value={el.value}
                  width={el.width}
                  type={el.type}
                  options={el.options}
                  onChange={el.onChange}
                  fieldErrors={fieldErrors}
                />
              </ButtonContainer>
            ))}
          </ContentRow>
        </BorderedContent>
        <BorderedContent title="Lienholder" width={50}>
          <ContentRow cols={4} gap={2} centerContent>
            {inputsInfo2.map((el) => (
              <ButtonContainer key={el.key} marginTop={0} gap={0.520833} colSpan={el.colSpan}>
                <Input
                  label={el.label}
                  name={el.name}
                  value={el.value}
                  width={el.width}
                  type={el.type}
                  options={el.options}
                  onChange={el.onChange}
                  fieldErrors={fieldErrors}
                />
              </ButtonContainer>
            ))}
          </ContentRow>
        </BorderedContent>
      </ContentRow>
      <ButtonContainer marginTop={3} widthFull justify="right" gap={1}>
        <Button
          backgroundColor="#3e64e7"
          identity="prevPage"
          onClick={handleButton}
          textColor="#FFF"
          width={8}
          buttonText="Prev page"
        />
        <Button
          backgroundColor="#00A78B"
          identity={`${vehicleData?.id ? 'save' : 'saveAndClose'}`}
          onClick={handleButton}
          textColor="#FFF"
          width={vehicleData?.id ? 8 : 20.9375}
          buttonText={`${vehicleData?.id ? 'Save' : 'Save and close'}`}
        />
      </ButtonContainer>
    </ModalContent>
  );
}
