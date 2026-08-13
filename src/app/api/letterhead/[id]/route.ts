import { z } from "zod";
import { NextResponse } from "next/server";
import { mockDb } from "@/app/libs/mock-db";

const mockUploadUrl = (name: string) =>
  `https://firebasestorage.googleapis.com/v0/b/flowsups-iles.appspot.com/o/images%2F${encodeURIComponent(name)}?alt=media`;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const letterheadId = parseInt(params.id);

  const formData = await request.formData();

  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const letterheadSchema = z.object({
    headerInput: z
      .any()
      .refine(
        (file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        {
          message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        },
      ),
    footerInput: z
      .any()
      .refine(
        (file: File) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        {
          message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        },
      ),
  });

  const validatedData = letterheadSchema.safeParse({
    headerInput: formData.get("headerInput"),
    footerInput: formData.get("footerInput"),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { footerInput, headerInput } = validatedData.data;

  try {
    if (headerInput) {
      const letterhead = mockDb.letterhead.findUnique({
        where: {
          id: letterheadId,
        },
      });

      const path = mockUploadUrl(headerInput.name);

      if (letterhead?.header_id) {
        mockDb.header_email_template.update({
          where: {
            id: letterhead.header_id,
          },
          data: {
            header: path,
            name: headerInput.name,
          },
        });
      }

      mockDb.letterhead.update({
        where: {
          id: letterheadId,
        },
        data: {
          header: {
            id: Number(letterhead?.header_id),
            header: path,
            name: headerInput.name,
          },
        },
      });
    }

    if (footerInput) {
      const letterhead = mockDb.letterhead.findUnique({
        where: {
          id: letterheadId,
        },
      });

      const path = mockUploadUrl(footerInput.name);

      if (letterhead?.footer_id) {
        mockDb.footer_email_template.update({
          where: {
            id: letterhead.footer_id,
          },
          data: {
            footer: path,
            name: footerInput.name,
          },
        });
      }

      mockDb.letterhead.update({
        where: {
          id: letterheadId,
        },
        data: {
          footer: {
            id: Number(letterhead?.footer_id),
            footer: path,
            name: footerInput.name,
          },
        },
      });
    }

    return NextResponse.json({
      successMessage: "Letterhead Successfully Updated",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: "Server Error" }, { status: 500 });
  }
}
