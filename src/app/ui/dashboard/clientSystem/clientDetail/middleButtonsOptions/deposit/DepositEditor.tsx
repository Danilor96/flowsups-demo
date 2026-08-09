import { useEffect, useRef, useState } from 'react';
import {
  adminDashboardStore,
  messagesStore,
  modalWindowStore,
  numberFormatterStore,
  singleCLientDataStore
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
import { DownloadIcon, PrinterIcon, TrashIcon, UploadFileIcon } from '@/app/ui/icons/Icons';
import { DepositData, DepositReceipt } from '../../../customerLists/DepositComponents/DepositReceipt';
import Link from 'next/link';
import { updateDataEvent } from '../../../customerLists/utils/utils';
import { ConfirmNotification } from '@/app/ui/notifications/Notification';
import { EndVisitVehiclePicker } from '@/app/ui/dashboard/endVisit/endVisitVehiclePicker/EndVisitVehiclePicker';
import { AddOtherVehicleModal } from '../../../../reports/salesLog/salesLogStatistics/salesScore/addOther/AddVehicleModal';

const formatVehicle = (vehicle: any) => {
  return `${vehicle.vehicle_brands?.brand || ''} ${vehicle.vehicle_models?.model || ''} [${
    vehicle.vehicle_identification_numbers?.vin?.slice(-6) || ''
  }]`;
};

export function DepositEditor({ depositId, openClose }: { depositId: number; openClose: () => void }) {
  // ----- global states -----
  const { socket } = useSocketStore();

  const { messages } = messagesStore();
  const { setMessages } = messagesStore();

  const { singleCLientData } = singleCLientDataStore();

  const { depositMethodData } = adminDashboardStore();
  const { getDepositMethods, getSpecificClients, getSpecificClientsNotes } = adminDashboardStore();

  const { vehicles } = vehiclesDataStore();
  const { getVehiclesData } = vehiclesDataStore();

  const { numberFilter } = numberFormatterStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();
  const updateDataWithSocket = useSocketStore(store => store.updateDataWithSocket);

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
    customerName: string;
    scannedDepositUrl: string;
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
    customerName: '',
    scannedDepositUrl: ''
  });

  const [fieldErrors, setFieldErrors] = useState<{
    interestedVehicleSearch: [string | undefined];
    amount: [string | undefined];
    proFee: [string | undefined];
    total: [string | undefined];
    method: [string | undefined];
    reference: [string | undefined];
    nonRefundable: [string | undefined];
    goodThroughDate: [string | undefined];
    note: [string | undefined];
  }>({
    interestedVehicleSearch: [undefined],
    amount: [undefined],
    proFee: [undefined],
    total: [undefined],
    method: [undefined],
    reference: [undefined],
    nonRefundable: [undefined],
    goodThroughDate: [undefined],
    note: [undefined]
  });

  const [receiptToPrint, setReceiptToPrint] = useState<DepositData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileIsPdf, setFileIsPdf] = useState<boolean>(false);
  const [openPrintMenu, setOpenPrintMenu] = useState<boolean>(false);
  const [showConfirmNotification, setShowConfirmNotification] = useState<boolean>(false);


  useEffect(() => {
    if (receiptToPrint) {
      window.print();
    }
  }, [receiptToPrint]);

  useEffect(() => {
    const getDepositData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/adminDashboard/deposit/${depositId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const { data } = await response.json();
        if (data) {
          setInputs({
            interestedVehicle: data.vehicle_id?.toString() || '',
            interestedVehicleSearch: data.vehicle ? formatVehicle(data.vehicle) : '',
            amount: data.amount ? numberFilter(data.amount, 1) : '',
            proFee: data.processing_fee ? numberFilter(data.processing_fee, 1) : '',
            total: data.total ? numberFilter(`${data.total}`, 1) : '',
            method: data.method_id?.toString() || '1',
            reference: data.reference || '',
            nonRefundable: data.non_refundable || '',
            goodThroughDate: data.good_through_date ? formatIncomingObjectDate(data.good_through_date) : '',
            note: data.note ? data.note.note : '',
            depositDate: data.deposit_date ? formatIncomingObjectDate(data.deposit_date) : '',
            customerName: data.client ? `${data.client?.first_name || ''} ${data.client?.last_name || ''}` : '',
            scannedDepositUrl: data.scanned_deposit_url ? data.scanned_deposit_url : ''
          });
          if (data.scanned_deposit_url) {
            console.log('Scanned deposit URL:', data.scanned_deposit_url);
            fetch(inputs.scannedDepositUrl, { method: 'GET' })
              .then(res => {
                return res.blob();
              })
              .then(blob => {
                const contentType = blob.type;
                console.log('Content-Typeeeeee:  ', contentType);
                if (contentType === 'application/pdf') {
                  setFileIsPdf(true);
                } else {
                  setFileIsPdf(false);
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getDepositData();
    getDepositMethods();
    getVehiclesData().finally(() => {
      setLoading(false);
    });
  }, [getDepositMethods, getVehiclesData, depositId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;

    const numberInputs = ['amount', 'proFee'];

    if (numberInputs.includes(name)) {
      const filteredVal = numberFilter(value);

      setInputs(prevState => {
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
          `${parseFloat(numberFilter(newData.amount) || '0') + parseFloat(numberFilter(newData.proFee) || '0')}`,
          1
        );

        return newData;
      });
    } else if (e.currentTarget instanceof HTMLInputElement && name === 'nonRefundable') {
      const { checked } = e.currentTarget;

      setInputs(prevState => ({
        ...prevState,
        nonRefundable: checked ? '1' : ''
      }));

      return;
    } else {
      setInputs(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'vehicle') {
      setInputs(prevState => ({
        ...prevState,
        interestedVehicle: value,
        interestedVehicleSearch: name
      }));
    }

    if (identity === 'save') {
      try {
        setLoading(true);

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
        // if (file) {
        //   formData.append('receiptFile', file);
        // }
        if (!inputs.goodThroughDate) {
          formData.delete('goodThroughDate');
        }
        if (!inputs.reference) {
          formData.delete('reference');
        }
        if (!inputs.method || inputs.method === '0') {
          formData.delete('method');
        }

        if (!file && !inputs.scannedDepositUrl) {
          formData.append('isFileRemoved', 'true');
        }

        const res = await (
          await fetch(`/api/adminDashboard/deposit/${depositId}`, {
            method: 'PUT',
            body: formData
          })
        ).json();

        if (res.successMessage) {
          setMessages(undefined, res.successMessage);

          socket?.emit('ask_for_update_data', 'notifications', true, singleCLientData?.seller?.email);

          updateDataWithSocket(updateDataEvent.depositCustomersList);
          getSpecificClients('9').finally(() => {
            setLoading(false);
          });
          getSpecificClientsNotes('9');

          setInputs((prevState: any) => ({
            ...prevState,
            scannedDepositUrl: res.data.scanned_deposit_url ? res.data.scanned_deposit_url : ''
          }));
          setFile(null);
          setFieldErrors({
            interestedVehicleSearch: [undefined],
            amount: [undefined],
            proFee: [undefined],
            total: [undefined],
            method: [undefined],
            reference: [undefined],
            nonRefundable: [undefined],
            goodThroughDate: [undefined],
            note: [undefined]
          });

          if (res.data.scanned_deposit_url) {
            fetch(inputs.scannedDepositUrl, { method: 'GET' })
              .then(res => {
                return res.blob();
              })
              .then(blob => {
                const contentType = blob.type;
                console.log('Content-Typeeeeee:  ', contentType);
                if (contentType === 'application/pdf') {
                  setFileIsPdf(true);
                } else {
                  setFileIsPdf(false);
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
        if (res.fieldErrors) {
          setFieldErrors(prevState => {
            let newState = { ...prevState };

            newState = res.fieldErrors;

            newState.interestedVehicleSearch = res.fieldErrors.interestedVehicle;

            return newState;
          });
        }
      } catch (error) {
        setMessages('An error occurred');
      }

      setLoading(false);
    }
  };

  const handleDepositDate = (e: Date) => {
    setInputs(prevStatus => ({
      ...prevStatus,
      depositDate: formatIncomingObjectDate(e),
      goodThroughDate: ''
    }));
  };

  const handleGoodThroughDate = (e: Date) => {
    setInputs(prevStatus => ({
      ...prevStatus,
      goodThroughDate: formatIncomingObjectDate(e)
    }));
  };

  const handlePrint = () => {
    try {
      const deposit = inputs;
      setReceiptToPrint({
        id: depositId,
        customerName: deposit.customerName,
        amount: deposit.amount ? Number(deposit.amount.replace('$', '')) : 0,
        depositDate: new Date(deposit.depositDate),
        goodThroughDate: new Date(deposit.goodThroughDate),
        isNonRefundable: deposit.nonRefundable ? true : false,
        method: depositMethodData.find(method => method.id === Number(deposit.method))?.method || '',
        processingFee: deposit.proFee ? Number(deposit.proFee.replace('$', '')) : 0,
        receiptNumber: depositId.toString(),
        salesRep: '',
        total: deposit.total ? Number(deposit.total.replace('$', '')) : 0,
        vehicleName: deposit.interestedVehicleSearch,
        reference: deposit.reference ? deposit.reference : '',
        scannedDepositUrl: deposit.scannedDepositUrl ? deposit.scannedDepositUrl : ''
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // --- Lógica de Impresión (dividida en dos funciones) ---
  const handlePrintGenerated = () => {
    handlePrint();
    setOpenPrintMenu(false);
  };

  const handlePrintScanned = (url: string | null) => {
    if (!url) return;
    setReceiptToPrint(null);
    if (fileIsPdf) {
      window.open(url, '_blank');
      setOpenPrintMenu(false);
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            @media print {´
              @page { margin: 0; }
              body { margin: 0; padding: 0; }
              img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              .print-controls { display: none; }
            }
            body { display: flex; flex-direction: column; align-items: center; padding: 2rem; }
            .print-controls { margin: 20px; }
            img { max-width: 95%; max-height: 95vh; object-fit: contain; }
            button { padding: 10px 20px; background: #00A78B; color: white; border: none; border-radius: 4px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="print-controls">
            <button onclick="window.print()">Print</button>
            <button onclick="window.close()">Close</button>
          </div>
          <img src="${url}" alt="img to print" />
        </body>
      </html>
    `);
    printWindow?.document.close();
    setOpenPrintMenu(false);
  };

  const handlePrintButtonClick = () => {
    setOpenPrintMenu(!openPrintMenu);
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
      value: inputs.customerName,
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
      options: []
    }
  ];

  const inputDataTwo = [
    {
      id: 3,
      label: 'Amount',
      name: 'amount',
      value: inputs.amount,
      type: 'text',
      width: 11.197917,
      onChange: handleChange
    },
    {
      id: 4,
      label: 'Processing Fee',
      name: 'proFee',
      value: inputs.proFee,
      type: 'text',
      width: 11.197917,
      onChange: handleChange
    },
    {
      id: 5,
      label: 'Total',
      name: 'total',
      value: inputs.total,
      type: 'text',
      width: 11.197917,
      disabled: true,
      onChange: handleChange
    },
    {
      id: 6,
      label: 'Method',
      name: 'method',
      value: inputs.method,
      type: 'select',
      textAlterColor: '#00A78B',
      options: [{ value: 0, option: 'Select Method' }].concat(
        depositMethodData.map(el => {
          return { value: el.id || 0, option: el.method || '' };
        })
      ),
      width: 17.447917,
      onChange: handleChange
    },
    {
      id: 7,
      label: 'Reference',
      name: 'reference',
      value: inputs.reference,
      type: 'text',
      width: 17.447917,
      onChange: handleChange
    }
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
      dayPickerDisabledAfter: new Date(),
      onChange: handleChange,
      onDateClick: handleDepositDate,
      noDatePickerYearSelect: true,
      disabled: true
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
      onChange: handleChange,
      onDateClick: handleGoodThroughDate,
      noDatePickerYearSelect: true,
      disabled: true
    },
    {
      id: 10,
      label: 'Non-Refundable',
      name: 'nonRefundable',
      value: inputs.nonRefundable,
      type: 'checkbox',
      chekcboxText: 'Non-Refundable',
      width: 0,
      onChange: handleChange
    }
  ];

  const handleRemoveFile = () => {
    console.log('handleRemoveFile...');
    setFile(null);
    setInputs({ ...inputs, scannedDepositUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFileDecision = (isYes: boolean) => {
    if (isYes) {
      handleRemoveFile();
    }
    setShowConfirmNotification(false);
  };


  const filePreviewUrl = file ? URL.createObjectURL(file) : inputs.scannedDepositUrl || '';

  return (
    <>
      <ModalWindow
        top={0}
        successMessage={messages.successMessage}
        failMessage={messages.serverError}
        minSizeFull
        positionFixed
      >
        <ModalContainer marginTop={4.5} width={83.385417}>
          <ModalContainerTitle title="Deposit" closeWindowFunction={openClose} />
          <ModalContent overflowVisible loading={loading} height={83}>
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
                    options={el.options}
                    onClick={el.onClick}
                    onChange={el.onChange}
                    fieldErrors={fieldErrors as any}
                  />
                ))}
                <div className="w-[34.315104vw] flex items-end gap-4">
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
              <ContentRow cols={2} gap={3} marginTop={3}>
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
              <div className="max-w-[40%] mt-[3vh] flex gap-4">
                <Button
                  backgroundColor="#FFF"
                  identity="upload"
                  onClick={e => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  textColor="#00A78B"
                  buttonText={`${file || inputs.scannedDepositUrl ? 'Change file' : 'Upload Scanned Deposit'}`}
                  width={25.166667}
                  borderColor="#00A78B"
                  border={0.05}
                  buttonIcon={<UploadFileIcon />}
                  iconTextGap={0.5}
                />
                {filePreviewUrl && (
                  <div className="flex gap-2 w-full">
                    <Link
                      href={filePreviewUrl || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-[5.740741vh] flex flex-row justify-center items-center bg-[#c7e2dd75] cursor-pointer hover:bg-[#94afab75] transition-colors rounded-b-[0.520833vw]"
                    >
                      <DownloadIcon />
                      <p className="ml-[0.260416vw] text-[1.851852vh] font-normal leading-[1.805556vh] text-[#00A78B]">
                        Scanned deposit
                      </p>
                    </Link>
                    <button
                      title="Remove file"
                      onClick={e => setShowConfirmNotification(true)}
                      className="h-[5.740741vh] px-4 flex justify-center items-center border border-red-500 cursor-pointer hover:bg-red-50 transition-colors rounded-b-[0.520833vw]"
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
              <div className="relative inline-block text-left">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handlePrintButtonClick();
                  }}
                  className="hover:scale-110 bg-[#00A78B]/ self-center w-fit font-semibold flex items-center justify-center gap-1 border-[0.052083vw]
                border-[#00A78B] rounded-[0.8vw] px-[1.5vw] py-[1.2vh] text-[1.666667vh] text-[#00A78B] transition-all duration-300 ease-in-out
                [svg]:fill-[#00A78B]
                "
                >
                  <PrinterIcon color="#00A78B" />
                  Print
                </button>
                {openPrintMenu && (
                  <div className="origin-top-right absolute right-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <button
                        onClick={() => handlePrintGenerated()}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        role="menuitem"
                      >
                        Print Deposit
                      </button>
                      {inputs.scannedDepositUrl && (
                        <button
                          onClick={() => handlePrintScanned(inputs.scannedDepositUrl)}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                        >
                          Print Scanned Deposit
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Button
                backgroundColor="#00A78B"
                identity="save"
                onClick={handleClick}
                textColor="#FFF"
                buttonText="Save"
                width={11.875}
              />
            </ButtonContainer>
            {showConfirmNotification && (
              <ConfirmNotification
                notiMessage="Are you sure you want to remove this file?"
                onDecision={handleRemoveFileDecision}
                overflowVisible
                alterNotiMessageColor="#0000ff"
              ></ConfirmNotification>
            )}
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
      {/* El área donde el recibo a imprimir se renderiza temporalmente */}
      {/* Usamos clases 'print:block' y 'hidden' para que solo sea visible durante la impresión */}
      <div className="hidden print:block">
        {receiptToPrint && (
          <DepositReceipt
            deposit={receiptToPrint}
            companyInfo={{ name: 'Flowsups' }}
            onAfterPrint={() => setReceiptToPrint(null)}
          />
        )}
      </div>
    </>
  );
}
