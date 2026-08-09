import { deleteConsentCode } from '@/app/libs/actions';
import { getAConsentCode, getStates, getChecks, getStatement } from '@/app/libs/data';
import { CustomerConsent } from '@/app/ui/customer/CustomerConsent';
import { auth } from '@/auth';
import { notFound, redirect } from 'next/navigation';

export default async function Page({ params }: { params: { code: string } }) {
  const session = await auth();
  const code = params.code;
  const customerEntry = await getAConsentCode(code);
  const codeExpDate = customerEntry && customerEntry.code_expired;
  const actualDate = new Date();
  const states = await getStates();
  const checks = await getChecks();
  const statement = await getStatement();

  //check if the user is logged
  // if (session?.user) {
  //   return redirect('/dashboard');
  // }

  //check if the customer has a valid consent code
  if (!customerEntry && code !== 'test') {
    notFound();
  }

  //check the expiration date of the consent code
  if (codeExpDate && actualDate > codeExpDate && code !== 'test') {
    deleteConsentCode(code);
    notFound();
  }

  return (
    <CustomerConsent
      data={customerEntry || null}
      statesData={states}
      checks={checks}
      statement={statement}
      test={code === 'test' ? true : false}
    />
  );
}
