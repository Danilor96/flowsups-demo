import { FormTitle } from '&/login/FormTitle';
import { ForgotPasswordForm } from '&/login/forgot_password/ForgotPasswordForm';
import Image from 'next/image';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserCode } from '@/app/libs/data';
import { deleteActivationCode } from '@/app/libs/actions';
import { ChangePassword } from '@/app/ui/login/forgot_password/changePassword/ChangePassword';

export default async function ForgotPasswordPage({ params }: { params: { code: string } }) {
  const session = await auth();
  const code = params.code;
  const userCode = await getUserCode(code);
  const codeExpDate = userCode?.activation_code_expired;
  const currentDate = new Date();

  //check if the user is logged
  if (session?.user) {
    redirect('/dashboard');
  }

  //check if the user has a valid reset code
  if (!userCode) {
    redirect('/');
  }

  //check the code expiration date
  if (codeExpDate && currentDate > codeExpDate) {
    await deleteActivationCode(code);
    redirect('/');
  }

  return (
    <main>
      <section className="flex flex-col lg:flex-row lg:h-[100vh] min-h-screen">
        <div className="w-full lg:w-[42.5vw] flex flex-col">
          <Image
            className="w-36 sm:w-40 h-auto ml-4 mt-4 lg:w-[9.21875vw] lg:ml-[1.614583vw] lg:mt-[2.222222vh]"
            width={219}
            height={52}
            src="/flowsups.png"
            alt="Logo of flowsups app"
          />
          <aside className="w-full max-w-md mx-auto my-8 px-5 py-6 flex flex-col items-center shadow-crmFormShadow rounded-[0.520833vw] lg:max-w-none lg:w-[32.65625vw] lg:h-fit lg:mt-[20.277778vh] lg:mb-[26.111111vh] lg:ml-[4.895833vw] lg:mr-[4.947917vw] lg:pt-[2.314815vh] lg:pl-[4.114583vw] lg:pr-[3.958333vw] lg:pb-[2.685185vh]">
            <FormTitle title="Forgot your password" text="Enter a new password" />
            <ChangePassword userEmail={userCode.code_data[0].user.email} />
          </aside>
        </div>
        <div className="hidden lg:block relative w-[57.5vw]">
          <Image
            src="/loginImage.png"
            alt="Presentation image of the CRM app"
            width={1110}
            height={1080}
            className="w-[57.5vw] h-[100vh]"
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
