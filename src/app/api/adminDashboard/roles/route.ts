import { checkPermissions } from '@/app/libs/auth-helpers';
import { mockDb } from '@/app/libs/mock-db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET() {
  try {
    const data = mockDb.roles.findMany({
      orderBy: {
        created_at: 'asc',
      },
    });

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(45);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const session = await auth();

  const userId = session?.user.id;

  const formData = await request.formData();

  const roleSchema = z.object({
    roleName: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    permissions: z
      .array(
        z.object({
          id: z.number({ invalid_type_error: 'Please enter a valid value' }),
          name: z.string({ invalid_type_error: 'Please enter a valid value' }),
        }),
      )
      .nonempty({ message: 'Please enter at least one permission' }),
  });

  const permissionsArray = formData.get('permissions');

  const validatedData = roleSchema.safeParse({
    roleName: formData.get('roleName'),
    permissions: typeof permissionsArray === 'string' && JSON.parse(permissionsArray),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { permissions, roleName } = validatedData.data;

  try {
    const data = mockDb.roles.create({
      data: {
        role: roleName,
        status_id: 1,
        created_by: userId,
        creator: {
          name: 'Demo',
          last_name: 'User',
        },
        status: {
          status: 'Active',
        },
        roles_has: [],
      },
    });

    const permissionsIdsArray = returnPermissionsIdArray(permissions);

    mockDb.roles_has_permissions.create({
      data: {
        role_id: data.id,
        permission_id: permissionsIdsArray,
      },
    });

    mockDb.roles.update({
      where: {
        id: data.id,
      },
      data: {
        roles_has: [
          {
            id: data.id,
            permission_id: permissionsIdsArray,
          },
        ],
      },
    });

    return NextResponse.json({ successMessage: 'Role Successfully Created' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

function returnPermissionsIdArray(permissions: { id: number; name: string }[]) {
  const idsArray: number[] = [];

  for (let i = 0; i < permissions.length; i++) {
    const permission = permissions[i];

    idsArray.push(permission.id);
  }

  return idsArray;
}
