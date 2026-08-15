import { mockDb } from '@/app/libs/mock-db';
import { TemplateVariablesValues } from '@/app/libs/definitions';
import {
  CreditAppData,
  PrevAddress,
  PrevEmploymentStatus,
  References,
} from '../api/adminDashboard/creditApp/types';

// get new sign up data logic

export async function getUserCode(code: string) {
  try {
    const toActivateUser = mockDb.activation_codes.findUnique({
      where: {
        code,
      },
    });

    return toActivateUser;
  } catch (error) {
    console.log(error);
  }
}

// get all users logic

export async function getAllUsers() {
  try {
    const users = mockDb.users.findMany({
      where: {
        deleted_at: null,
      },
    });

    return users;
  } catch (error) {
    console.log(error);
  }
}

// get all roles logic

export async function getAllRoles() {
  try {
    const roles = mockDb.roles.findMany({
      where: {
        NOT: {
          id: 1,
        },
      },
    });

    return roles;
  } catch (error) {
    console.log(error);
  }
}

// get all task status logic
export async function getAllTaskStatuses() {
  try {
    const statuses = mockDb.task_status.findMany();

    return statuses;
  } catch (error) {
    console.log(error);
  }
}

// get an user logic

export async function getAnUser(email: string) {
  try {
    const user = mockDb.users.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
  }
}

// get an user activation code logic

export async function getAnUserActivationCode(codeToVerify: string) {
  try {
    const code = mockDb.activation_codes.findUnique({
      where: {
        code: codeToVerify,
      },
    });

    return code;
  } catch (error) {
    console.log(error);
  }
}

// get all lead types logic (listo)

export async function getAllLeadTypes() {
  try {
    const data = mockDb.lead_types.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all lead sources logic (listo)

export async function getAllLeadSources() {
  try {
    const data = mockDb.lead_sources.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all contact methods logic

export async function getAllContactMethods() {
  try {
    const data = mockDb.contact_methods.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all inquiry types logic

export async function getAllInquiryTypes() {
  try {
    const data = mockDb.inquiry_types.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all genders logic

export async function getAllGenders() {
  try {
    const data = mockDb.genders.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all seller users logic (listo)

export async function getAllSellerUsers() {
  try {
    const data = mockDb.users.findMany({
      where: {
        user_has: {
          some: {
            role_id: 3,
          },
        },
        deleted_at: null,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all clients logic (listo)

export async function getAllClients() {
  try {
    const data = mockDb.clients.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get a client by id logic
export async function getClientById(id: number) {
  try {
    const data = mockDb.clients.findUnique({
      where: {
        id: id,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all vehicles logic (listo)
export async function getAllVehicles() {
  try {
    const data = mockDb.vehicles.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all appointments statuses logic (listo)
export async function getAllAppointmentStatuses() {
  try {
    const data = mockDb.appointments_status.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all appointments logic (listo)
export async function getAllAppointments() {
  try {
    const data = mockDb.appointments.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get an appointment by id logic
export async function getAppointmentById(id: number) {
  try {
    const data = mockDb.appointments.findUnique({
      where: {
        id,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all sellers users logic
export async function getSellersUsers() {
  try {
    const data = mockDb.users.findMany({
      where: {
        user_has: {
          some: {
            role_id: {
              not: 1,
            },
            AND: {
              role_id: {
                not: 2,
              },
            },
          },
        },
        deleted_at: null,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get all client types logic (listo)
export async function getAllClientTypes() {
  try {
    const data = mockDb.client_types.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get a customer consent code
export async function getAConsentCode(code: string) {
  try {
    const data = mockDb.consent_code.findUnique({
      where: {
        token: code,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get id states

export async function getIdStates() {
  try {
    const data = mockDb.client_id_state.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get states
export async function getStates() {
  try {
    const data = mockDb.states.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get a customer appointment
export async function getCustomerAppointment(appointmentId: string) {
  const appId = parseInt(appointmentId);

  try {
    const data = mockDb.appointments.findUnique({
      where: {
        id: appId,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}

// get customer sms template variables values`

export async function getCustomerSmsTemplateVariablesValues(customerId: string) {
  const customerIdNumber = parseInt(customerId);

  try {
    const data = mockDb.clients.findUnique({
      where: {
        id: customerIdNumber,
      },
    });

    return data as TemplateVariablesValues;
  } catch (error) {
    console.log(error);
  }
}

// return user data for login

type UserDataForLogin = {
  email: string;
  password: string | null;
  user_has: {
    role_id: number;
    role: {
      role: string;
    };
  }[];
} | null;

export const getUserEmailAndPassword = async (
  email: string | undefined,
): Promise<UserDataForLogin> => {
  try {
    const user = mockDb.users.findFirst({
      where: {
        email: email,
      },
    });

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);

    return null;
  }
};

// get credit app code

export const getCreditAppCode = async (code: string) => {
  try {
    const data = mockDb.credit_app_code.findUnique({
      where: {
        token: code,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

// get customer credit app info

export const getCustomerCreditAppData = async (customerId?: number) => {
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
      (address: any) => ({
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
      (el: any) => ({
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

    const references: References[] | undefined | null = referencesData.map((el: any) => ({
      id: el.id,
      name: el.name,
      address: el.address,
      phoneNumber: el.phone_number,
      relationship: el.relationship_id,
    }));

    let ssnVal = creditAppData?.ssn;
    let dateOfBirthVal = creditAppData?.date_of_birth;

    if (!ssnVal || !dateOfBirthVal) {
      const customerDefaultData = mockDb.clients.findUnique({
        where: {
          id: customerId,
        },
      });

      ssnVal = customerDefaultData?.social_security;
      dateOfBirthVal = customerDefaultData?.born_date;
    }

    const creditApp: CreditAppData = {
      start: {
        ssn: ssnVal,
        dateOfBirth: dateOfBirthVal,
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

    return creditApp;
  } catch (error) {
    console.log(error);
  }
};

// get id type

export const getIdTtype = async () => {
  try {
    const data = mockDb.client_id_type.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// get gender

export const getGender = async () => {
  try {
    const data = mockDb.genders.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// credit address month

export const getCreditAddressMonths = async () => {
  try {
    const data = mockDb.credit_app_address_months.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// credit app address type

export const getCreditAppAddressType = async () => {
  try {
    const data = mockDb.credit_app_address_type.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
};

// address preliminary data

export const addressPreliminaryData = async (customerId?: number) => {
  try {
    const data = mockDb.credit_app_address.findFirst({
      where: {
        client_id: customerId,
      },
    });

    const data2 = mockDb.credit_app_address_prev.findMany({
      where: {
        credit_app_address_id: data?.id,
      },
    });

    return { data, data2 };
  } catch (error) {
    console.log(error);
  }
};

export const getCustomerAddress = async (customerId?: number) => {
  try {
    const address = mockDb.clients.findUnique({
      where: {
        id: customerId,
      },
    });

    return address;
  } catch (error) {
    console.log(error);
  }
};

// employment status

export const getEmploymentStatus = async () => {
  try {
    const data = mockDb.employment_statuses.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getOccupation = async () => {
  try {
    const data = mockDb.customer_occupation.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getIncomeType = async () => {
  try {
    const data = mockDb.customer_income_type.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCreditAppEmploymentPreliminary = async (customerId?: number) => {
  try {
    const data = mockDb.customer_employment.findMany({
      where: {
        client_id: customerId,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getReferenceRelationship = async () => {
  try {
    const data = mockDb.credit_app_reference_relationship.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getChecks = async () => {
  try {
    const data = mockDb.consent_checks.findMany();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getStatement = async () => {
  try {
    const data = mockDb.consent_terms.findFirst();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCustomerRelatedUsers = async (customerId: string) => {
  try {
    const customerData = mockDb.leads.findFirst({
      where: {
        is_active: true,
        id: Number(customerId),
      },
    });

    const relatedUsersArray = customerData
      ? [
          customerData.sales_rep_id,
          customerData.bdc_id,
          customerData.sales_manager_id,
          customerData.finance_manager_id,
        ]
      : [];

    return relatedUsersArray;
  } catch (error) {
    console.log(error);

    return null;
  }
};