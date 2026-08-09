import { useSession } from 'next-auth/react';

export const useCan = () => {
  const { data: session } = useSession();

  const can = (permissions: number | number[]) => {
    const roleHasPermissions = session?.user?.user_has?.[0]?.role?.roles_has?.[0]?.permission_id;

    if (!session || !roleHasPermissions) {
      return false;
    }

    if (roleHasPermissions.includes(1)) {
      return true;
    }

    const requiredPermsArray = Array.isArray(permissions) ? permissions : [permissions];

    const hasRequiredPermissions = requiredPermsArray.some(
      (permission) => roleHasPermissions.includes(1) || roleHasPermissions.includes(permission),
    );

    return hasRequiredPermissions;
  };

  return { can };
};
