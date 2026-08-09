import prisma from '../prisma';

export async function extractAndValidateAddressInfo(address: string) {
  let street,
    city,
    state,
    zip = false;

  if (!address) return { street, city, state, zip };

  const addressArray = address.split(',');

  if (addressArray.length === 1 && addressArray[0].trim()) street = true;

  if (addressArray.length >= 2 && addressArray[0].trim() && addressArray[1].trim()) {
    street = true;
    city = true;
  }

  if (addressArray.length >= 4 && addressArray[3].trim().length >= 5) zip = true;

  const states = await prisma.states.findMany();

  const statesExists = states.find((el) => {
    const state = el.state.toLowerCase().trim();
    const stateAbb = el.state_code.toLowerCase().trim();

    const incomingStateSelected = addressArray.find((elAddress) => {
      const stateSelected = elAddress.toLowerCase().trim();

      return stateSelected === state || stateSelected === stateAbb ? elAddress : null;
    });

    if (incomingStateSelected) return el;

    return null;
  });

  if (statesExists) state = true;

  return {
    street,
    city,
    state,
    zip,
  };
}

interface AddressDatabase {
  street: string;
  city: string;
  stateId: number;
  zip: string;
  countyId: number | null;
}

export async function returnAddressInfoForDatabase(address: string) {
  const addressValues: AddressDatabase = {
    street: '',
    city: '',
    stateId: 0,
    zip: '',
    countyId: null,
  };

  const addressArray = address.split(',');

  addressValues.street = addressArray[0];

  addressValues.city = addressArray[1];

  addressValues.zip = addressArray[3];

  const states = await prisma.states.findMany();

  const stateSelected = states.find((el) => {
    const state = el.state.toLowerCase().trim();
    const stateAbb = el.state_code.toLowerCase().trim();
    const incomingStateSelected = addressArray[2].toLowerCase().trim();

    return state === incomingStateSelected || stateAbb === incomingStateSelected ? el : null;
  });

  addressValues.stateId = stateSelected?.id || 0;

  const counties = await prisma.county.findMany();

  const countySelected = counties.find((el) => {
    const county = el.county.toLowerCase().trim();
    const incomingCountySelected = addressArray[4];

    if (!incomingCountySelected) return null;

    return county === incomingCountySelected.toLowerCase().trim();
  });

  if (!countySelected && addressArray[4]) {
    await prisma.county.create({
      data: {
        county: addressArray[4],
      },
    });
  } else if (countySelected) {
    addressValues.countyId = countySelected.id;
  }

  return addressValues;
}
