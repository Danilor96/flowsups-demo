'use client';

import { userRegister } from '@/app/libs/actions';
import { useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { EyeClosed, EyeIcon } from '&/icons/Icons';

const initialState = {
  errors: {},
  message: '',
};

export default function RegisterForm({ email }: { email: string | undefined }) {
  const [state, dispatch] = useFormState(userRegister, initialState);
  const [passwordInput, setPasswordInput] = useState(true);
  const [confirmPasswordInput, setConfirmPasswordInput] = useState(true);
  const [inputType, setInputType] = useState('password');
  const [confirmInputType, setConfirmInputType] = useState('password');

  const handlePasswordView = (e: any) => {
    // password input logic

    if (e.target.classList.contains('password') && passwordInput === true) {
      setInputType('text');
      setPasswordInput(false);
    } else if (e.target.parentNode.classList.contains('password') && passwordInput === true) {
      setInputType('text');
      setPasswordInput(false);
    }

    if (e.target.classList.contains('password') && passwordInput === false) {
      setInputType('password');
      setPasswordInput(true);
    } else if (e.target.parentNode.classList.contains('password') && passwordInput === false) {
      setInputType('password');
      setPasswordInput(true);
    }

    // confirm password input logic

    if (e.target.classList.contains('confirmPassword') && confirmPasswordInput === true) {
      setConfirmInputType('text');
      setConfirmPasswordInput(false);
    } else if (
      e.target.parentNode.classList.contains('confirmPassword') &&
      confirmPasswordInput === true
    ) {
      setConfirmInputType('text');
      setConfirmPasswordInput(false);
    }

    if (e.target.classList.contains('confirmPassword') && confirmPasswordInput === false) {
      setConfirmInputType('password');
      setConfirmPasswordInput(true);
    } else if (
      e.target.parentNode.classList.contains('confirmPassword') &&
      confirmPasswordInput === false
    ) {
      setConfirmInputType('password');
      setConfirmPasswordInput(true);
    }
  };

  return (
    <form
      className="relative flex flex-col items-center justify-center gap-3 p-2 border border-gray-300 rounded w-96"
      action={dispatch}
    >
      <input
        type="email"
        name="email"
        id="email"
        defaultValue={email}
        hidden
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="w-full">
        <label htmlFor="name">Name</label>
      </div>
      <input
        type="text"
        name="name"
        id="name"
        className="w-full p-2 border border-gray-300 rounded"
      />
      {state?.errors?.name && <p>{state.errors.name}</p>}
      <div className="w-full">
        <label htmlFor="password">Password</label>
      </div>
      <aside className="w-full h-11 flex flex-row justify-center items-center">
        <input
          type={inputType}
          name="password"
          id="password"
          className="w-full h-full p-2 border-t border-l border-b border-gray-300 rounded-l"
        />
        <button
          type="button"
          onClick={handlePasswordView}
          className="w-fit h-full flex justify-center items-center border-t border-r border-b border-gray-300 rounded-r px-2 password"
        >
          {passwordInput ? <EyeIcon /> : <EyeClosed />}
        </button>
      </aside>
      {state?.errors?.password && <p>{state.errors.password}</p>}
      <div className="w-full">
        <label htmlFor="confirmPassword">Confirm password</label>
      </div>
      <aside className="w-full h-11 flex flex-row justify-center items-center">
        <input
          type={confirmInputType}
          name="confirmPassword"
          id="confirmPassword"
          className="w-full h-full p-2 border-t border-l border-b border-gray-300 rounded-l outline-none"
        />
        <button
          type="button"
          onClick={handlePasswordView}
          className="w-fit h-full flex justify-center items-center border-t border-r border-b border-gray-300 rounded-r px-2 confirmPassword"
        >
          {confirmPasswordInput ? <EyeIcon /> : <EyeClosed />}
        </button>
      </aside>
      {state?.errors?.confirmPassword && <p>{state.errors.confirmPassword}</p>}
      <button
        type="submit"
        className="w-20 p-2 text-white transition-opacity rounded bg-slate-500 hover:bg-opacity-80"
      >
        Sign up
      </button>
      {state?.message && <p>{state.message}</p>}
    </form>
  );
}
