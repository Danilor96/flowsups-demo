import { adminDashboardStore, messagesStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Input } from '&/inputs/Input';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { Button } from '&/buttons/Button';
import { leadsStore } from '@/store/leads';
import { MultiOptionsSelect } from '&/miscellaneous/multiOptionsSelect/MultiOptionsSelect';

export function ProspectTest() {
  const session = useSession();

  const creator = session.data?.user.id;

  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const { users, reminderTime } = adminDashboardStore();
  const { getUsers, getReminderTime } = adminDashboardStore();

  const setCheatCount = leadsStore((state) => state.setCheatCountForFetch);
  const cheatCount = leadsStore((state) => state.cheatCountForFetch);

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { setMessages } = messagesStore();

  useEffect(() => {
    getUsers();
    getReminderTime();
  }, [getUsers, getReminderTime]);

  useEffect(() => {
    if (singleCLientData && singleCLientData.seller?.id) {
      setInputs((prev) => ({
        ...prev,
        followUpDate: '',
        followUpDateTime: '',
        assignedTo: [singleCLientData.seller!.id.toString()],
        reminderTime: '2',
        note: '',
      }));
    }
  }, [singleCLientData, users]);

  // ----- local states -----

  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState<{
    followUpDate: string;
    followUpDateTime: string;
    assignedTo: string[];
    reminderTime: string;
    note: string;
  }>({
    followUpDate: '',
    followUpDateTime: '',
    assignedTo: [],
    reminderTime: '2',
    note: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{
    followUpDate: [string];
    followUpDateTime: [string];
    assignedTo: [string];
    reminderTime: [string];
    note: [string];
  }>({
    followUpDate: [''],
    followUpDateTime: [''],
    assignedTo: [''],
    reminderTime: [''],
    note: [''],
  });

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

  const handleDateClick = (e: Date) => {
    setInputs((prevState) => ({
      ...prevState,
      followUpDate: formatIncomingObjectDate(e),
      followUpDateTime: '',
    }));
  };

  const handleTimeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      followUpDate: prevState.followUpDate
        ? `${prevState.followUpDate.split(',')[0]}, ${value}`
        : prevState.followUpDate,
      followUpDateTime: value,
    }));
  };

  const clearInputs = () => {
    if (singleCLientData && singleCLientData.seller?.id) {
      setInputs({
        followUpDate: '',
        followUpDateTime: '',
        assignedTo: [singleCLientData.seller.id.toString()],
        reminderTime: '2',
        note: '',
      });
    } else {
      setInputs({
        followUpDate: '',
        followUpDateTime: '',
        assignedTo: [],
        reminderTime: '2',
        note: '',
      });
    }
  };

  const clearFieldErrors = () => {
    setFieldErrors({
      followUpDate: [''],
      followUpDateTime: [''],
      assignedTo: [''],
      reminderTime: [''],
      note: [''],
    });
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'save') {
      try {
        setLoading(true);

        const formData = new FormData();

        const ignore = ['followUpDateTime'];

        for (const [name, value] of Object.entries(inputs)) {
          if (!ignore.includes(name as keyof typeof inputs)) {
            if (typeof value === 'string') {
              formData.append(name, value);
            } else {
              formData.append(name, JSON.stringify(value));
            }
          }
        }

        formData.append('todaysDate', new Date().toISOString());

        if (creator) formData.append('createdBy', creator.toString());

        const res = await fetch(`/api/adminDashboard/lead/prospectTest/${singleCLientData?.id}`, {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();

        if (json.successMessage) {
          setMessages(undefined, json.successMessage);

          if (singleCLientData?.id) await getSingleClientData(singleCLientData.id.toString());

          setCheatCount(cheatCount + 1);

          clearInputs();

          clearFieldErrors();
        }

        if (json.serverError) {
          setMessages(json.serverError);
        }

        if (json.fieldErrors) {
          setFieldErrors(json.fieldErrors);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);

        setMessages('An error occurred');
      }
    }
  };

  return (
    <BorderedContent overflowVisible positionRelative loading={loading}>
      <ContentRow cols={2} gap={0} widthFull justifyContent="space-between">
        <Input
          label="Follow Up Date"
          name="followUpDate"
          type="DottedDate"
          width={15}
          value={inputs.followUpDate}
          timeDataValue={inputs.followUpDateTime}
          inputDate
          onChange={handleChange}
          onDayPickerClick={handleDateClick}
          onTimeChanged={handleTimeSelected}
          identity="followUpDateTime"
          fetchTimeData
          fieldErrors={fieldErrors}
          dayPickerDisabledbefore={new Date()}
        />
        <MultiOptionsSelect
          label="Assigned To"
          optionsSelected={inputs.assignedTo}
          options={users?.map((el) => ({
            value: el.id,
            option: `${el.name || ''} ${el.last_name || ''}${
              el.username ? ` - ${el.username}` : ''
            }`,
          }))}
          width={15}
          fieldErrors={fieldErrors}
          name="assignedTo"
          onClick={handleAssignUser}
        />
      </ContentRow>
      <ButtonContainer marginTop={3.148148}>
        <Input
          label="Reminder Time"
          name="reminderTime"
          value={inputs.reminderTime}
          onChange={handleChange}
          type="select"
          width={15}
          options={reminderTime?.map((el) => {
            return { value: el.id, option: el.time };
          })}
        />
      </ButtonContainer>
      <ButtonContainer marginTop={3.148148} widthFull>
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
      <ButtonContainer widthFull marginTop={5.740741} justify="right">
        <Button
          width={11.875}
          height={5.462963}
          backgroundColor="#00A78B"
          identity="save"
          textColor="#FFF"
          buttonText="Save"
          onClick={handleButton}
        />
      </ButtonContainer>
    </BorderedContent>
  );
}
