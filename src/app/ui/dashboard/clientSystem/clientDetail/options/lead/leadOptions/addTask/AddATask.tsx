import { adminDashboardStore, messagesStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useSocketStore } from '@/store/socketIo';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Input } from '&/inputs/Input';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { taskSettingsLimitsStore } from '@/store/dateFormats';
import { MultiOptionsSelect } from '&/miscellaneous/multiOptionsSelect/MultiOptionsSelect';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { dateToUTCfromInputDateString } from '@/app/libs/dateTimeZone';
import { leadsStore } from '@/store/leads';

export function AddATask() {
  const { data: session } = useSession();

  const userId = session?.user.id;
  const userRoleId = session?.user.user_has[0].role_id;

  // ---------- global state -----------
  const { updateDataWithSocket } = useSocketStore();

  const { singleCLientData } = singleCLientDataStore();

  const { reminderTime, taskSettings, users } = adminDashboardStore();
  const { getUsers, getReminderTime, getTaskSettings } = adminDashboardStore();

  const setCheatCount = leadsStore((state) => state.setCheatCountForFetch);
  const cheatCount = leadsStore((state) => state.cheatCountForFetch);

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { setLimit } = taskSettingsLimitsStore();

  const getPromiseData = useCallback(() => {
    return [getUsers(), getReminderTime(), getTaskSettings()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData);

  useEffect(() => {
    if (singleCLientData && singleCLientData.seller?.id) {
      setInputs({
        dueDate: '',
        dueDateTime: '',
        assignedTo: [singleCLientData.seller.id.toString()],
        reminderTime: '2',
        subject: '',
        note: '',
      });
    }
  }, [singleCLientData, users]);

  // ---------- local state -----------
  const [inputs, setInputs] = useState<{
    dueDate: string;
    dueDateTime: string;
    reminderTime: string;
    assignedTo: string[];
    subject: string;
    note: string;
  }>({
    dueDate: '',
    dueDateTime: '',
    reminderTime: '2',
    assignedTo: [],
    subject: '',
    note: '',
  });

  const clearInputs = () => {
    if (singleCLientData && singleCLientData.seller?.id) {
      setInputs({
        dueDate: '',
        dueDateTime: '',
        assignedTo: [singleCLientData.seller.id.toString()],
        reminderTime: '2',
        subject: '',
        note: '',
      });
    } else {
      setInputs({
        dueDate: '',
        dueDateTime: '',
        assignedTo: [],
        reminderTime: '2',
        subject: '',
        note: '',
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAssignUser = (val: string[]) => {
    setInputs((prevState) => ({
      ...prevState,
      assignedTo: val,
    }));
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch, setManualFieldErrors } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'save') {
      if (inputs.dueDate && !inputs.dueDateTime) {
        setManualFieldErrors({ dueDate: ['Please enter a time'] });

        return;
      }

      const formData = new FormData();

      const ignoreInput = ['dueDateTime'];

      for (const [name, value] of Object.entries(inputs)) {
        if (!ignoreInput.includes(name)) {
          if (typeof value === 'string') {
            formData.append(name, value);
          } else {
            formData.append(name, JSON.stringify(value));
          }
        }
      }

      formData.append('todayDate', new Date().toISOString());

      if (userId) formData.append('userId', userId.toString());
      if (inputs.dueDate) formData.set('dueDate', dateToUTCfromInputDateString(inputs.dueDate));

      const apiUrl = `/api/adminDashboard/lead/addTask/${singleCLientData?.id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        options: {
          onSuccess: (data: string[]) => {
            clearInputs();

            setCheatCount(cheatCount + 1);

            updateDataWithSocket('singleClient', undefined, {
              customerId: singleCLientData?.id,
            });

            if (data && data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                const userEmail = data[i];

                updateDataWithSocket('tasks', userEmail);
              }
            }

            const majorRoles = [1, 2];

            if (userRoleId && majorRoles.includes(userRoleId)) {
              updateDataWithSocket('tasks');
            }
          },
        },
      });
    }
  };

  const handleDayPick = (e: Date) => {
    setInputs((prevState) => ({
      ...prevState,
      dueDate: formatIncomingObjectDate(e),
      dueDateTime: '',
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      dueDate: prevState.dueDate
        ? `${prevState.dueDate.split(',')[0]}, ${value}`
        : prevState.dueDate,
      dueDateTime: value,
    }));
  };

  const inputData = [
    {
      id: 1,
      name: 'dueDate',
      value: inputs.dueDate,
      label: 'Due Date',
      width: 10.5,
      type: 'DottedDate',
      timeDataValue: inputs.dueDateTime,
      identity: 'dueDateTime',
      fetchTimeData: true,
      dayPickerDisabledbefore: new Date(),
      dayPickerDisabledAfter: singleCLientData?.created_at
        ? setLimit(singleCLientData?.created_at)?.date || undefined
        : undefined,
      limitDateTime: singleCLientData?.created_at
        ? setLimit(singleCLientData?.created_at)?.span || undefined
        : undefined,
      disabled: true,
      onChange: handleChange,
      onDayPickerClick: handleDayPick,
      onTimeChanged: handleTimeChange,
    },
    {
      id: 2,
      name: 'reminderTime',
      value: inputs.reminderTime,
      label: 'Reminder Time',
      width: 10.5,
      type: 'select',
      options: reminderTime?.map((el) => {
        return { value: el.id, option: el.time };
      }),
      onChange: handleChange,
    },
  ];

  return (
    <BorderedContent overflowVisible positionRelative loading={loading || loadingFetch}>
      <ContentRow cols={3} gap={1} widthFull justifyContent="space-between">
        {inputData.map((el, index) => (
          <Input
            key={`${index * el.id}addtask${index - 3}aaa`}
            label={el.label}
            name={el.name}
            type={el.type}
            value={el.value}
            width={el.width}
            options={el.options}
            timeDataValue={el.timeDataValue}
            identity={el.identity}
            disabled={el.disabled}
            noDisabledBgColor
            dontCloseDatePickerAfterPick
            showTimeAdvise
            noDatePickerYearSelect
            limitDateTime={el.limitDateTime}
            fetchTimeData={el.fetchTimeData}
            dayPickerDisabledbefore={el.dayPickerDisabledbefore}
            dayPickerDisabledAfter={el.dayPickerDisabledAfter}
            fieldErrors={fieldErrors}
            onChange={el.onChange}
            onDayPickerClick={el.onDayPickerClick}
            onTimeChanged={el.onTimeChanged}
          />
        ))}
        <MultiOptionsSelect
          label="Assigned To"
          optionsSelected={inputs.assignedTo}
          options={users?.map((el) => ({
            value: el.id,
            option: `${el.name || ''} ${el.last_name || ''}${
              el.username ? ` - ${el.username}` : ''
            }`,
          }))}
          width={10.5}
          fieldErrors={fieldErrors}
          name="assignedTo"
          onClick={handleAssignUser}
        />
      </ContentRow>
      <ContentRow cols={1} gap={3} widthFull marginTop={3}>
        <Input
          label="Subject"
          name="subject"
          value={inputs.subject}
          type="text"
          width={0}
          fieldErrors={fieldErrors}
          onChange={handleChange}
        />
        <TextAreaInput
          label=""
          name="note"
          value={inputs.note}
          width={0}
          height={13.425926}
          onChange={handleChange}
          widthFull
          fieldErrors={fieldErrors}
          placeholder="Type note here"
        />
      </ContentRow>
      <ButtonContainer marginTop={4} widthFull justify="right">
        <Button
          backgroundColor="#00A78B"
          identity="save"
          textColor="#FFF"
          buttonText="Save"
          width={11.875}
          height={5.462963}
          onClick={handleButton}
        />
      </ButtonContainer>
    </BorderedContent>
  );
}
