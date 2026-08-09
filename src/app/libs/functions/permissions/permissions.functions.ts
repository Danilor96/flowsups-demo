import { auth } from '@/auth';

export async function serverCan({
  requiredPermissions,
}: {
  requiredPermissions: number | number[];
}) {
  try {
    const session = await auth();

    if (!session?.user) {
      return false;
    }

    const userPermissions = session?.user?.user_has[0]?.role.roles_has[0]?.permission_id;

    const requiredPermsArray = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    const hasRequiredPermissions = requiredPermsArray.some(
      (permission) => userPermissions.includes(1) || userPermissions.includes(permission),
    );

    if (!hasRequiredPermissions) {
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}
