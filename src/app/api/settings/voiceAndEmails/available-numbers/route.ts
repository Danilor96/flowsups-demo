import { NextRequest, NextResponse } from 'next/server';

const cannedAvailableNumbers = [
  {
    friendlyName: '(305) 555-0199',
    phoneNumber: '+13055550199',
    locality: 'Miami',
    region: 'FL',
    isoCountry: 'US',
    addressRequirements: 'none',
  },
  {
    friendlyName: '(305) 555-0198',
    phoneNumber: '+13055550198',
    locality: 'Miami',
    region: 'FL',
    isoCountry: 'US',
    addressRequirements: 'none',
  },
  {
    friendlyName: '(305) 555-0197',
    phoneNumber: '+13055550197',
    locality: 'Hialeah',
    region: 'FL',
    isoCountry: 'US',
    addressRequirements: 'none',
  },
  {
    friendlyName: '(786) 555-0196',
    phoneNumber: '+17865550196',
    locality: 'Miami',
    region: 'FL',
    isoCountry: 'US',
    addressRequirements: 'none',
  },
  {
    friendlyName: '(786) 555-0195',
    phoneNumber: '+17865550195',
    locality: 'Coral Gables',
    region: 'FL',
    isoCountry: 'US',
    addressRequirements: 'none',
  },
  {
    friendlyName: '(954) 555-0194',
    phoneNumber: '+19545550194',
    locality: 'Fort Lauderdale',
    region: 'FL',
    isoCountry: 'US',
    addressRequirements: 'none',
  },
  {
    friendlyName: '(954) 555-0193',
    phoneNumber: '+19545550193',
    locality: 'Hollywood',
    region: 'FL',
    isoCountry: 'US',
    addressRequirements: 'none',
  },
];

export async function GET(request: NextRequest) {
  try {
    const availableNumbers = cannedAvailableNumbers;

    if (availableNumbers.length === 0) {
      return NextResponse.json(
        { error: 'No hay números disponibles con los criterios seleccionados.' },
        { status: 404 },
      );
    }

    return NextResponse.json(availableNumbers, { status: 200 });
  } catch (error) {
    console.error('Error fetching Twilio numbers:', error);
    return NextResponse.json({ serverError: 'Error fetching numbers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const availableNumbers = cannedAvailableNumbers;

    if (availableNumbers.length === 0) {
      return NextResponse.json(
        { error: 'No hay números disponibles con los criterios seleccionados.' },
        { status: 404 },
      );
    }

    return NextResponse.json(availableNumbers, { status: 200 });
  } catch (error) {
    console.error('Error fetching Twilio numbers:', error);
    return NextResponse.json({ serverError: 'Error fetching numbers' }, { status: 500 });
  }
}