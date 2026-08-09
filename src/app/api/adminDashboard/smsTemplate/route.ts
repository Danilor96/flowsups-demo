import { z } from 'zod';
import prisma from '@/app/libs/prisma';
import { NextResponse } from 'next/server';
import { checkDuplicateSmsTemplatesNames } from '@/app/libs/duplicateValues/duplicateValues';
import { checkPermissions } from '@/app/libs/auth-helpers';

export async function POST(request: Request) {
  const permissionsCheck = await checkPermissions(52);
    
      if (permissionsCheck) {
        return permissionsCheck;
      }

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
    userId: z
      .string({ invalid_type_error: 'Please enter a valid value' })
      .min(1, 'Please enter a value'),
  });

  const validatedData = smsTemplateSchema.safeParse({
    name: formData.get('name'),
    template: formData.get('template'),
    category: formData.get('category'),
    userId: formData.get('userId'),
  });

  if (!validatedData.success) {
    return NextResponse.json(
      { fieldErrors: validatedData.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { category, name, template, userId } = validatedData.data;

  let categoryForSmsTemplate: number;

  try {
    const categoryData = await prisma.sms_template_category.findFirst({
      where: {
        category: category,
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

    const data = await prisma.sms_template.create({
      data: {
        name: templateName,
        template: template,
        created_by: parseInt(userId),
        creted_date: new Date(),
        category_id: categoryForSmsTemplate,
      },
    });

    //await prisma.$disconnect();

    return NextResponse.json({ successMessage: 'Template Successfully Created' });
  } catch (error) {
    console.log(error);

    //await prisma.$disconnect();

    return NextResponse.json({ serverError: 'Server Error' }, { status: 500 });
  }
}
