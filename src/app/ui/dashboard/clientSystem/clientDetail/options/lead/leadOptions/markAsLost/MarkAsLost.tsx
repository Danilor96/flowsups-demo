import { adminDashboardStore, messagesStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { Input } from '&/inputs/Input';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { GenericSelector } from '@/app/ui/select/GenericSelector/GenericSelector';

export function MarkAsLost() {
  const session = useSession();

  const creator = session.data?.user.id;

  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const lostReasons = adminDashboardStore((state) => state.lostReasons);

  const { setMessages } = messagesStore();

  // ----- local states -----

  const [inputs, setInputs] = useState<{
    lostReason: string;
    note: string;
  }>({
    lostReason: '',
    note: '',
  });

  const [lostReasonDescription, setLostReasonDescription] = useState('');

  const [fieldErrors, setFieldErrors] = useState<{
    lostReason: [string];
    note: [string];
  }>({
    lostReason: [''],
    note: [''],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('lostReason', inputs.lostReason);
      formData.append('lostReasonDescription', lostReasonDescription);
      formData.append('note', inputs.note);
      formData.append('todaysDate', new Date().toISOString());
      if (creator) formData.append('createdBy', creator.toString());

      const res = await fetch(`/api/adminDashboard/lead/markAsLost/${singleCLientData?.id}`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (json.successMessage) {
        setMessages(undefined, json.successMessage);

        if (singleCLientData?.id) getSingleClientData(singleCLientData.id.toString());

        setInputs({
          lostReason: '',
          note: '',
        });

        setFieldErrors({
          lostReason: [''],
          note: [''],
        });
      }

      if (json.serverError) {
        setMessages(json.serverError);
      }

      if (json.fieldErrors) {
        setFieldErrors(json.fieldErrors);
      }
    } catch (error) {
      setMessages('An error occurred');
    }

    setLoading(false);
  };

  return (
    <BorderedContent overflowVisible positionRelative loading={loading}>
      <ContentRow cols={1} widthFull gap={3.148148}>
        <GenericSelector
          label="Lost Reason"
          options={lostReasons || []}
          selectedIds={inputs.lostReason ? [inputs.lostReason] : []}
          onChange={(ids) => {
            const id = ids[0] || '';
            const selectedReason = lostReasons?.find((r) => r.id.toString() === id);
            setInputs((prevState) => ({
              ...prevState,
              lostReason: id,
            }));
            setLostReasonDescription(selectedReason?.reason || '');
          }}
          getOptionId={(reason) => reason.id.toString()}
          getOptionLabel={(reason) => reason.reason}
          isMultiSelect={false}
          width="w-full"
          enableFloating={true}
          optionsWidth="w-[60rem]"
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
