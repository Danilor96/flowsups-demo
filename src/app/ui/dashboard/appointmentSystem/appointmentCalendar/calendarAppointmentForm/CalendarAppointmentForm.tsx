import { Input } from '&/inputs/Input';
import { DayTime, User } from '@/app/libs/definitions';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import {
  adminDashboardStore,
  messagesStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { vehiclesDataStore } from '@/store/inventory';
import { useCallback, useEffect, useState } from 'react';
import { dateFormatsStore, timeFormattedStore } from '@/store/dateFormats';
import { useSocketStore } from '@/store/socketIo';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { dateToUTCfromInputDateString } from '@/app/libs/dateTimeZone';
import InfiniteSelector from '@/app/ui/select/infiniteSelector/InfiniteSelector';
import { CustomersForInfiniteScroll } from '@/app/api/customerSelect/types';
import { XIcon } from '@/app/ui/icons/Icons';
import { getCustomersForInfiniteScroll } from '@/app/libs/services/customers/customer.services';
import { getColorFromName, getInitials } from '@/app/ui/select/UserAssignmentSelector/utils';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import UserAssignmentSelect from '@/app/ui/select/UserAssignmentSelector/UserAssignmentSelector';

export function CalendarAppointmentForm({
  startDate,
  handleTimeConflict,
}: {
  startDate: string;
  handleTimeConflict?: (message: string) => void;
}) {
  // ----- global states -----

  const session = useSession();

  const userId = session.data?.user.id;

  const { sellersData, clientsData, dayTime } = adminDashboardStore();
  const {
    getSellers,
    // getClients,
    getDayTime,
  } = adminDashboardStore();
  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();
  const { updateDataWithSocket } = useSocketStore();

  const { vehicles } = vehiclesDataStore();
  const { getVehiclesData } = vehiclesDataStore();

  const { openCloseCreateCallendarAppointment } = modalWindowStore();

  const { parsedDayTimeHourMinutes } = timeFormattedStore();

  const { dateFormatted } = dateFormatsStore();

  const setMssg = messagesStore((state) => state.setMessages);

  const mobileFormat = phoneNumbersFormatStore((state) => state.formatPhoneNumber);

  const getPromiseData = useCallback(() => {
    return [
      getSellers(),
      // getClients(),
      getVehiclesData(),
      getDayTime(),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, setLoading } = useLoadingGetData(getPromiseData);

  useEffect(() => {
    if (dayTime && dayTime.length > 0 && startDate) {
      const startDateHour = new Date(startDate).getHours();

      const newDayTimeList = dayTime.filter((el) => {
        const dayTimeParsed = parsedDayTimeHourMinutes(el.time);
        const dayTimeHour = dayTimeParsed.hour;

        return dayTimeHour > startDateHour;
      });

      setDayTimeFiltered(newDayTimeList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayTime, startDate]);

  // ----- local states -----

  const [dayTimeFiltered, setDayTimeFiltered] = useState<DayTime>(undefined);

  const [seller, setSeller] = useState('');
  const [sellerId, setSellerId] = useState(['']);
  const [customer, setCustomer] = useState('');
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [vehicle, setVehicle] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [endTime, setEndTime] = useState('');
  const [note, setNote] = useState('');

  const [customers, setCustomers] = useState<CustomersForInfiniteScroll[]>([]);
  const [search, setSearch] = useState('');
  const [cursor, setCursor] = useState<string | number | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(
    async (isFirstLoad: boolean, query: string, currentCursor: string | number | null) => {
      setLoading(true);

      try {
        const data = await getCustomersForInfiniteScroll({ isFirstLoad, query, currentCursor });

        if (data.customers && data.customers.length > 0) {
          setCustomers((prev) =>
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;

    if (name === 'seller') {
      setSeller(value);
    }

    if (name === 'customer') {
      setCustomer(value);
    }

    if (name === 'vehicle') {
      setVehicle(value);
    }

    if (name === 'endTime') {
      setEndTime(value);
    }

    if (name === 'note') {
      setNote(value);
    }
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch, setManualFieldErrors } = useAsyncFetching();

  const handleClickOption = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'customer') {
      setCustomer(name);
      // setCustomerId(value);
    }

    if (identity === 'seller') {
      setSeller(name);
      setSellerId([value]);
    }

    if (identity === 'vehicle') {
      setVehicle(name);
      setVehicleId(value);
    }

    if (identity === 'save') {
      const formData = new FormData();

      const endTimeSelected = dayTime?.find((el) => el.id === parseInt(endTime))?.time;

      const startDateWithoutTime = dateFormatted(2, new Date(startDate));

      const endDate = dateFormatted(5, new Date(`${startDateWithoutTime}, ${endTimeSelected}`));
      // console.log({ startDate, endDate });
      // return;
      formData.append('customer_id', customerId?.toString() ?? '');
      formData.append('seller_id', sellerId[0]);
      formData.append('user_id', `${userId}`);
      formData.append('initial_date', dateToUTCfromInputDateString(startDate));
      formData.append('initialDateInZone', startDate);
      formData.append('final_date', dateToUTCfromInputDateString(endDate));
      formData.append('finalDateInZone', endDate);
      formData.append('now', new Date().toISOString());
      formData.append('note', note);
      userId && formData.append('creator', userId.toString());

      if (vehicle && vehicleId) {
        formData.append('interested_vehicle', vehicleId);
      }

      const apiUrl = '/api/adminDashboard/appointments';

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 75,
        options: {
          onSuccess() {
            updateDataWithSocket('appointments');
            updateDataWithSocket('dailyAppointmentsList');
            updateDataWithSocket('dailyTotals');

            openCloseCreateCallendarAppointment();
            if (singleCLientData?.id) {
              getSingleClientData(singleCLientData.id.toString());
              updateDataWithSocket('customersList');
            }
          },
          onError(json) {
            if (json.timeConflict) {
              if (json.timeConflict) {
                const startDate = json.startDate
                  ? format(new Date(json.startDate), 'h:mm:ss a')
                  : '';
                const endDate = json.endDate ? format(new Date(json.endDate), 'h:mm:ss a') : '';
                handleTimeConflict?.(json.serverError + ` (${startDate} - ${endDate})`);
              }
            }
          },
          onFieldErrors(fieldErrors) {
            setManualFieldErrors({
              customer: fieldErrors.customer_id,
              endTime: fieldErrors.final_date,
              seller: fieldErrors.seller_id,
              startDate: fieldErrors.initial_date,
            });
          },
        },
      });
    }
  };

  const returnSelectedCobuyerName = () => {
    let name = '';

    const cobuyer = customers.find((c) => c.id == customerId);

    if (cobuyer) {
      name = cobuyer.customerName;
    }

    return name;
  };

  const inputDataOne = [
    {
      id: 1,
      label: 'Customer',
      name: 'customer',
      value: customer,
      width: 0,
      optionsBackgroundColor: '#FFF',
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      optionsRadius: 0.2,
      optionsWidth: 2,
      optionsContainerHeight: 15,
      options: clientsData?.map((el) => {
        return {
          value: el.id?.toString(),
          name: `${el.first_name} ${el.last_name}`,
          identity: 'customer',
        };
      }),
      onChange: handleInputChange,
      onClick: handleClickOption,
    },
    {
      id: 2,
      label: 'Seller',
      name: 'seller',
      value: seller,
      width: 25,
      optionsBackgroundColor: '#FFF',
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      optionsRadius: 0.2,
      optionsWidth: 2,
      optionsContainerHeight: 15,
      options: sellersData?.map((el) => {
        return { value: el.id.toString(), name: `${el.name} ${el.last_name}`, identity: 'seller' };
      }),
      onChange: handleInputChange,
      onClick: handleClickOption,
    },
    {
      id: 3,
      label: 'Interested Vehicle',
      name: 'vehicle',
      value: vehicle,
      width: 25,
      optionsBackgroundColor: '#FFF',
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      optionsRadius: 0.2,
      optionsWidth: 2,
      optionsContainerHeight: 15,
      options:
        vehicles && vehicles.length > 0
          ? vehicles?.map((el) => {
              return {
                value: el.id?.toString(),
                name: `${el.vehicle_brands?.brand} ${
                  el.vehicle_models?.model
                } [${el.stock_no?.slice(-6)}]`,
                identity: 'vehicle',
              };
            })
          : undefined,
      onChange: handleInputChange,
      onClick: handleClickOption,
    },
  ];

  const inputDataTwo = [
    {
      id: 4,
      label: 'Start Date',
      name: 'startDate',
      value: startDate,
      width: 25,
      type: 'text',
      onChange: handleInputChange,
      disabled: true,
    },
    {
      id: 5,
      label: 'End Time',
      name: 'endTime',
      value: endTime,
      width: 25,
      type: 'select',
      options: dayTimeFiltered?.map((el) => {
        return { value: el.id, option: el.time };
      }),
      onChange: handleInputChange,
    },
  ];

  // handle set end date 2 hours later start date

  useEffect(() => {
    const newEndTime = dayTime?.find((el) => {
      const startDateHour = new Date(startDate).getHours();
      const startDateMinutes = new Date(startDate).getMinutes();
      const dayTimeParsed = parsedDayTimeHourMinutes(el.time);
      const dayTimeHour = dayTimeParsed.hour;
      const dayTimeMinutes = dayTimeParsed.minutes;

      return dayTimeHour === startDateHour + 2 && startDateMinutes === dayTimeMinutes;
    });

    setEndTime(newEndTime ? `${newEndTime.id}` : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, dayTime]);

  // handle set seller / vehicle selected

  useEffect(() => {
    if (customerId && clientsData) {
      const singleClient = clientsData.find((el) => el.id === customerId);

      if (singleClient) {
        const newSeller = singleClient.seller
          ? `${singleClient.seller.name} ${singleClient.seller.last_name}`
          : '';
        const newSellerId = singleClient.seller ? `${singleClient.seller.id}` : '';
        const newVehicle = singleClient?.interested_vehicle
          ? `${singleClient.interested_vehicle.vehicle_brands.brand} ${
              singleClient.interested_vehicle.vehicle_models.model
            } - [${singleClient.interested_vehicle.vehicle_identification_numbers.vin.slice(-6)}]`
          : '';
        const newVehicleId = singleClient.interested_vehicle
          ? `${singleClient.interested_vehicle.id}`
          : '';

        setSeller(newSeller);
        setSellerId([newSellerId]);

        setVehicle(newVehicle);
        setVehicleId(newVehicleId);
      }
    }
  }, [customerId, clientsData]);

  useEffect(() => {
    if (singleCLientData) {
      setCustomer(singleCLientData.first_name + ' ' + singleCLientData.last_name);
      setCustomerId(singleCLientData.id);
    }
  }, [singleCLientData]);

  return (
    <ModalWindow>
      <ModalContainer marginTop={15} width={52}>
        <ModalContainerTitle
          title="Create a new appointment"
          closeWindowFunction={openCloseCreateCallendarAppointment}
        />
        <ModalContent widthFull loading={loading || loadingFetch}>
          <ContentRow widthFull cols={2} gap={2} gridTrack="minmax(0, 1fr)">
            {inputDataOne.map((el, index) => {
              if (el.name === 'customer') {
                return (
                  <InfiniteSelector
                    key={`${el.id})${index - el.id * 2}`}
                    height={'2.6rem'}
                    hasMore={hasMore}
                    loading={loading}
                    items={customers.map((customer) => ({
                      id: customer.id,
                      name: customer.customerName,
                      status: customer.status,
                      mobilePhone: customer.mobilePhone,
                    }))}
                    onSearchChange={(val) => {
                      setSearch(val);
                    }}
                    onSelect={(item) => {
                      if (item.id == customerId) {
                        setCustomerId(null);

                        return true;
                      }

                      setCustomerId(item.id);
                    }}
                    search={search}
                    keyExtractor={(c) => `${c.id}--infinicusinpññ`}
                    onLoadMore={() => fetchPage(false, search, cursor)}
                    isSelectedFn={(c) => {
                      return c.id == customerId;
                    }}
                    selectedRenderItem={
                      customerId ? (
                        <span className="w-full inline-flex items-center gap-1 bg-teal-50 border border-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium animate-in fade-in zoom-in duration-200">
                          <div
                            className={`w-4 h-4 rounded-full ${getColorFromName(returnSelectedCobuyerName())} text-white flex items-center justify-center text-[8px]`}
                          >
                            {getInitials(returnSelectedCobuyerName())}
                          </div>
                          {returnSelectedCobuyerName()}
                          <button
                            onClick={(e) => {
                              setCustomerId(null);
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
                        {c.id == customerId ? (
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
                );
              }

              if (el.name === 'seller') {
                return (
                  <UserAssignmentSelect
                    key={`${el.id})${index - el.id * 2}`}
                    users={(sellersData as unknown as User[]) || []}
                    defaultValue={sellerId}
                    onChange={(ids) => {
                      setSellerId(ids);
                    }}
                    isMultiSelect={false}
                    bgColor="#FFF"
                    enableFloating
                  />
                );
              }

              return (
                <AdderSelect
                  key={`${el.id})${index - el.id * 2}`}
                  name={el.name}
                  value={el.value}
                  width={0}
                  widthFull
                  label={el.label}
                  onChange={el.onChange}
                  options={el.options}
                  iconTextGap={0}
                  onClick={el.onClick}
                  optionsBackgroundColor={el.optionsBackgroundColor}
                  optionsHeight={el.optionsHeight}
                  optionsNameColor={el.optionsNameColor}
                  optionsRadius={el.optionsRadius}
                  optionsWidth={el.optionsWidth}
                  optionsWidthFull
                  optionsContainerHeight={el.optionsContainerHeight}
                  fieldErrors={fieldErrors}
                />
              );
            })}
            {inputDataTwo.map((el, index) => (
              <Input
                key={`${el.id})${index - el.id * 2}`}
                label={el.label}
                name={el.name}
                type={el.type}
                value={el.value}
                width={0}
                widthFull
                options={el.options}
                onChange={el.onChange}
                disabled={el.disabled}
                textAlterColor="#00A78B"
                fieldErrors={fieldErrors}
              />
            ))}
          </ContentRow>
          <div className="w-full mt-[2vh]">
            <TextAreaInput
              label="Note"
              name="note"
              value={note}
              width={0}
              widthFull
              height={10}
              onChange={handleInputChange}
              fieldErrors={fieldErrors}
              placeholder="Type note here"
            />
          </div>
          <ButtonContainer marginTop={2} widthFull heightFull alignContentEnd justify="end">
            <Button
              backgroundColor="#00A78B"
              identity="save"
              onClick={handleClickOption}
              textColor="#FFF"
              buttonText="Save"
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
