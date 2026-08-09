import { useCallback, useEffect, useState } from 'react';
import { inventoryStore, messagesStore } from '@/store/adminDashboard';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Input } from '&/inputs/Input';
import { FileUploader } from '&/inputs/fileUploader/FileUploader';
import { Button } from '&/buttons/Button';
import {
  AddVehicle,
  addVehicleStore,
  editVehicleStore,
  inventorySystemIndexStore,
  userActionStore,
  vinNumberStore,
} from '@/store/inventory';
import { vehicleSchema } from '&/dashboard/inventorySystem/inventorySchema';
import { ZodError } from 'zod';
import { motion } from 'framer-motion';
import { useLoadingGetData } from '@/hooks/loadingGetData';

export function AddNewVehicle() {
  // ---- global states ----
  const { vehicleAdded } = addVehicleStore();
  const { setField } = addVehicleStore();

  const { addNewVehicle } = userActionStore();

  const {
    colors,
    conditions,
    driveTrains,
    engines,
    fuelTypes,
    makes,
    models,
    odometersType,
    statuses,
    transmissions,
    trims,
    types,
  } = inventoryStore();

  const {
    getTypes,
    getTrims,
    getTransmissions,
    getStatuses,
    getOdometersType,
    getModels,
    getMakes,
    getFuelTypes,
    getEngines,
    getDriveTrains,
    getConditions,
    getColors,
  } = inventoryStore();

  const { vehicleData } = editVehicleStore();
  const { getVehicleData } = editVehicleStore();

  const { setMessages } = messagesStore();

  const { setIndex } = inventorySystemIndexStore();

  const { getVin } = vinNumberStore();

  const getPromisesData = useCallback(() => {
    return [
      getStatuses(),
      getConditions(),
      getTypes(),
      getOdometersType(),
      getTransmissions(),
      getDriveTrains(),
      getFuelTypes(),
      getColors(),
      getTrims(),
      getModels(),
      getMakes(),
      getEngines(),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromisesData);

  // ---- local states ----
  const [loadingLocal, setLoadingLocal] = useState<boolean>(true);

  const [disabled, setDisabled] = useState<boolean>(false);
  const [disabledVin, setDisabledVin] = useState<boolean>(false);

  const [inputs, setInputs] = useState<{
    id: string;
    status: string;
    customStatus: string;
    newUsed: string;
    vehicleType: string;
    vin: string;
    odometer: string;
    make1: string;
    year: string;
    make2: string;
    model: string;
    trim: string;
    engine: string;
    transmission: string;
    driveTrain: string;
    door: string;
    cylinder: string;
    bodyType: string;
    fuelType: string;
    horsePower: string;
    exterior: string;
    interior: string;
    mpgCity: string;
    hwy: string;
    vehicleWeight: string;
    gvw: string;
    autoVin: string;
    vehicleImage: File | undefined;
  }>({
    id: '',
    status: '1',
    customStatus: '',
    newUsed: '1',
    vehicleType: '1',
    vin: '',
    odometer: '',
    make1: '1',
    year: '',
    make2: '',
    model: '',
    trim: '',
    engine: '',
    transmission: '1',
    driveTrain: '1',
    door: '',
    cylinder: '',
    bodyType: '',
    fuelType: '1',
    horsePower: '',
    exterior: '1',
    interior: '1',
    mpgCity: '',
    hwy: '',
    vehicleWeight: '',
    gvw: '',
    autoVin: '',
    vehicleImage: undefined,
  });

  const [firebaseImage, setFirebaseImage] = useState<string>('');

  useEffect(() => {
    if (vehicleData && vehicleData.id) {
      setDisabled(false);

      setInputs({
        id: vehicleData?.id?.toString() || '',
        status: vehicleData?.vehicle_status?.id?.toString() || '1',
        customStatus: vehicleData?.customer_status || '',
        newUsed: vehicleData?.vehicle_conditions?.id?.toString() || '1',
        vehicleType: vehicleData?.vehicle_type?.id?.toString() || '1',
        vin: vehicleData?.vehicle_identification_numbers?.vin || '',
        odometer: vehicleData?.odometer || '',
        make1: vehicleData?.odometer_make_id?.toString() || '1',
        year: vehicleData?.vehicle_manufacture_years?.year || '',
        make2: vehicleData?.vehicle_brands?.brand || '',
        model: vehicleData?.vehicle_models?.model || '',
        trim: vehicleData?.vehicle_trim?.trim || '',
        engine: vehicleData?.vehicle_engine?.engine || '',
        transmission: vehicleData?.vehicle_transmissions?.id?.toString() || '1',
        driveTrain: vehicleData?.vehicle_drive_train?.id?.toString() || '1',
        door: vehicleData?.doors?.toString() || '',
        cylinder: vehicleData?.cylinder || '',
        bodyType: vehicleData?.body_type?.type || '',
        fuelType: vehicleData?.vehicle_fuel_tank_types?.id?.toString() || '1',
        horsePower: vehicleData.motor || '',
        exterior: vehicleData?.exterior_vehicle_colors?.id?.toString() || '1',
        interior: vehicleData?.interior_vehicle_colors?.id?.toString() || '1',
        mpgCity: vehicleData?.mpg_city?.toString() || '',
        hwy: vehicleData?.hwy || '',
        vehicleWeight: vehicleData?.weight?.toString() || '',
        gvw: vehicleData?.gvw || '',
        autoVin: '',
        vehicleImage: vehicleData?.vehicle_image?.path
          ? new File([], vehicleData.vehicle_image.path, { type: 'image/jpeg' })
          : undefined,
      });

      vehicleData?.vehicle_image?.path && setFirebaseImage(vehicleData.vehicle_image.path);

      setLocalImageUploaded(vehicleData.vehicle_image?.path);

      setLoadingLocal(false);
    }
  }, [vehicleData]);

  useEffect(() => {
    if (inputs.autoVin) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [inputs.autoVin]);

  useEffect(() => {
    if (vehicleAdded && Object.values(vehicleAdded).some((el) => el !== '')) {
      setInputs({
        id: '',
        status: vehicleAdded.status,
        customStatus: vehicleAdded.customStatus,
        newUsed: vehicleAdded.newUsed,
        vehicleType: vehicleAdded.vehicleType,
        vin: vehicleAdded.vin,
        odometer: vehicleAdded.odometer,
        make1: vehicleAdded.make1,
        year: vehicleAdded.year,
        make2: vehicleAdded.make2,
        model: vehicleAdded.model,
        trim: vehicleAdded.trim,
        engine: vehicleAdded.engine,
        transmission: vehicleAdded.transmission,
        driveTrain: vehicleAdded.driveTrain,
        door: vehicleAdded.door,
        cylinder: vehicleAdded.cylinder,
        bodyType: vehicleAdded.bodyType,
        fuelType: vehicleAdded.fuelType,
        horsePower: vehicleAdded.horsePower,
        exterior: vehicleAdded.exterior,
        interior: vehicleAdded.interior,
        mpgCity: vehicleAdded.mpgCity,
        hwy: vehicleAdded.hwy,
        vehicleWeight: vehicleAdded.vehicleWeight,
        gvw: vehicleAdded.gvw,
        autoVin: '',
        vehicleImage:
          typeof vehicleAdded.vehicleImage !== 'string' ? vehicleAdded.vehicleImage : undefined,
      });

      if (vehicleAdded.vehicleImage && typeof vehicleAdded.vehicleImage === 'object') {
        const reader = new FileReader();

        reader.onload = (e) => {
          e.target && e.target.result && setLocalImageUploaded(e.target?.result);
        };

        reader.readAsDataURL(vehicleAdded.vehicleImage);
      }
    }
  }, [vehicleAdded]);

  useEffect(() => {
    if (addNewVehicle) {
      setLoadingLocal(false);
    }
  }, [addNewVehicle]);

  const [fieldErrors, setFieldErrors] = useState<{
    status: [string | undefined];
    customStatus: [string | undefined];
    newUsed: [string | undefined];
    vehicleType: [string | undefined];
    vin: [string | undefined];
    odometer: [string | undefined];
    make1: [string | undefined];
    year: [string | undefined];
    make2: [string | undefined];
    model: [string | undefined];
    trim: [string | undefined];
    engine: [string | undefined];
    transmission: [string | undefined];
    driveTrain: [string | undefined];
    door: [string | undefined];
    cylinder: [string | undefined];
    bodyType: [string | undefined];
    fuelType: [string | undefined];
    horsePower: [string | undefined];
    exterior: [string | undefined];
    interior: [string | undefined];
    mpgCity: [string | undefined];
    hwy: [string | undefined];
    vehicleWeight: [string | undefined];
    gvw: [string | undefined];
    vehicleImage: [string | undefined];
  }>({
    status: [''],
    customStatus: [''],
    newUsed: [''],
    vehicleType: [''],
    vin: [''],
    odometer: [''],
    make1: [''],
    year: [''],
    make2: [''],
    model: [''],
    trim: [''],
    engine: [''],
    transmission: [''],
    driveTrain: [''],
    door: [''],
    cylinder: [''],
    bodyType: [''],
    fuelType: [''],
    horsePower: [''],
    exterior: [''],
    interior: [''],
    mpgCity: [''],
    hwy: [''],
    vehicleWeight: [''],
    gvw: [''],
    vehicleImage: [''],
  });

  const [localImageUploaded, setLocalImageUploaded] = useState<any>(undefined);

  // handling image input
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localImagePath = e.target.files && e.target.files[0];

    const vehicleImg = e.target.files && e.target.files[0] ? e.target.files[0] : undefined;

    if (vehicleImg) {
      setFirebaseImage('');

      setInputs((prevState) => ({
        ...prevState,
        vehicleImage: vehicleImg,
      }));
    }

    if (localImagePath) {
      const reader = new FileReader();

      reader.onload = (e) => {
        e.target && e.target.result && setLocalImageUploaded(e.target?.result);
      };

      reader.readAsDataURL(localImagePath);
    }
  };

  // handling buttons
  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'continue') {
      try {
        vehicleSchema.parse(inputs);

        const vin = await getVin(inputs.vin);

        if (vin && vin.includes(inputs.vin)) {
          setFieldErrors((prevState) => ({
            ...prevState,
            vin: ['Vin number already registered'],
          }));

          return;
        }

        for (const [name, value] of Object.entries(inputs)) {
          setField(name as keyof AddVehicle['vehicleAdded'], value);
        }
        setField('vehicleImage', inputs.vehicleImage);

        setIndex(2);
      } catch (error) {
        if (error instanceof ZodError) {
          const newErrors: typeof fieldErrors = {
            status: [''],
            customStatus: [''],
            newUsed: [''],
            vehicleType: [''],
            vin: [''],
            odometer: [''],
            make1: [''],
            year: [''],
            make2: [''],
            model: [''],
            trim: [''],
            engine: [''],
            transmission: [''],
            driveTrain: [''],
            door: [''],
            cylinder: [''],
            bodyType: [''],
            fuelType: [''],
            horsePower: [''],
            exterior: [''],
            interior: [''],
            mpgCity: [''],
            hwy: [''],
            vehicleWeight: [''],
            gvw: [''],
            vehicleImage: [''],
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
          value && formData.append(name, value);
        }

        vehicleData?.vehicle_image && formData.append('imageId', `${vehicleData.vehicle_image.id}`);

        vehicleData?.vehicle_identification_numbers &&
          formData.append('vinId', `${vehicleData.vehicle_identification_numbers.id}`);

        firebaseImage && formData.append('firebaseImage', firebaseImage);

        const res = await (
          await fetch(`/api/inventory/addVehicle/${vehicleData?.id}`, {
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
      setIndex(2);
    }
  };

  // handling inputs changing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'autoVin') {
      setInputs((prevState) => ({
        ...prevState,
        autoVin: value === '' ? '1' : '',
      }));

      setDisabledVin(false);

      return;
    }

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getVinDecode = async (vin: string) => {
    const validCharacters = /^[A-HJ-NPR-Z0-9]+$/;
    const invalidCharacters = /[IOQ]/;
    const containsLettersAndNumbers = /^(?=.*[A-HJ-NPR-Z])(?=.*\d)/;

    setLoadingLocal(true);

    if (!validCharacters.test(vin)) {
      setFieldErrors((prevState) => ({
        ...prevState,
        vin: ['Invalid format'],
      }));

      setDisabledVin(false);

      setLoadingLocal(false);

      return;
    }

    if (invalidCharacters.test(vin)) {
      setFieldErrors((prevState) => ({
        ...prevState,
        vin: ['Invalid characters'],
      }));

      setDisabledVin(false);

      setLoadingLocal(false);

      return;
    }

    if (!containsLettersAndNumbers.test(vin)) {
      setFieldErrors((prevState) => ({
        ...prevState,
        vin: ['VIN must contain both letters and numbers'],
      }));

      setDisabledVin(false);

      setLoadingLocal(false);

      return;
    }

    const formData = new FormData();

    formData.append('vin', vin);

    const vinDecode = await (await fetch('/api/vinDecode/', { method: 'POST', body: formData }))
      .json()
      .finally(() => {
        setLoadingLocal(false);
      });

    if (vinDecode.serverError) {
      setDisabledVin(false);
      setMessages(vinDecode.serverError);

      return;
    }

    if (vinDecode.error) {
      setDisabledVin(false);
      setFieldErrors((prevState) => ({
        ...prevState,
        vin: [vinDecode.message],
      }));

      return;
    }

    setDisabledVin(false);

    let updatedInputs = { ...inputs };

    vinDecode.decode.map((el: { label: string; value: string | number }) => {
      updatedInputs = {
        ...updatedInputs,
        year:
          updatedInputs.year === ''
            ? el.label === 'Model Year'
              ? `${el.value}`
              : updatedInputs.year
            : updatedInputs.year,
        make2: el.label === 'Make' ? `${el.value}` : updatedInputs.make2,
        model: el.label === 'Model' ? `${el.value}` : updatedInputs.model,
        engine: el.label === 'Engine Displacement (ccm)' ? `${el.value}` : updatedInputs.engine,
        driveTrain:
          el.label === 'Drive'
            ? `${el.value === 'Front-wheel drive' ? 3 : 1}`
            : updatedInputs.driveTrain,
        door: el.label === 'Number of Doors' ? `${el.value}` : updatedInputs.door,
        cylinder: el.label === 'Engine Cylinders' ? `${el.value}` : updatedInputs.cylinder,
        bodyType: el.label === 'Body' ? `${el.value}` : updatedInputs.bodyType,
        trim: el.label === 'Trim' ? `${el.value}` : updatedInputs.trim,
        fuelType:
          el.label === 'Fuel Type - Primary'
            ? `${el.value === 'Gasoline' ? 1 : 1}`
            : updatedInputs.fuelType,
        horsePower: el.label === '' ? `` : updatedInputs.horsePower,
      };
    });

    setInputs(updatedInputs);
  };

  useEffect(() => {
    if (inputs.autoVin) {
      if (inputs.vin.length === 17) {
        setDisabledVin(true);
        getVinDecode(inputs.vin);
      } else {
        setFieldErrors((prevState) => ({
          ...prevState,
          vin: ['VIN must contain 17 characters'],
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.vin, inputs.autoVin]);

  // handling inputs info

  const inputInfo1 = [
    {
      key: 1,
      label: 'Status',
      value: inputs.status,
      name: 'status',
      width: 20.9375,
      type: 'select',
      options: statuses?.map((el) => {
        return { value: el.id, option: el.status };
      }),
      onChange: handleChange,
    },
    {
      key: 2,
      label: 'Trim',
      value: inputs.trim,
      name: 'trim',
      width: 20.9375,
      type: 'text',
      options: trims?.map((el) => {
        return { value: el.id, option: el.trim };
      }),
      onChange: handleChange,
    },
    {
      key: 3,
      label: 'Custom Status',
      value: inputs.customStatus,
      name: 'customStatus',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 4,
      label: 'Engine',
      value: inputs.engine,
      name: 'engine',
      width: 20.9375,
      type: 'text',
      options: engines?.map((el) => {
        return { value: el.id, option: el.engine };
      }),
      onChange: handleChange,
    },
    {
      key: 5,
      label: 'New / used',
      value: inputs.newUsed,
      name: 'newUsed',
      width: 20.9375,
      type: 'select',
      options: conditions?.map((el) => {
        return { value: el.id, option: el.condition };
      }),
      onChange: handleChange,
    },
    {
      key: 6,
      label: 'Transmission',
      value: inputs.transmission,
      name: 'transmission',
      width: 20.9375,
      type: 'select',
      options: transmissions?.map((el) => {
        return { value: el.id, option: el.transmission };
      }),
      onChange: handleChange,
    },
    {
      key: 7,
      label: 'Vehicle Type',
      value: inputs.vehicleType,
      name: 'vehicleType',
      width: 20.9375,
      type: 'select',
      options: types?.map((el) => {
        return { value: el.id, option: el.type };
      }),
      onChange: handleChange,
    },
    {
      key: 8,
      label: 'Drive Train',
      value: inputs.driveTrain,
      name: 'driveTrain',
      width: 20.9375,
      type: 'select',
      options: driveTrains?.map((el) => {
        return { value: el.id, option: el.drive_train };
      }),
      onChange: handleChange,
    },
    {
      key: 9,
      label: 'VIN',
      value: inputs.vin,
      name: 'vin',
      width: 10,
      type: 'text',
      max: 17,
      min: 17,
      disabled: disabledVin,
      fieldErrorWidthMaxContent: true,
      onChange: handleChange,
      extra: {
        label: 'Auto',
        value: inputs.autoVin,
        name: 'autoVin',
        width: 0,
        type: 'checkbox',
        chekcboxText: 'Auto',
        onChange: handleChange,
      },
    },
    {
      key: 10,
      label: 'Door',
      value: inputs.door,
      name: 'door',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 11,
      label: 'Odometer',
      value: inputs.odometer,
      name: 'odometer',
      width: 10,
      type: 'text',
      onChange: handleChange,
      extra: {
        label: 'Mil. Type',
        value: inputs.make1,
        name: 'make1',
        width: 10,
        type: 'select',
        options: odometersType?.map((el) => {
          return { value: el.id, option: el.type };
        }),
        chekcboxText: 'Auto',
        onChange: handleChange,
      },
    },
    {
      key: 12,
      label: 'Cylinder',
      value: inputs.cylinder,
      name: 'cylinder',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 13,
      label: 'Year',
      value: inputs.year,
      name: 'year',
      width: 20.9375,
      min: 4,
      max: 4,
      type: 'text',
      options: [
        { value: 1, option: 'Text' },
        { value: 2, option: 'Text 2' },
      ],
      onChange: handleChange,
    },
    {
      key: 14,
      label: 'Body Type',
      value: inputs.bodyType,
      name: 'bodyType',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 15,
      label: 'Make',
      value: inputs.make2,
      name: 'make2',
      width: 20.9375,
      type: 'text',
      options: makes?.map((el) => {
        return { value: el.id, option: el.brand };
      }),
      onChange: handleChange,
    },
    {
      key: 16,
      label: 'Fuel Type',
      value: inputs.fuelType,
      name: 'fuelType',
      width: 20.9375,
      type: 'select',
      options: fuelTypes?.map((el) => {
        return { value: el.id, option: el.type };
      }),
      onChange: handleChange,
    },
    {
      key: 17,
      label: 'Model',
      value: inputs.model,
      name: 'model',
      width: 20.9375,
      type: 'text',
      options: models?.map((el) => {
        return { value: el.id, option: el.model };
      }),
      onChange: handleChange,
    },
    {
      key: 18,
      label: 'Horse Power',
      value: inputs.horsePower,
      name: 'horsePower',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
    },
  ];

  const inputInfo2 = [
    {
      key: 1,
      label: 'Exterior',
      value: inputs.exterior,
      name: 'exterior',
      width: 10.208333,
      type: 'select',
      options: colors?.map((el) => {
        return { value: el.id, option: el.color };
      }),
      onChange: handleChange,
    },
    {
      key: 2,
      label: 'Interior',
      value: inputs.interior,
      name: 'interior',
      width: 10.208333,
      type: 'select',
      options: colors?.map((el) => {
        return { value: el.id, option: el.color };
      }),
      onChange: handleChange,
    },
    {
      key: 3,
      label: 'MPG City',
      value: inputs.mpgCity,
      name: 'mpgCity',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 4,
      label: 'HWY',
      value: inputs.hwy,
      name: 'hwy',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 5,
      label: 'Vehicle Weight',
      value: inputs.vehicleWeight,
      name: 'vehicleWeight',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 6,
      label: 'GVW',
      value: inputs.gvw,
      name: 'gvw',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
    },
  ];

  return (
    <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <ModalContent
        loading={loadingLocal || loading}
        height={loadingLocal || loading ? 116.574074 : undefined}
      >
        <BorderedContent title="Vehicle Info">
          <ContentRow cols={2} gap={9} centerContent alignItems="start">
            <ContentRow cols={2} gap={2} centerContent>
              {inputInfo1.map((el) => (
                <ButtonContainer
                  key={el.key}
                  marginTop={0}
                  gap={1}
                  marginLeft={el.key % 2 ? 0 : 3}
                  marginBottom={2}
                  alignContentEnd
                >
                  <Input
                    label={el.label}
                    name={el.name}
                    value={el.value}
                    width={el.width}
                    type={el.type}
                    min={el.min}
                    max={el.max}
                    fieldErrorWidthMaxContent={el.fieldErrorWidthMaxContent}
                    options={el.options}
                    onChange={el.onChange}
                    disabled={el.disabled}
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
                      chekcboxText={el.extra.chekcboxText}
                      onChange={el.extra.onChange}
                      fieldErrors={fieldErrors}
                    />
                  )}
                </ButtonContainer>
              ))}
            </ContentRow>
            <ContentRow cols={2} gap={2}>
              {inputInfo2.map((el) => (
                <ButtonContainer key={el.key} marginTop={0} marginBottom={2}>
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
                </ButtonContainer>
              ))}
              <div className="col-span-2 mt-[4vh]">
                <FileUploader
                  name="vehicleImage"
                  height={31.666667}
                  width={21.041667}
                  image={localImageUploaded}
                  onChange={handleImageUpload}
                  fieldErrors={fieldErrors}
                />
              </div>
              <div className="col-span-2 mt-[33.2vh]">
                <ButtonContainer marginTop={0} justify="space-between" widthFull>
                  {vehicleData?.id && (
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
              </div>
            </ContentRow>
          </ContentRow>
        </BorderedContent>
      </ModalContent>
    </motion.div>
  );
}
