import { mockDb } from '../mock-db';

export async function checkDuplicateCustomerValues(
  mobilePhone: string,
  email: string,
  customerId: number,
) {
  try {
    const data = mockDb.clients.findMany({
      where: {
        id: {
          not: customerId,
        },
      },
    });

    return {
      email: data.some(
        (customer) => customer.email && customer.email.toLowerCase() === email.toLowerCase(),
      ),
      mobilePhone: data.some(
        (customer) => customer.mobile_phone && customer.mobile_phone === mobilePhone,
      ),
    };
  } catch (error) {
    console.error('Error checking duplicate customer values:', error);

    return { email: false, mobilePhone: false };
  }
}

export function handleNameAndLastnameChange(nameAndLastname: string) {
  let newVal = {
    firstname: '',
    lastname: '',
  };

  const stringArray = nameAndLastname.split(' ');

  switch (stringArray.length) {
    case 1:
      newVal.firstname = stringArray[0];
      break;

    case 2:
      newVal.firstname = stringArray[0];
      newVal.lastname = stringArray[1];
      break;

    case 3:
      newVal.firstname = stringArray.slice(0, 2).join(' ');
      newVal.lastname = stringArray[2];
      break;

    case 4:
      newVal.firstname = stringArray.slice(0, 2).join(' ');
      newVal.lastname = stringArray.slice(2, 4).join(' ');
      break;
  }

  return newVal;
}

export async function doesTheStateExist(state: string) {
  try {
    const stateData = mockDb.states.findMany({
      select: {
        id: true,
        state: true,
        state_code: true,
      },
    });

    const stateExists = stateData.find((el) => {
      const stateName = el.state.trim().toLowerCase();
      const stateCode = el.state_code.trim().toLowerCase();
      const incomingValue = state.trim().toLowerCase();

      return stateName === incomingValue || stateCode === incomingValue;
    });

    return { exists: stateExists !== undefined, stateId: stateExists ? stateExists.id : null };
  } catch (error) {
    console.log(error);

    return { exists: false, stateId: null };
  }
}

export async function checkDuplicateSmsTemplatesNames(incomingTemplateName: string) {
  try {
    let name = incomingTemplateName;

    const templates = mockDb.sms_template.findMany();

    let counter = 0;

    while (true) {
      const template = templates.find(
        (el) => el.name.trim().toLowerCase() === name.trim().toLowerCase(),
      );

      if (template) {
        counter = counter + 1;

        name = `${incomingTemplateName} (${counter})`;
      } else {
        return name;
      }
    }
  } catch (error) {
    console.log(error);

    return incomingTemplateName;
  }
}

export async function checkDuplicateEmailTemplatesNames(incomingTemplateName: string) {
  try {
    let name = incomingTemplateName;

    const templates = mockDb.email_template.findMany();

    let counter = 0;

    while (true) {
      const template = templates.find(
        (el) => el.name.trim().toLowerCase() === name.trim().toLowerCase(),
      );

      if (template) {
        counter = counter + 1;

        name = `${incomingTemplateName} (${counter})`;
      } else {
        return name;
      }
    }
  } catch (error) {
    console.log(error);

    return incomingTemplateName;
  }
}
