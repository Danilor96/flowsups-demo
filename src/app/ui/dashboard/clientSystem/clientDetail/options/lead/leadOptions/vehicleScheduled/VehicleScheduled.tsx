import { ButtonContainer } from '&/buttons/ButtonContainer';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { Button } from '&/buttons/Button';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { adminDashboardStore, singleCLientDataStore } from '@/store/adminDashboard';
import { vehiclesDataStore } from '@/store/inventory';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Input } from '@/app/ui/inputs/Input';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { leadsStore } from '@/store/leads';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { MultiOptionsSelect } from '&/miscellaneous/multiOptionsSelect/MultiOptionsSelect';

export function VehicleScheduled() {
  // ----- global states -----

  const session = useSession();
  const user = session.data?.user;

  const { singleCLientData } = singleCLientDataStore();
  const { getSingleClientData } = singleCLientDataStore();

  const setCheatCount = leadsStore((state) => state.setCheatCountForFetch);
  const cheatCount = leadsStore((state) => state.cheatCountForFetch);

  const { users } = adminDashboardStore();
  const { getUsers } = adminDashboardStore();

  const { vehicles } = vehiclesDataStore();
  const { getVehiclesData } = vehiclesDataStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  useEffect(() => {
    getUsers();
    getVehiclesData();
  }, [getUsers, getVehiclesData]);

  // ----- local states -----

  const returnDefaultInterestedVehicleInfo = () => {
    const vehicle = vehicles?.find((el) => el.id === singleCLientData?.interested_vehicle?.id);

    const brand = vehicle?.vehicle_brands?.brand || '';
    const model = vehicle?.vehicle_models?.model || '';
    const vin = vehicle?.vehicle_identification_numbers?.vin
      ? `- [${vehicle.vehicle_identification_numbers.vin.slice(-6)}]`
      : '';

    return `${brand} ${model} ${vin}`;
  };

  const [inputs, setInputs] = useState<{
    createdBy: string;
    customer: string;
    customerSearch: string;
    assignedTo: string[];
    reminderTime: string;
    reminderTimeSearch: string;
    startDate: string;
    vehicleSearch: string;
    vehicle: string;
    note: string;
  }>({
    createdBy: `${user?.id}`,
    customer: singleCLientData?.id.toString() || '',
    customerSearch:
      `${singleCLientData?.first_name || ''} ${singleCLientData?.last_name || ''}` || '',
    assignedTo: singleCLientData?.seller?.id ? [singleCLientData.seller.id.toString()] : [],
    reminderTime: '2',
    reminderTimeSearch: '5 min',
    startDate: '',
    vehicleSearch: returnDefaultInterestedVehicleInfo() || '',
    vehicle: singleCLientData?.interested_vehicle?.id.toString() || '',
    note: '',
  });

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleAssignUser = (val: string[]) => {
    setInputs((prevState) => ({
      ...prevState,
      assignedTo: val,
    }));
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'customer') {
      setInputs((prevState) => ({
        ...prevState,
        customerSearch: name,
        customer: value,
      }));
    }

    if (identity === 'reminderTime') {
      setInputs((prevState) => ({
        ...prevState,
        reminderTimeSearch: name,
        reminderTime: value,
      }));
    }

    if (identity === 'vehicle') {
      setInputs((prevState) => ({
        ...prevState,
        vehicleSearch: name,
        vehicle: value,
      }));
    }

    if (identity === 'save') {
      const formData = new FormData();

      const ignore = ['Search'];

      for (const [name, value] of Object.entries(inputs)) {
        if (!ignore.includes(name)) {
          if (typeof value === 'string') {
            formData.append(name, value);
          } else {
            formData.append(name, JSON.stringify(value));
          }
        }
      }

      formData.append('todaysDate', new Date().toISOString());

      const apiUrl = '/api/adminDashboard/vehicleScheduled';

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        options: {
          onSuccess() {
            getSingleClientData(`${singleCLientData?.id}`);

            setInputs({
              createdBy: `${user?.id}`,
              customer: singleCLientData?.id.toString() || '',
              customerSearch:
                `${singleCLientData?.first_name || ''} ${singleCLientData?.last_name || ''}` || '',
              assignedTo: singleCLientData?.seller?.id ? [singleCLientData.seller.id.toString()] : [],
              reminderTime: '2',
              reminderTimeSearch: '5 min',
              startDate: '',
              vehicleSearch: returnDefaultInterestedVehicleInfo() || '',
              vehicle: singleCLientData?.interested_vehicle?.id.toString() || '',
              note: '',
            });

            setCheatCount(cheatCount + 1);
          },
        },
      });
    }
  };

  // handling change events

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStartDate = (e: Date | undefined) => {
    const start = e;

    setInputs((prevState) => ({
      ...prevState,
      startDate: formatIncomingObjectDate(start),
    }));
  };

  // input data

  const reminderTimeValues = [
    {
      value: '2',
      name: '5 min',
      identity: 'reminderTime',
    },
    {
      value: '1',
      name: 'none',
      identity: 'reminderTime',
    },
    {
      value: '3',
      name: '10 min',
      identity: 'reminderTime',
    },
    {
      value: '4',
      name: '15 min',
      identity: 'reminderTime',
    },
  ];

  const inputData3 = [
    {
      id: 4,
      value: inputs.startDate,
      name: 'startDate',
      type: 'DottedDate',
      label: 'Start (CDT)',
      width: 15.46875,
      inputDate: true,
      identity: 'startDateTime',
      fetchTimeData: true,
      onChange: handleChange,
      onPick: handleStartDate,
    },
  ];

  return (
    <BorderedContent overflowVisible positionRelative loading={loadingFetch}>
      <ButtonContainer marginTop={3.148148} widthFull justify="space-between">
        <AdderSelect
          width={15.46875}
          iconTextGap={0}
          label="Created By"
          name="createdBy"
          onChange={handleChange}
          onClick={handleButton}
          optionsBackgroundColor="#FFF"
          optionsHeight={0}
          optionsNameColor=""
          optionsRadius={0}
          optionsWidth={0}
          value={`${user?.name} ${user?.last_name}`}
          disabledInput={true}
          disabledButton={true}
          selectThreeDottedIcon={true}
          selectBtnBackgroundColor="#C9EBE6"
        />
        <MultiOptionsSelect
          label="Assigned To"
          optionsSelected={inputs.assignedTo}
          options={users?.map((el) => ({
            value: el.id,
            option: `${el.name || ''} ${el.last_name || ''}${
              el.username ? ` - ${el.username}` : ''
            }`,
          }))}
          width={15.46875}
          fieldErrors={fieldErrors}
          name="assignedTo"
          onClick={handleAssignUser}
        />
      </ButtonContainer>
      <ButtonContainer marginTop={3.148148} widthFull justify="space-between">
        <AdderSelect
          width={15.46875}
          iconTextGap={0}
          label="Reminder Time"
          name="reminderTimeSearch"
          onChange={handleChange}
          onClick={handleButton}
          optionsBackgroundColor="#FFF"
          optionsHeight={5}
          optionsNameColor="#00A78B"
          optionsRadius={0.3}
          optionsWidth={8.802083}
          value={inputs.reminderTimeSearch}
          selectThreeDottedIcon={false}
          selectBtnBackgroundColor=""
          selectBtnCursorPointer={false}
          defaultText="none"
          options={reminderTimeValues.map((el) => el)}
          fieldErrors={fieldErrors}
        />
        {inputData3.map((el, index) => (
          <Input
            key={`~~223${el.id * index + 75}dsf$${el.id}`}
            label={el.label}
            name={el.name}
            type={el.type}
            width={el.width}
            value={el.value}
            inputDate={el.inputDate}
            onChange={el.onChange}
            onDayPickerClick={el.onPick}
            identity={el.identity}
            dayPickerDisabledbefore={new Date()}
            fieldErrors={fieldErrors}
          />
        ))}
      </ButtonContainer>
      <aside className="mt-[3.148148vh]"></aside>
      <AdderSelect
        width={9}
        widthFull
        iconTextGap={0}
        label="Vehicle"
        name="vehicleSearch"
        onChange={handleChange}
        onClick={handleButton}
        optionsBackgroundColor="#FFF"
        optionsHeight={5}
        optionsNameColor="#00A78B"
        optionsRadius={0.3}
        optionsWidth={9}
        optionsWidthFull
        fieldErrors={fieldErrors}
        value={inputs.vehicleSearch}
        options={vehicles?.map((el) => {
          return {
            value: el.id?.toString(),
            name: `${el.vehicle_brands?.brand} ${
              el.vehicle_models?.model
            } - [${el.vehicle_identification_numbers?.vin?.slice(
              el.vehicle_identification_numbers?.vin.length - 6,
              el.vehicle_identification_numbers?.vin.length + 1,
            )}]`,
            identity: 'vehicle',
          };
        })}
        optionsZIndex={50}
        optionsContainerHeight={30}
        selectBtnWidth={10}
        inputWidth={90}
      />
      <TextAreaInput
        width={0}
        height={12.962962}
        widthFull
        label=""
        marginTop={3.148148}
        name="note"
        onChange={handleChange}
        value={inputs.note}
        placeholder="Type note here"
        fieldErrors={fieldErrors}
      />
      <ButtonContainer marginTop={3.148148} widthFull justify="right">
        <Button
          backgroundColor="#00A78B"
          identity="save"
          onClick={handleButton}
          textColor="#FFF"
          buttonText="Save"
        />
      </ButtonContainer>
    </BorderedContent>
  );
}
