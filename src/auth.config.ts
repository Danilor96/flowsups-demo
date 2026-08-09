import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getUserEmailAndPassword } from './app/libs/data';
import { loginSchema } from './app/libs/zod';
import { ZodError } from 'zod';
import bcrypt from 'bcryptjs';

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

          const user = await getUserEmailAndPassword(email);

          if (!user || !user.password) throw new Error('Invalid credentials');

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            return user;
          }

          throw new Error('Invalid credentials');
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
