import { create } from 'zustand';

interface Permissions {
  permissions: {
    id: number;
    role_id: number;
    permission_id: number[];
  } | null;
  getPermissions: (roleId: number) => Promise<void>;
}

export const permissionsStore = create<Permissions>((set, get) => ({
  permissions: null,
  getPermissions: async (roleId) => {
    const data = await fetch(`/api/permissions/${roleId}`);

    const json = await data.json();

    set({ permissions: json });
  },
}));
