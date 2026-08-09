import {
  adminDashboardStore,
  cobuyerReferrerStore,
  messagesStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { Clients } from '@/app/libs/definitions';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { DottedListInput } from '&/miscellaneous/dottedInput/DottedListInput';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Input } from '&/inputs/Input';
import { Button } from '&/buttons/Button';
import { leadsStore } from '@/store/leads';

export function Cobuyer() {
  // ---- global states ----
  const { closeClientCobuyer, openClientSystem } = modalWindowStore();

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const { clientsData, cobuyerRelationshipData } = adminDashboardStore();
  const { getClients, getCobuyerRelationship } = adminDashboardStore();

  const { clearNewCobuyerReferrer, setCobuyerReferrerTrue } = cobuyerReferrerStore();
  const { newCobuyerReferrer } = cobuyerReferrerStore();

  const { messages } = messagesStore();
  const { setMessages } = messagesStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const currentLead = leadsStore((state) => state.currentLead);

  useEffect(() => {
    getClients();
    getCobuyerRelationship().finally(() => setLoading(false));
  }, [getClients, getCobuyerRelationship]);

  // ---- local states ----

  const [loading, setLoading] = useState(true);

  const [inputs, setInputs] = useState<{
    id: string;
    name: string;
    address: string;
    homephone?: string | null;
    mobilephone: string;
    workphone?: string | null;
    email: string;
    relationship: string;
  }>({
    id: '',
    name: '',
    address: '',
    homephone: '',
    mobilephone: '',
    workphone: '',
    email: '',
    relationship: '1',
  });

  const [clientList, setClientList] = useState<Clients>([]);
  const [filteredClientList, setFilteredClientList] = useState<Clients>();

  const [assignedClientId, setAssignedClientId] = useState('');
  const [addNewProspectText, setAddNewProspectText] = useState('');

  useEffect(() => {
    if (clientsData && clientsData.length > 0 && singleCLientData) {
      setClientList(
        clientsData.filter((el) => {
          return el.id != singleCLientData?.id && el;
        }),
      );
    }
    if (singleCLientData?.buyer_client && singleCLientData?.buyer_client?.length > 0) {
      setInputs({
        id:
          singleCLientData?.buyer_client &&
          singleCLientData?.buyer_client[0].cobuyer?.id.toString(),
        name:
          (singleCLientData?.buyer_client &&
            singleCLientData?.buyer_client[0].cobuyer?.name_lastname) ||
          '',
        address: singleCLientData?.buyer_client[0].cobuyer?.current_address,
        homephone: singleCLientData?.buyer_client[0].cobuyer?.home_phone,
        mobilephone: singleCLientData?.buyer_client[0].cobuyer?.mobile_phone,
        workphone: singleCLientData?.buyer_client[0].cobuyer?.work_phone,
        email: singleCLientData?.buyer_client[0].cobuyer?.email,
        relationship:
          singleCLientData?.buyer_client &&
          singleCLientData?.buyer_client[0].relationship?.id.toString(),
      });
    }
    setAssignedClientId(singleCLientData?.id.toString() || '');
  }, [clientsData, cobuyerRelationshipData, singleCLientData]);

  useEffect(() => {
    if (clientList) {
      setFilteredClientList(clientList);
    }
  }, [clientList]);

  const handleCobuyerNameAndLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    const searchTerm = value.toLowerCase();

    setInputs((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));

    if (searchTerm.trim() !== '' && clientList) {
      const searchTermsArray = searchTerm.split(' ');
      const filteredList = clientList.filter((client) => {
        const nameLastname = client.name_lastname?.toLowerCase();
        return searchTermsArray.every((word: any) => nameLastname?.includes(word));
      });
      setFilteredClientList(filteredList);
    } else {
      setFilteredClientList(clientList);
    }
  };

  const handleCobuyerRelationship = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { value, name } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCloseWindow = () => {
    clearNewCobuyerReferrer();
    closeClientCobuyer();
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

  const handleSelectCobuyer = (e: React.MouseEvent<HTMLLIElement>) => {
    const { value } = e.currentTarget.dataset;

    const selectedCustomer = filteredClientList?.find(
      (customer) => value && customer.id === parseInt(value),
    );

    if (selectedCustomer) {
      setInputs((prevState) => ({
        ...prevState,
        id: selectedCustomer.id.toString(),
        name: `${selectedCustomer.first_name} ${selectedCustomer.last_name}`,
        address: selectedCustomer.current_address,
        homephone: selectedCustomer.home_phone,
        mobilephone: selectedCustomer.mobile_phone || '',
        workphone: selectedCustomer.work_phone,
        email: selectedCustomer.email || '',
      }));
    }
  };

  const handleSaveCobuyer = async () => {
    setLoading(true);

    if (assignedClientId && inputs && inputs.id) {
      const saveCobuyer = await fetch(
        `/api/adminDashboard/cobuyerRelationship${currentLead ? `?leadId=${currentLead}` : ''}`,
        {
          method: 'POST',
          body: JSON.stringify({
            cobuyerid: inputs && inputs.id,
            assigClient: assignedClientId.toString(),
            relationship: inputs.relationship && inputs.relationship,
          }),
        },
      );

      const res = await saveCobuyer.json();

      if (res) {
        if (res.fieldsErrors) {
        }

        if (res.successMessage) {
          setMessages(undefined, res.successMessage);
          getSingleClientData(assignedClientId);
        }

        if (res.serverError) {
          setMessages(res.serverError);
        }
      }
    } else {
      if (
        singleCLientData &&
        singleCLientData?.buyer_client &&
        singleCLientData?.buyer_client.length > 0
      ) {
        setInputs({
          id:
            singleCLientData?.buyer_client &&
            singleCLientData?.buyer_client[0].cobuyer?.id.toString(),
          name:
            (singleCLientData?.buyer_client &&
              singleCLientData?.buyer_client[0].cobuyer?.name_lastname) ||
            '',
          address: singleCLientData?.buyer_client[0].cobuyer?.current_address,
          homephone: singleCLientData?.buyer_client[0].cobuyer?.home_phone,
          mobilephone: singleCLientData?.buyer_client[0].cobuyer?.mobile_phone,
          workphone: singleCLientData?.buyer_client[0].cobuyer?.work_phone,
          email: singleCLientData?.buyer_client[0].cobuyer?.email,
          relationship: '',
        });
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (newCobuyerReferrer) {
      setInputs({
        id: newCobuyerReferrer.id.toString(),
        name: `${newCobuyerReferrer.first_name} ${newCobuyerReferrer.last_name}`,
        address: newCobuyerReferrer.current_address,
        homephone: newCobuyerReferrer.home_phone,
        mobilephone: newCobuyerReferrer.mobile_phone,
        workphone: newCobuyerReferrer.work_phone,
        email: newCobuyerReferrer.email,
        relationship: '',
      });
    }
  }, [newCobuyerReferrer]);

  const inputDataOne = [
    {
      id: 1,
      width: 21.875,
      label: 'Relationship',
      name: 'relationship',
      value: inputs.relationship,
      type: 'select',
      options: cobuyerRelationshipData?.map((el) => {
        return { value: el.id, option: el.relationship };
      }),
      labelLeft: true,
      onChange: handleCobuyerRelationship,
    },
    {
      id: 2,
      width: 34.84375,
      label: 'Name',
      name: 'name',
      value: inputs.name,
      type: 'text',
      onChange: handleCobuyerRelationship,
      disabled: true,
    },
    {
      id: 3,
      width: 34.84375,
      label: 'Address',
      name: 'address',
      value: inputs.address,
      type: 'text',
      onChange: handleCobuyerRelationship,
      disabled: true,
    },
  ];

  const inputDataTwo = [
    {
      id: 4,
      width: 16.927083,
      label: 'Home Phone',
      name: 'homephone',
      value: inputs.homephone ? formatPhoneNumber(inputs.homephone) : '',
      type: 'text',
      onChange: handleCobuyerRelationship,
      disabled: true,
    },
    {
      id: 5,
      width: 16.927083,
      label: 'Cell Phone',
      name: 'mobilephone',
      value: formatPhoneNumber(inputs.mobilephone),
      type: 'text',
      onChange: handleCobuyerRelationship,
      disabled: true,
    },
    {
      id: 6,
      width: 16.927083,
      label: 'Work Phone',
      name: 'workphone',
      value: inputs.workphone ? formatPhoneNumber(inputs.workphone) : '',
      type: 'text',
      onChange: handleCobuyerRelationship,
      disabled: true,
    },
    {
      id: 7,
      width: 16.927083,
      label: 'Email',
      name: 'email',
      value: inputs.email,
      type: 'text',
      onChange: handleCobuyerRelationship,
      disabled: true,
    },
  ];

  return (
    <ModalWindow
      top={0}
      positionFixed
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
    >
      <ModalContainer width={82.5} marginTop={10.5}>
        <ModalContainerTitle
          title="Cobuyer/ Co-Guaranter"
          closeWindowFunction={handleCloseWindow}
        />
        <ModalContent
          loading={loading}
          minHeight={52}
          decisionMessage={addNewProspectText}
          onDecision={handleDecision}
        >
          <BorderedContent>
            <ContentRow cols={2} gap={4} widthFull justifyContent="space-around">
              <DottedListInput
                width={36.145833}
                addNewProspect={true}
                value={inputs ? (inputs.name ? inputs.name : '') : ''}
                listItems={filteredClientList?.map((el) => {
                  return { value: el.id, option: `${el.first_name} ${el.last_name}` };
                })}
                name="clientName"
                onChange={handleCobuyerNameAndLastName}
                onSelect={handleSelectCobuyer}
                onAddNewProspect={handleAddNewProspect}
                capitalWords
              />
              {inputDataOne.map((el, index) => (
                <Input
                  key={`${el.id + index}---cobuyer${index}`}
                  label={el.label}
                  name={el.name}
                  type={el.type}
                  options={el.options}
                  value={el.value}
                  width={el.width}
                  labelLeft={el.labelLeft}
                  disabled={el.disabled}
                  noDisabledBgColor
                  onChange={el.onChange}
                  capitalString={el.name === 'name' ? true : false}
                />
              ))}
            </ContentRow>
            <ContentRow cols={4} marginTop={4} gap={0} widthFull justifyContent="space-around">
              {inputDataTwo.map((el, index) => (
                <Input
                  key={`${el.id + index}---cobuyer${index}`}
                  label={el.label}
                  name={el.name}
                  type={el.type}
                  value={el.value}
                  width={el.width}
                  disabled={el.disabled}
                  noDisabledBgColor
                  onChange={el.onChange}
                />
              ))}
            </ContentRow>
          </BorderedContent>
          <ButtonContainer marginTop={6.018519} widthFull justify="right">
            <Button
              width={11.875}
              backgroundColor="#00A78B"
              identity="save"
              textColor="#FFF"
              buttonText="Save"
              onClick={handleSaveCobuyer}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
