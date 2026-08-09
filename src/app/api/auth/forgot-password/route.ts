import { checkPermissions } from '@/app/libs/auth-helpers';
import prisma from '@/app/libs/prisma';
import { sendPasswordResetEmailService } from '@/app/libs/services/email.service';
import { auth } from '@/auth';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(39);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  if (!JWT_SECRET) {
    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }

  const data = await request.formData();
  const email = data.get('email') as string;
  const sendToAdmin = data.get('sendToAdmin') as string;

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await prisma.users.findUnique({ where: { email, deleted_at: null } });
    if (!user) return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });

    let emailToSend = user.email;

    // consultar esta parte de la lógica para ver si se debe agregar, modificar
    // o eliminar

    // if (sendToAdmin === 'true') {
    //   const session = await auth();
    //   const adminEmail = session?.user?.email;
    //   const adminRoles = session?.user?.user_has.map((role) => role.role_id);

    //   if (adminEmail && (adminRoles?.includes(1) || adminRoles?.includes(2))) {
    //     emailToSend = adminEmail;
    //   } else {
    //     return NextResponse.json({ serverError: 'Unauthorized' }, { status: 401 });
    //   }
    // }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const nextPublicAppUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${nextPublicAppUrl}/reset_password?token=${token}`;
    await sendPasswordResetEmailService(user, emailToSend, resetUrl, sendToAdmin === 'true');

    return NextResponse.json({ successMessage: 'Password Reset Email Sent' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
