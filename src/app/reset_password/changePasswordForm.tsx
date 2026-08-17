'use client';
import Link from 'next/link';
import { FormElement } from '../ui/login/FormElement';
import { FormInput } from '../ui/login/FormInput';
import { FormLabel } from '../ui/login/FormLabel';
import { FormSubmitButton } from '../ui/login/FormSubmitButton';
import { useFormState } from 'react-dom';
import { changePasswordByTokenAction } from '../libs/actions';
import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import jwt from 'jsonwebtoken';

export const ChangePasswordForm = ({ token }: { token: string }) => {
  const session = useSession();
  const userId = session?.data?.user.id;

  const changePasswordByTokenActionWithToken = changePasswordByTokenAction.bind(null, token);
  const [state, formAction] = useFormState(changePasswordByTokenActionWithToken, null);

  useEffect(() => {
    if (state?.successMessage) {
      const tokenDta = token ? (jwt.decode(token) as { userId: number }) : null;
      if (userId && userId === tokenDta?.userId) {
        signOut({ redirect: false });
      }
    }
  }, [state]);

  return (
    <FormElement action={formAction}>
      {state?.successMessage && (
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="mb-4 text-lg text-green-600 flex gap-2 items-center flex-col text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-green-600"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
            </svg>
            {state.successMessage}
          </p>
          <Link
            href={'/'}
            className="bg-[#00a78b] w-[95%] text-center hover:scale-105 transition-all duration-300 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
        </div>
      )}
      {!state?.successMessage && (
        <>
          <FormLabel htmlFor="password" title="Password" />
          <FormInput name="password" password />
          {state && <p className="text-[2vh] text-red-500 !max-lg:text-sm">{state.errors?.newPassword}</p>}
          <FormLabel htmlFor="confirmPassword" title="Confirm Password" />
          <FormInput name="confirmPassword" password confirmPassword />
          {state && <p className="text-[2vh] text-red-500 !max-lg:text-sm">{state.errors?.confirmPassword}</p>}
          <aside className="mb-[1.666667vh]"></aside>
          <FormSubmitButton buttonText="Continue" />
          {state && state.serverError && <p className="text-[2vh] mt-2 text-red-500 mx-auto !max-lg:text-sm">{state.serverError}</p>}
          <article className="h-[2.592593vh] mt-[5.161111vh] max-lg:h-auto max-lg:mt-3">
            <p className="text-[1.859259vh] font-medium leading-[2.231481vh] text-[#B3B3B3] !max-lg:text-sm max-lg:leading-normal">
              Return to{' '}
              <Link className="font-semibold leading-[2.788889vh] text-mainColor max-lg:leading-normal" href="/">
                sign in
              </Link>
            </p>
          </article>
        </>
      )}
    </FormElement>
  );
};
