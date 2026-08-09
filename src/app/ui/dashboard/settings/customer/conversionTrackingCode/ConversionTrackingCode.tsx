import { useEffect, useState } from 'react';
import { adminDashboardStore } from '@/store/adminDashboard';
import { ApiMessage } from '@/app/libs/definitions';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '&/inputs/Input';
import { Button } from '&/buttons/Button';
import { TagList } from '&/miscellaneous/tagList/TagList';
import { CustomerSettingsCheckbox } from '&/miscellaneous/customerSettingsCheckbox/CustomerSettingsCheckbox';

export function ConversiontrackingCode({ setMessages }: ApiMessage) {
  // ----- global states -----

  const { automatedReview, unknownAdfElements } = adminDashboardStore();
  const { getAutomatedReview, getUnknownAdfElements } = adminDashboardStore();

  useEffect(() => {
    getUnknownAdfElements();
    getAutomatedReview();
  }, [getAutomatedReview, getUnknownAdfElements]);

  // ----- local states -----

  const [inputs, setInputs] = useState<{
    trackingCode: string;
    unknownAdfElement: string;
    automatedReview: boolean;
  }>({
    trackingCode: '',
    unknownAdfElement: '',
    automatedReview: false,
  });

  const [fieldErrors, setFieldErrors] = useState<{ unknownAdfElement: [string | undefined] }>({
    unknownAdfElement: [''],
  });

  const [item1, setItem1] = useState<{ id: number | undefined; name: string | undefined }[]>([]);

  const [item2, setItem2] = useState<{ id: number | undefined; name: string | undefined }[]>([]);

  useEffect(() => {
    if (unknownAdfElements) {
      const newArray: { id: number | undefined; name: string | undefined }[] = [];
      unknownAdfElements.map((el) => newArray.push({ id: el.id, name: el.element }));
      setItem1(newArray);
    }

    if (automatedReview) {
      const newArray: { id: number | undefined; name: string | undefined }[] = [];
      automatedReview.map((el) => newArray.push({ id: el.id, name: el.invitation }));
      setItem2(newArray);
    }
  }, [unknownAdfElements, automatedReview]);

  //   handling change
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: name === 'automatedReview' ? !inputs.automatedReview : value,
    }));
  };

  //   handling fetchs
  const handleFetch = async (apiUrl: string, method: string, body?: FormData) => {
    try {
      let options;

      body ? (options = { method: method, body: body }) : (options = { method: method });

      const res = await (await fetch(apiUrl, options)).json();
      let response: string = '';

      if (res.successMessage) {
        response = 'success';
        setMessages((prevState) => ({
          ...prevState,
          successMessage: res.successMessage,
        }));
      }

      if (res.serverError) {
        response = 'error';
        setMessages((prevState) => ({
          ...prevState,
          serverError: res.serverError,
        }));
      }

      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
      }

      return response;
    } catch (error) {
      setMessages((prevState) => ({
        ...prevState,
        serverError: 'An error occurred',
      }));
    }
  };

  //   handling buttons
  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity, id } = e.currentTarget.dataset;

    const formData = new FormData();

    if (identity === 'unknownAdfElement') {
      if (id) {
        const res = await handleFetch(`/api/settings/unknownAdfElements/${id}`, 'DELETE');

        if (res === 'success') {
          getUnknownAdfElements();
        }
      } else {
        formData.append('unknownAdfElement', inputs.unknownAdfElement);

        const res = await handleFetch('/api/settings/unknownAdfElements', 'POST', formData);

        if (res === 'success') {
          setInputs((prevState) => ({
            ...prevState,
            unknownAdfElement: '',
          }));
          getUnknownAdfElements();
        }
      }
    }
  };

  return (
    <ModalContent>
      <ModalContent flexbox flexRow gap={1.302083}>
        <BorderedContent title="Conversion Tracking Code">
          <TextAreaInput
            label="Tracking code"
            width={32.916667}
            height={19}
            name="trackingCode"
            value={inputs.trackingCode}
            onChange={handleChange}
            fieldErrors={fieldErrors}
          />
        </BorderedContent>
        <BorderedContent title="Unknown ADF Elements to Include in the Notes">
          <ButtonContainer marginTop={0} gap={1.5} alignContentEnd>
            <Input
              label=""
              name="unknownAdfElement"
              value={inputs.unknownAdfElement}
              onChange={handleChange}
              type="text"
              width={20.729167}
              fieldErrors={fieldErrors}
            />
            <Button
              backgroundColor="#00A78B"
              textColor="#FFF"
              identity="unknownAdfElement"
              buttonText="Add"
              onClick={handleButton}
            />
          </ButtonContainer>
          <TagList
            height={14}
            items={item1}
            onClick={handleButton}
            identity="unknownAdfElement"
            marginTop={2}
          />
        </BorderedContent>
      </ModalContent>
      <BorderedContent title="Podium Automated Review Invitations" width={75} centerComponent>
        <ButtonContainer marginTop={0}>
          <CustomerSettingsCheckbox
            checkboxText="Enable automated review invitations"
            name="automatedReview"
            checked={inputs.automatedReview}
            onChange={handleChange}
          />
        </ButtonContainer>
        <TagList
          height={12}
          items={item2}
          onClick={handleButton}
          identity="automatedReview"
          marginTop={2}
        />
      </BorderedContent>
    </ModalContent>
  );
}
