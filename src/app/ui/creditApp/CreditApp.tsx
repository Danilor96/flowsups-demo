'use client';

import { ProcessProgress } from './processProgress/ProcessProgress';
import { Start } from './start/Start';
import { publicCreditAppPageStore } from '@/store/creditApp';
import { Address, DefaultAddress } from './address/Address';
import { EmploymentStatus } from './emplymentStatus/EmploymentStatus';
import { References } from './references/References';
import { CreditAppData } from '@/app/api/adminDashboard/creditApp/types';

export function CreditApp({
  idType,
  genders,
  creditAppMonths,
  creditAppAddressTypes,
  states,
  employmentStatus,
  occupation,
  incomeType,
  referencesRelationship,
  creditApp,
  customerId,
  idStateData,
  defaultAddress,
}: {
  customerId: number;
  creditApp: CreditAppData;
  creditAppMonths:
    | {
        id: number;
        month: string;
      }[]
    | undefined;
  idType:
    | {
        id: number;
        id_type: string;
      }[]
    | undefined;
  genders:
    | {
        id: number;
        gender: string;
      }[]
    | undefined;
  creditAppAddressTypes:
    | {
        id: number;
        type: string;
      }[]
    | undefined;
  states:
    | {
        id: number;
        state: string;
        state_code: string;
      }[]
    | undefined;
  employmentStatus?: {
    id: number;
    status: string;
  }[];
  occupation?: {
    id: number;
    occupation: string;
  }[];
  incomeType?: {
    id: number;
    income: string;
  }[];
  referencesRelationship?: {
    id: number;
    relationship: string;
  }[];
  idStateData:
    | {
        id: number;
        id_state: string;
      }[]
    | undefined;
  defaultAddress?: DefaultAddress | null;
}) {
  // ----- global states -----

  const { currentPage } = publicCreditAppPageStore();

  // ----- local states -----

  const pages = [
    <Start
      key={0}
      idType={idType}
      genders={genders}
      customerId={customerId}
      idStateData={idStateData}
      creditAppDefault={creditApp}
    />,
    <Address
      key={1}
      creditAppAddressTypes={creditAppAddressTypes}
      creditAppMonths={creditAppMonths}
      states={states}
      customerId={customerId}
      defaultAddress={defaultAddress}
      creditAppDefault={creditApp}
    />,
    <EmploymentStatus
      key={2}
      employmentStatus={employmentStatus}
      occupation={occupation}
      creditAppMonhts={creditAppMonths}
      incomeType={incomeType}
      states={states}
      creditAppDefault={creditApp}
      customerId={customerId}
    />,
    <References
      key={3}
      referencesRelationship={referencesRelationship}
      states={states}
      customerId={customerId}
      creditAppDefault={creditApp}
    />,
    <h2 key={4}>Thank you. The process was successful. You can close this window.</h2>,
  ];

  return (
    <>
      {currentPage !== 4 && <ProcessProgress />}
      {pages.map((el, index) => index === currentPage && el)}
    </>
  );
}
