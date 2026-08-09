import { adminDashboardStore, messagesStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useSocketStore } from '@/store/socketIo';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { Input } from '&/inputs/Input';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import UserAssignmentSelect from '@/app/ui/select/UserAssignmentSelector/UserAssignmentSelector';
import { User } from '@/app/libs/definitions';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { Button } from '&/buttons/Button';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { dateToUTCfromInputDateString } from '@/app/libs/dateTimeZone';
import { leadsStore } from '@/store/leads';

export function AppointmentSchedule() {
  const session = useSession();

  const creator = session.data?.user.id;
  const creatorName = `${session.data?.user.name || ''} ${session.data?.user.last_name || ''}`;

  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const setCheatCount = leadsStore((state) => state.setCheatCountForFetch);
  const cheatCount = leadsStore((state) => state.cheatCountForFetch);

  const { users, reminderTime } = adminDashboardStore();
  const { getUsers, getClients, getReminderTime } = adminDashboardStore();

  const { setMessages } = messagesStore();

  const { formatIncomingObjectDate, addTwoHours } = inputTypeDateFormatStore();

  useEffect(() => {
    getUsers();
    getClients();
    getReminderTime();
  }, [getUsers, getClients, getReminderTime]);

  useEffect(() => {
    if (singleCLientData && singleCLientData.id) {
      setInputs({
        customer: `${singleCLientData.first_name} ${singleCLientData.last_name}`,
        createdBy: creator?.toString() || '',
        createdByName: creatorName,
        assignedTo: singleCLientData.seller?.id.toString() || '',
        assignedToName: `${singleCLientData.seller?.name || ''} ${
          singleCLientData.seller?.last_name || ''
        }`,
        reminderTime: '2',
        startDate: '',
        startDateTime: '',
        endDate: '',
        endDateTime: '',
        note: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleCLientData]);

  // ----- local states -----

  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState<{
    customer: string;
    createdBy: string;
    createdByName: string;
    assignedTo: string;
    assignedToName: string;
    reminderTime: string;
    startDate: string;
    startDateTime: string;
    endDate: string;
    endDateTime: string;
    note: string;
  }>({
    customer: '',
    createdBy: '',
    createdByName: '',
    assignedTo: '',
    assignedToName: '',
    reminderTime: '2',
    startDate: '',
    startDateTime: '',
    endDate: '',
    endDateTime: '',
    note: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{
    assignedTo: [string];
    reminderTime: [string];
    startDate: [string];
    endDate: [string];
    note: [string];
  }>({
    assignedTo: [''],
    reminderTime: [''],
    startDate: [''],
    endDate: [''],
    note: [''],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { value, name } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'save') {
      setLoading(true);

      try {
        const formData = new FormData();

        const requireInputs = [
          'assignedTo',
          'reminderTime',
          'startDate',
          'startDateTime',
          'endDate',
          'endDateTime',
          'note',
          'createdBy',
        ];

        for (const [name, value] of Object.entries(inputs)) {
          if (requireInputs.includes(name)) {
            formData.append(name, value);
          }
        }

        if (inputs.startDate && inputs.endDate) {
          formData.set('startDate', dateToUTCfromInputDateString(inputs.startDate));
          formData.set('endDate', dateToUTCfromInputDateString(inputs.endDate));
          formData.set('startDateInZone', inputs.startDate);
          formData.set('endDateInZone', inputs.endDate);
        }

        formData.append('todaysDate', new Date().toISOString());

        const res = await fetch(`/api/adminDashboard/lead/schedule/${singleCLientData?.id}`, {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();

        if (json.successMessage) {
          setMessages(undefined, json.successMessage);

          setCheatCount(cheatCount + 1);

          setInputs((prevState) => ({
            ...prevState,
            reminderTime: '2',
            startDate: '',
            startDateTime: '',
            endDate: '',
            endDateTime: '',
            note: '',
          }));

          setFieldErrors({
            assignedTo: [''],
            reminderTime: [''],
            startDate: [''],
            endDate: [''],
            note: [''],
          });

          if (singleCLientData?.id) await getSingleClientData(singleCLientData.id.toString());

          updateDataWithSocket('dailyAppointmentsList');
        }

        if (json.serverError) {
          setMessages(json.serverError);
        }

        if (json.fieldErrors) {
          const responsedFieldErrors = json.fieldErrors as typeof fieldErrors;

          setFieldErrors((prevState) => {
            const newState = { ...prevState };

            for (const [key, error] of Object.entries(responsedFieldErrors)) {
              const fieldErrorKey = key as keyof typeof fieldErrors;

              newState[fieldErrorKey] = error;

              if (key === 'startDateTime' && !responsedFieldErrors.startDate) {
                newState.startDate = error;
              }

              if (key === 'endDateTime' && !responsedFieldErrors.endDate) {
                newState.endDate = error;
              }
            }

            return newState;
          });
        }
      } catch (error) {
        setMessages('An error occurred');
      }

      setLoading(false);
    }
  };

  const handleStartDateClick = (e: Date) => {
    setInputs((prevState) => ({
      ...prevState,
      startDate: formatIncomingObjectDate(e),
      startDateTime: '',
      endDate: formatIncomingObjectDate(e),
    }));
  };

  const handleEndDateClick = (e: Date) => {
    setInputs((prevState) => ({
      ...prevState,
      endDate: formatIncomingObjectDate(e),
      endDateTime: '',
    }));
  };

  const handleTimeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'startDateTime') {
      setInputs((prevState) => ({
        ...prevState,
        startDate: prevState.startDate
          ? `${prevState.startDate.split(',')[0]}, ${value}`
          : prevState.startDate,
        startDateTime: value,
        endDate: prevState.endDate
          ? `${prevState.endDate.split(',')[0]}, ${addTwoHours(value)}`
          : prevState.endDate,
        endDateTime: addTwoHours(value),
      }));
    }

    if (identity === 'endDateTime') {
      setInputs((prevState) => ({
        ...prevState,
        endDate: prevState.endDate
          ? `${prevState.endDate.split(',')[0]}, ${value}`
          : prevState.endDate,
        endDateTime: value,
      }));
    }
  };

  const inputData = [
    {
      id: 1,
      label: 'Reminder Time',
      name: 'reminderTime',
      type: 'select',
      value: inputs.reminderTime,
      width: 0,
      options: reminderTime?.map((el) => {
        return { value: el.id, option: el.time };
      }),
      onChange: handleChange,
    },
    {
      id: 2,
      label: 'Start (CDT)',
      name: 'startDate',
      type: 'DottedDate',
      value: inputs.startDate,
      timeDataValue: inputs.startDateTime,
      width: 0,
      identity: 'startDateTime',
      dayPickerDisabledbefore: new Date(),
      inputDate: true,
      fetchTimeData: true,
      onChange: handleChange,
      onDateClick: handleStartDateClick,
      onTimeSelected: handleTimeSelected,
    },
    {
      id: 3,
      label: 'End (CDT)',
      name: 'endDate',
      type: 'DottedDate',
      value: inputs.endDate,
      timeDataValue: inputs.endDateTime,
      width: 0,
      identity: 'endDateTime',
      dayPickerDisabledbefore: new Date(),
      inputDate: true,
      fetchTimeData: false,
      onChange: handleChange,
      onDateClick: handleEndDateClick,
      onTimeSelected: handleTimeSelected,
    },
  ];

  return (
    <BorderedContent overflowVisible positionRelative loading={loading}>
      <Input
        label="Customer"
        name="customer"
        type="text"
        value={inputs.customer}
        width={0}
        disabled
        noDisabledBgColor
        onChange={handleChange}
      />
      <div className="w-full flex gap-3 mt-[2.1vh] items-start">
        <Input
          label="Created By"
          name="createdByName"
          type="text"
          value={inputs.createdByName}
          width={0}
          disabled
          noDisabledBgColor
          onChange={handleChange}
          widthFull
        />
        <UserAssignmentSelect
          label="Assigned To"
          users={(users as unknown as User[]) || []}
          defaultValue={inputs.assignedTo ? [inputs.assignedTo] : []}
          onChange={(ids) => {
            const val = ids[0] || '';
            const selectedSeller = users?.find((el) => el.id.toString() === val);
            const assignedToName = selectedSeller
              ? `${selectedSeller.name || ''} ${selectedSeller.last_name || ''}`
              : '';
            setInputs((prev) => ({
              ...prev,
              assignedTo: val,
              assignedToName: assignedToName,
            }));
          }}
          isMultiSelect={false}
          // bgColor="#FFF"
          enableFloating
          width="w-full"
        />
      </div>
      <ContentRow cols={3} gap={3} widthFull marginTop={2.1296296}>
        {inputData.map((el, index) => (
          <Input
            key={`${el.id * 61}appointments--${index - 13}ss`}
            label={el.label}
            name={el.name}
            type={el.type}
            value={el.value}
            width={el.width}
            timeDataValue={el.timeDataValue}
            identity={el.identity}
            dayPickerDisabledbefore={el.dayPickerDisabledbefore}
            inputDate={el.inputDate}
            fetchTimeData={el.fetchTimeData}
            options={el.options}
            onChange={el.onChange}
            onDayPickerClick={el.onDateClick}
            onTimeChanged={el.onTimeSelected}
            fieldErrors={fieldErrors}
            dontCloseDatePickerAfterPick
            enableFloating
          />
        ))}
      </ContentRow>
      <ButtonContainer marginTop={2.1296296} widthFull>
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
      </ButtonContainer>
      <ButtonContainer widthFull marginTop={3} justify="right">
        <Button
          backgroundColor="#00A78B"
          identity="save"
          textColor="#FFF"
          buttonText="Save"
          width={11.875}
          onClick={handleButton}
        />
      </ButtonContainer>
    </BorderedContent>
  );
}
