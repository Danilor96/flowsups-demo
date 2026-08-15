import { mockDb, MockDecimal } from '@/app/libs/mock-db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { storage } from '@/firebase/firebase.config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { UserSchedule } from '@/app/libs/definitions';
import { createNotification } from '@/app/libs/notifications/notifications';
import { checkPermissions } from '@/app/libs/auth-helpers';
import { auth } from '@/auth';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([34, 39]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const formData = await request.formData();

  const userId = parseInt(params.id);

  const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/,
  );

  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const userImgSchema = z.object({
    firstName: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    lastName: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    role: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    email: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    dayweek: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    daytimeFrom: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    daytimeTo: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    userScheduleData: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    mobilePhone: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    password: z
      .any()
      .refine((pass: string) => !pass || passwordValidation.test(pass), {
        message:
          'The password must contain at least 8 characters, 1 capital letter, 1 special character and 1 number',
      })
      .optional(),
    userImage: z
      .any()
      .refine((file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: 'Only .jpg, .jpeg, .png and .webp formats are supported',
      })
      .optional(),
    username: z.string({ invalid_type_error: 'Please enter a valid value' }).optional(),
    pay_plan_type: z.string().nullish(),
    pay_plan_data: z.string().nullish(),
    monthlyVehicleSalesGoal: z.number().nullish(),
  });

  const validatedData = userImgSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    role: formData.get('role'),
    email: formData.get('email'),
    mobilePhone: formData.get('mobilePhone'),
    password: formData.get('password'),
    userImage: formData.get('userImage'),
    username: formData.get('username'),
    dayweek: formData.get('dayweek'),
    daytimeFrom: formData.get('daytimeFrom'),
    daytimeTo: formData.get('daytimeTo'),
    userScheduleData: formData.get('userScheduleData'),
    pay_plan_type: formData.get('pay_plan_type'),
    pay_plan_data: formData.get('pay_plan_data'),
    monthlyVehicleSalesGoal: Number(formData.get('monthlyVehicleSalesGoal')) || null,
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const {
    email,
    firstName,
    lastName,
    mobilePhone,
    password,
    role,
    userImage,
    username,
    daytimeFrom,
    daytimeTo,
    dayweek,
    userScheduleData,
    pay_plan_type,
    pay_plan_data,
    monthlyVehicleSalesGoal,
  } = validatedData.data;

  const dayweekArray: boolean[] = JSON.parse(dayweek);
  const daytimeFromArray: number[] = JSON.parse(daytimeFrom);
  const daytimeToArray: number[] = JSON.parse(daytimeTo);
  const userScheduleDataArray: UserSchedule = JSON.parse(userScheduleData);

  try {
    // check duplicate email and username

    const actualUserEmail = mockDb.users.findUnique({
      where: {
        id: userId,
      },
    });

    const generalEmail = mockDb.users.findUnique({
      where: {
        email: email,
      },
    });

    const duplicateEmail =
      actualUserEmail?.email === email ? false : generalEmail?.email === email ? true : false;

    const duplicateUsername = username
      ? mockDb.users.findUnique({
          where: {
            username: username,
            deleted_at: null,
          },
        })
      : undefined;

    const usernameBelongsToCurrentUser = duplicateUsername?.id === userId ? true : false;

    if (duplicateEmail && !usernameBelongsToCurrentUser) {
      throw {
        fieldErrors: { email: ['Email already exists'], username: ['Username already exists'] },
      };
    } else if (duplicateEmail) {
      throw {
        fieldErrors: { email: ['Email already exists'] },
      };
    } else if (duplicateUsername && !usernameBelongsToCurrentUser) {
      throw {
        fieldErrors: { username: ['Username already exists'] },
      };
    }

    // do update

    const data = mockDb.users.update({
      where: {
        id: userId,
        deleted_at: null,
      },
      data: {
        email: email,
        name: firstName,
        last_name: lastName,
        mobile_phone: mobilePhone,
        username: username || null,
        monthly_vehicle_sales_goal: monthlyVehicleSalesGoal || null,
      },
    });

    // Create or update pay plan
    if (pay_plan_data && pay_plan_type) {
      const payPlanData = JSON.parse(pay_plan_data);
      const payPlanValues = {
        front_gross: payPlanData.frontGross
          ? new MockDecimal(payPlanData.frontGross || 0)
          : null,
        back_gross: payPlanData.backGross ? new MockDecimal(payPlanData.backGross || 0) : null,
        of_cash_down: payPlanData.ofCashDown
          ? new MockDecimal(payPlanData.ofCashDown || 0)
          : null,
        sales_person_id: payPlanData.salesPersonId ? payPlanData.salesPersonId : null,
        exclude_reserve_or_flat: payPlanData.excludeReserveOrFlat,
      };

      mockDb.users.update({
        where: { id: userId },
        data: {
          pay_plan: {
            user_id: userId,
            pay_type: pay_plan_type,
            ...payPlanValues,
          },
        },
      });
    }

    // update user schedule

    if (userScheduleDataArray && userScheduleDataArray.length > 0) {
      userScheduleDataArray.forEach((el) => {
        mockDb.user_schedule.update({
          where: {
            id: el.id,
          },
          data: {
            from_day_times_id: daytimeFromArray[el.dayweek_id - 1] + 1,
            to_day_times_id: daytimeToArray[el.dayweek_id - 1] + 1,
            dayweek_id: el.dayweek_id,
            active: dayweekArray[el.dayweek_id - 1],
          },
        });
      });
    } else {
      for (let i = 0; i < 7; i++) {
        mockDb.user_schedule.create({
          data: {
            dayweek_id: i + 1,
            from_day_times_id: daytimeFromArray[i] + 1,
            to_day_times_id: daytimeToArray[i] + 1,
            active: dayweekArray[i],
            user_id: userId,
          },
        });
      }
    }
    // update password

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      mockDb.users.update({
        where: {
          id: data.id,
          deleted_at: null,
        },
        data: {
          password: hashedPassword,
        },
      });
    }

    // update role

    if (role && userId) {
      const currentUser = mockDb.users.findUnique({
        where: {
          id: data.id,
        },
      });

      const currentRole = mockDb.roles.findUnique({
        where: {
          id: parseInt(role),
        },
      });

      const userRole = {
        role: currentRole || { role: 'Role' },
        user: {
          name: currentUser?.name,
          last_name: currentUser?.last_name,
        },
      };

      mockDb.users.update({
        where: {
          id: data.id,
        },
        data: {
          user_has: [
            {
              role_id: parseInt(role),
              role: currentRole
                ? {
                    role: currentRole.role,
                    id: currentRole.id,
                  }
                : null,
            },
          ],
        },
      });

      const message = `Role has been updated to '${userRole.role.role}' for ${userRole.user.name} ${userRole.user.last_name}`;

      await createNotification({
        message: message,
        notificationType: {
          general: true,
        },
        assignedToId: data.id,
        notificationsForManagers: true,
        eventTypeId: 12,
      });
    }

    // update image

    let imgPath = '';

    if (userImage) {
      if (data.img) {
        const fileDelRef = ref(storage, data.img);

        await deleteObject(fileDelRef);
      }

      const fileRef = ref(storage, `images/${userImage.name}`);
      const doUpload = await uploadBytes(fileRef, userImage);

      const path = await getDownloadURL(doUpload.ref);

      imgPath = path;

      const userImg = mockDb.users.update({
        where: {
          id: data.id,
          deleted_at: null,
        },
        data: {
          img: path,
        },
      });
    }

    return NextResponse.json({ successMessage: 'User Successfully Updated' });
  } catch (error: any) {
    console.log(error);

    if (error.fieldErrors) {
      return NextResponse.json(error, { status: 422 });
    }

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id;

  try {
    const data = mockDb.users.findUnique({
      where: {
        id: parseInt(userId),
        deleted_at: null,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions([35]);

  if (permissionsCheck) {
    return permissionsCheck;
  }

  const session = await auth();
  const sessionUserId = session?.user.id;

  const userId = parseInt(params.id);

  try {
    const data = mockDb.users.update({
      where: {
        id: userId,
        deleted_at: null,
      },
      data: {
        deleted_at: new Date().toISOString(),
        deleted_by_id: sessionUserId,
        username: null,
      },
    });

    mockDb.tasks.updateMany({
      where: {
        status: 1,
        OR: [
          { assigned_bdc_id: userId },
          { assigned_finance_manager_id: userId },
          { assigned_manager_id: userId },
          { assigned_seller_id: userId },
          { assigned_to: userId },
        ],
      },
      data: {
        assigned_bdc_id: null,
        assigned_finance_manager_id: null,
        assigned_manager_id: null,
        assigned_seller_id: null,
        assigned_to: null,
      },
    });

    mockDb.appointments.updateMany({
      where: {
        user_id: userId,
        status_id: {
          in: [1, 4, 6, 7],
        },
      },
      data: {
        user_id: null,
      },
    });

    return NextResponse.json({ successMessage: 'User Successfully Deleted' });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
