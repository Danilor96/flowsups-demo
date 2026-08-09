'use client';

import { generateUnicCode, loginRedirect } from '@/app/libs/actions';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function Loginform() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loader, setLoader] = useState(false);

  const handleSignIn = async (formData: FormData) => {
    const email = formData.get('email');
    const password = formData.get('password');

    const login = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!login?.ok && login?.status == 401) {
      setErrorMessage('Invalid credentials');
      return;
    }

    if (login?.ok) {
      setErrorMessage('');
      const code = await generateUnicCode();
      setLoader(true);
      loginRedirect(true);
    }
  };

  return (
    <form
      className="flex flex-col items-center justify-center gap-3 p-2 border border-gray-300 rounded w-96"
      action={handleSignIn}
    >
      <div className="w-full">
        <label htmlFor="email">Email</label>
      </div>
      <input
        type="email"
        name="email"
        id="email"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="w-full">
        <label htmlFor="password">Password</label>
      </div>
      <input
        type="password"
        name="password"
        defaultValue=""
        id="password"
        className="w-full p-2 border border-gray-300 rounded"
      />
      {errorMessage && errorMessage}
      {loader && <p>Loading ...</p>}
      <button
        type="submit"
        className="w-20 p-2 text-white transition-opacity rounded bg-slate-500 hover:bg-opacity-80"
      >
        Sign in
      </button>
    </form>
  );
}
