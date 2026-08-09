import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { checkDuplicateSmsTemplatesNames } from '@/app/libs/duplicateValues/duplicateValues';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const permissionsCheck = await checkPermissions(52);
    
      if (permissionsCheck) {
        return permissionsCheck;
      }

  const templateId = parseInt(params.id);

  const formData = await request.formData();

  const smsTemplateSchema = z.object({
    name: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    template: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
    category: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = smsTemplateSchema.safeParse({
    name: formData.get('name'),
    template: formData.get('template'),
    category: formData.get('category'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { category, name, template } = validatedData.data;

  let categoryForSmsTemplate: number;

  try {
    const categoryData = await prisma.sms_template_category.findFirst({
      where: {
        id: parseInt(category),
      },
    });

    if (!categoryData) {
      const newCategory = await prisma.sms_template_category.create({
        data: {
          category: category,
        },
      });

      categoryForSmsTemplate = newCategory.id;
    } else {
      categoryForSmsTemplate = categoryData.id;
    }

    const templateName = await checkDuplicateSmsTemplatesNames(name);

    const data = await prisma.sms_template.update({
      where: {
        id: templateId,
      },
      data: {
        name: templateName,
        template: template,
        category_id: categoryForSmsTemplate,
      },
    });

    return NextResponse.json({ successMessage: 'Template Successfully Updated' }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
