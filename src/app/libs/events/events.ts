import prisma from '../prisma';

export async function createEvent(
  description: string,
  updatedBy?: number,
  customerId?: number,
  createdAt?: Date,
) {
  try {
    const event = await prisma.events.create({
      data: {
        description,
        updated_at: createdAt ? createdAt.toISOString() : new Date().toISOString(),
        updated_by: updatedBy,
        client_id: customerId,
      },
    });

    const customerActivity = await prisma.clients.update({
      where: {
        id: customerId,
      },
      data: {
        last_activity: new Date(),
      },
    });

    //await prisma.$disconnect();
  } catch (error) {
    console.log(error);
  }
}

export async function trackChanges({
  prevData,
  updatedData,
  worksWith,
}: {
  prevData: { [key: string]: string | number | Date | null | boolean } | null;
  updatedData: { [key: string]: string | number | Date | null | boolean };
  worksWith: string[];
}) {
  const changedFields: string[] = [];

  if (!prevData) {
    return [];
  }

  for (const key in prevData) {
    if (worksWith.includes(key)) {
      let dateOne, dateTwo;

      if (
        prevData[key] instanceof Date &&
        updatedData[key] instanceof Date &&
        prevData[key] !== null &&
        updatedData[key] !== null &&
        prevData[key] !== undefined &&
        updatedData[key] !== undefined
      ) {
        dateOne = (prevData[key] as Date).getTime();
        dateTwo = (updatedData[key] as Date).getTime();
      }

      let fieldsHasChanged = false;

      if (dateOne !== undefined && dateTwo !== undefined) {
        fieldsHasChanged = dateOne !== dateTwo;
      } else {
        fieldsHasChanged = prevData[key] !== updatedData[key];
      }

      if (fieldsHasChanged) {
        const cleanKey = key
          .replaceAll('id', '')
          .replaceAll('_', ' ')
          .replace('seller', 'sales rep');

        const words = cleanKey.split(' ');

        const keyFormatted = returnModifiedKey(words);

        changedFields.push(keyFormatted);
      }
    }
  }

  return changedFields;
}

const returnModifiedKey = (words: string[]) => {
  let modifiedKeyArray: string[] = [];
  let modifiedKeyString = '';

  for (const word of words) {
    modifiedKeyArray.push(word.replace(word[0], word[0]?.toUpperCase()));
  }

  modifiedKeyString = modifiedKeyArray.join(' ');

  return modifiedKeyString;
};
