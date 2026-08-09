import { adminDashboardStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Input } from '&/inputs/Input';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { Button } from '&/buttons/Button';
import { ConfirmNotification } from '@/app/ui/notifications/Notification';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { leadCardStore } from '@/store/leadCard';
import { dateToUTCfromInputDateString } from '@/app/libs/dateTimeZone';
import { leadsStore } from '@/store/leads';
import { MultiOptionsSelect } from '&/miscellaneous/multiOptionsSelect/MultiOptionsSelect';

export function SpokeProspect() {
  const session = useSession();

  const creator = session.data?.user.id;

  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const { users, reminderTime } = adminDashboardStore();
  const { getUsers, getReminderTime } = adminDashboardStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { callIdToAddNote } = leadCardStore();

  const setCheatCount = leadsStore((state) => state.setCheatCountForFetch);
  const cheatCount = leadsStore((state) => state.cheatCountForFetch);

  const getPromiseData = useCallback(() => {
    return [getUsers(), getReminderTime()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  useEffect(() => {
    if (singleCLientData && singleCLientData.id) {
      setInputs({
        followUpDate: '',
        followUpDateTime: '',
        assignedTo: singleCLientData.seller?.id ? [singleCLientData.seller.id.toString()] : [],
        reminderTime: '2',
        incoming: '',
        outcoming: '',
        note: '',
      });
    }
  }, [singleCLientData]);

  const [notiMssg, setNotiMssg] = useState('');

  const [inputs, setInputs] = useState<{
    followUpDate: string;
    followUpDateTime: string;
    assignedTo: string[];
    reminderTime: string;
    incoming: string;
    outcoming: string;
    note: string;
  }>({
    followUpDate: '',
    followUpDateTime: '',
    assignedTo: [],
    reminderTime: '2',
    incoming: '',
    outcoming: '',
    note: '',
  });

  const handleAssignUser = (val: string[]) => {
    setInputs((prevState) => ({
      ...prevState,
      assignedTo: val,
    }));
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'save') {
      const message = inputs.followUpDate
        ? 'You want to create this task?'
        : callIdToAddNote
          ? 'You want to save this note?'
          : 'You want to register this call?';

      setNotiMssg(message);
    }
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleSave = async () => {
    const formData = new FormData();

    const requireInputs = [
      // 'followUpDate',
      'followUpDateTime',
      'assignedTo',
      'reminderTime',
      'incoming',
      'outcoming',
      'note',
    ];

    for (const [name, value] of Object.entries(inputs)) {
      if (requireInputs.includes(name)) {
        if (typeof value === 'string') {
          formData.append(name, value);
        } else {
          formData.append(name, JSON.stringify(value));
        }
      }
    }

    if (inputs.followUpDate) {
      formData.set('followUpDate', dateToUTCfromInputDateString(inputs.followUpDate));
    }

    formData.append('todaysDate', new Date().toISOString());

    if (creator) formData.append('createdBy', creator.toString());

    if (callIdToAddNote) formData.append('callIdToAddNote', callIdToAddNote.toString());

    const apiUrl = `/api/adminDashboard/lead/spokeProspect/${singleCLientData?.id}`;

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'POST',
      options: {
        async onSuccess() {
          setInputs({
            followUpDate: '',
            followUpDateTime: '',
            assignedTo: singleCLientData?.seller?.id ? [singleCLientData.seller.id.toString()] : [],
            reminderTime: '2',
            incoming: '',
            outcoming: '',
            note: '',
          });

          setCheatCount(cheatCount + 1);

          if (singleCLientData) await getSingleClientData(singleCLientData.id.toString());
        },
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;

    const checkboxInputs = ['incoming', 'outcoming'];

    if (e.currentTarget instanceof HTMLInputElement && checkboxInputs.includes(name)) {
      const { checked } = e.currentTarget;

      setInputs((prevState) => {
        const newState = { ...prevState };

        if ((name as keyof typeof inputs) === 'incoming') {
          newState.incoming = checked ? '1' : '';
          newState.outcoming = '';
        }

        if ((name as keyof typeof inputs) === 'outcoming') {
          newState.outcoming = checked ? '1' : '';
          newState.incoming = '';
        }

        return newState;
      });

      return;
    }

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
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

  const inputData = [
    {
      id: 1,
      label: 'Reminder Time',
      name: 'reminderTime',
      value: inputs.reminderTime,
      type: 'select',
      options: reminderTime?.map((el) => {
        return { value: el.id, option: el.time };
      }),
      width: 15,
      onChange: handleChange,
    },
    {
      id: 2,
      label: 'Inbound',
      name: 'incoming',
      value: inputs.incoming,
      type: 'checkbox',
      width: 0,
      chekcboxText: 'Inbound',
      fieldErrorWidthMaxContent: true,
      onChange: handleChange,
    },
    {
      id: 3,
      label: 'Outbound',
      name: 'outcoming',
      value: inputs.outcoming,
      type: 'checkbox',
      width: 0,
      chekcboxText: 'Outbound',
      fieldErrorWidthMaxContent: true,
      onChange: handleChange,
    },
  ];

  const onDecision = async (decision: boolean) => {
    if (decision) {
      await handleSave();

      setNotiMssg('');
    } else {
      setNotiMssg('');
    }
  };

  return (
    <BorderedContent positionRelative loading={loading || loadingFetch} overflowVisible>
      <ConfirmNotification notiMessage={notiMssg} onDecision={onDecision} loading={loadingFetch} />
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
          dontCloseDatePickerAfterPick
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
      <ContentRow cols={3} gap={0} marginTop={3.148148} widthFull justifyContent="space-between">
        {inputData.map((el, index) => (
          <Input
            key={`${el.id * 61.3}---spoketoprospect-${index}`}
            label={el.label}
            name={el.name}
            type={el.type}
            value={el.value}
            width={el.width}
            options={el.options}
            chekcboxText={el.chekcboxText}
            fieldErrorWidthMaxContent={el.fieldErrorWidthMaxContent}
            onChange={el.onChange}
            customCheckbox
            fieldErrors={fieldErrors}
          />
        ))}
      </ContentRow>
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
      <ButtonContainer marginTop={5.740741} widthFull justify="right">
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
