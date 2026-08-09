import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { Header } from '&/dashboard/settings/manageNotifications/emailTemplates/header/Header';
import { Footer } from '&/dashboard/settings/manageNotifications/emailTemplates/footer/Footer';
import { messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { letterheadStore } from '@/store/emailTemplate';
import React, { useEffect, useState } from 'react';
import { Input } from '&/inputs/Input';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';

export function EditLetterhead() {
  // ----- global states -----

  const { messages } = messagesStore();
  const { setMessages } = messagesStore();

  const { closeEditLetterhead } = modalWindowStore();

  const { letterhead } = letterheadStore();
  const { getLetterhead } = letterheadStore();

  useEffect(() => {
    getLetterhead();
  }, [getLetterhead]);

  // ----- local states -----

  const [inputs, setInputs] = useState<{
    header: string;
    footer: string;
    headerInput: File | undefined;
    footerInput: File | undefined;
  }>({
    header: '1',
    footer: '1',
    headerInput: undefined,
    footerInput: undefined,
  });

  const [fieldErrors, setFieldErrors] = useState<{ headerInput: [string]; footerInput: [string] }>({
    headerInput: [''],
    footerInput: [''],
  });

  const [localHeaderImage, setLocalHeaderImage] = useState<any>('');
  const [localFooterImage, setLocalFooterImage] = useState<any>('');

  useEffect(() => {
    if (letterhead) {
      setLocalHeaderImage(letterhead.header?.header);
      setLocalFooterImage(letterhead.footer?.footer);
    }
  }, [letterhead]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    if (e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;

      if (name === 'footerInput') {
        setInputs((prevState) => ({
          ...prevState,
          footer: !checked ? '' : '1',
        }));
      }

      if (name === 'headerInput') {
        setInputs((prevState) => ({
          ...prevState,
          header: !checked ? '' : '1',
        }));
      }

      return;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;

    if (name === 'header') {
      const localImagePath = e.target.files && e.target.files[0];

      const headerImg = e.target.files && e.target.files[0] ? e.target.files[0] : undefined;

      if (headerImg) {
        setInputs((prevState) => ({
          ...prevState,
          headerInput: headerImg,
        }));
      }

      if (localImagePath) {
        const reader = new FileReader();

        reader.onload = (e) => {
          e.target && e.target.result && setLocalHeaderImage(e.target?.result);
        };

        reader.readAsDataURL(localImagePath);
      }
    }

    if (name === 'footer') {
      const localImagePath = e.target.files && e.target.files[0];

      const footerImg = e.target.files && e.target.files[0] ? e.target.files[0] : undefined;

      if (footerImg) {
        setInputs((prevState) => ({
          ...prevState,
          footerInput: footerImg,
        }));
      }

      if (localImagePath) {
        const reader = new FileReader();

        reader.onload = (e) => {
          e.target && e.target.result && setLocalFooterImage(e.target?.result);
        };

        reader.readAsDataURL(localImagePath);
      }
    }
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'save') {
      const formData = new FormData();

      inputs.headerInput && formData.append('headerInput', inputs.headerInput);
      inputs.footerInput && formData.append('footerInput', inputs.footerInput);

      let res: any;

      try {
        if (
          (letterhead?.footer_id || letterhead?.header_id) &&
          (inputs.footerInput || inputs.headerInput) &&
          letterhead
        ) {
          res = await (
            await fetch(`/api/letterhead/${letterhead.id}`, { method: 'PUT', body: formData })
          ).json();
        } else if (inputs.footerInput || inputs.headerInput) {
          res = await (await fetch('/api/letterhead', { method: 'POST', body: formData })).json();
        }

        if (res && res.successMessage) {
          setMessages(undefined, res.successMessage);

          setFieldErrors({
            headerInput: [''],
            footerInput: [''],
          });
        }

        if (res && res.serverError) {
          setMessages(res.serverError);
        }

        if (res && res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
      } catch (error) {
        setMessages('An error occurred');
      }
    }
  };

  return (
    <ModalWindow
      top={0}
      minSizeFull
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
    >
      <ModalContainer marginTop={15} width={60}>
        <ModalContainerTitle closeWindowFunction={closeEditLetterhead} title="Edit Letterhead" />
        <ModalContent>
          <Input
            label=""
            name="headerInput"
            onChange={handleChange}
            type="checkbox"
            value={inputs.header}
            width={0}
            chekcboxText="Header"
          />
          {inputs.header ? (
            <>
              <Header
                height={250}
                width={250}
                letterhead=""
                img={localHeaderImage}
                onChange={handleImageChange}
              />
              {fieldErrors.headerInput && (
                <Paragraph color="#F00" marginTop={0.2}>
                  {fieldErrors.headerInput}
                </Paragraph>
              )}
            </>
          ) : (
            <ButtonContainer marginTop={0.5} widthFull justify="center">
              <Paragraph color="#00A78B" fontSize={2.5}>
                Header Disabled
              </Paragraph>
            </ButtonContainer>
          )}
          <aside className="mt-[2.5vh]"></aside>
          <Input
            label=""
            name="footerInput"
            onChange={handleChange}
            type="checkbox"
            value={inputs.footer}
            width={0}
            chekcboxText="Footer"
          />
          {inputs.footer ? (
            <>
              <Footer
                height={250}
                width={250}
                letterhead={''}
                img={localFooterImage}
                onChange={handleImageChange}
              />
              {fieldErrors.footerInput && (
                <Paragraph color="#F00" marginTop={0.2}>
                  {fieldErrors.footerInput}
                </Paragraph>
              )}
            </>
          ) : (
            <ButtonContainer marginTop={0.5} widthFull justify="center">
              <Paragraph color="#00A78B" fontSize={2.5}>
                Footer Disabled
              </Paragraph>
            </ButtonContainer>
          )}
          <ButtonContainer marginTop={2} widthFull justify="right">
            <Button
              buttonText="Save"
              width={6}
              height={5.277778}
              backgroundColor="#00A78B"
              identity="save"
              textColor="#FFF"
              onClick={handleButton}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
