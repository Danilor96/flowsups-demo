import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { SendTo } from '&/dashboard/clientSystem/customerList/bulkActions/options/massiveSms/sendTo/SendTo';
import { useCallback, useState } from 'react';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSession } from 'next-auth/react';
import { useSocketStore } from '@/store/socketIo';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { EmailRichTextEditor } from '&/miscellaneous/emailRichTextEditor/EmailRichTextEditor';
import { emailTemplateStore } from '@/store/emailTemplate';
import { TemplateSelect } from './templateSelect/TemplateSelect';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { Header } from '&/dashboard/settings/manageNotifications/emailTemplates/header/Header';
import { Footer } from '&/dashboard/settings/manageNotifications/emailTemplates/footer/Footer';
import { AdderSelect } from '@/app/ui/select/adderSelect/AdderSelect';

export function MassiveEmails() {
  // ----- global states -----

  const { data: session } = useSession();

  const userId = session?.user.id;

  const { selectedCustomersIds, smsTemplateVariables } = adminDashboardStore();
  const { getSmsTemplateVariables } = adminDashboardStore();

  const { openCloseMassiveEmails } = modalWindowStore();

  const { emailTemplates } = emailTemplateStore();
  const { getEmailTemplates } = emailTemplateStore();

  const { updateDataWithSocket } = useSocketStore();

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

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();

    formData.append('emailBody', emailBody);

    formData.append('recipientsArray', JSON.stringify(selectedCustomersIds));

    formData.append('subject', subject);

    formData.append('headerImage', headerImage);

    formData.append('footerImage', footerImage);

    if (userId) formData.append('senderId', userId.toString());

    const apiUrl = '/api/email/massive';

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'POST',
      permissionForFetch: 59,
      options: {
        onSuccess: () => {
          // updateDataWithSocket('smsModal');
        },
      },
    });
  };

  return (
    <ModalWindow top={0} positionFixed overflowYScroll minSizeFull height={101}>
      <ModalContainer marginTop={2} width={70}>
        <ModalContainerTitle title="Send Email" closeWindowFunction={openCloseMassiveEmails} />
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
            <FieldErrorMessage
              name="subject"
              top={2.5}
              left={0}
              fieldErrors={fieldErrors}
              fontSize={2}
            />
            <FieldErrorMessage
              name="emailBody"
              top={0}
              left={0}
              fieldErrors={fieldErrors}
              fontSize={2}
            />
            <Button
              backgroundColor="#00a78b"
              identity="send"
              textColor="#FFF"
              buttonText="Send"
              onClick={handleButton}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
