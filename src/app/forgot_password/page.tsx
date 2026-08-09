import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { FormTitle } from '&/login/FormTitle';
import { ForgotPasswordForm } from '../ui/login/forgot_password/ForgotPasswordForm';

export default async function Page() {
  const session = await auth();

  //check if the user is logged
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <main>
      <section className="flex flex-row h-[100vh]">
        <div className="w-[42.1875vw] flex flex-col">
          <Image
            className="w-[9.21875vw] h-auto ml-[1.614583vw] mt-[2.222222vh]"
            width={219}
            height={52}
            src="/flowsups.png"
            alt="Logo of flowsups app"
          />
          <aside className="w-[32.65625vw] h-[43vh] flex flex-col items-center mt-[22vh] ml-[4.479167vw] mb-[17.5vh] mr-[5.052083vw] pr-[3.441667vw] pl-[4.635417vw] pb-[0.925926vh] pt-[2.332407vh] shadow-crmFormShadow rounded-[0.520833vw]">
            <FormTitle
              title="Forgot your password"
              text="Enter your email address to reset your password"
            />
            <ForgotPasswordForm />
          </aside>
        </div>
        <div className="relative w-[57.8125vw]">
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
                START MANAGING YOUR BUSINESS WITH FLOWSUP
              </p>
              <p className="w-full h-[7.222222vh] text-[2.407407vh] font-light leading-[3.611111vh] mt-[1.944444vh] text-[#FFFFFF]">
                A unique CMR that will make you improve your sales exponentially
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
