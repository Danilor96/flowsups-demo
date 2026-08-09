'use client';

import { FormElement } from '&/login/FormElement';
import { FormInput } from '&/login/FormInput';
import { FormLabel } from '&/login/FormLabel';
import { FormSubmitButton } from '&/login/FormSubmitButton';
import { sendForgottedPasswordUserCode } from '@/app/libs/actions';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { FailNotification, SuccessNotification } from '&/notifications/Notification';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

export function ForgotPasswordForm() {
  // ----- global states -----

  // ----- local states -----
  const [state, dispatch] = useFormState(sendForgottedPasswordUserCode, null);
  const [message, setMessage] = useState<string>('');
  const [serverError, setServerError] = useState<string>('');

  useEffect(() => {
    if (state?.message) {
      setMessage(state.message);
    }
    if (state?.serverError) {
      setServerError(state.serverError);
    }
  }, [state?.message, state?.serverError]);

  useEffect(() => {
    if (message || serverError) {
      const messageTime = setTimeout(() => {
        setMessage('');
        setServerError('');
      }, 5000);

      return () => clearInterval(messageTime);
    }
  }, [message, serverError]);

  return (
    <FormElement action={dispatch}>
      <AnimatePresence>{message && <SuccessNotification apiMessage={message} />}</AnimatePresence>
      <AnimatePresence>
        {serverError && <FailNotification apiMessage={serverError} />}
      </AnimatePresence>
      <FormLabel htmlFor="email" title="Email" />
      <FormInput email={true} name="email" id="email" />
      {state && <p className="text-[2vh] text-red-500">{state.errors?.email}</p>}
      <aside className="mb-[1.666667vh]"></aside>
      <FormSubmitButton buttonText="Continue" />
      <article className="h-[2.592593vh] mt-[5.161111vh]">
        <p className="text-[1.859259vh] font-medium leading-[2.231481vh] text-[#B3B3B3]">
          Return to{' '}
          <Link className="font-semibold leading-[2.788889vh] text-mainColor" href="/">
            sign in
          </Link>
        </p>
      </article>
    </FormElement>
  );
}
