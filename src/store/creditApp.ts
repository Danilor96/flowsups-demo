import { CreditAppData, PrevAddress } from '@/app/api/adminDashboard/creditApp/types';
import { CreditAppStartData } from '@/app/libs/definitions';
import { create } from 'zustand';
import { adminDashboardStore } from './adminDashboard';
import { addressHandlerStore } from './addressHandling';

const defaultValues = {
  start: {},
  address: {},
  employmentStatus: { prevEmploymentData: [] },
  references: { references: [] },
};

interface CreditAppPages {
  address: boolean;
  employment: boolean;
  references: boolean;
}

interface StartData {
  creditApp: CreditAppData;
  setCreditApp: (data: CreditAppData) => void;
  pagesAvailability: () => CreditAppPages;
  creditAppStart: CreditAppStartData;
  getCreditAppStart: (customerId: number | null) => Promise<void>;
  startInputsValue: {
    idType: string;
    idState: string;
    ssn: string;
    idNumber: string;
    dateOfBirth: string;
    issueDate: string;
    expirationDate: string;
    cashdown: string;
    gender: string;
    consent: string;
  };
  setStartInputsValue: (key: string, value: string) => void;
  checkStartInputsValues: (startInputsValueObject: Object) => boolean;
}

export const creditAppStore = create<StartData>((set, get) => ({
  creditAppStart: null,
  creditApp: defaultValues,
  pagesAvailability: () => {
    const { creditApp } = get();
    const { creditAddressMonthsData } = adminDashboardStore.getState();
    const { addressRepeated } = addressHandlerStore.getState();

    let address = false;
    let employment = false;
    let references = false;

    // starts address handling

    const {
      cashdown,
      consent,
      dateOfBirth,
      expirationDate,
      gender,
      idNumber,
      idState,
      idType,
      issueDate,
      noId,
      ssn,
    } = creditApp.start;

    const firstBlock = ssn && dateOfBirth && cashdown && gender ? true : false;
    const secondBlock =
      firstBlock && expirationDate && idNumber && issueDate && idType ? true : false;
    const thirdBlock = secondBlock && idState ? true : false;

    if (noId) {
      if (firstBlock) {
        address = true;
      }
    }

    if (!noId) {
      if (idType !== 3) {
        if (secondBlock) {
          address = true;
        }
      }

      if (idType === 3) {
        if (thirdBlock) {
          address = true;
        }
      }
    }

    // end address handling

    // start employment handling

    const {
      currentAddress,
      currentYear,
      currentMonth,
      currentAddressType,
      currentRentMortAmt,
      mailingAddress,
      prevAddress,
    } = creditApp.address;

    const addressSplitted = currentAddress?.split(',');
    const mailingAddressSplitted = mailingAddress?.split(',');

    const totalPrevYearsMonths = extractTotalTimeFromPreviousAddress(prevAddress);

    const currentMonthsSelected = creditAddressMonthsData
      .find((el) => el.id === currentMonth)
      ?.month?.split(' ')[0];

    const totals = {
      currentYears: Number(currentYear),
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

    let firstAddressBlock =
      addressSplitted?.filter((el) => el.trim() !== '').length === 5 && result;

    if (prevAddress && prevAddress.length > 0) {
      const prevAddressLength = prevAddress.filter((el) => el.address).length;

      let noRepeated = true;

      const prevAddressInputs =
        totalPrevYearsMonths.rentMort === prevAddressLength &&
        totalPrevYearsMonths.addressType === prevAddressLength;

      const prevAddressN = totalPrevYearsMonths.prevAddress / (prevAddressLength * 5) === 1;

      for (let i = 0; i < prevAddress.length; i++) {
        const prevAddressVals = prevAddress[i];

        if (addressRepeated(currentAddress || '', prevAddressVals.address || '')) {
          noRepeated = false;

          break;
        }
      }

      firstAddressBlock = firstBlock && prevAddressInputs && prevAddressN && noRepeated;
    }

    const secondAddressBlock =
      firstBlock && currentYear && currentMonth && currentAddressType && currentRentMortAmt
        ? true
        : false;

    const thirdAddressBlock = secondBlock && mailingAddressSplitted?.length === 5;

    if (firstAddressBlock && secondAddressBlock && !mailingAddress) {
      employment = true;
    }

    if (thirdAddressBlock) {
      employment = true;
    }

    // end employment handling

    // start references handling

    let totalYears = 0;
    let totalMonths = 0;

    const { prevEmploymentData } = creditApp.employmentStatus;

    if (prevEmploymentData) {
      for (let i = 0; i < prevEmploymentData.length; i++) {
        const form = prevEmploymentData[i];

        if (form?.year) {
          totalYears += Number(form.year);
        }

        if (form?.month) {
          totalMonths += form.month - 1;
        }
      }
    }

    const totalYearsAndMonths = totalYears + totalMonths / 12;
    const isReachedTotalsYears = totalYearsAndMonths >= 2;

    if (isReachedTotalsYears) {
      references = true;
    }

    // end references handling

    return {
      address,
      employment,
      references,
    };
  },
  setCreditApp: (data) => {
    set({ creditApp: data });
  },
  getCreditAppStart: async (customerId) => {
    if (customerId === null) {
      set({ creditAppStart: null });

      return;
    }

    const data = await (await fetch(`/api/adminDashboard/creditApp/start/${customerId}`)).json();

    set({ creditAppStart: data });
  },
  startInputsValue: {
    idType: '1',
    idState: '',
    ssn: '',
    idNumber: '',
    dateOfBirth: '',
    issueDate: '',
    expirationDate: '',
    cashdown: '',
    gender: '1',
    consent: '',
  },
  setStartInputsValue: (key, value) => {
    set((prevState) => ({
      ...prevState,
      startInputsValue: {
        ...prevState.startInputsValue,
        [key]: value,
      },
    }));
  },
  checkStartInputsValues: (startInputsValueObject) => {
    let noEmptyInputs = true;

    for (const [key, value] of Object.entries(startInputsValueObject)) {
      if (key !== 'consent' && key !== 'idState' && !value) {
        return false;
      }
    }

    return noEmptyInputs;
  },
}));

interface PublicCreditAppPage {
  currentPage: number;
  currentProgress: number;
  setCurrentProgress: (
    inputs: { [key: string]: string },
    ignore?: string[],
    arrayInputs?: { [key: string]: string }[],
    ignoreMainInputsObject?: boolean,
  ) => void;
  setCurrentPage: (page: number) => void;
}

export const publicCreditAppPageStore = create<PublicCreditAppPage>((set) => ({
  currentPage: 0,
  currentProgress: 0,
  setCurrentProgress: (inputs, ignore, arrayInputs, ignoreMainInputsObject) => {
    let inputsFilled = 0;
    let objectKeys: string[] = [];

    if (ignore && ignore.length > 0 && !ignoreMainInputsObject) {
      const availableKeys = Object.keys(inputs);

      objectKeys = availableKeys.filter((el) => !ignore.includes(el));
    } else if (!ignoreMainInputsObject) {
      objectKeys = Object.keys(inputs);
    }

    if (arrayInputs && arrayInputs.length > 0) {
      for (let i = 0; i < arrayInputs.length; i++) {
        const el = arrayInputs[i];

        const keys = Object.keys(el);

        if (ignore && ignore.length > 0) {
          const filteredData = keys.filter((key) => !ignore.includes(key));

          for (let i = 0; i < filteredData.length; i++) {
            const element = filteredData[i];

            objectKeys.push(element);
          }
        } else {
          for (let i = 0; i < keys.length; i++) {
            const element = keys[i];

            objectKeys.push(element);
          }
        }

        for (const [name, value] of Object.entries(el)) {
          if (value && !ignore?.includes(name)) inputsFilled = inputsFilled + 1;
        }
      }
    }

    if (!ignoreMainInputsObject) {
      for (const [name, value] of Object.entries(inputs)) {
        if (value && !ignore?.includes(name)) inputsFilled = inputsFilled + 1;
      }
    }

    const totalProgress = (inputsFilled / objectKeys.length) * 100;

    set({ currentProgress: totalProgress });
  },
  setCurrentPage: (page) => {
    set({ currentPage: page });
  },
}));

const extractTotalTimeFromPreviousAddress = (previousAddress?: PrevAddress[] | null) => {
  let years = 0;
  let months = 0;
  let addressType = 0;
  let rentMort = 0;
  let prevAddress = 0;

  if (previousAddress) {
    for (let i = 0; i < previousAddress.length; i++) {
      const form = previousAddress[i];

      if (form?.month) {
        months += form.month - 1;
      }

      if (form?.year) {
        years += Number(form.year);
      }

      if (form?.addressType) {
        addressType += 1;
      }

      if (form?.rentMortAmt) {
        rentMort += Number(form.rentMortAmt);
      }

      if (form?.address) {
        const addressParts = form.address.split(',');

        prevAddress += addressParts.length;
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
