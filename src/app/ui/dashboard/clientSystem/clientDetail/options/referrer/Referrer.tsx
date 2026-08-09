import {
  cobuyerReferrerStore,
  adminDashboardStore,
  modalWindowStore,
  singleCLientDataStore,
  messagesStore,
} from '@/store/adminDashboard';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Clients } from '@/app/libs/definitions';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { DottedListInput } from '&/miscellaneous/dottedInput/DottedListInput';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';

export function Referrer() {
  // ---- global states ----

  const { clientsData } = adminDashboardStore();
  const { getClients } = adminDashboardStore();

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const { closeClientReferrer, openClientSystem } = modalWindowStore();

  const { setCobuyerReferrerTrue, clearNewCobuyerReferrer } = cobuyerReferrerStore();
  const { newCobuyerReferrer } = cobuyerReferrerStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { messages } = messagesStore();
  const { setMessages } = messagesStore();

  useEffect(() => {
    getClients().finally(() => setLoading(false));
  }, [getClients]);

  // ---- local states ----
  const [loading, setLoading] = useState(true);
  const [filteredClientList, setFilteredClientList] = useState<Clients>();
  const [clientsList, setClientsList] = useState<Clients>([]);
  const [addNewProspectText, setAddNewProspectText] = useState('');

  const [inputs, setInputs] = useState<{
    referrerId: string;
    referrerName: string;
    referrerAddress: string;
    referrerMobilePhone: string;
    referrerEmail: string;
  }>({
    referrerId: '',
    referrerName: '',
    referrerAddress: '',
    referrerMobilePhone: '',
    referrerEmail: '',
  });

  useEffect(() => {
    if (clientsData && clientsData.length > 0 && singleCLientData) {
      setClientsList(
        clientsData.filter((el) => {
          return el.id != singleCLientData?.id ? el : false;
        }),
      );
    }
    if (
      singleCLientData &&
      singleCLientData?.buyer_referrer &&
      singleCLientData?.buyer_referrer?.length > 0
    ) {
      setInputs({
        referrerId: singleCLientData.buyer_referrer[0].referrer.id.toString(),
        referrerName: `${singleCLientData.buyer_referrer[0].referrer.first_name} ${singleCLientData.buyer_referrer[0].referrer.last_name}`,
        referrerAddress: singleCLientData.buyer_referrer[0].referrer.current_address,
        referrerMobilePhone: singleCLientData.buyer_referrer[0].referrer.mobile_phone,
        referrerEmail: singleCLientData.buyer_referrer[0].referrer.email,
      });
    }
  }, [clientsData, singleCLientData]);

  useEffect(() => {
    if (clientsList && clientsList.length > 0) {
      setFilteredClientList(clientsList);
    }
  }, [clientsList]);

  const handleCloseWindow = () => {
    clearNewCobuyerReferrer();
    closeClientReferrer();
  };

  const handleChangeMainReferrerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      referrerName: value,
    }));

    if (value.toLowerCase().trim() !== '' && clientsList) {
      const searchTermsArray = value.toLowerCase().split(' ');
      const filteredList = clientsList.filter((client) => {
        const nameLastname = client.name_lastname?.toLowerCase();
        return searchTermsArray.every((word: any) => nameLastname?.includes(word));
      });
      setFilteredClientList(filteredList);
    } else {
      setFilteredClientList(clientsList);
    }
  };

  const handleSelectReferrer = (e: React.MouseEvent<HTMLLIElement>) => {
    const { value } = e.currentTarget.dataset;

    const selectedCustomer = filteredClientList?.find(
      (customer) => value && customer.id === parseInt(value),
    );

    if (selectedCustomer) {
      setInputs({
        referrerId: selectedCustomer.id.toString(),
        referrerName: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
        referrerAddress: selectedCustomer.current_address,
        referrerMobilePhone: selectedCustomer.mobile_phone || '',
        referrerEmail: selectedCustomer.email || '',
      });
    }
  };

  const handleAddNewProspect = () => {
    setAddNewProspectText('Are you sure you want to add a new prospect?');
  };

  const handleDecision = (decision: boolean) => {
    if (decision) {
      setCobuyerReferrerTrue();
      openClientSystem();
      setAddNewProspectText('');
    } else {
      setAddNewProspectText('');
    }
  };

  const handleSaveReferrer = async () => {
    setLoading(true);

    if (singleCLientData && singleCLientData?.id) {
      const formData = new FormData();

      if (inputs.referrerId) {
        formData.append('clientReferrerId', `${inputs.referrerId}`);
      }

      formData.append('clientBuyerReferred', `${singleCLientData?.id}`);

      const res = await (
        await fetch('/api/adminDashboard/referrer', { method: 'POST', body: formData })
      ).json();

      if (res.successMessage && singleCLientData?.id) {
        setMessages(undefined, res.successMessage);
        getSingleClientData(`${singleCLientData?.id}`);
      }

      if (res.fieldErrors) {
      }

      if (res.serverError) {
        setMessages(res.serverError);
      }
    }

    setLoading(false);
  };

  const handleGetReferrerDetail = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (inputs.referrerId) {
      getSingleClientData(inputs.referrerId);
      handleCloseWindow();
    }
  };

  useEffect(() => {
    if (newCobuyerReferrer) {
      setInputs({
        referrerId: newCobuyerReferrer.id.toString(),
        referrerName: `${newCobuyerReferrer.first_name} ${newCobuyerReferrer.last_name}`,
        referrerAddress: newCobuyerReferrer.current_address,
        referrerMobilePhone: newCobuyerReferrer.mobile_phone,
        referrerEmail: newCobuyerReferrer.email,
      });
    }
  }, [newCobuyerReferrer]);

  const inputsDataOne = [
    {
      id: 1,
      value: inputs.referrerName,
      label: 'Name',
      width: 34.8734375,
      disabled: false,
      onValueClick: handleGetReferrerDetail,
    },
    {
      id: 2,
      value: inputs.referrerAddress,
      label: 'Address',
      width: 34.8734375,
      disabled: true,
    },
  ];

  const inputsDataTwo = [
    {
      id: 3,
      value: formatPhoneNumber(inputs.referrerMobilePhone),
      label: 'Cell Phone',
      width: 16.927083,
    },
    {
      id: 4,
      value: inputs.referrerEmail,
      label: 'Email',
      width: 16.927083,
    },
  ];

  return (
    <ModalWindow
      top={0}
      positionFixed
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
    >
      <ModalContainer width={82.8125} marginTop={10.5}>
        <ModalContainerTitle title="Referrer" closeWindowFunction={handleCloseWindow} />
        <ModalContent
          decisionMessage={addNewProspectText}
          onDecision={handleDecision}
          loading={loading}
          minHeight={53}
        >
          <BorderedContent>
            <DottedListInput
              value={inputs.referrerName}
              addNewProspect={true}
              name="referrerName"
              width={34.953646}
              listItems={filteredClientList?.map((el) => {
                return { value: el.id, option: `${el.first_name} ${el.last_name}` };
              })}
              onSelect={handleSelectReferrer}
              onChange={handleChangeMainReferrerInput}
              onAddNewProspect={handleAddNewProspect}
              capitalWords
            />
            <ContentRow cols={2} gap={2} marginTop={2.5}>
              {inputsDataOne.map((el, index) => (
                <DottedListInput
                  key={`${el.id * 3}ssssssreferrersss${index - 2}`}
                  name=""
                  value={el.value}
                  width={el.width}
                  label={el.label}
                  disabled={el.disabled}
                  onValueClick={el.onValueClick}
                />
              ))}
            </ContentRow>
            <ContentRow cols={2} gap={2} marginTop={2.5}>
              {inputsDataTwo.map((el, index) => (
                <DottedListInput
                  key={`${el.id * 3}ssssssreferrersss${index - 2}`}
                  name=""
                  value={el.value}
                  width={el.width}
                  label={el.label}
                  disabled={true}
                />
              ))}
            </ContentRow>
          </BorderedContent>
          <ButtonContainer marginTop={6.018519} widthFull justify="right">
            <motion.button
              onClick={handleSaveReferrer}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-[11.875vw] h-[5.462963vh] flex justify-center items-center text-[1.626852vh] font-semibold leading-[2.440741vh] rounded-[0.653646vw] bg-[#00A78B] text-[#FFFFFF]"
            >
              Save
            </motion.button>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
