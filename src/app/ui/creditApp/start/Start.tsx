import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { useEffect, useRef, useState } from 'react';
import { Input } from '&/inputs/Input';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { Button } from '&/buttons/Button';
import { creditAppStore, publicCreditAppPageStore } from '@/store/creditApp';
import { CreditAppData, StartData } from '@/app/api/adminDashboard/creditApp/types';
import { addDays } from 'date-fns';
import { numberFormatterStore } from '@/store/adminDashboard';
import { useSocketStore } from '@/store/socketIo';
import { ConfirmNotification } from '../../notifications/Notification';
import { NativeDateInputCustom } from '../../inputs/nativeDateInputCustom/NativeDateInputCustom';

export function Start({
  idType,
  genders,
  creditAppDefault,
  customerId,
  idStateData,
}: {
  customerId: number;
  creditAppDefault: CreditAppData;
  idType:
    | {
        id: number;
        id_type: string;
      }[]
    | undefined;
  genders:
    | {
        id: number;
        gender: string;
      }[]
    | undefined;
  idStateData:
    | {
        id: number;
        id_state: string;
      }[]
    | undefined;
}) {
  // ----- global states -----

  const { ssnFormat, extractDigits } = phoneNumbersFormatStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { numberFilter } = numberFormatterStore();

  const { creditApp, setCreditApp } = creditAppStore();

  const { updateDataWithSocket } = useSocketStore();

  const { setCurrentPage } = publicCreditAppPageStore();

  useEffect(() => {
    setInputs({
      idType: creditApp.start?.idType?.toString() || '',
      idState: creditApp.start?.idState?.toString() || '',
      ssn: creditApp.start?.ssn || '',
      idNumber: creditApp.start?.idNumber || '',
      dateOfBirth: formatIncomingObjectDate(creditApp.start?.dateOfBirth, {
        useInNativeInput: true,
      }),
      issueDate: formatIncomingObjectDate(creditApp.start?.issueDate, {
        useInNativeInput: true,
      }),
      expirationDate: formatIncomingObjectDate(creditApp.start?.expirationDate, {
        useInNativeInput: true,
      }),
      cashdown: creditApp.start?.cashdown || '',
      gender: creditApp.start?.gender?.toString() || '',
      consent: creditApp.start?.consent ? '1' : '',
      noId: creditApp.start?.noId ? '1' : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditApp]);

  useEffect(() => {
    setInputs({
      idType: creditAppDefault.start?.idType?.toString() || '',
      idState: creditAppDefault.start?.idState?.toString() || '',
      ssn: creditAppDefault.start?.ssn || '',
      idNumber: creditAppDefault.start?.idNumber || '',
      dateOfBirth: formatIncomingObjectDate(creditAppDefault.start?.dateOfBirth, {
        useInNativeInput: true,
      }),
      issueDate: formatIncomingObjectDate(creditAppDefault.start?.issueDate, {
        useInNativeInput: true,
      }),
      expirationDate: formatIncomingObjectDate(creditAppDefault.start?.expirationDate, {
        useInNativeInput: true,
      }),
      cashdown: creditAppDefault.start?.cashdown || '',
      gender: creditAppDefault.start?.gender?.toString() || '',
      consent: creditAppDefault.start?.consent ? '1' : '',
      noId: creditAppDefault.start?.noId ? '1' : '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditAppDefault]);

  // ----- local states -----

  const today = new Date();
  const dateOperation = new Date().setFullYear(today.getFullYear() - 18);
  const pickerDisabledBefore = new Date(dateOperation);

  const dateInputs = ['dateOfBirth', 'expirationDate', 'issueDate'];

  const [nextToAddress, setNextToAddress] = useState(false);

  const inputEditedRef = useRef<NodeJS.Timeout | null>(null);

  const handleAvailableNextPage = () => {
    let next = false;

    const {
      cashdown,
      consent,
      dateOfBirth,
      expirationDate,
      gender,
      idNumber,
      idState,
      idType,
      issueDate,
      noId,
      ssn,
    } = inputs;

    const firstBlock = ssn && dateOfBirth && cashdown && gender ? true : false;
    const secondBlock =
      firstBlock && expirationDate && idNumber && issueDate && idType ? true : false;
    const thirdBlock = secondBlock && idState ? true : false;

    if (noId) {
      if (firstBlock) {
        next = true;
      }
    }

    if (!noId) {
      if (idType !== '3') {
        if (secondBlock) {
          next = true;
        }
      }

      if (idType === '3') {
        if (thirdBlock) {
          next = true;
        }
      }
    }

    setNextToAddress(next);

    return next;
  };

  const handleSaveAfterUpdate = async () => {
    if (inputEditedRef.current) clearTimeout(inputEditedRef.current);

    inputEditedRef.current = setTimeout(async () => {
      const formData = new FormData();

      for (const [name, value] of Object.entries(inputs)) {
        if (value) {
          if (name === 'ssn') {
            formData.append(name, extractDigits(value).slice(0, 9));
          } else if (dateInputs.includes(name)) {
            formData.append(name, formatIncomingObjectDate(new Date(value)));
          } else {
            formData.append(name, value);
          }
        }
      }

      formData.append('nextToAddress', `${handleAvailableNextPage()}`);

      const apiUrl = `/api/public/creditApp/start/${customerId}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        options: {
          onSuccess: (data: StartData) => {
            setInputs((prevState) => {
              const newState = { ...prevState };

              newState.ssn = data.ssn || '';
              newState.dateOfBirth = formatIncomingObjectDate(data.dateOfBirth, {
                useInNativeInput: true,
              });
              newState.idType = data.idType?.toString() || '';
              newState.noId = data.noId ? '1' : '';
              newState.idNumber = data.idNumber || '';
              newState.issueDate = formatIncomingObjectDate(data.issueDate, {
                useInNativeInput: true,
              });
              newState.expirationDate = formatIncomingObjectDate(data.expirationDate, {
                useInNativeInput: true,
              });
              newState.cashdown = data.cashdown || '';
              newState.gender = data.gender?.toString() || '';
              newState.consent = data.consent ? '1' : '';
              newState.idState = data.idState?.toString() || '';

              return newState;
            });

            const newCreditAppState: typeof creditApp = { ...creditApp, start: data };

            setCreditApp(newCreditAppState);

            setDoUpdate(false);

            updateDataWithSocket('creditApp', undefined, {
              start: true,
              customerId,
            });
          },
        },
      });
    }, 1500);
  };

  const [inputs, setInputs] = useState({
    idType: '',
    idState: '',
    ssn: '',
    idNumber: '',
    dateOfBirth: '',
    issueDate: '',
    expirationDate: '',
    cashdown: '',
    gender: '',
    consent: '',
    noId: '',
  });

  const [warningMssg, setWarningMssg] = useState('');
  const [noIdChecked, setNoIdChecked] = useState(false);
  const [doUpdate, setDoUpdate] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.currentTarget;

    if (e.currentTarget instanceof HTMLInputElement && type === 'checkbox') {
      const { checked } = e.currentTarget;

      if (name === 'consent') {
        setInputs((prevState) => ({ ...prevState, consent: checked ? '1' : '' }));

        setDoUpdate(true);

        return;
      }

      setInputs((prevState) => {
        let newState = { ...prevState };

        newState.noId = checked ? '1' : '';

        newState.idState = '';
        newState.idType = '';
        newState.idNumber = '';
        newState.issueDate = '';
        newState.expirationDate = '';

        return newState;
      });

      setDoUpdate(true);

      return;

      setNoIdChecked(checked);

      setWarningMssg('Are you sure you want to set the Customer ID to null?');

      return;
    }

    let inputValue = value;
    let doUpdateVal = true;

    if (name === 'idNumber') inputValue = value.replace(/[^0-9-]/g, '');
    if (name === 'cashdown') inputValue = numberFilter(value);

    if (name === 'dateOfBirth') {
      if (!value) {
        doUpdateVal = false;
      }
      const yearString = new Date(value).getFullYear().toString();

      const newVal = new Date(value).getTime();

      const dateLimit = pickerDisabledBefore.getTime();

      if (yearString.length === 4) {
        if (newVal > dateLimit) {
          inputValue = '';

          doUpdateVal = false;

          setManualFieldErrors({
            dateOfBirth: ['Age 18+ required'],
          });
        }
      } else {
        doUpdateVal = false;
      }
    }

    setInputs((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));

    setDoUpdate(doUpdateVal);
  };

  const handlePickADateOfBirth = (e: Date) => {
    setInputs((prevState) => ({
      ...prevState,
      dateOfBirth: formatIncomingObjectDate(e),
    }));
  };

  const handlePickAIssueDate = (e: Date) => {
    setInputs((prevState) => ({
      ...prevState,
      issueDate: formatIncomingObjectDate(e),
    }));
  };

  const handlePickAExpirationDate = (e: Date) => {
    setInputs((prevState) => ({
      ...prevState,
      expirationDate: formatIncomingObjectDate(e),
    }));
  };

  const inputData = [
    {
      id: 1,
      value: ssnFormat(inputs.ssn),
      name: 'ssn',
      type: 'text',
      label: 'SSN',
      width: 0,
      onChange: handleChange,
    },
    {
      id: 2,
      value: inputs.dateOfBirth,
      name: 'dateOfBirth',
      type: 'DottedDate',
      label: 'Date of Birth',
      width: 0,
      inputDate: true,
      dayPickerDisabledAfter: pickerDisabledBefore,
      defaultMonth: pickerDisabledBefore,
      onChange: handleChange,
      onPick: handlePickADateOfBirth,
      noDisabledBgColor: true,
    },
    {
      id: 3,
      value: inputs.idType,
      name: 'idType',
      type: 'select',
      label: 'Id Type',
      width: 0,
      options: idType?.map((el) => {
        return { value: el.id, option: el.id_type };
      }),
      onChange: handleChange,
      disabled: inputs.noId ? true : false,
      noDisabledBgColor: inputs.noId ? false : true,
    },
    {
      id: 11,
      value: inputs.noId,
      name: 'noId',
      type: 'checkbox',
      chekcboxText: 'No ID',
      width: 0,
      onChange: handleChange,
    },
    {
      id: inputs.idType === '3' ? 4 : 0,
      value: inputs.idState,
      name: 'idState',
      type: 'select',
      label: 'ID State',
      width: 0,
      options: idStateData?.map((el) => {
        return { value: el.id, option: el.id_state };
      }),
      onChange: handleChange,
    },
    {
      id: 5,
      value: inputs.idNumber,
      name: 'idNumber',
      type: 'text',
      label: 'Id Number',
      width: 0,
      disabled: inputs.noId ? true : false,
      noDisabledBgColor: inputs.noId ? false : true,
      onChange: handleChange,
    },
    {
      id: 6,
      value: inputs.issueDate,
      name: 'issueDate',
      type: 'DottedDate',
      label: 'Id Issue Date',
      width: 0,
      inputDate: true,
      disabled: true,
      dayPickerDisabledAfter: new Date(),
      onChange: handleChange,
      onPick: handlePickAIssueDate,
      noDisabledBgColor: inputs.noId ? false : true,
      disabledDayPickerBtn: inputs.noId ? true : false,
    },
    {
      id: 7,
      value: inputs.expirationDate,
      name: 'expirationDate',
      type: 'DottedDate',
      label: 'Id Expiration Date',
      width: 0,
      inputDate: true,
      disabled: true,
      dayPickerDisabledbefore: addDays(new Date(inputs.issueDate || today), 1),
      onChange: handleChange,
      onPick: handlePickAExpirationDate,
      noDisabledBgColor: inputs.noId ? false : true,
      disabledDayPickerBtn: inputs.noId ? true : false,
    },
    {
      id: 8,
      value: inputs.cashdown,
      name: 'cashdown',
      type: 'text',
      label: 'Cash Down',
      width: 0,
      onChange: handleChange,
    },
    {
      id: 9,
      value: inputs.gender,
      name: 'gender',
      type: 'select',
      label: 'Gender',
      width: 0,
      options: genders?.map((el) => {
        return { value: el.id, option: el.gender };
      }),
      onChange: handleChange,
    },
    {
      id: 10,
      value: inputs.consent,
      name: 'consent',
      type: 'checkbox',
      chekcboxText: 'Consent to Send Automated SMS',
      width: 0,
      label: '',
      onChange: handleChange,
    },
  ];

  const { fieldErrors, loadingFetch, makeAsyncFetch, setManualFieldErrors } = useAsyncFetching();

  const handleDecision = (decision: boolean) => {
    if (decision) {
      setInputs((prevState) => {
        let newState = { ...prevState };

        newState.noId = noIdChecked ? '1' : '';

        newState.idState = '';
        newState.idType = '';
        newState.idNumber = '';
        newState.issueDate = '';
        newState.expirationDate = '';

        return newState;
      });

      setDoUpdate(true);

      setWarningMssg('');
    } else {
      setWarningMssg('');
    }
  };

  useEffect(() => {
    if (doUpdate) {
      handleSaveAfterUpdate();
    }

    if (inputs) {
      if (inputs.noId) {
        setManualFieldErrors({
          ssn: !inputs.ssn ? ['Required'] : [''],
          dateOfBirth: !inputs.dateOfBirth
            ? fieldErrors?.dateOfBirth
              ? fieldErrors?.dateOfBirth
              : ['Required']
            : [''],
          cashdown: !inputs.cashdown ? ['Required'] : [''],
          gender: !inputs.gender ? ['Required'] : [''],
          consent: !inputs.consent ? ['Required'] : [''],
        });
      } else {
        if (inputs.idType !== '3') {
          setManualFieldErrors({
            ssn: !inputs.ssn ? ['Required'] : [''],
            dateOfBirth: !inputs.dateOfBirth
              ? fieldErrors?.dateOfBirth
                ? fieldErrors?.dateOfBirth
                : ['Required']
              : [''],
            cashdown: !inputs.cashdown ? ['Required'] : [''],
            gender: !inputs.gender ? ['Required'] : [''],
            expirationDate: !inputs.expirationDate ? ['Required'] : [''],
            idNumber: !inputs.idNumber ? ['Required'] : [''],
            issueDate: !inputs.issueDate ? ['Required'] : [''],
            idType: !inputs.idType ? ['Required'] : [''],
            consent: !inputs.consent ? ['Required'] : [''],
          });
        } else {
          setManualFieldErrors({
            ssn: !inputs.ssn ? ['Required'] : [''],
            dateOfBirth: !inputs.dateOfBirth ? ['Required'] : [''],
            cashdown: !inputs.cashdown ? ['Required'] : [''],
            gender: !inputs.gender ? ['Required'] : [''],
            expirationDate: !inputs.expirationDate ? ['Required'] : [''],
            idNumber: !inputs.idNumber ? ['Required'] : [''],
            issueDate: !inputs.issueDate ? ['Required'] : [''],
            idType: !inputs.idType ? ['Required'] : [''],
            idState: !inputs.idState ? ['Required'] : [''],
            consent: !inputs.consent ? ['Required'] : [''],
          });
        }
      }

      handleAvailableNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  return (
    <aside className="relative md:mt-[2rem] lg:w-[70vw] lg:mx-auto">
      <ConfirmNotification notiMessage={warningMssg} onDecision={handleDecision} />
      <article className="px-[0.5rem] py-[0.5rem] flex flex-col gap-[1rem] md:grid md:grid-cols-3 md:gap-8">
        {inputData.map((el, index) =>
          el.id !== 0 ? (
            !dateInputs.includes(el.name) ? (
              <Input
                key={`~~111${el.id * index + 75}kkk$${el.id}`}
                label={el.label}
                name={el.name}
                type={el.type}
                width={el.width}
                value={el.name === 'cashdown' ? numberFilter(el.value, 1) : el.value}
                inputDate={el.inputDate}
                options={el.options}
                onChange={el.onChange}
                disabled={el.disabled || loadingFetch}
                isLoading={loadingFetch}
                noDisabledBgColor={el.noDisabledBgColor}
                onDayPickerClick={el.onPick}
                dayPickerDisabledAfter={el.dayPickerDisabledAfter}
                dayPickerDisabledbefore={el.dayPickerDisabledbefore}
                defaultMonth={el.defaultMonth}
                chekcboxText={el.chekcboxText}
                customCheckbox
                fieldErrors={fieldErrors}
                disabledDayPickerBtn={el.disabledDayPickerBtn}
              />
            ) : (
              <NativeDateInputCustom
                key={`~~111${el.id * index + 75}kkk$${el.id}`}
                label={el.label}
                name={el.name}
                value={el.value}
                maxDateAvailable={el.dayPickerDisabledAfter}
                minDateAvailable={el.dayPickerDisabledbefore}
                fieldErrors={fieldErrors}
                loading={loadingFetch}
                disabled={el.disabledDayPickerBtn}
                onChange={el.onChange}
              />
            )
          ) : null,
        )}
      </article>
      <article className="mt-[1vh] w-full px-[0.5rem] lg:px-[6vw] pb-[0.5rem] md:w-[50vw] md:mx-auto md:mt-[2.5vh] lg:w-[35vw]">
        <Button
          backgroundColor="#FFF"
          identity="next"
          textColor="#00a78b"
          buttonText={'Next'}
          border={0.05}
          width={0}
          borderColor="#00a78b"
          buttonTextSize={2}
          onClick={() => {
            if (nextToAddress) {
              setCurrentPage(1);
            }
          }}
          disabled={!nextToAddress || loadingFetch}
        />
      </article>
      {/* {loadingFetch && <Loader rounded="1.2rem" />} */}
    </aside>
  );
}
