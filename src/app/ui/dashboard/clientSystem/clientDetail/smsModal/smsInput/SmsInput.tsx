import {
  adminDashboardStore,
  clientMessagesStore,
  messagesStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { smsTemplateStore } from '@/store/smsTemplate';
import { useEffect, useRef, useState } from 'react';
import { TextInput } from '&/dashboard/clientSystem/clientDetail/smsModal/smsInput/textInput/TextInput';
import { InputButtons } from '&/dashboard/clientSystem/clientDetail/smsModal/smsInput/inputButtons/InputButtons';
import { TemplatesSelect } from '&/dashboard/clientSystem/clientDetail/smsModal/smsInput/templatesSelect/TemplatesSelect';
import { useSession } from 'next-auth/react';
import { FieldErrorMessage } from '&/dashboard/clientSystem/clientDetail/smsModal/smsInput/fieldErrorMessage/FieldErrorMessage';
import { AnimatePresence } from 'framer-motion';
import FileInput from './fileInput/FileInput';
import FileAttachment from './fileInput/FileAttachment';
import { PhoneSelector } from '&/dashboard/clientSystem/outgoingCallComponent/PhoneSelector/PhoneSelector';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';

export function SmsInput() {
  // ----- global states -----
  const session = useSession();

  const userId = session.data?.user.id;

  const userName = `${session.data?.user.name} ${session.data?.user.last_name}`;

  const { replaceVariables, dataObject } = smsTemplateStore();

  const { singleCLientData } = singleCLientDataStore();

  const { smsTemplates } = adminDashboardStore();
  const { getSmsTemplates } = adminDashboardStore();

  const { clientMessages } = clientMessagesStore();

  const { setWaitingSendCurrentMessage, clearWaitingSendCurrentMessage } = clientMessagesStore();

  const { setMessages } = messagesStore();

  useEffect(() => {
    getSmsTemplates();
  }, [getSmsTemplates]);

  // ----- local states -----

  const [smsTemplateValue, setSmsTemplateValue] = useState<string>('');
  const [sms, setSms] = useState<string>('');
  const [fieldErrorMessage, setFieldErrorMessage] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // ----- local states -----
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

  //   handle template

  const handleChangeSmsTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'smsTemplates') {
      setSmsTemplateValue(value);
    }
  };

  const handleClickSmsTemplate = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value, name } = e.currentTarget;

    const data = dataObject(singleCLientData);

    const smsText = replaceVariables(value, data);

    setSms(smsText);
    // setSmsTemplateValue(name);
  };

  const handleBlurSmsTemplate = (e: React.FocusEvent<HTMLInputElement>) => {
    const data = smsTemplates?.some((el) => {
      return el.name?.toLowerCase().trim() === smsTemplateValue.toLowerCase().trim();
    });

    !data && setSmsTemplateValue('');
  };

  //   end handle template

  const handleChangeSms = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;

    setSms(value);
  };

  const handleChangeFile = (files: File[] | null) => {
    setFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const returnUnregisteredCustomerMobilePhoneNumber = () => {
    if (clientMessages && clientMessages.length > 0) {
      return clientMessages[0].unregistered_customer[0].mobile_phone_number;
    } else {
      return '';
    }
  };

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const sendSms = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (sms || files) {
      setFieldErrorMessage('');

      setDisabled(true);
      const phoneNumberSelected = phone?.phoneNumber;

      setWaitingSendCurrentMessage(0.5, sms, userName, new Date(), true, files);

      const formData = new FormData();

      if (singleCLientData && singleCLientData?.mobile_phone) {
        formData.append('clientId', `${singleCLientData?.id.toString()}`);
      }

      formData.append(
        'clientNumber',
        `${
          singleCLientData?.mobile_phone
            ? phoneNumberSelected
            : returnUnregisteredCustomerMobilePhoneNumber()
        }`,
      );

      formData.append('message', sms);

      formData.append('senderId', `${userId}`);

      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('file', file);
        });
      }

      if (
        clientMessages &&
        clientMessages.length > 0 &&
        clientMessages[0]?.unregistered_customer[0]?.mobile_phone_number
      ) {
        formData.append('unregisteredCustomer', '1');
      }

      const formatNumberSelected = phoneNumberSelected && phoneNumberSelected.length > 10 ? phoneNumberSelected.slice(-10) : phoneNumberSelected;
      const apiUrl = `/api/message/${
        singleCLientData?.mobile_phone
          ? formatNumberSelected
          : returnUnregisteredCustomerMobilePhoneNumber()
      }`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 64,
        options: {
          onSuccess: () => {
            setSms('');
            setFiles(null);
          },
          onError: () => {
            clearWaitingSendCurrentMessage();
          },
          onFieldErrors: (errors) => {
            clearWaitingSendCurrentMessage();
            if (errors.message) setFieldErrorMessage(errors?.message[0] || '');
            if (errors.fileAtt) setFieldErrorMessage(errors?.fileAtt[0] || '');
          },
          onLocalError: () => {
            clearWaitingSendCurrentMessage();
          },
        },
      });

      setDisabled(false);
    } else {
      setFieldErrorMessage('Enter at least a message or a file');
    }
  };

  return (
    <section className="w-full flex flex-col gap-2 items-end pr-[1vw] mt-2">
      <div className="flex flex-row justify-center items-end gap-[0.5vw] h-fit w-full">
        <TemplatesSelect
          smsTemplateValue={smsTemplateValue}
          handleChangeSmsTemplate={handleChangeSmsTemplate}
          handleClickSmsTemplate={handleClickSmsTemplate}
          handleBlurSmsTemplate={handleBlurSmsTemplate}
        />
        <div className="">
          <PhoneSelector
            name="Phone"
            onChange={(phone) => setPhone(phone)}
            options={listPhones}
            value={phone}
            width={10}
            className="h-[5.092593vh] bg-[#F4F4F4] text-[1.666667vh]"
          />
        </div>
        <div className="relative w-full min-h-[5.092593vh] h-fit flex flex-row items-end pb-[1.1vh] pl-[0.8vw] pr-[1vw] bg-[#F4F4F4] rounded-[0.520833vw] disabled:bg-[#F4F4F460]">
          <TextInput
            sms={sms}
            handleChangeSms={handleChangeSms}
            disabled={disabled || loadingFetch}
          />
          <FileInput fileInputRef={fileInputRef} onChange={handleChangeFile} />
          <InputButtons
            sendSms={sendSms}
            disabled={disabled || loadingFetch}
            fileInputRef={fileInputRef}
          />
          <AnimatePresence>
            {fieldErrorMessage && <FieldErrorMessage message={fieldErrorMessage} />}
          </AnimatePresence>
          {!files && (
            <p className="absolute bottom-[-3.2vh] right-0 text-[2.2vh] text-[#13151b]">
              Image size must be 5MB or less
            </p>
          )}
        </div>
      </div>
      {files && !disabled && (
        <div className="max-w-[75%] h-[4.5vh]">
          <FileAttachment files={files} setFiles={handleChangeFile} />
        </div>
      )}
    </section>
  );
}
//max-w-[75%] h-[4.5vh]
