'use client';

import { useState } from 'react';
import { EyeClosed, EyeIcon } from '&/icons/Icons';
import Link from 'next/link';

export function FormInput({
  email,
  password,
  checkbox,
  text,
  name,
  id,
  placeholder,
  rememberPassword,
  checkboxText,
  confirmPassword,
  terms,
  checkboxLinkText,
  checkboxLinkHref,
}: {
  email?: boolean;
  password?: boolean;
  checkbox?: boolean;
  text?: boolean;
  name: string;
  id?: string;
  placeholder?: string;
  rememberPassword?: string;
  checkboxText?: string;
  confirmPassword?: boolean;
  terms?: boolean;
  checkboxLinkText?: string;
  checkboxLinkHref?: string;
}) {
  const [passwordInput, setPasswordInput] = useState(true);
  const [inputType, setInputType] = useState('password');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState(true);
  const [confirmInputType, setConfirmInputType] = useState('password');

  const handlePasswordView = (e: any) => {
    // password input logic
    const btn = e.target.closest('button');

    if (btn.classList.contains('password') && passwordInput === true) {
      setInputType('text');
      setPasswordInput(false);
    }
    if (btn.classList.contains('password') && passwordInput === false) {
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

  //return a text input
  if (text) {
    return (
      <input
        type="text"
        name={name}
        id={id}
        required
        placeholder={placeholder}
        className="w-[11.484375vw] h-[5.177778vh] rounded-[0.520833vw] border-2 border-mainColor outline-none pl-[1.40625vw] mt-[1.666667vh]"
      />
    );
  }

  //return an email input
  if (email) {
    return (
      <input
        type="email"
        name={name}
        id={id}
        required
        placeholder="example@example.com"
        className="h-[5.177778vh] rounded-[0.520833vw] outline-none pl-[1.40625vw] mb-[1.666667vh] border-2 border-mainColor text-[1.481481vh]"
      />
    );
  }

  //return a password input
  if (password) {
    return (
      <aside className="h-[5.277778vh] rounded-[0.6546975vw] outline-none mb-[1.666667vh] flex flex-row justify-center items-center">
        <input
          type={inputType}
          name={name}
          id={id}
          required
          placeholder="Min. 8 characters"
          className="w-full h-full pl-[1.307292vw] rounded-l-[0.6546975vw] outline-none border-t-2 border-l-2 border-b-2 border-mainColor"
        />
        <button
          type="button"
          onClick={handlePasswordView}
          className="w-fit h-full px-[1vw] border-t-2 border-r-2 border-b-2 border-mainColor flex justify-center items-center rounded-r-[0.6546975vw] password"
        >
          {passwordInput ? <EyeIcon /> : <EyeClosed />}
        </button>
      </aside>
    );
  }

  //return a confirm password input
  if (password && confirmPassword) {
    return (
      <aside className="h-[5.277778vh] bg-[#F4F4F4] rounded-[0.653646vw] outline-none mb-[2.058333vh] flex flex-row justify-center items-center">
        <input
          type={confirmInputType}
          name={name}
          id={id}
          required
          placeholder="Min. 8 characters"
          className="w-full h-full pl-[1.307292vw] bg-[#F4F4F4] rounded-l-[0.520833vw] outline-none text-[1.481481vh]"
        />
        <button
          type="button"
          onClick={handlePasswordView}
          className="w-fit h-full px-[0.863021vw] bg-[#F4F4F4] flex justify-center items-center rounded-r-[0.520833vw] confirmPassword"
        >
          {passwordInput ? <EyeIcon /> : <EyeClosed />}
        </button>
      </aside>
    );
  }

  //return a checkbox input
  if (checkbox) {
    if (rememberPassword) {
      return (
        <aside className="w-[11.818229vw] h-[2.440741vh] mt-[1.666667vh] mr-[1.775521vw] flex flex-row items-center">
          <input
            type="checkbox"
            name={name}
            id={id}
            className="w-[1.372917vw] h-[1.372917vw] mr-[0.653646vw] accent-mainColor"
          />
          <p className="text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]">
            {checkboxText}
          </p>
        </aside>
      );
    }
    if (terms) {
      return (
        <aside className="w-[24.84375vw] h-[2.407407vh] mt-[2.058333vh] mb-[4.62963vh] flex flex-row items-center">
          <input
            type="checkbox"
            name={name}
            id={id}
            className="w-[1.14375vw] h-[1.14375vw] mr-[0.653646vw] accent-mainColor"
          />
          <p className="text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]">
            {checkboxText}{' '}
            <Link
              className="text-mainColor text-[1.481481vh] font-semibold leading-[2.222222vh]"
              href={checkboxLinkHref ? checkboxLinkHref : '#'}
            >
              {checkboxLinkText}
            </Link>
          </p>
        </aside>
      );
    }
  }
}
