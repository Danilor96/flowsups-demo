import { useCallback, useEffect, useState } from 'react';
import { SmsTemplates } from '@/app/libs/definitions';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '&/inputs/Input';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { IconedSelect } from '@/app/ui/select/iconedSelect/IconedSelect';
import { Table } from '&/table/Table';
import { CreateSmsView } from '&/dashboard/settings/manageNotifications/smsTemplate/createSmsView/CreateSmsView';
import { EditIcon, FavoriteIcon } from '&/icons/Icons';
import { AnimatePresence } from 'framer-motion';
import { adminDashboardStore } from '@/store/adminDashboard';
import { singleSmsTemplateStore } from '@/store/notificationsSettings';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { useLoadingGetData } from '@/hooks/loadingGetData';

export function SmsTemplate() {
  // ----- global states -----

  const { smsTemplateCategory, smsTemplates } = adminDashboardStore();
  const { getSmsTemplateCategory, getSmsTemplates } = adminDashboardStore();

  const { getSingleSmsTemplate } = singleSmsTemplateStore();

  const { updateDataWithSocket } = useSocketStore();

  const getPromisesData = useCallback(() => {
    return [getSmsTemplateCategory(), getSmsTemplates()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error } = useLoadingGetData(getPromisesData);

  // ----- local states -----
  const [openCreateView, setOpenCreateView] = useState<boolean>(false);
  const [iconedSelectText, setIconedSelectText] = useState<string>('Category');
  const [filteredData, setFilteredData] = useState<SmsTemplates>(undefined);

  useEffect(() => {
    if (smsTemplates && smsTemplates.length > 0) {
      const dataSorted = smsTemplates.sort((a, b) => {
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
  }, [smsTemplates]);

  // inputs
  const [inputs, setInputs] = useState<{
    all: string | undefined;
    draft: string | undefined;
    published: string | undefined;
    dealer: string | undefined;
    system: string | undefined;
  }>({
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
      _blankFavorite_template: '',
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
      let newData: any[] = [];

      filteredData.map((el) => {
        newData.push({
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
          created_date: new Date(el.creted_date).toLocaleString('en-US', {
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
              disabled={el.published ? true : false}
              disabledSameColor
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
              disabled={el.published ? false : true}
              disabledSameColor
              width={7.4}
              value={el.id}
            />
          ),
        });
      });

      setTableData(newData);
    } else {
      setTableData([
        {
          id: '',
          _blankFavorite_template: '',
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

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  // handle button
  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'createTemplate') {
      setOpenCreateView(true);
    }

    if (identity === 'publish' || identity === 'unpublish') {
      const formData = new FormData();

      formData.append('status', `${identity === 'publish' ? '1' : '0'}`);

      const apiUrl = `/api/message/templateStatus/${value}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 52,
        options: {
          onSuccess: () => {
            updateDataWithSocket('smsTemplate');
          },
        },
      });
    }

    if (identity === 'editTemplate') {
      getSingleSmsTemplate(smsTemplates?.find((el) => el?.id === parseInt(value)));
      setOpenCreateView(true);
    }

    if (identity === 'favoriteTemplate') {
      const formData = new FormData();

      formData.append('favorite', '1');

      const apiUrl = `/api/message/favoriteTemplate/${value}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 52,
        options: {
          onSuccess: () => {
            updateDataWithSocket('smsTemplate');
          },
        },
      });
    }
  };

  // inputs handling
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    name === 'All' &&
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
      paragraph: 'Show',
    },
    {
      key: 2,
      name: 'all',
      value: inputs.all,
      width: 0,
      label: '',
      type: 'checkbox',
      textAlterColor: '#00A78B',
      chekcboxText: 'All',
      fontSize: 2,
      onChange: handleChange,
    },
    {
      key: 3,
      name: 'draft',
      value: inputs.draft,
      width: 0,
      label: '',
      type: 'checkbox',
      textAlterColor: '#00A78B',
      chekcboxText: 'Draft',
      fontSize: 2,
      onChange: handleChange,
    },
    {
      key: 4,
      name: 'published',
      value: inputs.published,
      width: 0,
      label: '',
      type: 'checkbox',
      textAlterColor: '#00A78B',
      chekcboxText: 'Published',
      fontSize: 2,
      onChange: handleChange,
    },
  ];

  // select options
  const options = smsTemplateCategory?.map((el) => {
    return { value: el.id?.toString(), name: el.category };
  });

  // handle filter
  const applyFilter = () => {
    let filteredData = smsTemplates;

    if (inputs.published && filteredData) {
      filteredData = filteredData.filter((el) => el.published === true);
    }

    if (inputs.draft && filteredData) {
      filteredData = filteredData.filter((el) => el.published === false);
    }

    if (inputs.dealer && filteredData) {
      filteredData = filteredData.filter((el) => el.category.id === 2);
    }

    if (inputs.system && filteredData) {
      filteredData = filteredData.filter((el) => el.category.id === 3);
    }

    setFilteredData(filteredData);
  };

  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  return (
    <ModalContent>
      <BorderedContent title="Sms Templates" positionRelative loading={loading || loadingFetch}>
        <section className="w-full flex flex-row justify-between items-baseline mb-[4vh] max-lg:flex-col max-lg:items-start max-lg:gap-2">
          <ContentRow cols={5} gap={4} marginTop={3} alignItems="center">
            {dataInfo1.map((el, index) =>
              el.onChange ? (
                <Input
                  key={`${el.key}----smstemplate111-${index - 9}`}
                  label={el.label}
                  name={el.name}
                  type={el.type}
                  width={el.width}
                  value={el.value}
                  chekcboxText={el.chekcboxText}
                  customCheckbox
                  textAlterColor={el.textAlterColor}
                  onChange={el.onChange}
                  fontSize={el.fontSize}
                  fieldErrors={fieldErrors}
                />
              ) : (
                el.paragraph && (
                  <Paragraph key={el.key} fontSize={2}>
                    {el.paragraph}
                  </Paragraph>
                )
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
        <ModalContent height={60} overflowY>
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
          {openCreateView && <CreateSmsView closeWindow={setOpenCreateView} />}
        </AnimatePresence>
      </BorderedContent>
    </ModalContent>
  );
}
