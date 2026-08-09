import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/app/libs/prisma';
import authConfig from '@/auth.config';
import { JWT } from 'next-auth/jwt';

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
  adapter: PrismaAdapter(prisma),
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
        const currentUser = await prisma.users.findUnique({
          where: { id: token.id, deleted_at: null },
          select: { session_version: true },
        });

        if (
          !currentUser ||
          (token.sessionVersion && currentUser.session_version !== token.sessionVersion)
        ) {
          return null;
        }
      }

      if (trigger === 'update') {
        const dbUser = await prisma.users.findUnique({
          where: { id: token.id, deleted_at: null },
          select: {
            id: true,
            name: true,
            last_name: true,
            email: true,
            created_at: true,
            updated_at: true,
            username: true,
            img: true,
            session_version: true,
            user_has: {
              select: {
                role_id: true,
                role: {
                  select: {
                    role: true,
                    roles_has: {
                      select: {
                        permission_id: true,
                      },
                    },
                  },
                },
              },
            },
          },
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
        const dbUser = await prisma.users.findUnique({
          where: { id: parseInt(user.id), deleted_at: null },
          select: {
            id: true,
            name: true,
            last_name: true,
            email: true,
            created_at: true,
            updated_at: true,
            username: true,
            img: true,
            session_version: true,
            user_has: {
              select: {
                role_id: true,
                role: {
                  select: {
                    role: true,
                    roles_has: {
                      select: {
                        permission_id: true,
                      },
                    },
                  },
                },
              },
            },
          },
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
