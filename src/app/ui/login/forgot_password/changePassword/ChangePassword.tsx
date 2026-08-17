'use client';

import { FormElement } from '&/login/FormElement';
import { FormLabel } from '&/login/FormLabel';
import { FormInput } from '&/login/FormInput';
import { FormSubmitButton } from '&/login/FormSubmitButton';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { changePassword } from '@/app/libs/actions';
import { messagesStore } from '@/store/adminDashboard';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export function ChangePassword({ userEmail }: { userEmail: string }) {
  //   ----- global states -----

  const { setMessages } = messagesStore();

  // ----- local states -----
  const doChangePassword = changePassword.bind(null, userEmail);
  const [state, dispatch] = useFormState(doChangePassword, null);

  useEffect(() => {
    if (state?.successMessage) {
      setMessages(undefined, state?.successMessage);

      redirect('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.successMessage]);

  return (
    <FormElement action={dispatch}>
      <FormLabel htmlFor="password" title="Password" />
      <FormInput name="password" password />
      {state && <p className="text-[2vh] text-red-500">{state.errors?.password}</p>}
      <FormLabel htmlFor="confirmPassword" title="Confirm Password" />
      <FormInput name="confirmPassword" password confirmPassword />
      {state && <p className="text-[2vh] text-red-500">{state.errors?.confirmPassword}</p>}
      <aside className="mb-[1.666667vh] max-lg:mb-2"></aside>
      <FormSubmitButton buttonText="Continue" />
      <article className="h-[2.592593vh] mt-[5.161111vh] max-lg:h-auto max-lg:mt-6">
        <p className="text-[1.859259vh] font-medium leading-[2.231481vh] text-[#B3B3B3] max-lg:text-sm">
          Return to{' '}
          <Link className="font-semibold leading-[2.788889vh] text-mainColor" href="/">
            sign in
          </Link>
        </p>
      </article>
    </FormElement>
  );
}
