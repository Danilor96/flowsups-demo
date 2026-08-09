import { Button } from '@/app/ui/buttons/Button';
import { Input } from '@/app/ui/inputs/Input';
import { ContentRow } from '@/app/ui/modalWindowsStructure/ContentRow';
import React, { useEffect, useState, useCallback } from 'react';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { voiceAndSmsStore } from '@/store/notificationsSettings';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { TrashDeleteIcon } from '@/app/ui/icons/Icons';
import RegisteredNumbersModal from './RegisteredNumbersModal/RegisteredNumbersModal';
import TrustedMessagingModal from './TrustedMessagingModal/TrustedMessagingModal';

interface InputsProps {
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
}

interface NumberAndRegistrationProps {
  inputs: InputsProps;
  setInputs: React.Dispatch<React.SetStateAction<InputsProps>>;
}

const NumberAndRegistration = ({ inputs, setInputs }: NumberAndRegistrationProps) => {
  const { extractDigits, formatPhoneNumber } = phoneNumbersFormatStore();
  const { displayedName, forwardIncomingCalls, limitWarningRecipients, voiceAndEmailsData, getVoiceAndEmailsData } =
    voiceAndSmsStore();
  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();
  const [showRegiteredNumbers, setShowRegiteredNumbers] = useState(false);
  const [showTrustedMessaging, setShowTrustedMessaging] = useState(false);

  // useEffect(() => {
  //   getVoiceAndEmailsData();
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.currentTarget;

    // phone number handling

    if (name === 'systemPhonePublishing') {
      const val = extractDigits(value);

      setInputs(prevState => ({
        ...prevState,
        systemPhonePublishing: val,
      }));

      return;
    }

    // handling checkboxes

    if (type === 'checkbox' && e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;

      if (checked) {
        setInputs(prevState => ({
          ...prevState,
          [name]: '1',
        }));
      } else {
        setInputs(prevState => ({
          ...prevState,
          [name]: '',
        }));
      }

      return;
    }

    // rest of inputs handling

    setInputs(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const [inputs, setInputs] = useState<{
  //   id: string;
  //   systemPhonePublishing: string;
  //   systemEmailPublishing: string;
  //   systemEmailPublishingVerified: string;
  //   forwardIncomingCalls: string;
  //   forwardIncomingCallsNumber: string;
  //   useDealershipPhoneNumber: string;
  // }>({
  //   id: '',
  //   systemEmailPublishingVerified: '',
  //   forwardIncomingCalls: '1',
  //   forwardIncomingCallsNumber: '',
  //   systemEmailPublishing: '',
  //   systemPhonePublishing: '',
  //   useDealershipPhoneNumber: '',
  // });

  //   useEffect(() => {
  //   if (voiceAndEmailsData) {
  //     voiceAndEmailsData.map(el => {
  //       setInputs(prevState => ({
  //         ...prevState,
  //         id: el.id ? el.id.toString() : '',
  //         systemPhonePublishing: el.system_phone_for_publishing ? el.system_phone_for_publishing : '',
  //         systemEmailPublishing: el.system_email_address_for_publishing ? el.system_email_address_for_publishing : '',
  //         systemEmailPublishingVerified: el.email_verfified ? '1' : '',
  //         forwardIncomingCallsNumber: el.forward_incoming_calls_to ? el.forward_incoming_calls_to : '',
  //         useDealershipPhoneNumber: el.dealership_phone_number ? '1' : '',
  //       }));
  //     });
  //   }
  // }, [voiceAndEmailsData]);

  const dataInfo1 = [
    // {
    //   key: 1,
    //   label: 'System Phone # for Publishing',
    //   name: 'systemPhonePublishing',
    //   value: formatPhoneNumber(inputs.systemPhonePublishing),
    //   width: 23.177083,
    //   type: 'text',
    //   max: 14,
    //   onChange: handleChange,
    // },
    // {
    //   key: 2,
    //   isBtn: true,
    //   backgroundColor: '#00A78B',
    //   buttonText: 'Trusted Messaging',
    //   height: 5.277778,
    //   width: 9.84375,
    //   identity: 'trustedMessaging',
    //   textColor: '#FFF',
    //   onClick: () => {},
    // },
    {
      key: 3,
      label: 'System Email Address for Publishing',
      name: 'systemEmailPublishing',
      value: inputs.systemEmailPublishing,
      width: 23.177083,
      type: 'email',
      onChange: handleChange,
    },
    {
      key: 4,
      name: 'systemEmailPublishingVerified',
      value: inputs.systemEmailPublishingVerified,
      width: 0,
      type: 'checkbox',
      chekcboxText: 'Verfied',
      onChange: handleChange,
    },
  ];

  const dataInfo2 = [
    {
      key: 5,
      label: 'Forward Incoming Calls to',
      name: 'forwardIncomingCalls',
      value: inputs.forwardIncomingCalls,
      width: 23.177083,
      type: 'select',
      options: forwardIncomingCalls?.map(el => {
        return { value: el.id, option: el.option };
      }),
      onChange: handleChange,
    },
    {
      key: 6,
      label: '',
      name: 'forwardIncomingCallsNumber',
      value: inputs.forwardIncomingCallsNumber,
      width: 23.177083,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 7,
      name: 'useDealershipPhoneNumber',
      value: inputs.useDealershipPhoneNumber,
      width: 0,
      type: 'checkbox',
      chekcboxText: 'Use dealership phone number',
      border: 0.052083,
      borderColor: '#00A78B',
      borderRadius: 0.520833,
      textAlterColor: '#00A78B',
      onChange: handleChange,
    },
  ];

  const openCloseModal = () => {
    setShowRegiteredNumbers(prevState => !prevState);
  };

  const openCloseTrustedMessagingModal = () => {
    setShowTrustedMessaging(prevState => !prevState)
  }

  return (
    <>
      <ContentRow cols={4} gap={1.09375} alignItems="flex-start" marginTop={3}>
        <div className="mr-10 flex flex-col items-start ">
          <label
            htmlFor=""
            className="w-fit font-medium"
            style={{
              marginBottom: `1.666667vh`,
              color: '#B3B3B3',
              fontSize: '1.626852vh',
            }}
          >
            System Phone # for Publishing
          </label>
          <div className="flex items-center mb-[2vh] gap-[3.7vh]">
            <span className="font-bold text-[2vh]">
              {formatPhoneNumber(extractDigits(inputs.systemPhonePublishing.replace('+1', '')))}
            </span>
            <Button
              backgroundColor="#fff"
              buttonText=""
              widthFitContent
              height={5.277778}
              identity="delete"
              textColor="gray"
              borderColor="#fff"
              buttonIcon={<TrashDeleteIcon color="#B3B3B3" />}
              onClick={() => {}}
            />
            <Button
              backgroundColor={'#00A78B'}
              buttonText="Trusted Messaging"
              width={9.84375}
              height={5.277778}
              identity="trustedMessaging"
              textColor="#FFF"
              onClick={openCloseTrustedMessagingModal}
            />
          </div>
          <Button
            backgroundColor={''}
            buttonText="Regitered Phone Numbers"
            height={5.277778}
            widthFitContent
            identity="registerPhoneNumbers"
            textColor="#00A78B"
            borderColor={'#00A78B'}
            border={0.052083}
            onClick={openCloseModal}
          />
          {showRegiteredNumbers && <RegisteredNumbersModal openCloseModal={openCloseModal} />}
          {showTrustedMessaging && <TrustedMessagingModal openCloseModal={openCloseTrustedMessagingModal} />}
        </div>
        {dataInfo1.map(
          el =>
            el.onChange && (
              <Input
                key={el.key}
                label={el.label}
                name={el.name}
                type={el.type}
                width={el.width}
                value={el.value}
                // max={el.max?}
                chekcboxText={el.chekcboxText}
                onChange={el.onChange}
                fieldErrors={fieldErrors}
              />
            ),
        )}
      </ContentRow>
      <ContentRow cols={3} gap={1.09375} marginTop={2.9}>
        {dataInfo2.map(el => (
          <Input
            key={el.key}
            label={el.label}
            name={el.name}
            type={el.type}
            width={el.width}
            value={el.value}
            chekcboxText={el.chekcboxText}
            border={el.border}
            borderRadius={el.borderRadius}
            borderColor={el.borderColor}
            options={el.options}
            textAlterColor={el.textAlterColor}
            onChange={el.onChange}
            fieldErrors={fieldErrors}
          />
        ))}
      </ContentRow>
    </>
  );
};

export default NumberAndRegistration;
