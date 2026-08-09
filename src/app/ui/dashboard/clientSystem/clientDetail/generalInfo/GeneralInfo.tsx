import { DropdownContent } from '&/modalWindowsStructure/dropdownContent/DropdownContent';
import { Input } from '&/inputs/Input';
import { CustomerInfoInput } from '&/miscellaneous/customerInfoInput/CustomerInfoInput';
import { CustomerVehiclePicker } from '&/miscellaneous/customerVehiclePicker/CustomerVehiclePicker';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { adminDashboardStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { vehiclesDataStore } from '@/store/inventory';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { daysSinceCreationOrEventStore, dateFormatsStore } from '@/store/dateFormats';
import { useSession } from 'next-auth/react';
import { useSocketStore } from '@/store/socketIo';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { DefaultPhoneNumber } from './defaultPhoneNumber/DefaultPhoneNumber';
import { useCan } from '@/hooks/permissions';
import { Can } from '@/app/ui/auth/Can';
import UserAssignmentSelector from '@/app/ui/select/UserAssignmentSelector/UserAssignmentSelector';
import { GenericSelector } from '@/app/ui/select/GenericSelector/GenericSelector';
import { InterestedVehicleData, Users } from '@/app/libs/definitions';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { leadsStore } from '@/store/leads';
import { Permissions } from '@/app/libs/definitions/permissions/permissions';
import { ConfirmNotification } from '&/notifications/Notification';
import { AnimatePresence } from 'framer-motion';

export function GeneralInfo() {
  // ----- global states -----

  const { data: session } = useSession();

  const userId = session?.user.id;

  const userAuthenticatedIsAdmin = session?.user?.user_has?.some(
    (role) => role.role_id === 1 || role.role_id === 2,
  )

  const { singleCLientData } = singleCLientDataStore();
  const { leads, currentLead } = leadsStore();

  const { vehicles } = vehiclesDataStore();

  const { formatPhoneNumber, extractDigits } = phoneNumbersFormatStore();

  const { daysSinceCreationOrEvent } = daysSinceCreationOrEventStore();

  const { dateFormatted } = dateFormatsStore();

  const { updateDataWithSocket } = useSocketStore();

  const { can } = useCan();

  const {
    contactTimeData,
    contactMethodData,
    leadTypesData,
    leadSourcesData,
    inquiryTypeData,
    bdc,
    salesManagers,
    financeManagers,
    sellersData,
    languagesData,
  } = adminDashboardStore();
  const {
    getContactTime,
    getContactMethod,
    getLeadTypes,
    getLeadSources,
    getInquiryType,
    getSellers,
    getBdc,
    getSalesManagers,
    getFinanceManagers,
    getLanguages,
  } = adminDashboardStore();

  const getPromisesData = useCallback(() => {
    return [
      getContactTime(),
      getContactMethod(),
      getLeadTypes(),
      getLeadSources(),
      getInquiryType(),
      getBdc(),
      getSellers(),
      getSalesManagers(),
      getFinanceManagers(),
      getLanguages(),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error } = useLoadingGetData(getPromisesData);

  // ----- local states -----

  useEffect(() => {
    if (singleCLientData && singleCLientData.id) {
      const leadSourceNameSelected = leadSourcesData.find(
        el => el.id.toString() === singleCLientData?.lead_source?.id.toString(),
      );
      setInputs({
        firstname: singleCLientData.first_name,
        lastname: singleCLientData.last_name,
        salutation: singleCLientData.salutation || '',
        nickname: singleCLientData.nickname || '',
        middleInitials: singleCLientData.middle_initials || '',
        suffix: singleCLientData.suffix || '',
        nameLastname: singleCLientData.name_lastname || '',
        interestedVehicle: singleCLientData.interested_vehicle?.id.toString() || '',
        interestedVehicleName: singleCLientData.interested_vehicle?.id
          ? `${singleCLientData.interested_vehicle.vehicle_brands.brand} ${singleCLientData.interested_vehicle.vehicle_models.model}`
          : '',
        mobilePhone: singleCLientData.mobile_phone || '',
        homephone: singleCLientData.home_phone || '',
        workphone: singleCLientData.work_phone || '',
        email: singleCLientData.email || '',
        language: singleCLientData.language?.id.toString() || '',
        contactTime: singleCLientData.contact_time?.id.toString() || '',
        contactMethod: singleCLientData.contact_method?.id.toString() || '',
        leadType: singleCLientData.lead_type?.id?.toString() || '',
        leadSource: singleCLientData?.lead_source?.id.toString() || '',
        leadSourceName: leadSourceNameSelected?.source || '',
        inquiryType: singleCLientData.inquiry_type?.id.toString() || '',
        salesRep: singleCLientData.seller?.id.toString() || '',
        salesRepName: singleCLientData.seller?.id
          ? `${singleCLientData.seller.name} ${singleCLientData.seller.last_name} ${
              singleCLientData.seller.username ? `- ${singleCLientData.seller.username}` : ''
            }`
          : '',
        bdc: singleCLientData.bdc?.id.toString() || '',
        bdcName: singleCLientData.bdc?.id
          ? `${singleCLientData.bdc.name} ${singleCLientData.bdc.last_name} ${
              singleCLientData.bdc.username ? `- ${singleCLientData.bdc.username}` : ''
            }`
          : '',
        financeManager: singleCLientData.finance_manager?.id.toString() || '',
        financeManagerName: singleCLientData.finance_manager?.id
          ? `${singleCLientData.finance_manager.name} ${singleCLientData.finance_manager.last_name} ${
              singleCLientData.finance_manager.username ? `- ${singleCLientData.finance_manager.username}` : ''
            }`
          : '',
        salesManager: singleCLientData.sales_manager?.id.toString() || '',
        salesManagerName: singleCLientData.sales_manager?.id
          ? `${singleCLientData.sales_manager.name} ${singleCLientData.sales_manager.last_name} ${
              singleCLientData.sales_manager.username ? `- ${singleCLientData.sales_manager.username}` : ''
            }`
          : '',
        daysSinceActivity: singleCLientData.last_activity
          ? daysSinceCreationOrEvent(singleCLientData.last_activity)
          : '',
        adId: '',
        daysOld: daysSinceCreationOrEvent(singleCLientData.created_at),
        creationDate: singleCLientData.created_at ? dateFormatted(5, new Date(singleCLientData.created_at)) : '',
        mobileDefault: singleCLientData.mobile_default ? '1' : '',
        homeDefault: singleCLientData.home_default ? '1' : '',
        workDefault: singleCLientData.work_default ? '1' : '',
      });
      if (singleCLientData.interested_vehicle) {
        setInterestedVehicle(singleCLientData.interested_vehicle);
      } else {
        setInterestedVehicle(null);
      }
    }
  }, [singleCLientData, leadSourcesData, daysSinceCreationOrEvent]);

  const [inputs, setInputs] = useState({
    firstname: '',
    lastname: '',
    salutation: '',
    nickname: '',
    middleInitials: '',
    suffix: '',
    nameLastname: '',
    interestedVehicle: '',
    interestedVehicleName: '',
    mobilePhone: '',
    homephone: '',
    workphone: '',
    email: '',
    language: '',
    contactTime: '',
    contactMethod: '',
    leadType: '',
    leadSource: '',
    mobileDefault: '',
    homeDefault: '',
    workDefault: '',
    leadSourceName: '',
    inquiryType: '',
    salesRep: '',
    salesRepName: '',
    bdc: '',
    bdcName: '',
    financeManager: '',
    financeManagerName: '',
    salesManager: '',
    salesManagerName: '',
    daysSinceActivity: '',
    adId: '',
    daysOld: '',
    creationDate: '',
  });
  const [interestedVehicle, setInterestedVehicle] = useState<InterestedVehicleData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    const phoneNumbersInputs = ['mobilePhone', 'homephone', 'workphone'];

    if (phoneNumbersInputs.includes(name)) {
      const newValue = extractDigits(value);

      setInputs(prevState => ({
        ...prevState,
        [name]: newValue,
      }));

      return;
    }

    setInputs(prevState => {
      const newState = { ...prevState };

      newState[name as keyof typeof inputs] = value;

      const usersAndVehicleInputs = ['salesRepName', 'bdcName', 'financeManagerName', 'interestedVehicleName'];

      if (usersAndVehicleInputs.includes(name) && value === '') {
        if (name === 'salesRepName') {
          newState.salesRep = '';
        }

        if (name === 'bdcName') {
          newState.bdc = '';
        }

        if (name === 'financeManagerName') {
          newState.financeManager = '';
        }

        if (name === 'interestedVehicleName') {
          newState.interestedVehicle = '';
        }
      }

      if (name === 'leadSourceName' && newState.leadSource !== '') {
        newState.leadSource = '';
      }

      return newState;
    });
  };

  const handleNameAndLastnameChange = (nameAndLastname: string) => {
    let newVal = {
      firstname: '',
      lastname: '',
    };

    const stringArray = nameAndLastname.split(' ');

    switch (stringArray.length) {
      case 1:
        newVal.firstname = stringArray[0];
        break;

      case 2:
        newVal.firstname = stringArray[0];
        newVal.lastname = stringArray[1];
        break;

      case 3:
        newVal.firstname = stringArray.slice(0, 2).join(' ');
        newVal.lastname = stringArray[2];
        break;

      case 4:
        newVal.firstname = stringArray.slice(0, 2).join(' ');
        newVal.lastname = stringArray.slice(2, 4).join(' ');
        break;
    }

    return newVal;
  };

  const handleCustomerInfoInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setInputs(prevState => {
      const newState = { ...prevState };

      newState[name as keyof typeof inputs] = value;

      if ((name as keyof typeof inputs) === 'nameLastname') {
        const newFirstName = handleNameAndLastnameChange(value).firstname;
        const newLastName = handleNameAndLastnameChange(value).lastname;

        newState.firstname = newFirstName ? newFirstName : '';
        newState.lastname = newLastName ? newLastName : '';

        if (value === '') {
          newState.salutation = '';
          newState.nickname = '';
          newState.middleInitials = '';
          newState.suffix = '';
        }
      }

      if ((name as keyof typeof inputs) !== 'nameLastname') {
        newState.nameLastname = `${newState.salutation ? `${newState.salutation} ` : ''}${
          newState.firstname ? `${newState.firstname} ` : ''
        }${newState.middleInitials ? `${newState.middleInitials} ` : ''}${
          newState.nickname ? `'${newState.nickname}' ` : ''
        }${newState.lastname ? `${newState.lastname} ` : ''}${newState.suffix ? `${newState.suffix}` : ''}`;
      }

      return newState;
    });
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement | HTMLLIElement>) => {
    const { value } = e.currentTarget;
    const { identity, id } = e.currentTarget.dataset;

    if (identity === 'save') {
      const formData = new FormData();

      const ignoreInputs = [
        'interestedVehicleName',
        'salesRepName',
        'bdcName',
        'financeManagerName',
        'salesManagerName',
        'daysOld',
        'daysSinceActivity',
        'creationDate',
      ];

      for (const [name, value] of Object.entries(inputs)) {
        if (!ignoreInputs.includes(name) && value) formData.append(name, value);
      }

      if (userId) formData.append('userId', userId.toString());

      formData.append('currentDate', new Date().toISOString());

      if (inputs.mobilePhone) {
        formData.delete('mobilePhone');
        formData.append('mobilePhone', extractDigits(inputs.mobilePhone));
      }
      if (!inputs.workphone || inputs.workphone === '') formData.delete('work_phone_number');
      if (!inputs.homephone || inputs.homephone === '') formData.delete('home_phone_number');
      // if(!inputs.mobilePhone || inputs.mobilePhone === '' ) formData.delete('mobilePhone');

      const apiUrl = `/api/adminDashboard/singleClient/${singleCLientData?.id}${currentLead ? `?leadId=${currentLead}` : ''}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        options: {
          onSuccess: data => {
            updateDataWithSocket('singleClient', undefined, {
              customerId: singleCLientData?.id,
              data: data,
            });

            updateDataWithSocket('dailyAppointmentsList');
          },
        },
      });
    }

    if (identity === 'interestedVehicle') {
      const vehicleSelected = vehicles?.find(vehicle => vehicle.id.toString() === id);

      const brand = vehicleSelected?.vehicle_brands.brand;
      const model = vehicleSelected?.vehicle_models.model;

      setInputs(prevState => ({
        ...prevState,
        interestedVehicle: id || '',
        interestedVehicleName: `${brand || ''} ${model || ''}`,
      }));
    }

    if (identity === 'salesRep') {
      const salesRepSelected = sellersData?.find(salesRep => salesRep.id.toString() === id);

      const name = salesRepSelected?.name;
      const lastname = salesRepSelected?.last_name;
      const username = salesRepSelected?.username;

      setInputs(prevState => ({
        ...prevState,
        salesRep: id || '',
        salesRepName: `${name || ''} ${lastname || ''} ${username ? `- ${username}` : ''}`,
      }));
    }

    if (identity === 'bdc' && typeof value === 'string') {
      const bdcSelected = bdc?.find(bdcRep => bdcRep.id.toString() === value);

      const name = bdcSelected?.name;
      const lastname = bdcSelected?.last_name;
      const username = bdcSelected?.username;

      setInputs(prevState => ({
        ...prevState,
        bdc: value || '',
        bdcName: `${name || ''} ${lastname || ''} ${username ? `- ${username}` : ''}`,
      }));
    }

    if (identity === 'salesManager' && typeof value === 'string') {
      const salesManagerSelected = salesManagers?.find(salesManager => salesManager.id.toString() === value);

      const name = salesManagerSelected?.name;
      const lastname = salesManagerSelected?.last_name;
      const username = salesManagerSelected?.username;

      setInputs(prevState => ({
        ...prevState,
        salesManager: value || '',
        salesManagerName: `${name || ''} ${lastname || ''} ${username ? `- ${username}` : ''}`,
      }));
    }

    if (identity === 'financeManager' && typeof value === 'string') {
      const financeManagerSelected = financeManagers?.find(financeManager => financeManager.id.toString() === value);

      const name = financeManagerSelected?.name;
      const lastname = financeManagerSelected?.last_name;
      const username = financeManagerSelected?.username;

      setInputs(prevState => ({
        ...prevState,
        financeManager: value || '',
        financeManagerName: `${name || ''} ${lastname || ''} ${username ? `- ${username}` : ''}`,
      }));
    }

    if (identity === 'leadSource') {
      const leadSourceNameSelected = leadSourcesData.find(el => el.id.toString() === value.toString());

      setInputs(prevState => ({
        ...prevState,
        leadSource: value.toString(),
        leadSourceName: leadSourceNameSelected?.source || '',
      }));
    }
  };

  // ---- lead source edit modal state ----
  const [editLeadSource, setEditLeadSource] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editLeadSourceName, setEditLeadSourceName] = useState('');
  const [editLeadSourceLoading, setEditLeadSourceLoading] = useState(false);
  const [editLeadSourceError, setEditLeadSourceError] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
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
      const res = await fetch(`/api/adminDashboard/leadSources/${editLeadSource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: editLeadSourceName.trim() }),
      });
      const data = await res.json();
      if (data.serverError || data.fieldError) {
        setEditLeadSourceError(data.serverError || data.fieldError);
      } else {
        setLoadingLeadSources(true);
        getLeadSources().finally(() => {
          setLoadingLeadSources(false);
        });
        updateDataWithSocket('leadSources');

        if (inputs.leadSource === editLeadSource.id) {
          setInputs(prev => ({ ...prev, leadSourceName: editLeadSourceName.trim() }));
        }
        closeEditLeadSourceModal();
      }
    } catch {
      setLoadingLeadSources(false);
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
      const res = await fetch(`/api/adminDashboard/leadSources/${editLeadSource.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.serverError) {
        setEditLeadSourceError(data.serverError);
      } else {
        // If the deleted one was selected, clear the selection
        if (inputs.leadSource === editLeadSource.id) {
          setInputs(prev => ({ ...prev, leadSource: '', leadSourceName: '' }));
        }
        setLoadingLeadSources(true);
        getLeadSources().finally(() => {
          setLoadingLeadSources(false);
        });
        updateDataWithSocket('leadSources');
        closeEditLeadSourceModal();
      }
    } catch {
      setEditLeadSourceError('An error occurred. Please try again.');
    } finally {
      setEditLeadSourceLoading(false);
      setShowConfirmDelete(false);
    }
  };

  const handleDeleteDecision = (decision: boolean) => {
    if (decision) {
      handleDeleteLeadSourceModal();
    } else {
      setShowConfirmDelete(false);
    }
  };

  const handleDeleteLeadSource = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget.dataset;

    if (id) {
      const formData = new FormData();

      const apiUrl = `/api/adminDashboard/leadSources/${id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'DELETE',
        options: {
          onSuccess: () => {
            updateDataWithSocket('leadSources');
          },
        },
      });
    }
  };

  const inputDataOne = [
    {
      id: 1,
      value: formatPhoneNumber(inputs.mobilePhone),
      name: 'mobilePhone',
      label: 'Phone Number',
      type: 'text',
      width: 16.458333,
      countryPhoneCode: singleCLientData?.country_code?.code,
      extraComponent: (
        <Can requiredPermission={67}>
          <DefaultPhoneNumber
            customerId={singleCLientData?.id}
            defaultNumber={inputs.mobileDefault}
            mobilePhone
            phoneNumber={inputs.mobilePhone}
          />
        </Can>
      ),
      disabled: !can(67),
    },
    {
      id: 2,
      value: inputs.email,
      name: 'email',
      label: 'Email',
      type: 'text',
      width: 16.458333,
      disabled: !can(67),
    },
    {
      id: 3,
      value: inputs.language,
      name: 'language',
      label: 'Preferred Language',
      type: 'select',
      options: languagesData?.map(el => {
        return { value: el.id, option: el.language };
      }),
      width: 16.458333,
      disabled: !can(67),
    },
  ];

  const inputDataTwo = [
    {
      id: 4,
      value: formatPhoneNumber(inputs.homephone),
      name: 'homephone',
      label: 'Home Phone Number',
      type: 'text',
      width: 16.458333,
      extraComponent: (
        <Can requiredPermission={67}>
          <DefaultPhoneNumber
            customerId={singleCLientData?.id}
            defaultNumber={inputs.homeDefault}
            homePhone
            phoneNumber={inputs.homephone}
          />
        </Can>
      ),
      disabled: !can(67),
    },
    {
      id: 5,
      value: formatPhoneNumber(inputs.workphone),
      name: 'workphone',
      label: 'Work Phone Number',
      type: 'text',
      width: 16.458333,
      disabled: !can(67),
    },
  ];

  const inputDataThree = [
    {
      id: 6,
      value: inputs.contactTime,
      name: 'contactTime',
      label: 'Contact Time',
      type: 'select',
      options: contactTimeData?.map(el => {
        return { value: el.id, option: el.time };
      }),
      width: 7.6,
      disabled: !can(67),
    },
    {
      id: 7,
      value: inputs.contactMethod,
      name: 'contactMethod',
      label: 'Contact Method',
      type: 'select',
      options: contactMethodData?.map(el => {
        return { value: el.id, option: el.method };
      }),
      width: 7.6,
      disabled: !can(67),
    },
  ];

  const inputDataFour = [
    {
      id: 8,
      value: inputs.leadType,
      name: 'leadType',
      label: 'Lead Type',
      type: 'select',
      options: leadTypesData?.map(el => {
        return { value: el.id, option: el.type };
      }),
      width: 16.458333,
      disabled: !can(67),
    },
    {
      id: 9,
      value: inputs.leadSourceName,
      selectedId: inputs.leadSource,
      name: 'leadSourceName',
      label: 'Lead Source',
      type: '',
      adderOptions: leadSourcesData?.map(el => {
        return { value: el.id.toString(), name: el.source, identity: 'leadSource' };
      }),
      width: 16.458333,
      adderSelect: true,
      disabled: !can(67),
    },
    {
      id: 10,
      value: inputs.inquiryType,
      name: 'inquiryType',
      label: 'Inquiry Type',
      type: 'select',
      options: inquiryTypeData?.map(el => {
        return { value: el.id, option: el.type };
      }),
      width: 16.458333,
      disabled: !can(67),
    },
    {
      id: 11,
      value: inputs.adId,
      name: 'adId',
      label: 'AD ID',
      type: 'select',
      options: [{ value: 1, option: 'None' }],
      width: 8.90625,
      disabled: !can(67),
    },
  ];

  const inputDataFive = [
    {
      id: 17,
      value: inputs.creationDate,
      name: 'creationDate',
      label: 'Creation Date',
      type: 'text',
      disabled: true,
      noDisabledBgColor: true,
      width: 16.458333,
    },
    {
      id: 12,
      value: inputs.daysOld,
      name: 'daysOld',
      label: 'Days Old',
      type: 'text',
      disabled: true,
      noDisabledBgColor: true,
      width: 16.458333,
    },
    {
      id: 13,
      value: inputs.daysSinceActivity,
      name: 'daysSinceActivity',
      label: 'Days Since Activity',
      type: 'text',
      disabled: true,
      noDisabledBgColor: true,
      width: 16.458333,
    },
  ];

  const inputDataSix = [
    {
      id: 14,
      label: 'BDC Assigned',
      name: 'bdc',
      onChange: handleChange,
      onClick: handleButton,
      optionsBackgroundColor: '#FFF',
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      optionsRadius: 0.5,
      optionsWidth: 19,
      // value: inputs.bdcName,
      value: singleCLientData?.bdc?.id.toString(),
      width: 19,
      options: bdc || [],
      disabled: !can(69),
    },
    {
      id: 15,
      label: 'Sales Manager Assigned',
      name: 'salesManager',
      onChange: handleChange,
      onClick: handleButton,
      optionsBackgroundColor: '#FFF',
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      optionsRadius: 0.5,
      optionsWidth: 19,
      // value: inputs.salesManagerName,
      value: singleCLientData?.sales_manager?.id.toString(),
      width: 19,
      options: salesManagers || [],
      disabled: !can(69),
    },
    {
      id: 16,
      label: 'Finance Manager Assigned',
      name: 'financeManager',
      onChange: handleChange,
      onClick: handleButton,
      optionsBackgroundColor: '#FFF',
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      optionsRadius: 0.5,
      optionsWidth: 19,
      // value: inputs.financeManagerName,
      value: singleCLientData?.finance_manager?.id.toString(),
      width: 19,
      options: financeManagers || [],
      disabled: !can(69),
    },
  ];

  return (
    <DropdownContent
      title="General Information"
      overflowVisible
      loading={loading || loadingFetch}
      buttonComponent={
        <Can requiredPermission={[67, 68, 69]}>
          <ButtonContainer marginTop={2}>
            <Button
              backgroundColor="#00A78B"
              identity="save"
              textColor="#FFF"
              buttonText="Save"
              width={12}
              disabled={loading || loadingFetch}
              onClick={handleButton}
            />
          </ButtonContainer>
        </Can>
      }
    >
      <ContentRow cols={4} gap={4} marginTop={1}>
        <CustomerInfoInput
          firstname={inputs.firstname}
          lastname={inputs.lastname}
          middleInitials={inputs.middleInitials}
          nickname={inputs.nickname}
          suffix={inputs.suffix}
          salutation={inputs.salutation}
          width={16.458333}
          name="nameLastname"
          nameLastname={inputs.nameLastname}
          fieldErrors={fieldErrors}
          disabled={!can(67)}
          noDisabledBgColor
          onChange={handleCustomerInfoInput}
        />
        {inputDataOne.map((el, index) => (
          <Input
            key={`${el.id - 13}gralinfo${index * index + 1}`}
            label={el.label}
            name={el.name}
            type={el.type}
            value={el.value}
            width={el.width}
            options={el.options}
            specialComponent={el.extraComponent}
            onChange={handleChange}
            disabled={el.disabled}
            noDisabledBgColor
            countryPhoneCode={el.countryPhoneCode}
            fieldErrors={fieldErrors}
          />
        ))}
      </ContentRow>
      <ContentRow cols={5} gap={4} marginTop={3}>
        {inputDataTwo.map((el, index) => (
          <Input
            key={`${el.id - 13}gralinfo${index * index + 1}`}
            label={el.label}
            name={el.name}
            type={el.type}
            value={el.value}
            width={el.width}
            specialComponent={el.extraComponent}
            onChange={handleChange}
            disabled={el.disabled}
            noDisabledBgColor
            fieldErrors={fieldErrors}
          />
        ))}
        <CustomerVehiclePicker
          name="interestedVehicleName"
          selectedId={interestedVehicle?.id?.toString()}
          onSelect={(id, vehicleSelected) => {
            setInputs(prev => ({
              ...prev,
              interestedVehicle: id,
              interestedVehicleName: vehicleSelected
                ? `${vehicleSelected.vehicle_brands?.brand || ''} ${vehicleSelected.vehicle_models?.model || ''}`
                : '',
            }));
            setInterestedVehicle(vehicleSelected as InterestedVehicleData);
          }}
          width={16.458333}
          disabled={!can(Permissions.CustomerEstablishInterestedVehicle)}
          fieldErrors={fieldErrors}
          vehicleAsigned={interestedVehicle as any}
          clientIsSold={
            leads && leads.length > 0
              ? leads.find(el => el.is_active === true)?.customer_status?.id === CustomersStatuses.Sold
              : undefined
          }
          customerId={singleCLientData?.id}
          userId={userId ? parseInt(userId.toString()) : undefined}
        />
        {inputDataThree.map((el, index) => (
          <Input
            key={`${el.id - 13}gralinfo${index * index + 1}`}
            label={el.label}
            name={el.name}
            type={el.type}
            value={el.value}
            width={el.width}
            options={el.options}
            onChange={handleChange}
            disabled={el.disabled}
            noDisabledBgColor
            fieldErrors={fieldErrors}
          />
        ))}
      </ContentRow>
      {editLeadSource &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 99999999 }}
            onClick={e => {
              if (e.target === e.currentTarget) closeEditLeadSourceModal();
            }}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
              style={{ minWidth: '22rem', maxWidth: '90vw', zIndex: 100000000 }}
            >
              <h3 className="text-base font-semibold text-slate-700" style={{ margin: 0 }}>
                Edit Lead Source
              </h3>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-500">Name</label>
                <input
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
                  value={editLeadSourceName}
                  onChange={e => {
                    setEditLeadSourceName(e.target.value);
                    if (editLeadSourceError) setEditLeadSourceError('');
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSaveLeadSourceName();
                    if (e.key === 'Escape') closeEditLeadSourceModal();
                  }}
                  disabled={editLeadSourceLoading}
                  autoFocus
                />
                {editLeadSourceError && <span className="text-xs text-red-500 mt-0.5">{editLeadSourceError}</span>}
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
                  onClick={() => setShowConfirmDelete(true)}
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

      {showConfirmDelete &&
        createPortal(
          <div style={{ zIndex: 100000001, position: 'relative' }}>
            <ConfirmNotification
              notiMessage="Are you sure you want to delete this lead source?"
              onDecision={handleDeleteDecision}
              loading={editLeadSourceLoading}
            />
          </div>,
          document.body,
        )}
      <ContentRow cols={4} gap={4} marginTop={3}>
        {inputDataFour.map((el, index) =>
          el.adderSelect ? (
            <div key={`${el.id - 13}gralinfo${index * index + 1}`} className="relative flex flex-col">
              <GenericSelector
                width={`w-[${el.width}vw]`}
                label={el.label}
                options={el.adderOptions || []}
                selectedIds={(el as any).selectedId ? [(el as any).selectedId] : []}
                onChange={ids => {
                  const id = ids.length > 0 ? ids[0] : '';
                  const opt = el.adderOptions?.find((o: any) => o.value === id);
                  setInputs(prev => ({
                    ...prev,
                    leadSource: id,
                    leadSourceName: opt?.name || '',
                  }));
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
                      isSelected ? 'bg-teal-50 border border-teal-100' : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1" onClick={toggle}>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm capitalize  font-medium ${isSelected ? 'text-teal-800' : 'text-slate-700'}`}
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
                          onClick={e => {
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
              <AnimatePresence>
                {fieldErrors && fieldErrors.leadSourceName && (
                  <p className="absolute bottom-[-2.4vh] text-[1.666667vh] text-[#F00]">
                    {fieldErrors && fieldErrors.leadSourceName[0]}
                  </p>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Input
              key={`${el.id - 13}gralinfo${index * index + 1}`}
              label={el.label}
              name={el.name}
              type={el.type}
              value={el.value}
              width={el.width}
              options={el.options}
              onChange={handleChange}
              disabled={el.disabled}
              noDisabledBgColor
              fieldErrors={fieldErrors}
            />
          ),
        )}
      </ContentRow>
      <ContentRow cols={4} gap={4} marginTop={3}>
        {inputDataFive.map((el, index) => (
          <Input
            key={`${el.id - 13}gralinfo${index * index + 1}`}
            label={el.label}
            name={el.name}
            type={el.type}
            value={el.value}
            width={el.width}
            disabled={el.disabled}
            noDisabledBgColor
            onChange={handleChange}
            fieldErrors={fieldErrors}
          />
        ))}
      </ContentRow>
      <ContentRow cols={3} gap={4} marginTop={2.6} marginBottom={2}>
        <UserAssignmentSelector
          width={`w-[25.8vw]`}
          label={'Sales Rep'}
          users={(sellersData as Users) || []}
          isMultiSelect={false}
          // defaultValue={inputs.salesRep ? [inputs.salesRep] : []}
          defaultValue={singleCLientData?.seller ? [singleCLientData.seller.id.toString()] : []}
          onChange={selectedIds => {
            setInputs(prevState => ({
              ...prevState,
              salesRep: selectedIds.length > 0 ? selectedIds[0] : '',
            }));
          }}
        />
        {inputDataSix.slice(0, 1).map((el, index) => (
          <UserAssignmentSelector
            key={`sl-${el.name}-${el.id}`}
            users={el.options || []}
            defaultValue={el.value ? [el.value] : []}
            width={`w-[25.8vw]`}
            label={el.label}
            isMultiSelect={false}
            onChange={selectedIds => {
              setInputs(prevState => ({
                ...prevState,
                [el.name]: selectedIds.length > 0 ? selectedIds[0] : '',
              }));
            }}
          />
        ))}
      </ContentRow>
      <ContentRow cols={3} gap={4} marginTop={2.6} marginBottom={2}>
        {inputDataSix.slice(1).map((el, index) => (
          <UserAssignmentSelector
            key={`sl-${el.name}-${el.id}`}
            users={el.options || []}
            defaultValue={el.value ? [el.value] : []}
            width={`w-[25.8vw]`}
            label={el.label}
            isMultiSelect={false}
            onChange={selectedIds => {
              setInputs(prevState => ({
                ...prevState,
                [el.name]: selectedIds.length > 0 ? selectedIds[0] : '',
              }));
            }}
          />
        ))}
      </ContentRow>
    </DropdownContent>
  );
}
