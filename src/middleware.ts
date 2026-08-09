import NextAuth, { Session } from 'next-auth';
import authConfig from '@/auth.config';
import { NextResponse } from 'next/server';

const { auth: middleware } = NextAuth(authConfig);

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

export default middleware(async (req) => {
  const { nextUrl, auth } = req;

  const isLoggedIn = !!auth?.user;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isPublicDinamicRoute = publicDinamicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route),
  );

  if (isPublicDinamicRoute) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|)).*)',
    '/(api|trpc)(.*)',
  ],
};
