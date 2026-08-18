import { FormTitle } from '&/login/FormTitle';
import { SignInForm } from '&/login/sign_in/SignInForm';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <main>
      <section className="flex flex-col lg:flex-row lg:h-[100vh] min-h-screen">
        <div className="w-full lg:w-[42.1875vw] flex justify-center items-center">
          <aside className="w-full max-w-md h-auto my-8 flex flex-col items-center shadow-crmFormShadow rounded-crmFormRadius lg:max-w-none lg:w-[32.65625vw] lg:h-[63.981481vh]">
            <FormTitle title="Sign in" text="Enter your details to continue" />
            <SignInForm />
          </aside>
        </div>
        <div className="hidden lg:block w-[57.8125vw] flex justify-center items-center bg-gray-300">
          <h2>Image</h2>
        </div>
      </section>
    </main>
  );
}
