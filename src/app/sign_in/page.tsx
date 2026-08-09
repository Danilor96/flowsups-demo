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
      <section className="flex flex-row h-[100vh]">
        <div className="w-[42.1875vw] flex justify-center items-center">
          <aside className="w-[32.65625vw] h-[63.981481vh] flex flex-col items-center shadow-crmFormShadow rounded-crmFormRadius">
            <FormTitle title="Sign in" text="Enter your details to continue" />
            <SignInForm />
          </aside>
        </div>
        <div className="w-[57.8125vw] flex justify-center items-center bg-gray-300">
          <h2>Image</h2>
        </div>
      </section>
    </main>
  );
}
