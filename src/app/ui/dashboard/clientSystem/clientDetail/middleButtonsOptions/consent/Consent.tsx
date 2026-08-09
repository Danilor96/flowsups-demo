import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import {
  adminDashboardStore,
  consentMessageStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TemplatesSelect } from '&/dashboard/clientSystem/clientDetail/smsModal/smsInput/templatesSelect/TemplatesSelect';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { PhoneSelector } from '&/dashboard/clientSystem/outgoingCallComponent/PhoneSelector/PhoneSelector';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useCan } from '@/hooks/permissions';
import { Can } from '@/app/ui/auth/Can';

export function Consent() {
  // ----- global states -----

  const { data: session } = useSession();

  const userId = session?.user.id;

  const { can } = useCan();

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const {
    setShowConsentModal,
    openCloseCustomerSettings,
    openSettings,
    openCloseCustomerSettingsFromConsentWindow,
  } = modalWindowStore();

  const { automaticSms, smsTemplates, smsTemplateVariables } = adminDashboardStore();
  const { getAutomaticSms, getSmsTemplates, getSmsTemplateVariables } = adminDashboardStore();

  const { consentLink } = consentMessageStore();
  const { setConsentLink } = consentMessageStore();

  const getPromisesData = useCallback(() => {
    return [
      getAutomaticSms(),
      getSmsTemplates(),
      getSmsTemplateVariables(),
      setConsentLink(singleCLientData?.id),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromisesData);

  useEffect(() => {
    if (automaticSms && smsTemplates) {
      if (automaticSms.consent_sms && automaticSms.consent_sms_template_id) {
        const templateSelected = smsTemplates.find(
          (el) => el.id === automaticSms.consent_sms_template_id,
        );

        if (templateSelected) {
          setMessage(templateSelected.template);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [automaticSms, smsTemplates, singleCLientData, consentLink]);

  // ----- local states -----

  const [message, setMessage] = useState('');
  const [smsTemplateValue, setSmsTemplateValue] = useState<string>('');
  const [templateVariable, setTemplateVariable] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleChangeSmsTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'smsTemplates') {
      setSmsTemplateValue(value);
    }
  };

  const handleClickSmsTemplate = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;

    setMessage(value);
  };

  const handleBlurSmsTemplate = (e: React.FocusEvent<HTMLInputElement>) => {
    const data = smsTemplates?.some((el) => {
      return el.name?.toLowerCase().trim() === smsTemplateValue.toLowerCase().trim();
    });

    !data && setSmsTemplateValue('');
  };

  const handleAdderSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'variables') {
      setTemplateVariable(value);
    }
  };

  const handleSelectButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    const { identity, category } = e.currentTarget.dataset;

    if (identity === 'variables') {
      setTemplateVariable('');

      const textarea = textAreaRef.current;

      if (textarea && category && name) {
        const selectedVariable = `{${category?.toLowerCase()}.${name
          .toLowerCase()
          .split(' ')
          .join('_')}}`;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = textarea.value;

        const templateSelected = smsTemplates?.find(
          (el) => el.id === automaticSms?.consent_sms_template_id,
        );

        const newText =
          currentText.substring(0, start) + selectedVariable + currentText.substring(end);

        setMessage(newText);

        setTimeout(() => {
          const newCursorPosition = start + selectedVariable.length;
          textarea.selectionStart = newCursorPosition;
          textarea.selectionEnd = newCursorPosition;
          textarea.focus();
        }, 0);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'message') {
      setMessage(value);
    }
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'terms' && can(56)) {
      openCloseCustomerSettings();

      openCloseCustomerSettingsFromConsentWindow();

      openSettings();
    } else {
      const formData = new FormData();

      formData.append('mssg', message);

      formData.append('consentLink', consentLink);

      if (userId) formData.append('senderId', userId.toString());
      formData.append('sentAt', new Date().toUTCString());

      if (phone) formData.append('sendToNumber', phone.phoneNumber);

      const apiUrl = `/api/adminDashboard/consentMssg/${singleCLientData?.id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        options: {
          onSuccess: () => {
            if (singleCLientData) getSingleClientData(singleCLientData.id.toString());
            setShowConsentModal(false);
          },
        },
      });
    }
  };

  const [phone, setPhone] = useState<{ id: number; phoneType: string; phoneNumber: string } | null>(
    null,
  );

  useEffect(() => {
    if (singleCLientData) {
      setPhone({
        id: 1,
        phoneType: 'Cell',
        phoneNumber: singleCLientData?.mobile_phone,
      });
    }
  }, [singleCLientData]);

  const listPhones = [
    {
      id: 1,
      phoneType: 'Cell',
      phoneNumber: singleCLientData?.mobile_phone || '',
    },
    {
      id: 2,
      phoneType: 'Home',
      phoneNumber: singleCLientData?.home_phone || '',
    },
    {
      id: 3,
      phoneType: 'Work',
      phoneNumber: singleCLientData?.work_phone || '',
    },
  ].filter((phone) => phone.phoneNumber);

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer width={54} marginTop={10} positionRelative>
        <ModalContainerTitle
          title="Consent"
          closeWindowFunction={() => setShowConsentModal(false)}
        />
        <ModalContent minHeight={73} loading={loading || loadingFetch}>
          <ButtonContainer marginTop={0} widthFull justify="space-between">
            <TemplatesSelect
              smsTemplateValue={smsTemplateValue}
              handleChangeSmsTemplate={handleChangeSmsTemplate}
              handleClickSmsTemplate={handleClickSmsTemplate}
              handleBlurSmsTemplate={handleBlurSmsTemplate}
              optionsTop={5.5}
              optionsHeight={8}
              optionsContainerHeight={32}
              optionsZIndex={20000}
              label="Template"
              border
              width={15}
            />
            <AdderSelect
              width={17}
              iconTextGap={0}
              optionsWidth={17}
              optionsRadius={0.045}
              optionsHeight={5}
              border={0.05}
              borderColor="#00A78B"
              optionsBackgroundColor="#FFF"
              optionsNameColor="#00A78B"
              value={templateVariable}
              optionsContainerHeight={40}
              label="Variable"
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
            />
          </ButtonContainer>
          <textarea
            ref={textAreaRef}
            name="message"
            id=""
            value={message}
            onChange={handleChange}
            className="w-full h-[50vh] resize-none mt-[1vh] text-[1.9vh] font-normal text-gray-950 px-[0.7vw] py-[0.8vh] border border-[#ceeee9] outline-[#ceeee9]"
          ></textarea>
          <ButtonContainer widthFull justify="space-between" marginTop={0}>
            <PhoneSelector
              name="Phone"
              onChange={(phone) => setPhone(phone)}
              options={listPhones}
              value={phone}
              width={15}
              className="h-[5.092593vh] bg-[#F4F4F4] text-[1.666667vh]"
            />
            <Can requiredPermission={56}>
              <Button
                backgroundColor="#FFF"
                buttonText="Terms and Conditions"
                height={5}
                width={10}
                textColor="#00A78B"
                identity="terms"
                border={0.05}
                borderColor="#00A78B"
                onClick={handleButton}
              />
            </Can>
            <Button
              backgroundColor="#00A78B"
              buttonText="Send"
              height={5}
              width={7}
              textColor="#FFF"
              identity="sendConsent"
              onClick={handleButton}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
