import { handlers } from '@/auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      name: string;
      last_name: string;
      email: string;
      created_at: string;
      updated_at: string;
      user_has: {
        role: {
          role: string;
          roles_has: {
            permission_id: number[];
          }[];
        };
        role_id: number;
      }[];
      username?: string;
      img?: string;
    };
  }
}

export const { GET, POST } = handlers;
