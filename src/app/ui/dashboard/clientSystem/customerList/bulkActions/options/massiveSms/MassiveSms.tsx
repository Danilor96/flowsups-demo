import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { SendTo } from './sendTo/SendTo';
import { TemplatesSelect } from '&/dashboard/clientSystem/clientDetail/smsModal/smsInput/templatesSelect/TemplatesSelect';
import { useCallback, useRef, useState } from 'react';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import FileInput from '&/dashboard/clientSystem/clientDetail/smsModal/smsInput/fileInput/FileInput';
import FileAttachment from '&/dashboard/clientSystem/clientDetail/smsModal/smsInput/fileInput/FileAttachment';
import { InputButtons } from '&/dashboard/clientSystem/clientDetail/smsModal/smsInput/inputButtons/InputButtons';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSession } from 'next-auth/react';
import { useSocketStore } from '@/store/socketIo';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';

export function MassiveSms() {
  // ----- global states -----

  const { data: session } = useSession();

  const userId = session?.user.id;

  const { openCloseMassiveSms } = modalWindowStore();

  const { smsTemplates, selectedCustomersIds, smsTemplateVariables } = adminDashboardStore();
  const { getSmsTemplates, getSmsTemplateVariables } = adminDashboardStore();

  const { updateDataWithSocket } = useSocketStore();

  const getPromieseData = useCallback(() => {
    return [getSmsTemplates(), getSmsTemplateVariables()];
  }, [getSmsTemplates, getSmsTemplateVariables]);

  const { loading, error } = useLoadingGetData(getPromieseData);

  // ----- local states -----

  const [smsTemplateValueSearch, setSmsTemplateValueSearch] = useState<string>('');
  const [sms, setSms] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [templateVariable, setTemplateVariable] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleChangeSmsTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'smsTemplates') {
      setSmsTemplateValueSearch(value);
    }
  };

  const handleClickSmsTemplate = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;

    setSms(value);
  };

  const handleBlurSmsTemplate = (e: React.FocusEvent<HTMLInputElement>) => {
    const data = smsTemplates?.some((el) => {
      return el.name?.toLowerCase().trim() === smsTemplateValueSearch.toLowerCase().trim();
    });

    !data && setSmsTemplateValueSearch('');
  };

  const handleAdderSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'variables') {
      setTemplateVariable(value);
    }
  };

  const handleSelectButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    const { category } = e.currentTarget.dataset;

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

      const newText =
        currentText.substring(0, start) + selectedVariable + currentText.substring(end);

      setSms(newText);

      setTimeout(() => {
        const newCursorPosition = start + selectedVariable.length;
        textarea.selectionStart = newCursorPosition;
        textarea.selectionEnd = newCursorPosition;
        textarea.focus();
      }, 0);
    }
  };

  const handleChangeSms = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;

    setSms(value);
  };

  const handleChangeFile = (file: File[] | null) => {
    setFile(file && file?.length > 0 ? file[0] : null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleSendSms = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();

    formData.append('message', sms);

    formData.append('recipientsArray', JSON.stringify(selectedCustomersIds));

    if (userId) formData.append('senderId', userId.toString());

    if (file) formData.append('file', file);

    const apiUrl = '/api/message/massive';

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'POST',
      permissionForFetch: 58,
      options: {
        onSuccess: () => {
          updateDataWithSocket('smsModal');
        },
      },
    });
  };

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer marginTop={12} width={45.520833}>
        <ModalContainerTitle title="Send Sms" closeWindowFunction={openCloseMassiveSms} />
        <ModalContent overflowVisible minHeight={67} loading={loading || loadingFetch}>
          <SendTo />
          <aside className="flex flex-row justify-between pt-[3vh]">
            <TemplatesSelect
              smsTemplateValue={smsTemplateValueSearch}
              handleChangeSmsTemplate={handleChangeSmsTemplate}
              handleClickSmsTemplate={handleClickSmsTemplate}
              handleBlurSmsTemplate={handleBlurSmsTemplate}
              width={20}
              border
              label="Template"
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
          </aside>
          <aside className="relative mt-[3vh] h-[20vh]">
            <article className="relative w-full h-full">
              <textarea
                ref={textAreaRef}
                disabled={loading || loadingFetch}
                spellCheck="false"
                name="message"
                id="message"
                value={sms}
                onChange={handleChangeSms}
                placeholder="Enter Text here"
                className="w-full h-full outline-none bg-[#F4F4F4] font-medium text-[1.8vh] text-[#585858] resize-none px-[0.5vw] pt-[1.5vh] placeholder:text-[#959595]"
              />
              <FieldErrorMessage
                name="message"
                fieldErrors={fieldErrors}
                fieldErrorWidthMaxContent
              />
              <FieldErrorMessage
                name="fileAtt"
                fieldErrors={fieldErrors}
                fieldErrorWidthMaxContent
              />
            </article>
            {!file && (
              <p className="absolute top-[19.68vh] right-0 text-[2.2vh] text-[#13151b]">
                Image size must be 5MB or less
              </p>
            )}
          </aside>
          <aside className="w-full mt-[3vh] flex flex-row justify-between">
            <FileInput fileInputRef={fileInputRef} onChange={handleChangeFile} />
            <InputButtons
              sendSms={handleSendSms}
              disabled={loading || loadingFetch}
              fileInputRef={fileInputRef}
              widthFull
            />
          </aside>
          {file && !loadingFetch && (
            <div className="max-w-[75%] h-[4.5vh] mx-auto mt-[2vh]">
              <FileAttachment files={file ? [file] : null} setFiles={handleChangeFile} />
            </div>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
