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
      <section className="flex flex-row h-[100vh]">
        <div className="w-[44.323vw] flex flex-col">
          <Image
            className="w-[9.21875vw] h-auto ml-[1.614583vw] mt-[2.222222vh]"
            width={219}
            height={52}
            src="/flowsups.png"
            alt="Logo of flowsups app"
          />
          <aside className="w-[34.427083vw] h-fit shadow-crmFormShadow rounded-[0.520833vw] mb-[9.907407vh] mt-[3.333333vh] ml-[4.947917vw] mr-[4.947917vw] pl-[4.895833vw] pt-[2.685185vh] pr-[4.947917vw] pb-[1.203703vh] flex flex-col items-center">
            <FormTitle title="Sign up" text="Enter your details to continue" />
            <SignUpForm newUserEmail={newUserEmail} />
            <div className="mt-[4.167593vh] w-[20.625vw] h-[2.685185vh] flex flex-row justify-between items-center mx-auto">
              <p className="text-[1.859259vh] font-medium leading-[2.231481vh] text-[#B3B3B3]">
                Already have an account?
              </p>
              <Link
                className="underline text-[1.859259vh] font-semibold leading-[2.788889vh] text-mainColor"
                href="/"
              >
                Sign in
              </Link>
            </div>
          </aside>
        </div>
        <div className="relative w-[55.677vw]">
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
