import { EmailTemplate } from '@/app/libs/definitions';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Button } from '&/buttons/Button';
import { Input } from '&/inputs/Input';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { IconedSelect } from '&/select/iconedSelect/IconedSelect';
import { Table } from '&/table/Table';
import { useCallback, useEffect, useState } from 'react';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { CreateEmailView } from '&/dashboard/settings/manageNotifications/emailTemplates/createEmailView/CreateEmailView';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { AnimatePresence } from 'framer-motion';
import { emailTemplateStore, singleEmailTemplateStore } from '@/store/emailTemplate';
import { EditIcon, FavoriteIcon } from '&/icons/Icons';
import { EditLetterhead } from '&/dashboard/settings/manageNotifications/emailTemplates/editLetterhead/EditLetterhead';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';

export function EmailTemplates() {
  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();

  const { createEmailView, editLetterhead } = modalWindowStore();
  const { openCreateEmailView, openEditLetterhead } = modalWindowStore();

  const { getSmsTemplateCategory } = adminDashboardStore();

  const { emailTemplates } = emailTemplateStore();
  const { getEmailTemplates } = emailTemplateStore();

  const { getSingleEmailTemplate } = singleEmailTemplateStore();

  const getPromisesData = useCallback(() => {
    return [getSmsTemplateCategory(), getEmailTemplates()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromisesData);

  // ----- local states -----

  const [filteredData, setFilteredData] = useState<EmailTemplate>(undefined);

  const [loadingTemplate, setLoadingTemplate] = useState(false);

  useEffect(() => {
    if (emailTemplates && emailTemplates.length > 0) {
      const dataSorted = emailTemplates.sort((a, b) => {
        if (a.favorite && !b.favorite) {
          return -1;
        }
        if (!a.favorite && b.favorite) {
          return 1;
        }

        return 0;
      });

      setFilteredData(dataSorted);
    }
  }, [emailTemplates]);

  const [iconedSelectText, setIconedSelectText] = useState<string>('Category');

  // inputs
  const [inputs, setInputs] = useState<{
    userId: string | undefined;
    all: string | undefined;
    draft: string | undefined;
    published: string | undefined;
    dealer: string | undefined;
    system: string | undefined;
  }>({
    userId: undefined,
    all: undefined,
    draft: undefined,
    published: undefined,
    dealer: undefined,
    system: undefined,
  });

  // table data
  const [tableData, setTableData] = useState<any[]>([
    {
      id: '',
      _blankFavorite_smallColumn: '',
      _blankEdit_smallColumn: '',
      name: '',
      category: '',
      created_by: '',
      created_date: '',
      _blankPublished: '',
      _blankUnpublished: '',
    },
  ]);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      setTableData(
        filteredData.map((el) => ({
          id: el.id,
          _blankFavorite_smallColumn: (
            <Button
              buttonIcon={<FavoriteIcon color={el.favorite ? '#ffae00' : '#4b5563'} />}
              backgroundColor=""
              identity="favoriteTemplate"
              textColor=""
              onClick={handleButton}
              widthFitContent
              heightFitContent
              heightVw
              value={el.id}
            />
          ),
          _blankEdit_smallColumn: (
            <Button
              buttonIcon={<EditIcon />}
              backgroundColor=""
              identity="editTemplate"
              textColor=""
              onClick={handleButton}
              widthFitContent
              heightFitContent
              value={el.id}
            />
          ),
          name: el.name,
          category: el.category.category,
          created_by: `${el.user.name}${el.user.username ? ` - ${el.user.username}` : ''}`,
          created_date: new Date(el.created_at).toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
          _blankPublished: (
            <Button
              backgroundColor={el.published ? '#00A78B' : '#FFF'}
              identity="publish"
              onClick={handleButton}
              textColor={el.published ? '#FFF' : '#00A78B'}
              buttonText={el.published ? 'Published' : 'Publish'}
              border={el.published ? undefined : 0.052083}
              borderColor="#00A78B"
              borderRadius={3}
              width={7.4}
              value={el.id}
            />
          ),
          _blankUnpublished: (
            <Button
              backgroundColor={!el.published ? '#00A78B' : '#FFF'}
              identity="unpublish"
              onClick={handleButton}
              textColor={!el.published ? '#FFF' : '#00A78B'}
              buttonText={!el.published ? 'Unpublished' : 'Unpublish'}
              border={el.published ? 0.052083 : undefined}
              borderColor="#00A78B"
              borderRadius={3}
              width={7.4}
              value={el.id}
            />
          ),
        })),
      );
    } else {
      setTableData([
        {
          id: '',
          _blankFavorite_smallColumn: '',
          _blankEdit_smallColumn: '',
          name: '',
          category: '',
          created_by: '',
          created_date: '',
          _blankPublished: '',
          _blankUnpublished: '',
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData]);

  // handle button

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'createTemplate') {
      openCreateEmailView();
    }

    if (identity === 'publish' || identity === 'unpublish') {
      const formData = new FormData();

      formData.append('status', `${identity === 'publish' ? '1' : '0'}`);

      const apiUrl = `/api/settings/emailTemplate/templatePublish/${value}`;

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
    }

    if (identity === 'editTemplate') {
      setLoadingTemplate(true);

      getSingleEmailTemplate(value).finally(() => setLoadingTemplate(false));

      openCreateEmailView();
    }

    if (identity === 'editLetter') {
      openEditLetterhead();
    }

    if (identity === 'favoriteTemplate') {
      const formData = new FormData();

      formData.append('favorite', '1');

      const apiUrl = `/api/email/favoriteTemplate/${value}`;

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
    }
  };

  // inputs handling
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.currentTarget;

    if (e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;

      setInputs((prevState) => ({
        ...prevState,
        [name]: checked ? '1' : undefined,
      }));
    }
  };

  // handle select

  const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;

    name === 'Dealer' &&
      setInputs((prevState) => ({
        ...prevState,
        dealer: value,
        system: undefined,
      }));

    name === 'System' &&
      setInputs((prevState) => ({
        ...prevState,
        dealer: undefined,
        system: value,
      }));

    name === 'Select all' &&
      setInputs((prevState) => ({
        ...prevState,
        dealer: undefined,
        system: undefined,
      }));

    setIconedSelectText(name);
  };

  // handle inputs and buttons
  const dataInfo1 = [
    {
      key: 1,
      backgroundColor: '#FFF',
      buttonText: 'Edit letterhead',
      height: 3.703704,
      width: 7.5,
      identity: 'editLetter',
      border: 0.052083,
      textColor: '#00A78B',
      onClick: handleButton,
    },
    {
      key: 2,
      paragraph: 'Show',
    },
    {
      key: 3,
      name: 'all',
      value: inputs.all,
      width: 0,
      label: '',
      type: 'checkbox',
      textAlterColor: '#00A78B',
      chekcboxText: 'All',
      onChange: handleChange,
    },
    {
      key: 4,
      name: 'draft',
      value: inputs.draft,
      width: 0,
      label: '',
      type: 'checkbox',
      textAlterColor: '#00A78B',
      chekcboxText: 'Draft',
      onChange: handleChange,
    },
    {
      key: 5,
      name: 'published',
      value: inputs.published,
      width: 0,
      label: '',
      type: 'checkbox',
      textAlterColor: '#00A78B',
      chekcboxText: 'Published',
      onChange: handleChange,
    },
  ];

  // select options

  const options = [
    {
      value: '1',
      icon: null,
      name: 'Select all',
    },
    {
      value: '2',
      icon: null,
      name: 'Dealer',
    },
    {
      value: '3',
      icon: null,
      name: 'System',
    },
  ];

  // handle filter
  const applyFilter = () => {
    let filteredData = emailTemplates;

    if (inputs.published && filteredData) {
      filteredData = filteredData.filter((el) => el.published === true);
    }

    if (inputs.draft && filteredData) {
      filteredData = filteredData.filter((el) => el.published === false);
    }

    if (inputs.dealer && filteredData) {
      filteredData = filteredData.filter((el) => el.category.id === 3);
    }

    if (inputs.system && filteredData) {
      filteredData = filteredData.filter((el) => el.category.id === 2);
    }

    setFilteredData(filteredData);
  };

  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  return (
    <ModalContent>
      <BorderedContent title="Email Templates" positionRelative loading={loading || loadingFetch}>
        <section className="w-full flex flex-row justify-between items-baseline mb-[4vh] max-lg:flex-col max-lg:items-start max-lg:gap-2">
          <ContentRow cols={5} gap={4} marginTop={3}>
            {dataInfo1.map((el) =>
              el.onClick ? (
                <Button
                  key={el.key}
                  backgroundColor={el.backgroundColor}
                  buttonText={el.buttonText}
                  height={el.height}
                  width={el.width}
                  identity={el.identity}
                  border={el.border}
                  textColor={el.textColor}
                  onClick={el.onClick}
                  borderColor={el.textColor}
                />
              ) : el.onChange ? (
                <Input
                  key={el.key}
                  label={el.label}
                  name={el.name}
                  type={el.type}
                  width={el.width}
                  customCheckbox
                  value={el.value}
                  chekcboxText={el.chekcboxText}
                  textAlterColor={el.textAlterColor}
                  onChange={el.onChange}
                  fieldErrors={fieldErrors}
                />
              ) : (
                el.paragraph && <Paragraph key={el.key}>{el.paragraph}</Paragraph>
              ),
            )}
          </ContentRow>
          <div className="">
            <IconedSelect
              height={4.074074}
              width={7.239583}
              iconTextGap={0}
              options={options}
              optionsBackgroundColor="#FFF"
              optionsHeight={3}
              optionsNameColor="#00A78B"
              optionsRadius={0.45}
              optionsWidth={8}
              optionsZIndex={300}
              backgroundColor="#43B5A1"
              borderRadius={0.9}
              defaultText={iconedSelectText}
              textColor="#FFF"
              onClick={handleSelect}
            />
          </div>
        </section>
        <ModalContent height={60} overflowY loading={loading || loadingFetch}>
          <Table tableData={tableData} />
        </ModalContent>
        <ButtonContainer marginTop={2} justify="right" widthFull>
          <Button
            buttonText="Create template"
            width={8.75}
            height={5.277778}
            backgroundColor="#00A78B"
            identity="createTemplate"
            textColor="#FFF"
            onClick={handleButton}
          />
        </ButtonContainer>
        <AnimatePresence>
          {createEmailView && <CreateEmailView loading={loadingTemplate} />}
        </AnimatePresence>
        <AnimatePresence>{editLetterhead && <EditLetterhead />}</AnimatePresence>
      </BorderedContent>
    </ModalContent>
  );
}
