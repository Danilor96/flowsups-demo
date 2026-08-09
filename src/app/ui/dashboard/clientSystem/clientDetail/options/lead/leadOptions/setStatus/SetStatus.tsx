import { adminDashboardStore, messagesStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Input } from '&/inputs/Input';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { Button } from '&/buttons/Button';
import { GenericSelector } from '@/app/ui/select/GenericSelector/GenericSelector';

export function SetStatus() {
  const session = useSession();

  const creator = session.data?.user.id;

  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const { sellersData, reminderTime, clientStatusesData, lostReasons } = adminDashboardStore();
  const { getSellers, getReminderTime } = adminDashboardStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { setMessages } = messagesStore();

  useEffect(() => {
    getSellers();
    getReminderTime();
  }, [getSellers, getReminderTime]);

  useEffect(() => {
    if (singleCLientData && singleCLientData.seller?.id) {
      const salesRepData = sellersData?.find((seller) => seller.id === singleCLientData.seller?.id);
      const salesRepName = `${salesRepData?.name || ''} ${salesRepData?.last_name || ''}`;

      setInputs({
        status: '1',
        followUpDate: '',
        followUpDateTime: '',
        assignedTo: singleCLientData.seller.id.toString(),
        assignedToName: salesRepName,
        reminderTime: '2',
        note: '',
      });
    }
  }, [singleCLientData, sellersData]);

  // ----- local states -----

  const [loading, setLoading] = useState(false);

  const [lostReasonDescription, setLostReasonDescription] = useState('');
  const [lostReason, setLostReason] = useState('');

  const [inputs, setInputs] = useState<{
    status: string;
    followUpDate: string;
    followUpDateTime: string;
    assignedTo: string;
    assignedToName: string;
    reminderTime: string;
    note: string;
  }>({
    status: '1',
    followUpDate: '',
    followUpDateTime: '',
    assignedTo: '',
    assignedToName: '',
    reminderTime: '2',
    note: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{
    status: [string];
    followUpDate: [string];
    followUpDateTime: [string];
    assignedTo: [string];
    reminderTime: [string];
    note: [string];
  }>({
    status: [''],
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
      const salesRepData = sellersData?.find((seller) => seller.id === singleCLientData.seller?.id);
      const salesRepName = `${salesRepData?.name || ''} ${salesRepData?.last_name || ''}`;

      setInputs({
        status: '1',
        followUpDate: '',
        followUpDateTime: '',
        assignedTo: singleCLientData.seller.id.toString(),
        assignedToName: salesRepName,
        reminderTime: '2',
        note: '',
      });
    } else {
      setInputs({
        status: '1',
        followUpDate: '',
        followUpDateTime: '',
        assignedTo: '',
        assignedToName: '',
        reminderTime: '2',
        note: '',
      });
    }
  };

  const clearFieldErrors = () => {
    setFieldErrors({
      status: [''],
      followUpDate: [''],
      followUpDateTime: [''],
      assignedTo: [''],
      reminderTime: [''],
      note: [''],
    });
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value, name } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'assignedTo') {
      setInputs((prevState) => ({
        ...prevState,
        assignedToName: name,
        assignedTo: value,
      }));
    }

    if (identity === 'save') {
      try {
        setLoading(true);

        const formData = new FormData();

        const ignore = ['assignedToName', 'followUpDateTime'];

        for (const [name, value] of Object.entries(inputs)) {
          if (!ignore.includes(name as keyof typeof inputs)) {
            formData.append(name, value);
          }
        }

        formData.append('todaysDate', new Date().toISOString());
        formData.append('lostReasonDescription', lostReasonDescription);
        formData.append('lostReason', lostReason);

        if (creator) formData.append('createdBy', creator.toString());

        const res = await fetch(`/api/adminDashboard/lead/setStatus/${singleCLientData?.id}`, {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();

        if (json.successMessage) {
          setMessages(undefined, json.successMessage);

          if (singleCLientData?.id) await getSingleClientData(singleCLientData.id.toString());

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
          label="Set Status To"
          name="status"
          value={inputs.status}
          type="select"
          width={15}
          options={clientStatusesData?.map((el) => {
            return { value: el.id, option: el.status };
          })}
          onChange={handleChange}
        />
        <AdderSelect
          iconTextGap={0}
          label="Assigned To"
          name="assignedToName"
          value={inputs.assignedToName}
          onChange={handleChange}
          onClick={handleButton}
          optionsBackgroundColor="#FFF"
          optionsHeight={5}
          optionsNameColor="#00A78B"
          optionsRadius={0.3}
          optionsWidth={15}
          width={15}
          selectThreeDottedIcon
          selectBtnCursorPointer
          selectBtnBackgroundColor="#C9EBE6"
          options={sellersData?.map((el) => {
            return {
              name: `${el.name || ''} ${el.last_name || ''}`,
              value: el.id.toString(),
              identity: 'assignedTo',
            };
          })}
          selectBtnWidth={10}
          inputWidth={90}
          fieldErrors={fieldErrors}
        />
      </ContentRow>
      <ContentRow cols={2} gap={0} widthFull justifyContent="space-between" marginTop={3.148148}>
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
      </ContentRow>
      {inputs.status === '12' && (
        <aside className="mt-[1.5vh]">
          <GenericSelector
            label="Lost Reason"
            options={lostReasons || []}
            selectedIds={lostReason ? [lostReason] : []}
            onChange={(ids) => {
              const id = ids[0] || '';
              const selectedReason = lostReasons?.find((r) => r.id.toString() === id);
              setLostReason(id);
              setLostReasonDescription(selectedReason?.reason || '');
            }}
            getOptionId={(reason) => reason.id.toString()}
            getOptionLabel={(reason) => reason.reason}
            isMultiSelect={false}
            width="w-full"
            enableFloating={true}
          />
        </aside>
      )}
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
