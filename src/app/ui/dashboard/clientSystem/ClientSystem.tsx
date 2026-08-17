import {
  BusinessClientIcon,
  CloseWindow,
  EyeClosed,
  EyeIcon,
  IndividualClientIcon,
  ShowInfo,
  ThreeGreenDots,
} from '&/icons/Icons';
import {
  adminDashboardStore,
  cobuyerReferrerStore,
  currentSectionStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SuccessNotification, FailNotification } from '&/notifications/Notification';
import { IconedSelect } from '&/select/iconedSelect/IconedSelect';
import { useSocketStore } from '@/store/socketIo';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { AdderSelect } from '../../select/adderSelect/AdderSelect';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { Input } from '../../inputs/Input';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { FieldErrorMessage } from '../../miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';
import { GenericSelector } from '../../select/GenericSelector/GenericSelector';
import { createPortal } from 'react-dom';

export function ClientSystem() {
  // ---- global states ----

  const { updateDataWithSocket } = useSocketStore();

  const { formatPhoneNumber, extractDigits, ssnFormat } = phoneNumbersFormatStore();

  const { leadSourcesData, leadTypesData, statesData } = adminDashboardStore();
  const { getLeadSources, getLeadTypes, getStates } = adminDashboardStore();

  const { closeClientSystem, openClientDetail } = modalWindowStore();

  const { getSingleClientData } = singleCLientDataStore();

  const { isCobuyerReferrer } = cobuyerReferrerStore();
  const { setCobuyerReferrerFalse, getNewCobuyerReferrer } = cobuyerReferrerStore();

  const { getCurrentSection } = currentSectionStore();
  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  useEffect(() => {
    getCurrentSection('Add new prospect');
    getLeadSources();
    getLeadTypes();
    getStates();
  }, [getLeadSources, getLeadTypes, getStates, getCurrentSection]);

  // ---- local states ----
  const [inputsCustomerName, setInputsCustomerName] = useState<{
    nameAndLastname: string;
    firstName: string;
    lastName: string;
    salutation: string;
    nickname: string;
    middleInit: string;
    suffix: string;
  }>({
    nameAndLastname: '',
    firstName: '',
    lastName: '',
    salutation: '',
    nickname: '',
    middleInit: '',
    suffix: '',
  });

  const [inputsCustomerAddress, setCustomerAddress] = useState<{
    currentAddress: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    county: string;
  }>({
    currentAddress: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    county: '',
  });

  const [clientPhoneNumber, setClientPhoneNumber] = useState<string>('');
  const [clientHomePhoneNumber, setClientHomePhoneNumber] = useState('');
  const [clientWorkPhoneNumber, setClientWorkPhoneNumber] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientSocialSecurity, setClientSocialSecurity] = useState('');
  const [clientBornDate, setClientBornDate] = useState('');
  const [clientLeadType, setClientLeadType] = useState('');
  const [clientLeadSource, setClientLeadSource] = useState('');
  const [leadSourceName, setLeadSourceName] = useState('');
  const [typeOfClient, setTypeOfClient] = useState('');
  const [serverSuccessMessage, setServerSuccessMessage] = useState<any>();
  const [serverErrorMessage, setServerErrorMessage] = useState<any>();
  const [fieldErrorsState, setFieldErrorsState] = useState<any>();
  const [showClientOptions, setShowClientOptions] = useState(false);
  const [showAddressOptions, setShowAddressOptions] = useState(false);
  const [stateId, setStateId] = useState<any>();
  const [typeOfClientText, setTypeOfClientText] = useState<string>('Select client');
  const [showSSN, setShowSSN] = useState(false);

  const today = new Date();
  const year = today.getFullYear() - 18;
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const maxDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;

  const { data: session } = useSession();
  const activeUser = session?.user.id;
  const userAuthenticatedIsAdmin = session?.user?.user_has?.some(
    (role) => role.role_id === 1 || role.role_id === 2,
  );

  // ---- lead source edit modal state ----
  const [editLeadSource, setEditLeadSource] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editLeadSourceName, setEditLeadSourceName] = useState('');
  const [editLeadSourceLoading, setEditLeadSourceLoading] = useState(false);
  const [editLeadSourceError, setEditLeadSourceError] = useState('');
  const [loadingLeadSources, setLoadingLeadSources] = useState(false);

  const openEditLeadSourceModal = (id: string, name: string) => {
    setEditLeadSource({ id, name });
    setEditLeadSourceName(name);
    setEditLeadSourceError('');
  };

  const closeEditLeadSourceModal = () => {
    setEditLeadSource(null);
    setEditLeadSourceName('');
    setEditLeadSourceError('');
  };

  const handleSaveLeadSourceName = async () => {
    if (!editLeadSource) return;
    if (!editLeadSourceName.trim()) {
      setEditLeadSourceError('Name cannot be empty');
      return;
    }
    setEditLeadSourceLoading(true);
    setEditLeadSourceError('');
    try {
      await makeAsyncFetch({
        apiUrl: `/api/adminDashboard/leadSources/${editLeadSource.id}`,
        method: 'PUT',
        body: { source: editLeadSourceName.trim() },
        options: {
          onSuccess: () => {
            setLoadingLeadSources(true);
            getLeadSources().finally(() => {
              setLoadingLeadSources(false);
            });
            updateDataWithSocket('leadSources');

            if (clientLeadSource === editLeadSource.id) {
              setLeadSourceName(editLeadSourceName.trim());
            }
            closeEditLeadSourceModal();
          },
          onError: (json) => {
            setEditLeadSourceError(json.serverError || json.fieldError);
          },
        },
      });
    } catch {
      setEditLeadSourceError('An error occurred. Please try again.');
    } finally {
      setEditLeadSourceLoading(false);
    }
  };

  const handleDeleteLeadSourceModal = async () => {
    if (!editLeadSource) return;
    setEditLeadSourceLoading(true);
    setEditLeadSourceError('');
    try {
      await makeAsyncFetch({
        apiUrl: `/api/adminDashboard/leadSources/${editLeadSource.id}`,
        method: 'DELETE',
        options: {
          onSuccess: () => {
            if (clientLeadSource === editLeadSource.id) {
              setClientLeadSource('');
              setLeadSourceName('');
            }

            setLoadingLeadSources(true);
            getLeadSources().finally(() => {
              setLoadingLeadSources(false);
            });
            updateDataWithSocket('leadSources');
            closeEditLeadSourceModal();
          },
          onError: (json) => {
            setEditLeadSourceError(json.serverError);
          },
          onLocalError(error) {
            setEditLeadSourceError('An error occurred. Please try again.');
          },
        },
      });
    } catch {
      setEditLeadSourceError('An error occurred. Please try again.');
    } finally {
      setEditLeadSourceLoading(false);
    }
  };

  // handle close window block

  const handleCloseWindow = () => {
    setCobuyerReferrerFalse();
    closeClientSystem();
    // isCobuyerReferrer && window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // inputs handle values block

  const handleClearInputs = () => {
    setClientBornDate('');
    setClientEmail('');
    setClientHomePhoneNumber('');
    setClientLeadSource('');
    setClientLeadType('');
    setClientPhoneNumber('');
    setClientWorkPhoneNumber('');
    setClientSocialSecurity('');
    setTypeOfClient('');
    setCustomerAddress({
      currentAddress: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      county: '',
    });
    setInputsCustomerName({
      nameAndLastname: '',
      firstName: '',
      lastName: '',
      salutation: '',
      nickname: '',
      middleInit: '',
      suffix: '',
    });
  };

  const handleClientPhoneNumber = (e: any) => {
    setClientPhoneNumber(e.target.value);
  };

  const handleClientHomePhoneNumber = (e: any) => {
    setClientHomePhoneNumber(e.target.value);
  };

  const handleClientWorkPhoneNumber = (e: any) => {
    setClientWorkPhoneNumber(e.target.value);
  };

  const handleClientEmail = (e: any) => {
    setClientEmail(e.target.value);
  };

  const handleClientSocialSecurity = (e: any) => {
    const inputValue = e.target.value;

    if (showSSN) {
      setClientSocialSecurity(inputValue);
      return;
    }

    // Logic to preserve hidden digits when editing masked value
    const bulletCount = (inputValue.match(/•/g) || []).length;
    const visibleDigits = inputValue.replace(/[^0-9]/g, '');
    const currentRealDigits = clientSocialSecurity.replace(/\D/g, '');

    // We take the first 'bulletCount' digits from the existing state as the hidden part
    const hiddenDigits = currentRealDigits.slice(0, bulletCount);
    const result = hiddenDigits + visibleDigits;
    setClientSocialSecurity(result.slice(0, 9));
  };

  const handleClientBornDate = (e: any) => {
    setClientBornDate(e.target.value);
  };

  const handleClientLeadType = (e: any) => {
    setClientLeadType(e.target.value);
  };

  const handleClientLeadSource = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setLeadSourceName(value);

    if (clientLeadSource !== '') {
      setClientLeadSource('');
    }
  };

  const handleTypeOfClient = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;

    setTypeOfClientText(name);
    setTypeOfClient(value);
  };

  const handleShowClientOptions = () => {
    setShowClientOptions(!showClientOptions);
    setShowAddressOptions(false);
  };

  const handleShowAddressOptions = () => {
    setShowAddressOptions(!showAddressOptions);
    setShowClientOptions(false);
  };

  // handle save client block

  const { makeAsyncFetch } = useAsyncFetching();

  const handleSaveClient = async () => {
    const inputsData = [
      { name: 'name_lastname', value: inputsCustomerName.nameAndLastname },
      { name: 'born_date', value: clientBornDate },
      { name: 'phone_number', value: extractDigits(clientPhoneNumber) },
      { name: 'home_phone_number', value: extractDigits(clientHomePhoneNumber) },
      { name: 'work_phone_number', value: extractDigits(clientWorkPhoneNumber) },
      { name: 'email', value: clientEmail },
      {
        name: 'current_address',
        value: inputsCustomerAddress.currentAddress
          ? inputsCustomerAddress.currentAddress + ',' + stateId
          : '',
      },
      { name: 'lead_type', value: clientLeadType },
      { name: 'lead_source', value: clientLeadSource },
      { name: 'type_of_client', value: typeOfClient },
      { name: 'created_by', value: activeUser },
      { name: 'salutation', value: inputsCustomerName.salutation },
      { name: 'first_name', value: inputsCustomerName.firstName },
      { name: 'last_name', value: inputsCustomerName.lastName },
      { name: 'middle_initials', value: inputsCustomerName.middleInit },
      { name: 'nickname', value: inputsCustomerName.nickname },
      { name: 'suffix', value: inputsCustomerName.suffix },
    ];

    if (clientSocialSecurity && clientSocialSecurity.length > 0) {
      inputsData.push({ name: 'social_security', value: extractDigits(clientSocialSecurity) });
    }

    // console.log(Object.keys(fieldErrorsState).length === 1, Object.keys(fieldErrorsState).length);
    // if (fieldErrorsState && fieldErrorsState.born_date && Object.keys(fieldErrorsState).length === 1) {
    //   return;
    // }

    const formData = new FormData();

    inputsData.map((el: any) => {
      if (el.name === 'work_phone_number' && (!el.value || el.value === '')) return;
      if (el.name === 'home_phone_number' && (!el.value || el.value === '')) return;
      formData.append(`${el.name}`, `${el.value}`);
    });

    formData.append('leadSourceName', leadSourceName);

    const apiUrl = '/api/adminDashboard/clients';

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'POST',
      permissionForFetch: 31,
      options: {
        onSuccess: (data) => {
          if (data.change) {
            updateDataWithSocket('singleClient', undefined, {
              data: data.change,
            });
          }

          if (data.customer && !isCobuyerReferrer) {
            updateDataWithSocket('customersList');

            getSingleClientData(`${data.customer.id}`);
            setFieldErrorsState('');
            handleClearInputs();
            openClientDetail();
            closeClientSystem();
          }

          if (data.customer && isCobuyerReferrer) {
            getNewCobuyerReferrer(data.customer);
            setCobuyerReferrerFalse();
            closeClientSystem();
          }
        },
        onFieldErrors: (fieldErrors: any) => {
          if (fieldErrorsState && fieldErrorsState.born_date) {
            setFieldErrorsState({
              ...fieldErrors,
              born_date: fieldErrorsState.born_date,
            });
            return;
          }
          setFieldErrorsState(fieldErrors);
        },
      },
    });
  };

  // handle save and new block

  const handleSaveClientAndNew = async () => {
    const inputsData = [
      { name: 'name_lastname', value: inputsCustomerName.nameAndLastname },
      { name: 'born_date', value: clientBornDate },
      { name: 'phone_number', value: extractDigits(clientPhoneNumber) },
      { name: 'home_phone_number', value: extractDigits(clientHomePhoneNumber) },
      { name: 'work_phone_number', value: extractDigits(clientWorkPhoneNumber) },
      { name: 'email', value: clientEmail },
      {
        name: 'current_address',
        value: inputsCustomerAddress.currentAddress
          ? inputsCustomerAddress.currentAddress + ',' + stateId
          : '',
      },
      { name: 'lead_type', value: clientLeadType },
      { name: 'lead_source', value: clientLeadSource },
      { name: 'type_of_client', value: typeOfClient },
      { name: 'created_by', value: activeUser },
      { name: 'salutation', value: inputsCustomerName.salutation },
      { name: 'first_name', value: inputsCustomerName.firstName },
      { name: 'last_name', value: inputsCustomerName.lastName },
      { name: 'middle_initials', value: inputsCustomerName.middleInit },
      { name: 'nickname', value: inputsCustomerName.nickname },
      { name: 'suffix', value: inputsCustomerName.suffix },
    ];

    if (clientSocialSecurity && clientSocialSecurity.length > 0) {
      inputsData.push({ name: 'social_security', value: extractDigits(clientSocialSecurity) });
    }
    // console.log(Object.keys(fieldErrorsState).length === 1, Object.keys(fieldErrorsState).length);
    // if (fieldErrorsState && fieldErrorsState.born_date && Object.keys(fieldErrorsState).length === 1) {
    //   return;
    // }

    const formData = new FormData();

    inputsData.map((el: any) => {
      if (el.name === 'work_phone_number' && (!el.value || el.value === '')) return {};
      if (el.name === 'home_phone_number' && (!el.value || el.value === '')) return {};
      formData.append(`${el.name}`, `${el.value}`);
    });

    formData.append('leadSourceName', leadSourceName);

    const apiUrl = '/api/adminDashboard/clients';

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'POST',
      permissionForFetch: 31,
      options: {
        onSuccess: (data) => {
          if (data.change) {
            updateDataWithSocket('singleClient', undefined, {
              data: data.change,
            });
          }

          setFieldErrorsState('');

          updateDataWithSocket('customersList');
        },
        onFieldErrors: (fieldErrors) => {
          if (fieldErrorsState && fieldErrorsState.born_date) {
            setFieldErrorsState({
              ...fieldErrors,
              born_date: fieldErrorsState.born_date,
            });
            return;
          }
          setFieldErrorsState(fieldErrors);
        },
      },
    });
  };

  useEffect(() => {
    setTimeout(() => {
      if (serverErrorMessage) {
        setServerErrorMessage('');
      }

      if (serverSuccessMessage) {
        setServerSuccessMessage('');
      }
    }, 4000);
  }, [serverErrorMessage, serverSuccessMessage]);

  const handleCustomerNameInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setInputsCustomerName((prevState) => {
      let newState = { ...prevState };

      switch (name) {
        case 'nameAndLastname':
          newState.nameAndLastname = value;

          newState.firstName = handleNameAndLastnameChange(newState.nameAndLastname).firstName;
          newState.lastName = handleNameAndLastnameChange(newState.nameAndLastname).lastName;

          if (value === '') {
            newState.salutation = '';
            newState.nickname = '';
            newState.middleInit = '';
            newState.suffix = '';
          }
          break;

        case 'firstName':
          newState.firstName = value;
          break;

        case 'lastName':
          newState.lastName = value;
          break;

        case 'salutation':
          newState.salutation = value;
          break;

        case 'nickname':
          newState.nickname = value;
          break;

        case 'middleInit':
          newState.middleInit = value;
          break;

        case 'suffix':
          newState.suffix = value;
          break;
      }

      if (name !== 'nameAndLastname') {
        newState.nameAndLastname = `${newState.salutation ? `${newState.salutation} ` : ''}${
          newState.firstName ? `${newState.firstName} ` : ''
        }${newState.middleInit ? `${newState.middleInit} ` : ''}${
          newState.nickname ? `'${newState.nickname} '` : ''
        }${newState.lastName ? `${newState.lastName} ` : ''}${
          newState.suffix ? `${newState.suffix}` : ''
        }`;
      }

      return newState;
    });
  };

  const handleNameAndLastnameChange = (nameAndLastname: string) => {
    let newVal = {
      firstName: '',
      lastName: '',
    };

    const stringArray = nameAndLastname.split(' ');

    switch (stringArray.length) {
      case 1:
        newVal.firstName = stringArray[0];
        break;

      case 2:
        newVal.firstName = stringArray[0];
        newVal.lastName = stringArray[1];
        break;

      case 3:
        newVal.firstName = stringArray.slice(0, 2).join(' ');
        newVal.lastName = stringArray[2];
        break;

      case 4:
        newVal.firstName = stringArray.slice(0, 2).join(' ');
        newVal.lastName = stringArray.slice(2, 4).join(' ');
        break;
    }

    return newVal;
  };

  const handleCustomerAddress = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setCustomerAddress((prevState) => {
      let newState = { ...prevState };

      switch (name) {
        case 'currentAddress':
          newState.currentAddress = value;

          newState.street = handleCurrentAddress(newState.currentAddress).street;
          newState.city = handleCurrentAddress(newState.currentAddress).city;
          newState.state = handleCurrentAddress(newState.currentAddress).state;
          setStateId(handleCurrentAddress(newState.currentAddress).stateId);
          newState.zip = handleCurrentAddress(newState.currentAddress).zip;
          newState.county = handleCurrentAddress(newState.currentAddress).county;
          break;

        case 'street':
          newState.street = value;
          break;

        case 'city':
          newState.city = value;
          break;

        case 'state':
          newState.state = statesData?.find((el) => el.id === parseInt(value))?.state || '';
          setStateId(parseInt(value));
          break;

        case 'zip':
          newState.zip = value;
          break;

        case 'county':
          newState.county = value;
          break;
      }

      if (name !== 'currentAddress') {
        newState.currentAddress = `${newState.street ? `${newState.street}, ` : ''}${
          newState.city ? `${newState.city}` : ''
        }${newState.state ? `, ${newState.state}` : ''}${newState.zip ? `, ${newState.zip}` : ''}${
          newState.county ? `, ${newState.county}` : ''
        }`;
      }

      return newState;
    });
  };

  const handleCurrentAddress = (currentAddress: string) => {
    let newVal = {
      street: '',
      city: '',
      state: '',
      zip: '',
      county: '',
      stateId: '',
    };

    const addressArray = currentAddress.split(',');

    switch (addressArray.length) {
      case 1:
        newVal.street = addressArray[0].replace(',', '');
        break;

      case 2:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        break;

      case 3:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        newVal.state =
          statesData?.find(
            (el) =>
              el.state?.trim().toLowerCase() ===
                addressArray[2].replace(',', '').trim().toLowerCase() ||
              el.state_code.toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase(),
          )?.state || '';
        newVal.stateId =
          statesData
            ?.find(
              (el) =>
                el.state?.trim().toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase() ||
                el.state_code.toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase(),
            )
            ?.id?.toString() || '';
        break;

      case 4:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        newVal.state =
          statesData?.find(
            (el) =>
              el.state?.trim().toLowerCase() ===
                addressArray[2].replace(',', '').trim().toLowerCase() ||
              el.state_code.toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase(),
          )?.state || '';
        newVal.stateId =
          statesData
            ?.find(
              (el) =>
                el.state?.trim().toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase() ||
                el.state_code.toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase(),
            )
            ?.id?.toString() || '';
        newVal.zip = addressArray[3].replace(',', '');
        break;

      case 5:
        newVal.street = addressArray[0].replace(',', '');
        newVal.city = addressArray[1].replace(',', '');
        newVal.state =
          statesData?.find(
            (el) =>
              el.state?.trim().toLowerCase() ===
                addressArray[2].replace(',', '').trim().toLowerCase() ||
              el.state_code.toLowerCase() === addressArray[2].replace(',', '').trim().toLowerCase(),
          )?.state || '';
        newVal.stateId =
          statesData
            ?.find(
              (el) =>
                el.state?.trim().toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase() ||
                el.state_code.toLowerCase() ===
                  addressArray[2].replace(',', '').trim().toLowerCase(),
            )
            ?.id?.toString() || '';
        newVal.zip = addressArray[3].replace(',', '');
        newVal.county = addressArray[4].replace(',', '');
        break;
    }

    return newVal;
  };

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    const leadSourceNameSelected = leadSourcesData.find(
      (el) => el.id.toString() === value.toString(),
    );

    setClientLeadSource(value);
    setLeadSourceName(leadSourceNameSelected?.source || '');
  };

  const isValidDate = (date: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  };
  // useEffect(() => {
  //   // si es una fecha completa Y si es una fecha valida y es una fecha futura, mostrar error
  //   if (clientBornDate && !isValidDate(clientBornDate) && new Date(clientBornDate).getTime() > new Date().getTime()) {
  //     setFieldErrors((prev: any) => ({ ...prev, born_date: ['Future dates are not permitted'] }));
  //   }else{
  //     setFieldErrors((prev: any) => ({ ...prev, born_date: undefined }));
  //   }
  // }, [clientBornDate]);

  return (
    <section
      onClick={() => {
        setShowClientOptions(false);
        setShowAddressOptions(false);
      }}
      className={`fixed z-[80] top-0 right-0 bottom-0 left-0 bg-[#0000008A] min-h-full ${
        isCobuyerReferrer ? 'h-[180vh]' : ''
      }`}
      // style={{
      //   minHeight: `${isCobuyerReferrer ? '100%' : '100vh'}`,
      //   top: `${isCobuyerReferrer ? '-17.3%' : '-17.3%'}`,
      // }}
    >
      {/* modal window main body block */}
      <article
        className={`relative w-[82.916667vw] h-[84.351852vh] bg-[#FFFFFF] rounded-[0.520833vw] mt-[7.592592vh] ml-[8.28125vw] pb-[3.240741vh] !max-lg:w-full !max-lg:h-auto !max-lg:mt-0 !max-lg:ml-0 max-lg:rounded-none max-lg:min-h-screen ${
          isCobuyerReferrer ? 'mt-[50vh]' : ''
        }`}
      >
        {/* message from the server */}
        <AnimatePresence>
          {serverSuccessMessage && <SuccessNotification apiMessage={serverSuccessMessage} />}
          {serverErrorMessage && <FailNotification apiMessage={serverErrorMessage} />}
        </AnimatePresence>
        {/* modal window header block */}
        <aside className="w-full h-[9.259259vh] shadow-crmFormShadow flex items-center justify-center pt-[2.037037vh] pb-[1.6vh] max-lg:h-auto max-lg:py-3 max-lg:px-2">
          <div className="w-[79.6875vw] flex flex-row items-center justify-between !max-lg:w-full">
            <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B]">
              Add new Prospect
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleCloseWindow}
            >
              <CloseWindow />
            </motion.button>
          </div>
        </aside>
        {/* modal window content block */}
        <aside>
          <section className="relative w-fit h-fit mt-[5.277778vh] ml-[4.322917vw] flex flex-row items-center max-lg:mt-4 max-lg:ml-2 max-lg:flex-wrap max-lg:gap-2">
            <p className="text-[2.222222vh] font-semibold text-[#00A78B] leading-[1.805556vh] mr-[0.5vw]">
              Type of client
            </p>
            <IconedSelect
              width={8}
              height={4.074074}
              iconTextGap={0.5}
              onClick={handleTypeOfClient}
              options={[
                { value: '1', icon: <IndividualClientIcon />, name: 'Individual' },
                { value: '2', icon: <BusinessClientIcon />, name: 'Business' },
              ]}
              optionsBackgroundColor="#FFF"
              optionsHeight={4}
              optionsNameColor="#20B299"
              optionsWidth={8}
              optionsRadius={0.5}
              defaultText={typeOfClientText}
              backgroundColor="#FFF"
              border={0.104167}
              borderColor="#00A78B"
              borderRadius={1.302083}
              textColor="#20B299"
            />
            <AnimatePresence>
              {fieldErrorsState && fieldErrorsState.type_of_client && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute right-[-11vw] text-[1.666667vh] text-[#F00]"
                >
                  {fieldErrorsState && fieldErrorsState.type_of_client[0]}
                </motion.p>
              )}
            </AnimatePresence>
          </section>
          {/* modal window inputs header block */}
          <div className="w-[78.020833vw] h-[47.685185vh] mt-[3.425926vh] ml-[2.447917vw] !max-lg:w-full max-lg:h-auto max-lg:mt-2 max-lg:ml-0 max-lg:px-2">
            <article className="w-full flex flex-row justify-between items-center py-[2.314815vh] px-[2.083333vw] bg-[#C9EBE6] rounded-t-[1.041667vw]">
              <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B]">
                General Information
              </p>
              <ShowInfo />
            </article>
            {/* modal window inputs block */}
            <article className="w-full h-fit border-b-[0.15625vw] border-l-[0.15625vw] border-r-[0.15625vw] border-[#C9EBE6] rounded-b-[1.041667vw] pt-[2.685185vh] pl-[2.03125vw] pb-[5.833333vh]">
              <aside className="w-[70.260417vw] h-[32.685185vh] !max-lg:w-full max-lg:h-auto">
                {/* first inputs row */}
                <section className="flex flex-row max-lg:flex-col max-lg:gap-4">
                  <div className="relative flex flex-col w-[28.020833vw] mr-[1.302083vw] max-lg:w-full max-lg:mr-0">
                    <label
                      htmlFor="nameAndLastname"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Name and Last name
                    </label>
                    <aside className="flex flex-row">
                      <input
                        type="text"
                        onChange={handleCustomerNameInputs}
                        name="nameAndLastname"
                        id="nameAndLastname"
                        autoComplete="off"
                        placeholder="First Name, Last Name"
                        value={handlingCapitalWords(inputsCustomerName.nameAndLastname)}
                        className="w-[90%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowClientOptions();
                        }}
                        className="w-[10%] h-[5.277778vh] bg-[#F4F4F4] flex justify-center items-center rounded-r-[0.520833vw]"
                      >
                        <ThreeGreenDots />
                      </button>
                    </aside>
                    <AnimatePresence>
                      {fieldErrorsState && fieldErrorsState.name_lastname && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrorsState && fieldErrorsState.name_lastname[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <AnimatePresence>
                      {fieldErrorsState && fieldErrorsState.last_name && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrorsState && fieldErrorsState.name_lastname
                            ? ''
                            : fieldErrorsState && fieldErrorsState.last_name[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    {/* -------------- start modal client options -------------- */}
                    <AnimatePresence>
                      {showClientOptions && (
                        <motion.aside
                          onClick={(e) => e.stopPropagation()}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute bottom-[-35vh] z-40 w-full bg-[#FFF] rounded-[0.520833vw] border-[0.2vw] border-[#C9EBE6]"
                        >
                          <article className="flex flex-col">
                            {/* first row */}
                            <section className="flex flex-row justify-around mt-[1vh]">
                              <div className="relative flex flex-col w-[40%]">
                                <label
                                  htmlFor="salutation"
                                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                                >
                                  Salutation
                                </label>
                                <input
                                  type="text"
                                  onChange={handleCustomerNameInputs}
                                  value={handlingCapitalWords(inputsCustomerName.salutation)}
                                  name="salutation"
                                  id="salutation"
                                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                                />
                                <AnimatePresence>
                                  {fieldErrorsState && fieldErrorsState.salutation && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 1 }}
                                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                                    >
                                      {fieldErrorsState && fieldErrorsState.salutation[0]}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className="relative flex flex-col w-[40%]">
                                <label
                                  htmlFor="nickname"
                                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                                >
                                  Nickname
                                </label>
                                <input
                                  type="text"
                                  onChange={handleCustomerNameInputs}
                                  value={inputsCustomerName.nickname}
                                  name="nickname"
                                  id="nickname"
                                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                                />
                                <AnimatePresence>
                                  {fieldErrorsState && fieldErrorsState.nickname && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 1 }}
                                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                                    >
                                      {fieldErrorsState && fieldErrorsState.nickname[0]}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                            </section>
                            {/* second row */}
                            <section className="flex flex-row justify-around mt-[1vh]">
                              <div className="relative flex flex-col w-[40%]">
                                <label
                                  htmlFor="firstName"
                                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                                >
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  onChange={handleCustomerNameInputs}
                                  value={handlingCapitalWords(inputsCustomerName.firstName)}
                                  name="firstName"
                                  id="firstName"
                                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                                />
                                <AnimatePresence>
                                  {fieldErrorsState && fieldErrorsState.first_name && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 1 }}
                                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                                    >
                                      {fieldErrorsState && fieldErrorsState.first_name[0]}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className="relative flex flex-col w-[40%]">
                                <label
                                  htmlFor="middleInit"
                                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                                >
                                  Middle Initials
                                </label>
                                <input
                                  type="text"
                                  onChange={handleCustomerNameInputs}
                                  value={handlingCapitalWords(inputsCustomerName.middleInit)}
                                  name="middleInit"
                                  id="middleInit"
                                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                                />
                                <AnimatePresence>
                                  {fieldErrorsState && fieldErrorsState.middle_initials && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 1 }}
                                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                                    >
                                      {fieldErrorsState && fieldErrorsState.middle_initials[0]}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                            </section>
                            {/* third row */}
                            <section className="flex flex-row justify-around mt-[1vh] mb-[1vh]">
                              <div className="relative flex flex-col w-[40%]">
                                <label
                                  htmlFor="lastName"
                                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                                >
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  onChange={handleCustomerNameInputs}
                                  value={handlingCapitalWords(inputsCustomerName.lastName)}
                                  name="lastName"
                                  id="lastName"
                                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                                />
                                <AnimatePresence>
                                  {fieldErrorsState && fieldErrorsState.last_name && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 1 }}
                                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                                    >
                                      {fieldErrorsState && fieldErrorsState.last_name[0]}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className="relative flex flex-col w-[40%]">
                                <label
                                  htmlFor="suffix"
                                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                                >
                                  Suffix
                                </label>
                                <input
                                  type="text"
                                  onChange={handleCustomerNameInputs}
                                  value={inputsCustomerName.suffix}
                                  name="suffix"
                                  id="suffix"
                                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                                />
                                <AnimatePresence>
                                  {fieldErrorsState && fieldErrorsState.suffix && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 1 }}
                                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                                    >
                                      {fieldErrorsState && fieldErrorsState.suffix[0]}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                            </section>
                          </article>
                        </motion.aside>
                      )}
                    </AnimatePresence>
                    {/* -------------- end modal client options -------------- */}
                  </div>
                  <div className="relative flex flex-col w-[40.9375vw] max-lg:w-full max-lg:mt-3">
                    <label
                      htmlFor="currentAddress"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Current Address
                    </label>
                    <aside className="flex flex-row">
                      <input
                        type="text"
                        onChange={handleCustomerAddress}
                        value={inputsCustomerAddress.currentAddress}
                        name="currentAddress"
                        autoComplete="off"
                        id="currentAddress"
                        placeholder="Street, City, State, ZIP, County"
                        className="w-[92%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowAddressOptions();
                        }}
                        className="w-[8%] h-[5.277778vh] bg-[#F4F4F4] flex justify-center items-center rounded-r-[0.520833vw]"
                      >
                        <ThreeGreenDots />
                      </button>
                    </aside>
                    <AnimatePresence>
                      {fieldErrorsState && fieldErrorsState.current_address && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrorsState && fieldErrorsState.current_address[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    {/* -------------- start modal address options -------------- */}
                    <AnimatePresence>
                      {showAddressOptions && (
                        <motion.aside
                          onClick={(e) => e.stopPropagation()}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute bottom-[-35vh] z-40 w-full bg-[#FFF] rounded-[0.520833vw] border-[0.2vw] border-[#C9EBE6]"
                        >
                          <article className="flex flex-col">
                            {/* first row */}
                            <section className="flex flex-row justify-center mt-[1vh]">
                              <div className="relative flex flex-col w-[90%]">
                                <label
                                  htmlFor="street"
                                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                                >
                                  Street
                                </label>
                                <input
                                  type="text"
                                  onChange={handleCustomerAddress}
                                  value={inputsCustomerAddress.street}
                                  name="street"
                                  id="street"
                                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                                />
                                <AnimatePresence>
                                  {fieldErrorsState && fieldErrorsState.street && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 1 }}
                                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                                    >
                                      {fieldErrorsState && fieldErrorsState.street[0]}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                            </section>
                            {/* second row */}
                            <section className="flex flex-row justify-center mt-[1vh]">
                              <div className="relative flex flex-col w-[90%]">
                                <label
                                  htmlFor="city"
                                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                                >
                                  City
                                </label>
                                <input
                                  type="text"
                                  onChange={handleCustomerAddress}
                                  value={inputsCustomerAddress.city}
                                  name="city"
                                  id="city"
                                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                                />
                                <AnimatePresence>
                                  {fieldErrorsState && fieldErrorsState.city && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 1 }}
                                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                                    >
                                      {fieldErrorsState && fieldErrorsState.city[0]}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                            </section>
                            {/* third row */}
                            <section className="flex flex-row justify-around mt-[1vh] mb-[1vh]">
                              <div className="relative flex flex-col w-[28%]">
                                <label
                                  htmlFor="state"
                                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                                >
                                  State
                                </label>
                                <select
                                  onChange={handleCustomerAddress}
                                  value={stateId}
                                  name="state"
                                  id="state"
                                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                                >
                                  <option value="" key="">
                                    Select state
                                  </option>
                                  {statesData &&
                                    statesData.map((el) => (
                                      <option key={el.id} value={el.id}>
                                        {el.state}
                                      </option>
                                    ))}
                                </select>
                                <AnimatePresence>
                                  {fieldErrorsState && fieldErrorsState.state && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 1 }}
                                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                                    >
                                      {fieldErrorsState && fieldErrorsState.state[0]}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className="relative flex flex-col w-[28%]">
                                <label
                                  htmlFor="zip"
                                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                                >
                                  ZIP
                                </label>
                                <input
                                  type="text"
                                  onChange={handleCustomerAddress}
                                  value={inputsCustomerAddress.zip}
                                  name="zip"
                                  id="zip"
                                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                                />
                                <AnimatePresence>
                                  {fieldErrorsState && fieldErrorsState.zip && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 1 }}
                                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                                    >
                                      {fieldErrorsState && fieldErrorsState.zip[0]}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className="relative flex flex-col w-[28%]">
                                <label
                                  htmlFor="county"
                                  className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                                >
                                  County
                                </label>
                                <input
                                  type="text"
                                  onChange={handleCustomerAddress}
                                  value={inputsCustomerAddress.county}
                                  name="county"
                                  id="county"
                                  className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                                />
                                <AnimatePresence>
                                  {fieldErrorsState && fieldErrorsState.county && (
                                    <motion.p
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 1 }}
                                      className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                                    >
                                      {fieldErrorsState && fieldErrorsState.county[0]}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </div>
                            </section>
                          </article>
                        </motion.aside>
                      )}
                    </AnimatePresence>
                    {/* -------------- end modal address options -------------- */}
                  </div>
                </section>
                {/* second inputs row */}
                <section className="flex flex-row mt-[1.302083vw] max-lg:flex-col max-lg:gap-4 max-lg:mt-0">
                  <div className="relative flex flex-col w-[16.458333vw]">
                    <label
                      htmlFor="clientPhoneNumber"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      onChange={handleClientPhoneNumber}
                      value={formatPhoneNumber(clientPhoneNumber)}
                      name="clientPhoneNumber"
                      placeholder="(XXX) XXX-XXXX"
                      id="clientPhoneNumber"
                      max={10}
                      min={10}
                      className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none"
                    />
                    <AnimatePresence>
                      {fieldErrorsState && fieldErrorsState.phone_number && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrorsState && fieldErrorsState.phone_number[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative flex flex-col w-[16.458333vw] ml-[1.302083vw] max-lg:w-full max-lg:ml-0">
                    <label
                      htmlFor="clientHomePhoneNumber"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Home Phone Number
                    </label>
                    <input
                      type="text"
                      onChange={handleClientHomePhoneNumber}
                      value={formatPhoneNumber(clientHomePhoneNumber)}
                      name="clientHomePhoneNumber"
                      id="clientHomePhoneNumber"
                      placeholder="(XXX) XXX-XXXX"
                      className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none"
                    />
                    <AnimatePresence>
                      {fieldErrorsState && fieldErrorsState.home_phone_number && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrorsState && fieldErrorsState.home_phone_number[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative flex flex-col w-[16.458333vw] ml-[1.302083vw] max-lg:w-full max-lg:ml-0">
                    <label
                      htmlFor="clientWorkPhoneNumber"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Work Phone Number
                    </label>
                    <input
                      type="text"
                      onChange={handleClientWorkPhoneNumber}
                      value={formatPhoneNumber(clientWorkPhoneNumber)}
                      name="clientWorkPhoneNumber"
                      id="clientWorkPhoneNumber"
                      placeholder="(XXX) XXX-XXXX"
                      className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none"
                    />
                    <AnimatePresence>
                      {fieldErrorsState && fieldErrorsState.work_phone_number && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrorsState && fieldErrorsState.work_phone_number[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative flex flex-col w-[16.458333vw] ml-[1.302083vw] max-lg:w-full max-lg:ml-0">
                    <label
                      htmlFor="clientEmail"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      onChange={handleClientEmail}
                      value={clientEmail}
                      autoComplete="off"
                      name="clientEmail"
                      id="clientEmail"
                      placeholder="example@example.com"
                      className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] outline-none"
                    />
                    <AnimatePresence>
                      {fieldErrorsState && fieldErrorsState.email && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrorsState && fieldErrorsState.email[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </section>
                {/* third inputs row */}
                <section className="flex flex-row mt-[1.602083vw] max-lg:flex-col max-lg:gap-4 max-lg:mt-0">
                  <div className="relative flex flex-col w-[16.458333vw]">
                    <label
                      htmlFor="clientSocialSecurity"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Social Security
                    </label>
                    <div className="flex relative w-full items-center">
                      <input
                        type="text"
                        onChange={handleClientSocialSecurity}
                        value={
                          showSSN
                            ? ssnFormat(clientSocialSecurity)
                            : (() => {
                                const digits = clientSocialSecurity.replaceAll('-', ''); //replace(/\D/g, '');
                                if (digits.length <= 4) return ssnFormat(digits);
                                const visiblePart = digits.slice(-4);
                                const maskedPart = digits.slice(0, -4).replace(/./g, '•');
                                const fullMasked = maskedPart + visiblePart;
                                let formattedMasked = '';
                                if (fullMasked.length > 0)
                                  formattedMasked += fullMasked.slice(0, 3);
                                if (fullMasked.length > 3)
                                  formattedMasked += '-' + fullMasked.slice(3, 5);
                                if (fullMasked.length > 5)
                                  formattedMasked += '-' + fullMasked.slice(5, 9);
                                return formattedMasked;
                              })()
                        }
                        name="clientSocialSecurity"
                        id="clientSocialSecurity"
                        placeholder="AAA-GG-SSSS"
                        className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] pr-[3vw] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSSN(!showSSN)}
                        className="absolute right-[0.6vw] z-10"
                      >
                        {showSSN ? <EyeIcon /> : <EyeClosed />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {fieldErrorsState && fieldErrorsState.social_security && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrorsState && fieldErrorsState.social_security[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative flex flex-col w-[16.458333vw] ml-[1.302083vw] max-lg:w-full max-lg:ml-0">
                    {/* <label
                      htmlFor="clientBornDate"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Born Date
                    </label> */}
                    {/* <input
                      type="date"
                      onChange={handleClientBornDate}
                      value={clientBornDate}
                      name="clientBornDate"
                      id="clientBornDate"
                      max={maxDate}
                      className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    /> */}
                    <Input
                      label="Born Date"
                      name="born_date"
                      value={clientBornDate}
                      type="DottedDate"
                      // width={33.2734375}
                      width={0}
                      // widthFull={true}
                      threeDotsDateInput={true}
                      dayPickerDisabledAfter={new Date()}
                      // noDatePickerYearSelect={true}
                      // disabled={true}
                      optionsPositionTop={true}
                      onChange={handleClientBornDate}
                      onDayPickerClick={(date: Date) => {
                        setClientBornDate(formatIncomingObjectDate(date));
                      }}
                      setFieldErrors={setFieldErrorsState}
                    />
                    <AnimatePresence>
                      {fieldErrorsState && fieldErrorsState.born_date && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrorsState && fieldErrorsState.born_date[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative flex flex-col w-[16.458333vw] ml-[1.302083vw] max-lg:w-full max-lg:ml-0">
                    <label
                      htmlFor="clientLeadType"
                      className="mb-[1.666667vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                    >
                      Lead Type
                    </label>
                    <select
                      onChange={handleClientLeadType}
                      value={clientLeadType}
                      name="clientLeadType"
                      id="clientLeadType"
                      className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    >
                      <option value="">Select lead type</option>
                      {leadTypesData &&
                        leadTypesData.map((el) => (
                          <option key={el.id} value={el.id}>
                            {el.type}
                          </option>
                        ))}
                    </select>
                    <AnimatePresence>
                      {fieldErrorsState && fieldErrorsState.lead_type && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrorsState && fieldErrorsState.lead_type[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="relative h-fit flex items-start justify-start w-[16.458333vw] ml-[1.302083vw] max-lg:w-full max-lg:ml-0">
                    <GenericSelector
                      width={`w-full`}
                      moveSelectedToTop={true}
                      label={'Lead Source'}
                      options={leadSourcesData.map((el) => {
                        return {
                          value: el.id.toString(),
                          name: el.source,
                          identity: 'leadSourceName',
                        };
                      })}
                      selectedIds={clientLeadSource ? [clientLeadSource] : []}
                      onChange={(ids) => {
                        const id = ids.length > 0 ? ids[0] : '';
                        const opt = leadSourcesData.find((o: any) => o.value === id);
                        setClientLeadSource(id);
                        setLeadSourceName(opt?.source || '');
                      }}
                      getOptionId={(opt: any) => opt.value}
                      getOptionLabel={(opt: any) => opt.name}
                      isMultiSelect={false}
                      placeholder="Select..."
                      enableFloating={true}
                      capitalWords
                      loading={loadingLeadSources}
                      // onOpenChange={(isOpen) => {
                      //   if (isOpen) getLeadSources();
                      // }}
                      renderOption={(opt: any, isSelected: boolean, toggle: () => void) => (
                        <div
                          className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-150 mb-1 ${
                            isSelected
                              ? 'bg-teal-50 border border-teal-100'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1" onClick={toggle}>
                            <div className="flex flex-col">
                              <span
                                className={`text-sm capitalize font-medium ${isSelected ? 'text-teal-800' : 'text-slate-700'}`}
                              >
                                {opt.name}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {userAuthenticatedIsAdmin && (
                              <button
                                type="button"
                                title="Edit lead source"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditLeadSourceModal(opt.value, opt.name);
                                }}
                                className="p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-teal-600 transition-all duration-150"
                              >
                                {/* Pencil icon */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                            )}
                            <div
                              onClick={toggle}
                              className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-200 ${
                                isSelected
                                  ? 'bg-teal-600 text-white shadow-sm scale-100'
                                  : 'bg-slate-100 text-transparent scale-90 group-hover:bg-slate-200'
                              }`}
                            >
                              {isSelected && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path
                                    d="M2 5l2.5 2.5L8 3"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    />
                    {editLeadSource &&
                      createPortal(
                        <div
                          className="fixed inset-0 flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 99999999 }}
                          onClick={(e) => {
                            if (e.target === e.currentTarget) closeEditLeadSourceModal();
                          }}
                        >
                          <div
                            className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
                            style={{ minWidth: '22rem', maxWidth: '90vw', zIndex: 100000000 }}
                          >
                            <h3
                              className="text-base font-semibold text-slate-700"
                              style={{ margin: 0 }}
                            >
                              Edit Lead Source
                            </h3>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium text-slate-500">Name</label>
                              <input
                                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                                value={editLeadSourceName}
                                onChange={(e) => {
                                  setEditLeadSourceName(e.target.value);
                                  if (editLeadSourceError) setEditLeadSourceError('');
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveLeadSourceName();
                                  if (e.key === 'Escape') closeEditLeadSourceModal();
                                }}
                                disabled={editLeadSourceLoading}
                                autoFocus
                              />
                              {editLeadSourceError && (
                                <span className="text-xs text-red-500 mt-0.5">
                                  {editLeadSourceError}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 mt-1 justify-end">
                              <button
                                type="button"
                                onClick={closeEditLeadSourceModal}
                                disabled={editLeadSourceLoading}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleDeleteLeadSourceModal}
                                disabled={editLeadSourceLoading}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                              >
                                {editLeadSourceLoading ? 'Deleting...' : 'Delete'}
                              </button>
                              <button
                                type="button"
                                onClick={handleSaveLeadSourceName}
                                disabled={editLeadSourceLoading}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50"
                              >
                                {editLeadSourceLoading ? 'Saving...' : 'Save'}
                              </button>
                            </div>
                          </div>
                        </div>,
                        document.body,
                      )}
                    <AnimatePresence>
                      {fieldErrorsState && fieldErrorsState.leadSourceName && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]"
                        >
                          {fieldErrorsState && fieldErrorsState.leadSourceName[0]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </section>
              </aside>
            </article>
          </div>
          {/* modal window process buttons block */}
          <article className="w-[26vw] flex flex-row justify-between mt-[5.925926vh] ml-[54.15625vw] !max-lg:w-full max-lg:ml-0 max-lg:mt-4 max-lg:px-2 max-lg:flex-col max-lg:gap-2">
            {!isCobuyerReferrer && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleSaveClientAndNew}
                className="w-[13vw] h-[5.462963vh] flex justify-center items-center text-[1.626852vh] font-semibold leading-[2.440741vh] rounded-[0.653646vw] border-[0.15625vw] border-[#00A78B] bg-[#FFFFFF] text-[#00A78B] hover:bg-[#C9EBE6] transition-colors ease-in-out !max-lg:w-full max-lg:h-11 !max-lg:text-sm"
              >
                Save and Add Another Prospect
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleSaveClient}
              className={`w-[11.875vw] h-[5.462963vh] flex justify-center items-center text-[1.626852vh] font-semibold leading-[2.440741vh] rounded-[0.653646vw] bg-[#00A78B] text-[#FFFFFF] hover:bg-opacity-70 transition-opacity ease-in-out !max-lg:w-full max-lg:h-11 !max-lg:text-sm ${
                isCobuyerReferrer && 'ml-[13.7vw]'
              }`}
            >
              Save
            </motion.button>
          </article>
        </aside>
      </article>
    </section>
  );
}
