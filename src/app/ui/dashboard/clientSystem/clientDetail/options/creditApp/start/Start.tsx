import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '&/inputs/Input';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { Button } from '&/buttons/Button';
import {
  adminDashboardStore,
  creditAppPaginationStore,
  numberFormatterStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { creditAppStore } from '@/store/creditApp';
import { addDays, differenceInDays } from 'date-fns';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { StartData } from '@/app/api/adminDashboard/creditApp/types';
import { SsnInput } from './ssnInput/SsnInput';

export function Start() {
  // ----- global states -----

  const { creditApp } = creditAppStore();
  const { setCreditApp } = creditAppStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { singleCLientData } = singleCLientDataStore();

  const { nextPage } = creditAppPaginationStore();

  const { idTypeData, idStateData, genderData } = adminDashboardStore();
  const { getIdType, getIdState, getGender } = adminDashboardStore();

  const { ssnFormat, extractDigits } = phoneNumbersFormatStore();

  const { numberFilter } = numberFormatterStore();

  const { updateDataWithSocket } = useSocketStore();

  const getPromiseData = useCallback(() => {
    return [getIdType(), getIdState(), getGender()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData, [singleCLientData]);

  // ----- local states -----

  useEffect(() => {
    if (creditApp) {
      setInputs({
        idType: creditApp.start?.idType?.toString() || '',
        idState: creditApp.start?.idState?.toString() || '',
        ssn: ssnFormat(creditApp.start?.ssn || ''),
        idNumber: creditApp.start?.idNumber || '',
        dateOfBirth: formatIncomingObjectDate(creditApp.start?.dateOfBirth),
        issueDate: formatIncomingObjectDate(creditApp.start?.issueDate),
        expirationDate: formatIncomingObjectDate(creditApp.start?.expirationDate),
        cashdown: creditApp.start?.cashdown || '',
        gender: creditApp.start?.gender?.toString() || '',
        consent: creditApp.start?.consent ? '1' : '',
        noId: creditApp.start?.noId ? '1' : '',
      });
    } else {
      setInputs({
        idType: '',
        idState: '',
        ssn: ssnFormat(singleCLientData?.social_security || ''),
        idNumber: '',
        dateOfBirth: formatIncomingObjectDate(singleCLientData?.born_date),
        issueDate: '',
        expirationDate: '',
        cashdown: '',
        gender: '',
        consent: '',
        noId: '',
      });
    }
  }, [creditApp, singleCLientData, ssnFormat, formatIncomingObjectDate]);

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

  const inputEditedRef = useRef<NodeJS.Timeout | null>(null);

  const [doUpdate, setDoUpdate] = useState(false);
  const [nextToAddress, setNextToAddress] = useState(false);

  const handleSaveAfterUpdate = async () => {
    if (inputEditedRef.current) clearTimeout(inputEditedRef.current);

    inputEditedRef.current = setTimeout(async () => {
      const formData = new FormData();

      for (const [name, value] of Object.entries(inputs)) {
        if (value) formData.append(name, name === 'ssn' ? extractDigits(value).slice(0, 9) : value);
      }

      formData.append('nextToAddress', `${handleAvailableNextPage()}`);

      const apiUrl = `/api/adminDashboard/creditApp/start/${singleCLientData?.id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        noShowMessage: true,
        options: {
          onSuccess: (data: StartData) => {
            setInputs((prevState) => {
              const newState = { ...prevState };

              newState.ssn = data.ssn || '';
              newState.dateOfBirth = formatIncomingObjectDate(data.dateOfBirth) || '';
              newState.idType = data.idType?.toString() || '';
              newState.noId = data.noId ? '1' : '';
              newState.idNumber = data.idNumber || '';
              newState.issueDate = formatIncomingObjectDate(data.issueDate) || '';
              newState.expirationDate = formatIncomingObjectDate(data.expirationDate) || '';
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
              customerId: singleCLientData?.id,
            });
          },
        },
      });
    }, 1500);
  };

  const [warningMssg, setWarningMssg] = useState('');
  const [noIdChecked, setNoIdChecked] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.currentTarget;

    if (e.currentTarget instanceof HTMLInputElement && type === 'checkbox') {
      const { checked } = e.currentTarget;

      // setNoIdChecked(checked);

      // setWarningMssg('Are you sure you want to set the Customer ID to null?');

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
    }

    let inputValue = value;

    if (name === 'idNumber') inputValue = value.replace(/[^0-9-]/g, '');
    if (name === 'cashdown') inputValue = numberFilter(value);

    setInputs((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));

    setDoUpdate(true);
  };

  const handleClientSocialSecurity = (e: React.ChangeEvent<HTMLInputElement>, showSsn: boolean) => {
    const inputValue = e.target.value;

    if (showSsn) {
      setInputs((prevState) => ({
        ...prevState,
        ssn: inputValue,
      }));

      setDoUpdate(true);

      return;
    }

    // Logic to preserve hidden digits when editing masked value
    const bulletCount = (inputValue.match(/•/g) || []).length;
    const visibleDigits = inputValue.replace(/[^0-9]/g, '');
    const currentRealDigits = inputs.ssn.replace(/\D/g, '');

    // We take the first 'bulletCount' digits from the existing state as the hidden part
    const hiddenDigits = currentRealDigits.slice(0, bulletCount);
    const result = hiddenDigits + visibleDigits;
    setInputs((prevState) => ({
      ...prevState,
      ssn: result.slice(0, 9),
    }));

    setDoUpdate(true);
  };

  const handlePickADateOfBirth = (e: Date) => {
    setInputs((prevState) => ({
      ...prevState,
      dateOfBirth: formatIncomingObjectDate(e),
    }));

    setDoUpdate(true);
  };

  const handlePickAIdIssueDate = (e: Date) => {
    setInputs((prevState) => {
      const newState = { ...prevState };

      if (prevState.expirationDate) {
        const diff = differenceInDays(new Date(prevState.expirationDate), new Date(e));

        if (diff <= 0) {
          newState.expirationDate = '';
        }
      }

      newState.issueDate = formatIncomingObjectDate(e);

      return newState;
    });

    setDoUpdate(true);
  };

  const handlePickAIdExpDate = (e: Date) => {
    setInputs((prevState) => ({
      ...prevState,
      expirationDate: formatIncomingObjectDate(e),
    }));

    setDoUpdate(true);
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch, setManualFieldErrors } = useAsyncFetching();

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

  const handleButtons = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'next') {
      nextPage();
    }
  };

  const today = new Date();
  const dateOperation = new Date().setFullYear(today.getFullYear() - 18);
  const pickerDisabledBefore = new Date(dateOperation);

  const inputsDataOne = [
    {
      id: 1,
      value: ssnFormat(inputs.ssn),
      name: 'ssn',
      type: 'text',
      label: 'SSN',
      width: 16.458333,
      onChange: handleChange,
    },
    {
      id: 2,
      value: inputs.dateOfBirth,
      name: 'dateOfBirth',
      type: 'DottedDate',
      label: 'Date of Birth',
      width: 16.458333,
      inputDate: true,
      dayPickerDisabledAfter: pickerDisabledBefore,
      defaultMonth: pickerDisabledBefore,
      disabled: true,
      onChange: handleChange,
      onPick: handlePickADateOfBirth,
      noDisabledBgColor: true,
    },
    {
      id: 3,
      value: inputs.idType,
      name: 'idType',
      type: 'select',
      label: 'ID Type',
      width: 12.5,
      options: idTypeData?.map((el) => {
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
  ];

  const inputsDataTwo = [
    {
      id: inputs.idType === '3' ? 4 : 0,
      value: inputs.idState,
      name: 'idState',
      type: 'select',
      label: 'ID State',
      width: 7.03125,
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
      label: 'ID Number',
      width: 16.458333,
      disabled: inputs.noId ? true : false,
      noBgColor: inputs.noId ? false : true,
      onChange: handleChange,
    },
    {
      id: 6,
      value: inputs.issueDate,
      name: 'issueDate',
      type: 'DottedDate',
      label: 'ID Issue Date',
      width: 16.458333,
      inputDate: true,
      disabled: true,
      dayPickerDisabledAfter: new Date(),
      onChange: handleChange,
      onPick: handlePickAIdIssueDate,
      noBgColor: inputs.noId ? false : true,
      disabledDayPickerBtn: inputs.noId ? true : false,
    },
    {
      id: 7,
      value: inputs.expirationDate,
      name: 'expirationDate',
      type: 'DottedDate',
      label: 'ID Expiration Date',
      width: 16.458333,
      inputDate: true,
      disabled: true,
      dayPickerDisabledbefore: addDays(new Date(inputs.issueDate), 1),
      onChange: handleChange,
      onPick: handlePickAIdExpDate,
      noBgColor: inputs.noId ? false : true,
      disabledDayPickerBtn: inputs.noId ? true : false,
    },
  ];

  const inputsDataThree = [
    {
      id: 8,
      value: inputs.cashdown,
      name: 'cashdown',
      type: 'text',
      label: 'Cash Down',
      width: 16.458333,
      onChange: handleChange,
    },
    {
      id: 9,
      value: inputs.gender,
      name: 'gender',
      type: 'select',
      label: 'Gender',
      width: 12.5,
      options: genderData?.map((el) => {
        return { value: el.id, option: el.gender };
      }),
      onChange: handleChange,
    },
    {
      id: 10,
      value: inputs.consent,
      name: '',
      type: 'checkbox',
      chekcboxText: 'Consent to Send Automated SMS',
      width: 0,
      onChange: handleChange,
    },
  ];

  const buttonData = [
    {
      id: 12,
      width: 9,
      text: 'Next',
      identity: 'next',
      backgroundColor: '#00A78B',
      textColor: '#FFF',
      disabled: !nextToAddress,
      onClick: handleButtons,
    },
  ];

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
          dateOfBirth: !inputs.dateOfBirth ? ['Required'] : [''],
          cashdown: !inputs.cashdown ? ['Required'] : [''],
          gender: !inputs.gender ? ['Required'] : [''],
        });
      } else {
        if (inputs.idType !== '3') {
          setManualFieldErrors({
            ssn: !inputs.ssn ? ['Required'] : [''],
            dateOfBirth: !inputs.dateOfBirth ? ['Required'] : [''],
            cashdown: !inputs.cashdown ? ['Required'] : [''],
            gender: !inputs.gender ? ['Required'] : [''],
            expirationDate: !inputs.expirationDate ? ['Required'] : [''],
            idNumber: !inputs.idNumber ? ['Required'] : [''],
            issueDate: !inputs.issueDate ? ['Required'] : [''],
            idType: !inputs.idType ? ['Required'] : [''],
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
          });
        }
      }

      handleAvailableNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  return (
    <ModalContent
      overflowVisible
      loading={loading}
      minHeight={60.5}
      decisionMessage={warningMssg}
      onDecision={handleDecision}
    >
      <BorderedContent overflowVisible>
        <ButtonContainer marginTop={0} gap={1.302083} alignContentEnd>
          {inputsDataOne.map((el, index) =>
            el.name === 'ssn' ? (
              <SsnInput
                key={`~~111${el.id * index + 75}kkk$${el.id}`}
                onChange={handleClientSocialSecurity}
                disabled={loadingFetch}
                isLoading={loadingFetch}
                value={el.value}
              />
            ) : (
              <Input
                key={`~~111${el.id * index + 75}kkk$${el.id}`}
                label={el.label}
                name={el.name}
                type={el.type}
                width={el.width}
                value={el.value}
                inputDate={el.inputDate}
                options={el.options}
                onChange={el.onChange}
                disabled={el.disabled || loadingFetch}
                isLoading={loadingFetch}
                noDisabledBgColor={el.noDisabledBgColor}
                onDayPickerClick={el.onPick}
                dayPickerDisabledAfter={el.dayPickerDisabledAfter}
                defaultMonth={el.defaultMonth}
                chekcboxText={el.chekcboxText}
                customCheckbox
                fieldErrors={fieldErrors}
                fieldErrorTop={9}
              />
            ),
          )}
        </ButtonContainer>
        <ButtonContainer marginTop={2.314814} gap={1.302083}>
          {inputsDataTwo.map(
            (el, index) =>
              el.id !== 0 && (
                <Input
                  key={`~~223${el.id * index + 75}dsf$${el.id}`}
                  label={el.label}
                  name={el.name}
                  type={el.type}
                  width={el.width}
                  value={el.value}
                  inputDate={el.inputDate}
                  options={el.options}
                  onChange={el.onChange}
                  disabled={el.disabled || loadingFetch}
                  isLoading={loadingFetch}
                  noDisabledBgColor={el.noBgColor}
                  disabledDayPickerBtn={el.disabledDayPickerBtn}
                  dayPickerDisabledAfter={el.dayPickerDisabledAfter}
                  dayPickerDisabledbefore={el.dayPickerDisabledbefore}
                  onDayPickerClick={el.onPick}
                  fieldErrors={fieldErrors}
                  fieldErrorTop={9}
                />
              ),
          )}
        </ButtonContainer>
      </BorderedContent>
      <BorderedContent marginTop={5} overflowVisible>
        <ButtonContainer marginTop={0} gap={1.302083} alignContentEnd>
          {inputsDataThree.map((el, index) => (
            <Input
              key={`~~223${el.id + 78}dsf$${el.id}${index}`}
              label={el.label}
              name={el.name}
              type={el.type}
              width={el.width}
              value={el.name === 'cashdown' ? numberFilter(el.value, 1) : el.value}
              options={el.options}
              chekcboxText={el.chekcboxText}
              customCheckbox
              disabled={loadingFetch}
              isLoading={loadingFetch}
              onChange={el.onChange}
              fieldErrors={fieldErrors}
              fieldErrorTop={9}
            />
          ))}
        </ButtonContainer>
      </BorderedContent>
      <ButtonContainer widthFull marginTop={6} justify="right" gap={1}>
        {buttonData.map((el, index) => (
          <Button
            key={`~~223${el.id + 80}dsf$${el.id}${index}`}
            width={el.width}
            backgroundColor={el.backgroundColor}
            identity={el.identity}
            onClick={el.onClick}
            buttonText={el.text}
            textColor={el.textColor}
            disabled={el.disabled || loadingFetch}
          />
        ))}
      </ButtonContainer>
    </ModalContent>
  );
}
