import { FormTitle } from '@/app/ui/login/FormTitle';
import { SignUpForm } from '@/app/ui/login/sign_up/SignUpForm';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth';
import { getUserCode } from '@/app/libs/data';
import { redirect } from 'next/navigation';
import { deleteActivationCode } from '@/app/libs/actions';

export default async function SignUpPage({ params }: { params: { code: string } }) {
  const session = await auth();
  const code = params.code;
  const newUser = await getUserCode(code);
  const newUserEmail = newUser?.code_data[0].user.email || '';
  const codeExpDate = newUser?.activation_code_expired || '';
  const actualDate = new Date();

  //check if the user is logged
  if (session?.user) {
    return redirect('/dashboard');
  }

  //check if the user has a valid activation code
  if (!newUser) {
    return redirect('/');
  }

  //check the expiration date of the activation code
  if (codeExpDate && actualDate > codeExpDate) {
    deleteActivationCode(code);
    return redirect('/');
  }

  return (
    <main>
      <section className="flex flex-col lg:flex-row lg:h-[100vh] min-h-screen">
        <div className="w-full lg:w-[44.323vw] flex flex-col">
          <Image
            className="w-36 sm:w-40 h-auto ml-4 mt-4 lg:w-[9.21875vw] lg:ml-[1.614583vw] lg:mt-[2.222222vh]"
            width={219}
            height={52}
            src="/flowsups.png"
            alt="Logo of flowsups app"
          />
          <aside className="w-full max-w-md mx-auto my-8 px-5 py-6 flex flex-col items-center shadow-crmFormShadow rounded-[0.520833vw] lg:w-[34.427083vw] lg:h-fit lg:mb-[9.907407vh] lg:mt-[3.333333vh] lg:ml-[4.947917vw] lg:mr-[4.947917vw] lg:pl-[4.895833vw] lg:pt-[2.685185vh] lg:pr-[4.947917vw] lg:pb-[1.203703vh]">
            <FormTitle title="Sign up" text="Enter your details to continue" />
            <SignUpForm newUserEmail={newUserEmail} />
            <div className="mt-[4.167593vh] w-[20.625vw] h-[2.685185vh] flex flex-row justify-between items-center mx-auto max-lg:mt-4 max-lg:w-full max-lg:h-auto max-lg:justify-center max-lg:gap-2 max-lg:flex-wrap">
              <p className="text-[1.859259vh] font-medium leading-[2.231481vh] text-[#B3B3B3] max-lg:text-sm">
                Already have an account?
              </p>
              <Link
                className="underline text-[1.859259vh] font-semibold leading-[2.788889vh] text-mainColor max-lg:text-sm"
                href="/"
              >
                Sign in
              </Link>
            </div>
          </aside>
        </div>
        <div className="hidden lg:block relative w-[55.677vw]">
          <Image
            src="/loginImage.png"
            alt="Presentation image of the CRM app"
            width={1110}
            height={1080}
            className="w-[55.677vw] h-[100vh]"
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
