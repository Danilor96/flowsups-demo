import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { useCallback, useEffect, useState } from 'react';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { Input } from '&/inputs/Input';
import { adminDashboardStore, numberFormatterStore } from '@/store/adminDashboard';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { RegularSearchableSelect } from '&/select/regularSearchableSelect/RegularSearchableSelect';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { useSocketStore } from '@/store/socketIo';

export function AutomaticSms() {
  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();

  const { numberFormatter } = numberFormatterStore();

  const { disableSelectValues, automaticSms, smsTemplates } = adminDashboardStore();

  const { getDisableSelectValues, getAutomaticSms, getSmsTemplates } = adminDashboardStore();

  const getDataPromises = useCallback(
    () => {
      return [getDisableSelectValues(), getAutomaticSms(), getSmsTemplates()];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { loading, error } = useLoadingGetData(getDataPromises);

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  // ----- local states -----

  const returnValue = (data: boolean) => {
    if (data) return '1';

    return '2';
  };

  useEffect(() => {
    if (automaticSms) {
      setInputs({
        id: automaticSms.id.toString(),
        appointmentReminder: returnValue(automaticSms.appointment_reminder),
        appointmentReminderTemplate:
          automaticSms.appointment_reminder_template_id?.toString() || '',
        appointmentReminderTiming: automaticSms.appointment_reminder_timing,
        appointmentScheduleOnSite: returnValue(automaticSms.appointment_reschedule_onSite),
        appointmentScheduleOnSiteTemplate:
          automaticSms.appointment_schedule_on_site_template_id?.toString() || '',
        appointmentScheduleOnline: returnValue(automaticSms.appointment_schedule_online),
        appointmentScheduleOnlineTemplate:
          automaticSms.appointment_schedule_online_template_id?.toString() || '',
        appointmentRescheduleOnSite: returnValue(automaticSms.appointment_reschedule_onSite),
        appointmentRescheduleOnSiteTemplate:
          automaticSms.appointment_reschedule_onSite_template_id?.toString() || '',
        appointmentRescheduleOnline: returnValue(automaticSms.appointment_reschedule_online),
        appointmentRescheduleOnlineTemplate:
          automaticSms.appointment_reschedule_online_template_id?.toString() || '',
        stipulationRequest: returnValue(automaticSms.stipulation_request),
        stipulationRequestTemplate: automaticSms.stipulation_request_template_id?.toString() || '',
        consentSms: returnValue(automaticSms.consent_sms),
        consentSmsTemplate: automaticSms.consent_sms_template_id?.toString() || '',
        appointmentConfirmation: returnValue(automaticSms.appointment_confirmation),
        appointmentConfirmationTemplate:
          automaticSms.appointment_confirmation_template_id?.toString() || '',
      });
    }
  }, [automaticSms]);

  // inputs
  const [inputs, setInputs] = useState({
    id: '',
    appointmentReminder: '2',
    appointmentReminderTemplate: '',
    consentSms: '2',
    consentSmsTemplate: '',
    appointmentConfirmation: '2',
    appointmentConfirmationTemplate: '',
    appointmentReminderTiming: '0',
    appointmentScheduleOnSite: '2',
    appointmentScheduleOnSiteTemplate: '',
    appointmentScheduleOnline: '2',
    appointmentScheduleOnlineTemplate: '',
    appointmentRescheduleOnSite: '2',
    appointmentRescheduleOnSiteTemplate: '',
    appointmentRescheduleOnline: '2',
    appointmentRescheduleOnlineTemplate: '',
    stipulationRequest: '2',
    stipulationRequestTemplate: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.currentTarget;

    if (name === 'appointmentReminderTiming') {
      const numberValue = numberFormatter(value);

      setInputs((prevState) => ({
        ...prevState,
        appointmentReminderTiming: numberValue,
      }));

      return;
    }

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();

    for (const [name, value] of Object.entries(inputs)) {
      formData.append(name, value);
    }

    const apiUrl = '/api/settings/automaticSms';

    if (inputs.id) {
      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 50,
        options: {
          onSuccess: () => {
            updateDataWithSocket('automaticSms');
          },
        },
      });
    } else {
      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 50,
        options: {
          onSuccess: (data) => {
            updateDataWithSocket('automaticSms');

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

  // inputs data

  const selectOptions = disableSelectValues?.map((el) => {
    return { value: el.id, option: el.value };
  });

  const dataInfo1 = [
    {
      key: 1,
      label: 'Appointment Reminder',
      name: 'appointmentReminder',
      value: inputs.appointmentReminder,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 13,
      label: 'Template',
      name: 'appointmentReminderTemplate',
      value: inputs.appointmentReminderTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 2,
      label: 'day(s) before',
      name: 'appointmentReminderTiming',
      value: inputs.appointmentReminderTiming,
      width: 3,
      type: 'text',
      onChange: handleChange,
      labelRight: true,
    },
    {
      key: 19,
      label: 'Consent Sms',
      name: 'consentSms',
      value: inputs.consentSms,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 20,
      label: 'Template',
      name: 'consentSmsTemplate',
      value: inputs.consentSmsTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 21,
      paragraph: 'Immediately',
    },
    {
      key: 22,
      label: 'Appointment Confirmation Sms',
      name: 'appointmentConfirmation',
      value: inputs.appointmentConfirmation,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 23,
      label: 'Template',
      name: 'appointmentConfirmationTemplate',
      value: inputs.appointmentConfirmationTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 24,
      paragraph: 'Immediately',
    },
  ];

  const dataInfo2 = [
    {
      key: 3,
      label: 'Appointment Scheduled / On-site',
      name: 'appointmentScheduleOnSite',
      value: inputs.appointmentScheduleOnSite,
      width: 11.5,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 14,
      label: 'Template',
      name: 'appointmentScheduleOnSiteTemplate',
      value: inputs.appointmentScheduleOnSiteTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 4,
      paragraph: 'Immediately',
    },
    {
      key: 5,
      label: 'Appointment Rescheduled / On-site',
      name: 'appointmentRescheduleOnSite',
      value: inputs.appointmentRescheduleOnSite,
      width: 11.5,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 15,
      label: 'Template',
      name: 'appointmentRescheduleOnSiteTemplate',
      value: inputs.appointmentRescheduleOnSiteTemplate,
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
      label: 'Appointment Scheduled / Online',
      name: 'appointmentScheduleOnline',
      value: inputs.appointmentScheduleOnline,
      width: 11.5,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 16,
      label: 'Template',
      name: 'appointmentScheduleOnlineTemplate',
      value: inputs.appointmentScheduleOnlineTemplate,
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
      label: 'Appointment Rescheduled / Online',
      name: 'appointmentRescheduleOnline',
      value: inputs.appointmentRescheduleOnline,
      width: 11.5,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 17,
      label: 'Template',
      name: 'appointmentRescheduleOnlineTemplate',
      value: inputs.appointmentRescheduleOnlineTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 10,
      paragraph: 'Immediately',
    },
  ];

  const dataInfo3 = [
    {
      key: 11,
      label: 'Stipulation Request',
      name: 'stipulationRequest',
      value: inputs.stipulationRequest,
      width: 23.177083,
      type: 'select',
      onChange: handleChange,
      options: selectOptions,
    },
    {
      key: 18,
      label: 'Template',
      name: 'stipulationRequestTemplate',
      value: inputs.stipulationRequestTemplate,
      width: 11,
      optionsHeight: 7,
      onClick: handleClickSmsTemplate,
    },
    {
      key: 12,
      paragraph: 'Send on Request',
    },
  ];

  return (
    <ModalContent>
      <BorderedContent title="Automatic SMS" positionRelative loading={loading || loadingFetch}>
        <ContentRow cols={2} gap={53}>
          <Paragraph>Event</Paragraph>
          <Paragraph>Timing</Paragraph>
        </ContentRow>
        <HorizontalLine marginTop={1.5} marginBottom={4} />
        <ContentRow cols={3} gap={6}>
          {dataInfo1.map((el, index) =>
            el.onChange ? (
              <Input
                key={`${el.key}automaticsms1--${index}`}
                label={el.label}
                name={el.name}
                type={el.type}
                value={el.value}
                width={el.width}
                options={el.options}
                labelRight={el.labelRight ? true : false}
                textAlterColor="#00A78B"
                onChange={el.onChange}
                fieldErrors={fieldErrors}
              />
            ) : el.onClick ? (
              <RegularSearchableSelect
                key={`${el.key}automaticsms2--${index}`}
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
                options={smsTemplates?.map((template) => ({
                  value: template.id.toString(),
                  name: template.name,
                  identity: el.name,
                }))}
                onClick={handleClickSmsTemplate}
              />
            ) : (
              <Paragraph key={`${el.key}automaticsms5--${index}`}>{el.paragraph}</Paragraph>
            ),
          )}
        </ContentRow>
        <HorizontalLine marginTop={4} marginBottom={4} />
        <ContentRow cols={6} gap={6}>
          {dataInfo2.map((el, index) =>
            el.onChange ? (
              <Input
                key={`${el.key}automaticsms3--${index}`}
                label={el.label}
                name={el.name}
                type={el.type}
                value={el.value}
                width={el.width}
                options={el.options}
                textAlterColor="#00A78B"
                onChange={el.onChange}
                fieldErrors={fieldErrors}
              />
            ) : el.onClick ? (
              <RegularSearchableSelect
                key={`${el.key}automaticsms4--${index}`}
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
                options={smsTemplates?.map((template) => ({
                  value: template.id.toString(),
                  name: template.name,
                  identity: el.name,
                }))}
                onClick={handleClickSmsTemplate}
              />
            ) : (
              <Paragraph key={`${el.key}automaticsms5--${index}`}>{el.paragraph}</Paragraph>
            ),
          )}
        </ContentRow>
        <HorizontalLine marginTop={4} marginBottom={4} />
        <ContentRow cols={3} gap={6}>
          {dataInfo3.map((el, index) =>
            el.onChange ? (
              <Input
                key={`${el.key}automaticsms6--${index}`}
                label={el.label}
                name={el.name}
                type={el.type}
                value={el.value}
                width={el.width}
                options={el.options}
                onChange={el.onChange}
                textAlterColor="#00A78B"
                fieldErrors={fieldErrors}
              />
            ) : el.onClick ? (
              <RegularSearchableSelect
                key={`${el.key}automaticsms7--${index}`}
                iconTextGap={0}
                label={el.label}
                name={el.name}
                optionsBackgroundColor="#FFF"
                optionsHeight={el.optionsHeight || 0}
                optionsContainerHeight={28}
                optionsRadius={0.05}
                optionsWidth={el.width}
                value={el.value}
                optionsBottom={5.5}
                textColor="#00A78B"
                width={el.width}
                options={smsTemplates?.map((template) => ({
                  value: template.id.toString(),
                  name: template.name,
                  identity: el.name,
                }))}
                onClick={handleClickSmsTemplate}
              />
            ) : (
              <Paragraph key={`${el.key}automaticsms8--${index}`}>{el.paragraph}</Paragraph>
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
          onClick={handleButton}
        />
      </ButtonContainer>
    </ModalContent>
  );
}
