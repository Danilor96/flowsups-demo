import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { Input } from '&/inputs/Input';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import {
  adminDashboardStore,
  messagesStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { ConfirmNotification } from '&/notifications/Notification';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { useSocketStore } from '@/store/socketIo';
import { Loader } from '&/miscellaneous/loader/Loader';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { Button } from '&/buttons/Button';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { EndVisitVehiclePicker } from '../../../endVisit/endVisitVehiclePicker/EndVisitVehiclePicker';
import { AddOtherVehicleModal } from '../../../reports/salesLog/salesLogStatistics/salesScore/addOther/AddVehicleModal';
import UserAssignmentSelect from '@/app/ui/select/UserAssignmentSelector/UserAssignmentSelector';
import { User } from '@/app/libs/definitions';
import { getCustomersForInfiniteScroll } from '@/app/libs/services/customers/customer.services';
import { CustomersForInfiniteScroll } from '@/app/api/customerSelect/types';
import InfiniteSelector from '@/app/ui/select/infiniteSelector/InfiniteSelector';
import { TrashDeleteIcon, XIcon } from '@/app/ui/icons/Icons';
import { getColorFromName, getInitials } from '@/app/ui/select/UserAssignmentSelector/utils';
import { RegularSearchableSelect } from '@/app/ui/select/regularSearchableSelect/RegularSearchableSelect';

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

export function InfoSold({
  customer,
  leadType,
  salesRep,
  address,
  salesManagerId,
  salesRepId,
  email,
  homePhone,
  customerId,
  mobilePhone,
  vehicleId,
  workPhone,
  fromCustomerDetail,
  cobuyerSelected,
  cobuyerSelectedDefaultName,
  cobuyerRelationshipSelected,
  setCobuyerSelected,
  setRelationshipSelected,
  onChange,
}: {
  salesManagerId?: number;
  salesRepId?: number;
  salesRep: string;
  leadType: string | null;
  customer: string;
  customerId: number;
  homePhone: string;
  address: string;
  workPhone: string;
  email: string;
  mobilePhone: string;
  vehicleId?: number;
  fromCustomerDetail?: boolean;
  cobuyerSelected?: string | number | null;
  cobuyerSelectedDefaultName?: string | null;
  cobuyerRelationshipSelected?: string | number | null;
  setCobuyerSelected: Dispatch<SetStateAction<string | number | null>>;
  setRelationshipSelected: Dispatch<SetStateAction<string | number | null>>;
  onChange: (
    data: Partial<{
      vehicleId: string;
      managerId: string;
      sellerIds: string[];
      splitSold: { splitSoldYes: string; splitSoldNo: string };
      soldDate: string | null;
      soldNote: string;
    }>,
  ) => void;
}) {
  // ----- global states -----

  const [
    salesManagers,
    getSalesManagers,
    sellersData,
    getSellers,
    getCobuyerRelationship,
    cobuyerRelationshipData,
  ] = adminDashboardStore((store) => [
    store.salesManagers,
    store.getSalesManagers,
    store.sellersData,
    store.getSellers,
    store.getCobuyerRelationship,
    store.cobuyerRelationshipData,
  ]);

  const { openCloseIconedSelectOptions, openClientDetail, openSetUpADeal, openDeposit } =
    modalWindowStore();

  const { formatPhoneNumber, extractDigits } = phoneNumbersFormatStore();

  const { updateDataWithSocket } = useSocketStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { getSingleClientData } = singleCLientDataStore();

  const { singleCLientData } = singleCLientDataStore();

  const getPromiseData = useCallback(() => {
    return [getSalesManagers(), getSellers(), getCobuyerRelationship()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMssg = messagesStore((state) => state.setMessages);

  const mobileFormat = phoneNumbersFormatStore((state) => state.formatPhoneNumber);

  const { loading, setLoading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [cobuyers, setCobuyers] = useState<CustomersForInfiniteScroll[]>([]);
  const [search, setSearch] = useState('');
  const [cursor, setCursor] = useState<string | number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [relationshipSearch, setRelationshipSearch] = useState('');

  const fetchPage = useCallback(
    async (isFirstLoad: boolean, query: string, currentCursor: string | number | null) => {
      setLoading(true);

      try {
        const data = await getCustomersForInfiniteScroll({ isFirstLoad, query, currentCursor });

        if (data.customers && data.customers.length > 0) {
          setCobuyers((prev) =>
            isFirstLoad
              ? data.customers.filter((customer) => customer.id !== singleCLientData?.id)
              : [
                  ...prev,
                  ...data.customers.filter((customer) => customer.id !== singleCLientData?.id),
                ],
          );
          setCursor(data.nextCursor);
          setHasMore(!!data.nextCursor);
        }
      } catch {
        setMssg('An error occurred');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setCursor(null);
      fetchPage(true, search, null);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, fetchPage]);

  const returnSelectedCobuyerName = () => {
    let name = '';

    const cobuyer = cobuyers.find((c) => c.id == cobuyerSelected);

    if (cobuyer) {
      name = cobuyer.customerName;
    }

    if (!cobuyer && cobuyerSelectedDefaultName) {
      name = cobuyerSelectedDefaultName;
    }

    return name;
  };

  const returnSelectedRelationship = () => {
    let name = '';

    const relationship = cobuyerRelationshipData?.find((r) => r.id == cobuyerRelationshipSelected);

    if (relationship) {
      name = relationship.relationship;
    }

    return name;
  };

  const [loadingName, setLoadingName] = useState('');
  const [startSaveChanges, setStartSaveChanges] = useState(false);
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
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [splitSold, setSplitSold] = useState({ splitSoldYes: '', splitSoldNo: '' });
  const [sellerIds, setSellerIds] = useState<string[]>(salesRepId ? [salesRepId.toString()] : []);

  const inputEditedRef = useRef<NodeJS.Timeout | null>(null);

  const handleAddressFormatted = (addressText: string) => {
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
    soldDateInput: '',
    soldDateTimeInput: '',
    soldNote: '',
  });

  const [showConfirmDecision, setShowConfirmDecision] = useState<boolean>(false);
  const [cancelVisitWarning, setCancelVisitWarning] = useState('');

  const regularInputs = ['prospect', 'address', 'email', 'home', 'work', 'cell'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'assignedManager') onChange({ managerId: value });

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

  useEffect(() => {
    onChange({ vehicleId: inputs.vehicleId });
  }, [inputs]);

  useEffect(() => {
    onChange({ sellerIds, managerId: salesManagerId ? salesManagerId.toString() : '' });
  }, [sellerIds, salesManagerId]);

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

  const handleDayPick = (date: Date) => {
    const formattedDate = formatIncomingObjectDate(date);
    setInputs((prev) => ({
      ...prev,
      soldDateInput: formattedDate,
    }));

    onChange({ soldDate: formattedDate });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setInputs((prev) => ({
      ...prev,
      soldDateTimeInput: val,
    }));
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
      onChange({
        splitSold: newState,
      });
    }
  };

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

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`z-[5]/ w-[30vw] bg-white rounded-[0.2vw] px-[1vw] py-[1.5vh] shadow-addNewReportHeadShadow ${
          fromCustomerDetail
            ? 'absolute/ top-[-45vh]/ left-[30vw]/'
            : 'fixed/ top-[23vh]/ right-[16vw]/'
        }`}
      >
        <Paragraph color="#41B4A0" fontSize={1.8} marginTop={2} fontWeight={600}>
          Is this the correct vehicle they are interested in?
        </Paragraph>
        <div className="flex mt-[1.5vh] w-full items-center gap-4">
          <div className="w-full">
            <EndVisitVehiclePicker
              vehicleId={selectedOtherVehicle?.id.toString()}
              onClick={handlePickVehicle}
            />
          </div>
          {selectedOtherVehicle ? (
            <Button
              backgroundColor="#FF5555"
              identity="remove-vehicle"
              textColor="#FFF"
              buttonText="Remove"
              onClick={() => {
                setSelectedOtherVehicle(null);
                setInputs((prevState) => ({
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
          <FieldErrorMessage
            name="vehicleId"
            fieldErrors={fieldErrors}
            fieldErrorWidthMaxContent
            top={2.5}
            left={7.7}
          />
          {/* <Paragraph color="#41B4A0" fontSize={1.5} widthFitContent>
            <b>Trade:</b> {``}
          </Paragraph> */}
        </div>
        <HorizontalLine marginTop={1.5} marginBottom={1.5} />
        <ContentRow cols={1} gap={1} widthFull marginTop={1.5} alignItems="center">
          <div className="flex justify-between items-center w-full">
            <Paragraph color="#41B4A0" fontSize={1.5}>
              <b>{splitInput.name}</b>
            </Paragraph>
            <div className="w-[12vw] flex justify-center gap-[1.5vw]">
              {splitInput.inputs.map((el) => (
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
              <b>Sold Date</b>
            </Paragraph>
            <div className="w-[18vw]">
              <Input
                label=""
                name="soldDate"
                width={0}
                widthFull
                value={inputs.soldDateInput}
                type={'DottedDate'}
                timeDataValue={inputs.soldDateTimeInput}
                identity="soldDate"
                fetchTimeData={true}
                disabled={false}
                onChange={() => {}}
                onDayPickerClick={handleDayPick}
                // onTimeChanged={handleTimeChange}
                dayPickerDisabledAfter={new Date()}
                fieldErrors={fieldErrors}
                noDisabledBgColor
                enableFloating
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Paragraph color="#41B4A0" fontSize={1.5}>
              <b>Seller Asigned</b>
            </Paragraph>
            <div className="w-[18vw]">
              <UserAssignmentSelect
                users={(sellersData as unknown as User[]) || []}
                defaultValue={sellerIds}
                onChange={(ids) => {
                  setSellerIds(ids);
                  onChange({ sellerIds: ids });
                }}
                isMultiSelect={splitSold.splitSoldYes === '1'}
                bgColor="#FFF"
                enableFloating
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Paragraph color="#41B4A0" fontSize={1.5}>
              <b>Assigned Manager</b>
            </Paragraph>
            <div className="w-[18vw]">
              <UserAssignmentSelect
                users={(salesManagers as unknown as User[]) || []}
                defaultValue={inputs.assignedManager ? [inputs.assignedManager] : []}
                onChange={(ids) => {
                  const val = ids[0] || '';
                  setInputs((prev) => ({ ...prev, assignedManager: val }));
                  onChange({ managerId: val });
                }}
                isMultiSelect={false}
                bgColor="#FFF"
                enableFloating
              />
            </div>
          </div>
          <div className="flex flex-col justify-between items-center gap-2">
            <aside className="w-full flex justify-between items-center">
              <Paragraph color="#41B4A0" fontSize={1.5}>
                <b>Cobuyer (optional)</b>
              </Paragraph>
              <aside className="w-[18vw]">
                <InfiniteSelector
                  hasMore={hasMore}
                  loading={loading}
                  items={cobuyers.map((customer) => ({
                    id: customer.id,
                    name: customer.customerName,
                    status: customer.status,
                    mobilePhone: customer.mobilePhone,
                  }))}
                  onSearchChange={(val) => {
                    setSearch(val);
                  }}
                  onSelect={(item) => {
                    if (item.id == cobuyerSelected) {
                      setCobuyerSelected(null);
                      setRelationshipSelected(null);

                      return true;
                    }

                    setCobuyerSelected(item.id);
                  }}
                  search={search}
                  keyExtractor={(c) => `${c.id}--infinicusinpññ`}
                  onLoadMore={() => fetchPage(false, search, cursor)}
                  isSelectedFn={(c) => {
                    return c.id == cobuyerSelected;
                  }}
                  selectedRenderItem={
                    cobuyerSelected ? (
                      <span className="inline-flex items-center gap-1 bg-teal-50 border border-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium animate-in fade-in zoom-in duration-200">
                        <div
                          className={`w-4 h-4 rounded-full ${getColorFromName(returnSelectedCobuyerName())} text-white flex items-center justify-center text-[8px]`}
                        >
                          {getInitials(returnSelectedCobuyerName())}
                        </div>
                        {returnSelectedCobuyerName()}
                        <button
                          onClick={(e) => {
                            setCobuyerSelected(null);
                            setRelationshipSelected(null);
                          }}
                          className="hover:bg-teal-200 rounded-full p-0.5 ml-1 text-teal-400 hover:text-teal-700 transition-colors"
                        >
                          <XIcon width={10} height={10} />
                        </button>
                      </span>
                    ) : null
                  }
                  renderItem={(c) => (
                    <div className={`flex flex-row justify-between transition-colors`}>
                      <aside>
                        <p>{c.name}</p>
                        <p className="text-sm text-primaryColor">{`Status: ${c.status}`}</p>
                        <p className="text-sm text-primaryColor">{`Mobile: ${mobileFormat(c.mobilePhone)}`}</p>
                      </aside>
                      {c.id == cobuyerSelected ? (
                        <Input
                          label=""
                          name=""
                          onChange={() => {}}
                          type="checkbox"
                          customCheckbox
                          value="1"
                          width={0}
                        />
                      ) : (
                        <Input
                          label=""
                          name=""
                          onChange={() => {}}
                          type="checkbox"
                          customCheckbox
                          value=""
                          width={0}
                        />
                      )}
                    </div>
                  )}
                  enableFloating={true}
                />
              </aside>
            </aside>
            <div className="w-[18vw] ml-auto">
              {cobuyerSelected && (
                <InfiniteSelector
                  hasMore={false}
                  items={
                    relationshipSearch
                      ? cobuyerRelationshipData
                          ?.filter((relation) => {
                            const searchArray = relationshipSearch.toLowerCase().split('');

                            return searchArray.every((word) =>
                              relation.relationship.includes(word),
                            );
                          })
                          .map((relation) => ({
                            id: relation.id,
                            relation: relation.relationship,
                          })) || []
                      : cobuyerRelationshipData?.map((relation) => ({
                          id: relation.id,
                          relation: relation.relationship,
                        })) || []
                  }
                  keyExtractor={(r) => `${r.id}//--++relationshipppp`}
                  loading={loading}
                  onLoadMore={() => {}}
                  onSearchChange={(val) => {
                    setRelationshipSearch(val);
                  }}
                  onSelect={(item) => {
                    if (item.id == cobuyerRelationshipSelected) {
                      setRelationshipSelected(null);

                      return true;
                    }

                    setRelationshipSelected(item.id);
                  }}
                  search={relationshipSearch}
                  renderItem={(item) => {
                    return (
                      <div>
                        <p className="text-slate-700">{item.relation}</p>
                      </div>
                    );
                  }}
                  enableFloating
                  isSelectedFn={(item) => {
                    return item.id.toString() == cobuyerRelationshipSelected;
                  }}
                  placeholder="Relationship"
                  selectedRenderItem={
                    cobuyerRelationshipSelected ? (
                      <p className="text-[1.9vh]">{returnSelectedRelationship()}</p>
                    ) : null
                  }
                />
              )}
            </div>
          </div>
          <div className="flex flex-col w-full mt-2">
            <Paragraph color="#41B4A0" fontSize={1.5} marginBottom={1.2}>
              <b>Note (optional)</b>
            </Paragraph>
            <TextAreaInput
              label=""
              name="soldNote"
              value={inputs.soldNote}
              width={0}
              height={8.425926}
              onChange={(e) => {
                setInputs((prev) => ({ ...prev, soldNote: e.target.value }));
                onChange({ soldNote: e.target.value });
              }}
              widthFull
              fieldErrors={fieldErrors}
              placeholder="Add a note..."
            />
          </div>
        </ContentRow>
      </div>
      {showAddVehicleModal && (
        <AddOtherVehicleModal
          onClose={() => setShowAddVehicleModal(false)}
          onSave={(vehicle) => {
            setSelectedOtherVehicle({
              id: vehicle.id,
              year: vehicle.year,
              make: vehicle.brand,
              model: vehicle.model,
              stock_no: vehicle.stock_no,
              vin: vehicle.vin,
            });
            setInputs((prev) => ({ ...prev, vehicleId: vehicle.id.toString() }));
          }}
        />
      )}
    </>
  );
}
