import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { AddingSelect } from '&/inputs/addingSelect/AddingSelect';
import { Input } from '&/inputs/Input';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { inventoryStore, messagesStore } from '@/store/adminDashboard';
import {
  detailGeneralInfoStore,
  DetailsGeneralInfo,
  detailsInventorySystemIndexStore,
  editVehicleStore,
  inventorySystemIndexStore,
} from '@/store/inventory';
import { useEffect, useState } from 'react';
import { generalInfoSchema } from '@/app/ui/dashboard/cards/inventory/details/generalInfo/generalInfoSchema';
import { ZodError } from 'zod';
import { DottedInput } from '&/inputs/dottedInput/DottedInput';

export function GeneralInfo() {
  // ----- global states -----

  const { salesType, detailCondition, detailSource, acqType, inspectionStatus, emissionStatus } =
    inventoryStore();
  const {
    getSalesTypes,
    getDetailCondition,
    getDetailSource,
    getAcqType,
    getInspectionStatus,
    getEmissionStatus,
  } = inventoryStore();

  const { generalInfo } = detailGeneralInfoStore();
  const { setField } = detailGeneralInfoStore();

  const { vehicleData } = editVehicleStore();
  const { getVehicleData } = editVehicleStore();

  const { setIndex } = inventorySystemIndexStore();

  const { setDetailsIndex } = detailsInventorySystemIndexStore();

  const { setMessages } = messagesStore();

  useEffect(() => {
    getSalesTypes();
    getDetailCondition();
    getDetailSource();
    getAcqType();
    getEmissionStatus();
    getInspectionStatus();
  }, [
    getSalesTypes,
    getDetailCondition,
    getDetailSource,
    getAcqType,
    getInspectionStatus,
    getEmissionStatus,
  ]);

  // ----- local states -----

  const [inputs, setInputs] = useState<{
    salesType: string;
    stockNo: string;
    dateInStock: string;
    readyToShell: string;
    location: string;
    condition: string;
    purchaseDate: string;
    purchaseDetail: string;
    acqMillIn: string;
    acqMillType: string;
    buyer: string;
    source: string;
    purchaseFrom: string;
    howDidYouPay: string;
    inspectionStatus: string;
    inspectionDate: string;
    inspectionId: string;
    inspectionBy: string;
    emissionDate: string;
    emissionStatus: string;
  }>({
    salesType: '1',
    stockNo: '',
    dateInStock: '',
    readyToShell: '',
    location: '',
    condition: '1',
    inspectionStatus: '',
    emissionStatus: '',
    acqMillIn: '',
    acqMillType: '1',
    buyer: '',
    howDidYouPay: '',
    purchaseDate: '',
    purchaseDetail: '',
    purchaseFrom: '',
    source: '1',
    inspectionDate: '',
    inspectionId: '',
    inspectionBy: '',
    emissionDate: '',
  });

  useEffect(() => {
    if (vehicleData && vehicleData.id) {
      setInputs({
        salesType: vehicleData.general_info?.sales_type_id?.toString() || '1',
        stockNo: vehicleData.general_info?.stock_no || '',
        dateInStock: vehicleData.general_info?.date_in_stock?.toLocaleString().split('T')[0] || '',
        readyToShell:
          vehicleData.general_info?.ready_to_shell?.toLocaleString().split('T')[0] || '',
        location: vehicleData.general_info?.location || '',
        condition: vehicleData.general_info?.condition_id?.toString() || '1',
        purchaseDate:
          vehicleData.purchase_info?.purchase_date?.toLocaleString().split('T')[0] || '',
        purchaseDetail: vehicleData.purchase_info?.purchase_detail || '',
        acqMillIn: vehicleData.purchase_info?.acq_mill_in || '',
        acqMillType: vehicleData.purchase_info?.acq_mill_type_id?.toString() || '1',
        buyer: vehicleData.purchase_info?.buyer || '',
        source: vehicleData.purchase_info?.source_id?.toString() || '1',
        purchaseFrom: vehicleData.purchase_info?.purchase_from || '',
        howDidYouPay: vehicleData.purchase_info?.how_did_you_pay || '',
        inspectionStatus: vehicleData.general_info?.inspection?.status_id?.toString() || '',
        inspectionDate:
          vehicleData.general_info?.inspection?.date?.toLocaleString().split('T')[0] || '',
        inspectionId: vehicleData.general_info?.inspection?.inspected_by || '',
        inspectionBy: vehicleData.general_info?.inspection?.inspected_by || '',
        emissionDate:
          vehicleData.general_info?.emission?.date?.toLocaleString().split('T')[0] || '',
        emissionStatus: vehicleData.general_info?.emission?.status_id?.toString() || '',
      });
    }
  }, [vehicleData]);

  useEffect(() => {
    if (generalInfo && Object.values(generalInfo).some((el) => el !== '')) {
      setInputs({
        salesType: generalInfo.salesType,
        stockNo: generalInfo.stockNo,
        dateInStock: generalInfo.dateInStock,
        readyToShell: generalInfo.readyToShell,
        location: generalInfo.location,
        condition: generalInfo.condition,
        inspectionStatus: generalInfo.inspectionStatus,
        emissionStatus: generalInfo.emissionStatus,
        acqMillIn: generalInfo.acqMillIn,
        acqMillType: generalInfo.acqMillType,
        buyer: generalInfo.buyer,
        howDidYouPay: generalInfo.howDidYouPay,
        purchaseDate: generalInfo.purchaseDate,
        purchaseDetail: generalInfo.purchaseDetail,
        purchaseFrom: generalInfo.purchaseFrom,
        source: generalInfo.source,
        inspectionDate: generalInfo.inspectionDate,
        inspectionId: generalInfo.inspectionId,
        inspectionBy: generalInfo.inspectionBy,
        emissionDate: generalInfo.emissionDate,
      });
    }
  }, [generalInfo]);

  const [fieldErrors, setFieldErrors] = useState<{
    salesType: [string | undefined];
    stockNo: [string | undefined];
    dateInStock: [string | undefined];
    readyToShell: [string | undefined];
    location: [string | undefined];
    condition: [string | undefined];
    inspectionStatus: [string | undefined];
    emissionStatus: [string | undefined];
    purchaseDate: [string | undefined];
    purchaseDetail: [string | undefined];
    acqMillIn: [string | undefined];
    acqMillType: [string | undefined];
    buyer: [string | undefined];
    source: [string | undefined];
    purchaseFrom: [string | undefined];
    howDidYouPay: [string | undefined];
    inspectionDate: [string | undefined];
    inspectionId: [string | undefined];
    inspectionBy: [string | undefined];
    emissionDate: [string | undefined];
  }>({
    salesType: [''],
    stockNo: [''],
    dateInStock: [''],
    readyToShell: [''],
    location: [''],
    condition: [''],
    inspectionStatus: [''],
    emissionStatus: [''],
    purchaseDetail: [''],
    acqMillIn: [''],
    acqMillType: [''],
    buyer: [''],
    source: [''],
    purchaseFrom: [''],
    howDidYouPay: [''],
    purchaseDate: [''],
    inspectionDate: [''],
    inspectionId: [''],
    inspectionBy: [''],
    emissionDate: [''],
  });

  // handling input changing
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handling button
  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'continue') {
      try {
        generalInfoSchema.parse(inputs);

        for (const [name, value] of Object.entries(inputs)) {
          setField(name as keyof DetailsGeneralInfo['generalInfo'], value);
        }

        setDetailsIndex(2);
      } catch (error) {
        if (error instanceof ZodError) {
          const newErrors: typeof fieldErrors = {
            salesType: [''],
            stockNo: [''],
            dateInStock: [''],
            readyToShell: [''],
            location: [''],
            condition: [''],
            inspectionStatus: [''],
            emissionStatus: [''],
            purchaseDetail: [''],
            acqMillIn: [''],
            acqMillType: [''],
            buyer: [''],
            source: [''],
            purchaseFrom: [''],
            howDidYouPay: [''],
            purchaseDate: [''],
            inspectionDate: [''],
            inspectionId: [''],
            inspectionBy: [''],
            emissionDate: [''],
          };

          error.errors.forEach((error) => {
            const fieldName = error.path[0] as keyof typeof newErrors;
            newErrors[fieldName] = [error.message];
          });

          setFieldErrors(newErrors);
        }
      }
    }

    if (identity === 'save') {
      try {
        const formData = new FormData();

        for (const [name, value] of Object.entries(inputs)) {
          formData.append(name, value);
        }

        formData.append(
          'inspectionReferenceId',
          `${vehicleData?.general_info?.inspection_status_id}`,
        );

        formData.append('emissionId', `${vehicleData?.general_info?.emission_status_id}`);

        const res = await (
          await fetch(`/api/inventory/generalInfo/${vehicleData?.id}`, {
            method: 'PUT',
            body: formData,
          })
        ).json();

        if (res.successMessage) {
          vehicleData?.id && getVehicleData(vehicleData.id.toString());
          setMessages(undefined, res.successMessage);
        }

        if (res.serverError) {
          setMessages(res.serverError);
        }

        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
      } catch (error) {
        setMessages('An error occurred');
      }
    }

    if (identity === 'nextPage') {
      setDetailsIndex(2);
    }

    if (identity === 'prevPage') {
      setIndex(1);
    }
  };

  // input info
  const inputInfo1 = [
    {
      key: 1,
      label: 'Sales type',
      value: inputs.salesType,
      name: 'salesType',
      width: 20.9375,
      type: 'select',
      options: salesType?.map((el) => {
        return { value: el.id, option: el.type };
      }),
      onChange: handleChange,
    },
    {
      key: 2,
      label: 'Stock No.',
      value: inputs.stockNo,
      name: 'stockNo',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 3,
      label: 'Date in Stock',
      value: inputs.dateInStock,
      name: 'dateInStock',
      width: 10.208333,
      type: 'date',
      onChange: handleChange,
      extra: {
        label: 'Ready To Sell',
        value: inputs.readyToShell,
        name: 'readyToShell',
        width: 10.208333,
        type: 'date',
        onChange: handleChange,
      },
    },
    {
      key: 4,
      label: 'Location',
      value: inputs.location,
      name: 'location',
      width: 20.9375,
      type: 'text',
      options: [],
      onChange: handleChange,
    },
    {
      key: 5,
      label: 'Condition',
      value: inputs.condition,
      name: 'condition',
      width: 20.9375,
      type: 'select',
      options: detailCondition?.map((el) => {
        return { value: el.id, option: el.condition };
      }),
      onChange: handleChange,
    },
    {
      key: 6,
      label: 'Inspection Status',
      value: inspectionStatus?.find((el) => {
        const statusId = el.id?.toString();
        return statusId === inputs.inspectionStatus;
      })?.status,
      name: 'inspectionStatus',
      width: 10.208333,
      type: 'dottedInput',
      onChange: handleChange,
      optionsWidth: 20,
      optionsHeight: 22,
      optionsColumns: 2,
      disabled: true,
      optionsColumnsGap: 1,
      optionsRight: true,
      optionsInputs: [
        {
          key: 1,
          label: 'Status',
          value: inputs.inspectionStatus,
          name: 'inspectionStatus',
          width: 9,
          type: 'select',
          options: inspectionStatus?.map((el) => {
            return { value: el.id, option: el.status };
          }),
          onChange: handleChange,
        },
        {
          key: 2,
          label: 'Date',
          value: inputs.inspectionDate,
          name: 'inspectionDate',
          width: 9,
          type: 'date',
          onChange: handleChange,
        },
        {
          key: 3,
          label: 'ID',
          value: inputs.inspectionId,
          name: 'inspectionId',
          width: 9,
          type: 'text',
          onChange: handleChange,
        },
        {
          key: 4,
          label: 'Inspected By',
          value: inputs.inspectionBy,
          name: 'inspectionBy',
          width: 9,
          type: 'text',
          onChange: handleChange,
        },
      ],
      extra: {
        label: 'Emission Status',
        value: emissionStatus?.find((el) => {
          const statusId = el.id?.toString();
          return statusId === inputs.emissionStatus;
        })?.status,
        name: 'emissionStatus',
        width: 10.208333,
        type: 'dottedInput',
        disabled: true,
        onChange: handleChange,
        optionsWidth: 11,
        optionsHeight: 22,
        optionsColumns: 1,
        optionsColumnsGap: 1,
        optionsInputs: [
          {
            key: 1,
            label: 'Status',
            value: inputs.emissionStatus,
            name: 'emissionStatus',
            width: 9,
            type: 'select',
            options: emissionStatus?.map((el) => {
              return { value: el.id, option: el.status };
            }),
            onChange: handleChange,
          },
          {
            key: 2,
            label: 'Date',
            value: inputs.emissionDate,
            name: 'emissionDate',
            width: 9,
            type: 'date',
            onChange: handleChange,
          },
        ],
      },
    },
  ];

  const inputInfo2 = [
    {
      key: 1,
      label: 'Purchase Date',
      value: inputs.purchaseDate,
      name: 'purchaseDate',
      width: 20.9375,
      type: 'date',
      onChange: handleChange,
    },
    {
      key: 2,
      label: 'Purchase Detail',
      value: inputs.purchaseDetail,
      name: 'purchaseDetail',
      width: 20.9375,
      height: 20.555556,
      type: 'textarea',
      onChange: handleChange,
    },
    {
      key: 3,
      label: 'Acq. Mil. In',
      value: inputs.acqMillIn,
      name: 'acqMillIn',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
      extra: {
        label: 'Acq. Mil. Type',
        value: inputs.acqMillType,
        name: 'acqMillType',
        width: 10.208333,
        type: 'select',
        options: acqType?.map((el) => {
          return { value: el.id, option: el.type };
        }),
        onChange: handleChange,
      },
    },
  ];

  const inputInfo3 = [
    {
      key: 1,
      label: 'Buyer',
      value: inputs.buyer,
      name: 'buyer',
      width: 20.9375,
      type: 'text',
      options: [],
      onChange: handleChange,
      extra: {
        label: 'Source',
        value: inputs.source,
        name: 'source',
        width: 20.9375,
        type: 'select',
        options: detailSource?.map((el) => {
          return { value: el.id, option: el.source };
        }),
        onChange: handleChange,
      },
    },
    {
      key: 2,
      label: 'Purchase From',
      value: inputs.purchaseFrom,
      name: 'purchaseFrom',
      width: 45.729167,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 3,
      label: 'How Did You Pay',
      value: inputs.howDidYouPay,
      name: 'howDidYouPay',
      width: 45.729167,
      height: 22.87037,
      type: 'textarea',
      onChange: handleChange,
    },
  ];

  return (
    <ModalContent>
      <BorderedContent title="General Info" overflowVisible>
        <ContentRow cols={3} gap={4} centerContent>
          {inputInfo1.map((el) =>
            el.type === 'addingSelect' && el.options ? (
              <AddingSelect
                key={el.key}
                name={el.name}
                width={el.width}
                value={el.value}
                label={el.label}
                options={el.options}
                onChange={el.onChange}
                fieldErrors={fieldErrors}
              />
            ) : el.type === 'dottedInput' && el.optionsWidth && el.optionsInputs ? (
              <ButtonContainer marginTop={0} gap={0.520833} marginLeft={3}>
                <DottedInput
                  label={el.label}
                  name={el.name}
                  value={el.value}
                  width={el.width}
                  optionsColumns={el.optionsColumns}
                  optionsColumnsGap={el.optionsColumnsGap}
                  type={el.type}
                  onChange={el.onChange}
                  fieldErrors={fieldErrors}
                  disabled={el.disabled}
                  optionsWidth={el.optionsWidth}
                  optionsHeight={el.optionsHeight}
                  optionsInputs={el.optionsInputs}
                  optionsRight={el.optionsRight}
                />
                {el.extra && (
                  <DottedInput
                    label={el.extra.label}
                    name={el.extra.name}
                    value={el.extra.value}
                    width={el.extra.width}
                    optionsColumns={el.extra.optionsColumns}
                    optionsColumnsGap={el.extra.optionsColumnsGap}
                    type={el.extra.type}
                    disabled={el.extra.disabled}
                    onChange={el.extra.onChange}
                    fieldErrors={fieldErrors}
                    optionsWidth={el.extra.optionsWidth}
                    optionsHeight={el.extra.optionsHeight}
                    optionsInputs={el.extra.optionsInputs}
                  />
                )}
              </ButtonContainer>
            ) : (
              <ButtonContainer
                key={el.key}
                marginTop={0}
                gap={0.520833}
                marginLeft={
                  ['2', '3', '5', '6'].some((opt) => el.key.toString().includes(opt)) ? 3 : 0
                }
              >
                <Input
                  label={el.label}
                  name={el.name}
                  value={el.value}
                  width={el.width}
                  type={el.type}
                  options={el.options}
                  onChange={el.onChange}
                  fieldErrors={fieldErrors}
                />
                {el.extra && (
                  <Input
                    label={el.extra.label}
                    name={el.extra.name}
                    value={el.extra.value}
                    width={el.extra.width}
                    type={el.extra.type}
                    onChange={el.extra.onChange}
                    fieldErrors={fieldErrors}
                  />
                )}
              </ButtonContainer>
            ),
          )}
        </ContentRow>
      </BorderedContent>
      <BorderedContent title="Purchase Info" marginTop={2.777778}>
        <ContentRow cols={2} gap={12} alignItems="start">
          <aside className="w-fit flex flex-col items-start gap-[4vh] ml-[1.5vw]">
            {inputInfo2.map((el) =>
              el.type === 'textarea' ? (
                <TextAreaInput
                  key={el.key}
                  width={el.width}
                  height={el.height}
                  name={el.name}
                  label={el.label}
                  value={el.value}
                  onChange={el.onChange}
                  fieldErrors={fieldErrors}
                />
              ) : (
                <ButtonContainer key={el.key} marginTop={el.key === 3 ? 2.3 : 0} gap={0.5}>
                  <Input
                    label={el.label}
                    name={el.name}
                    value={el.value}
                    width={el.width}
                    type={el.type}
                    onChange={el.onChange}
                    fieldErrors={fieldErrors}
                  />
                  {el.extra && (
                    <Input
                      label={el.extra.label}
                      name={el.extra.name}
                      value={el.extra.value}
                      width={el.extra.width}
                      type={el.extra.type}
                      options={el.extra.options}
                      onChange={el.extra.onChange}
                      fieldErrors={fieldErrors}
                    />
                  )}
                </ButtonContainer>
              ),
            )}
          </aside>
          <aside className="w-fit flex flex-col items-start gap-[4vh]">
            {inputInfo3.map((el) =>
              el.type === 'textarea' ? (
                <TextAreaInput
                  key={el.key}
                  width={el.width}
                  height={el.height}
                  name={el.name}
                  label={el.label}
                  value={el.value}
                  onChange={el.onChange}
                  fieldErrors={fieldErrors}
                />
              ) : el.type === 'addingSelect' && el.options ? (
                <ButtonContainer key={el.key} marginTop={0} gap={3.7}>
                  <AddingSelect
                    name={el.name}
                    width={el.width}
                    value={el.value}
                    label={el.label}
                    options={el.options}
                    onChange={el.onChange}
                    fieldErrors={fieldErrors}
                  />
                  {el.extra && (
                    <Input
                      label={el.extra.label}
                      name={el.extra.name}
                      value={el.extra.value}
                      width={el.extra.width}
                      type={el.extra.type}
                      options={el.extra.options}
                      onChange={el.extra.onChange}
                      fieldErrors={fieldErrors}
                    />
                  )}
                </ButtonContainer>
              ) : (
                <ButtonContainer key={el.key} marginTop={0} gap={3.7}>
                  <Input
                    label={el.label}
                    name={el.name}
                    value={el.value}
                    width={el.width}
                    type={el.type}
                    onChange={el.onChange}
                    fieldErrors={fieldErrors}
                  />
                  {el.extra && (
                    <Input
                      label={el.extra.label}
                      name={el.extra.name}
                      value={el.extra.value}
                      width={el.extra.width}
                      type={el.extra.type}
                      options={el.extra.options}
                      onChange={el.extra.onChange}
                      fieldErrors={fieldErrors}
                    />
                  )}
                </ButtonContainer>
              ),
            )}
            <ButtonContainer marginTop={6.296296} widthFull justify="end" gap={1.5}>
              <Button
                backgroundColor="#3e64e7"
                identity="prevPage"
                onClick={handleButton}
                textColor="#FFF"
                width={10}
                buttonText="Prev page"
              />
              {vehicleData && vehicleData.id && (
                <Button
                  backgroundColor="#3e64e7"
                  identity="nextPage"
                  onClick={handleButton}
                  textColor="#FFF"
                  width={10}
                  buttonText="Next page"
                />
              )}
              <Button
                backgroundColor="#00A78B"
                identity={`${vehicleData?.id ? 'save' : 'continue'}`}
                onClick={handleButton}
                textColor="#FFF"
                width={vehicleData?.id ? 10 : 20.9375}
                buttonText={`${vehicleData?.id ? 'Save' : 'Continue'}`}
              />
            </ButtonContainer>
          </aside>
        </ContentRow>
      </BorderedContent>
    </ModalContent>
  );
}
