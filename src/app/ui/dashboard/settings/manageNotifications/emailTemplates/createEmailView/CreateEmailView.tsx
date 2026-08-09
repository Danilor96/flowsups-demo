import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { Input } from '&/inputs/Input';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { TagList } from '&/miscellaneous/tagList/TagList';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import React, { useEffect, useState } from 'react';
import { Header } from '&/dashboard/settings/manageNotifications/emailTemplates/header/Header';
import { Footer } from '&/dashboard/settings/manageNotifications/emailTemplates/footer/Footer';
import {
  emailTemplateStore,
  letterheadStore,
  singleEmailTemplateStore,
} from '@/store/emailTemplate';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { useSession } from 'next-auth/react';
import { EmailRichTextEditor } from '&/miscellaneous/emailRichTextEditor/EmailRichTextEditor';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';

export function CreateEmailView({ loading }: { loading: boolean }) {
  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();

  const { closeCreateEmailView } = modalWindowStore();

  const { smsTemplateCategory, smsTemplateVariables } = adminDashboardStore();
  const { getSmsTemplateVariables } = adminDashboardStore();

  const { letterhead } = letterheadStore();
  const { getLetterhead } = letterheadStore();

  const { emailTemplate } = singleEmailTemplateStore();
  const { clearSingleTemplate } = singleEmailTemplateStore();

  const session = useSession();
  const userId = session.data?.user.id;

  useEffect(() => {
    getLetterhead();
    getSmsTemplateVariables();
  }, [getLetterhead, getSmsTemplateVariables]);

  // ----- local states -----

  const [inputs, setInputs] = useState<{
    userId: string | undefined;
    name: string;
    header: File | undefined;
    template: string;
    subject: string;
    footer: File | undefined;
    category: string;
    letterhead: string;
  }>({
    userId: '',
    name: '',
    header: undefined,
    template: '',
    subject: '',
    footer: undefined,
    category: '',
    letterhead: '1',
  });

  useEffect(() => {
    if (letterhead && !emailTemplate) {
      letterhead.header?.header && setLocalHeaderImageUploaded(letterhead.header?.header);

      letterhead.footer?.footer && setLocalFooterImageUploaded(letterhead.footer?.footer);
    }

    if (userId && !emailTemplate) {
      setInputs((prevState) => ({
        ...prevState,
        userId: userId.toString(),
      }));
    }

    if (emailTemplate) {
      const isLetterhead = emailTemplate.header_id === emailTemplate.header?.letterhead.header_id;

      setInputs((prevState) => ({
        ...prevState,
        category: emailTemplate.category_id.toString(),
        name: emailTemplate.name,
        template: emailTemplate.body,
        letterhead: isLetterhead ? '1' : '',
      }));

      setAdderSelectText(emailTemplate.category.category);
      setLocalHeaderImageUploaded(emailTemplate.header?.header);
      setLocalFooterImageUploaded(emailTemplate.footer?.footer);
    }
  }, [letterhead, userId, emailTemplate]);

  const [adderSelectText, setAdderSelectText] = useState<string>('');
  const [templateVariable, setTemplateVariable] = useState<string>('');
  const [tagVariables, setTagVariables] = useState<
    { id: number | undefined; name: string | undefined }[]
  >([]);

  const [localHeaderImageUploaded, setLocalHeaderImageUploaded] = useState<any>(undefined);
  const [localFooterImageUploaded, setLocalFooterImageUploaded] = useState<any>(undefined);

  // handling change event

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;

    if (e.currentTarget instanceof HTMLInputElement && name === 'letterhead') {
      const { checked } = e.currentTarget;

      setInputs((prevState) => ({
        ...prevState,
        letterhead: !checked ? '' : '1',
      }));

      if (checked) {
        setInputs((prevState) => ({
          ...prevState,
          header: undefined,
          footer: undefined,
        }));

        setLocalHeaderImageUploaded(letterhead?.header?.header);
        setLocalFooterImageUploaded(letterhead?.footer?.footer);
      }

      return;
    }

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTextChange = (e: string) => {
    setInputs((prevState) => ({
      ...prevState,
      template: e,
    }));
  };

  // handling button events

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity, buttonitemidentity, id } = e.currentTarget.dataset;

    if (identity === 'removeTag' && id) {
      setTagVariables((prevState) => tagVariables.filter((el) => el.id !== parseInt(id)));

      e.stopPropagation();
    }

    if (buttonitemidentity === 'addVariable' && id) {
      const variableSelected = smsTemplateVariables?.find((el) => el.id === parseInt(id));
      const category = variableSelected?.category.category.toLowerCase() || '';
      const variable = variableSelected?.variable.toLowerCase().split(' ').join('_') || '';
      const insert = `{${category}.${variable}}`;

      setInputs((prevState) => ({
        ...prevState,
        template: `${inputs.template} ${insert}`,
      }));

      e.stopPropagation();
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
          header: headerImg,
        }));
      }

      if (localImagePath) {
        const reader = new FileReader();

        reader.onload = (e) => {
          e.target && e.target.result && setLocalHeaderImageUploaded(e.target?.result);
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
          footer: footerImg,
        }));
      }

      if (localImagePath) {
        const reader = new FileReader();

        reader.onload = (e) => {
          e.target && e.target.result && setLocalFooterImageUploaded(e.target?.result);
        };

        reader.readAsDataURL(localImagePath);
      }
    }
  };

  // handling adder input events

  const handleAdderSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'category') {
      setAdderSelectText(value);
    }

    if (name === 'variables') {
      setTemplateVariable(value);
    }
  };

  const handleSelectButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { identity, category } = e.currentTarget.dataset;

    if (identity === 'category') {
      setAdderSelectText(name);

      setInputs((prevState) => ({
        ...prevState,
        category: value,
      }));
    }

    if (identity === 'variables') {
      setTemplateVariable('');

      setTagVariables((prevState) => {
        if (Array.isArray(prevState)) {
          return [...prevState, { id: parseInt(value), name: name }];
        } else {
          return [{ id: parseInt(value), name: name }];
        }
      });

      setInputs((prevState) => ({
        ...prevState,
        template: `${inputs.template}{${category?.toLowerCase()}.${name
          .toLowerCase()
          .split(' ')
          .join('_')}}`,
      }));
    }
  };

  const handleBlurSelectInput = (e: React.FocusEvent<HTMLInputElement>) => {
    const data = smsTemplateCategory?.some((el) => {
      return el.category?.toLowerCase().trim() === adderSelectText.toLowerCase().trim();
    });

    !data && setAdderSelectText('');
  };

  // handling save data

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();

    for (const [name, value] of Object.entries(inputs)) {
      value && formData.append(name, value);
    }

    if (emailTemplate) {
      const apiUrl = `/api/settings/emailTemplate/${emailTemplate.id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 51,
        options: {
          onSuccess: () => {
            updateDataWithSocket('emailTemplate');
          },
        },
      });
    } else {
      const apiUrl = `/api/settings/emailTemplate`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 51,
        options: {
          onSuccess: () => {
            if (!emailTemplate) {
              setInputs({
                userId: userId?.toString(),
                name: '',
                header: undefined,
                template: '',
                subject: '',
                footer: undefined,
                category: '',
                letterhead: '1',
              });

              setLocalHeaderImageUploaded(undefined);
              setLocalFooterImageUploaded(undefined);

              updateDataWithSocket('emailTemplate');
            }
          },
        },
      });
    }
  };

  return (
    <ModalWindow top={0} minSizeFull positionFixed overflowYScroll height={100}>
      <ModalContainer width={60} marginTop={4}>
        <ModalContainerTitle
          title="Create Email Template"
          closeWindowFunction={() => {
            clearSingleTemplate();
            closeCreateEmailView();
          }}
        />
        <ModalContent loading={loadingFetch || loading} minHeight={100}>
          <ContentRow cols={3} gap={7}>
            <Input
              key={1}
              label="Name"
              name="name"
              type="text"
              width={17}
              value={inputs.name}
              onChange={handleChange}
              fieldErrors={fieldErrors}
            />
            <Input
              key={2}
              label=""
              name="letterhead"
              chekcboxText="use default letterhead"
              type="checkbox"
              width={0}
              value={inputs.letterhead}
              onChange={handleChange}
              fieldErrors={fieldErrors}
            />
            <AdderSelect
              width={17}
              iconTextGap={0}
              optionsWidth={17}
              optionsRadius={0.045}
              optionsHeight={5}
              optionsBackgroundColor="#FFF"
              optionsNameColor="#00A78B"
              value={adderSelectText}
              label="Category"
              name="category"
              options={smsTemplateCategory?.map((el) => {
                return { value: el.id?.toString(), name: el.category, identity: 'category' };
              })}
              onChange={handleAdderSelectChange}
              onClick={handleSelectButton}
              onBlur={handleBlurSelectInput}
              fieldErrors={fieldErrors}
            />
          </ContentRow>
          <ContentRow cols={2} gap={5} marginTop={2}>
            <AdderSelect
              width={17}
              iconTextGap={0}
              optionsWidth={17}
              optionsRadius={0.045}
              optionsHeight={5}
              optionsBackgroundColor="#FFF"
              optionsNameColor="#00A78B"
              value={templateVariable}
              optionsContainerHeight={40}
              label="Field"
              name="variables"
              optionsWithCategory={smsTemplateVariables?.map((el) => {
                return {
                  value: el.id.toString(),
                  name: el.variable,
                  categoryId: el.category_id,
                  category: el.category,
                  identity: 'variables',
                };
              })}
              onChange={handleAdderSelectChange}
              onClick={handleSelectButton}
              onBlur={handleBlurSelectInput}
              fieldErrors={fieldErrors}
            />
            <TagList
              width={36.5}
              height={9}
              buttonItems={tagVariables}
              rowGap={1.5}
              onClick={handleButton}
              identity="removeTag"
              buttonItemIdentity="addVariable"
            />
          </ContentRow>
          <Header
            height={250}
            width={250}
            img={localHeaderImageUploaded}
            letterhead={inputs.letterhead}
            onChange={handleImageChange}
          />
          <div className="mt-[2vh]"></div>
          <EmailRichTextEditor
            onChange={handleTextChange}
            value={inputs.template}
            onSubjectChange={handleChange}
            subject={inputs.subject}
          />
          <Footer
            height={250}
            width={250}
            img={localFooterImageUploaded}
            letterhead={inputs.letterhead}
            onChange={handleImageChange}
          />
          <ButtonContainer marginTop={2} widthFull justify="right">
            <Button
              buttonText="Save"
              width={6}
              height={5.277778}
              backgroundColor="#00A78B"
              identity="save"
              textColor="#FFF"
              onClick={handleSave}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
