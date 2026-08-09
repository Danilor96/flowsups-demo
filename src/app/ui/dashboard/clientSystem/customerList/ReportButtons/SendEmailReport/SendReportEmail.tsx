import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { EmailRichTextEditor } from '&/miscellaneous/emailRichTextEditor/EmailRichTextEditor';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { Clients } from '@/app/libs/definitions';
import { Paragraph } from '@/app/ui/miscellaneous/paragraph/Paragraph';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { adminDashboardStore, messagesStore } from '@/store/adminDashboard';
import { customerListStore } from '@/store/customerList/customerList.store';
import { ListViewTypes } from '@/store/customerList/types';
import { pdf } from '@react-pdf/renderer';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { ClientPdfTable } from '../../generateTablePdf';
import { AddingSelect } from './AddingSelect';
import { Input } from '@/app/ui/inputs/Input';
import { exportClientsToExcelV2 } from '../../exportCustomersToXsl';

export function SendReportModal({
  reportName,
  customers,
  visibleColumnIds
}: {
  reportName: string;
  customers: Clients;
  visibleColumnIds?: string[];
}) {
  // ----- global states -----

  const { data: session } = useSession();

  const userId = session?.user.id;

  const openCloseReportModal = customerListStore(state => state.toggleSendReportModal);
  const viewType = customerListStore(state => state.viewType);
  const [users, getUsers] = adminDashboardStore(state => [state.users, state.getUsers]);
  const setMessage = messagesStore(state => state.setMessages);

  // ----- local states -----

  const [emailBody, setEmailBody] = useState('');
  const [subject, setSubject] = useState(reportName || '');
  const [asingUserValue, setAsingUserValue] = useState('');
  const [usersSelected, setUsersSelected] = useState<{ id: number; email: string; name: string }[]>([]);
  const [exportTo, setExportTo] = useState('PDF');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!users || users.length === 0) {
      getUsers();
    }
  }, [getUsers]);

  const handleChangeEmail = (value: string) => {
    setEmailBody(value);
  };

  const handleChangeSubject = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.currentTarget;

    setSubject(value);
  };

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();
  const [fieldErrors, setFieldErrors] = useState<
    | {
        [key: string]: [string | undefined];
      }
    | undefined
  >(undefined);

  // Función para generar el PDF y obtener el Blob
  const generatePdfBlob = useCallback(
    async (customersData: Clients) => {
      if (!customersData) return;

      const doc = (
        <ClientPdfTable
          clients={customersData}
          name={`${reportName}-${Date.now()}`}
          viewType={viewType}
          visibleColumnIds={visibleColumnIds}
        />
      );
      try {
        const blob = await pdf(doc).toBlob();
        return blob;
      } catch (error) {
        console.error('Error al generar el PDF', error);
        setMessage('Error in generating PDF');  
      }
    },
    [viewType, customers]
  );

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const errors: { [key: string ]: [ string | undefined ] } = {};

    if (usersSelected.length === 0) {
      errors.recipients = ['Please select at least one recipient'];
    }

    if (!subject) {
      errors.subject = ['Subject is required'];
    }

    if (!emailBody) {
      errors.emailBody = ['Please enter a message in the email body'];
    }

    if (Object.keys(errors).length > 0) {
      setMessage('Required fields in the form');
      setFieldErrors(errors);
      return;
    }

    setFieldErrors(undefined);
    setLoading(true);

    // Allow UI to update before starting heavy task
    await new Promise(resolve => setTimeout(resolve, 100));

    const fileName = `customer-list-${Date.now().toString()}`;
    const formData = new FormData();
    const file =
      exportTo === 'PDF'
        ? await generatePdfBlob(customers)
        : await exportClientsToExcelV2(customers || [], `${fileName}.xlsx`, true, {
            returnBlob: true,
            visibleColumns: visibleColumnIds
          });
    formData.append('emailBody', emailBody);
    formData.append('recipientsArray', JSON.stringify(usersSelected.map(el => el.email)));
    formData.append('subject', subject);

    if (file) formData.append('fileAtt', file, fileName);

    if (userId) formData.append('senderId', userId.toString());

    const apiUrl = '/api/adminDashboard/reports/customer-list/sendReportEmail';

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'POST',
      options: {
        onSuccess: () => {
          // updateDataWithSocket('smsModal');
          setLoading(false);
          openCloseReportModal();
          setMessage(undefined, 'Emails Successfully Sent');
        },
        onFieldErrors: (errors) => {
          setMessage('Required fields in the form');
          setFieldErrors(errors);
          setLoading(false);
        },
        onError: () => {
          setMessage('Server Error');
          setLoading(false);
        }
      }
    });
    setLoading(false);
  };

  const userOptions = users?.map(el => ({ id: el.id, name: `${el.name} ${el.last_name}`, email: el.email })) || [];

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer marginTop={2} width={70}>
        <ModalContainerTitle title="Send Email Report" closeWindowFunction={openCloseReportModal} />
        <ModalContent overflowVisible minHeight={87}>
          <Paragraph fontSize={2} color="#00a78b">
            Report - {reportName}
          </Paragraph>
          <Paragraph fontSize={2} color="#00a78b" marginTop={1.5}>
            Send to
          </Paragraph>
          <AddingSelect
            label="Send to"
            options={userOptions}
            name="recipientsArray"
            width={25}
            value={asingUserValue}
            selectedValues={usersSelected || []}
            onChange={e => {
              setAsingUserValue(e.target.value);
            }}
            onMultiSelect={selected => {
              setUsersSelected(selected);
            }}
          />
          <FieldErrorMessage name="recipients" positionStatic top={0} left={0} fieldErrors={fieldErrors} fontSize={2} />
          <div className="mt-[1vh]">
            <Paragraph marginBottom={0.5} fontSize={2} color="#00a78b" marginTop={1.5}>
              Export as
            </Paragraph>
            <Input
              type="select"
              value={exportTo === 'PDF' ? '1' : '2'}
              onChange={e => setExportTo(e.target.value === '1' ? 'PDF' : 'XLS')}
              options={[
                { value: 1, option: 'PDF' },
                { value: 2, option: 'XLSX' }
              ]}
              label=""
              name="exportAs"
              width={6}
            />
          </div>
          <div className="mt-[2vh]">
            <FieldErrorMessage name="subject" positionStatic top={0} left={0} fieldErrors={fieldErrors} fontSize={2} />
          </div>
          <aside className="relative h-full overflow-y-scroll">
            <EmailRichTextEditor
              value={emailBody}
              subject={subject}
              onSubjectChange={handleChangeSubject}
              onChange={handleChangeEmail}
            />
          </aside>
          <FieldErrorMessage name="emailBody" positionStatic top={0} left={0} fieldErrors={fieldErrors} fontSize={2} />
          <ButtonContainer marginTop={3} widthFull alignContentEnd justify="right" positionRelative>
            <div className="flex">
              <button
                className="bg-[#00A78B] text-white px-4 py-2 rounded-lg min-w-28 flex items-center justify-center hover:scale-105 transition-all"
                onClick={handleButton}
                disabled={loading}
              >
                Send
                {loading && (
                  <div
                    className="ml-2 animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-[#00A78B] rounded-full"
                    style={{ borderTopColor: 'white' }}
                  ></div>
                )}
              </button>
            </div>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
