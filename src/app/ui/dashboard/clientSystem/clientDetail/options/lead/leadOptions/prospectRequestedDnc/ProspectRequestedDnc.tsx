import { messagesStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { leadsStore } from '@/store/leads';

export function ProspectRequestedDnc() {
  const session = useSession();

  const creator = session.data?.user.id;

  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const { setMessages } = messagesStore();

  const setCheatCount = leadsStore((state) => state.setCheatCountForFetch);
  const cheatCount = leadsStore((state) => state.cheatCountForFetch);

  // ----- local states -----

  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    note: [string];
  }>({
    note: [''],
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;

    setNote(value);
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('note', note);
      formData.append('todaysDate', new Date().toISOString());
      if (creator) formData.append('createdBy', creator.toString());

      const res = await fetch(
        `/api/adminDashboard/lead/prospectRequestedDnc/${singleCLientData?.id}`,
        {
          method: 'POST',
          body: formData,
        },
      );

      const json = await res.json();

      if (json.successMessage) {
        setMessages(undefined, json.successMessage);

        if (singleCLientData?.id) getSingleClientData(singleCLientData.id.toString());

        setNote('');

        setCheatCount(cheatCount + 1);

        setFieldErrors({
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
      <TextAreaInput
        label=""
        name="note"
        value={note}
        width={0}
        height={36.574074}
        onChange={handleChange}
        widthFull
        fieldErrors={fieldErrors}
        placeholder="Type note here"
      />
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
