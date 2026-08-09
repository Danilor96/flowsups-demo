import { checkPermissions } from '@/app/libs/auth-helpers';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const roleId = parseInt(params.id);

  try {
    const data = await prisma.roles.findUnique({
      where: {
        id: roleId,
      },
      include: {
        status: {
          select: {
            status: true,
          },
        },
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(44);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const roleId = parseInt(params.id);

  const formData = await request.formData();

  const roleSchema = z.object({
    roleName: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a role name'),
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
    const data = await prisma.roles.update({
      where: {
        id: roleId,
      },
      data: {
        role: roleName,
      },
    });

    const permissionsIdsArray = returnPermissionsIdArray(permissions);

    await prisma.roles_has_permissions.upsert({
      where: {
        role_id: roleId,
      },
      update: {
        permission_id: {
          set: permissionsIdsArray,
        },
      },
      create: {
        role_id: roleId,
        permission_id: {
          set: permissionsIdsArray,
        },
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Role Successfully Updated' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(45);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const roleId = parseInt(params.id);

  try {
    const data = await prisma.roles.delete({
      where: {
        id: roleId,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Role Successfully Deleted' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

function returnPermissionsIdArray(permissions: { id: number; name: string }[]) {
  let idsArray: number[] = [];

  for (let i = 0; i < permissions.length; i++) {
    const permission = permissions[i];

    if (permission.id === 1) {
      return (idsArray = [1]);
    }

    idsArray.push(permission.id);
  }

  return idsArray;
}
