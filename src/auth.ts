import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { JWT } from 'next-auth/jwt';
import { mockDb } from '@/app/libs/mock-db';

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    name: string | null;
    createdAt: Date;
    lastName: string | null;
    email: string;
    updatedAt: Date | null;
    username: string | null;
    img: string | null;
    sessionVersion: number;
    userHas: {
      role: {
        role: string;
        roles_has: {
          permission_id: number[];
        }[];
      };
      role_id: number;
    }[];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt', maxAge: 15 * 60, updateAge: 60 },
  callbacks: {
    async jwt({ token, user, trigger }) {
      const now = Math.floor(Date.now() / 1000);

      if (user) {
        token.iat = now;
        token.exp = now + 15 * 60;
      }

      if (token.exp && now > (token.exp as number)) {
        return null;
      }

      if (token.id) {
        const currentUser = mockDb.users.findFirst({
          where: { id: token.id, deleted_at: null },
        });

        if (
          !currentUser ||
          (token.sessionVersion && currentUser.session_version !== token.sessionVersion)
        ) {
          return null;
        }
      }

      if (trigger === 'update') {
        const dbUser = mockDb.users.findFirst({
          where: { id: token.id, deleted_at: null },
        });

        if (dbUser) {
          return {
            ...token,
            id: dbUser.id,
            name: dbUser.name,
            lastName: dbUser.last_name,
            email: dbUser.email,
            createdAt: dbUser.created_at,
            updatedAt: dbUser.updated_at,
            userHas: dbUser.user_has,
            username: dbUser.username,
            img: dbUser.img,
            sessionVersion: dbUser.session_version,
          };
        }
      }

      if (user && user.id) {
        const dbUser = mockDb.users.findFirst({
          where: { id: parseInt(user.id), deleted_at: null },
        });

        if (dbUser) {
          return {
            ...token,
            id: dbUser.id,
            name: dbUser.name,
            lastName: dbUser.last_name,
            email: dbUser.email,
            createdAt: dbUser.created_at,
            updatedAt: dbUser.updated_at,
            userHas: dbUser.user_has,
            username: dbUser.username,
            img: dbUser.img,
            sessionVersion: dbUser.session_version,
          };
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as never;
      session.userId = token.id.toString();
      session.user.name = token.name || '';
      session.user.last_name = token.lastName || '';
      session.user.created_at = new Date(token.createdAt).toISOString();
      session.user.username = token.username || '';
      session.user.email = token.email;
      session.user.updated_at = token.updatedAt ? new Date(token.updatedAt).toISOString() : '';
      session.user.user_has = token.userHas;
      session.user.img = token.img || '';

      return session;
    },
  },
});
