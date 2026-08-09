import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { adminDashboardStore, messagesStore, singleCLientDataStore } from '@/store/adminDashboard';
import { leadsStore } from '@/store/leads';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function Note() {
  const { data: session } = useSession();

  const userId = session?.user.id;

  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const setCheatCount = leadsStore((state) => state.setCheatCountForFetch);
  const cheatCount = leadsStore((state) => state.cheatCountForFetch);

  const { sellersData } = adminDashboardStore();
  const { getSellers, getReminderTime } = adminDashboardStore();

  const { setMessages } = messagesStore();

  useEffect(() => {
    getSellers();
    getReminderTime();
  }, [getSellers, getReminderTime]);

  // useEffect(() => {
  //   if (singleCLientData && singleCLientData.seller?.id) {
  //     const salesRepData = sellersData?.find((seller) => seller.id === singleCLientData.seller?.id);
  //     const salesRepName = `${salesRepData?.name || ''} ${salesRepData?.last_name || ''}`;

  //     setInputs({
  //       // followUpDate: '',
  //       // followUpDateTime: '',
  //       // assignedTo: singleCLientData.seller.id.toString(),
  //       // assignedToName: salesRepName,
  //       reminderTime: '2',
  //       note: '',
  //     });
  //   }
  // }, [singleCLientData, sellersData]);

  // ----- local states -----

  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState<{
    // followUpDate: string;
    // followUpDateTime: string;
    // assignedTo: string;
    // assignedToName: string;
    // reminderTime: string;
    note: string;
  }>({
    // followUpDate: '',
    // followUpDateTime: '',
    // assignedTo: '',
    // assignedToName: '',
    // reminderTime: '2',
    note: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{
    // followUpDate: [string];
    // followUpDateTime: [string];
    // assignedTo: [string];
    // reminderTime: [string];
    note: [string];
  }>({
    // followUpDate: [''],
    // followUpDateTime: [''],
    // assignedTo: [''],
    // reminderTime: [''],
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

  // const handleDateClick = (e: Date) => {
  //   setInputs((prevState) => ({
  //     ...prevState,
  //     followUpDate: formatIncomingObjectDate(e),
  //     followUpDateTime: '',
  //   }));
  // };

  // const handleTimeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const { value } = e.currentTarget;

  //   setInputs((prevState) => ({
  //     ...prevState,
  //     followUpDate: prevState.followUpDate
  //       ? `${prevState.followUpDate.split(',')[0]}, ${value}`
  //       : prevState.followUpDate,
  //     followUpDateTime: value,
  //   }));
  // };

  const clearInputs = () => {
    if (singleCLientData && singleCLientData.seller?.id) {
      const salesRepData = sellersData?.find((seller) => seller.id === singleCLientData.seller?.id);
      const salesRepName = `${salesRepData?.name || ''} ${salesRepData?.last_name || ''}`;

      setInputs({
        // followUpDate: '',
        // followUpDateTime: '',
        // assignedTo: singleCLientData.seller.id.toString(),
        // assignedToName: salesRepName,
        // reminderTime: '2',
        note: '',
      });
    } else {
      setInputs({
        // followUpDate: '',
        // followUpDateTime: '',
        // assignedTo: '',
        // assignedToName: '',
        // reminderTime: '2',
        note: '',
      });
    }
  };

  const clearFieldErrors = () => {
    setFieldErrors({
      // followUpDate: [''],
      // followUpDateTime: [''],
      // assignedTo: [''],
      // reminderTime: [''],
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

        formData.append('todayDate', new Date().toISOString());

        if (userId) formData.append('userId', userId.toString());

        const res = await fetch(`/api/adminDashboard/lead/note/${singleCLientData?.id}`, {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();

        if (json.successMessage) {
          setMessages(undefined, json.successMessage);
          if (singleCLientData?.id) await getSingleClientData(singleCLientData.id.toString());
          clearInputs();
          clearFieldErrors();

          setCheatCount(cheatCount + 1);
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
