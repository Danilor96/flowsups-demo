import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { FormTitle } from '&/login/FormTitle';
import { SignInForm } from '&/login/sign_in/SignInForm';
import Image from 'next/image';
import { SessionExpiration } from './ui/login/sessionExpiration/SessionExpiration';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default async function Home({ searchParams }: { searchParams: { reason?: string } }) {
  const session = await auth();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <main>
      <section className="flex flex-col lg:flex-row lg:h-[100vh] min-h-screen">
        <div className="relative w-full lg:w-[42.1875vw] flex flex-col">
          <SessionExpiration reason={searchParams.reason} />
          <Image
            className="w-36 sm:w-40 h-auto ml-4 mt-4 lg:w-[9.21875vw] lg:ml-[1.614583vw] lg:mt-[2.222222vh]"
            width={219}
            height={52}
            src="/flowsups.png"
            alt="Logo of flowsups app"
          />
          <aside className="w-full max-w-md mx-auto my-8 px-5 py-6 flex flex-col items-center shadow-crmFormShadow rounded-[0.520833vw] lg:max-w-none lg:w-[32.65625vw] lg:h-fit lg:my-auto lg:ml-[4.479167vw] lg:mr-[5.052083vw] lg:pr-[3.441667vw] lg:pl-[4.635417vw] lg:pb-[0.925926vh] lg:pt-[2.332407vh]">
            <FormTitle title="Sign in" text="Enter your details to continue" />
            <SignInForm />
          </aside>
        </div>
        <div className="hidden lg:block relative w-[57.8125vw]">
          <Image
            src="/loginImage.png"
            alt="Presentation image of the CRM app"
            width={1110}
            height={1080}
            className="w-[57.8125vw] h-[100vh]"
          ></Image>
          <aside className="absolute top-0 right-0 bottom-0 left-0 bg-[#009075B5]">
            <section className="w-[46.041667vw] h-[22.222222vh] ml-[3.802083vw] mt-[67.5vh] border-t border-[#FFFFFF]">
              <p className="w-full h-[11.111111vh] text-[3.703704vh] font-semibold leading-[5.555556vh] text-[#FFFFFF] mt-[1.944444vh]">
                START MANAGING YOUR BUSINESS WITH FLOWSUPS
              </p>
              <p className="w-full h-[7.222222vh] text-[2.407407vh] font-light leading-[3.611111vh] mt-[1.944444vh] text-[#FFFFFF]">
                A unique CRM that will make you improve your sales exponentially
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
