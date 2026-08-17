import { useEffect, useRef, useState } from 'react';
import {
  adminDashboardStore,
  modalWindowStore,
  numberFormatterStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { vehiclesDataStore } from '@/store/inventory';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { Button } from '&/buttons/Button';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { VehiclesData } from '@/app/libs/definitions';
import { Input } from '&/inputs/Input';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { useSocketStore } from '@/store/socketIo';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { DownloadIcon, TrashIcon, UploadFileIcon } from '@/app/ui/icons/Icons';
import Link from 'next/link';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { leadsStore } from '@/store/leads';
import { EndVisitVehiclePicker } from '@/app/ui/dashboard/endVisit/endVisitVehiclePicker/EndVisitVehiclePicker';
import { AddOtherVehicleModal } from '../../../../reports/salesLog/salesLogStatistics/salesScore/addOther/AddVehicleModal';

export function Deposit() {
  // ----- global states -----
  const { updateDataWithSocket } = useSocketStore();

  const { closeDeposit, closeClientDetail } = modalWindowStore();

  const { singleCLientData } = singleCLientDataStore();
  const { clearSingleClientData, getSingleClientData } = singleCLientDataStore();

  const { depositMethodData, depositOpenedFromEndVisit } = adminDashboardStore();
  const { getDepositMethods, setDepositOpenedFromEndVisit, setEndVisitWithDeposit } =
    adminDashboardStore();

  const { vehicles } = vehiclesDataStore();
  const { getVehiclesData } = vehiclesDataStore();

  const currentLead = leadsStore((state) => state.currentLead);

  const { numberFilter } = numberFormatterStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  useEffect(() => {
    getDepositMethods();
    getVehiclesData().finally(() => {
      setLoading(false);
    });
  }, [getDepositMethods, getVehiclesData]);

  // ----- local states -----

  const [loading, setLoading] = useState<boolean>(true);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  const [inputs, setInputs] = useState<{
    interestedVehicle: string;
    interestedVehicleSearch: string;
    amount: string;
    proFee: string;
    total: string;
    method: string;
    reference: string;
    nonRefundable: string;
    goodThroughDate: string;
    depositDate: string;
    note: string;
  }>({
    interestedVehicle: '',
    interestedVehicleSearch: '',
    amount: numberFilter('', 1),
    proFee: numberFilter('', 1),
    total: numberFilter('', 1),
    method: '0',
    reference: '',
    nonRefundable: '',
    goodThroughDate: '',
    note: '',
    depositDate: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const vehicle = singleCLientData?.interested_vehicle;
    if (vehicle) {
      setInputs((prev) => ({
        ...prev,
        interestedVehicle: vehicle.id.toString(),
        interestedVehicleSearch: `${vehicle.vehicle_brands?.brand || ''} ${vehicle.vehicle_models?.model || ''}`,
      }));
    }
  }, [singleCLientData]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;

    const numberInputs = ['amount', 'proFee'];

    if (numberInputs.includes(name)) {
      const filteredVal = numberFilter(value);

      setInputs((prevState) => {
        let newData = { ...prevState };

        switch (name) {
          case 'amount':
            newData.amount = numberFilter(filteredVal, 1);
            break;

          case 'proFee':
            newData.proFee = numberFilter(filteredVal, 1);
            break;
        }

        newData.total = numberFilter(
          `${
            parseFloat(numberFilter(newData.amount) || '0') +
            parseFloat(numberFilter(newData.proFee) || '0')
          }`,
          1,
        );

        return newData;
      });
    } else if (e.currentTarget instanceof HTMLInputElement && name === 'nonRefundable') {
      const { checked } = e.currentTarget;

      setInputs((prevState) => ({
        ...prevState,
        nonRefundable: checked ? '1' : '',
      }));

      return;
    } else {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch, setManualFieldErrors } = useAsyncFetching();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'vehicle') {
      setInputs((prevState) => ({
        ...prevState,
        interestedVehicle: value,
        interestedVehicleSearch: name,
      }));
    }

    if (identity === 'add') {
      const formData = new FormData();

      const numbersValues = ['amount', 'total', 'proFee'];

      for (const [key, value] of Object.entries(inputs)) {
        if (numbersValues.includes(key)) {
          const onlyNumberCharacters = numberFilter(value);

          formData.append(key, onlyNumberCharacters);
        } else {
          formData.append(key, value);
        }
      }

      if (file) {
        formData.append('receiptFile', file);
      }
      if (!inputs.goodThroughDate) {
        formData.delete('goodThroughDate');
      }
      if (!inputs.reference) {
        formData.delete('reference');
      }
      if (!inputs.method || inputs.method === '0') {
        formData.delete('method');
      }
      const apiUrl = `/api/adminDashboard/deposit/${singleCLientData?.id}${currentLead ? `?leadId=${currentLead}` : ''}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 70,
        options: {
          onSuccess: () => {
            updateDataWithSocket('notifications', singleCLientData?.seller?.email);

            setInputs({
              interestedVehicle: '',
              interestedVehicleSearch: '',
              amount: numberFilter('', 1),
              proFee: numberFilter('', 1),
              total: numberFilter('', 1),
              method: '',
              reference: '',
              nonRefundable: '',
              goodThroughDate: '',
              note: '',
              depositDate: '',
            });

            if (singleCLientData?.id) {
              getSingleClientData(singleCLientData.id.toString(), currentLead);
              closeDeposit();
            }

            setFile(null);

            if (depositOpenedFromEndVisit) {
              setEndVisitWithDeposit(true);

              closeDeposit();

              clearSingleClientData();

              closeClientDetail();
            }
          },
          onFieldErrors: (errors) => {
            setManualFieldErrors({
              ...errors,
              interestedVehicleSearch: errors.interestedVehicle,
            });
          },
        },
      });
    }
  };

  const handleDepositDate = (e: Date) => {
    setInputs((prevStatus) => ({
      ...prevStatus,
      depositDate: formatIncomingObjectDate(e),
      goodThroughDate: '',
    }));
  };

  const handleGoodThroughDate = (e: Date) => {
    setInputs((prevStatus) => ({
      ...prevStatus,
      goodThroughDate: formatIncomingObjectDate(e),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const inputDataOne = [
    {
      id: 1,
      name: '',
      value: `${singleCLientData?.first_name || ''} ${singleCLientData?.last_name || ''}`,
      label: 'Customer',
      width: 33.2734375,
      iconTextGap: 0,
      optionsHeight: 5,
      optionsRadius: 1.1,
      optionsWidth: 14,
      selectBtnWidth: 10,
      inputWidth: 90,
      selectThreeDottedIcon: true,
      selectBtnCursorPointer: false,
      disabledButton: true,
      disabledInput: true,
      optionsBackgroundColor: '#FFF',
      optionsNameColor: '#00A78B',
      selectBtnBackgroundColor: '#C9EBE6',
      onClick: handleClick,
      onChange: handleChange,
    },
  ];

  const inputDataTwo = [
    {
      id: 3,
      label: 'Amount',
      name: 'amount',
      value: inputs.amount,
      type: 'text',
      width: 11.197917,
      onChange: handleChange,
    },
    {
      id: 4,
      label: 'Processing Fee',
      name: 'proFee',
      value: inputs.proFee,
      type: 'text',
      width: 11.197917,
      onChange: handleChange,
    },
    {
      id: 5,
      label: 'Total',
      name: 'total',
      value: inputs.total,
      type: 'text',
      width: 11.197917,
      disabled: true,
      onChange: handleChange,
    },
    {
      id: 6,
      label: 'Method',
      name: 'method',
      value: inputs.method,
      type: 'select',
      textAlterColor: '#00A78B',
      options: [{ value: 0, option: 'Select Method' }].concat(
        depositMethodData.map((el) => {
          return { value: el.id || 0, option: el.method || 'Select' };
        }),
      ),
      width: 17.447917,
      onChange: handleChange,
    },
    {
      id: 7,
      label: 'Reference',
      name: 'reference',
      value: inputs.reference,
      type: 'text',
      width: 17.447917,
      onChange: handleChange,
    },
  ];

  const inputDataThree = [
    {
      id: 8,
      label: 'Deposit date',
      name: 'depositDate',
      value: inputs.depositDate,
      type: 'DottedDate',
      width: 33.2734375,
      threeDotsDateInput: true,
      noDatePickerYearSelect: true,
      disabled: true,
      dayPickerDisabledAfter: new Date(),
      onChange: handleChange,
      onDateClick: handleDepositDate,
    },
    {
      id: 9,
      label: 'Good Through Date',
      name: 'goodThroughDate',
      value: inputs.goodThroughDate,
      type: 'DottedDate',
      width: 33.2734375,
      threeDotsDateInput: true,
      dayPickerDisabledbefore: new Date(inputs.depositDate) || new Date(),
      noDatePickerYearSelect: true,
      disabled: true,
      onChange: handleChange,
      onDateClick: handleGoodThroughDate,
    },
    {
      id: 10,
      label: 'Non-Refundable',
      name: 'nonRefundable',
      value: inputs.nonRefundable,
      type: 'checkbox',
      chekcboxText: 'Non-Refundable',
      width: 0,
      onChange: handleChange,
    },
  ];

  const filePreviewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <ModalWindow top={0} minSizeFull positionFixed>
      <ModalContainer marginTop={4.5} width={83.385417}>
        <ModalContainerTitle
          title="Deposit"
          closeWindowFunction={() => {
            if (depositOpenedFromEndVisit) {
              setDepositOpenedFromEndVisit(false);

              clearSingleClientData();

              closeClientDetail();
            }

            closeDeposit();
          }}
        />
        <ModalContent overflowVisible loading={loading || loadingFetch} height={83}>
          <BorderedContent overflowVisible>
            <ContentRow cols={2} gap={2}>
              {inputDataOne.map((el, index) => (
                <AdderSelect
                  key={`_${index}_${el.id * 5}_`}
                  name={el.name}
                  value={el.value}
                  label={el.label}
                  width={el.width}
                  iconTextGap={el.iconTextGap}
                  selectThreeDottedIcon={el.selectThreeDottedIcon}
                  optionsBackgroundColor={el.optionsBackgroundColor}
                  optionsHeight={el.optionsHeight}
                  optionsNameColor={el.optionsNameColor}
                  optionsRadius={el.optionsRadius}
                  selectBtnCursorPointer={el.selectBtnCursorPointer}
                  inputWidth={el.inputWidth}
                  optionsWidth={el.optionsWidth}
                  selectBtnWidth={el.selectBtnWidth}
                  selectBtnBackgroundColor={el.selectBtnBackgroundColor}
                  disabledButton={el.disabledButton}
                  disabledInput={el.disabledInput}
                  onClick={el.onClick}
                  onChange={el.onChange}
                  fieldErrors={fieldErrors}
                />
              ))}
              <div className="w-[34.315104vw] flex items-end gap-4 !max-lg:w-full max-lg:flex-col max-lg:items-stretch max-lg:gap-3">
                <div className="w-full">
                  <EndVisitVehiclePicker
                    vehicleId={inputs.interestedVehicle}
                    onClick={(id: string) => {
                      setInputs((prev) => ({
                        ...prev,
                        interestedVehicle: id,
                      }));
                    }}
                    label="Vehicle"
                    bgColor="#F4F4F4"
                  />
                </div>
                {inputs.interestedVehicle ? (
                  <Button
                    backgroundColor="#FF5555"
                    identity="remove-vehicle"
                    textColor="#FFF"
                    buttonText="Remove"
                    onClick={() => {
                      setInputs((prevState) => ({
                        ...prevState,
                        interestedVehicle: '',
                        interestedVehicleSearch: '',
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
              </div>
            </ContentRow>
            <ContentRow cols={5} gap={2} marginTop={3}>
              {inputDataTwo.map((el, index) => (
                <Input
                  key={`/${el.id * index}_${index + 2}/`}
                  label={el.label}
                  name={el.name}
                  type={el.type}
                  value={el.value}
                  width={el.width}
                  options={el.options}
                  onChange={el.onChange}
                  disabled={el.disabled}
                  textAlterColor={el.textAlterColor}
                  fieldErrors={fieldErrors}
                />
              ))}
            </ContentRow>
            <ContentRow cols={2} gap={3} marginTop={3} alignItems="center">
              {inputDataThree.map((el, index) => (
                <Input
                  key={`[${el.id * index}_${index + 2}]`}
                  label={el.label}
                  name={el.name}
                  type={el.type}
                  value={el.value}
                  width={el.width}
                  chekcboxText={el.chekcboxText}
                  onChange={el.onChange}
                  onDayPickerClick={el.onDateClick}
                  threeDotsDateInput={el.threeDotsDateInput}
                  fieldErrors={fieldErrors}
                  dayPickerDisabledAfter={el.dayPickerDisabledAfter}
                  dayPickerDisabledbefore={el.dayPickerDisabledbefore}
                  noDatePickerYearSelect={el.noDatePickerYearSelect}
                  disabled={el.disabled}
                  noDisabledBgColor
                />
              ))}
            </ContentRow>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg, application/pdf"
            />
            <div className="max-w-[40%] mt-[3vh] flex gap-4 max-lg:max-w-full max-lg:mt-3 max-lg:flex-col max-lg:items-stretch">
              <Button
                backgroundColor="#FFF"
                identity="upload"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                textColor="#00A78B"
                buttonText={`${file ? 'Change file' : 'Upload Scanned Deposit'}`}
                width={25.166667}
                borderColor="#00A78B"
                border={0.05}
                buttonIcon={<UploadFileIcon />}
                iconTextGap={0.5}
              />
              {file && (
                <div className="flex gap-2 w-full">
                  <Link
                    href={filePreviewUrl || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-[5.740741vh] flex flex-row justify-center items-center bg-[#c7e2dd75] cursor-pointer hover:bg-[#94afab75] transition-colors rounded-b-[0.520833vw]"
                  >
                    <DownloadIcon />
                    <p className="ml-[0.260416vw] text-[1.851852vh] font-normal leading-[1.805556vh] text-[#00A78B] !max-lg:text-sm max-lg:ml-0">
                      Scanned deposit
                    </p>
                  </Link>
                  <button
                    title="Remove file"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="h-[5.740741vh] px-4 flex justify-center items-center border border-red-500 cursor-pointer hover:bg-red-50 transition-colors rounded-b-[0.520833vw] max-lg:h-12"
                  >
                    <TrashIcon color="#f87171" />
                  </button>
                </div>
              )}
            </div>
            <div className="w-full mt-[2vh]">
              <TextAreaInput
                label=""
                name="note"
                value={inputs.note}
                onChange={handleChange}
                width={0}
                placeholder="Type note here"
                widthFull
                height={12.685185}
              />
            </div>
          </BorderedContent>
          <ButtonContainer marginTop={5} widthFull justify="end" gap={1}>
            <Button
              backgroundColor="#00A78B"
              identity="add"
              onClick={handleClick}
              textColor="#FFF"
              buttonText="Add"
              width={11.875}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
      {showAddVehicleModal && (
        <AddOtherVehicleModal
          onClose={() => setShowAddVehicleModal(false)}
          onSave={(vehicle) => {
            setInputs((prev) => ({
              ...prev,
              interestedVehicle: vehicle.id.toString(),
              interestedVehicleSearch: `${vehicle.brand} ${vehicle.model}`,
            }));
          }}
        />
      )}
    </ModalWindow>
  );
}
