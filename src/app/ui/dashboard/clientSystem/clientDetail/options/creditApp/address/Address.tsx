import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { Input } from '&/inputs/Input';
import { AddressInput } from '&/miscellaneous/addressInput/AddressInput';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import {
  adminDashboardStore,
  creditAppPaginationStore,
  numberFormatterStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { CancelIcon, PlusIcon, TrashIcon } from '&/icons/Icons';
import { addressHandlerStore } from '@/store/addressHandling';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { AddressData } from '@/app/api/adminDashboard/creditApp/types';
import { creditAppStore } from '@/store/creditApp';

interface CurrentAddressData {
  id: string;
  currentAddress: string;
  currentYear: string;
  currentMonthId: string;
  currentAddressTypeId: string;
  currentRentMort: string;
  currentStreet: string;
  currentCity: string;
  currentState: string;
  currentStateId: string;
  currentZip: string;
  currentCounty: string;
  mailingAddress: string;
  mailingStreet: string;
  mailingCity: string;
  mailingState: string;
  mailingStateId: string;
  mailingZip: string;
  mailingCounty: string;
  sameAsCurrent: string;
}

interface PreviousAddressData {
  id: number | null;
  prevAddress: string;
  prevStreet: string;
  prevCity: string;
  prevState: string;
  prevStateId: string;
  prevZip: string;
  prevCounty: string;
  prevInputs: {
    id: number;
    label: string;
    name: string;
    value: string;
    type: string;
    width: number;
    options?: {
      value: number | undefined;
      option: string | undefined;
    }[];
  }[];
}

export function Address() {
  // ----- global states -----

  const { creditAddressMonthsData, creditAddressTypeData, statesData } = adminDashboardStore();
  const { getCreditAddressType, getCreditAddressMonth } = adminDashboardStore();

  const { nextPage, prevPage } = creditAppPaginationStore();

  const { numberFormatter, numberFilter } = numberFormatterStore();

  const { creditApp, setCreditApp } = creditAppStore();

  const { singleCLientData } = singleCLientDataStore();

  const { handlingMainAddressInput, addressRepeated } = addressHandlerStore();

  const { updateDataWithSocket } = useSocketStore();

  const getPromiseData = useCallback(() => {
    return [getCreditAddressType(), getCreditAddressMonth()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData);

  useEffect(() => {
    let street = '';
    let city = '';
    let state = '';
    let zip = '';
    let county = '';

    let mailingStreet = '';
    let mailingCity = '';
    let mailingState = '';
    let mailingZip = '';
    let mailingCounty = '';

    if (creditApp.address?.currentAddress) {
      const [currentStreet, currentCity, currentState, currentZip, currentCounty] =
        creditApp.address.currentAddress.split(',');

      street = currentStreet || '';
      city = currentCity || '';
      state = currentState || '';
      zip = currentZip || '';
      county = currentCounty || '';
    } else {
      street = singleCLientData?.client_address?.street || '';
      city = singleCLientData?.client_address?.city || '';
      state = singleCLientData?.client_address?.state?.state || '';
      zip = singleCLientData?.client_address?.zip || '';
      county = singleCLientData?.client_address?.county?.county || '';
    }

    if (creditApp.address?.mailingAddress) {
      const [
        currentMailingStreet,
        currentMailingCity,
        currentMailingState,
        currentMailingZip,
        currentMailingCounty,
      ] = creditApp.address.mailingAddress.split(',');

      mailingStreet = currentMailingStreet || '';
      mailingCity = currentMailingCity || '';
      mailingState = currentMailingState || '';
      mailingZip = currentMailingZip || '';
      mailingCounty = currentMailingCounty || '';
    }

    setInputs({
      id: creditApp.address?.id?.toString() || '',
      currentAddress:
        creditApp.address?.currentAddress ||
        `${street}, ${city}, ${state}${zip ? `, ${zip}` : ''}${county ? `, ${county}` : ''}` ||
        '',
      currentYear: creditApp.address?.currentYear || '0',
      currentMonthId: creditApp.address?.currentMonth?.toString() || '',
      currentAddressTypeId: creditApp.address?.currentAddressType?.toString() || '',
      currentRentMort: creditApp.address?.currentRentMortAmt || '',
      currentStreet: street,
      currentCity: city,
      currentState: state,
      currentStateId:
        creditApp.address?.currentStateId?.toString() ||
        singleCLientData?.client_address?.state?.id?.toString() ||
        '',
      currentZip: zip,
      currentCounty: county,
      mailingAddress: creditApp.address?.mailingAddress || '',
      mailingStreet: mailingStreet,
      mailingCity: mailingCity,
      mailingState: mailingState,
      mailingStateId: creditApp.address?.mailingStateId?.toString() || '',
      mailingZip: mailingZip,
      mailingCounty: mailingCounty,
      sameAsCurrent: creditApp.address?.sameAsCurrentAddress ? '1' : '',
    });

    const newPreviousFormArray: PreviousAddressData[] = [];

    creditApp.address?.prevAddress?.forEach((el) => {
      newPreviousFormArray.push({
        id: Number(el.id),
        prevAddress: el.address || '',
        prevStreet: '',
        prevCity: '',
        prevState: '',
        prevStateId: el.stateId?.toString() || '',
        prevZip: '',
        prevCounty: '',
        prevInputs: [
          {
            id: 1,
            label: 'Year',
            value: el.year || '0',
            name: 'year',
            type: 'text',
            width: 10.104167,
          },
          {
            id: 2,
            label: 'Month',
            name: 'month',
            value: el.month?.toString() || '',
            type: 'select',
            options: creditAddressMonthsData.map((el) => {
              return { value: el.id, option: el.month };
            }),
            width: 5.277778,
          },
          {
            id: 3,
            label: 'Address Type',
            name: 'addressType',
            value: el.addressType?.toString() || '',
            type: 'select',
            options: creditAddressTypeData.map((el) => {
              return { value: el.id, option: el.type };
            }),
            width: 10.104167,
          },
          {
            id: 4,
            label: 'Rent/Mort. amt',
            name: 'rentMort',
            value: el.rentMortAmt || '',
            type: 'text',
            width: 10.104167,
          },
        ],
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditApp]);

  // ----- local states -----

  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmDeletePrevForm, setConfirmDeletePrevForm] = useState('');
  const [prevFormIndexSelected, setPrevFormIndexSelected] = useState<number | null>(null);

  const [nextToEmploymentStatus, setNextToEmploymentStatus] = useState(false);

  const [showDeleteButtons, setShowDeleteButtons] = useState(false);

  const [inputs, setInputs] = useState<CurrentAddressData>({
    id: '',
    currentAddress: singleCLientData?.current_address || '',
    currentYear: '0',
    currentMonthId: '',
    currentAddressTypeId: '',
    currentRentMort: '',
    currentStreet: '',
    currentCity: '',
    currentState: '',
    currentStateId: '',
    currentZip: '',
    currentCounty: '',
    mailingAddress: '',
    mailingStreet: '',
    mailingCity: '',
    mailingState: '',
    mailingStateId: '',
    mailingZip: '',
    mailingCounty: '',
    sameAsCurrent: '',
  });

  const handleChangeCurrentAddress = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => {
      const newState = { ...prevState };

      switch (name) {
        case 'currentAddress':
          newState.currentAddress = value;

          newState.currentStreet = handlingMainAddressInput(newState.currentAddress).street;
          newState.currentCity = handlingMainAddressInput(newState.currentAddress).city;
          newState.currentState = handlingMainAddressInput(newState.currentAddress).state;
          newState.currentStateId = handlingMainAddressInput(newState.currentAddress).stateId;
          newState.currentZip = handlingMainAddressInput(newState.currentAddress).zip;
          newState.currentCounty = handlingMainAddressInput(newState.currentAddress).county;

          if (newState.sameAsCurrent) {
            newState.mailingAddress = value;

            newState.mailingStreet = handlingMainAddressInput(newState.currentAddress).street;
            newState.mailingCity = handlingMainAddressInput(newState.currentAddress).city;
            newState.mailingState = handlingMainAddressInput(newState.currentAddress).state;
            newState.mailingStateId = handlingMainAddressInput(newState.currentAddress).stateId;
            newState.mailingZip = handlingMainAddressInput(newState.currentAddress).zip;
            newState.mailingCounty = handlingMainAddressInput(newState.currentAddress).county;
          }

          break;

        case 'currentStreet':
          newState.currentStreet = value;

          if (newState.sameAsCurrent) {
            newState.mailingStreet = value;
          }

          break;

        case 'currentCity':
          newState.currentCity = value;

          if (newState.sameAsCurrent) {
            newState.mailingCity = value;
          }
          break;

        case 'currentStateId':
          newState.currentState = statesData?.find((el) => el.id === parseInt(value))?.state || '';
          newState.currentStateId = value;

          if (newState.sameAsCurrent) {
            newState.mailingState =
              statesData?.find((el) => el.id === parseInt(value))?.state || '';
            newState.mailingStateId = value;
          }

          break;

        case 'currentZip':
          newState.currentZip = value;

          if (newState.sameAsCurrent) {
            newState.mailingZip = value;
          }
          break;

        case 'currentCounty':
          newState.currentCounty = value;

          if (newState.sameAsCurrent) {
            newState.mailingCounty = value;
          }
          break;
      }

      if (name !== 'currentAddress' && !name.startsWith('waiting')) {
        newState.currentAddress = `${newState.currentStreet ? `${newState.currentStreet}, ` : ''}${
          newState.currentCity ? `${newState.currentCity}` : ''
        }${newState.currentState ? `, ${newState.currentState}` : ''}${
          newState.currentZip ? `, ${newState.currentZip}` : ''
        }${newState.currentCounty ? `, ${newState.currentCounty}` : ''}`;

        if (newState.sameAsCurrent) {
          newState.mailingAddress = `${
            newState.currentStreet ? `${newState.currentStreet}, ` : ''
          }${newState.currentCity ? `${newState.currentCity}` : ''}${
            newState.currentState ? `, ${newState.currentState}` : ''
          }${newState.currentZip ? `, ${newState.currentZip}` : ''}${
            newState.currentCounty ? `, ${newState.currentCounty}` : ''
          }`;
        }
      }

      return newState;
    });

    setDoUpdate(true);
  };

  const handleChangeMailingAddress = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => {
      const newState = { ...prevState };

      switch (name) {
        case 'mailingAddress':
          newState.mailingAddress = value;

          newState.mailingStreet = handlingMainAddressInput(newState.mailingAddress).street;
          newState.mailingCity = handlingMainAddressInput(newState.mailingAddress).city;
          newState.mailingState = handlingMainAddressInput(newState.mailingAddress).state;
          newState.mailingStateId = handlingMainAddressInput(newState.mailingAddress).stateId;
          newState.mailingZip = handlingMainAddressInput(newState.mailingAddress).zip;
          newState.mailingCounty = handlingMainAddressInput(newState.mailingAddress).county;

          break;

        case 'mailingStreet':
          newState.mailingStreet = value;

          break;

        case 'mailingCity':
          newState.mailingCity = value;

          break;

        case 'mailingStateId':
          newState.mailingState = statesData?.find((el) => el.id === parseInt(value))?.state || '';
          newState.mailingStateId = value;

          break;

        case 'mailingZip':
          newState.mailingZip = value;

          break;

        case 'mailingCounty':
          newState.mailingCounty = value;

          break;
      }

      if (name !== 'mailingAddress' && !name.startsWith('current')) {
        newState.mailingAddress = `${newState.mailingStreet ? `${newState.mailingStreet}, ` : ''}${
          newState.mailingCity ? `${newState.mailingCity}` : ''
        }${newState.mailingState ? `, ${newState.mailingState}` : ''}${
          newState.mailingZip ? `, ${newState.mailingZip}` : ''
        }${newState.mailingCounty ? `, ${newState.mailingCounty}` : ''}`;
      }

      return newState;
    });

    setDoUpdate(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.currentTarget;

    let sameChecked = false;
    const inputKey = name as keyof typeof inputs;
    let noUpdate = false;

    if (e.currentTarget instanceof HTMLInputElement && type === 'checkbox') {
      const { checked } = e.currentTarget;

      sameChecked = checked;
    }

    if (name === 'currentYear') {
      const parsedVal = numberFormatter(value);

      setInputs((prevState) => ({
        ...prevState,
        currentYear: parsedVal,
      }));

      setDoUpdate(true);

      return;
    }

    setInputs((prevState) => {
      const newState = { ...prevState };

      if (inputKey === 'sameAsCurrent') {
        if (sameChecked && newState.mailingAddress.trim().length > 0) {
          setConfirmationMessage(
            'Are you sure you want to set the Mailing Address same as Current Address?',
          );

          noUpdate = true;

          return newState;
        }

        newState.sameAsCurrent = sameChecked ? '1' : '';

        if (sameChecked) {
          const {
            currentAddress,
            currentCity,
            currentCounty,
            currentState,
            currentStateId,
            currentStreet,
            currentZip,
          } = newState;

          newState.mailingAddress = currentAddress;
          newState.mailingCity = currentCity;
          newState.mailingCounty = currentCounty;
          newState.mailingState = currentState;
          newState.mailingStateId = currentStateId;
          newState.mailingStreet = currentStreet;
          newState.mailingZip = currentZip;
        }
      } else {
        if (inputKey === 'currentRentMort') {
          const numericValue = numberFormatter(value);

          newState.currentRentMort = numericValue;

          return newState;
        }

        newState[inputKey] = value;

        if (inputKey === 'currentAddress' && newState.sameAsCurrent) {
          newState.mailingAddress = value;
        }
      }

      return newState;
    });

    if (!noUpdate) setDoUpdate(true);
  };

  const handleChangePreviousAddress = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    inputId?: number,
  ) => {
    const { value, name } = e.currentTarget;

    const previousAddressNames = [
      'prevAddress',
      'prevStreet',
      'prevCity',
      'prevStateId',
      'prevZip',
      'prevCounty',
    ];

    if (previousAddressNames.includes(name)) {
      setPreviousAddressInputs((prevState) => {
        const newState = [...prevState];

        switch (name) {
          case 'prevAddress':
            newState[index].prevAddress = value;

            newState[index].prevStreet = handlingMainAddressInput(
              newState[index].prevAddress,
            ).street;
            newState[index].prevCity = handlingMainAddressInput(newState[index].prevAddress).city;
            newState[index].prevState = handlingMainAddressInput(newState[index].prevAddress).state;
            newState[index].prevStateId = handlingMainAddressInput(
              newState[index].prevAddress,
            ).stateId;
            newState[index].prevZip = handlingMainAddressInput(newState[index].prevAddress).zip;
            newState[index].prevCounty = handlingMainAddressInput(
              newState[index].prevAddress,
            ).county;

            break;

          case 'prevStreet':
            newState[index].prevStreet = value;

            break;

          case 'prevCity':
            newState[index].prevCity = value;

            break;

          case 'prevStateId':
            newState[index].prevState =
              statesData?.find((el) => el.id === parseInt(value))?.state || '';
            newState[index].prevStateId = value;

            break;

          case 'prevZip':
            newState[index].prevZip = value;

            break;

          case 'prevCounty':
            newState[index].prevCounty = value;

            break;
        }

        if (name !== 'prevAddress') {
          newState[index].prevAddress = `${
            newState[index].prevStreet ? `${newState[index].prevStreet}, ` : ''
          }${newState[index].prevCity ? `${newState[index].prevCity}` : ''}${
            newState[index].prevState ? `, ${newState[index].prevState}` : ''
          }${newState[index].prevZip ? `, ${newState[index].prevZip}` : ''}${
            newState[index].prevCounty ? `, ${newState[index].prevCounty}` : ''
          }`;
        }

        return newState;
      });

      setDoUpdate(true);

      return;
    }

    setPreviousAddressInputs((prevState) => {
      const newState = [...prevState];

      if (newState[index]) {
        if (!inputId) {
          newState[index] = {
            ...newState[index],
            [name]: value,
          };
        } else {
          const selectedInputById = newState[index].prevInputs.find((el) => el.id === inputId);

          if (selectedInputById) {
            newState[index] = {
              ...newState[index],
              prevInputs: newState[index].prevInputs.map((el) => {
                if (el.id === inputId) {
                  if (el.name === 'year' || el.name === 'rentMort') {
                    return {
                      ...el,
                      value: numberFormatter(value),
                    };
                  } else {
                    return {
                      ...el,
                      value: value,
                    };
                  }
                } else {
                  return el;
                }
              }),
            };
          }
        }
      }

      return newState;
    });

    setDoUpdate(true);
  };

  const addANewForm = () => {
    setPreviousAddressInputs((prevState) => [
      ...prevState,
      {
        id: null,
        prevAddress: '',
        prevStreet: '',
        prevCity: '',
        prevState: '',
        prevStateId: '',
        prevZip: '',
        prevCounty: '',
        prevInputs: [
          {
            id: 1,
            label: 'Year',
            value: '0',
            name: 'year',
            type: 'text',
            width: 10.104167,
          },
          {
            id: 2,
            label: 'Month',
            name: 'month',
            value: '',
            type: 'select',
            options: creditAddressMonthsData.map((el) => {
              return { value: el.id, option: el.month };
            }),
            width: 5.277778,
          },
          {
            id: 3,
            label: 'Address Type',
            name: 'addressType',
            value: '',
            type: 'select',
            options: creditAddressTypeData.map((el) => {
              return { value: el.id, option: el.type };
            }),
            width: 10.104167,
          },
          {
            id: 4,
            label: 'Rent/Mort. amt',
            name: 'rentMort',
            value: '',
            type: 'text',
            width: 10.104167,
          },
        ],
      },
    ]);
  };

  const deleteAForm = (index: number) => {
    setPreviousAddressInputs(previousAddressInputs.filter((el, elIndex) => elIndex !== index));
  };

  const reachedTotalsYears = (
    currentYear: number,
    currentMonth: number,
    prevYear: number,
    prevMonth: number,
  ) => {
    const totalCurrent = currentYear + currentMonth / 12;

    const totalPrev = prevYear + prevMonth / 12;

    const totalYears = totalCurrent + totalPrev;

    return totalYears >= 2;
  };

  const extractTotalTimeFromPreviousAddress = () => {
    let years = 0;
    let months = 0;
    let addressType = 0;
    let rentMort = 0;
    let prevAddress = 0;

    for (let i = 0; i < previousAddressInputs.length; i++) {
      const form = previousAddressInputs[i];

      if (
        form.prevAddress
          .trim()
          .split(',')
          .filter((el) => el !== '').length > 0 &&
        !!form.prevAddress.trim().split(',')[0]
      ) {
        prevAddress += form.prevAddress
          .trim()
          .split(',')
          .filter((el) => el !== '').length;
      }

      for (let elIndex = 0; elIndex < form.prevInputs.length; elIndex++) {
        const formInput = form.prevInputs[elIndex];

        if (formInput.name === 'year') {
          years += parseInt(formInput.value);
        }

        if (formInput.name === 'month') {
          const monthSelected = creditAddressMonthsData.find(
            (el) => el.id === parseInt(formInput.value),
          )?.month;

          if (monthSelected) {
            const numberOfMonths = monthSelected.split(' ')[0];

            months += parseInt(numberOfMonths);
          }
        }

        if (formInput.name === 'addressType') {
          if (formInput.value.trim().length > 0) {
            addressType += 1;
          }
        }

        if (formInput.name === 'rentMort') {
          if (formInput.value.trim().length > 0) {
            rentMort += 1;
          }
        }
      }
    }

    return {
      years,
      months,
      addressType,
      rentMort,
      prevAddress,
    };
  };

  const handleNextPage = () => {
    let next = false;

    const {
      currentAddress,
      currentYear,
      currentMonthId,
      currentAddressTypeId,
      currentRentMort,
      mailingAddress,
    } = inputs;

    const addressSplitted = currentAddress.split(',');
    const mailingAddressSplitted = mailingAddress.split(',');

    const totalPrevYearsMonths = extractTotalTimeFromPreviousAddress();

    const currentMonthsSelected = creditAddressMonthsData
      .find((el) => el.id === parseInt(inputs.currentMonthId))
      ?.month?.split(' ')[0];

    const totals = {
      currentYears: parseInt(inputs.currentYear),
      currentMonths: parseInt(currentMonthsSelected || '0'),
      previousyears: totalPrevYearsMonths.years,
      previusMonths: totalPrevYearsMonths.months,
    };

    const result = reachedTotalsYears(
      totals.currentYears,
      totals.currentMonths,
      totals.previousyears,
      totals.previusMonths,
    );

    let firstBlock = addressSplitted.filter((el) => el.trim() !== '').length === 5 && result;

    if (previousAddressInputs && previousAddressInputs.length > 0) {
      const prevAddressLength = previousAddressInputs.filter((el) => el.id).length;

      let noRepeated = true;

      const prevAddressInputs =
        totalPrevYearsMonths.rentMort === prevAddressLength &&
        totalPrevYearsMonths.addressType === prevAddressLength;

      const prevAddress = totalPrevYearsMonths.prevAddress / (prevAddressLength * 5) === 1;

      for (let i = 0; i < previousAddressInputs.length; i++) {
        const prevAddress = previousAddressInputs[i];

        if (addressRepeated(inputs.currentAddress, prevAddress.prevAddress)) {
          noRepeated = false;

          break;
        }
      }

      firstBlock = firstBlock && prevAddressInputs && prevAddress && noRepeated;
    }

    const secondBlock =
      firstBlock && currentYear && currentMonthId && currentAddressTypeId && currentRentMort
        ? true
        : false;
    const thirdBlock = secondBlock && mailingAddressSplitted.length === 5;

    if (firstBlock && secondBlock && !mailingAddress) {
      next = true;
    }

    if (thirdBlock) {
      next = true;
    }

    setNextToEmploymentStatus(next);

    return next;
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const [doUpdate, setDoUpdate] = useState(false);

  const inputEditedRef = useRef<NodeJS.Timeout | null>(null);

  const saveData = async () => {
    if (inputEditedRef.current) clearTimeout(inputEditedRef.current);

    inputEditedRef.current = setTimeout(async () => {
      const formData = new FormData();

      for (const [name, value] of Object.entries(inputs)) {
        value && formData.append(name, typeof value === 'number' ? value.toString() : value);
      }

      formData.append('previousAddressForms', JSON.stringify(previousAddressInputs));

      formData.append('modifiedDate', new Date().toISOString());

      formData.append('nextToEmploymentStatus', `${handleNextPage()}`);

      const apiUrl = `/api/adminDashboard/creditApp/address/${singleCLientData?.id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        noShowMessage: true,
        options: {
          onSuccess: (data: AddressData) => {
            setDoUpdate(false);

            const newAddressData = { ...creditApp, address: data };

            setCreditApp(newAddressData);

            updateDataWithSocket('creditApp', undefined, {
              address: true,
              customerId: singleCLientData?.id,
            });
          },
        },
      });
    }, 1500);
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;
    const { value } = e.currentTarget;

    if (identity === 'addMorePreviousAddressForm') {
      addANewForm();
    }

    if (identity === 'showDeleteButtons') {
      setShowDeleteButtons(!showDeleteButtons);
    }

    if (identity === 'deletePreviousForm') {
      const prevFormSelected = previousAddressInputs.find((el, index) => index === parseInt(value));

      if (prevFormSelected) {
        const { id } = prevFormSelected;

        if (!id) {
          deleteAForm(parseInt(value));

          return;
        }
      }

      setPrevFormIndexSelected(parseInt(value));

      setConfirmDeletePrevForm('Are you sure you want to delete this form?');
    }

    if (identity === 'nextPage') {
      nextPage();
    }

    if (identity === 'prevPage') {
      prevPage();
    }
  };

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (confirmDeletePrevForm) {
        if (prevFormIndexSelected || prevFormIndexSelected === 0) {
          deleteAForm(prevFormIndexSelected);

          setDoUpdate(true);
        }

        setConfirmDeletePrevForm('');
      } else {
        setInputs((prevState) => {
          const newState = { ...prevState };

          newState.sameAsCurrent = '1';

          const {
            currentAddress,
            currentCity,
            currentCounty,
            currentState,
            currentStateId,
            currentStreet,
            currentZip,
          } = newState;

          newState.mailingAddress = currentAddress;
          newState.mailingCity = currentCity;
          newState.mailingCounty = currentCounty;
          newState.mailingState = currentState;
          newState.mailingStateId = currentStateId;
          newState.mailingStreet = currentStreet;
          newState.mailingZip = currentZip;

          return newState;
        });

        setDoUpdate(true);

        setConfirmationMessage('');
      }
    }
    setConfirmationMessage('');
    setConfirmDeletePrevForm('');
  };

  const handleFieldErrorMssg = (errorFields: {
    address?: string;
    current?: boolean;
    addressType?: string;
    rentMort?: string;
    prevStateId?: string;
  }) => {
    const { address, addressType, current, rentMort, prevStateId } = errorFields;

    let addressMssg = '';
    let addressTypeMssg = '';
    let rentMortMssg = '';
    let totalYearsMssg = '';

    if (address) {
      const splittedCurrentAddress = address.split(',').map((el) => el.trim());
      const stateId = current
        ? inputs.currentStateId
        : prevStateId
        ? prevStateId
        : inputs.mailingStateId;

      const [street, city, state, zip, county] = splittedCurrentAddress;

      if (!street || !city || !stateId || !zip || !county) {
        addressMssg = 'Please enter a: ';

        if (!street) addressMssg = addressMssg + '*Street name ';

        if (!city) addressMssg = addressMssg + '*City ';

        if (!stateId) addressMssg = addressMssg + '*State ';

        if (!zip) addressMssg = addressMssg + '*Zip number ';

        if (!county) addressMssg = addressMssg + '*County name';
      }

      if (!current) {
        if (addressRepeated(inputs.currentAddress, address)) {
          addressMssg = 'The previous address must be different from the current address';
        }
      }
    } else if (inputs.id) {
      addressMssg = 'Please enter a: *Street name *City *State *Zip number *County name';
    }

    if (inputs.id && !addressType) {
      addressTypeMssg = 'Required';
    }

    if (inputs.id && !rentMort) {
      rentMortMssg = 'Required';
    }

    const totalPrevYearsMonths = extractTotalTimeFromPreviousAddress();

    const currentMonthsSelected = creditAddressMonthsData
      .find((el) => el.id === parseInt(inputs.currentMonthId))
      ?.month?.split(' ')[0];

    const totals = {
      currentYears: parseInt(inputs.currentYear),
      currentMonths: parseInt(currentMonthsSelected || '0'),
      previousyears: totalPrevYearsMonths.years,
      previusMonths: totalPrevYearsMonths.months,
    };

    const result = reachedTotalsYears(
      totals.currentYears,
      totals.currentMonths,
      totals.previousyears,
      totals.previusMonths,
    );

    if (!result) {
      totalYearsMssg = 'No 2 years mark reached';
    }

    return { addressMssg, addressTypeMssg, rentMortMssg, totalYearsMssg };
  };

  const [previousAddressInputs, setPreviousAddressInputs] = useState<PreviousAddressData[]>([
    // {
    //   id: null,
    //   prevAddress: '',
    //   prevStreet: '',
    //   prevCity: '',
    //   prevState: '',
    //   prevStateId: '',
    //   prevZip: '',
    //   prevCounty: '',
    //   prevInputs: [
    //     {
    //       id: 1,
    //       label: 'Year',
    //       value: '0',
    //       name: 'year',
    //       type: 'text',
    //       width: 10.104167,
    //     },
    //     {
    //       id: 2,
    //       label: 'Month',
    //       name: 'month',
    //       value: '',
    //       type: 'select',
    //       options: creditAddressMonthsData.map((el) => {
    //         return { value: el.id, option: el.month };
    //       }),
    //       width: 5.277778,
    //     },
    //     {
    //       id: 3,
    //       label: 'Address Type',
    //       name: 'addressType',
    //       value: '',
    //       type: 'select',
    //       options: creditAddressTypeData.map((el) => {
    //         return { value: el.id, option: el.type };
    //       }),
    //       width: 10.104167,
    //     },
    //     {
    //       id: 4,
    //       label: 'Rent/Mort. amt',
    //       name: 'rentMort',
    //       value: '',
    //       type: 'text',
    //       width: 10.104167,
    //     },
    //   ],
    // },
  ]);

  const inputDataOne = [
    {
      id: 1,
      label: 'Year',
      name: 'currentYear',
      value: inputs.currentYear,
      type: 'text',
      width: 10.104167,
      onChange: handleChange,
    },
    {
      id: 2,
      label: 'Month',
      name: 'currentMonthId',
      value: inputs.currentMonthId,
      type: 'select',
      options: creditAddressMonthsData.map((el) => {
        return { value: el.id, option: el.month };
      }),
      width: 5.277778,
      onChange: handleChange,
    },
    {
      id: 3,
      label: 'Address Type',
      name: 'currentAddressTypeId',
      value: inputs.currentAddressTypeId,
      type: 'select',
      options: creditAddressTypeData.map((el) => {
        return { value: el.id, option: el.type };
      }),
      width: 10.104167,
      fieldError: {
        currentAddressTypeId: [
          handleFieldErrorMssg({ addressType: inputs.currentAddressTypeId }).addressTypeMssg || '',
        ] as [string],
        currentRentMort: [''] as [string],
      },
      onChange: handleChange,
    },
    {
      id: 4,
      label: 'Rent/Mort. amt',
      name: 'currentRentMort',
      value: inputs.currentRentMort,
      type: 'text',
      width: 10.104167,
      fieldError: {
        currentRentMort: [
          handleFieldErrorMssg({ rentMort: inputs.currentRentMort }).rentMortMssg || '',
        ] as [string],
        currentAddressTypeId: [''] as [string],
      },
      onChange: handleChange,
    },
  ];

  const buttonData = [
    {
      id: 1,
      width: 8.125,
      backgroundColor: '#FFF',
      identity: 'addMorePreviousAddressForm',
      onClick: handleButton,
      textColor: '#00A78B',
      buttonText: 'Add Previous',
      border: 0.104167,
      iconTextGap: 0.8,
      borderColor: '#00A78B',
      icon: <PlusIcon />,
    },
    {
      id: 2,
      width: 8.125,
      backgroundColor: '#FFF',
      identity: 'showDeleteButtons',
      onClick: handleButton,
      textColor: '#00A78B',
      buttonText: 'Delete',
      border: 0.104167,
      iconTextGap: 0.8,
      borderColor: '#00A78B',
      icon: <TrashIcon />,
    },
  ];

  useEffect(() => {
    if (doUpdate) {
      saveData();
    }

    if (inputs) {
      handleNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, previousAddressInputs]);

  return (
    <ModalContent
      minHeight={60}
      overflowVisible
      decisionMessage={confirmationMessage || confirmDeletePrevForm}
      loading={loading}
      onDecision={handleDecision}
    >
      <BorderedContent overflowVisible>
        <ContentRow cols={5} gap={3}>
          <AddressInput
            width={27.2859375}
            mainInput={{
              label: 'Current Address',
              id: 'currentAddress',
              name: 'currentAddress',
              value: inputs.currentAddress,
              onChange: handleChangeCurrentAddress,
            }}
            isLoading={loading || loadingFetch}
            disabled={loading || loadingFetch}
            addressOptions={{
              street: inputs.currentStreet,
              city: inputs.currentCity,
              state: inputs.currentStateId,
              zip: inputs.currentZip,
              county: inputs.currentCounty,
              streetName: 'currentStreet',
              cityName: 'currentCity',
              countyName: 'currentCounty',
              stateName: 'currentStateId',
              zipName: 'currentZip',
              handleChange: handleChangeCurrentAddress,
            }}
            fieldErrorTop={9}
            fieldErrorMessage={
              handleFieldErrorMssg({ address: inputs.currentAddress, current: true }).addressMssg ||
              ''
            }
          />
          {inputDataOne.map((el, index) => (
            <Input
              key={`^^^3323fsf${el.id * index - 1}ll;${index}`}
              label={el.label}
              name={el.name}
              type={el.type}
              value={el.name === 'currentRentMort' ? numberFilter(el.value, 1) : el.value}
              width={el.width}
              options={el.options}
              isLoading={loading || loadingFetch}
              disabled={loading || loadingFetch}
              fieldErrors={el.fieldError}
              onChange={el.onChange}
            />
          ))}
        </ContentRow>
        <ContentRow cols={2} gap={2} marginTop={4}>
          <AddressInput
            width={33.28125}
            mainInput={{
              label: 'Mailing Address (enter only if different from Current Address)',
              id: 'mailingAddress',
              name: 'mailingAddress',
              value: inputs.mailingAddress,
              onChange: handleChangeMailingAddress,
            }}
            isLoading={loading || loadingFetch}
            addressOptions={{
              street: inputs.mailingStreet,
              streetName: 'mailingStreet',
              city: inputs.mailingCity,
              cityName: 'mailingCity',
              state: inputs.mailingStateId,
              stateName: 'mailingStateId',
              zip: inputs.mailingZip,
              zipName: 'mailingZip',
              county: inputs.mailingCounty,
              countyName: 'mailingCounty',
              handleChange: handleChangeMailingAddress,
            }}
            fieldErrorTop={9}
            fieldErrorMessage={
              (!inputs.sameAsCurrent &&
                inputs.mailingAddress &&
                handleFieldErrorMssg({ address: inputs.mailingAddress }).addressMssg) ||
              ''
            }
            dontGetStates
            disabled={!!inputs.sameAsCurrent || loading || loadingFetch}
          />
          <Input
            label=""
            name="sameAsCurrent"
            type="checkbox"
            width={0}
            value={inputs.sameAsCurrent}
            chekcboxText="Same as Current Address"
            customCheckbox
            isLoading={loading || loadingFetch}
            disabled={loading || loadingFetch}
            onChange={handleChange}
            fieldErrors={fieldErrors}
          />
        </ContentRow>
        {previousAddressInputs?.map((el, index) => (
          <ContentRow
            key={`32@#$${index + 1}rrrr${(index * index) / 3}`}
            cols={5}
            gap={3}
            marginTop={4}
            positionRelative
          >
            <AddressInput
              width={27.2859375}
              mainInput={{
                label: 'Previous Address',
                value: el.prevAddress,
                id: 'prevAddress',
                name: 'prevAddress',
                onChange: (e) => handleChangePreviousAddress(e, index),
              }}
              isLoading={loading || loadingFetch}
              disabled={loading || loadingFetch}
              addressOptions={{
                street: el.prevStreet,
                streetName: 'prevStreet',
                city: el.prevCity,
                cityName: 'prevCity',
                state: el.prevStateId,
                stateName: 'prevStateId',
                zip: el.prevZip,
                zipName: 'prevZip',
                county: el.prevCounty,
                countyName: 'prevCounty',
                handleChange: (e) => handleChangePreviousAddress(e, index),
              }}
              fieldErrorTop={9}
              fieldErrorMessage={
                handleFieldErrorMssg({ address: el.prevAddress, prevStateId: el.prevStateId })
                  .addressMssg || ''
              }
              dontGetStates
            />
            {el.prevInputs.map((input, inputIndex) => (
              <Input
                key={`44234${input.id * 4},,dsdw${inputIndex * input.id + 9}`}
                label={input.label}
                name={input.name}
                type={input.type}
                value={input.name === 'rentMort' ? numberFilter(input.value, 1) : input.value}
                width={input.width}
                options={input.options}
                isLoading={loading || loadingFetch}
                fieldErrors={
                  input.name === 'addressType'
                    ? {
                        addressType: [
                          handleFieldErrorMssg({ addressType: input.value }).addressTypeMssg,
                        ],
                      }
                    : input.name === 'rentMort'
                    ? { rentMort: [handleFieldErrorMssg({ rentMort: input.value }).rentMortMssg] }
                    : undefined
                }
                onChange={(e) => handleChangePreviousAddress(e, index, input.id)}
              />
            ))}
            {/* {index !== 0 && showDeleteButtons && ( */}
            {showDeleteButtons && (
              <Button
                widthFitContent
                heightFitContent
                textColor=""
                backgroundColor=""
                identity="deletePreviousForm"
                value={index}
                positionAbsolute
                top={1.35}
                right={-4.8}
                disabled={loading || loadingFetch}
                buttonIcon={<CancelIcon />}
                onClick={handleButton}
              />
            )}
          </ContentRow>
        ))}
        <ButtonContainer marginTop={4} gap={1.5}>
          {buttonData.map((el, index) => (
            <Button
              key={`${el.id * index + 1}`}
              width={el.width}
              backgroundColor={el.backgroundColor}
              identity={el.identity}
              textColor={el.textColor}
              buttonText={el.buttonText}
              buttonIcon={el.icon}
              border={el.border}
              iconTextGap={el.iconTextGap}
              disabled={loading || loadingFetch}
              borderColor={el.borderColor}
              onClick={el.onClick}
            />
          ))}
        </ButtonContainer>
      </BorderedContent>
      <ButtonContainer marginTop={4} widthFull justify="space-between">
        <Button
          width={9}
          backgroundColor="#00A78B"
          identity="prevPage"
          textColor="#FFF"
          buttonText="Prev"
          disabled={loading || loadingFetch}
          onClick={handleButton}
        />
        <Paragraph fontSize={2} color="#F00">
          {handleFieldErrorMssg({}).totalYearsMssg}
        </Paragraph>
        <Button
          width={9}
          backgroundColor="#00A78B"
          identity="nextPage"
          textColor="#FFF"
          buttonText="Next"
          disabled={!nextToEmploymentStatus || loading || loadingFetch}
          onClick={handleButton}
        />
      </ButtonContainer>
    </ModalContent>
  );
}
