'use client';

import { useCallback, useEffect, useState } from 'react';
import { InputMobile } from '&/inputs/InputMobile';
import { PhoneNumberInputMobile } from '&/inputs/PhoneNumberInputMobile';
import { SelectMobile } from '&/select/selectMobile/SelectMobile';
import { CheckboxInputMobile } from '&/inputs/CheckboxInputMobile';
import { Button } from '&/buttons/Button';
import {
  ConsentTermChecks,
  ConsentTermStatement,
  CustomerConsentData,
  StatesData,
} from '@/app/libs/definitions';
import { AnimatePresence, motion } from 'framer-motion';
import { FailNotification, SuccessNotification } from '&/notifications/Notification';
import { useSocketStore } from '@/store/socketIo';

export function CustomerConsent({
  data,
  statesData,
  checks,
  statement,
  test,
}: {
  data: CustomerConsentData;
  statesData: StatesData | undefined;
  checks?: ConsentTermChecks;
  statement?: ConsentTermStatement;
  test: boolean;
}) {
  // global states

  const { updateDataWithSocket, initializeSocket } = useSocketStore();

  useEffect(() => {
    initializeSocket('customer');
  }, [initializeSocket]);

  // local states
  const [inputs, setInputs] = useState<{
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    countryCode: string | null;
    dateOfBirth: string | null | null;
    email: string | null;
    street: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
  }>({
    id: null,
    firstName: null,
    lastName: null,
    phone: null,
    countryCode: '1',
    dateOfBirth: null,
    email: null,
    street: null,
    city: null,
    state: null,
    zipCode: null,
  });

  const [checkInputs, setCheckInputs] = useState<
    { id: number; description: string; required: boolean; checked: boolean }[]
  >([]);

  useEffect(() => {
    if (checks && checks.length > 0) {
      const arrayData = [...checks];

      const dataFormatted: typeof checkInputs = [];

      for (let i = 0; i < arrayData.length; i++) {
        const el = arrayData[i];

        dataFormatted.push({
          id: el.id,
          description: el.description,
          required: el.required,
          checked: false,
        });
      }

      dataFormatted.sort((a, b) => {
        if (a.id === 3 && b.id !== 3) {
          return 1;
        }

        if (b.id === 3 && a.id !== 3) {
          return -1;
        }

        return 0;
      });

      setCheckInputs(dataFormatted);
    }
  }, [checks]);

  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    firstName: [string | undefined];
    lastName: [string | undefined];
    phone: [string | undefined];
    countryCode: [string | undefined];
    dateOfBirth: [string | undefined];
    email: [string | undefined];
    street: [string | undefined];
    city: [string | undefined];
    state: [string | undefined];
    zipCode: [string | undefined];
    checks: [string | undefined];
  }>({
    firstName: [undefined],
    lastName: [undefined],
    phone: [undefined],
    countryCode: [undefined],
    dateOfBirth: [undefined],
    email: [undefined],
    street: [undefined],
    city: [undefined],
    state: [undefined],
    zipCode: [undefined],
    checks: [undefined],
  });

  useEffect(() => {
    if (data) {
      setInputs((prevState) => ({
        ...prevState,
        id: data.id?.toString(),
        firstName: data.customer.first_name,
        lastName: data.customer.last_name,
        phone: data.customer.mobile_phone,
        countryCode: data?.customer.country_phone_code_id
          ? data?.customer.country_phone_code_id.toString()
          : prevState.countryCode,
        dateOfBirth: data?.customer.born_date
          ? new Date(data.customer.born_date).toISOString().split('T')[0]
          : null,
        email: data.customer.email,
        street: data.customer.client_address?.street || '',
        city: data.customer.client_address?.city || '',
        state: data.customer.client_address?.state?.id?.toString() || '',
        zipCode: data.customer.client_address?.zip ? data.customer.client_address?.zip : null,
      }));
    }
  }, [data]);

  const [serverSuccessMessage, setServerSuccessMessage] = useState<any>();
  const [serverErrorMessage, setServerErrorMessage] = useState<any>();
  const [states, setStates] = useState<{ id: number | undefined; value: string | undefined }[]>([]);
  const [consentSent, setConsentSent] = useState<boolean>(false);

  useEffect(() => {
    if (statesData && statesData.length > 0) {
      statesData.forEach((el) => {
        setStates((prevState) => [...prevState, { id: el.id, value: el.state }]);
      });
    }
  }, [statesData]);

  // handling inputs

  const handleInputs = async (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // country code value
    if (name === 'countryCode' && e.currentTarget instanceof HTMLButtonElement) {
      const { opt } = e.currentTarget.dataset;

      if (opt) setInputs((prevInputs) => ({ ...prevInputs, [name]: opt }));
    }

    // checkboxes
    if (name === 'acceptPolicy' && e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;

      checked
        ? setInputs((prevInputs) => ({ ...prevInputs, [name]: '1' }))
        : setInputs((prevInputs) => ({ ...prevInputs, [name]: '' }));
    } else if (name === 'certifyStatements' && e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;

      checked
        ? setInputs((prevInputs) => ({ ...prevInputs, [name]: '1' }))
        : setInputs((prevInputs) => ({ ...prevInputs, [name]: '' }));
    } else if (name === 'sentSms' && e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;

      checked
        ? setInputs((prevInputs) => ({ ...prevInputs, [name]: '1' }))
        : setInputs((prevInputs) => ({ ...prevInputs, [name]: '' }));
    }
  };

  const handleChecks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    const idToUpdate = parseInt(name);

    setCheckInputs((prevState) => {
      return prevState.map((item) =>
        item.id === idToUpdate ? { ...item, checked: !item.checked } : item,
      );
    });
  };

  const checkRequiredTermsAndConditions = async () => {
    const currentChecksEl = [...checkInputs];

    let requiredSelcted = true;

    const existsRequiredNoSelected = currentChecksEl.find(
      (el) => el.required === true && el.checked === false,
    );

    if (existsRequiredNoSelected) {
      requiredSelcted = false;
    }

    return requiredSelcted;
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);

    const requiredOk = await checkRequiredTermsAndConditions();

    if (!requiredOk) {
      setFieldErrors((prevState) => ({
        ...prevState,
        checks: ['Required to continue'],
      }));

      setLoading(false);

      return;
    }

    const formData = new FormData();

    for (const [key, value] of Object.entries(inputs)) {
      key !== 'id' && value && formData.append(key, value);
    }

    formData.append('checks', JSON.stringify(checkInputs));

    try {
      const res = await (
        await fetch(`/api/consentForm/${inputs.id}`, {
          method: 'PUT',
          body: formData,
        })
      ).json();

      if (res.successMessage) {
        // , data?.customer?.seller?.email);
        if (data)
          updateDataWithSocket('singleClient', undefined, {
            customerId: data.customer_id,
          });

        setServerSuccessMessage(res.successMessage);
        setConsentSent(true);
      }
      if (res.serverError) {
        setServerErrorMessage(res.serverError);
      }
      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
      }
    } catch (error) {
      setServerErrorMessage('An error occurred');
    }

    setLoading(false);
  };

  // info for creation of the inputs

  const inputMobileContentRowOne = [
    {
      id: 1,
      label: 'First Name',
      name: 'firstName',
      type: 'text',
      value: inputs.firstName,
      onChange: handleInputs,
    },
    {
      id: 2,
      label: 'Last Name',
      name: 'lastName',
      type: 'text',
      value: inputs.lastName,
      onChange: handleInputs,
    },
    {
      id: 3,
      label: 'Phone',
      name: 'phone',
      type: 'text',
      countryCode: inputs.countryCode,
      value: inputs.phone,
      onChange: handleInputs,
    },
    {
      id: 4,
      label: 'Date of Birth',
      name: 'dateOfBirth',
      type: 'date',
      value: inputs.dateOfBirth,
      onChange: handleInputs,
    },
    {
      id: 5,
      label: 'Email',
      name: 'email',
      type: 'email',
      value: inputs.email,
      onChange: handleInputs,
    },
  ];

  const inputMobileContentRowTwo = [
    {
      id: 6,
      label: 'Street',
      name: 'street',
      type: 'text',
      width: 95,
      value: inputs.street,
      onChange: handleInputs,
    },
    {
      id: 7,
      label: 'City',
      name: 'city',
      type: 'text',
      width: 95,
      value: inputs.city,
      onChange: handleInputs,
    },
    {
      id: 8,
      label: 'State',
      name: 'state',
      width: 95,
      value: inputs.state,
      select: true,
      onChange: handleInputs,
    },
    {
      id: 9,
      label: 'Zip code',
      name: 'zipCode',
      type: 'text',
      width: 95,
      value: inputs.zipCode,
      onChange: handleInputs,
    },
  ];

  // reset server messages
  useEffect(() => {
    setTimeout(() => {
      if (serverErrorMessage) {
        setServerErrorMessage('');
      }

      if (serverSuccessMessage) {
        setServerSuccessMessage('');
      }
    }, 4000);
  }, [serverErrorMessage, serverSuccessMessage]);

  return (
    <main>
      <AnimatePresence>
        {!consentSent ? (
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=""
          >
            {/* message from the server */}
            <AnimatePresence>
              {serverSuccessMessage && (
                <SuccessNotification width={95} apiMessage={serverSuccessMessage} />
              )}
              {serverErrorMessage && (
                <FailNotification width={95} apiMessage={serverErrorMessage} />
              )}
            </AnimatePresence>
            <aside className="lg:w-[67vw] lg:mx-auto">
              <h2 className="text-[2.5vh] md:text-[3vh] text-gray-900 font-semibold mt-[2vh] ml-[1vw] md:ml-0 max-lg:text-xl max-lg:mt-4 max-lg:ml-4">
                Personal
              </h2>
              <section className="px-4 md:px-0 py-[2vh] flex flex-col md:grid md:grid-cols-2 md:justify-self-center justify-center items-center gap-[3vh] lg:grid-cols-3 lg:w-full max-lg:gap-6">
                {/* inputs row 1 */}
                {inputMobileContentRowOne.map((el, index) =>
                  el.name === 'phone' ? (
                    <PhoneNumberInputMobile
                      key={`${el.id * index + 34}dddd`}
                      countryName="countryCode"
                      countryValue={el.countryCode ? el.countryCode : ''}
                      label="Phone"
                      name="phone"
                      value={el.value ? el.value : undefined}
                      onChange={el.onChange}
                      fieldErrors={fieldErrors}
                    />
                  ) : (
                    <InputMobile
                      key={`${el.id * 88}aaaaaaaa${index + index + 1}`}
                      label={el.label}
                      name={el.name}
                      type={el.type}
                      value={el.value ? el.value : undefined}
                      onChange={el.onChange}
                      fieldErrors={fieldErrors}
                    />
                  ),
                )}
              </section>
            </aside>
            <aside className="lg:w-[67vw] lg:mx-auto">
              <h2 className="text-[2.5vh] md:text-[3vh] text-gray-900 font-semibold mt-[2vh] ml-[1vw] md:ml-0 max-lg:text-xl max-lg:mt-4 max-lg:ml-4">
                Residence
              </h2>
              <section className="px-4 py-[2vh] flex flex-col justify-center items-center gap-[3vh] md:grid md:grid-cols-2 md:px-0 lg:grid-cols-3 lg:w-full max-lg:gap-6">
                {/* inputs row 2 */}
                {inputMobileContentRowTwo.map((el, index) =>
                  el.select ? (
                    <SelectMobile
                      key={`${el.id * 64}OOosss${index + 24}`}
                      name={el.name}
                      label={el.label}
                      onChange={el.onChange}
                      value={el.value}
                      dataOption={states}
                      fieldErrors={fieldErrors}
                    />
                  ) : (
                    <InputMobile
                      key={`${el.id}ffffffff${index + index + 4 / 3}`}
                      label={el.label}
                      name={el.name}
                      type={el.type}
                      value={el.value}
                      onChange={el.onChange}
                      fieldErrors={fieldErrors}
                    />
                  ),
                )}
                <article className="flex flex-col gap-[3vh] md:col-span-2 lg:col-span-3">
                  <p className="text-[1.8vh] font-normal text-gray-800 md:text-[2.3vh] max-lg:text-sm max-lg:leading-relaxed">
                    {statement?.consent_statement}
                  </p>
                  {checkInputs &&
                    checkInputs.length > 0 &&
                    checkInputs.map((el, index) => (
                      <CheckboxInputMobile
                        key={`aaa${el.id}checksss${index + index}`}
                        chekcboxText={el.description}
                        value={el.checked ? '1' : ''}
                        name={`${el.id}`}
                        onChange={handleChecks}
                        fieldErrors={
                          el.required && !el.checked
                            ? { [`${el.id}`]: fieldErrors.checks }
                            : undefined
                        }
                      />
                    ))}
                  <aside className="lg:flex lg:w-[12vw] lg:mx-auto">
                    <Button
                      backgroundColor={`${loading || test ? '#5ac0af' : '#00A78B'}`}
                      buttonText={`${loading || test ? 'Submitting form' : 'Submit'}`}
                      height={6}
                      identity="submit"
                      textColor={`${loading ? '#00A78B' : '#FFF'}`}
                      width={60}
                      marginInlineAuto
                      disabled={loading || test}
                      onClick={handleButton}
                    />
                  </aside>
                </article>
              </section>
            </aside>
          </motion.article>
        ) : (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[2vh] text-gray-900 font-normal px-[1.5vw] lg:h-full"
          >
            Thank you. The process was successful. You can close this window.
          </motion.h2>
        )}
      </AnimatePresence>
    </main>
  );
}
