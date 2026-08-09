import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { Input } from '&/inputs/Input';
import {
  adminDashboardStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { vehiclesDataStore } from '@/store/inventory';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { CustomerContactIndicator } from './customerContactIndicator/CustomerContactIndicator';
import { CustomerEmailIndicator } from './customerEmailIndicator/CustomerEmailIndicator';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { CancelIcon, SearchLensGreen } from '@/app/ui/icons/Icons';
import { MultiOptionsSelect } from '@/app/ui/miscellaneous/multiOptionsSelect/MultiOptionsSelect';
import { useCan } from '@/hooks/permissions';
import { Can } from '&/auth/Can';

interface InputsType {
  assignedCustomerName: string;
  assignedCustomerId: string;
  interestedVehicleName: string;
  interestedVehicleId: string;
  sellerAssignedName: string;
  sellerAssignedId: string;
  bdcAssignedName: string;
  bdcAssignedId: string;
  managerAssignedName: string;
  managerAssignedId: string;
  financeManagerAssignedName: string;
  financeManagerAssignedId: string;
  followUpDate: string;
  followUpDateTime: string;
  subject: string;
  description: string;
  reminderTimeId: string;
  taskAssignedTo: string[];
}
type InputsTypeKeys = keyof InputsType;

export function TaskContent({
  inputs,
  fieldErrors,
  onChange,
  onDayPick,
  onTimeChange,
  onUpdate,
  onAssignedClick,
  onClickRemoveVehicle,
  onUserAssignedClick,
}: {
  inputs: InputsType;
  fieldErrors:
    | {
        [key: string]: [string | undefined];
      }
    | undefined;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
  onDayPick: (e: Date) => void;
  onTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onUpdate: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onAssignedClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    keys: { keyForString: InputsTypeKeys; keyForValue: InputsTypeKeys },
  ) => void;
  onUserAssignedClick: (value: string[]) => void;
  onClickRemoveVehicle: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----
  const { clientsData, sellersData, reminderTime, bdc, salesManagers, financeManagers } =
    adminDashboardStore();

  const vehicles = vehiclesDataStore((store) => store.vehicles);

  const { singleClientTasks } = adminDashboardStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { getSingleClientData, singleCLientData } = singleCLientDataStore();

  const { openClientDetail } = modalWindowStore();

  const { can } = useCan();

  // ----- local states -----

  const optionsAdderSelectDefault1 = {
    iconTextGap: 0,
    optionsBackgroundColor: '#FFF',
    optionsHeight: 5,
    optionsNameColor: '#00A78B',
    optionsRadius: 0.3,
    optionsWidth: 20,
    selectThreeDottedIcon: true,
    selectBtnCursorPointer: true,
    selectBtnBackgroundColor: '#C9EBE6',
    selectBtnWidth: 5,
    inputWidth: 95,
  };

  const optionsAdderSelectDefault2 = {
    iconTextGap: 0,
    optionsBackgroundColor: '#FFF',
    optionsHeight: 5,
    optionsNameColor: '#00A78B',
    optionsRadius: 0.3,
    optionsWidth: 20,
    selectThreeDottedIcon: true,
    selectBtnCursorPointer: true,
    selectBtnBackgroundColor: '#C9EBE6',
    selectBtnWidth: 15,
    inputWidth: 85,
  };

  const inputData1 = [
    {
      id: 1,
      AdderSelect: true,
      label: 'Customer',
      name: 'assignedCustomerName',
      width: 51.2,
      value: inputs.assignedCustomerName,
      options: clientsData?.map((el) => {
        return {
          name: `${el.first_name || ''} ${el.last_name || ''}`,
          value: el.id.toString(),
          identity: 'assignedCustomerName',
        };
      }),
      onChange: onChange,
      keyForString: 'assignedCustomerName',
      keyForValue: 'assignedCustomerId',
      detail: true,
      detailId: inputs.assignedCustomerId,
      can: 14,
    },
    {
      id: 2,
      label: 'Subject',
      name: 'subject',
      type: 'text',
      value: inputs.subject,
      width: 51.25,
      can: 15,
      onChange: onChange,
    },
    {
      id: 3,
      label: 'Description',
      name: 'description',
      type: 'textarea',
      value: inputs.description,
      width: 51.25,
      can: 16,
      onChange: onChange,
    },
    {
      id: 4,
      AdderSelect: true,
      label: 'Interested Vehicle',
      name: 'interestedVehicleName',
      width: 51.2,
      value: inputs.interestedVehicleName,
      options: vehicles?.map((el) => {
        return {
          value: el.id?.toString(),
          name: `${el.vehicle_brands?.brand} ${
            el.vehicle_models?.model
          } [${el.stock_no?.slice(-6)}]`,
          identity: 'vehicle',
        };
      }),
      onChange: onChange,
      keyForString: 'interestedVehicleName',
      keyForValue: 'interestedVehicleId',
      can: 17,
    },
  ];

  const inputData2 = [
    {
      id: 15,
      multipleSelect: true,
      width: 22,
      label: 'Task assigned to',
      name: 'taskAssignedToName',
      value: inputs.taskAssignedTo,
      optionsAdderSelect: sellersData?.map((el) => {
        return {
          name: `${el.name || ''} ${el.last_name || ''}`,
          value: el.id.toString(),
          identity: '',
        };
      }),
      onChange: onChange,
      keyForString: 'taskAssignedToName',
      keyForValue: 'taskAssignedToId',
      can: 18,
    },
    {
      id: 6,
      label: 'Reminder Time',
      name: 'reminderTimeId',
      type: 'select',
      value: inputs.reminderTimeId,
      options: reminderTime?.map((el) => ({ value: el.id, option: el.time })),
      width: 16.590104,
      onChange: onChange,
    },
    {
      id: 5,
      AdderSelect: true,
      width: 22,
      label: 'Seller assigned to',
      name: 'sellerAssignedName',
      value: inputs.sellerAssignedName,
      optionsAdderSelect: sellersData?.map((el) => {
        return {
          name: `${el.name || ''} ${el.last_name || ''}`,
          value: el.id.toString(),
          identity: '',
        };
      }),
      onChange: onChange,
      keyForString: 'sellerAssignedName',
      keyForValue: 'sellerAssignedId',
      disabled: true,
    },
    {
      id: 8,
      customerNumberIndicator: true,
      label: 'Mobile Phone',
      width: 16.590104,
    },
    {
      id: 7,
      AdderSelect: true,
      width: 22,
      label: 'BDC assigned to',
      name: 'bdcAssignedName',
      value: inputs.bdcAssignedName,
      optionsAdderSelect: bdc?.map((el) => {
        return {
          name: `${el.name || ''} ${el.last_name || ''}`,
          value: el.id.toString(),
          identity: '',
        };
      }),
      onChange: onChange,
      keyForString: 'bdcAssignedName',
      keyForValue: 'bdcAssignedId',
      disabled: true,
    },
    {
      id: 10,
      customerEmailIndicator: true,
      label: 'Email',
      width: 16.590104,
    },
    {
      id: 9,
      AdderSelect: true,
      width: 22,
      label: 'Manager assigned to',
      name: 'managerAssignedName',
      value: inputs.managerAssignedName,
      optionsAdderSelect: salesManagers?.map((el) => {
        return {
          name: `${el.name || ''} ${el.last_name || ''}`,
          value: el.id.toString(),
          identity: '',
        };
      }),
      onChange: onChange,
      keyForString: 'managerAssignedName',
      keyForValue: 'managerAssignedId',
      disabled: true,
    },
  ];

  const inputData3 = [
    {
      id: 11,
      AdderSelect: true,
      width: 22,
      label: 'Finance Manager assigned to',
      name: 'financeManagerAssignedName',
      value: inputs.financeManagerAssignedName,
      optionsAdderSelect: financeManagers?.map((el) => {
        return {
          name: `${el.name || ''} ${el.last_name || ''}`,
          value: el.id.toString(),
          identity: '',
        };
      }),
      onChange: onChange,
      keyForString: 'financeManagerAssignedName',
      keyForValue: 'financeManagerAssignedId',
      disabled: true,
    },
    {
      id: 12,
      label: 'Follow Up Date',
      name: 'followUpDate',
      width: 22,
      value: inputs.followUpDate,
      type: 'DottedDate',
      timeDataValue: inputs.followUpDateTime,
      identity: 'followUpDate',
      fetchTimeData: true,
      dayPickerDisabledbefore: new Date(),
      disabled: true,
      onChange: () => {},
      onDayPickerClick: onDayPick,
      onTimeChanged: onTimeChange,
      dontCloseDatePickerAfterPick: true,
      showTimeAdvise: true,
      noDatePickerYearSelect: true,
      fieldErrors: fieldErrors,
      noDisabledBgColor: true,
      optionsPositionTop: true,
      can: 19,
    },
    {
      id: 13,
      label: 'Home Phone',
      name: '',
      width: 22,
      value: formatPhoneNumber(singleClientTasks?.customer?.home_phone || '') || '',
      type: 'text',
      disabled: true,
      noDisabledBgColor: true,
      onChange: () => {},
    },
    {
      id: 14,
      label: 'Work Phone',
      name: '',
      width: 22,
      value: formatPhoneNumber(singleClientTasks?.customer?.work_phone || '') || '',
      type: 'text',
      disabled: true,
      noDisabledBgColor: true,
      onChange: () => {},
    },
  ];

  return (
    <BorderedContent title="General Detail Information">
      {inputData1.map((el, index) => {
        if (el.AdderSelect) {
          return (
            <section
              key={`;;;;${el.id}taskcontent'''''${index}`}
              className={`relative flex flex-row justify-between items-center px-[2vw] ${
                index ? 'mt-[2.314815vh]' : ''
              }`}
            >
              <label
                htmlFor="clientName"
                className="h-[5.277778vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-center items-center"
              >
                <p>{el.label}</p>
              </label>
              <div className="flex flex-row gap-[1vw] items-center">
                {el.detail && el.detailId && !singleCLientData?.id && (
                  <button
                    onClick={() => {
                      getSingleClientData(el.detailId);

                      openClientDetail();
                    }}
                    type="button"
                    className="w-[2vw] h-[2vw] flex justify-center items-center border border-primaryColor rounded-lg shadow-crmFormShadow"
                  >
                    <SearchLensGreen />
                  </button>
                )}
                <AdderSelect
                  label=""
                  name={el.name}
                  value={el.value}
                  onChange={can(el.can) ? el.onChange : () => {}}
                  onClick={
                    can(el.can)
                      ? (e) =>
                          onAssignedClick(e, {
                            keyForString: el.keyForString as keyof InputsType,
                            keyForValue: el.keyForValue as keyof InputsType,
                          })
                      : () => {}
                  }
                  options={can(el.can) ? el.options : undefined}
                  fieldErrors={fieldErrors}
                  width={el.width}
                  {...optionsAdderSelectDefault1}
                />
              </div>
              {index === 3 && inputs.interestedVehicleId && can(17) && (
                <button
                  type="button"
                  className="absolute left-[67vw] w-fit h-fit"
                  onClick={can(el.can) ? onClickRemoveVehicle : undefined}
                >
                  <CancelIcon />
                </button>
              )}
            </section>
          );
        } else {
          return (
            <section
              key={`'''''${el.id}taskcontent;;;;${index}`}
              className={`flex flex-row justify-between items-center px-[2vw] ${
                index > 0 ? 'mt-[2.314815vh]' : ''
              }`}
            >
              <label
                htmlFor="clientName"
                className="h-[5.277778vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-center items-center"
              >
                <p>{el.label}</p>
              </label>
              {el.type === 'textarea' ? (
                <textarea
                  name="description"
                  id="subject"
                  value={el.value}
                  onChange={can(el.can) ? el.onChange : () => {}}
                  rows={4}
                  className="h-[7.277778vh] py-[1vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] resize-none outline-none"
                  style={{
                    width: `${el.width}vw`,
                  }}
                />
              ) : (
                <Input
                  label=""
                  name={el.name}
                  type={el.type}
                  value={el.value}
                  width={el.width}
                  fieldErrors={fieldErrors}
                  onChange={can(el.can) ? el.onChange : () => {}}
                />
              )}
            </section>
          );
        }
      })}
      <ContentRow
        cols={2}
        gap={2.314815}
        justifyContent="space-between"
        paddingX={2}
        marginTop={2.314815}
        marginBottom={2.314815}
        widthFull
      >
        {inputData2.map((el, index) => {
          if (el.AdderSelect) {
            return (
              <section
                key={`;;;;${el.id}taskcontent'''''${index}`}
                className={`flex flex-row justify-between items-center gap-[5vw]`}
              >
                <label
                  htmlFor="clientName"
                  className="text-[1.626852vh] font-medium text-[#B3B3B3] flex justify-center items-center"
                >
                  <p>{el.label}</p>
                </label>
                <AdderSelect
                  label=""
                  name={el.name}
                  width={el.width}
                  value={el.value}
                  onChange={el.onChange}
                  onClick={
                    !el.disabled
                      ? (e) =>
                          onAssignedClick(e, {
                            keyForString: el.keyForString as keyof InputsType,
                            keyForValue: el.keyForValue as keyof InputsType,
                          })
                      : () => {}
                  }
                  options={el.optionsAdderSelect}
                  fieldErrors={fieldErrors}
                  {...optionsAdderSelectDefault2}
                  disabledButton={el.disabled}
                  disabledInput={el.disabled}
                />
              </section>
            );
          } else if (el.multipleSelect) {
            return (
              <section
                key={`;;;;${el.id}taskcontent'''''${index}`}
                className={`flex flex-row justify-between items-center gap-[5vw]`}
              >
                <label
                  htmlFor="clientName"
                  className="text-[1.626852vh] font-medium text-[#B3B3B3] flex justify-center items-center"
                >
                  <p>{el.label}</p>
                </label>
                <MultiOptionsSelect
                  width={el.width}
                  optionsSelected={el.value}
                  options={sellersData?.map((el) => ({
                    value: el.id,
                    option: `${el.name || ''} ${el.last_name || ''}${
                      el.username ? ` - ${el.username}` : ''
                    }`,
                  }))}
                  fieldErrors={fieldErrors}
                  fieldErrorTop={5}
                  noOpenItemsList={!can(18)}
                  name="taskAssignedTo"
                  onClick={can(18) ? onUserAssignedClick : () => {}}
                />
              </section>
            );
          } else {
            return (
              <section
                key={`'''''${el.id}taskcontent;;;;${index}`}
                className={`flex flex-row justify-between items-center gap-[3vw]`}
              >
                <label
                  htmlFor="clientName"
                  className="text-[1.626852vh] font-medium text-[#B3B3B3] flex justify-center items-center"
                >
                  <p>{el.label}</p>
                </label>
                {el.customerNumberIndicator ? (
                  <CustomerContactIndicator width={el.width} />
                ) : el.customerEmailIndicator ? (
                  <CustomerEmailIndicator width={el.width} />
                ) : (
                  el.onChange && (
                    <Input
                      label=""
                      name={el.name}
                      type={el.type}
                      value={typeof el.value === 'string' ? el.value : ''}
                      options={el.options}
                      width={el.width}
                      fieldErrors={fieldErrors}
                      onChange={el.onChange}
                    />
                  )
                )}
              </section>
            );
          }
        })}
      </ContentRow>
      <ContentRow cols={1} gap={2.314815} paddingX={2}>
        {inputData3.map((el, index) => {
          if (el.AdderSelect) {
            return (
              <section
                key={`;;;;${el.id}taskcontent'''''${index}`}
                className={`flex flex-row justify-between items-center gap-[5vw]`}
              >
                <label
                  htmlFor="clientName"
                  className="w-[8.25vw] h-[5.277778vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-center items-center text-wrap"
                >
                  <p>{el.label}</p>
                </label>
                <AdderSelect
                  label=""
                  name={el.name}
                  value={el.value}
                  onChange={el.onChange}
                  onClick={(e) =>
                    onAssignedClick(e, {
                      keyForString: el.keyForString as keyof InputsType,
                      keyForValue: el.keyForValue as keyof InputsType,
                    })
                  }
                  options={el.optionsAdderSelect}
                  fieldErrors={fieldErrors}
                  width={el.width}
                  {...optionsAdderSelectDefault2}
                  disabledButton={el.disabled}
                  disabledInput={el.disabled}
                />
              </section>
            );
          } else {
            return (
              <section
                key={`'''''${el.id}taskcontent;;;;${index}`}
                className={`flex flex-row justify-between items-center`}
              >
                <label
                  htmlFor="clientName"
                  className="h-[5.277778vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-center items-center"
                >
                  <p>{el.label}</p>
                </label>
                <Input
                  label=""
                  name={el.name}
                  width={el.width}
                  value={el.value}
                  type={el.type}
                  timeDataValue={el.timeDataValue}
                  identity={el.identity}
                  fetchTimeData={el.fetchTimeData}
                  dayPickerDisabledbefore={el.dayPickerDisabledbefore}
                  disabled={el.disabled}
                  onChange={el.onChange}
                  onDayPickerClick={el.onDayPickerClick}
                  onTimeChanged={el.onTimeChanged}
                  dontCloseDatePickerAfterPick={el.dontCloseDatePickerAfterPick}
                  showTimeAdvise={el.showTimeAdvise}
                  noDatePickerYearSelect={el.noDatePickerYearSelect}
                  fieldErrors={el.fieldErrors}
                  noDisabledBgColor={el.noDisabledBgColor}
                  optionsPositionTop
                  inputWidth={85}
                  selectBtnWidth={15}
                  disabledDayPickerBtn={!can(19)}
                />
              </section>
            );
          }
        })}
      </ContentRow>
      <Can requiredPermission={[14, 15, 16, 17, 18, 19]}>
        <ButtonContainer marginTop={2.5} widthFull justify="right" paddingRight={2}>
          <Button
            backgroundColor="#00A78B"
            identity=""
            textColor="#FFF"
            width={9.895833}
            buttonText="Update"
            buttonTextSize={2}
            onClick={onUpdate}
          />
        </ButtonContainer>
      </Can>
    </BorderedContent>
  );
}
