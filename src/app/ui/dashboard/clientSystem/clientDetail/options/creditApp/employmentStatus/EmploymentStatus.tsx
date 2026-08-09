import { CancelIcon, PlusIcon, TrashIcon } from '&/icons/Icons';
import { Input } from '&/inputs/Input';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  adminDashboardStore,
  creditAppPaginationStore,
  numberFormatterStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { useSocketStore } from '@/store/socketIo';
import { addressHandlerStore } from '@/store/addressHandling';
import { AddressInput } from '&/miscellaneous/addressInput/AddressInput';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { MonthlyIncomeCalculator } from './monthlyIncomeCalculator/MonthlyIncomeCalculator';
import { creditAppStore } from '@/store/creditApp';
import { EmploymentStatus as EmploymentStatusData } from '@/app/api/adminDashboard/creditApp/types';

export function EmploymentStatus() {
  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();

  const { statesData, occupation, incomeType, employmentStatus, creditAddressMonthsData } =
    adminDashboardStore();
  const { getOccuaption, getIncomeType, getEmploymentStatus, getCreditAddressMonth } =
    adminDashboardStore();

  const { numberFormatter, numberFilter } = numberFormatterStore();

  const { formatPhoneNumber, extractDigits } = phoneNumbersFormatStore();

  const { creditApp, setCreditApp } = creditAppStore();

  const { nextPage, prevPage } = creditAppPaginationStore();

  const { singleCLientData } = singleCLientDataStore();

  const { handlingMainAddressInput, extractAddressOptionsFromMainAddress, addressRepeated } =
    addressHandlerStore();

  const getPromiseData = useCallback(() => {
    return [getOccuaption(), getIncomeType(), getEmploymentStatus(), getCreditAddressMonth()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData, [singleCLientData]);

  // ----- local states -----

  const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  const [nextToReferences, setNextToReferences] = useState(false);

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

  const { fieldErrors, loadingFetch, makeAsyncFetch, setManualFieldErrors } = useAsyncFetching();

  const [forms, setForms] = useState([{ inputs: inputs }]);

  const [doUpdate, setDoUpdate] = useState(false);

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [warningMssg, setWarningMssg] = useState('');

  const inputEditedRef = useRef<NodeJS.Timeout | null>(null);

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

      const apiUrl = `/api/adminDashboard/creditApp/employmentStatus/${singleCLientData?.id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        noShowMessage: true,
        options: {
          onSuccess: (data: EmploymentStatusData) => {
            setDoUpdate(false);

            const newState = { ...creditApp, employmentStatus: data };

            setCreditApp(newState);

            updateDataWithSocket('creditApp', undefined, {
              employmentStatus: '1',
              customerId: singleCLientData?.id,
            });
          },
        },
      });
    }, 1500);
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

      setDoUpdate(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    const { index } = e.currentTarget.dataset;

    if (index && index !== null) {
      const formIndex = Number(index);

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
                    statesData?.find((state) => state.id === parseInt(updatedInputs.addressState))
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

  const handleChangeCalculator = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    const { index } = e.currentTarget.dataset;

    if (index && index !== null) {
      const formIndex = parseInt(index);

      setForms((prevForms) => {
        const newForms = [...prevForms];

        let updatedInputs;

        updatedInputs = {
          ...newForms[formIndex].inputs,
          [name]: numberFormatter(value),
        };

        newForms[formIndex] = {
          ...newForms[formIndex],
          inputs: updatedInputs,
        };

        return newForms;
      });
    }
  };

  // handling buttons

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'addNewForm') {
      setForms((prevForms) => [...prevForms, { inputs: { ...inputs }, fieldErrors: fieldErrors }]);
    }

    if (identity === 'deleteForm') {
      setShowDeleteBtn(!showDeleteBtn);
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

    if (identity === 'next') {
      nextPage();
    }

    if (identity === 'prev') {
      prevPage();
    }
  };

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
            const monthSelected = creditAddressMonthsData.find((el) => el.id === parseInt(value));

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

  // handling inputs data

  const inputData1 = [
    {
      id: 1,
      label: 'Current Employer Name',
      name: 'currentEmployerName',
      value: inputs.currentEmployerName,
      type: 'text',
      width: 20.520833,
      onChange: handleChange,
    },
    {
      id: 2,
      label: 'Address',
      value: inputs.address,
      name: 'address',
      width: 33.28125,
      type: 'dottedInput',
      onChange: handleChange,
    },
    {
      id: 8,
      label: 'Phone number',
      value: inputs.phoneNumber,
      name: 'phoneNumber',
      type: 'text',
      width: 23.385416,
      onChange: handleChange,
    },
  ];

  const inputData2 = [
    {
      id: 9,
      label: 'Employment status',
      value: inputs.employmentStatus,
      name: 'employmentStatus',
      type: 'select',
      width: 12.5,
      onChange: handleChange,
      options:
        employmentStatus && employmentStatus.length > 0
          ? employmentStatus?.map((el) => {
              return { value: el.id, option: el.status };
            })
          : undefined,
    },
    {
      id: 10,
      label: 'Occupation',
      value: inputs.occupation,
      name: 'occupation',
      type: 'select',
      width: 12.5,
      onChange: handleChange,
      options: occupation?.map((el) => {
        return { value: el.id, option: el.occupation };
      }),
    },
    {
      id: 11,
      label: 'Year',
      value: inputs.year,
      name: 'year',
      type: 'text',
      width: 4,
      onChange: handleChange,
    },
    {
      id: 12,
      label: 'Months',
      value: inputs.months,
      name: 'months',
      type: 'select',
      width: 6,
      onChange: handleChange,
      options: creditAddressMonthsData.map((el) => {
        return { value: el.id, option: el.month };
      }),
    },
    {
      id: 15,
      label: '',
      value: inputs.hasBankAccount,
      name: 'hasBankAccount',
      type: 'checkbox',
      width: 8,
      onChange: handleChange,
    },
    {
      id: 13,
      label: 'Income Type',
      value: inputs.incomeType,
      name: 'incomeType',
      type: 'select',
      width: 15,
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
      width: 8,
      onChange: handleChange,
    },
  ];

  // handling buttons data

  const buttonData1 = [
    {
      id: 15,
      backgroundColor: '#FFF',
      identity: 'addNewForm',
      textColor: '#00A78B',
      buttonText: 'Add Previous',
      iconTextGap: 1,
      border: 0.104167,
      width: 9,
      buttonTextSize: 2,
      buttonIcon: <PlusIcon />,
      borderColor: '#00A78B',
      onClick: handleButton,
    },
    {
      id: 16,
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
      id: 17,
      backgroundColor: '#00A78B',
      identity: 'prev',
      textColor: '#FFF',
      buttonText: 'Prev',
      width: 9,
      buttonTextSize: 2,
      onClick: handleButton,
    },
    {
      id: 19,
      backgroundColor: '#00A78B',
      identity: 'next',
      textColor: '#FFF',
      buttonText: 'Next',
      width: 9,
      buttonTextSize: 2,
      disabled: !nextToReferences,
      onClick: handleButton,
    },
  ];

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
          statesData,
        ).street,
        addressCity: extractAddressOptionsFromMainAddress(
          creditApp.employmentStatus.currentAddress || '',
          statesData,
        ).city,
        addressState: extractAddressOptionsFromMainAddress(
          creditApp.employmentStatus.currentAddress || '',
          statesData,
        ).state,
        addressZip: extractAddressOptionsFromMainAddress(
          creditApp.employmentStatus.currentAddress || '',
          statesData,
        ).zip,
        addressCounty: extractAddressOptionsFromMainAddress(
          creditApp.employmentStatus.currentAddress || '',
          statesData,
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
          addressStreet: extractAddressOptionsFromMainAddress(el?.address || '', statesData).street,
          addressCity: extractAddressOptionsFromMainAddress(el?.address || '', statesData).city,
          addressState: extractAddressOptionsFromMainAddress(el?.address || '', statesData).state,
          addressZip: extractAddressOptionsFromMainAddress(el?.address || '', statesData).zip,
          addressCounty: extractAddressOptionsFromMainAddress(el?.address || '', statesData).county,
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
    <ModalContent
      overflowVisible
      loading={loading}
      minHeight={50}
      decisionMessage={warningMssg}
      onDecision={handleDecision}
    >
      {forms.map((form, index) => (
        <BorderedContent
          key={`${index + index * 34}formsarrayemployentstatus`}
          marginTop={index > 0 ? 3 : 0}
          overflowVisible
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
              right={0.6}
              top={1}
              disabled={loading || loadingFetch}
              value={index}
              widthFitContent
              heightFitContent
            />
          )}
          <ContentRow cols={3} gap={3}>
            {inputData1.map((el) =>
              el.type !== 'dottedInput' ? (
                <Input
                  key={`${el.id * 32}dottedinput???`}
                  label={
                    el.label === 'Current Employer Name' && index > 0
                      ? 'Previous Employer Name'
                      : el.label
                  }
                  name={el.name}
                  value={
                    el.name === 'phoneNumber'
                      ? formatPhoneNumber(form.inputs[el.name])
                      : form.inputs[el.name as keyof typeof inputs]
                  }
                  type={el.type}
                  width={el.width}
                  index={index}
                  onChange={el.onChange}
                  isLoading={loading || loadingFetch}
                  disabled={loading || loadingFetch}
                  fieldErrors={handleReturnFieldError(fieldErrors, index)}
                  fieldErrorTop={9}
                />
              ) : (
                <AddressInput
                  key={`addressInputcurrentstatestreet`}
                  width={33.28125}
                  mainInput={{
                    label: 'Address',
                    id: 'address',
                    name: 'address',
                    value: form.inputs.address,
                    onChange: (e) => handleChangeCurrentAddress(e, index),
                  }}
                  isLoading={loading || loadingFetch}
                  disabled={loading || loadingFetch}
                  dontGetStates
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
                  fieldErrorMessage={handleReturnAddressError(fieldErrors, index)}
                />
              ),
            )}
          </ContentRow>
          <ContentRow cols={7} gap={3} marginTop={4}>
            {inputData2.map((el) => (
              <div
                key={`${el.id}inputdata2`}
                className={`${
                  el.name === 'monthlyIncome'
                    ? 'relative flex justify-center items-end gap-[0.5vw]'
                    : ''
                }`}
              >
                {el.type === 'checkbox' ? (
                  index === 0 && (
                    <Input
                      label={el.label}
                      name={el.name}
                      value={
                        el.name === 'monthlyIncome'
                          ? numberFilter(form.inputs[el.name as keyof typeof inputs], 1)
                          : form.inputs[el.name as keyof typeof inputs]
                      }
                      type={el.type}
                      index={index}
                      width={el.width}
                      options={el.options}
                      chekcboxText="Has bank account"
                      customCheckbox
                      isLoading={loading || loadingFetch}
                      disabled={loading || loadingFetch}
                      onChange={el.onChange}
                      fieldErrors={handleReturnFieldError(fieldErrors, index)}
                      fieldErrorTop={9}
                    />
                  )
                ) : (
                  <Input
                    label={el.label}
                    name={el.name}
                    value={
                      el.name === 'monthlyIncome'
                        ? numberFilter(form.inputs[el.name as keyof typeof inputs], 1)
                        : form.inputs[el.name as keyof typeof inputs]
                    }
                    type={el.type}
                    index={index}
                    width={el.width}
                    options={el.options}
                    isLoading={loading || loadingFetch}
                    disabled={loading || loadingFetch}
                    onChange={el.onChange}
                    fieldErrors={handleReturnFieldError(fieldErrors, index)}
                    fieldErrorTop={9}
                  />
                )}
                {el.name === 'monthlyIncome' &&
                  form.inputs.hourlyWage &&
                  form.inputs.yearToDate && (
                    <MonthlyIncomeCalculator
                      hourlyWage={form.inputs.hourlyWage}
                      yearToDate={form.inputs.yearToDate}
                      index={index.toString()}
                      onChange={handleChangeCalculator}
                    />
                  )}
              </div>
            ))}
          </ContentRow>
        </BorderedContent>
      ))}
      <ButtonContainer marginTop={3} gap={1.5}>
        {buttonData1.map((el, index) => (
          <Button
            key={`${el.id}${index + 123}buttonss`}
            backgroundColor={el.backgroundColor}
            identity={el.identity}
            textColor={el.textColor}
            buttonText={el.buttonText}
            iconTextGap={el.iconTextGap}
            border={el.border}
            width={el.width}
            disabled={loading || loadingFetch}
            buttonTextSize={el.buttonTextSize}
            buttonIcon={el.buttonIcon}
            borderColor={el.borderColor}
            onClick={el.onClick}
          />
        ))}
      </ButtonContainer>
      <ButtonContainer marginTop={3} gap={1} widthFull justify="space-between" positionRelative>
        {buttonData2.map((el, index) => (
          <Button
            key={`${el.id}${index - 321}buttonss2`}
            backgroundColor={el.backgroundColor}
            identity={el.identity}
            textColor={el.textColor}
            buttonText={el.buttonText}
            width={el.width}
            buttonTextSize={el.buttonTextSize}
            onClick={el.onClick}
            disabled={el.disabled || loadingFetch}
          />
        ))}
        <FieldErrorMessage
          rightLeftAuto
          textCenter
          name="totalYears"
          fieldErrors={fieldErrors}
          fontSize={2}
          top={2}
        />
      </ButtonContainer>
    </ModalContent>
  );
}
