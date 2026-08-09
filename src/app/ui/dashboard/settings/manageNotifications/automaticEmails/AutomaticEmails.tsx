import { useCallback, useEffect, useState } from 'react';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { Input } from '&/inputs/Input';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { adminDashboardStore, numberFormatterStore } from '@/store/adminDashboard';
import { RegularSearchableSelect } from '&/select/regularSearchableSelect/RegularSearchableSelect';
import { emailTemplateStore } from '@/store/emailTemplate';
import { ModalContent } from '@/app/ui/modalWindowsStructure/ModalContent';
import { useSocketStore } from '@/store/socketIo';

export function AutomaticEmails() {
  // ----- global states -----

  const { emailTemplates } = emailTemplateStore();
  const { getEmailTemplates } = emailTemplateStore();

  const { numberFormatter } = numberFormatterStore();

  const { automaticEmails, paymentTypes, disableSelectValues, clientStatusesData } =
    adminDashboardStore();

  const { getAutomaticEmails, getPaymentTypes, getDisableSelectValues, getClientStatuses } =
    adminDashboardStore();

  const { updateDataWithSocket } = useSocketStore();

  const getDataPromises = useCallback(() => {
    return [
      getAutomaticEmails(),
      getPaymentTypes(),
      getDisableSelectValues(),
      getClientStatuses(),
      getEmailTemplates(),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error } = useLoadingGetData(getDataPromises);

  const returnValue = (data: boolean) => {
    if (data) return '1';

    return '2';
  };

  useEffect(() => {
    if (automaticEmails && automaticEmails.id) {
      setInputs({
        id: automaticEmails.id.toString(),
        internetLeadAutoResponse: returnValue(automaticEmails.internet_lead_auto_response),
        appointmentReminder: returnValue(automaticEmails.appointment_reminder),
        appointmentReminderTiming: automaticEmails.appointment_reminder_days,
        appointmentScheduleOnSite: returnValue(automaticEmails.appointment_scheduled_on_site),
        appointmentScheduleOnline: returnValue(automaticEmails.appointment_scheduled_online),
        appointmentRescheduleOnSite: returnValue(automaticEmails.appointment_rescheduled_on_site),
        appointmentRescheduleOnline: returnValue(automaticEmails.appointment_rescheduled_online),
        soldDealsThankYou: returnValue(automaticEmails.sold_deals_thank_you),
        soldDealsThankYouTiming: automaticEmails.sold_deals_thank_you_days,
        sendImmediatelyForProspectIn: automaticEmails.customer_status_id.toString(),
        sendImmediatelyFor: automaticEmails.deposit_payment_receipt_send_immediately_id.toString(),
        vehiclePriceDrop: returnValue(automaticEmails.vehicle_price_drop),
        depositPaymentRecipient: returnValue(automaticEmails.deposit_payment_receipt),
        stipulationRequest: returnValue(automaticEmails.stipulation_request),
        appointmentReminderTemplate:
          automaticEmails.appointment_reminder_template_id?.toString() || '',
        appointmentRescheduleOnlineTemplate:
          automaticEmails.appointment_reschedule_online_template_id?.toString() || '',
        appointmentRescheduleOnSiteTemplate:
          automaticEmails.appointment_reschedule_on_site_template_id?.toString() || '',
        appointmentScheduleOnlineTemplate:
          automaticEmails.appointment_schedule_online_template_id?.toString() || '',
        appointmentScheduleOnSiteTemplate:
          automaticEmails.appointment_schedule_on_site_template_id?.toString() || '',
        depositPaymentRecipientTemplate:
          automaticEmails.deposit_payment_recipient_template_id?.toString() || '',
        internetLeadAutoResponseTemplate:
          automaticEmails.internet_lead_auto_response_template_id?.toString() || '',
        soldDealsThankYouTemplate:
          automaticEmails.sold_deals_thank_you_template_id?.toString() || '',
        stipulationRequestTemplate:
          automaticEmails.stipulation_request_template_id?.toString() || '',
        vehiclePriceDropTemplate: automaticEmails.vehicle_price_drop_template_id?.toString() || '',
      });
    }
  }, [automaticEmails]);

  // ----- local states -----

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  // inputs
  const [inputs, setInputs] = useState({
    id: '',
    appointmentReminder: '2',
    appointmentReminderTemplate: '',
    appointmentReminderTiming: '0',
    appointmentRescheduleOnline: '2',
    appointmentRescheduleOnlineTemplate: '',
    appointmentRescheduleOnSite: '2',
    appointmentRescheduleOnSiteTemplate: '',
    appointmentScheduleOnline: '2',
    appointmentScheduleOnlineTemplate: '',
    appointmentScheduleOnSite: '2',
    appointmentScheduleOnSiteTemplate: '',
    depositPaymentRecipient: '2',
    depositPaymentRecipientTemplate: '',
    sendImmediatelyFor: '1',
    sendImmediatelyForProspectIn: '1',
    internetLeadAutoResponse: '2',
    internetLeadAutoResponseTemplate: '',
    soldDealsThankYou: '2',
    soldDealsThankYouTemplate: '',
    soldDealsThankYouTiming: '0',
    stipulationRequest: '2',
    stipulationRequestTemplate: '',
    vehiclePriceDrop: '2',
    vehiclePriceDropTemplate: '',
  });

  // handle change inputs

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { value, name } = e.currentTarget;

    const numericInputs = ['soldDealsThankYouTiming', 'appointmentReminderTiming'];

    if (numericInputs.includes(name)) {
      const valueFiltered = numberFormatter(value);

      setInputs((prevState) => ({
        ...prevState,
        [name]: valueFiltered,
      }));

      return;
    }

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBtns = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();

    for (const [name, value] of Object.entries(inputs)) {
      formData.append(name, value);
    }

    const apiUrl = '/api/settings/automaticEmails';

    if (inputs.id) {
      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 49,
        options: {
          onSuccess: () => {
            updateDataWithSocket('automaticEmails');
          },
        },
      });
    } else {
      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 49,
        options: {
          onSuccess: (data) => {
            updateDataWithSocket('automaticEmails');

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
  };

  const handleClickSmsTemplate = (value: string, identity?: string) => {
    if (identity) {
      setInputs((prevState) => ({
        ...prevState,
        [identity]: value,
      }));
    }
  };

  const selectOptions = disableSelectValues?.map((el) => {
    return { value: el.id, option: el.value };
  });

  const dataInfo1 = [
    {
      key: 1,
      label: 'Internet Lead Auto Response',
      name: 'internetLeadAutoResponse',
      value: inputs.internetLeadAutoResponse,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 21,
      label: 'Template',
      name: 'internetLeadAutoResponseTemplate',
      value: inputs.internetLeadAutoResponseTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 2,
      paragraph: 'Immediately',
    },
    {
      key: 3,
      label: 'Appointment Reminder',
      name: 'appointmentReminder',
      value: inputs.appointmentReminder,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 22,
      label: 'Template',
      name: 'appointmentReminderTemplate',
      value: inputs.appointmentReminderTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 4,
      label: 'day(s) before',
      name: 'appointmentReminderTiming',
      value: inputs.appointmentReminderTiming,
      width: 3,
      type: 'text',
      onChange: handleChange,
      labelRight: true,
    },
  ];

  const dataInfo2 = [
    {
      key: 5,
      label: 'Appointment Scheduled / On-site',
      name: 'appointmentScheduleOnSite',
      value: inputs.appointmentScheduleOnSite,
      width: 11.5,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 23,
      label: 'Template',
      name: 'appointmentScheduleOnSiteTemplate',
      value: inputs.appointmentScheduleOnSiteTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 6,
      paragraph: 'Immediately',
    },
    {
      key: 7,
      label: 'Appointment Rescheduled / On-site',
      name: 'appointmentRescheduleOnSite',
      value: inputs.appointmentRescheduleOnSite,
      width: 11.5,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 24,
      label: 'Template',
      name: 'appointmentRescheduleOnSiteTemplate',
      value: inputs.appointmentRescheduleOnSiteTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 8,
      paragraph: 'Immediately',
    },
    {
      key: 9,
      label: 'Appointment Scheduled / Online',
      name: 'appointmentScheduleOnline',
      value: inputs.appointmentScheduleOnline,
      width: 11.5,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 25,
      label: 'Template',
      name: 'appointmentScheduleOnlineTemplate',
      value: inputs.appointmentScheduleOnlineTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 10,
      paragraph: 'Immediately',
    },
    {
      key: 11,
      label: 'Appointment Rescheduled / Online',
      name: 'appointmentRescheduleOnline',
      value: inputs.appointmentRescheduleOnline,
      width: 11.5,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 26,
      label: 'Template',
      name: 'appointmentRescheduleOnlineTemplate',
      value: inputs.appointmentRescheduleOnlineTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 12,
      paragraph: 'Immediately',
    },
  ];

  const dataInfo3 = [
    {
      key: 13,
      label: 'Sold Deals Thank You',
      name: 'soldDealsThankYou',
      value: inputs.soldDealsThankYou,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 27,
      label: 'Template',
      name: 'soldDealsThankYouTemplate',
      value: inputs.soldDealsThankYouTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 14,
      label: 'day(s) after',
      name: 'soldDealsThankYouTiming',
      value: inputs.soldDealsThankYouTiming,
      width: 3,
      type: 'text',
      onChange: handleChange,
      labelRight: true,
    },
    {
      key: 15,
      label: 'Vehicle Price Drop',
      name: 'vehiclePriceDrop',
      value: inputs.vehiclePriceDrop,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 28,
      label: 'Template',
      name: 'vehiclePriceDropTemplate',
      value: inputs.vehiclePriceDropTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 16,
      label: 'Send Immediately for prospects in',
      name: 'sendImmediatelyForProspectIn',
      value: inputs.sendImmediatelyForProspectIn,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: clientStatusesData?.map((el) => {
        return { value: el.id, option: el.status };
      }),
    },
    {
      key: 17,
      label: 'Deposit Payment Receipt',
      name: 'depositPaymentRecipient',
      value: inputs.depositPaymentRecipient,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 29,
      label: 'Template',
      name: 'depositPaymentRecipientTemplate',
      value: inputs.depositPaymentRecipientTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 18,
      label: 'Send Immediately for ',
      name: 'sendImmediatelyFor',
      value: inputs.sendImmediatelyFor,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: paymentTypes?.map((el) => {
        return { value: el.id, option: el.type };
      }),
    },
    {
      key: 19,
      label: 'Stipulation Request',
      name: 'stipulationRequest',
      value: inputs.stipulationRequest,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 30,
      label: 'Template',
      name: 'stipulationRequestTemplate',
      value: inputs.stipulationRequestTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 20,
      paragraph: 'Send on Request',
    },
  ];

  return (
    <ModalContent>
      <BorderedContent title="Automatic Emails" positionRelative loading={loading || loadingFetch}>
        <ContentRow cols={2} gap={53}>
          <Paragraph>Event</Paragraph>
          <Paragraph>Timing</Paragraph>
        </ContentRow>
        <HorizontalLine marginTop={1.5} marginBottom={4} />
        <ContentRow cols={3} gap={6}>
          {dataInfo1.map((el, index) =>
            el.onChange ? (
              <Input
                key={`${el.key}automaticemails1--${index}`}
                label={el.label}
                name={el.name}
                type={el.type}
                value={el.value}
                width={el.width}
                textAlterColor="#00A78B"
                options={el.options}
                labelRight={el.labelRight ? true : false}
                onChange={el.onChange}
                fieldErrors={fieldErrors}
              />
            ) : el.onClick ? (
              <RegularSearchableSelect
                key={`${el.key}automaticemails2--${index}`}
                iconTextGap={0}
                label={el.label}
                name={el.name}
                optionsBackgroundColor="#FFF"
                optionsHeight={el.optionsHeight || 0}
                optionsContainerHeight={28}
                optionsRadius={0.05}
                optionsWidth={el.width}
                value={el.value}
                textColor="#00A78B"
                width={el.width}
                options={emailTemplates?.map((template) => ({
                  value: template.id.toString(),
                  name: template.name,
                  identity: el.name,
                }))}
                onClick={handleClickSmsTemplate}
              />
            ) : (
              <Paragraph key={`${el.key}automaticemails3--${index}`}>{el.paragraph}</Paragraph>
            ),
          )}
        </ContentRow>
        <HorizontalLine marginTop={4} marginBottom={4} />
        <ContentRow cols={6} gap={6}>
          {dataInfo2.map((el, index) =>
            el.onChange ? (
              <Input
                key={`${el.key}automaticemails4--${index}`}
                label={el.label}
                name={el.name}
                type={el.type}
                value={el.value}
                width={el.width}
                textAlterColor="#00A78B"
                options={el.options}
                onChange={el.onChange}
                fieldErrors={fieldErrors}
              />
            ) : el.onClick ? (
              <RegularSearchableSelect
                key={`${el.key}automaticemails5--${index}`}
                iconTextGap={0}
                label={el.label}
                name={el.name}
                optionsBackgroundColor="#FFF"
                optionsHeight={el.optionsHeight || 0}
                optionsContainerHeight={28}
                optionsRadius={0.05}
                optionsWidth={el.width}
                value={el.value}
                textColor="#00A78B"
                width={el.width}
                options={emailTemplates?.map((template) => ({
                  value: template.id.toString(),
                  name: template.name,
                  identity: el.name,
                }))}
                onClick={handleClickSmsTemplate}
              />
            ) : (
              <Paragraph key={`${el.key}automaticemails6--${index}`}>{el.paragraph}</Paragraph>
            ),
          )}
        </ContentRow>
        <HorizontalLine marginTop={4} marginBottom={4} />
        <ContentRow cols={3} gap={6}>
          {dataInfo3.map((el, index) =>
            el.onChange ? (
              <Input
                key={`${el.key}automaticemails7--${index}`}
                label={el.label}
                name={el.name}
                type={el.type}
                value={el.value}
                width={el.width}
                options={el.options}
                textAlterColor="#00A78B"
                labelRight={el.labelRight ? true : false}
                onChange={el.onChange}
                fieldErrors={fieldErrors}
              />
            ) : el.onClick ? (
              <RegularSearchableSelect
                key={`${el.key}automaticemails8--${index}`}
                iconTextGap={0}
                label={el.label}
                name={el.name}
                optionsBackgroundColor="#FFF"
                optionsHeight={el.optionsHeight || 0}
                optionsContainerHeight={28}
                optionsRadius={0.05}
                optionsBottom={5.5}
                optionsWidth={el.width}
                value={el.value}
                textColor="#00A78B"
                width={el.width}
                options={emailTemplates?.map((template) => ({
                  value: template.id.toString(),
                  name: template.name,
                  identity: el.name,
                }))}
                onClick={handleClickSmsTemplate}
              />
            ) : (
              <Paragraph key={`${el.key}automaticemails9--${index}`}>{el.paragraph}</Paragraph>
            ),
          )}
        </ContentRow>
      </BorderedContent>
      <ButtonContainer marginTop={2} widthFull justify="right">
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
