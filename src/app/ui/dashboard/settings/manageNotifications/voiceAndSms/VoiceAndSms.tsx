import { adminDashboardStore, currentSectionStore } from '@/store/adminDashboard';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { useSession } from 'next-auth/react';
import { Input } from '&/inputs/Input';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { TagList } from '&/miscellaneous/tagList/TagList';
import { voiceAndSmsStore } from '@/store/notificationsSettings';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { ModalContent } from '@/app/ui/modalWindowsStructure/ModalContent';
import NumberAndRegistration from './NumbersAndRegistration/NumberAndRegistration';

export function VoiceAndSms() {
  const session = useSession();

  const userId = session.data?.user.id;

  // ----- global states -----

  const { notificationPreference } = adminDashboardStore();
  const { getNotificationsPreference } = adminDashboardStore();

  const { extractDigits, formatPhoneNumber } = phoneNumbersFormatStore();

  const { displayedName, forwardIncomingCalls, limitWarningRecipients, voiceAndEmailsData } =
    voiceAndSmsStore();
  const {
    getDisplayedName,
    getForwardIncomingCalls,
    getLimitWarningRecipients,
    deleteWarningRecipient,
    getVoiceAndEmailsData,
  } = voiceAndSmsStore();

  const { getCurrentSection } = currentSectionStore();

  const getDataPromises = useCallback(() => {
    return [
      getNotificationsPreference(),
      getDisplayedName(),
      getForwardIncomingCalls(),
      getLimitWarningRecipients(),
      getVoiceAndEmailsData(),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error } = useLoadingGetData(getDataPromises, [userId]);

  useEffect(() => {
    getCurrentSection('Notifications settings');
  }, [getCurrentSection]);

  // ----- local states -----

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const [items, setItems] = useState<{ id: number | undefined; name: string | undefined }[]>([]);

  // inputs
  const [inputs, setInputs] = useState<{
    userId: string;
    id: string;
    systemPhonePublishing: string;
    systemEmailPublishing: string;
    systemEmailPublishingVerified: string;
    forwardIncomingCalls: string;
    forwardIncomingCallsNumber: string;
    useDealershipPhoneNumber: string;
    disableAutoEmailsToCustomers: string;
    disableSendingAutoSmsOverMontlyLimit: string;
    customerConsentAutoSmsForBuyingVehiclesFromCustomers: string;
    customerConsentAutoSmsInSpanish: string;
    customerConsentAutoSmsIncludeDealershipAddress: string;
    address1: string;
    displayNameForEmailsSentToProspect: string;
    smsLimitWarningRecipiens: string;
    smsLimitRecipiens: string;
  }>({
    userId: '',
    id: '',
    address1: '',
    customerConsentAutoSmsForBuyingVehiclesFromCustomers: '',
    customerConsentAutoSmsIncludeDealershipAddress: '',
    customerConsentAutoSmsInSpanish: '',
    disableAutoEmailsToCustomers: '',
    disableSendingAutoSmsOverMontlyLimit: '',
    displayNameForEmailsSentToProspect: '1',
    smsLimitRecipiens: '',
    smsLimitWarningRecipiens: '',
    systemEmailPublishing: '',
    systemPhonePublishing: '',
    useDealershipPhoneNumber: '',
    forwardIncomingCalls: '1',
    forwardIncomingCallsNumber: '',
    systemEmailPublishingVerified: '',
  });

  useEffect(() => {
    if (limitWarningRecipients) {
      const newItems: { id: number | undefined; name: string | undefined }[] = [];
      limitWarningRecipients.map((el) => newItems.push({ id: el.id, name: el.recipient }));
      setItems(newItems);
    }
  }, [limitWarningRecipients]);

  useEffect(() => {
    if (voiceAndEmailsData) {
      voiceAndEmailsData.map((el) => {
        setInputs((prevState) => ({
          ...prevState,
          id: el.id ? el.id.toString() : '',
          systemPhonePublishing: el.system_phone_for_publishing
            ? el.system_phone_for_publishing
            : '',
          systemEmailPublishing: el.system_email_address_for_publishing
            ? el.system_email_address_for_publishing
            : '',
          systemEmailPublishingVerified: el.email_verfified ? '1' : '',
          forwardIncomingCallsNumber: el.forward_incoming_calls_to
            ? el.forward_incoming_calls_to
            : '',
          useDealershipPhoneNumber: el.dealership_phone_number ? '1' : '',
          disableAutoEmailsToCustomers: el.disable_auto_emails_to_customer ? '1' : '',
          disableSendingAutoSmsOverMontlyLimit: el.disable_sending_auto_sms_over_montly_limit
            ? '1'
            : '',
          customerConsentAutoSmsForBuyingVehiclesFromCustomers:
            el.for_buying_vehicles_from_customers ? '1' : '',
          customerConsentAutoSmsInSpanish: el.in_spanish ? '1' : '',
          customerConsentAutoSmsIncludeDealershipAddress: el.include_dealership_address ? '1' : '',
          displayNameForEmailsSentToProspect: el.email_name_displayed_id
            ? el.email_name_displayed_id.toString()
            : '1',
        }));
      });
    }
  }, [voiceAndEmailsData]);

  // inputs handling
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.currentTarget;

    // phone number handling

    if (name === 'systemPhonePublishing') {
      const val = extractDigits(value);

      setInputs((prevState) => ({
        ...prevState,
        systemPhonePublishing: val,
      }));

      return;
    }

    // handling checkboxes

    if (type === 'checkbox' && e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;

      if (checked) {
        setInputs((prevState) => ({
          ...prevState,
          [name]: '1',
        }));
      } else {
        setInputs((prevState) => ({
          ...prevState,
          [name]: '',
        }));
      }

      return;
    }

    // rest of inputs handling

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // buttons handling
  const handleBtns = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity, id } = e.currentTarget.dataset;

    if (identity === 'addRecipien') {
      const formData = new FormData();

      formData.append('smsLimitWarningRecipiens', inputs.smsLimitWarningRecipiens);

      const apiUrl = '/api/settings/voiceAndEmails/limitWarningRecipients';

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 48,
        options: {
          onSuccess: async () => {
            setInputs((prevState) => ({
              ...prevState,
              smsLimitWarningRecipiens: '',
            }));

            await getLimitWarningRecipients();
          },
        },
      });
    }

    if (identity === 'deleteWarningRecipients' && id) {
      await deleteWarningRecipient(id);
      await getLimitWarningRecipients();
    }

    if (identity === 'save') {
      // update data

      if (inputs.id) {
        const formData = new FormData();

        const ignore = ['userId', 'address1', 'smsLimitRecipiens', 'smsLimitWarningRecipiens'];

        for (const [name, value] of Object.entries(inputs)) {
          !ignore.includes(name) && formData.append(name, value);
        }

        const apiUrl = '/api/settings/voiceAndEmails';

        await makeAsyncFetch({ formData, apiUrl, method: 'PUT' });
      } else {
        // create data

        const formData = new FormData();

        const ignore = [
          'userId',
          'address1',
          'smsLimitRecipiens',
          'smsLimitWarningRecipiens',
          'id',
        ];

        for (const [name, value] of Object.entries(inputs)) {
          !ignore.includes(name) && formData.append(name, value);
        }

        const apiUrl = '/api/settings/voiceAndEmails';

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'POST',
          permissionForFetch: 48,
          options: {
            onSuccess: (data) => {
              if (data) {
                setInputs((prevState) => ({
                  ...prevState,
                  id: data,
                }));
              }
            },
          },
        });
      }
    }
  };

  // inputs and buttons data

  const dataInfo3 = [
    {
      key: 8,
      label: '',
      name: 'disableAutoEmailsToCustomers',
      value: inputs.disableAutoEmailsToCustomers,
      width: 0,
      type: 'checkbox',
      chekcboxText: 'Disable Auto Emails to Customers',
      onChange: handleChange,
    },
    {
      key: 9,
      label: '',
      name: 'disableSendingAutoSmsOverMontlyLimit',
      value: inputs.disableSendingAutoSmsOverMontlyLimit,
      width: 0,
      type: 'checkbox',
      chekcboxText: 'Disable Sending Auto SMS over montly limit',
      onChange: handleChange,
    },
  ];

  const dataInfo4 = [
    {
      key: 10,
      label: '',
      name: 'customerConsentAutoSmsForBuyingVehiclesFromCustomers',
      value: inputs.customerConsentAutoSmsForBuyingVehiclesFromCustomers,
      width: 0,
      type: 'checkbox',
      chekcboxText: 'For Buying Vehicles From Customers',
      onChange: handleChange,
    },
    {
      key: 11,
      label: '',
      name: 'customerConsentAutoSmsInSpanish',
      value: inputs.customerConsentAutoSmsInSpanish,
      width: 0,
      type: 'checkbox',
      chekcboxText: 'In Spanish',
      onChange: handleChange,
    },
    {
      key: 12,
      label: '',
      name: 'customerConsentAutoSmsIncludeDealershipAddress',
      value: inputs.customerConsentAutoSmsIncludeDealershipAddress,
      width: 0,
      type: 'checkbox',
      chekcboxText: 'Include Dealership Address',
      onChange: handleChange,
    },
  ];

  const dataInfo5 = [
    {
      key: 13,
      label: 'Display Name for Emails Sent to Prospect',
      name: 'displayNameForEmailsSentToProspect',
      value: inputs.displayNameForEmailsSentToProspect,
      width: 23.177083,
      type: 'select',
      options: displayedName?.map((el) => {
        return { value: el.id, option: el.name };
      }),
      onChange: handleChange,
    },
    {
      key: 14,
      label: 'SMS limit Warning Recipiens',
      name: 'smsLimitWarningRecipiens',
      value: inputs.smsLimitWarningRecipiens,
      width: 23.177083,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 15,
      isBtn: true,
      backgroundColor: '#00A78B',
      buttonText: 'Add',
      height: 5.277778,
      width: 9.84375,
      identity: 'addRecipien',
      textColor: '#FFF',
      onClick: handleBtns,
    },
  ];

  return (
    <ModalContent>
      <BorderedContent title="Voice and SMS" positionRelative loading={loading || loadingFetch}>
        <NumberAndRegistration inputs={inputs} setInputs={setInputs} />
        <p className="text-[1.9vh] text-[#999999] font-medium mt-[4vh]">
          Customer Consent Request Text for Auto SMS
        </p>
        <ContentRow cols={1} gap={5.925926} marginTop={2.777778}>
          {dataInfo3.map((el, index) => (
            <Input
              key={`${el.key}customerconsentauto${index - 946}`}
              label={el.label}
              name={el.name}
              type={el.type}
              width={el.width}
              value={el.value}
              customCheckbox
              chekcboxText={el.chekcboxText}
              onChange={el.onChange}
              fieldErrors={fieldErrors}
            />
          ))}
        </ContentRow>
        <HorizontalLine marginTop={4} />
        <ContentRow cols={3} gap={5} marginTop={4}>
          {dataInfo4.map((el, index) => (
            <Input
              key={`${el.key}secondcustomerconsent-${index + 12 * index}`}
              label={el.label}
              name={el.name}
              type={el.type}
              width={el.width}
              value={el.value}
              customCheckbox
              chekcboxText={el.chekcboxText}
              onChange={el.onChange}
              fieldErrors={fieldErrors}
            />
          ))}
        </ContentRow>
        <div className="mt-[2.7vh]">
          <TextAreaInput
            width={71.614583}
            height={18.425926}
            label=""
            value={inputs.address1}
            name="address1"
            onChange={handleChange}
            fieldErrors={fieldErrors}
          />
        </div>
        <ContentRow cols={3} gap={1.5} marginTop={2.777778}>
          {dataInfo5.map((el, index) =>
            el.isBtn ? (
              <Button
                key={`${el.key}thirdcustomerconsent)${index / (11 + index)}`}
                backgroundColor={el.backgroundColor}
                buttonText={el.buttonText}
                width={el.width}
                height={el.height}
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
                  options={el.options}
                  onChange={el.onChange}
                  fieldErrors={fieldErrors}
                />
              )
            ),
          )}
        </ContentRow>
        <div className="ml-[24vw] mt-[2.777778vh]">
          <TagList
            height={14.259259}
            width={47.395833}
            onClick={handleBtns}
            identity="deleteWarningRecipients"
            items={items}
          />
        </div>
      </BorderedContent>
      <ButtonContainer marginTop={2.777778} widthFull justify="right">
        <Button
          identity="save"
          buttonText="Save"
          backgroundColor="#00A78B"
          textColor="#FFF"
          width={8}
          disabled={loading || loadingFetch}
          onClick={handleBtns}
        />
      </ButtonContainer>
    </ModalContent>
  );
}
