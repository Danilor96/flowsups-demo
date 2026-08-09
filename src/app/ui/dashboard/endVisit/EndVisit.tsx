import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { Input } from '&/inputs/Input';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import {
  adminDashboardStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ConfirmNotification } from '&/notifications/Notification';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { useSocketStore } from '@/store/socketIo';
import { Loader } from '&/miscellaneous/loader/Loader';
import { EndVisitInput } from './endVisitInput/EndVisitInput';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { Button } from '&/buttons/Button';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { MultiOptionsSelect } from '../../miscellaneous/multiOptionsSelect/MultiOptionsSelect';
import { AddOtherVehicleModal } from '../reports/salesLog/salesLogStatistics/salesScore/addOther/AddVehicleModal';
import { EndVisitVehiclePicker } from './endVisitVehiclePicker/EndVisitVehiclePicker';
import { leadsStore } from '@/store/leads';

enum AvailableChangesStatuses {
  Delivery = '4',
  ShowUp = '7',
  Deposit = '9',
  Sold = '10',
}

interface OtherVehicle {
  id: number;
  year: string;
  make: string;
  model: string;
  stock_no: string;
  vin: string;
}

export function EndVisit({
  appointmentId,
  customer,
  leadType,
  salesRep,
  sellerId,
  address,
  salesManagerId,
  email,
  homePhone,
  customerId,
  mobilePhone,
  vehicleId,
  workPhone,
  fromCustomerDetail,
  toggleOpen,
}: {
  appointmentId?: string;
  salesManagerId?: number;
  salesRep: string;
  sellerId?: number | null;
  leadType: string;
  customer: string;
  customerId: number;
  homePhone: string;
  address: string;
  workPhone: string;
  email: string;
  mobilePhone: string;
  vehicleId?: number;
  fromCustomerDetail?: boolean;
  toggleOpen: () => void;
}) {
  // ----- global states -----
  const { clearSingleClientData } = singleCLientDataStore();

  const { salesManagers, depositOpenedFromEndVisit, endVisitWithDeposit, sellersData } =
    adminDashboardStore();
  const { getSalesManagers, getSellers, setDepositOpenedFromEndVisit, setEndVisitWithDeposit } =
    adminDashboardStore();

  const { openCloseIconedSelectOptions, openClientDetail, openSetUpADeal, openDeposit } =
    modalWindowStore();

  const { formatPhoneNumber, extractDigits } = phoneNumbersFormatStore();

  const { updateDataWithSocket } = useSocketStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { getSingleClientData } = singleCLientDataStore();

  const { getLeads } = leadsStore();

  const getPromiseData = useCallback(() => {
    return [getSalesManagers(), getSellers()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [loadingName, setLoadingName] = useState('');
  const [startSaveChanges, setStartSaveChanges] = useState(false);

  const [salesManagersArray, setSalesManagersArray] =
    useState<{ value: number; option: string }[]>();

  const inputEditedRef = useRef<NodeJS.Timeout | null>(null);

  const handleAddressFormatted = (addressText: string) => {
    if(!addressText) return '';
    const addressTextSplitted = addressText.split(',');
    
    let textFormatted = '';

    for (let i = 0; i < addressTextSplitted.length; i++) {
      const words = addressTextSplitted[i];

      textFormatted = `${textFormatted}${words.trimStart()}${
        i === addressTextSplitted.length - 1 ? '' : ', '
      }`;
    }

    return textFormatted;
  };

  const [inputs, setInputs] = useState({
    managerTurnoverYes: '',
    managerTurnoverNo: '',
    note: '',
    assignedManager: salesManagerId?.toString() || '',
    location: '',
    decision: '',
    prospect: customer,
    address: handleAddressFormatted(address),
    email: email,
    home: homePhone,
    work: workPhone,
    cell: mobilePhone,
    vehicleId: vehicleId?.toString() || '',
    deliveryStartDate: '',
  });
  const [sellerIds, setSellerIds] = useState<string[]>(sellerId ? [sellerId.toString()] : []);
  const [showConfirmDecision, setShowConfirmDecision] = useState<boolean>(false);
  const [cancelVisitWarning, setCancelVisitWarning] = useState('');
  const [splitSold, setSplitSold] = useState({ splitSoldYes: '', splitSoldNo: '' });
  const regularInputs = ['prospect', 'address', 'email', 'home', 'work', 'cell', 'location'];

  // New state for Other Vehicle
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [selectedOtherVehicle, setSelectedOtherVehicle] = useState<OtherVehicle | null>(
    vehicleId
      ? {
          id: vehicleId,
          make: '',
          model: '',
          year: '',
          stock_no: '',
          vin: '',
        }
      : null,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    if (e.currentTarget instanceof HTMLInputElement && !regularInputs.includes(name)) {
      const { checked } = e.currentTarget;

      setInputs((prevState) => {
        const newState = { ...prevState };

        switch (name) {
          case 'managerTurnoverYes':
            newState.managerTurnoverYes = checked ? '1' : '';
            newState.managerTurnoverNo = '';
            break;

          case 'managerTurnoverNo':
            newState.managerTurnoverNo = checked ? '1' : '';
            newState.managerTurnoverYes = '';
            break;

          case 'note':
            newState.note = value;
            break;
        }

        return newState;
      });

      return;
    }

    const phoneNumbersInputs = ['home', 'work', 'cell'];

    if (phoneNumbersInputs.includes(name)) {
      const newValue = extractDigits(value);

      setInputs((prevState) => ({
        ...prevState,
        [name]: newValue,
      }));

      setStartSaveChanges(true);

      setLoadingName(name);

      return;
    }

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const ignoreName = ['decision', 'assignedManager'];

    if (!ignoreName.includes(name)) setStartSaveChanges(true);

    setLoadingName(name);
  };

  useEffect(() => {
    if (startSaveChanges) {
      handleSaveEditedInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inputs.address,
    inputs.cell,
    inputs.home,
    inputs.work,
    inputs.prospect,
    inputs.email,
    startSaveChanges,
  ]);

  const handleSaveEditedInfo = () => {
    if (inputEditedRef.current) clearTimeout(inputEditedRef.current);

    inputEditedRef.current = setTimeout(async () => {
      const formData = new FormData();

      const requireInputs = [
        'address',
        'cell',
        'home',
        'work',
        'prospect',
        'email',
        'assignedManager',
      ];

      const numbersInputs = ['cell', 'home', 'work'];

      for (const [name, value] of Object.entries(inputs)) {
        if (requireInputs.includes(name)) {
          formData.append(name, numbersInputs.includes(name) ? extractDigits(value) : value);
        }
      }

      const apiUrl = `/api/endVisitCustomerInfoEdited/${customerId}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 8,
        options: {
          onSuccess: () => {
            updateDataWithSocket('dailyAppointmentsList');

            updateDataWithSocket('singleClient', undefined, {
              customerId,
            });

            setLoadingName('');
          },
          onError: () => setLoadingName(''),
          onFieldErrors: () => setLoadingName(''),
        },
        noLoadingWhileFetch: true,
        noShowMessage: true,
      });
    }, 1500);
  };

  const handleSplitSoldDecision = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    if (e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;
      const newState = { ...splitSold };
      switch (name) {
        case 'splitSoldYes':
          newState.splitSoldYes = checked ? '1' : '';
          newState.splitSoldNo = '';
          break;

        case 'splitSoldNo':
          newState.splitSoldNo = checked ? '1' : '';
          newState.splitSoldYes = '';
          break;
      }

      setSplitSold(newState);
    }
  };

  const [dealMessage, setDealMessage] = useState('');

  const [deliveryTimeError, setDeliveryTimeError] = useState<{
    [key: string]: [string | undefined];
  }>();

  const [loadingDeposit, setLoadingDeposit] = useState(false);

  const validationForDeposit = () => {
    const {
      address,
      cell,
      assignedManager,
      vehicleId,
      email,
      managerTurnoverNo,
      managerTurnoverYes,
      prospect,
    } = inputs;

    const [street, city, state, zip, county] = address.split(',');

    if (
      !cell ||
      !assignedManager ||
      !vehicleId ||
      !email ||
      (!managerTurnoverNo && !managerTurnoverYes) ||
      !prospect ||
      !street ||
      !city ||
      !state ||
      !zip
    ) {
      setManualFieldErrors({
        address: !address ? ['Require'] : [undefined],
        cell: !cell ? ['Require'] : [undefined],
        assignedManager: !assignedManager ? ['Require'] : [undefined],
        vehicleId: !vehicleId ? ['Require'] : [undefined],
        email: !email ? ['Require'] : [undefined],
        managerTurnoverYes:
          !managerTurnoverYes && !managerTurnoverNo ? ['Require "yes" or "no"'] : [undefined],
        prospect: !prospect ? ['Require'] : [undefined],
      });

      return false;
    }

    return true;
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch, setManualFieldErrors } = useAsyncFetching();

  const handleEndVisit = async (decision: boolean) => {
    if (decision) {
      if (inputs.decision === AvailableChangesStatuses.Delivery && !inputs.deliveryStartDate) {
        setDeliveryTimeError({ deliveryError: ['Date require'] });

        return;
      }
      setDeliveryTimeError(undefined);

      const formData = new FormData();

      for (const [name, value] of Object.entries(inputs)) {
        formData.append(name, value);
      }

      formData.append('sellerIds', sellerIds.join(','));

      appointmentId && formData.append('appointmentId', appointmentId);

      if (parseInt(inputs.decision) === CustomersStatuses.Deposit && !depositOpenedFromEndVisit) {
        if (!validationForDeposit()) return;
        setLoadingDeposit(true);

        setDepositOpenedFromEndVisit(true);

        await getLeads(customerId);

        await getSingleClientData(customerId.toString());

        openClientDetail();

        openDeposit();

        setShowConfirmDecision(false);

        setLoadingDeposit(false);

        return;
      }

      const apiUrl = `/api/adminDashboard/endVisit/${customerId}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        options: {
          onSuccess: () => {
            updateDataWithSocket('dailyAppointmentsList');

            setEndVisitWithDeposit(false);

            setDepositOpenedFromEndVisit(false);

            if (inputs.decision === '10') {
              setShowConfirmDecision(false);

              updateDataWithSocket('dailyTotals');

              setDealMessage('Do you want to make a deal with this customer?');
            } else {
              if (!fromCustomerDetail) clearSingleClientData();

              openCloseIconedSelectOptions();

              toggleOpen();
            }

            updateDataWithSocket('singleClient', undefined, {
              customerId,
            });
          },
          onError: () => {
            setShowConfirmDecision(false);
            setInputs((prevState) => ({
              ...prevState,
              decision: '1',
            }));
          },
          onFieldErrors: () => {
            setShowConfirmDecision(false);
            setInputs((prevState) => ({
              ...prevState,
              decision: '1',
            }));
          },
        },
      });
    } else {
      setShowConfirmDecision(false);
      setDeliveryTimeError(undefined);
      setInputs((prevState) => ({
        ...prevState,
        decision: '',
      }));
    }
  };

  const handlePickVehicle = (e: string) => {
    setSelectedOtherVehicle({
      id: Number(e),
      year: '',
      make: '',
      model: '',
      stock_no: '',
      vin: '',
    });
    setInputs((prevState) => ({
      ...prevState,
      vehicleId: e,
    }));
  };

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (cancelVisitWarning) {
        await handleCancelVisit();
      } else {
        openClientDetail();

        await getLeads(customerId);

        await getSingleClientData(customerId.toString());

        openSetUpADeal();
      }
    } else {
      if (cancelVisitWarning) {
        setCancelVisitWarning('');
      } else {
        setDealMessage('');

        clearSingleClientData();

        openCloseIconedSelectOptions();
      }
    }
  };

  useEffect(() => {
    if (inputs.decision !== '' && inputs.decision !== '1') {
      setShowConfirmDecision(true);
    }
  }, [inputs.decision]);

  const decisionOptions = [
    {
      value: 4,
      option: 'Delivery',
    },
    {
      value: 7,
      option: 'Show Up',
    },
    {
      value: 9,
      option: 'Deposit',
    },
    {
      value: 10,
      option: 'Sold',
    },
  ];

  const inputData = [
    {
      id: 1,
      name: 'prospect',
      value: inputs.prospect,
      type: 'text',
      width: 7.8,
      label: 'Prospect',
    },
    {
      id: 2,
      name: 'address',
      value: inputs.address,
      type: 'text',
      width: 8,
      label: 'Address',
      placeholder: 'Street, City, State, ZIP, County',
    },
    {
      id: 3,
      name: 'email',
      value: inputs.email,
      type: 'text',
      width: 9,
      label: 'Email',
    },
  ];

  const inputData2 = [
    {
      id: 4,
      name: 'home',
      value: formatPhoneNumber(inputs.home),
      type: 'text',
      width: 6.5,
      label: 'Home',
    },
    {
      id: 5,
      name: 'work',
      value: formatPhoneNumber(inputs.work),
      type: 'text',
      width: 6.5,
      label: 'Work',
    },
    {
      id: 6,
      name: 'cell',
      value: formatPhoneNumber(inputs.cell),
      type: 'text',
      width: 6.5,
      label: 'Cell',
    },
  ];

  const cardInfo3 = [
    {
      id: 9,
      name: 'Manager Turnover?',
      inputs: [
        {
          id: 10,
          label: '',
          chekcboxText: 'Yes',
          textAlterColor: '#41B4A0',
          name: 'managerTurnoverYes',
          type: 'checkbox',
          width: 0,
          value: inputs.managerTurnoverYes,
          onChange: handleChange,
        },
        {
          id: 11,
          label: '',
          chekcboxText: 'No',
          textAlterColor: '#41B4A0',
          name: 'managerTurnoverNo',
          type: 'checkbox',
          width: 0,
          value: inputs.managerTurnoverNo,
          onChange: handleChange,
        },
      ],
    },
    {
      id: 12,
      name: '',
      inputs: [
        {
          id: 13,
          label: '',
          textAlterColor: '#41B4A0',
          name: 'note',
          type: 'text',
          width: 0,
          value: inputs.note,
          chekcboxText: 'No',
          onChange: handleChange,
        },
      ],
    },
  ];

  useEffect(() => {
    if (salesManagers && salesManagers.length > 0) {
      const defaultValue: typeof salesManagersArray = [];

      for (let i = 0; i < salesManagers.length; i++) {
        const manager = salesManagers[i];

        defaultValue.push({
          value: manager.id,
          option: `${manager.name} ${manager.last_name}`,
        });
      }

      setSalesManagersArray(defaultValue);
    } else {
      setSalesManagersArray(undefined);
    }
  }, [salesManagers]);

  const cardInfo4 = [
    {
      id: 15,
      name: 'Assigned Manager?',
      input: {
        id: 16,
        label: '',
        textAlterColor: '#41B4A0',
        name: 'assignedManager',
        type: 'select',
        width: 7,
        value: inputs.assignedManager,
        options: salesManagersArray,
        onChange: handleChange,
      },
    },
    {
      id: 17,
      name: 'Location',
      input: {
        id: 18,
        label: '',
        textAlterColor: '#41B4A0',
        name: 'location',
        type: 'text',
        width: 7,
        value: inputs.location,
        onChange: handleChange,
      },
    },
    {
      id: 19,
      name: 'Decision',
      input: {
        id: 20,
        label: '',
        textAlterColor: '#41B4A0',
        name: 'decision',
        type: 'select',
        width: 7,
        options: decisionOptions,
        value: inputs.decision,
        onChange: handleChange,
        disabled: !!fieldErrors,
      },
    },
  ];

  const splitInput = {
    id: 9,
    name: 'Split Sold?',
    inputs: [
      {
        id: 10,
        label: '',
        chekcboxText: 'Yes',
        textAlterColor: '#41B4A0',
        name: 'splitSoldYes',
        type: 'checkbox',
        width: 0,
        value: splitSold.splitSoldYes,
        onChange: handleSplitSoldDecision,
      },
      {
        id: 11,
        label: '',
        chekcboxText: 'No',
        textAlterColor: '#41B4A0',
        name: 'splitSoldNo',
        type: 'checkbox',
        width: 0,
        value: splitSold.splitSoldNo,
        onChange: handleSplitSoldDecision,
      },
    ],
  };

  const handleCancelVisit = async () => {
    const formData = new FormData();

    formData.append('action', '1');

    const apiUrl = `/api/adminDashboard/dailyAppointments/${appointmentId}`;

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'PUT',
      options: {
        onSuccess: () => {
          toggleOpen();

          updateDataWithSocket('dailyAppointmentsList');

          updateDataWithSocket('singleClient', undefined, {
            customerId,
          });
        },
      },
    });
  };

  useEffect(() => {
    if (endVisitWithDeposit) {
      handleEndVisit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endVisitWithDeposit]);

  return (
    <>
      <div
        onClick={e => e.stopPropagation()}
        className={`z-[5] w-[28vw] bg-white rounded-[0.2vw] px-[1vw] py-[1.5vh] shadow-addNewReportHeadShadow ${
          fromCustomerDetail ? 'absolute top-[-45vh] left-[30vw]' : 'fixed right-[16vw] top-[15vh]'
        }`}
      >
        <ConfirmNotification notiMessage={dealMessage} onDecision={handleDecision} />
        <ContentRow cols={2} gap={3} widthFull>
          <aside className="relative w-fit h-fit">
            <Paragraph color="#41B4A0" fontSize={1.5}>
              <b>Sales Rep:</b> {salesRep}
            </Paragraph>
            <FieldErrorMessage fieldErrors={fieldErrors} name="assignedSeller" />
          </aside>
          <Paragraph color="#41B4A0" fontSize={1.5}>
            <b>Lead Type:</b> {leadType}
          </Paragraph>
        </ContentRow>
        <Paragraph color="#41B4A0" fontSize={1.8} marginTop={2} fontWeight={600}>
          Did you enter all of their personal information?
        </Paragraph>
        <ContentRow widthFull cols={2} gap={0.5} marginTop={2}>
          <ContentRow widthFull cols={1} gap={1.5}>
            {inputData.map((el, index) => (
              <EndVisitInput
                key={`endvisinp${el.id}-1-1-${index}`}
                name={el.name}
                value={el.value}
                label={el.label}
                width={el.width}
                fieldErrors={fieldErrors}
                loading={el.name === loadingName}
                fieldErrorBottom={-1.8}
                onChange={handleChange}
                placeholder={el.placeholder}
              />
            ))}
          </ContentRow>
          <ContentRow cols={1} gap={1.5}>
            {inputData2.map((el, index) => (
              <EndVisitInput
                key={`endvisinp${el.id}-2-2-${index}`}
                name={el.name}
                value={el.value}
                label={el.label}
                width={el.width}
                fieldErrors={fieldErrors}
                loading={el.name === loadingName}
                fieldErrorBottom={-1.8}
                onChange={handleChange}
              />
            ))}
          </ContentRow>
        </ContentRow>
        <HorizontalLine marginTop={1.5} marginBottom={1.5} />
        <Paragraph color="#41B4A0" fontSize={1.8} marginTop={2} fontWeight={600}>
          Is this the correct vehicle they are interested in?
        </Paragraph>
        <div className="relative flex mt-[1.5vh] w-full items-center gap-4">
          {/* <Paragraph color="#41B4A0" fontSize={1.5}>
                {`${selectedOtherVehicle.year} ${selectedOtherVehicle.make} ${
                  selectedOtherVehicle.model
                } - [${selectedOtherVehicle.vin.slice(-6)}]`}
              </Paragraph> */}
          <div className="w-full relative">
            <EndVisitVehiclePicker vehicleId={selectedOtherVehicle?.id.toString()} onClick={handlePickVehicle} />
          </div>
          {selectedOtherVehicle ? (
            <Button
              backgroundColor="#FF5555"
              identity="remove-vehicle"
              textColor="#FFF"
              buttonText="Remove"
              onClick={() => {
                setSelectedOtherVehicle(null);
                setInputs(prevState => ({
                  ...prevState,
                  vehicleId: '',
                }));
              }}
              height={3}
              width={5}
            />
          ) : (
            <Button
              backgroundColor="#00A78B"
              identity="add-vehicle"
              textColor="#FFF"
              buttonText="Add Vehicle"
              onClick={() => setShowAddVehicleModal(true)}
              width={9}
            />
          )}
          <FieldErrorMessage name="vehicleId" fieldErrors={fieldErrors} fieldErrorWidthMaxContent top={0} left={0} />
          {/* <Paragraph color="#41B4A0" fontSize={1.5} widthFitContent>
            <b>Trade:</b> {``}
          </Paragraph> */}
        </div>
        <HorizontalLine marginTop={2} marginBottom={1.5} />
        <aside className="relative w-full h-fit">
          <ContentRow cols={2} gap={3} widthFull marginTop={1.5}>
            {cardInfo3.map((el, index) => (
              <>
                {el.name && (
                  <Paragraph color="#41B4A0" fontSize={1.5}>
                    <b>{el.name}</b>
                  </Paragraph>
                )}
                <ButtonContainer marginTop={0} gap={1.5} widthFull colSpan={index != 0 ? 2 : undefined}>
                  {el.inputs.map(el => (
                    <Input
                      key={el.id}
                      label={el.label}
                      chekcboxText={el.chekcboxText}
                      textAlterColor={el.textAlterColor}
                      name={el.name}
                      type={el.type}
                      width={el.width}
                      value={el.value}
                      widthFull={index !== 0}
                      fieldErrors={fieldErrors}
                      fieldErrorWidthMaxContent
                      fieldErrorTop={2.5}
                      onChange={el.onChange}
                    />
                  ))}
                </ButtonContainer>
              </>
            ))}
          </ContentRow>
        </aside>
        <HorizontalLine marginTop={1.5} marginBottom={1.5} />
        <ContentRow cols={1} gap={1} widthFull marginTop={1.5} alignItems="center">
          <div className="flex justify-between items-center w-full">
            <Paragraph color="#41B4A0" fontSize={1.5}>
              <b>{splitInput.name}</b>
            </Paragraph>
            <div className="w-[12vw] flex justify-center gap-[1.5vw]">
              {splitInput.inputs.map(el => (
                <Input
                  key={el.id}
                  label={el.label}
                  chekcboxText={el.chekcboxText}
                  textAlterColor={el.textAlterColor}
                  name={el.name}
                  type={el.type}
                  width={el.width}
                  value={el.value}
                  widthFull={true}
                  fieldErrors={fieldErrors}
                  fieldErrorWidthMaxContent
                  fieldErrorTop={2.5}
                  onChange={el.onChange}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Paragraph color="#41B4A0" fontSize={1.5}>
              <b>Seller Asigned</b>
            </Paragraph>
            <MultiOptionsSelect
              label=""
              width={12}
              options={sellersData?.map(el => ({
                value: el.id,
                option: `${el.name || ''} ${el.last_name || ''}${el.username ? ` - ${el.username}` : ''}`,
              }))}
              optionsSelected={sellerIds}
              fieldErrors={fieldErrors}
              name="sellerIds"
              onClick={idsSelected => setSellerIds(idsSelected)}
              singleSelection={splitSold.splitSoldYes !== '1'}
              optionsShowsTop
            />
          </div>
          {cardInfo4.map(el => (
            <div key={el.id} className="flex justify-between items-center">
              <Paragraph color="#41B4A0" fontSize={1.5}>
                <b>{el.name}</b>
              </Paragraph>
              <Input
                label={el.input.label}
                textAlterColor={el.input.textAlterColor}
                name={el.input.name}
                type={el.input.type}
                width={12}
                value={el.input.value}
                options={el.input.options}
                fieldErrors={fieldErrors}
                fieldErrorWidthMaxContent
                fieldErrorTop={4.5}
                // disabled={el.input.disabled}
                onChange={el.input.onChange}
              />
            </div>
          ))}
        </ContentRow>
        {fromCustomerDetail && (
          <ButtonContainer marginTop={2} widthFull justify="right">
            <Button
              backgroundColor="#F00"
              identity="delete"
              textColor="#FFF"
              buttonText="Cancel Visit"
              onClick={() => setCancelVisitWarning('Are you sure you want to cancel this visit?')}
            />
          </ButtonContainer>
        )}
        {(loading || loadingFetch) && (
          <Loader
            props={{
              style: {
                borderRadius: '0.2vw',
              },
            }}
          />
        )}
      </div>
      {(showConfirmDecision || cancelVisitWarning) && (
        <ConfirmNotification
          notiMessage={
            cancelVisitWarning
              ? cancelVisitWarning
              : `Are you sure you want to end this visit with status: ${
                  decisionOptions.find(el => el.value === parseInt(inputs.decision))?.option
                }?`
          }
          onDecision={cancelVisitWarning ? handleDecision : handleEndVisit}
          loading={loadingFetch || loadingDeposit}
          overflowVisible={inputs.decision === AvailableChangesStatuses.Delivery}
        >
          {inputs.decision === AvailableChangesStatuses.Delivery && (
            <section className="relative w-full">
              <div className="flex flex-row justify-center items-center gap-3">
                <p>Establish the delivery date:</p>
                <Input
                  label=""
                  name="deliveryStartDate"
                  maxDateAge
                  onChange={e => {}}
                  type="DottedDate"
                  selectBtnWidth={15}
                  dayPickerDisabledbefore={new Date()}
                  disabled
                  onDayPickerClick={e => {
                    setInputs(prevState => ({
                      ...prevState,
                      deliveryStartDate: formatIncomingObjectDate(e),
                    }));
                  }}
                  noDisabledBgColor
                  value={inputs.deliveryStartDate}
                  width={9}
                  dayPickerLeft="102%"
                  dayPickerTop="0"
                />
              </div>
              <FieldErrorMessage name="deliveryError" fieldErrors={deliveryTimeError} right={6} />
            </section>
          )}
        </ConfirmNotification>
      )}
      {showAddVehicleModal && (
        <AddOtherVehicleModal
          onClose={() => setShowAddVehicleModal(false)}
          onSave={vehicle => {
            setSelectedOtherVehicle({
              id: vehicle.id,
              year: vehicle.year,
              make: vehicle.brand,
              model: vehicle.model,
              stock_no: vehicle.stock_no,
              vin: vehicle.vin,
            });
            setInputs(prev => ({ ...prev, vehicleId: vehicle.id.toString() }));
          }}
        />
      )}
    </>
  );
}
