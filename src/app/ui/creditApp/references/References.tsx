import { numberFormatterStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { Input } from '&/inputs/Input';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { Button } from '&/buttons/Button';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { CancelIcon, PlusIcon, TrashIcon } from '&/icons/Icons';
import { AddressInput } from '&/miscellaneous/addressInput/AddressInput';
import { addressHandlerStore } from '@/store/addressHandling';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { Loader } from '../../miscellaneous/loader/Loader';
import { publicCreditAppPageStore } from '@/store/creditApp';
import { ConfirmNotification } from '../../notifications/Notification';
import { CreditAppData } from '@/app/api/adminDashboard/creditApp/types';
import { useSocketStore } from '@/store/socketIo';

export function References({
  referencesRelationship,
  states,
  customerId,
  creditAppDefault,
}: {
  referencesRelationship?: {
    id: number;
    relationship: string;
  }[];
  states:
    | {
        id: number;
        state: string;
        state_code: string;
      }[]
    | undefined;
  customerId?: number;
  creditAppDefault: CreditAppData;
}) {
  // ----- global states -----

  const { setCurrentPage } = publicCreditAppPageStore();

  const { extractDigits, formatPhoneNumber } = phoneNumbersFormatStore();

  const { numberFormatter } = numberFormatterStore();

  const { handlingMainAddressInput, extractAddressOptionsFromMainAddress } = addressHandlerStore();

  const { updateDataWithSocket } = useSocketStore();

  // ----- local states -----

  useEffect(() => {
    const newFormData: any[] = [];

    setInputs({
      id: creditAppDefault.references.id?.toString() || '',
      incomeAmount: creditAppDefault.references.otherIncomeAmount || '',
      incomeSource: creditAppDefault.references.otherIncomeSource || '',
    });

    creditAppDefault.references.references?.forEach((el) => {
      newFormData.push({
        inputs: {
          id: el.id,
          name: el.name,
          address: el.address,
          addressStreet: extractAddressOptionsFromMainAddress(el.address || '').street || '',
          addressCity: extractAddressOptionsFromMainAddress(el.address || '').city || '',
          addressState: extractAddressOptionsFromMainAddress(el.address || '', states).state || '',
          addressZip: extractAddressOptionsFromMainAddress(el.address || '').zip || '',
          addressCounty: extractAddressOptionsFromMainAddress(el.address || '').county || '',
          phoneNumber: el.phoneNumber || '',
          relationship: el.relationship?.toString() || '',
        },
        fieldErrors: {
          name: [undefined],
          address: [undefined],
          addressStreet: [undefined],
          addressCity: [undefined],
          addressState: [undefined],
          addressZip: [undefined],
          addresCounty: [undefined],
          phoneNumber: [undefined],
          relationship: [undefined],
        },
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditAppDefault]);

  const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  const [inputs, setInputs] = useState({
    id: '',
    incomeAmount: '0',
    incomeSource: '0',
  });

  const [forms, setForms] = useState<
    {
      inputs: { [key: string]: string };
      fieldErrors: { [key: string]: [string | undefined] };
    }[]
  >([
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
        relationship: '',
      },
      fieldErrors: {
        name: [undefined],
        address: [undefined],
        addressStreet: [undefined],
        addressCity: [undefined],
        addressState: [undefined],
        addressZip: [undefined],
        addresCounty: [undefined],
        phoneNumber: [undefined],
        relationship: [undefined],
      },
    },
  ]);

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
                    states?.find((state) => state.id === parseInt(updatedInputs.addressState))
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

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'addNewForm') {
      setForms((prevState) => [
        ...prevState,
        {
          inputs: { ...inputs, relationship: '1' },
          fieldErrors: {
            name: [undefined],
            address: [undefined],
            addressStreet: [undefined],
            addressCity: [undefined],
            addressState: [undefined],
            addressZip: [undefined],
            addresCounty: [undefined],
            phoneNumber: [undefined],
            relationship: [undefined],
          },
        },
      ]);
    }

    if (identity === 'deleteForm') {
      setShowDeleteBtn(!showDeleteBtn);
    }

    if (identity === 'doDelete') {
      setForms((prevForms) => prevForms.filter((_, index) => index !== parseInt(value)));
    }

    if (identity === 'save') {
      setMessage('Are you sure you want to save and finish the process?');
    }
  };

  const inputData1 = [
    {
      id: 1,
      label: 'Other Income Amount (optional)',
      name: 'incomeAmount',
      value: inputs.incomeAmount,
      type: 'text',
      width: 0,
      onChange: handleIncomeChange,
    },
    {
      id: 2,
      label: 'Other Income Source (optional)',
      name: 'incomeSource',
      value: inputs.incomeSource,
      type: 'text',
      width: 0,
      onChange: handleIncomeChange,
    },
  ];

  const inputdata2 = [
    {
      id: 3,
      label: 'Name (optional)',
      name: 'name',
      type: 'text',
      width: 0,
      onChange: handleChange,
    },
    {
      id: 4,
      width: 0,
      label: 'Address (optional)',
      name: 'address',
      type: 'dottedInput',
      onChange: handleChange,
      optionsColumns: 3,
    },
    {
      id: 10,
      label: 'Phone number (optional)',
      name: 'phoneNumber',
      type: 'text',
      width: 0,
      onChange: handleChange,
    },
    {
      id: 11,
      label: 'Relationship (optional)',
      name: 'relationship',
      type: 'select',
      width: 0,
      options: referencesRelationship?.map((el) => {
        return { value: el.id, option: el.relationship };
      }),
      onChange: handleChange,
    },
  ];

  const [message, setMessage] = useState('');

  const handleDecision = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { yes, no } = e.currentTarget.dataset;

    if (yes) {
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

      const apiUrl = `/api/public/creditApp/references/${customerId}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        options: {
          onSuccess: () => {
            setCurrentPage(4);
          },
        },
      });

      if (fieldErrors) {
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

            for (const [key, val] of Object.entries(fieldErrors)) {
              const keySplitted = key.split('.');

              if (keySplitted.includes(`${i}`)) {
                form.fieldErrors[keySplitted[keySplitted.length - 1]] = val;
              }
            }
          }

          return newState;
        });
      }
    } else {
      setMessage('');
    }
  };

  return (
    <aside className="relative md:mt-[2rem] lg:w-[70vw] lg:mx-auto">
      {message && !loadingFetch && (
        <div className="absolute top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center px-[0.4rem]">
          <aside className="w-full sm:w-[60vw] md:w-[45vw] lg:w-fit h-fit flex flex-col justify-center items-center gap-[0.5rem] px-[0.2rem] py-[0.2rem] rounded-lg bg-white border border-primaryColor">
            <p className="w-full text-wrap text-sm text-gray-700 text-center">{message}</p>
            <aside className="flex flex-row gap-[1rem]">
              <button
                className="w-[4rem] px-[0.2rem] py-[0.2rem] bg-blue-500 text-white rounded-md"
                data-no={true}
                onClick={handleDecision}
              >
                No
              </button>
              <button
                className="w-[4rem] px-[0.2rem] py-[0.2rem] bg-red-500 text-white rounded-md"
                data-yes={true}
                onClick={handleDecision}
              >
                Yes
              </button>
            </aside>
          </aside>
        </div>
      )}
      <article className="px-[0.5rem] py-[0.5rem] flex flex-col gap-[1rem] md:grid md:grid-cols-3 md:gap-8 md:items-end">
        {inputData1.map((el) => (
          <Input
            key={`${el.id * 31}references1`}
            label={el.label}
            name={el.name}
            type={el.type}
            width={el.width}
            value={el.value}
            onChange={el.onChange}
          />
        ))}
        {forms.map((form, index) => (
          <aside
            key={`${index}references2`}
            className="relative md:col-span-3 md:w-[50vw] lg:grid lg:grid-cols-2 lg:gap-[1vw] md:mx-auto px-2 py-2 md:px-4 md:py-4 rounded-md shadow-crmFormShadow"
          >
            {showDeleteBtn && index !== 0 && (
              <button
                className="absolute top-[-0.2rem] right-0 z-10 w-[2rem] h-[2rem] flex justify-center items-center bg-white rounded-full"
                data-identity="doDelete"
                value={index}
                onClick={handleButton}
              >
                <CancelIcon color="#F00" mobile />
              </button>
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
                      width={0}
                      dontGetStates={true}
                      mainInput={{
                        label: 'Address (optional)',
                        id: 'address',
                        name: 'address',
                        value: form.inputs.address,
                        onChange: (e) => handleChangeCurrentAddress(e, index),
                      }}
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
                      manualStates={states}
                    />
                    {<FieldErrorMessage name="address" fieldErrors={form.fieldErrors} />}
                  </aside>
                )
              ),
            )}
          </aside>
        ))}
      </article>
      <article className="flex flex-row justify-center items-center gap-[0.5rem] py-[0.2rem] mt-[1rem] bg-white">
        <p className="text-blue-800 text-sm">Add More</p>
        <button
          className="w-[3rem] h-[3rem] flex justify-center items-center rounded-full bg-white border border-primaryColor hover:border-blue-800 transition-colors"
          data-identity="addNewForm"
          onClick={handleButton}
        >
          <PlusIcon mobile />
        </button>
        <button
          className="w-[3rem] h-[3rem] flex justify-center items-center rounded-full bg-white border border-primaryColor hover:border-red-600 transition-colors"
          data-identity="deleteForm"
          onClick={handleButton}
        >
          <TrashIcon mobile />
        </button>
        <p className="text-red-600 text-sm">Show Delete</p>
      </article>
      <article className="mt-[2vh] w-full px-[0.5rem] lg:px-[6vw] pb-[0.5rem] md:w-[50vw] md:mx-auto md:mt-[2.5vh] lg:w-[35vw]">
        <Button
          backgroundColor="#FFF"
          identity="save"
          textColor="#00a78b"
          buttonText={'Save and Finish'}
          border={0.05}
          width={0}
          borderColor="#00a78b"
          buttonTextSize={2}
          disabled={loadingFetch}
          onClick={handleButton}
        />
      </article>
      {loadingFetch && <Loader rounded="1.2rem" />}
    </aside>
  );
}
