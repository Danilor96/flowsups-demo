import { deleteCreditAppCode } from '@/app/libs/actions';
import {
  getCreditAddressMonths,
  getCreditAppAddressType,
  getCreditAppCode,
  getCustomerCreditAppData,
  getEmploymentStatus,
  getGender,
  getIdTtype,
  getStates,
  getOccupation,
  getIncomeType,
  getReferenceRelationship,
  getIdStates,
  getCustomerAddress,
} from '@/app/libs/data';
import { CreditApp } from '&/creditApp/CreditApp';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credit App',
};

export default async function Page({ params }: { params: { code: string } }) {
  const code = params.code;
  const customerEntry = await getCreditAppCode(code);
  const creditApp = await getCustomerCreditAppData(customerEntry?.customer_id);
  const codeExpDate = customerEntry && customerEntry.code_expired;
  const currentDate = new Date();
  const idType = await getIdTtype();
  const genders = await getGender();
  const creditAppMonths = await getCreditAddressMonths();
  const creditAppAddressTypes = await getCreditAppAddressType();
  const states = await getStates();
  const idStateData = await getIdStates();
  const employmentStatus = await getEmploymentStatus();
  const occupation = await getOccupation();
  const incomeType = await getIncomeType();
  const referencesRelationship = await getReferenceRelationship();
  const customerAddress = await getCustomerAddress(customerEntry?.customer_id);

  //check if the user is logged
  // if (session?.user) {
  //   return redirect('/dashboard');
  // }

  //check if the customer has a valid consent code
  if (!customerEntry || !creditApp) {
    notFound();
  }

  //check the expiration date of the consent code
  if (codeExpDate && currentDate > codeExpDate) {
    deleteCreditAppCode(code);
    notFound();
  }

  return (
    <CreditApp
      customerId={customerEntry.customer_id}
      creditApp={creditApp}
      idType={idType}
      genders={genders}
      creditAppMonths={creditAppMonths}
      creditAppAddressTypes={creditAppAddressTypes}
      states={states}
      employmentStatus={employmentStatus}
      occupation={occupation}
      incomeType={incomeType}
      referencesRelationship={referencesRelationship}
      idStateData={idStateData}
      defaultAddress={customerAddress}
    />
  );
}
