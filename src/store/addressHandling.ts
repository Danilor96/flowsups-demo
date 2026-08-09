import { create } from 'zustand';
import { adminDashboardStore } from './adminDashboard';
import { States } from '@/app/libs/definitions';

interface NewVal {
  street: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  stateId: string;
}

interface NewHandlerVal {
  mainAddressVal: string;
  streetVal: string;
  cityVal: string;
  stateVal: string;
  zipVal: string;
  countyVal: string;
  stateIdVal: string;
}

interface AddressDataHandler {
  handlingMainAddressInput: (mainAddress: string) => NewVal;
  handlingAddressData: (
    name: string,
    value: string,
    cases: {
      mainAddress: string;
      street: string;
      city: string;
      state: string;
      zip: string;
      county: string;
    },
    prevValues: {
      mainAddressVal: string;
      streetVal: string;
      cityVal: string;
      stateVal: string;
      zipVal: string;
      countyVal: string;
    },
  ) => NewHandlerVal;
  extractAddressOptionsFromMainAddress: (
    address: string,
    states?: States,
  ) => { street: string; city: string; state: string | undefined; zip: string; county: string };
  manualStates: States;
  setManualStates: (states: States) => void;
  addressRepeated: (addressOne: string, addressTwo: string) => boolean;
}

export const addressHandlerStore = create<AddressDataHandler>((set, get) => ({
  manualStates: undefined,
  setManualStates: (manualStates) => {
    set({ manualStates: manualStates });
  },
  handlingMainAddressInput: (mainAddress) => {
    const { statesData } = adminDashboardStore.getState();
    const { manualStates } = get();

    let newVal = {
      street: '',
      city: '',
      state: '',
      zip: '',
      county: '',
      stateId: '1',
    };

    const addressArray = mainAddress.split(',');

    const currentStates = statesData || manualStates;

    switch (addressArray.length) {
      case 1:
        newVal.street = addressArray[0].replace(',', '');
        break;

      case 2:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        break;

      case 3:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        newVal.state =
          currentStates?.find(
            (el) =>
              el.state?.trim().toLowerCase() ===
              addressArray[2].replace(',', '').trim().toLowerCase(),
          )?.state || '';
        newVal.stateId =
          currentStates
            ?.find(
              (el) =>
                el.state?.trim().toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase() ||
                el.state_code.toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase(),
            )
            ?.id?.toString() || '';
        break;

      case 4:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        newVal.state =
          currentStates?.find(
            (el) =>
              el.state?.trim().toLowerCase() ===
              addressArray[2].replace(',', '').trim().toLowerCase(),
          )?.state || '';
        newVal.stateId =
          currentStates
            ?.find(
              (el) =>
                el.state?.trim().toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase() ||
                el.state_code.toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase(),
            )
            ?.id?.toString() || '';
        newVal.zip = addressArray[3].replace(',', '');
        break;

      case 5:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        newVal.state =
          currentStates?.find(
            (el) =>
              el.state?.trim().toLowerCase() ===
                addressArray[2].replace(',', '').trim().toLowerCase() ||
              el.state_code.toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase(),
          )?.state || '';
        newVal.stateId =
          currentStates
            ?.find(
              (el) =>
                el.state?.trim().toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase() ||
                el.state_code.toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase(),
            )
            ?.id?.toString() || '';
        newVal.zip = addressArray[3].replace(',', '');
        newVal.county = addressArray[4].replace(',', '');
        break;
    }

    return newVal;
  },
  handlingAddressData: (name, value, cases, prevValues) => {
    const { handlingMainAddressInput } = get();

    let newValues = {
      mainAddressVal: '',
      streetVal: '',
      cityVal: '',
      stateVal: '',
      zipVal: '',
      countyVal: '',
      stateIdVal: '1',
    };

    switch (name) {
      case cases.mainAddress:
        newValues.mainAddressVal = value;

        newValues.streetVal = handlingMainAddressInput(prevValues.mainAddressVal).street;
        newValues.cityVal = handlingMainAddressInput(prevValues.mainAddressVal).city;
        newValues.stateVal = handlingMainAddressInput(prevValues.mainAddressVal).state;
        newValues.zipVal = handlingMainAddressInput(prevValues.mainAddressVal).zip;
        newValues.countyVal = handlingMainAddressInput(prevValues.mainAddressVal).county;
        newValues.stateIdVal = handlingMainAddressInput(prevValues.mainAddressVal).stateId;

        break;

      case cases.street:
        newValues.streetVal = value;

        break;

      case cases.city:
        newValues.cityVal = value;

        break;

      case cases.state:
        newValues.stateIdVal = value;

        break;

      case cases.zip:
        newValues.zipVal = value;

        break;

      case cases.county:
        newValues.countyVal = value;

        break;
    }

    if (name !== cases.mainAddress) {
      newValues.mainAddressVal = `${prevValues.streetVal ? `${prevValues.streetVal}, ` : ''}${
        prevValues.cityVal ? `${prevValues.cityVal}` : ''
      }${prevValues.stateVal ? `, ${prevValues.stateVal}` : ''}${
        prevValues.zipVal ? `, ${prevValues.zipVal}` : ''
      }${prevValues.countyVal ? `, ${prevValues.countyVal}` : ''}`;
    }

    return newValues;
  },
  extractAddressOptionsFromMainAddress: (address, states) => {
    const { manualStates } = get();

    const [street, city, stateAddress, zip, county] = address.split(',');

    const currentStates = states || manualStates;

    const stateId = currentStates
      ?.find((state) => {
        const firstPattern =
          state.state?.trim().toLowerCase() === stateAddress?.trim().toLowerCase();
        const secondPattern =
          state.state_code?.trim().toLowerCase() === stateAddress?.trim().toLowerCase();

        return firstPattern || secondPattern;
      })
      ?.id?.toString();

    return {
      street: street?.trim(),
      city: city?.trim(),
      state: stateId,
      zip: zip?.trim(),
      county: county?.trim(),
    };
  },
  addressRepeated: (addressOne, addressTwo) => {
    const { statesData } = adminDashboardStore.getState();

    let repeated = false;

    const listChecks: boolean[] = [];

    if (addressOne && addressTwo) {
      if (addressOne.split(',').length === 5 && addressTwo.split(',').length === 5) {
        const [streetOne, cityOne, stateOne, zipOne, countyOne] = addressOne.split(',');
        const [streetTwo, cityTwo, stateTwo, zipTwo, countyTwo] = addressTwo.split(',');

        // street handling

        const streetOneFormatted = streetOne.trim().toLowerCase();
        const streetTwoFormatted = streetTwo.trim().toLowerCase();

        if (streetOneFormatted === streetTwoFormatted) {
          listChecks.push(true);
        }

        // city handling

        const cityOneFormatted = cityOne.trim().toLowerCase();
        const cityTwoFormatted = cityTwo.trim().toLowerCase();

        if (cityOneFormatted === cityTwoFormatted) {
          listChecks.push(true);
        }

        // state handling

        const stateSelected = (stateName: string) => {
          return statesData
            ?.find((state) => {
              const firstPattern =
                state.state?.trim().toLowerCase() === stateName.trim().toLowerCase();
              const secondPattern =
                state.state_code?.trim().toLowerCase() === stateName.trim().toLowerCase();

              return firstPattern || secondPattern;
            })
            ?.id?.toString();
        };

        const stateOneFormatted = stateSelected(stateOne);
        const stateTwoFormatted = stateSelected(stateTwo);

        if (stateOneFormatted && stateTwoFormatted) {
          if (stateOneFormatted === stateTwoFormatted) {
            listChecks.push(true);
          }
        }

        // zip handling

        const zipOneFormatted = zipOne.trim().toLowerCase();
        const zipTwoFormatted = zipTwo.trim().toLowerCase();

        if (zipOneFormatted === zipTwoFormatted) {
          listChecks.push(true);
        }

        // county handling

        const countyOneFormatted = countyOne.trim().toLowerCase();
        const countyTwoFormatted = countyTwo.trim().toLowerCase();

        if (countyOneFormatted === countyTwoFormatted) {
          listChecks.push(true);
        }

        if (listChecks.length === 5) {
          repeated = true;
        }
      }
    }

    return repeated;
  },
}));
