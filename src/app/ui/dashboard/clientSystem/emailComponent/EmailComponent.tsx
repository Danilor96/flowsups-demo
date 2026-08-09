import { ModalContainer } from '@/app/ui/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '@/app/ui/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '@/app/ui/modalWindowsStructure/ModalContent';
import { ModalWindow } from '@/app/ui/modalWindowsStructure/ModalWindow';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import {
  adminDashboardStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useCallback, useState } from 'react';
import { SendTo } from '../customerList/bulkActions/options/massiveSms/sendTo/SendTo';
import { emailTemplateStore } from '@/store/emailTemplate';
import { TemplateSelect } from '&/dashboard/clientSystem/customerList/bulkActions/options/massiveEmails/templateSelect/TemplateSelect';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { Header } from '&/dashboard/settings/manageNotifications/emailTemplates/header/Header';
import { Footer } from '&/dashboard/settings/manageNotifications/emailTemplates/footer/Footer';
import { AdderSelect } from '@/app/ui/select/adderSelect/AdderSelect';
import { EmailRichTextEditor } from '&/miscellaneous/emailRichTextEditor/EmailRichTextEditor';
import { ButtonContainer } from '@/app/ui/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useSession } from 'next-auth/react';

export function EmailComponent() {
  // ----- global states -----
  const { data: session } = useSession();

  const userId = session?.user.id;

  const { singleCLientData } = singleCLientDataStore();

  const { emailTemplates } = emailTemplateStore();
  const { getEmailTemplates } = emailTemplateStore();

  const getSmsTemplateVariables = adminDashboardStore((state) => state.getSmsTemplateVariables);

  const smsTemplateVariables = adminDashboardStore((state) => state.smsTemplateVariables);

  const setShowEmailModal = modalWindowStore((state) => state.setShowEmailModal);

  const getPromieseData = useCallback(() => {
    return [getEmailTemplates(), getSmsTemplateVariables()];
  }, [getEmailTemplates, getSmsTemplateVariables]);

  const { loading, error } = useLoadingGetData(getPromieseData);

  // ----- local states -----

  const [emailTemplateValueSearch, setEmailTemplateValueSearch] = useState<string>('');
  const [emailBody, setEmailBody] = useState('');
  const [subject, setSubject] = useState('');
  const [headerImage, setHeaderImage] = useState('');
  const [footerImage, setFooterImage] = useState('');
  const [templateVariable, setTemplateVariable] = useState('');

  const handleChangeEmailTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setEmailTemplateValueSearch(value);
  };

  const handleClickEmailTemplate = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity) {
      const templateSelected = emailTemplates?.find((el) => el.id.toString() === identity);
      const headerImageUrl = templateSelected?.header?.header || '';
      const footerImageUrl = templateSelected?.footer?.footer || '';
      const subjectVal = templateSelected?.subject || '';

      setHeaderImage(headerImageUrl);
      setFooterImage(footerImageUrl);
      setSubject(subjectVal);
    }

    setEmailBody(value);
  };

  const handleBlurEmailTemplate = (e: React.FocusEvent<HTMLInputElement>) => {
    const data = emailTemplates?.some((el) => {
      return el.name?.toLowerCase().trim() === emailTemplateValueSearch.toLowerCase().trim();
    });

    !data && setEmailTemplateValueSearch('');
  };

  const handleChangeEmail = (value: string) => {
    setEmailBody(value);
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

    const selectedVariable = `{${category?.toLowerCase()}.${name
      .toLowerCase()
      .split(' ')
      .join('_')}}`;

    setEmailBody(`${emailBody} ${selectedVariable}`);
  };

  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.currentTarget;

    setSubject(value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const { loadingFetch, makeAsyncFetch, fieldErrors } = useAsyncFetching();

  const handleSendEmail = async () => {
    const formData = new FormData();

    formData.append('emailBody', emailBody);

    formData.append('recipient', singleCLientData?.email || '');

    formData.append('subject', subject);

    formData.append('headerImage', headerImage);

    formData.append('footerImage', footerImage);

    if (userId) formData.append('senderId', userId.toString());

    formData.append('assignedTo', singleCLientData?.seller?.id.toString() || '');

    const apiUrl = `/api/email/${singleCLientData?.id}`;

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'POST',
      options: {
        onSuccess: () => {},
      },
    });
  };

  return (
    <ModalWindow top={0} positionFixed overflowYScroll minSizeFull height={101}>
      <ModalContainer marginTop={2} width={70}>
        <ModalContainerTitle
          title="Send Email"
          closeWindowFunction={() => setShowEmailModal(false)}
        />
        <ModalContent overflowVisible minHeight={87} loading={loading || loadingFetch}>
          <SendTo gridColumns={6} showEmails />
          <aside className="flex flex-row justify-between pt-[3vh]">
            <TemplateSelect
              emailTemplateValue={emailTemplateValueSearch}
              handleChangeEmailTemplate={handleChangeEmailTemplate}
              handleClickEmailTemplate={handleClickEmailTemplate}
              handleBlurEmailTemplate={handleBlurEmailTemplate}
            />
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
          <aside className="mt-[3vh]">
            <Header
              width={250}
              height={250}
              letterhead="1"
              onChange={handleImageChange}
              img={headerImage}
            />
          </aside>
          <aside className="relative mt-[3vh] h-[45vh] overflow-y-scroll">
            <EmailRichTextEditor
              value={emailBody}
              subject={subject}
              fieldErrors={fieldErrors}
              onSubjectChange={handleChangeSubject}
              onChange={handleChangeEmail}
            />
          </aside>
          <aside className="mt-[3vh]">
            <Footer
              width={250}
              height={250}
              letterhead="1"
              onChange={handleImageChange}
              img={footerImage}
            />
          </aside>
          <ButtonContainer marginTop={3} widthFull justify="right" positionRelative>
            <Button
              backgroundColor="#00a78b"
              identity="send"
              textColor="#FFF"
              buttonText="Send"
              onClick={handleSendEmail}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
