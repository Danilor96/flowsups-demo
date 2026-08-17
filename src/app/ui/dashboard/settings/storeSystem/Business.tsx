import { useCallback, useEffect, useState } from 'react';
import { adminDashboardStore, currentSectionStore, modalWindowStore } from '@/store/adminDashboard';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { Input } from '&/inputs/Input';
import { ImageInput } from '&/inputs/ImageInput';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { TagList } from '&/miscellaneous/tagList/TagList';
import { motion } from 'framer-motion';
import AddressInput, { InputsAddresType } from '@/app/ui/inputs/AddressInput';
import { SalesGoalsConfig } from '@/app/libs/definitions';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { Can } from '@/app/ui/auth/Can';

export function Business() {
  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();

  const { closeBusinessInfo } = modalWindowStore();

  const { business, businessWebsites, businessVehicleUrl, businessPrimaryUrl } =
    adminDashboardStore();
  const { getBusiness, getBusinessWebsites, getBusinessVehicleUrl, getBusinessPrimaryUrl } =
    adminDashboardStore();
  const [getReminderTime, reminderTime] = adminDashboardStore((state) => [
    state.getReminderTime,
    state.reminderTime,
  ]);
  const { getCurrentSection } = currentSectionStore();

  const getPromiseData = useCallback(() => {
    return [getBusiness(), getBusinessWebsites(), getBusinessVehicleUrl(), getBusinessPrimaryUrl()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData);

  useEffect(() => {
    getCurrentSection('Business');
    if (!reminderTime || reminderTime?.length === 0) {
      getReminderTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getReminderTime]);

  // ----- local states -----

  // input values
  const [inputs, setInputs] = useState<{
    storeId: string | undefined;
    storeLicense: string | undefined;
    storeAlias: string | undefined;
    salesTax: string | undefined;
    einNumber: string | undefined;
    faxNumber: string | undefined;
    email: string | undefined;
    maillingAddress: string | undefined;
    county: string | undefined;
    countyCode: string | undefined;
    website: string | undefined;
    vehicleDetailPageUrl: string | undefined;
    primaryDealerWebsiteUrl: string | undefined;
    image: File | string | undefined;
    storeName: string | undefined;
    imagePath: string | undefined;
  }>({
    county: undefined,
    countyCode: undefined,
    einNumber: undefined,
    email: undefined,
    faxNumber: undefined,
    maillingAddress: undefined,
    salesTax: undefined,
    storeAlias: undefined,
    storeId: undefined,
    storeLicense: undefined,
    image: undefined,
    storeName: undefined,
    primaryDealerWebsiteUrl: undefined,
    vehicleDetailPageUrl: undefined,
    website: undefined,
    imagePath: undefined,
  });
  const [inputsMaillingAddress, setInputsMaillingAddress] = useState<InputsAddresType>({
    currentAddress: '',
    street: '',
    city: '',
    state: '',
    stateId: null,
    zip: '',
    county: '',
  });

  const [reminderSettings, setReminderSettings] = useState({
    defaultAppointmentReminder: '1',
    defaultTaskReminder: '1',
  });

  const [salesGoalsInputs, setSalesGoalsInputs] = useState<SalesGoalsConfig>({
    monthlySalesGoal: null,
    dailySalesPointsTarget: null,
    emailsSentNumber: null,
    smssSentNumber: null,
    callsMadeNumber: null,
    appointmentsCompletedNumber: null,
    appointmentsMadeNumber: null,
    soldCustomersNumber: null,
  });

  useEffect(() => {
    if (businessPrimaryUrl && businessPrimaryUrl.id) {
      setInputs((prevState) => ({
        ...prevState,
        primaryDealerWebsiteUrl: businessPrimaryUrl.url,
      }));
    }
  }, [businessPrimaryUrl]);

  useEffect(() => {
    if (business && business.id) {
      setInputs((prevState) => ({
        ...prevState,
        county: business.county,
        countyCode: business.county_code,
        einNumber: business.ein_number,
        email: business.email,
        faxNumber: business.fax_number,
        maillingAddress: '',
        salesTax: business.sales_tax_license,
        storeAlias: business.store_alias || '',
        storeId: business.store_id,
        storeLicense: business.store_license_number,
        image: business.image,
        storeName: business.name,
        imagePath: business.image,
      }));

      setIsSameAsPhysical(business.is_Mailing_Address_Same_As_Physical);
      setReminderSettings({
        defaultAppointmentReminder: business.appointment_reminder_time_id?.toString() || '1',
        defaultTaskReminder: business.task_reminder_time_id?.toString() || '1',
      });
      if (business.mailing_address) {
        setInputsMaillingAddress({
          currentAddress: business.mailing_address.full_address,
          street: business.mailing_address.street,
          city: business.mailing_address.city,
          state: business.mailing_address.full_address.split(',')[2]?.trim(),
          stateId: business.mailing_address.state_id,
          zip: business.mailing_address.zip,
          county: business.mailing_address.county,
        });
      }
      if (business.salesGoalsConfig) {
        setSalesGoalsInputs({
          monthlySalesGoal: business.salesGoalsConfig.monthlySalesGoal || null,
          dailySalesPointsTarget: business.salesGoalsConfig.dailySalesPointsTarget || null,
          emailsSentNumber: business.salesGoalsConfig.emailsSentNumber || null,
          smssSentNumber: business.salesGoalsConfig.smssSentNumber || null,
          callsMadeNumber: business.salesGoalsConfig.callsMadeNumber || null,
          appointmentsCompletedNumber:
            business.salesGoalsConfig.appointmentsCompletedNumber || null,
          appointmentsMadeNumber: business.salesGoalsConfig.appointmentsMadeNumber || null,
          soldCustomersNumber: business.salesGoalsConfig.soldCustomersNumber || null,
        });
      }
    }
  }, [business]);

  const [localImageUploaded, setLocalImageUploaded] = useState<any>(undefined);
  const [isSameAsPhysical, setIsSameAsPhysical] = useState(false);

  //   handling inputs states
  const handleInputsChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    const { name, value } = e.currentTarget;

    // handling upload images
    if (name === 'image' && e.currentTarget instanceof HTMLInputElement) {
      const localImagePath = e.currentTarget.files && e.currentTarget.files[0];

      const businessImg =
        e.currentTarget.files && e.currentTarget.files[0] ? e.currentTarget.files[0] : undefined;

      businessImg &&
        setInputs((prevState) => ({
          ...prevState,
          image: businessImg,
        }));

      if (localImagePath) {
        const reader = new FileReader();

        reader.onload = (e) => {
          e.target && e.target.result && setLocalImageUploaded(e.target?.result);
        };

        reader.readAsDataURL(localImagePath);
      }
      //   handling phone number
    } else if (name === 'countryCode' && e.currentTarget instanceof HTMLButtonElement) {
      const { opt } = e.currentTarget.dataset;

      setInputs((prevInputs) => ({ ...prevInputs, [name]: opt }));
    } else {
      setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    }
  };

  const handleSalesGoalsInputsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { value, name } = e.target;
    if (value === '') {
      return setSalesGoalsInputs((prevInputs) => ({ ...prevInputs, [name]: null }));
    }
    const valuesIsNumber = !isNaN(Number(value));
    if (!valuesIsNumber) return;
    const valueStringToNumber = Number(value);
    setSalesGoalsInputs((prevInputs) => ({ ...prevInputs, [name]: valueStringToNumber }));
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButtons = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity, id } = e.currentTarget.dataset;

    if (identity === 'save') {
      const formData = new FormData();

      const inputArray = [
        'county',
        'countyCode',
        'einNumber',
        'email',
        'faxNumber',
        'salesTax',
        'storeAlias',
        'storeId',
        'storeLicense',
        'image',
        'storeName',
      ];

      for (const [name, value] of Object.entries(inputs)) {
        if (inputArray.includes(name)) {
          if (value) {
            formData.append(name, value);
          }
        }
      }
      for (const [name, value] of Object.entries(inputsMaillingAddress)) {
        if (value) {
          formData.append(name, value || '');
        }
      }

      for (const [name, value] of Object.entries(salesGoalsInputs)) {
        if (value) {
          formData.append(name, value.toString());
        }
      }

      formData.append('isMailingAddressSameAsPhysical', isSameAsPhysical.toString());
      formData.append('defaultAppointmentReminderId', reminderSettings.defaultAppointmentReminder);
      formData.append('defaultTaskReminderId', reminderSettings.defaultTaskReminder);

      // create new business
      if (!business) {
        const apiUrl = '/api/adminDashboard/business';

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'POST',
          permissionForFetch: 46,
          options: {
            onSuccess: () => {
              updateDataWithSocket('business');
            },
          },
        });
      } else {
        // edit current business
        formData.append('imagePath', inputs.imagePath || '');

        const apiUrl = `/api/adminDashboard/business/${business.id}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'PUT',
          permissionForFetch: 46,
          options: {
            onSuccess: () => {
              updateDataWithSocket('business');
            },
          },
        });
      }
    }

    if (identity === 'website') {
      const formData = new FormData();

      formData.append('website', inputs.website || '');

      const apiUrl = 'api/adminDashboard/website';

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 46,
        options: {
          onSuccess: () => {
            updateDataWithSocket('businessWebsite');

            setInputs((prevState) => ({
              ...prevState,
              website: '',
            }));
          },
        },
      });
    }

    if (identity === 'websiteTags') {
      const apiUrl = `api/adminDashboard/website/${id}`;

      await makeAsyncFetch({
        apiUrl,
        method: 'DELETE',
        permissionForFetch: 46,
        options: {
          onSuccess: () => {
            updateDataWithSocket('businessWebsite');
          },
        },
      });
    }

    if (identity === 'vehicleDetail') {
      const formData = new FormData();

      formData.append('vehicleDetailPageUrl', inputs.vehicleDetailPageUrl || '');

      const apiUrl = '/api/adminDashboard/vehicleDetailPageUrl';

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 46,
        options: {
          onSuccess: () => {
            updateDataWithSocket('businessVehicleDetailPageUrl');

            setInputs((prevState) => ({
              ...prevState,
              vehicleDetailPageUrl: '',
            }));
          },
        },
      });
    }

    if (identity === 'vehicleUrl') {
      const apiUrl = `api/adminDashboard/vehicleDetailPageUrl/${id}`;

      await makeAsyncFetch({
        apiUrl,
        method: 'DELETE',
        permissionForFetch: 46,
        options: {
          onSuccess: () => {
            updateDataWithSocket('businessVehicleDetailPageUrl');
          },
        },
      });
    }

    if (identity === 'primaryDealerWebsiteUrl') {
      const formData = new FormData();

      // update/delete the primary website url
      if (businessPrimaryUrl && businessPrimaryUrl.id) {
        const primaryUrlInput = inputs.primaryDealerWebsiteUrl;

        formData.append('primaryDealerWebsiteUrl', primaryUrlInput || '');

        const apiUrl = `/api/adminDashboard/primaryDealerWebsiteUrl/${businessPrimaryUrl.id}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: primaryUrlInput ? 'PUT' : 'DELETE',
          permissionForFetch: 46,
          options: {
            onSuccess: () => {
              updateDataWithSocket('businessPrimaryUrl');
            },
          },
        });
      } else {
        // create the primary website url

        formData.append('primaryDealerWebsiteUrl', inputs.primaryDealerWebsiteUrl || '');

        const apiUrl = '/api/adminDashboard/primaryDealerWebsiteUrl';

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'POST',
          permissionForFetch: 46,
          options: {
            onSuccess: () => {
              updateDataWithSocket('businessPrimaryUrl');
            },
          },
        });
      }
    }
  };

  const inputsData1 = [
    {
      key: 1,
      label: 'Store ID',
      name: 'storeId',
      value: inputs.storeId,
      width: 23.177083,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 2,
      label: 'Store License Number',
      name: 'storeLicense',
      value: inputs.storeLicense,
      width: 23.177083,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 3,
      label: 'Store Alias',
      name: 'storeAlias',
      value: inputs.storeAlias,
      width: 23.177083,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 4,
      label: 'Sales Tax License',
      name: 'salesTax',
      value: inputs.salesTax,
      width: 23.177083,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 5,
      label: 'EIN Number',
      name: 'einNumber',
      value: inputs.einNumber,
      width: 23.177083,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 6,
      label: 'Fax number',
      name: 'faxNumber',
      value: inputs.faxNumber,
      width: 23.177083,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 7,
      label: 'Email',
      name: 'email',
      value: inputs.email,
      width: 23.177083,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 8,
      label: 'Mailling Address',
      name: 'maillingAddress',
      value: inputs.maillingAddress,
      width: 23.177083,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 9,
      label: 'County',
      name: 'county',
      value: inputs.county,
      width: 23.177083,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 10,
      label: 'County Code',
      name: 'countyCode',
      value: inputs.countyCode,
      width: 23.177083,
      type: 'text',
      onChange: handleInputsChange,
    },
  ];

  const inputsData2 = [
    {
      key: 11,
      label: 'Websites',
      name: 'website',
      value: inputs.website,
      width: 15.833333,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 12,
      isBtn: true,
      backgroundColor: '#00A78B',
      buttonText: 'Add',
      height: 5.277778,
      width: 6.25,
      identity: 'website',
      textColor: '#FFF',
      onClick: handleButtons,
    },
    {
      key: 13,
      label: 'Vehicle Detail Page URL',
      name: 'vehicleDetailPageUrl',
      value: inputs.vehicleDetailPageUrl,
      width: 15.833333,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 14,
      isBtn: true,
      backgroundColor: '#00A78B',
      buttonText: 'Insert',
      height: 5.277778,
      width: 6.25,
      identity: 'vehicleDetail',
      textColor: '#FFF',
      onClick: handleButtons,
    },
    {
      key: 15,
      label: 'Primary Dealer Website URL',
      name: 'primaryDealerWebsiteUrl',
      value: inputs.primaryDealerWebsiteUrl,
      width: 15.833333,
      type: 'text',
      onChange: handleInputsChange,
    },
    {
      key: 16,
      isBtn: true,
      backgroundColor: '#00A78B',
      buttonText: 'Save',
      height: 5.277778,
      width: 6.25,
      identity: 'primaryDealerWebsiteUrl',
      textColor: '#FFF',
      onClick: handleButtons,
    },
  ];

  let remiderTimeOptions = reminderTime?.map((el) => ({ value: el.id, option: el.time }));
  remiderTimeOptions =
    remiderTimeOptions?.length === 0 ? [{ value: 1, option: 'None' }] : remiderTimeOptions;

  return (
    <ModalWindow top={0}>
      <ModalContainer width={82.916667} marginTop={7}>
        <ModalContainerTitle title="Business Info" closeWindowFunction={closeBusinessInfo} />
        <ModalContent loading={loading || loadingFetch}>
          <BorderedContent title="Store Settings">
            <div className="flex flex-row w-full pr-[1.5vw] max-lg:flex-col max-lg:pr-0">
              <ContentRow cols={2} gap={2.777778}>
                {inputsData1.slice(0, 6).map((el) => (
                  <Input
                    key={el.key}
                    label={el.label}
                    name={el.name}
                    type={el.type}
                    width={el.width}
                    value={el.value}
                    onChange={el.onChange}
                    fieldErrors={fieldErrors}
                  />
                ))}
                <div className="h-full flex items-start">
                  <Input
                    key={inputsData1[6]?.key}
                    label={inputsData1[6]?.label}
                    name={inputsData1[6]?.name}
                    type={inputsData1[6]?.type}
                    width={inputsData1[6]?.width}
                    value={inputsData1[6]?.value}
                    onChange={handleInputsChange}
                    fieldErrors={fieldErrors}
                  />
                </div>
                <ContentRow cols={1} gap={2.777778} widthFull>
                  <div className="w-full">
                    {/* <Input
                      key={inputsData1[7]?.key}
                      label={inputsData1[7]?.label}
                      name={inputsData1[7]?.name}
                      type={inputsData1[7]?.type}
                      width={inputsData1[7]?.width}
                      value={inputsData1[7]?.value}
                      onChange={handleInputsChange}
                      fieldErrors={fieldErrors}
                    /> */}
                    <AddressInput
                      label="Mailling Address"
                      inputsAddress={inputsMaillingAddress}
                      fieldErrors={{
                        ...fieldErrors,
                        current_address: fieldErrors?.maillingAddress
                          ? fieldErrors?.maillingAddress
                          : [''],
                      }}
                      setInputsAddress={setInputsMaillingAddress}
                    />
                    <div className="flex items-center mt-1">
                      <input
                        type="checkbox"
                        id="sameAsPhysical"
                        name="sameAsPhysical"
                        checked={isSameAsPhysical}
                        onChange={(e) => setIsSameAsPhysical(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="sameAsPhysical" className="ml-2 block text-sm text-gray-400">
                        {`Same physical address.`}
                      </label>
                    </div>
                  </div>
                </ContentRow>
                {inputsData1.slice(8).map((el) => (
                  <Input
                    key={el.key}
                    label={el.label}
                    name={el.name}
                    type={el.type}
                    width={el.width}
                    value={el.value}
                    onChange={el.onChange}
                    fieldErrors={fieldErrors}
                  />
                ))}
              </ContentRow>
              <article className="flex flex-col w-full">
                <aside className="relative flex flex-col justify-center items-center gap-[2vh] h-[49%] pb-[2vh] w-full ml-[1.5vw] mt-[4vh] rounded-[0.520833vw] bg-[#F4F4F4] max-lg:ml-0 max-lg:mt-4 max-lg:h-auto max-lg:py-4 max-lg:px-4">
                  <ImageInput
                    name="image"
                    width={7.552083}
                    height={13.425926}
                    radius={1.041667}
                    localImageUploaded={localImageUploaded}
                    onChange={handleInputsChange}
                    path={typeof inputs.image === 'string' ? inputs.image : undefined}
                  />
                  <input
                    type="text"
                    name="storeName"
                    id="storeName"
                    value={inputs.storeName}
                    onChange={handleInputsChange}
                    className="w-[7vw] text-[1.9vh] font-medium text-[#B3B3B3] bg-[#F4F4F4] outline-none border-b border-[#B3B3B3] max-lg:w-full max-lg:text-sm"
                    placeholder="Store name"
                  />
                  {fieldErrors?.storeName && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute bottom-[2.8vh] text-[1.666667vh] text-[#F00]"
                    >
                      {fieldErrors.storeName}
                    </motion.p>
                  )}
                  {fieldErrors?.image && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute bottom-[-2.2vh] text-[1.666667vh] text-[#F00]"
                    >
                      {fieldErrors.image}
                    </motion.p>
                  )}
                </aside>
              </article>
            </div>
            <div className="h-full mt-[4vh]">
              <h3 className="text-gray-500 font-semibold text-[2.1vh] mb-[2vh]">
                Default Reminders Settings
              </h3>
              <ContentRow cols={2} gap={2.777778} marginLeft={0.8}>
                <Input
                  type="select"
                  label="Default Appointment Reminder"
                  name="defaultAppointmentReminder"
                  value={reminderSettings.defaultAppointmentReminder}
                  onChange={(e) =>
                    setReminderSettings((prev) => ({
                      ...prev,
                      defaultAppointmentReminder: e.target.value,
                    }))
                  }
                  options={remiderTimeOptions}
                  width={23.177083}
                />
                <Input
                  type="select"
                  label="Default Task Reminder"
                  name="defaultTaskReminder"
                  value={reminderSettings.defaultTaskReminder}
                  onChange={(e) =>
                    setReminderSettings((prev) => ({
                      ...prev,
                      defaultTaskReminder: e.target.value,
                    }))
                  }
                  options={remiderTimeOptions}
                  width={23.177083}
                />
              </ContentRow>
            </div>
            <ButtonContainer
              marginTop={2}
              marginInline
              alignContentEnd
              justify="flex-end"
              widthFull
              heightFull
            >
              <Button
                backgroundColor="#00A78B"
                buttonText="Save"
                height={5.277778}
                width={6.25}
                identity="save"
                textColor="#FFF"
                onClick={handleButtons}
              />
            </ButtonContainer>
          </BorderedContent>
          <BorderedContent title="Websites" marginTop={2.777778}>
            <ContentRow cols={6} gap={2.777778}>
              {inputsData2.map((el) =>
                el.isBtn ? (
                  <Button
                    key={el.key}
                    backgroundColor={el.backgroundColor}
                    buttonText={el.buttonText}
                    height={el.height}
                    width={el.width}
                    identity={el.identity}
                    textColor={el.textColor}
                    onClick={el.onClick}
                  />
                ) : (
                  el.onChange && (
                    <Input
                      key={el.key}
                      label={el.label}
                      name={el.name}
                      type={el.type}
                      width={el.width}
                      value={el.value}
                      onChange={el.onChange}
                      fieldErrors={fieldErrors}
                      fieldErrorWidthMaxContent
                    />
                  )
                ),
              )}
            </ContentRow>
            <ContentRow cols={2} gap={2.777778} marginTop={2.777778}>
              <TagList
                height={8.796296}
                onClick={handleButtons}
                identity="websiteTags"
                width={23.177083}
                items={businessWebsites?.map((el) => {
                  return { id: el.id, name: el.website };
                })}
                rowGap={1}
              />
              <TagList
                height={8.796296}
                onClick={handleButtons}
                identity="vehicleUrl"
                width={47.395833}
                items={businessVehicleUrl?.map((el) => {
                  return { id: el.id, name: el.url };
                })}
                rowGap={1}
              />
            </ContentRow>
          </BorderedContent>
          <Can requiredPermission={47}>
            <BorderedContent title="Sales Goals" marginTop={2.777778}>
              <div className="flex flex-col gap-[2.77vh] w-[50%] pt-4 ml-4 max-lg:w-full max-lg:ml-0">
                <div className="flex flex-row gap-[2.777778vh] items-center justify-between max-lg:flex-col max-lg:items-stretch max-lg:gap-2">
                  <label
                    htmlFor="monthlySalesGoal"
                    className="w-fit font-medium text-gray-500 text-[1.8vh] max-lg:text-sm"
                  >
                    Monthly Sales Goal
                  </label>
                  <Input
                    label=""
                    name={'monthlySalesGoal'}
                    value={salesGoalsInputs.monthlySalesGoal?.toString() || ''}
                    onChange={handleSalesGoalsInputsChange}
                    type="text"
                    width={6}
                    fieldErrors={fieldErrors}
                  />
                </div>
                <div className="flex flex-row gap-[2.777778vh] items-center justify-between max-lg:flex-col max-lg:items-stretch max-lg:gap-2">
                  <label
                    htmlFor="dailySalesPointsTarget"
                    className="w-fit font-medium text-gray-500 text-[1.8vh] max-lg:text-sm"
                  >
                    Daily Sales Points Target
                  </label>
                  <Input
                    label=""
                    name={'dailySalesPointsTarget'}
                    value={salesGoalsInputs.dailySalesPointsTarget?.toString() || ''}
                    onChange={handleSalesGoalsInputsChange}
                    type="text"
                    width={6}
                    fieldErrors={fieldErrors}
                  />
                </div>
              </div>
              <div className="h-full mt-[4vh] pb-4">
                <h3 className="text-gray-500 font-semibold text-[2.1vh] mb-[2.1vh]">
                  Sales Point Definition
                </h3>
                <div className="w-[50%] flex flex-col gap-[2.77vh] ml-4 max-lg:w-full max-lg:ml-0">
                  <SalesPointInput
                    title="Emails Sent"
                    name="emailsSentNumber"
                    value={salesGoalsInputs.emailsSentNumber?.toString() || ''}
                    handleInputsChange={handleSalesGoalsInputsChange}
                    fieldErrors={fieldErrors}
                  />
                  <SalesPointInput
                    title="SMSs Sent"
                    name="smssSentNumber"
                    value={salesGoalsInputs.smssSentNumber?.toString() || ''}
                    handleInputsChange={handleSalesGoalsInputsChange}
                    fieldErrors={fieldErrors}
                  />
                  <SalesPointInput
                    title="Calls Made"
                    name="callsMadeNumber"
                    value={salesGoalsInputs.callsMadeNumber?.toString() || ''}
                    handleInputsChange={handleSalesGoalsInputsChange}
                    fieldErrors={fieldErrors}
                  />
                  <SalesPointInput
                    title="Appointments Completed"
                    name="appointmentsCompletedNumber"
                    value={salesGoalsInputs.appointmentsCompletedNumber?.toString() || ''}
                    handleInputsChange={handleSalesGoalsInputsChange}
                    fieldErrors={fieldErrors}
                  />
                  <SalesPointInput
                    title="Appointments Made"
                    name="appointmentsMadeNumber"
                    value={salesGoalsInputs.appointmentsMadeNumber?.toString() || ''}
                    handleInputsChange={handleSalesGoalsInputsChange}
                    fieldErrors={fieldErrors}
                  />
                  <SalesPointInput
                    title="Sold Customers"
                    name="soldCustomersNumber"
                    value={salesGoalsInputs.soldCustomersNumber?.toString() || ''}
                    handleInputsChange={handleSalesGoalsInputsChange}
                    fieldErrors={fieldErrors}
                  />
                </div>
              </div>
              <ButtonContainer
                marginTop={2}
                marginInline
                alignContentEnd
                justify="flex-end"
                widthFull
                heightFull
              >
                <Button
                  backgroundColor="#00A78B"
                  buttonText="Save"
                  height={5.277778}
                  width={6.25}
                  identity="save"
                  textColor="#FFF"
                  onClick={handleButtons}
                />
              </ButtonContainer>
            </BorderedContent>
          </Can>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}

interface SalesPointInputProps {
  name: string;
  title: string;
  value: string;
  handleInputsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fieldErrors: { [key: string]: [string | undefined] } | undefined;
}

const SalesPointInput = ({
  title,
  name,
  value,
  handleInputsChange,
  fieldErrors,
}: SalesPointInputProps) => {
  return (
    <div className="flex flex-row gap-[2.777778vh] items-center justify-between max-lg:flex-col max-lg:items-stretch max-lg:gap-2">
      <label htmlFor="pointsPerEmailSent" className="w-fit font-medium text-gray-500 text-[1.8vh] max-lg:text-sm">
        No. of <span className="font-bold">{title}</span> equal to 1 Sales Point
      </label>
      <Input
        label=""
        name={name}
        value={value}
        onChange={handleInputsChange}
        type="text"
        width={6}
        fieldErrors={fieldErrors}
      />
    </div>
  );
};
