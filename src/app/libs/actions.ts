"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { mockDb } from "@/app/libs/mock-db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAnUser, getAnUserActivationCode } from "./data";
import { randomBytes, randomUUID } from "crypto";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { EmailTemplate } from "&/email/EmailTemplate";
import { loginSchema } from "./zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import jwt from "jsonwebtoken";

// const resend = new Resend(process.env.RESEND_API_KEY);

/* -------------------- user registation logic -------------------- */

export async function userRegister(prevState: any, formData: FormData) {
  const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/,
  );

  const userSquema = z
    .object({
      name: z
        .string({ invalid_type_error: "Please, enter a name" })
        .min(1, "Please, enter a name"),
      lastName: z
        .string({ invalid_type_error: "Please, enter a name" })
        .min(1, "Please, enter a last name"),
      email: z
        .string({ invalid_type_error: "Please, enter a email" })
        .min(1, "Please, enter a email"),
      password: z
        .string({ invalid_type_error: "Please, enter a password" })
        .regex(
          passwordValidation,
          "The password must contain at least 8 characters, 1 capital letter, 1 special character and 1 number",
        ),
      confirmPassword: z
        .string({ invalid_type_error: "Please, enter a password" })
        .regex(
          passwordValidation,
          "The password must contain at least 8 characters, 1 capital letter, 1 special character and 1 number",
        ),
    })
    .refine((fields: any) => fields.password === fields.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords don't match",
    });

  const validatedFields = userSquema.safeParse({
    name: formData.get("name"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to sign up",
    };
  }

  const { password, email, name, lastName } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const actualDate = new Date();

  try {
    const user = mockDb.users.update({
      where: {
        email,
      },
      data: {
        name,
        last_name: lastName,
        password: hashedPassword,
        emailVerified: actualDate,
      },
    });

    const userCode = mockDb.users_has_codes.findFirst({
      where: {
        user_id: user.id,
      },
    });

    if (userCode?.code_id) {
      mockDb.activation_codes.delete({
        where: {
          id: userCode.code_id,
        },
      });
    }
  } catch (error: any) {
    console.log(error);
    if (error.code == "P2002") {
      return { message: `The ${error.meta.target[0]} is already registered` };
    }
    return { message: "Server problem" };
  }

  redirect("/");
}

/* -------------------- generate unic code logic -------------------- */

export async function generateUnicCode() {
  let code,
    codeExist = true;
  while (codeExist) {
    if (!code) {
      code = randomUUID?.() ?? randomBytes(32).toString("hex");
    }

    const consultedCode = await getAnUserActivationCode(code);

    if (consultedCode) {
      code = randomUUID?.() ?? randomBytes(32).toString("hex");
    } else {
      codeExist = false;
    }
  }
  return code;
}

/* -------------------- send user registration logic -------------------- */

export async function storeUserRegistrationCode(
  prevState: any,
  formData: FormData,
) {
  const storeUserCodeSchema = z.object({
    email: z
      .string({ invalid_type_error: "Please enter a valid value" })
      .email("Please, enter a valid email format")
      .min(1, "Please, enter a email"),
    role: z
      .string({ invalid_type_error: "Please, enter a valid option" })
      .min(1, "Please, enter a role"),
  });

  const validatedFields = storeUserCodeSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, role } = validatedFields.data;

  // data verification logic

  const userExist = await getAnUser(email);

  if (userExist) {
    return {
      errors: {
        email: "User already exist in database",
        role: "",
      },
    };
  }

  const code = (await generateUnicCode()) || "";

  const actualDate = new Date();
  const activation_code_expired = new Date(
    actualDate.getTime() + 24 * 60 * 60 * 1000,
  );

  const role_id = parseInt(role);

  try {
    const user = mockDb.users.create({
      data: {
        email,
        user_has: [
          {
            role_id,
          },
        ],
      },
    });

    const activationCode = mockDb.activation_codes.create({
      data: {
        code,
        activation_code_expired,
      },
    });

    mockDb.users_has_codes.create({
      data: {
        user_id: user.id,
        code_id: activationCode.id,
      },
    });

    // sending email logic

    const path = process.env.NEXTAUTH_URL;

    // await resend.emails.send({
    //   from: 'Flowsup <onboarding@resend.dev>',
    //   to: [email],
    //   subject: 'Registration link',
    //   html: `<strong>Hello! Your registration link is: ${path}/sign_up/${code}</strong>`,
    // });
  } catch (error: any) {
    console.log(error?.message);
    return false;
  }

  revalidatePath("/dashboard/users");
}

/* -------------------- send user forgotted password logic -------------------- */

export async function sendForgottedPasswordUserCode(
  prevState: any,
  formData: FormData,
) {
  const forgottedPasswordUserSchema = z.object({
    email: z
      .string({ invalid_type_error: "Please enter a valid value" })
      .email("Please, enter a valid email format")
      .min(1, "Please, enter a email"),
  });

  const validatedData = forgottedPasswordUserSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedData.success) {
    return { errors: validatedData.error.flatten().fieldErrors };
  }

  const { email } = validatedData.data;

  // verify if the email exists

  const userExists = await getAnUser(email);

  if (!userExists) {
    return {
      errors: {
        email: `This email doesn't registered`,
      },
    };
  }

  // verify the if exists a code and a exp date of reset link code

  const curretnUserCode = mockDb.users.findUnique({
    where: {
      email,
      deleted_at: null,
    },
  });

  if (
    curretnUserCode &&
    curretnUserCode.user_code &&
    curretnUserCode.user_code.length > 0 &&
    curretnUserCode.user_code[0].code &&
    curretnUserCode.user_code[0].code.code
  ) {
    const currentDate = new Date();
    const expDate = new Date(
      curretnUserCode?.user_code[0].code.activation_code_expired,
    );

    if (currentDate > expDate) {
      await deleteActivationCode(curretnUserCode.user_code[0].code.code);
    } else {
      return { message: "Reset link already sended" };
    }
  }

  // end verify the current exp date of reset link code

  const code = (await generateUnicCode()) || "";

  const actualDate = new Date();
  const activation_code_expired = new Date(
    actualDate.getTime() + 24 * 60 * 60 * 1000,
  );

  try {
    const path = process.env.NEXTAUTH_URL;

    const resetLink = `${path}/forgot_password/${code}`;

    // save code

    const userCode = mockDb.activation_codes.create({
      data: {
        code,
        activation_code_expired,
      },
    });

    const userId = mockDb.users.findUnique({
      where: {
        email,
        deleted_at: null,
      },
    });

    if (userId) {
      mockDb.users_has_codes.create({
        data: {
          code_id: userCode.id,
          user_id: userId.id,
        },
      });
    }

    // send email

    // const emailData = await resend.emails.send({
    //   from: 'Flowsups <onboarding@resend.dev>',
    //   to: [email],
    //   subject: 'Password Reset',
    //   react: EmailTemplate({ resetLink }),
    // });

    return { message: "Reset link sended" };
  } catch (error) {
    console.log(error);

    return { serverError: "Server Error" };
  }
}

/* -------------------- send user forgotted password logic -------------------- */

export async function changePassword(
  email: string,
  prevState: any,
  formData: FormData,
) {
  const passwordValidation = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/,
  );

  const changePasswordSchema = z
    .object({
      password: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .regex(
          passwordValidation,
          "The password must contain at least 8 characters, 1 capital letter, 1 special character and 1 number",
        ),
      confirmPassword: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .regex(
          passwordValidation,
          "The password must contain at least 8 characters, 1 capital letter, 1 special character and 1 number",
        ),
    })
    .refine((data) => data.confirmPassword === data.password, {
      path: ["confirmPassword"],
      message: "Passwords doesn't match",
    });

  const validatedData = changePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedData.success) {
    return { errors: validatedData.error.flatten().fieldErrors };
  }

  const { password } = validatedData.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const updateUserPassword = mockDb.users.update({
      where: {
        email,
        deleted_at: null,
      },
      data: {
        password: hashedPassword,
      },
    });

    const userCode = mockDb.users_has_codes.findFirst({
      where: {
        user_id: updateUserPassword.id,
      },
    });

    if (userCode?.code_id) {
      mockDb.activation_codes.delete({
        where: {
          id: userCode.code_id,
        },
      });
    }

    return { successMessage: "Password Successfully Updated" };
  } catch (error) {
    console.log(error);

    return { serverError: "Server Error" };
  }
}

/* -------------------- change password by Token JWT  -------------------- */

const JWT_SECRET = process.env.JWT_SECRET;
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/,
);

export async function changePasswordByTokenAction(
  token: string,
  prevState: any,
  formData: FormData,
) {
  if (!JWT_SECRET || !token) {
    return { serverError: "Server Error" };
  }

  const dataSchema = z
    .object({
      newPassword: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .regex(
          passwordValidation,
          "The password must contain at least 8 characters, 1 capital letter, 1 special character and 1 number",
        ),
      confirmPassword: z
        .string({ invalid_type_error: "Please enter a valid value" })
        .min(8),
    })
    .refine((data) => data.confirmPassword === data.newPassword, {
      path: ["confirmPassword"],
      message: "Passwords doesn't match",
    });

  const validatedData = dataSchema.safeParse({
    newPassword: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedData.success) {
    return { errors: validatedData.error?.flatten().fieldErrors };
  }
  const { newPassword } = validatedData.data;

  const resetToken = token;

  try {
    const decoded = jwt.verify(resetToken, JWT_SECRET) as { userId: number };
    const hashed = await bcrypt.hash(newPassword, 10);

    mockDb.users.update({
      where: { id: decoded.userId, deleted_at: null },
      data: { password: hashed },
    });

    mockDb.users.update({
      where: { id: decoded.userId, deleted_at: null },
      data: { session_version: { increment: 1 } },
    });

    return { successMessage: "Password Successfully Updated" };
  } catch (error) {
    console.log(error);
    return { serverError: "Server Error" };
  }
}

/* -------------------- delete activation code logic -------------------- */

export async function deleteActivationCode(code: string) {
  try {
    if (code) {
      mockDb.activation_codes.delete({
        where: {
          code,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

/* -------------------- delete consent code logic -------------------- */

export async function deleteConsentCode(code: string) {
  try {
    const data = mockDb.consent_code.delete({
      where: {
        token: code,
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: "Server Error" }, { status: 500 });
  }
}

/* -------------------- login logic -------------------- */

export async function loginAction(state: any, formData: FormData) {
  try {
    const { email, password } = await loginSchema.parseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { seuccess: true };
  } catch (error) {
    console.log(error);

    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }

    return { serverError: "Server Error" };
  }
}

/* -------------------- login revalidate path logic -------------------- */

export async function loginRedirect(logged: boolean) {
  if (logged) {
    redirect("/dashboard");
  }
}

/* -------------------- delete credit app code -------------------- */

// delete credit app code

export const deleteCreditAppCode = async (code: string) => {
  try {
    const data = mockDb.credit_app_code.delete({
      where: {
        token: code,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

/* -------------------- delete credit app code -------------------- */

export async function revalidateUser() {
  revalidatePath(`/`);
}
