import { useEffect, useState } from 'react';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { motion } from 'framer-motion';
import { CancelIcon } from '&/icons/Icons';
import { Input } from '&/inputs/Input';
import { currentSectionStore } from '@/store/adminDashboard';
import { Loader } from '../miscellaneous/loader/Loader';

export function IncidentForm({
  onClick,
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // global states
  const { section } = currentSectionStore();

  // local states
  const [inputs, setInputs] = useState<{ incident: string; section: string }>({
    incident: '',
    section: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | undefined>(undefined);

  // field errors
  const [fieldErrors, setFieldErrors] = useState<{
    incident: [string | undefined];
  }>({
    incident: [''],
  });

  //   handle changing section

  useEffect(() => {
    if (section) {
      setInputs((prevState) => ({
        ...prevState,
        section: section,
      }));
    }
  }, [section]);

  const handleInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSendIncident = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);

    try {
      const formData = new FormData();

      for (const [key, value] of Object.entries(inputs)) {
        value && formData.append(key, value);
      }

      const res = await (await fetch(`/api/incident`, { method: 'POST', body: formData })).json();

      //   success message
      if (res.successMessage) {
        setSuccess(res.successMessage);
        setInputs((prevState) => ({
          ...prevState,
          incident: '',
        }));
        setFieldErrors({
          incident: [''],
        });
      }

      //   server error
      if (res.serverError) {
        setFieldErrors((prevState) => ({
          ...prevState,
          incident: [res.serverError],
        }));
      }

      //   field errors
      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
      }
    } catch (error) {
      setFieldErrors((prevState) => ({
        ...prevState,
        incident: ['An error occurred'],
      }));
    }

    setLoading(false);
  };

  //   clear success messages

  useEffect(() => {
    success &&
      setTimeout(() => {
        setSuccess(undefined);
      }, 4000);
  }, [success]);

  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute w-fit h-fit bg-white px-[1vw] py-[1.5vh] rounded-[0.4vw] shadow-crmFormShadow"
    >
      {loading && <Loader zIndex={401} />}
      <article className="relative flex flex-col gap-[2vh]">
        <Input
          label="Section (optional)"
          name="section"
          type="text"
          value={inputs.section}
          width={12}
          onChange={handleInput}
        />
        <TextAreaInput
          label="Incident"
          width={17}
          height={15}
          name="incident"
          value={inputs.incident}
          onChange={handleInput}
          fieldErrors={fieldErrors}
        />
        <ButtonContainer marginInline marginTop={0}>
          <Button
            backgroundColor="#00A78B"
            buttonText="Send"
            width={5}
            height={4}
            identity="send"
            onClick={handleSendIncident}
            textColor="#FFF"
          />
        </ButtonContainer>
        {success && <p className="text-[1.8vh] text-green-500 font-medium">Incident sended</p>}
        <button onClick={onClick} type="button" className="absolute right-[-1vw] top-[-1.5vh]">
          <CancelIcon />
        </button>
      </article>
    </motion.aside>
  );
}
