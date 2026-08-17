import { useCallback, useEffect, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { useSession } from 'next-auth/react';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { Input } from '&/inputs/Input';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { adminDashboardStore, singleCLientDataStore } from '@/store/adminDashboard';
import { TagList } from '&/miscellaneous/tagList/TagList';
import { singleSmsTemplateStore } from '@/store/notificationsSettings';
import { useSocketStore } from '@/store/socketIo';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { smsTemplateStore } from '@/store/smsTemplate';

export function CreateSmsView({ closeWindow }: CloseWindow) {
  const session = useSession();

  const userId = session.data?.user.id;

  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData, clearSingleClientData } = singleCLientDataStore();

  const { replaceVariables, dataObject } = smsTemplateStore();

  const { updateDataWithSocket } = useSocketStore();

  const { smsTemplateCategory, smsTemplateVariables, clientsData } = adminDashboardStore();
  const { getSmsTemplateVariables, getClients } = adminDashboardStore();

  const { smsTemplate } = singleSmsTemplateStore();
  const { clearSmsTemplate } = singleSmsTemplateStore();

  const getDataPromises = useCallback(() => {
    return [getSmsTemplateVariables(), getClients()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error } = useLoadingGetData(getDataPromises);

  useEffect(() => {
    if (smsTemplate) {
      setAdderSelectText(smsTemplate.category.category);
      setInputs({
        category: smsTemplate.category.id.toString(),
        name: smsTemplate.name,
        template: smsTemplate.template,
      });
    }
  }, [smsTemplate]);

  // ----- local states -----

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [adderSelectText, setAdderSelectText] = useState('');
  const [templateVariable, setTemplateVariable] = useState('');
  const [preview, setPreview] = useState('');
  const [previewSms, setPreviewSms] = useState('');
  const [tagVariables, setTagVariables] = useState<
    { id: number | undefined; name: string | undefined }[]
  >([]);

  // inputs
  const [inputs, setInputs] = useState<{
    name: string;
    template: string;
    category: string;
  }>({
    name: '',
    template: '',
    category: '',
  });

  // handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity, buttonitemidentity, id } = e.currentTarget.dataset;

    if (identity === 'removeTag' && id) {
      setTagVariables((prevState) => tagVariables.filter((el) => el.id !== parseInt(id)));
      e.stopPropagation();
    }

    if (buttonitemidentity === 'addVariable' && id) {
      setInputs((prevState) => ({
        ...prevState,
        template: `${inputs.template}{${smsTemplateVariables
          ?.find((el) => el.id === parseInt(id))
          ?.category.category.toLowerCase()}.${smsTemplateVariables
          ?.find((el) => el.id === parseInt(id))
          ?.variable.toLowerCase()
          .split(' ')
          .join('_')}}`,
      }));
      e.stopPropagation();
    }

    if (identity === 'clearPreview') {
      setPreviewSms('');

      setPreview('');

      clearSingleClientData();
    }
  };

  // handle adder select click
  const handleSelectButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { identity, category } = e.currentTarget.dataset;

    if (identity === 'category') {
      setAdderSelectText(name);

      setInputs((prevState) => ({
        ...prevState,
        category: name,
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

    if (identity === 'preview' && inputs.template) {
      setLoadingPreview(true);

      await getSingleClientData(value);

      setPreview(name);

      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    if (singleCLientData) {
      const data = dataObject(singleCLientData);

      const previewTemplate = replaceVariables(inputs.template, data);

      setPreviewSms(previewTemplate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleCLientData]);

  const handleAdderSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'category') {
      setAdderSelectText(value);
    }

    if (name === 'variables') {
      setTemplateVariable(value);
    }

    if (name === 'preview') {
      setPreview(value);
    }
  };

  const handleBlurSelectInput = (e: React.FocusEvent<HTMLInputElement>) => {
    const data = smsTemplateCategory?.some((el) => {
      return el.category?.toLowerCase().trim() === adderSelectText.toLowerCase().trim();
    });

    !data && setAdderSelectText('');
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  // handle save btn
  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(inputs)) {
      value && formData.append(key, value);
    }

    const apiUrl = '/api/adminDashboard/smsTemplate';

    if (!smsTemplate) {
      userId && formData.append('userId', userId.toString());

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        options: {
          onSuccess: () => {
            updateDataWithSocket('smsTemplate');

            if (!smsTemplate) {
              setInputs({
                category: '',
                name: '',
                template: '',
              });
            }
          },
        },
      });
    } else {
      await makeAsyncFetch({
        formData,
        apiUrl: `${apiUrl}/${smsTemplate.id}`,
        method: 'PUT',
        options: {
          onSuccess: () => {
            updateDataWithSocket('smsTemplate');
          },
        },
      });
    }
  };

  return (
    <ModalWindow top={0} minSizeFull positionFixed>
      <ModalContainer width={50} marginTop={15}>
        <ModalContainerTitle
          closeWindowFunction={() => {
            clearSmsTemplate();
            clearSingleClientData();
            closeWindow(false);
          }}
          title={smsTemplate?.id ? 'Edit Sms Template' : 'Create Sms Template'}
        />
        <ModalContent loading={loading || loadingFetch || loadingPreview} minHeight={66}>
          <ContentRow cols={2} gap={5}>
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
            marginTop={2}
            value={previewSms ? previewSms : inputs.template}
            onChange={handleChange}
            fieldErrors={fieldErrors}
          />
          <ButtonContainer marginTop={2} widthFull justify="space-between" alignContentEnd>
            <aside className="w-[18vw] flex flex-row justify-between items-end max-lg:w-full max-lg:flex-col max-lg:items-stretch max-lg:gap-2">
              <AdderSelect
                width={10}
                iconTextGap={0}
                optionsWidth={10}
                optionsRadius={0.045}
                optionsHeight={5}
                optionsBottom={6}
                optionsBackgroundColor="#FFF"
                optionsNameColor="#00A78B"
                value={preview}
                label="Preview"
                name="preview"
                options={clientsData?.map((el) => {
                  return {
                    value: el.id?.toString(),
                    name: `${el.first_name || ''} ${el.last_name || ''}`,
                    identity: 'preview',
                  };
                })}
                onChange={handleAdderSelectChange}
                onClick={handleSelectButton}
                onBlur={handleBlurSelectInput}
                fieldErrors={fieldErrors}
              />
              {previewSms && (
                <Button
                  buttonText="Clear"
                  width={6}
                  height={5.277778}
                  backgroundColor="#6b7280"
                  identity="clearPreview"
                  textColor="#FFF"
                  disabled={loading || loadingFetch || loadingPreview}
                  onClick={handleButton}
                />
              )}
            </aside>
            <Button
              buttonText="Save"
              width={6}
              height={5.277778}
              backgroundColor="#00A78B"
              identity="save"
              textColor="#FFF"
              disabled={loading || loadingFetch || loadingPreview}
              onClick={handleSave}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
