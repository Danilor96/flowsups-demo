'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const publicRoutes = ['/', '/forgot_password', '/sign_up', '/api/twiml', '/api/auth/session'];

const publicDinamicRoutes = [
  '/consent',
  '/creditApp',
  '/api/callStatus',
  '/forgot_password',
  '/api/public',
  '/reset_password',
  '/api/waitConferenceUrl',
  '/api/consentForm',
];

function SessionAuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(window.location.pathname);
    const isPublicDinamicRoute = publicDinamicRoutes.some((route) =>
      window.location.pathname.startsWith(route),
    );

    if (
      status === 'unauthenticated' &&
      !isPublicRoute &&
      !isPublicDinamicRoute &&
      window.location.pathname !== '/'
    ) {
      window.location.href = '/';
    }
  }, [status]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider baseUrl="https://flowsups-client.vercel.app/">
      <SessionAuthGuard>{children}</SessionAuthGuard>
    </SessionProvider>
  );
}
