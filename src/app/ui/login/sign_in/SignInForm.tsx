'use client';

import { FormInput } from '&/login/FormInput';
import { FormLabel } from '&/login/FormLabel';
import Link from 'next/link';
import { FormSubmitButton } from '&/login/FormSubmitButton';
import { FormElement } from '&/login/FormElement';
import { useEffect, useState } from 'react';
import { loginAction, loginRedirect } from '@/app/libs/actions';
import { SuccessNotification } from '&/notifications/Notification';
import { messagesStore } from '@/store/adminDashboard';
import { AnimatePresence } from 'framer-motion';
import { useFormState } from 'react-dom';

export function SignInForm() {
  // ----- global states -----

  const { clearMessages } = messagesStore();
  const { messages } = messagesStore();

  // ----- local states -----
  const [errorMessage, setErrorMessage] = useState('');
  const [state, formAction] = useFormState(loginAction, null);
  const [successMessage, SetSuccessMessage] = useState('');

  useEffect(() => {
    if (messages.successMessage) {
      const messageTime = setTimeout(() => {
        clearMessages();
      }, 7000);

      return () => clearTimeout(messageTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.successMessage]);

  useEffect(() => {
    if (state && (state.error || state.serverError)) {
      setErrorMessage(state.error || state.serverError || '');
    }

    if (state?.seuccess) {
      setErrorMessage('');
      loginRedirect(true);
      SetSuccessMessage('Welcome');
    }
  }, [state]);

  return (
    <FormElement action={formAction}>
      <AnimatePresence>
        {messages.successMessage && <SuccessNotification apiMessage={messages.successMessage} />}
      </AnimatePresence>
      <FormLabel htmlFor="email" title="Email" />
      <FormInput email={true} name="email" id="email" />
      <FormLabel htmlFor="password" title="Password" />
      <FormInput password={true} id="password" name="password" />
      <div className="flex flex-row items-center mb-[3.5rem]">
        <FormInput
          checkbox={true}
          name="rememeberPassword"
          rememberPassword="password"
          checkboxText="Remember password"
        />
        <Link
          className="w-[11.145833vw] mt-[1.666667vh] h-[2.222222vh] flex justify-center items-center text-[1.481481vh] font-semibold leading-[2.222222vh] text-mainColor"
          href="/forgot_password/"
        >
          Forgotten password?
        </Link>
      </div>
      {errorMessage && <p className="text-center mb-3 text-red-700 text-base">{errorMessage}</p>}
      {successMessage && (
        <p className="text-center mb-3 text-blue-700 text-base">{successMessage}</p>
      )}
      <FormSubmitButton buttonText="Continue" />
    </FormElement>
  );
}
