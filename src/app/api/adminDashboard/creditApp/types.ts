export interface StartData {
  ssn?: string | null;
  dateOfBirth?: Date | null;
  idType?: number | null;
  noId?: boolean | null;
  idNumber?: string | null;
  issueDate?: Date | null;
  expirationDate?: Date | null;
  cashdown?: string | null;
  gender?: number | null;
  consent?: boolean | null;
  idState?: number | null;
}

export interface PrevAddress {
  id?: number | null;
  address?: string | null;
  year?: string | null;
  month?: number | null;
  addressType?: number | null;
  rentMortAmt?: string | null;
  stateId?: number | null;
}

export interface AddressData {
  id?: number | null;
  currentAddress?: string | null;
  currentYear?: string | null;
  currentMonth?: number | null;
  currentAddressType?: number | null;
  currentRentMortAmt?: string | null;
  mailingAddress?: string | null;
  sameAsCurrentAddress?: boolean | null;
  currentStateId?: number | null;
  mailingStateId?: number | null;
  prevAddress?: PrevAddress[] | null;
}

export interface PrevEmploymentStatus {
  id?: number | null;
  employmentName?: string | null;
  addressId?: number | null;
  address?: string | null;
  phoneNumber?: string | null;
  employmentStatus?: number | null;
  occupation?: number | null;
  year?: string | null;
  month?: number | null;
  incomeType?: number | null;
  montlyIncome?: string | null;
  hourlyWage?: string | null;
  yearToDate?: string | null;
}

export interface EmploymentStatus {
  id?: number | null;
  currentEmploymentName?: string | null;
  addressId?: number | null;
  currentAddress?: string | null;
  currentPhoneNumber?: string | null;
  currentEmploymentStatus?: number | null;
  currentOccupation?: number | null;
  currentYear?: string | null;
  currentMonth?: number | null;
  currentIncomeType?: number | null;
  currentMontlyIncome?: string | null;
  currentHourlyWage?: string | null;
  currentYearToDate?: string | null;
  hasBankAccount?: boolean | null;
  prevEmploymentData?: PrevEmploymentStatus[] | null;
}

export interface References {
  id?: number | null;
  name?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  relationship?: number | null;
}

export interface ReferencesData {
  id?: number | null;
  otherIncomeAmount?: string | null;
  otherIncomeSource?: string | null;
  references?: References[] | null;
}

export interface CreditAppData {
  start: StartData;
  address: AddressData;
  employmentStatus: EmploymentStatus;
  references: ReferencesData;
}
