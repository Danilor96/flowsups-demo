import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function checkPermissions(
  requiredPermissions: number | number[],
): Promise<NextResponse | null> {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const userPermissions = session?.user?.user_has[0]?.role.roles_has[0]?.permission_id;

  if (!userPermissions) {
    return NextResponse.json({ error: 'Forbidden: User has no permissions' }, { status: 403 });
  }

  const requiredPermsArray = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions];

  const hasRequiredPermissions = requiredPermsArray.some(
    (permission) => userPermissions.includes(1) || userPermissions.includes(permission),
  );

  if (!hasRequiredPermissions) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}

export const filterDataByPermissions = (dataArray: any[], permissions?: number[]) => {
  const cleanAndFilterKeys = (obj: { [key: string]: any }, permArray: number[]) => {
    const filteredObj: { [key: string]: any } = {};
    const regex = /^(.*)_CAN_((?:\d+_?)+)_$/;

    for (const key in obj) {
      const match = key.match(regex);

      if (!match) {
        filteredObj[key] = obj[key];
        continue;
      }

      const originalKey = match[1];
      const permissionString = match[2];
      const permissionsRequired = permissionString.split('_').map(Number);

      const hasPermission = permissionsRequired.some((p) => permArray.includes(p));

      if (hasPermission) {
        filteredObj[originalKey] = obj[key];
      }
    }
    return filteredObj;
  };

  const effectivePermissions = permissions === undefined || permissions === null ? [] : permissions;

  if (effectivePermissions.includes(1)) {
    return dataArray.map((obj) => {
      const cleanedObj: { [key: string]: any } = {};
      const regex = /^(.*)_CAN_((?:\d+_?)+)_$/;
      for (const key in obj) {
        const match = key.match(regex);
        cleanedObj[match ? match[1] : key] = obj[key];
      }
      return cleanedObj;
    });
  }

  return dataArray.map((obj) => cleanAndFilterKeys(obj, effectivePermissions));
};
