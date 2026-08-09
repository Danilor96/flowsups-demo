import { Input } from '&/inputs/Input';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { CancelIcon, PlusIcon, TrashIcon } from '&/icons/Icons';
import { Button } from '&/buttons/Button';
import {
  adminDashboardStore,
  creditAppInputsStore,
  creditAppPaginationStore,
  messagesStore,
  modalWindowStore,
  numberFormatterStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { AddressInput } from '&/miscellaneous/addressInput/AddressInput';
import { addressHandlerStore } from '@/store/addressHandling';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { creditAppStore } from '@/store/creditApp';
import { ReferencesData } from '@/app/api/adminDashboard/creditApp/types';
import { useSocketStore } from '@/store/socketIo';

export function References() {
  // ----- global states -----

  const { creditAppReferenceRelationship, statesData } = adminDashboardStore();
  const { getCreditAppReferenceRelationship } = adminDashboardStore();

  const { updateDataWithSocket } = useSocketStore();

  const { extractDigits, formatPhoneNumber } = phoneNumbersFormatStore();

  const { numberFormatter } = numberFormatterStore();

  const { closeClientCreditApp } = modalWindowStore();

  const { resetCurrentPage, prevPage } = creditAppPaginationStore();

  const { clearCreditAppInputs, clearCreditAppStart } = creditAppInputsStore();

  const { creditApp, setCreditApp } = creditAppStore();

  const { setMessages } = messagesStore();

  const { singleCLientData } = singleCLientDataStore();

  const { handlingMainAddressInput, extractAddressOptionsFromMainAddress } = addressHandlerStore();

  useEffect(() => {
    getCreditAppReferenceRelationship().finally(() => setLoading(false));
  }, [getCreditAppReferenceRelationship]);

  useEffect(() => {
    const newFormData: any[] = [];

    creditApp.references.references?.forEach((el) => {
      newFormData.push({
        inputs: {
          id: el.id?.toString(),
          name: el.name,
          address: el.address,
          addressStreet: extractAddressOptionsFromMainAddress(el.address || '').street || '',
          addressCity: extractAddressOptionsFromMainAddress(el.address || '').city || '',
          addressState:
            extractAddressOptionsFromMainAddress(el.address || '', statesData).state || '',
          addressZip: extractAddressOptionsFromMainAddress(el.address || '').zip || '',
          addressCounty: extractAddressOptionsFromMainAddress(el.address || '').county || '',
          phoneNumber: el.phoneNumber,
          relationship: el.relationship?.toString(),
        },
        fieldErrors: {
          name: [''],
          address: [''],
          addressStreet: [''],
          addressCity: [''],
          addressState: [''],
          addressZip: [''],
          addresCounty: [''],
          phoneNumber: [''],
          relationship: [''],
        },
      });
    });

    if (newFormData.length === 0) {
      newFormData.push({
        inputs: {
          id: '',
          name: '',
          address: '',
          addressStreet: '',
          addressCity: '',
          addressState: '',
          addressZip: '',
          addressCounty: '',
          phoneNumber: '',
          relationship: '',
        },
        fieldErrors: {
          name: [''],
          address: [''],
          addressStreet: [''],
          addressCity: [''],
          addressState: [''],
          addressZip: [''],
          addresCounty: [''],
          phoneNumber: [''],
          relationship: [''],
        },
      });
    }

    setInputs({
      id: creditApp.references.id?.toString() || '',
      incomeAmount: creditApp.references.otherIncomeAmount || '',
      incomeSource: creditApp.references.otherIncomeSource || '',
    });

    setForms(newFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditApp]);

  // ----- local states -----

  const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  const [loading, setLoading] = useState(true);

  const [inputs, setInputs] = useState<{
    id: string;
    incomeAmount: string;
    incomeSource: string;
  }>({
    id: '',
    incomeAmount: '0',
    incomeSource: '0',
  });

  const [fieldErrors, setFieldErrors] = useState<{
    incomeAmount: [string];
    incomeSource: [string];
  }>({
    incomeAmount: [''],
    incomeSource: [''],
  });

  const [forms, setForms] = useState<any[]>([
    {
      inputs: {
        id: '',
        name: '',
        address: '',
        addressStreet: '',
        addressCity: '',
        addressState: '',
        addressZip: '',
        addressCounty: '',
        phoneNumber: '',
        relationship: '1',
      },
      fieldErrors: {
        name: [''],
        address: [''],
        addressStreet: [''],
        addressCity: [''],
        addressState: [''],
        addressZip: [''],
        addresCounty: [''],
        phoneNumber: [''],
        relationship: [''],
      },
    },
  ]);

  // handling change events

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    const numberFormat = numberFormatter(value);

    setInputs((prevState) => ({
      ...prevState,
      [name]: numberFormat,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    const { index } = e.currentTarget.dataset;

    if (index && index !== null) {
      const formIndex = parseInt(index);

      setForms((prevForms) => {
        const newForms = [...prevForms];

        let updatedInputs;

        if (name === 'phoneNumber') {
          updatedInputs = {
            ...newForms[formIndex].inputs,
            [name]: extractDigits(value),
          };
        } else {
          updatedInputs = {
            ...newForms[formIndex].inputs,
            [name]: value,
          };
        }

        newForms[formIndex] = {
          ...newForms[formIndex],
          inputs: updatedInputs,
        };

        return newForms;
      });
    }
  };

  const handleChangeCurrentAddress = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
  ) => {
    const { name, value } = e.currentTarget;

    if (index || index === 0) {
      setForms((prevForms) => {
        const newForms = [...prevForms];

        const addressInputs = [
          'addressStreet',
          'addressCity',
          'addressState',
          'addressZip',
          'addressCounty',
          'address',
        ];

        let updatedInputs;

        updatedInputs = {
          ...newForms[index].inputs,
          [name]: value,
        };

        if (addressInputs.includes(name)) {
          if (name === 'address') {
            updatedInputs.addressStreet = handlingMainAddressInput(
              updatedInputs.address,
            ).street.trim();
            updatedInputs.addressCity = handlingMainAddressInput(updatedInputs.address).city.trim();
            updatedInputs.addressState = handlingMainAddressInput(updatedInputs.address).stateId;
            updatedInputs.addressZip = handlingMainAddressInput(updatedInputs.address).zip.trim();
            updatedInputs.addressCounty = handlingMainAddressInput(
              updatedInputs.address,
            ).county.trim();
          } else {
            updatedInputs.address = `${
              updatedInputs.addressStreet ? `${updatedInputs.addressStreet}, ` : ''
            }${updatedInputs.addressCity ? `${updatedInputs.addressCity}` : ''}${
              updatedInputs.addressState
                ? `, ${
                    statesData?.find((state) => state.id === parseInt(updatedInputs.addressState))
                      ?.state || ''
                  }`
                : ''
            }${updatedInputs.addressZip ? `, ${updatedInputs.addressZip}` : ''}${
              updatedInputs.addressCounty ? `, ${updatedInputs.addressCounty}` : ''
            }`;
          }
        }

        newForms[index] = {
          ...newForms[index],
          inputs: updatedInputs,
        };

        return newForms;
      });
    }
  };

  // handling buttons events

  const finishCreditApp = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/adminDashboard/creditApp/finish/${singleCLientData?.id}`, {
        method: 'POST',
      });

      const json = await res.json();

      if (json.successMessage) {
        setMessages(undefined, json.successMessage);
      }

      if (json.serverError) {
        setMessages(json.serverError);
      }
    } catch (error) {
      setMessages('An error occurred');
    }

    setLoading(false);
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'addNewForm') {
      setForms((prevForms) => [
        ...prevForms,
        { inputs: { ...inputs, relationship: '1' }, fieldErrors: fieldErrors },
      ]);
    }

    if (identity === 'deleteForm') {
      setShowDeleteBtn(!showDeleteBtn);
    }

    if (identity === 'doDelete') {
      setForms((prevForms) => prevForms.filter((_, index) => index !== parseInt(value)));
    }

    if (identity === 'finish') {
      await finishCreditApp();

      resetCurrentPage();
      clearCreditAppInputs();
      clearCreditAppStart();
      closeClientCreditApp();
    }
    if (identity === 'prev') {
      prevPage();
    }

    if (identity === 'save') {
      setLoading(true);

      try {
        const formData = new FormData();

        formData.append('incomeAmount', inputs.incomeAmount);

        formData.append('incomeSource', inputs.incomeSource);

        formData.append('otherIncomeId', inputs.id);

        let arrayFormData: any[] = [];

        for (const el of forms) {
          arrayFormData.push(el.inputs);
        }

        formData.append('references', JSON.stringify(arrayFormData));

        formData.append('modifiedDate', new Date().toISOString());

        const res = await (
          await fetch(`/api/adminDashboard/creditApp/references/${singleCLientData?.id}`, {
            method: 'POST',
            body: formData,
          })
        ).json();

        if (res.successMessage) {
          setMessages(undefined, res.successMessage);

          setForms((prevState) => {
            const newState = [...prevState];

            for (let i = 0; i < newState.length; i++) {
              const form = newState[i];

              form.fieldErrors.name = [''];
              form.fieldErrors.address = [''];
              form.fieldErrors.addressStreet = [''];
              form.fieldErrors.addressCity = [''];
              form.fieldErrors.addressState = [''];
              form.fieldErrors.addressZip = [''];
              form.fieldErrors.addresCounty = [''];
              form.fieldErrors.phoneNumber = [''];
              form.fieldErrors.relationship = [''];
            }

            return newState;
          });

          const returnedData: ReferencesData = res.data;

          const newState = { ...creditApp, references: returnedData };

          setCreditApp(newState);

          updateDataWithSocket('creditApp', undefined, {
            employmentStatus: '1',
            customerId: singleCLientData?.id,
          });

          updateDataWithSocket('dailyTotals');
        }

        if (res.serverError) {
          setMessages(res.serverError);
        }

        if (res.fieldErrors) {
          setForms((prevState) => {
            const newState = [...prevState];

            for (let i = 0; i < newState.length; i++) {
              const form = newState[i];

              form.fieldErrors.name = [''];
              form.fieldErrors.address = [''];
              form.fieldErrors.addressStreet = [''];
              form.fieldErrors.addressCity = [''];
              form.fieldErrors.addressState = [''];
              form.fieldErrors.addressZip = [''];
              form.fieldErrors.addresCounty = [''];
              form.fieldErrors.phoneNumber = [''];
              form.fieldErrors.relationship = [''];

              for (const [key, val] of Object.entries(res.fieldErrors)) {
                const keySplitted = key.split('.');

                if (keySplitted.includes(`${i}`)) {
                  form.fieldErrors[keySplitted[keySplitted.length - 1]] = [val];
                }
              }
            }

            return newState;
          });
        }
      } catch (error) {
        setMessages('An error occurred');
      }

      setLoading(false);
    }
  };

  // handling inputs data

  const inputData1 = [
    {
      id: 1,
      label: 'Other Income Amount',
      name: 'incomeAmount',
      value: inputs.incomeAmount,
      type: 'text',
      width: 18,
      onChange: handleIncomeChange,
    },
    {
      id: 2,
      label: 'Other Income Source',
      name: 'incomeSource',
      value: inputs.incomeSource,
      type: 'text',
      width: 18,
      onChange: handleIncomeChange,
    },
  ];

  const inputdata2 = [
    {
      id: 3,
      label: 'Name',
      name: 'name',
      type: 'text',
      width: 20.9375,
      onChange: handleChange,
    },
    {
      id: 4,
      width: 25,
      label: 'Address',
      name: 'address',
      type: 'dottedInput',
      onChange: handleChange,
      optionsColumns: 3,
    },
    {
      id: 10,
      label: 'Phone number',
      name: 'phoneNumber',
      type: 'text',
      width: 13.541667,
      onChange: handleChange,
    },
    {
      id: 11,
      label: 'Relationship',
      name: 'relationship',
      type: 'select',
      width: 10.104166,
      options: creditAppReferenceRelationship?.map((el) => {
        return { value: el.id, option: el.relationship };
      }),
      onChange: handleChange,
    },
  ];

  // handling buttons info

  const buttonData1 = [
    {
      id: 12,
      backgroundColor: '#FFF',
      identity: 'addNewForm',
      textColor: '#00A78B',
      buttonText: 'Add More',
      iconTextGap: 1,
      border: 0.104167,
      width: 9,
      buttonTextSize: 2,
      buttonIcon: <PlusIcon />,
      borderColor: '#00A78B',
      onClick: handleButton,
    },
    {
      id: 13,
      backgroundColor: '#FFF',
      identity: 'deleteForm',
      textColor: '#00A78B',
      buttonText: 'Delete',
      iconTextGap: 1,
      border: 0.104167,
      width: 9,
      buttonTextSize: 2,
      buttonIcon: <TrashIcon />,
      borderColor: '#00A78B',
      onClick: handleButton,
    },
  ];

  const buttonData2 = [
    {
      id: 14,
      backgroundColor: '#00A78B',
      identity: 'prev',
      textColor: '#FFF',
      buttonText: 'Prev',
      width: 9,
      buttonTextSize: 2,
      onClick: handleButton,
    },
    {
      id: 15,
      backgroundColor: '#FFF',
      identity: 'save',
      textColor: '#00A78B',
      buttonText: 'Save',
      border: 0.104167,
      width: 9,
      buttonTextSize: 2,
      borderColor: '#00A78B',
      onClick: handleButton,
    },
    {
      id: 16,
      backgroundColor: '#00A78B',
      identity: 'finish',
      textColor: '#FFF',
      buttonText: 'Finish',
      width: 9,
      buttonTextSize: 2,
      onClick: handleButton,
    },
  ];

  return (
    <ModalContent overflowVisible minHeight={58}>
      <ContentRow cols={2} gap={3}>
        {inputData1.map((el) => (
          <Input
            key={`${el.id * 31}references1`}
            label={el.label}
            name={el.name}
            type={el.type}
            width={el.width}
            value={el.value}
            isLoading={loading}
            disabled={loading}
            onChange={el.onChange}
          />
        ))}
      </ContentRow>
      <BorderedContent marginTop={3} title="References" overflowVisible>
        {forms.map((form, index) => (
          <ContentRow
            key={`${index}references2`}
            cols={4}
            gap={2}
            marginTop={index !== 0 ? 4 : 0}
            positionRelative
          >
            {showDeleteBtn && index !== 0 && (
              <Button
                backgroundColor="#FFF1"
                identity="doDelete"
                textColor=""
                onClick={handleButton}
                buttonIcon={<CancelIcon />}
                positionAbsolute
                right={-3}
                top={4}
                value={index}
                widthFitContent
                disabled={loading}
                heightFitContent
              />
            )}
            {inputdata2.map((el) =>
              el.type !== 'dottedInput' ? (
                <Input
                  key={`${el.id + 102}references3`}
                  label={el.label}
                  name={el.name}
                  type={el.type}
                  width={el.width}
                  options={el.options}
                  index={index}
                  isLoading={loading}
                  disabled={loading}
                  fieldErrors={form.fieldErrors}
                  value={
                    el.name === 'phoneNumber'
                      ? formatPhoneNumber(form.inputs[el.name])
                      : form.inputs[el.name]
                  }
                  onChange={el.onChange}
                />
              ) : (
                el.optionsColumns && (
                  <aside key={`adressss${index + 78}references4`} className="relative">
                    <AddressInput
                      width={25}
                      dontGetStates={true}
                      mainInput={{
                        label: 'Address',
                        id: 'address',
                        name: 'address',
                        value: form.inputs.address,
                        onChange: (e) => handleChangeCurrentAddress(e, index),
                      }}
                      isLoading={loading}
                      disabled={loading}
                      addressOptions={{
                        street: form.inputs.addressStreet,
                        streetName: 'addressStreet',
                        city: form.inputs.addressCity,
                        cityName: 'addressCity',
                        state: form.inputs.addressState,
                        stateName: 'addressState',
                        county: form.inputs.addressCounty,
                        countyName: 'addressCounty',
                        zip: form.inputs.addressZip,
                        zipName: 'addressZip',
                        handleChange: (e) => handleChangeCurrentAddress(e, index),
                      }}
                    />
                    {<FieldErrorMessage name="address" fieldErrors={form.fieldErrors} />}
                  </aside>
                )
              ),
            )}
          </ContentRow>
        ))}
      </BorderedContent>
      <ButtonContainer marginTop={3} gap={1.5}>
        {buttonData1.map((el) => (
          <Button
            key={`${el.id * 77}references5`}
            backgroundColor={el.backgroundColor}
            identity={el.identity}
            textColor={el.textColor}
            buttonText={el.buttonText}
            iconTextGap={el.iconTextGap}
            border={el.border}
            width={el.width}
            disabled={loading}
            buttonTextSize={el.buttonTextSize}
            buttonIcon={el.buttonIcon}
            borderColor={el.borderColor}
            onClick={el.onClick}
          />
        ))}
      </ButtonContainer>
      <ButtonContainer marginTop={3} gap={1} widthFull justify="right">
        {buttonData2.map((el) => (
          <Button
            key={`${el.id - 44}references6`}
            backgroundColor={el.backgroundColor}
            identity={el.identity}
            textColor={el.textColor}
            buttonText={el.buttonText}
            border={el.border}
            width={el.width}
            disabled={loading}
            buttonTextSize={el.buttonTextSize}
            borderColor={el.borderColor}
            onClick={el.onClick}
          />
        ))}
      </ButtonContainer>
    </ModalContent>
  );
}
