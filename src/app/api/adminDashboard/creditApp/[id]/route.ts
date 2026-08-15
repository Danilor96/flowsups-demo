import { mockDb } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { CreditAppData, PrevAddress, PrevEmploymentStatus, References } from '../types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const customerId = Number(params.id);

  try {
    const creditAppData = mockDb.credit_app.findUnique({
      where: {
        client_id: customerId,
      },
    });

    const addressData = mockDb.credit_app_address.findFirst({
      where: {
        client_id: customerId,
      },
    });

    const employmentData = mockDb.customer_employment.findMany({
      where: {
        client_id: customerId,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const prevAddress: PrevAddress[] | undefined | null = addressData?.prev_address.map(
      (address: Record<string, any>) => ({
        id: address.id,
        address: address.prev_address,
        year: address.prev_year,
        month: address.prev_month_id,
        addressType: address.prev_address_type_id,
        rentMortAmt: address.prev_rent_mort,
        stateId: address.prev_state_id,
      }),
    );

    const filteredData = employmentData.filter((_, index) => index !== 0);

    const prevEmploymentData: PrevEmploymentStatus[] | null | undefined = filteredData.map(
      (el) => ({
        id: el.id,
        employmentName: el.previous_employer_name,
        addressId: el.customer_employment_address[0].id,
        address: el.customer_employment_address[0].previous_address,
        phoneNumber: el.customer_employment_address[0].previous_phone_number,
        employmentStatus: el.employment_status_id,
        occupation: el.occupation_id,
        year: el.year,
        month: el.month_id,
        incomeType: el.income_type_id,
        montlyIncome: el.montly_income,
        hourlyWage: el.hourlyWage,
        yearToDate: el.yearToDate,
      }),
    );

    const referencesData = mockDb.credit_app_reference.findMany({
      where: {
        customer_id: customerId,
      },
      orderBy: {
        id: 'asc',
      },
    });

    const references: References[] | undefined | null = referencesData.map((el) => ({
      id: el.id,
      name: el.name,
      address: el.address,
      phoneNumber: el.phone_number,
      relationship: el.relationship_id,
    }));

    const creditApp: CreditAppData = {
      start: {
        ssn: creditAppData?.ssn,
        dateOfBirth: creditAppData?.date_of_birth,
        idType: creditAppData?.id_type_id,
        noId: creditAppData?.no_id,
        idNumber: creditAppData?.id_number,
        issueDate: creditAppData?.id_issue_date,
        expirationDate: creditAppData?.id_expiration_date,
        cashdown: creditAppData?.cash_down,
        gender: creditAppData?.gender_id,
        consent: creditAppData?.send_automated_sms,
        idState: creditAppData?.id_state_id,
      },
      address: {
        id: addressData?.id,
        currentAddress: addressData?.current_address,
        currentYear: addressData?.current_year,
        currentMonth: addressData?.current_month_id,
        currentAddressType: addressData?.current_address_type_id,
        currentRentMortAmt: addressData?.current_rent_mort,
        mailingAddress: addressData?.mailing_address,
        sameAsCurrentAddress: addressData?.mailing_same_as_current,
        currentStateId: addressData?.current_state_id,
        mailingStateId: addressData?.mailing_state_id,
        prevAddress: prevAddress,
      },
      employmentStatus: {
        id: employmentData[0]?.id,
        currentEmploymentName: employmentData[0]?.current_employer_name,
        addressId: employmentData[0]?.customer_employment_address[0].id,
        currentAddress: employmentData[0]?.customer_employment_address[0].current_address,
        currentPhoneNumber: employmentData[0]?.customer_employment_address[0].current_phone_number,
        currentEmploymentStatus: employmentData[0]?.employment_status_id,
        currentOccupation: employmentData[0]?.occupation_id,
        currentYear: employmentData[0]?.year,
        currentMonth: employmentData[0]?.month_id,
        currentIncomeType: employmentData[0]?.income_type_id,
        currentMontlyIncome: employmentData[0]?.montly_income,
        currentHourlyWage: employmentData[0]?.hourlyWage,
        currentYearToDate: employmentData[0]?.yearToDate,
        hasBankAccount: employmentData[0]?.has_bank_account,
        prevEmploymentData: prevEmploymentData,
      },
      references: {
        id: referencesData[0]?.customer?.credit_app_other_income[0]?.id,
        otherIncomeAmount: referencesData[0]?.customer?.credit_app_other_income[0]?.income_amount,
        otherIncomeSource: referencesData[0]?.customer?.credit_app_other_income[0]?.income_source,
        references: references,
      },
    };

    return NextResponse.json(creditApp);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
