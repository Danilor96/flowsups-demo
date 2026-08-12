import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserEmailAndPassword } from './app/libs/data';
import { DEMO_EMAIL, DEMO_PASSWORD } from './app/libs/mock-db';
import { loginSchema } from './app/libs/zod';
import { ZodError } from 'zod';

export default {
  pages: {
    signIn: '/',
    signOut: '/',
  },
  providers: [
    Credentials({
      type: 'credentials',
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
            throw new Error('Invalid credentials');
          }

          const user = await getUserEmailAndPassword(email);

          if (!user || !user.password) throw new Error('Invalid credentials');

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            console.log(error);
          }
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  trustHost: true,
} satisfies NextAuthConfig;
