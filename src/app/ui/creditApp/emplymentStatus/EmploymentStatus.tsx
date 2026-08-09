import { useEffect, useRef, useState } from 'react';
import { Input } from '&/inputs/Input';
import { AddressInput } from '&/miscellaneous/addressInput/AddressInput';
import { addressHandlerStore } from '@/store/addressHandling';
import { Button } from '&/buttons/Button';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { creditAppStore, publicCreditAppPageStore } from '@/store/creditApp';
import { CancelIcon, PlusIcon, TrashIcon } from '&/icons/Icons';
import { numberFormatterStore } from '@/store/adminDashboard';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { CreditAppData } from '@/app/api/adminDashboard/creditApp/types';
import { EmploymentStatus as EmploymentStatusData } from '@/app/api/adminDashboard/creditApp/types';
import { useSocketStore } from '@/store/socketIo';
import { ConfirmNotification } from '../../notifications/Notification';

export function EmploymentStatus({
  employmentStatus,
  occupation,
  creditAppMonhts,
  incomeType,
  states,
  customerId,
  creditAppDefault,
}: {
  employmentStatus?: {
    id: number;
    status: string;
  }[];
  occupation?: {
    id: number;
    occupation: string;
  }[];
  creditAppMonhts?: {
    id: number;
    month: string;
  }[];
  incomeType?: {
    id: number;
    income: string;
  }[];
  states?: {
    id: number;
    state: string;
    state_code: string;
  }[];
  customerId?: number;
  creditAppDefault: CreditAppData;
}) {
  // ----- global states -----

  const { handlingMainAddressInput, extractAddressOptionsFromMainAddress, addressRepeated } =
    addressHandlerStore();

  const { currentProgress } = publicCreditAppPageStore();

  const { setCurrentProgress, setCurrentPage } = publicCreditAppPageStore();

  const { numberFormatter } = numberFormatterStore();

  const { formatPhoneNumber, extractDigits } = phoneNumbersFormatStore();

  const { creditApp, setCreditApp } = creditAppStore();

  const { updateDataWithSocket } = useSocketStore();

  // ----- local states -----

  const [showDeleteButtons, setShowDeleteButtons] = useState(false);

  const [inputs, setInputs] = useState({
    id: '',
    addressId: '',
    currentEmployerName: '',
    address: '',
    addressStreet: '',
    addressCity: '',
    addressState: '',
    addressZip: '',
    addressCounty: '',
    phoneNumber: '',
    employmentStatus: '',
    occupation: '',
    year: '0',
    months: '',
    incomeType: '',
    monthlyIncome: '0',
    hourlyWage: '0',
    yearToDate: '0',
    hasBankAccount: '',
  });

  const [forms, setForms] = useState([{ inputs: inputs }]);

  const [nextToReferences, setNextToReferences] = useState(false);

  const [doUpdate, setDoUpdate] = useState(false);

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [warningMssg, setWarningMssg] = useState('');

  const inputEditedRef = useRef<NodeJS.Timeout | null>(null);

  const handleNextPage = () => {
    let next = false;

    let errorsObject: typeof fieldErrors = {};

    let totalYears = 0;
    let totalMonths = 0;

    let totalErrors = 0;

    const ignoreThisInputs = ['months', 'year', 'hourlyWage', 'yearToDate', 'hasBankAccount'];

    const addressInputs = [
      'address',
      'addressStreet',
      'addressCity',
      'addressState',
      'addressZip',
      'addressCounty',
    ];

    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];

      for (const [key, value] of Object.entries(form.inputs)) {
        if (!value) {
          if (!ignoreThisInputs.includes(key) && !addressInputs.includes(key)) {
            errorsObject = { ...errorsObject, [`${key}.${i}`]: ['Required'] };

            totalErrors += 1;
          }

          if (addressInputs.includes(key)) {
            errorsObject = {
              ...errorsObject,
              [`address.${i}`]: ['Required: *Street name *City *State *Zip number *County name'],
            };

            totalErrors += 1;
          }
        }

        if (value && key === 'phoneNumber') {
          if (value.length < 10) {
            errorsObject = { ...errorsObject, [`${key}.${i}`]: ['Invalid Format'] };

            totalErrors += 1;
          }
        }

        if (value && key === 'monthlyIncome') {
          if (value === '0') {
            errorsObject = { ...errorsObject, [`${key}.${i}`]: ['Must be great than 0'] };

            totalErrors += 1;
          }
        }

        if (key === 'year') {
          const numYear = parseInt(value);

          totalYears += numYear;
        }

        if (key === 'months') {
          if (value) {
            const monthSelected = creditAppMonhts?.find((el) => el.id === parseInt(value));

            if (monthSelected && monthSelected.month) {
              const [number, mths] = monthSelected.month?.split(' ');

              totalMonths += parseInt(number);
            }
          }
        }
      }

      if (i !== 0) {
        if (addressRepeated(forms[0].inputs.address, form.inputs.address)) {
          errorsObject = {
            ...errorsObject,
            [`address.${i}`]: ['The previous address must be different from the current address'],
          };

          totalErrors += 1;
        }
      }
    }

    const totalYearsAndMonths = totalYears + totalMonths / 12;
    const reachedTotalsYears = totalYearsAndMonths >= 2;

    if (!reachedTotalsYears) {
      errorsObject = { ...errorsObject, ['totalYears']: ['No 2 years mark reached'] };

      totalErrors += 1;
    }

    setManualFieldErrors(errorsObject);

    if (totalErrors === 0) next = true;

    setNextToReferences(next);

    return next;
  };

  const saveData = async () => {
    if (inputEditedRef.current) clearTimeout(inputEditedRef.current);

    inputEditedRef.current = setTimeout(async () => {
      const formData = new FormData();

      let arrayFormData: (typeof inputs)[] = [];

      for (const el of forms) {
        arrayFormData.push(el.inputs);
      }

      formData.append('employmentStatus', JSON.stringify(arrayFormData));

      formData.append('nextToReferences', `${handleNextPage()}`);

      const apiUrl = `/api/public/creditApp/employmentStatus/${customerId}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        options: {
          onSuccess: (data: EmploymentStatusData) => {
            setDoUpdate(false);

            const newState = { ...creditApp, employmentStatus: data };

            setCreditApp(newState);

            updateDataWithSocket('creditApp', undefined, {
              employmentStatus: '1',
              customerId: customerId,
            });
          },
        },
      });
    }, 1500);
  };

  useEffect(() => {
    if (forms && forms.length > 0) {
      const keysArray: { [key: string]: string }[] = [];

      for (let i = 0; i < forms.length; i++) {
        const form = forms[i];

        keysArray.push(form.inputs);
      }

      setCurrentProgress(inputs, ['id', 'addressId'], keysArray, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forms]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    const { index } = e.currentTarget.dataset;

    if (index && index !== null) {
      const formIndex = parseInt(index);

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

        if (name === 'year' || name === 'monthlyIncome') {
          updatedInputs = {
            ...newForms[formIndex].inputs,
            [name]: numberFormatter(value),
          };
        } else if (name === 'phoneNumber') {
          updatedInputs = {
            ...newForms[formIndex].inputs,
            [name]: extractDigits(value),
          };
        } else if (name === 'hasBankAccount' && formIndex === 0) {
          updatedInputs = {
            ...newForms[formIndex].inputs,
            hasBankAccount: value ? '' : '1',
          };
        } else {
          updatedInputs = {
            ...newForms[formIndex].inputs,
            [name]: value,
          };
        }

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

        newForms[formIndex] = {
          ...newForms[formIndex],
          inputs: updatedInputs,
        };

        return newForms;
      });

      setDoUpdate(true);
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

      setDoUpdate(true);
    }
  };

  const inputData = [
    {
      id: 1,
      label: 'Current Employer Name',
      name: 'currentEmployerName',
      value: inputs.currentEmployerName,
      type: 'text',
      width: 0,
      onChange: handleChange,
    },
    {
      id: 2,
      label: 'Address',
      value: inputs.address,
      name: 'address',
      width: 0,
      type: 'dottedInput',
      onChange: handleChange,
    },
    {
      id: 3,
      label: 'Phone number',
      value: inputs.phoneNumber,
      name: 'phoneNumber',
      type: 'text',
      width: 0,
      onChange: handleChange,
    },
    {
      id: 4,
      label: 'Employment status',
      value: inputs.employmentStatus,
      name: 'employmentStatus',
      type: 'select',
      width: 0,
      onChange: handleChange,
      options: employmentStatus?.map((el) => {
        return { value: el.id, option: el.status };
      }),
    },
    {
      id: 5,
      label: 'Occupation',
      value: inputs.occupation,
      name: 'occupation',
      type: 'select',
      width: 0,
      onChange: handleChange,
      options: occupation?.map((el) => {
        return { value: el.id, option: el.occupation };
      }),
    },
    {
      id: 6,
      label: 'Year',
      value: inputs.year,
      name: 'year',
      type: 'text',
      width: 0,
      onChange: handleChange,
    },
    {
      id: 7,
      label: 'Months',
      value: inputs.months,
      name: 'months',
      type: 'select',
      width: 0,
      onChange: handleChange,
      options: creditAppMonhts?.map((el) => {
        return { value: el.id, option: el.month };
      }),
    },
    {
      id: 15,
      label: '',
      value: inputs.hasBankAccount,
      name: 'hasBankAccount',
      type: 'checkbox',
      width: 0,
      onChange: handleChange,
    },
    {
      id: 8,
      label: 'Income Type',
      value: inputs.incomeType,
      name: 'incomeType',
      type: 'select',
      width: 0,
      onChange: handleChange,
      options: incomeType?.map((el) => {
        return { value: el.id, option: el.income };
      }),
    },
    {
      id: 14,
      label: 'Monthly Income',
      value: inputs.monthlyIncome,
      name: 'monthlyIncome',
      type: 'text',
      width: 0,
      onChange: handleChange,
    },
  ];

  const { fieldErrors, loadingFetch, makeAsyncFetch, setManualFieldErrors } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'addNewForm') {
      setForms((prevForms) => [...prevForms, { inputs: { ...inputs }, fieldErrors: fieldErrors }]);
    }

    if (identity === 'deleteForm') {
      setShowDeleteButtons(!showDeleteButtons);
    }

    if (identity === 'doDelete') {
      const savedForm = forms.find((_, index) => index === parseInt(value));

      if (savedForm) {
        if (savedForm.inputs.id) {
          setDeleteIndex(parseInt(value));

          setWarningMssg('Are you sure you want to delete this?');

          return;
        }
      }

      setForms((prevForms) => prevForms.filter((_, index) => index !== parseInt(value)));
    }
  };

  useEffect(() => {
    const newFormData: any[] = [];

    newFormData.push({
      inputs: {
        id: creditApp.employmentStatus.id?.toString() || '',
        addressId: creditApp.employmentStatus.addressId?.toString() || '',
        currentEmployerName: creditApp.employmentStatus.currentEmploymentName || '',
        address: creditApp.employmentStatus.currentAddress || '',
        addressStreet: extractAddressOptionsFromMainAddress(
          creditApp.employmentStatus.currentAddress || '',
          states,
        ).street,
        addressCity: extractAddressOptionsFromMainAddress(
          creditApp.employmentStatus.currentAddress || '',
          states,
        ).city,
        addressState: extractAddressOptionsFromMainAddress(
          creditApp.employmentStatus.currentAddress || '',
          states,
        ).state,
        addressZip: extractAddressOptionsFromMainAddress(
          creditApp.employmentStatus.currentAddress || '',
          states,
        ).zip,
        addressCounty: extractAddressOptionsFromMainAddress(
          creditApp.employmentStatus.currentAddress || '',
          states,
        ).county,
        phoneNumber: creditApp.employmentStatus.currentPhoneNumber || '',
        employmentStatus: creditApp.employmentStatus.currentEmploymentStatus?.toString() || '',
        occupation: creditApp.employmentStatus.currentOccupation?.toString() || '',
        year: creditApp.employmentStatus.currentYear || '',
        months: creditApp.employmentStatus.currentMonth?.toString() || '',
        incomeType: creditApp.employmentStatus.currentIncomeType?.toString() || '',
        monthlyIncome: creditApp.employmentStatus.currentMontlyIncome || '',
        hourlyWage: creditApp.employmentStatus.currentHourlyWage || '0',
        yearToDate: creditApp.employmentStatus.currentYearToDate || '0',
        hasBankAccount: creditApp.employmentStatus.hasBankAccount ? '1' : '',
      },
    });

    creditApp.employmentStatus.prevEmploymentData?.forEach((el) => {
      newFormData.push({
        inputs: {
          id: el?.id?.toString() || '',
          addressId: el?.addressId?.toString() || '',
          currentEmployerName: el?.employmentName || '',
          address: el?.address || '',
          addressStreet: extractAddressOptionsFromMainAddress(el?.address || '', states).street,
          addressCity: extractAddressOptionsFromMainAddress(el?.address || '', states).city,
          addressState: extractAddressOptionsFromMainAddress(el?.address || '', states).state,
          addressZip: extractAddressOptionsFromMainAddress(el?.address || '', states).zip,
          addressCounty: extractAddressOptionsFromMainAddress(el?.address || '', states).county,
          phoneNumber: el?.phoneNumber || '',
          employmentStatus: el?.employmentStatus?.toString() || '',
          occupation: el?.occupation?.toString() || '',
          year: el?.year || '',
          months: el?.month?.toString() || '',
          incomeType: el?.incomeType?.toString() || '',
          monthlyIncome: el?.montlyIncome || '',
          hourlyWage: el?.hourlyWage || '0',
          yearToDate: el?.yearToDate || '0',
          hasBankAccount: '',
        },
      });
    });

    setForms(newFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditApp]);

  useEffect(() => {
    const newFormData: any[] = [];

    newFormData.push({
      inputs: {
        id: creditAppDefault.employmentStatus.id?.toString() || '',
        addressId: creditAppDefault.employmentStatus.addressId?.toString() || '',
        currentEmployerName: creditAppDefault.employmentStatus.currentEmploymentName || '',
        address: creditAppDefault.employmentStatus.currentAddress || '',
        addressStreet: extractAddressOptionsFromMainAddress(
          creditAppDefault.employmentStatus.currentAddress || '',
          states,
        ).street,
        addressCity: extractAddressOptionsFromMainAddress(
          creditAppDefault.employmentStatus.currentAddress || '',
          states,
        ).city,
        addressState: extractAddressOptionsFromMainAddress(
          creditAppDefault.employmentStatus.currentAddress || '',
          states,
        ).state,
        addressZip: extractAddressOptionsFromMainAddress(
          creditAppDefault.employmentStatus.currentAddress || '',
          states,
        ).zip,
        addressCounty: extractAddressOptionsFromMainAddress(
          creditAppDefault.employmentStatus.currentAddress || '',
          states,
        ).county,
        phoneNumber: creditAppDefault.employmentStatus.currentPhoneNumber || '',
        employmentStatus:
          creditAppDefault.employmentStatus.currentEmploymentStatus?.toString() || '',
        occupation: creditAppDefault.employmentStatus.currentOccupation?.toString() || '',
        year: creditAppDefault.employmentStatus.currentYear || '',
        months: creditAppDefault.employmentStatus.currentMonth?.toString() || '',
        incomeType: creditAppDefault.employmentStatus.currentIncomeType?.toString() || '',
        monthlyIncome: creditAppDefault.employmentStatus.currentMontlyIncome || '',
        hourlyWage: creditAppDefault.employmentStatus.currentHourlyWage || '0',
        yearToDate: creditAppDefault.employmentStatus.currentYearToDate || '0',
        hasBankAccount: creditAppDefault.employmentStatus.hasBankAccount ? '1' : '',
      },
    });

    creditAppDefault.employmentStatus.prevEmploymentData?.forEach((el) => {
      newFormData.push({
        inputs: {
          id: el?.id?.toString() || '',
          addressId: el?.addressId?.toString() || '',
          currentEmployerName: el?.employmentName || '',
          address: el?.address || '',
          addressStreet: extractAddressOptionsFromMainAddress(el?.address || '', states).street,
          addressCity: extractAddressOptionsFromMainAddress(el?.address || '', states).city,
          addressState: extractAddressOptionsFromMainAddress(el?.address || '', states).state,
          addressZip: extractAddressOptionsFromMainAddress(el?.address || '', states).zip,
          addressCounty: extractAddressOptionsFromMainAddress(el?.address || '', states).county,
          phoneNumber: el?.phoneNumber || '',
          employmentStatus: el?.employmentStatus?.toString() || '',
          occupation: el?.occupation?.toString() || '',
          year: el?.year || '',
          months: el?.month?.toString() || '',
          incomeType: el?.incomeType?.toString() || '',
          monthlyIncome: el?.montlyIncome || '',
          hourlyWage: el?.hourlyWage || '0',
          yearToDate: el?.yearToDate || '0',
          hasBankAccount: '',
        },
      });
    });

    setForms(newFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditAppDefault]);

  const handleReturnFieldError = (field: typeof fieldErrors, index: number) => {
    let fieldError: typeof fieldErrors = {};

    if (field) {
      for (const [key, value] of Object.entries(field)) {
        const [fieldName, ind] = key.split('.');

        if (index === parseInt(ind)) {
          fieldError = { ...fieldError, [fieldName]: value };
        }
      }
    }

    return fieldError;
  };

  const handleReturnAddressError = (field: typeof fieldErrors, index: number) => {
    let fieldError = '';

    if (field) {
      for (const [key, value] of Object.entries(field)) {
        const [fieldName, ind] = key.split('.');

        if (fieldName === 'address' && index === parseInt(ind) && value && value.length > 0) {
          const mssg = value[0];

          if (mssg) fieldError = mssg;
        }
      }
    }

    return fieldError;
  };

  const handleDecision = (decision: boolean) => {
    if (decision) {
      setForms((prevForms) => prevForms.filter((_, index) => index !== deleteIndex));

      setDoUpdate(true);

      setWarningMssg('');
    } else {
      setWarningMssg('');
    }
  };

  useEffect(() => {
    if (doUpdate) {
      saveData();
    }

    if (forms) {
      handleNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forms]);

  return (
    <aside className="relative md:mt-[2rem] lg:w-[70vw] lg:mx-auto">
      <ConfirmNotification notiMessage={warningMssg} onDecision={handleDecision} />
      <article className="flex flex-col gap-[1rem]">
        {forms.map((form, index) => {
          return (
            <aside
              key={`mainformelement--${index}//`}
              className="relative px-[0.5rem] py-[0.5rem] flex flex-col gap-[1rem] md:grid md:grid-cols-3 md:gap-8 md:items-end shadow-crmFormShadow rounded-md"
            >
              {inputData.map((el) => {
                if (el.type === 'checkbox') {
                  if (index === 0) {
                    return (
                      <Input
                        key={`--emplstatuspublic${el.id}-${index}`}
                        label={
                          el.label === 'Current Employer Name' && index > 0
                            ? `Previous Employer Name ${index}`
                            : el.label
                        }
                        name={el.name}
                        type={el.type}
                        value={
                          el.name === 'phoneNumber'
                            ? formatPhoneNumber(form.inputs[el.name])
                            : form.inputs[el.name as keyof typeof inputs]
                        }
                        width={el.width}
                        options={el.options}
                        chekcboxText="Has bank account"
                        customCheckbox
                        index={index}
                        fieldErrors={handleReturnFieldError(fieldErrors, index)}
                        isLoading={loadingFetch}
                        disabled={loadingFetch}
                        onChange={el.onChange}
                      />
                    );
                  }
                } else if (el.type !== 'dottedInput') {
                  return (
                    <Input
                      key={`--emplstatuspublic${el.id}-${index}`}
                      label={
                        el.label === 'Current Employer Name' && index > 0
                          ? `Previous Employer Name ${index}`
                          : el.label
                      }
                      name={el.name}
                      type={el.type}
                      value={
                        el.name === 'phoneNumber'
                          ? formatPhoneNumber(form.inputs[el.name])
                          : form.inputs[el.name as keyof typeof inputs]
                      }
                      width={el.width}
                      options={el.options}
                      index={index}
                      fieldErrors={handleReturnFieldError(fieldErrors, index)}
                      isLoading={loadingFetch}
                      disabled={loadingFetch}
                      onChange={el.onChange}
                    />
                  );
                } else {
                  return (
                    <AddressInput
                      key={`addressInputcurrentstatestreet`}
                      width={0}
                      fieldErrorMessage={handleReturnAddressError(fieldErrors, index)}
                      mainInput={{
                        label: 'Address',
                        id: 'address',
                        name: 'address',
                        value: form.inputs.address,
                        onChange: (e) => handleChangeCurrentAddress(e, index),
                      }}
                      isLoading={loadingFetch}
                      disabled={loadingFetch}
                      addressOptions={{
                        street: form.inputs.addressStreet,
                        streetName: 'addressStreet',
                        city: form.inputs.addressCity,
                        cityName: 'addressCity',
                        state: form.inputs.addressState,
                        stateName: 'addressState',
                        zip: form.inputs.addressZip,
                        zipName: 'addressZip',
                        county: form.inputs.addressCounty,
                        countyName: 'addressCounty',
                        handleChange: (e) => handleChangeCurrentAddress(e, index),
                      }}
                      manualStates={states}
                      dontGetStates
                    />
                  );
                }
              })}
              {showDeleteButtons && (
                <button
                  className="absolute top-[-0.2rem] right-0 w-[2rem] h-[2rem] flex justify-center items-center bg-white rounded-full"
                  data-identity="doDelete"
                  value={index}
                  onClick={handleButton}
                >
                  <CancelIcon color="#F00" mobile />
                </button>
              )}
            </aside>
          );
        })}
      </article>
      <article className="flex flex-row justify-center items-center gap-[0.5rem] py-[0.2rem] mt-[1rem] bg-white">
        <p className="text-blue-800 text-sm">Add Previous</p>
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
          identity="next"
          textColor="#00a78b"
          buttonText={currentProgress !== 100 ? 'Complete the Form' : 'Next'}
          border={0.05}
          width={0}
          borderColor="#00a78b"
          buttonTextSize={2}
          disabled={!nextToReferences || loadingFetch}
          onClick={() => {
            if (nextToReferences) {
              setCurrentPage(3);
            }
          }}
        />
      </article>
      {/* {loadingFetch && <Loader rounded="1.2rem" />} */}
    </aside>
  );
}
