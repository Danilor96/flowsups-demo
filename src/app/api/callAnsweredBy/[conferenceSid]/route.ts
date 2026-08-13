import { mockDb } from "@/app/libs/mock-db";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { conferenceSid: string } },
) {
  const conferenceSid = params.conferenceSid;

  const formData = await request.formData();

  const answeredBySchema = z.object({
    userEmail: z
      .string({ invalid_type_error: "Please enter a valid value" })
      .nullable(),
    userMobilePhoneNumber: z
      .string({ invalid_type_error: "Please enter a valid value" })
      .nullable(),
  });

  const validatedData = answeredBySchema.safeParse({
    userEmail: formData.get("userEmail"),
    userMobilePhoneNumber: formData.get("userMobilePhoneNumber"),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { userEmail, userMobilePhoneNumber } = validatedData.data;

  try {
    let userId: number | null = null;

    if (userEmail) {
      const answeredUserEmail = mockDb.users.findUnique({
        where: {
          email: userEmail,
          deleted_at: null,
        },
      });

      if (answeredUserEmail) userId = answeredUserEmail?.id;
    }

    if (userMobilePhoneNumber) {
      const answeredUserEmail = mockDb.users.findUnique({
        where: {
          mobile_phone: userMobilePhoneNumber,
          deleted_at: null,
        },
      });

      if (answeredUserEmail) userId = answeredUserEmail?.id;
    }

    if (userId) {
      const dataToRemove = mockDb.client_calls.findUnique({
        where: {
          call_sid: conferenceSid,
        },
      });

      const filteredData = dataToRemove?.user_id.filter(
        (id: any) => id !== userId,
      );

      mockDb.client_calls.update({
        where: {
          call_sid: conferenceSid,
        },
        data: {
          user_id: filteredData,
        },
      });

      return NextResponse.json({ successMessage: "Call Successfully Updated" });
    }

    return NextResponse.json({ successMessage: "User Not Found" });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: "Server Error" }, { status: 500 });
  }
}
