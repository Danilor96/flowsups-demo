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
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/app/libs/mock-db/data/users';

export function SignInForm() {
  // ----- global states -----

  const { clearMessages } = messagesStore();
  const { messages } = messagesStore();

  // ----- local states -----
  const [errorMessage, setErrorMessage] = useState('');
  const [state, formAction] = useFormState(loginAction, null);
  const [successMessage, SetSuccessMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const copyDemoCredentials = async () => {
    try {
      await navigator.clipboard.writeText(`Email: ${DEMO_EMAIL}\nPassword: ${DEMO_PASSWORD}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

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
      <div className="flex flex-row items-center mb-[3.5rem] max-lg:mb-4 max-lg:flex-wrap max-lg:gap-2">
        <FormInput
          checkbox={true}
          name="rememeberPassword"
          rememberPassword="password"
          checkboxText="Remember password"
        />
        <Link
          className="w-[11.145833vw] mt-[1.666667vh] h-[2.222222vh] flex justify-center items-center text-[1.481481vh] font-semibold leading-[2.222222vh] text-mainColor max-lg:w-auto max-lg:mt-0 max-lg:h-auto max-lg:text-sm"
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
      <aside className="mt-6 w-full rounded-[0.520833vw] border-2 border-dashed border-mainColor bg-[#0090750D] p-4 max-lg:mt-4 max-lg:p-3">
        <div className="flex flex-row items-center justify-between mb-2">
          <p className="text-sm font-semibold text-mainColor">Demo credentials</p>
          <button
            type="button"
            onClick={copyDemoCredentials}
            className="text-xs font-semibold text-mainColor underline hover:text-[#007A66] max-lg:text-xs"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm max-lg:text-sm">
            <span className="font-medium text-[#B3B3B3]">Email: </span>
            <span className="font-semibold text-[#1E1E1E]">{DEMO_EMAIL}</span>
          </p>
          <p className="text-sm max-lg:text-sm">
            <span className="font-medium text-[#B3B3B3]">Password: </span>
            <span className="font-semibold text-[#1E1E1E]">{DEMO_PASSWORD}</span>
          </p>
        </div>
      </aside>
    </FormElement>
  );
}
