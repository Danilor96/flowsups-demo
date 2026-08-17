import { FormTitle } from '&/login/FormTitle';
import { auth } from '@/auth';
import jwt from 'jsonwebtoken';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { ChangePasswordForm } from './changePasswordForm';

export default async function ResetPasswordPage({ searchParams }: { searchParams: { token: string } }) {
  // const session = await auth();
  // if (session?.user) {
  //   redirect('/dashboard');
  // }

  let errorLink = '';
  const token = searchParams.token;

  //check token expiration date
  const tokenDecoded = token ? (jwt.decode(token) as { exp: number; userId: number }) : null;
  if (!token || !tokenDecoded) {
    return (
      <main>
        <h1>Sorry, This link not valid</h1>
      </main>
    );
  }

  const tokenExpired = tokenDecoded.exp < Date.now() / 1000;
  if (tokenExpired) {
    errorLink = 'Sorry, This link has expired';
  }

  return (
    <main>
      <section className="flex flex-col lg:flex-row lg:h-[100vh] min-h-screen">
        <div className="w-full lg:w-[42.5vw] flex flex-col max-lg:px-[2rem] max-lg:pb-10 ">
          <Image
            className="w-full max-lg:mt-12 h-auto lg:w-[9.21875vw] lg:ml-[1.614583vw] lg:mt-[2.222222vh]"
            width={219}
            height={52}
            src="/flowsups.png"
            alt="Logo of flowsups app"
          />
          <aside className="w-full mx-auto max-lg:mt-20 max-lg:py-6 max-lg:px-8 lg:w-[32.65625vw] h-fit shadow-crmFormShadow rounded-[0.520833vw] lg:mt-[20.277778vh] lg:mb-[26.111111vh] lg:ml-[4.895833vw] lg:mr-[4.947917vw] lg:pt-[2.314815vh] lg:pl-[4.114583vw] lg:pr-[3.958333vw] lg:pb-[2.685185vh] flex flex-col items-center">
            {!errorLink && (
              <>
                <FormTitle title="Forgot your password" text="Enter a new password" />
                <ChangePasswordForm token={token} />
              </>
            )}
            {errorLink && (
              <div className="flex justify-center items-center h-full">
                <h6 className="text-red-500 text-2xl">{errorLink}</h6>
              </div>
            )}
          </aside>
        </div>
        <div className="relative w-[57.5vw] hidden lg:block">
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
