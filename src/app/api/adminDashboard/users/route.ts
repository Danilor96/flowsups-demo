import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { storage } from '@/firebase/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions([32]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/,
  );

  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const userSchema = z.object({
    firstName: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    lastName: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    role: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    mobilePhone: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    email: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    password: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .regex(
        passwordValidation,
        'The password must contain at least 8 characters, 1 capital letter, 1 special character and 1 number',
      ),
    userImage: z
      .any()
      .refine((file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
      })
      .optional(),
    username: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = userSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    role: formData.get('role'),
    mobilePhone: formData.get('mobilePhone'),
    email: formData.get('email'),
    password: formData.get('password'),
    userImage: formData.get('userImage'),
    username: formData.get('username'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { email, firstName, lastName, mobilePhone, password, role, userImage, username } =
    validatedData.data;

  try {
    // check duplicate email and username

    const duplicateUsername = await prisma.users.findUnique({
      where: {
        username: username,
        deleted_at: null,
      },
    });

    // where: {
    //     OR: [{ email }, { mobile_phone: mobilePhone }],
    //   },

    const existingUser = await prisma?.users.findFirst({
      where: {
        email,
      },
    });

    if (existingUser && duplicateUsername) {
      if (!existingUser.deleted_at) {
        throw {
          fieldErrors: { email: ['Email already exists'], username: ['Username already exists'] },
        };
      }

      throw {
        fieldErrors: { username: ['Username already exists'] },
      };
    } else if (existingUser) {
      if (!existingUser.deleted_at) {
        throw { fieldErrors: { email: ['Email already exists'] } };
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.users.update({
        where: { id: existingUser.id },
        data: {
          name: firstName,
          last_name: lastName,
          email: email,
          password: hashedPassword,
          mobile_phone: mobilePhone,
          username: username,
          user_has: {
            update: {
              where: {
                user_id: existingUser.id,
              },
              data: {
                role_id: parseInt(role),
              },
            },
          },
          status_id: 1,
          deleted_at: null,
          deleted_by_id: null,
        },
      });

      if (userImage) {
        const fileRef = ref(storage, `images/${userImage.name}`);
        const doUpload = await uploadBytes(fileRef, userImage);

        const path = await getDownloadURL(doUpload.ref);

        await prisma.users.update({
          where: {
            id: existingUser.id,
            deleted_at: null,
          },
          data: {
            img: path,
          },
        });
      }

      return NextResponse.json({ successMessage: 'User Successfully Reactivated' });
    } else if (duplicateUsername) {
      throw { fieldErrors: { username: ['Username already exists'] } };
    }

    // user creation

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await prisma.users.create({
      data: {
        name: firstName,
        last_name: lastName,
        email: email,
        password: hashedPassword,
        mobile_phone: mobilePhone,
        username: username,
        user_has: {
          create: {
            role_id: parseInt(role),
          },
        },
        status_id: 1,
      },
    });

    if (userImage) {
      const fileRef = ref(storage, `images/${userImage.name}`);
      const doUpload = await uploadBytes(fileRef, userImage);

      const path = await getDownloadURL(doUpload.ref);

      const userImg = await prisma.users.update({
        where: {
          id: data.id,
          deleted_at: null,
        },
        data: {
          img: path,
        },
      });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'User Successfully Created' });
  } catch (error: any) {
    console.log(error);

    if (error.fieldErrors) {
      return NextResponse.json(error, { status: 422 });
    }

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await prisma.users.findMany({
      where: {
        deleted_at: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        last_name: true,
        username: true,
        created_at: true,
        updated_at: true,
        mobile_phone: true,
        img: true,
        status_id: true,
        round_robin: true,
        ready_for_leads: true,
        round_robin_order: true,
        monthly_vehicle_sales_goal: true,
        // sales_points_today_date: true,
        sales_points_total: true,
        sales_points_today: true,
        daily_points_target: true,
        users_status: {
          select: {
            status: true,
          },
        },
        user_has: {
          select: {
            role: {
              select: {
                role: true,
                id: true,
              },
            },
          },
        },
      },
    });

    //await prisma.$disconnect();

    revalidatePath(`${process.env.NEXTAUTH_URL}/dashboard`);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
