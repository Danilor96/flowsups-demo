import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { TagList } from '&/miscellaneous/tagList/TagList';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { adminDashboardStore, messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { appointmentSmsTemplateStore } from '@/store/smsTemplate';
import { useEffect, useState } from 'react';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';

export function AppointmentSms() {
  // ----- global states -----

  const { openCloseAppointmentSms } = modalWindowStore();

  const { appointmentSmsTemplate } = appointmentSmsTemplateStore();
  const { getAppointmentSmsTemplate } = appointmentSmsTemplateStore();

  const { smsTemplateVariables } = adminDashboardStore();
  const { getSmsTemplateVariables } = adminDashboardStore();

  const { messages } = messagesStore();
  const { setMessages } = messagesStore();

  useEffect(() => {
    getAppointmentSmsTemplate().finally(() => {
      setLoading(false);
    });
    getSmsTemplateVariables();
  }, [getAppointmentSmsTemplate, getSmsTemplateVariables]);

  // ----- local states -----

  const [loading, setLoading] = useState<boolean>(true);

  const [templateVariable, setTemplateVariable] = useState<string>('');
  const [tagVariables, setTagVariables] = useState<
    { id: number | undefined; name: string | undefined }[]
  >([]);

  const [sms, setSms] = useState<string>('');

  useEffect(() => {
    if (appointmentSmsTemplate) {
      setSms(appointmentSmsTemplate.sms);
    }
  }, [appointmentSmsTemplate]);

  useEffect(() => {
    if (smsTemplateVariables && smsTemplateVariables.length > 0) {
      smsTemplateVariables.push({
        category: { id: 4, category: 'Appointment' },
        category_id: 4,
        id: 100,
        variable: 'Appointment Date',
        variable_tag: [
          {
            id: 100,
            sms_template_variable_id: 100,
            user_id: 1,
          },
        ],
      });
    }
  }, [smsTemplateVariables]);

  const [fieldErrors, setFieldErrors] = useState<{
    sms: [string | undefined];
  }>({
    sms: [undefined],
  });

  const handleAdderSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setTemplateVariable(value);
  };

  const handleSelectButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { category } = e.currentTarget.dataset;

    setTemplateVariable('');
    setTagVariables((prevState) => {
      if (Array.isArray(prevState)) {
        return [...prevState, { id: parseInt(value), name: name }];
      } else {
        return [{ id: parseInt(value), name: name }];
      }
    });
    setSms(`${sms}{${category?.toLowerCase()}.${name.toLowerCase().split(' ').join('_')}}`);
  };

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity, buttonitemidentity, id } = e.currentTarget.dataset;

    if (identity === 'removeTag' && id) {
      setTagVariables((prevState) => tagVariables.filter((el) => el.id !== parseInt(id)));
      e.stopPropagation();
    }

    if (buttonitemidentity === 'addVariable' && id) {
      setSms(
        `${sms}{${smsTemplateVariables
          ?.find((el) => el.id === parseInt(id))
          ?.category.category.toLowerCase()}.${smsTemplateVariables
          ?.find((el) => el.id === parseInt(id))
          ?.variable.toLowerCase()
          .split(' ')
          .join('_')}}`,
      );
      e.stopPropagation();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;

    setSms(value);
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('sms', sms);

      const res = await (
        await fetch(`/api/appointmentSmsTemplate/${appointmentSmsTemplate?.id}`, {
          method: 'PUT',
          body: formData,
        })
      ).json();

      if (res.successMessage) {
        setMessages(undefined, res.successMessage);
      }

      if (res.serverError) {
        setMessages(res.serverError);
      }

      if (res.fieldErrors) {
        setFieldErrors(res.fieldErrors);
      }
    } catch (error) {
      setMessages('An error occurred');
    }

    setLoading(false);
  };

  return (
    <ModalWindow
      top={0}
      minSizeFull
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
    >
      <ModalContainer marginTop={18} width={50}>
        <ModalContainerTitle
          title="Appointment Sms Template"
          closeWindowFunction={openCloseAppointmentSms}
        />
        <ModalContent loading={loading} minHeight={55}>
          <ContentRow cols={2} gap={5}>
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
              fieldErrors={fieldErrors}
            />
            <TagList
              width={26.8}
              height={9}
              buttonItems={tagVariables}
              rowGap={1.5}
              onClick={handleButton}
              identity="removeTag"
              buttonItemIdentity="addVariable"
            />
          </ContentRow>
          <TextAreaInput
            height={30}
            width={46}
            label=""
            name="template"
            value={sms}
            onChange={handleChange}
            fieldErrors={fieldErrors}
            marginTop={2}
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
