'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      onClick={() => {
        signOut({ callbackUrl: '/' });
      }}
      className="p-2 flex items-center justify-center border border-gray-300"
    >
      Sign out
    </button>
  );
}
