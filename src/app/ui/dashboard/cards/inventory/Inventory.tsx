import { Slide } from '&/slide/Slide';
import { useCallback, useEffect, useState } from 'react';
import { Filter } from '&/dashboard/cards/inventory/filter/Filter';
import {
  DaysInStockIcon,
  EditIcon,
  ExportIcon,
  ImportDataIcon,
  InventoryStatusIcon,
  LocationIcon,
  MillageRangeIcon,
  PlusIcon,
  PriceRangeIcon,
  TrashIcon,
} from '&/icons/Icons';
import { adminDashboardStore, inventoryStore, modalWindowStore } from '@/store/adminDashboard';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { SearchInput } from '&/inputs/searchInput/SearchInput';
import { Button } from '&/buttons/Button';
import { Input } from '&/inputs/Input';
import { AnimatePresence } from 'framer-motion';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
// import { ColoredTable } from '&/table/coloredTable/ColoredTable';
import { ImageContainer } from '&/miscellaneous/imageContainer/ImageContainer';
import { StatusPicker } from '&/miscellaneous/statusPicker/StatusPicker';
import { editVehicleStore, userActionStore, vehiclesDataStore } from '@/store/inventory';
import { OptionsButton } from '&/miscellaneous/optionsButton/OptionsButton';
import { VehiclesData } from '@/app/libs/definitions';
import { exportStore, importStore } from '@/store/importExportData';
import { pdfDataStore } from '@/store/pdfData';
import { dateFormatsStore } from '@/store/dateFormats';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { Can } from '@/app/ui/auth/Can';
import { useCan } from '@/hooks/permissions';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { useTableData } from '@/hooks/tableData';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';

export function Inventory() {
  // ----- global state -----

  const { iconedSelectOptions, openInNewTab } = modalWindowStore();
  const { openInventorySystem, openImportData, openExportData, openCloseIconedSelectOptions } =
    modalWindowStore();

  const { getStates } = adminDashboardStore();

  const { statuses } = inventoryStore();
  const { getStatuses } = inventoryStore();

  const { getVehicleData } = editVehicleStore();

  const { vehicles } = vehiclesDataStore();
  const { getVehiclesData } = vehiclesDataStore();

  const { setPdfName } = pdfDataStore();

  const { setApiUrl } = importStore();

  const { setExportApiUrl } = exportStore();

  const { setAddNewVehicle } = userActionStore();

  const { dateFormatted } = dateFormatsStore();

  const { updateDataWithSocket } = useSocketStore();

  const { can } = useCan();

  const getPromiseData = useCallback(() => {
    return [getStates(), getStatuses(), getVehiclesData()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData);

  useEffect(() => {
    setPdfName('Inventory');
    setApiUrl('/api/inventory/importData');
    setExportApiUrl('/api/inventory/importData');
  }, [setApiUrl, setExportApiUrl, setPdfName]);

  // ----- local state -----

  const [deleteConfirmationMessage, setDeleteConfirmationMessage] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [dataForTable, setDataForTable] = useState<VehiclesData>(undefined);

  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      setDataForTable(vehicles);
    }
  }, [vehicles]);

  const [inventoryStatus, setInventoryStatus] = useState<
    { key: number; name: string; checked: boolean; identity: string }[]
  >([
    { key: 1, name: 'In stock', checked: false, identity: 'inventoryStatus' },
    { key: 2, name: 'Out of stock', checked: false, identity: 'inventoryStatus' },
    { key: 3, name: 'Sold', checked: false, identity: 'inventoryStatus' },
    { key: 4, name: 'Awaiting for repair', checked: false, identity: 'inventoryStatus' },
  ]);

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value, name } = e.currentTarget;
    const { identity, item } = e.currentTarget.dataset;

    // show filters
    if (identity === 'filter') {
      e.stopPropagation();
      openCloseIconedSelectOptions();
      setShowFilter(!showFilter);
    }

    // open inventory system
    if (identity === 'addNewVehicle' && can(21)) {
      setAddNewVehicle(true);
      openInventorySystem();
    }

    // change the status of the item
    if (identity === 'status' && can(24)) {
      const formData = new FormData();

      formData.append('statusId', value);

      const apiUrl = `/api/inventory/vehicleStatus/${item}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        permissionForFetch: 24,
        options: {
          onSuccess: () => {
            updateDataWithSocket('inventory');
          },
        },
      });
    }

    // open inventory system with data from selected vehicle

    if (identity === 'deleteEdit') {
      if (value === '1' && item && can(25)) {
        if (openInNewTab) {
          window.open(`/dashboard/inventory-${item}`);

          return;
        }

        setAddNewVehicle(false);
        openInventorySystem();
        getVehicleData(item);
      }

      if (value === '2' && item && can(26)) {
        setSelectedVehicleId(item);
        setDeleteConfirmationMessage('Are you sure you want to delete this vehicle?');
      }
    }

    // open import option

    if (identity === 'import' && can(22)) {
      openImportData();
    }

    // open export option

    if (identity === 'export' && can(23)) {
      openExportData();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'search') {
      setSearchVal(handlingCapitalWords(value));
    }

    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [searchVal, setSearchVal] = useState('');

  const buttonInfo1 = [
    {
      key: 1,
      width: 18,
      height: 5.277778,
      backgroundColor: '#43B5A1',
      textColor: '#FFF',
      name: 'search',
      placeholder: 'Search Inventory',
      onChange: handleChange,
      button: false,
      borderRadius: 1.2,
      value: searchVal,
    },
    {
      key: 2,
      width: 9.6875,
      backgroundColor: '#FFF',
      textColor: '#00A78B',
      identity: 'addNewVehicle',
      buttonText: 'Add New Vehicle',
      icon: <PlusIcon />,
      gap: 1,
      borderRadius: 1.3,
      iconRight: true,
      onClick: handleButton,
      button: true,
      can: 21,
    },
    // {
    //   key: 3,
    //   width: 5.9375,
    //   backgroundColor: '#43B5A1',
    //   textColor: '#FFF',
    //   identity: 'rebookAll',
    //   borderRadius: 1.3,
    //   buttonText: 'Rebook All',
    //   onClick: handleButton,
    //   button: true,
    // },
    {
      key: '',
      label: '',
      value: '',
      backgroundColor: '#43B5A1',
      name: 'appraise',
      width: 11.979167,
      borderRadius: 1.2,
      textColor: '#FFF',
      type: 'select',
      options: [
        { value: 1, option: 'Appraise New Vehicle' },
        { value: 2, option: 'Text 2' },
      ],
      onChange: handleChange,
      input: true,
    },
  ];

  const buttonInfo2 = [
    {
      key: 1,
      width: 5.9375,
      backgroundColor: '#43B5A1',
      textColor: '#FFF',
      identity: 'import',
      buttonText: 'Import',
      icon: <ImportDataIcon />,
      gap: 1,
      borderRadius: 1.3,
      iconRight: true,
      onClick: handleButton,
      button: true,
      can: 22,
    },
    {
      key: 2,
      width: 5.9375,
      backgroundColor: '#43B5A1',
      textColor: '#FFF',
      identity: 'export',
      buttonText: 'Export',
      icon: <ExportIcon />,
      gap: 1,
      borderRadius: 1.3,
      iconRight: true,
      onClick: handleButton,
      button: true,
      can: 23,
    },
  ];

  let initialColumnsDef = {
    _blank_vehicleImage: true,
    year: true,
    model: true,
    stock_number: true,
    vin: true,
    color: true,
    sale_type: true,
    date_added: true,
    location: true,
    price: true,
    cost: true,
    status: true,
    _blank_optionBtn: true,
  };

  const { columns } = useDynamicTableColumns({
    initialColumnsDef,
    hideHeaderFor: ['_blank_vehicleImage', '_blank_optionBtn'],
    excludeKeys: ['id', 'color', 'location', 'price', 'cost'],
    columnStyles: {
      year: { size: 90 },
      model: { size: 140 },
      color: { size: 100 },
      sale_type: { size: 120 },
      date_added: { size: 130 },
      location: { size: 130 },
      price: { size: 80 },
      cost: { size: 80 },
      status: { size: 120 },
      _blank_vehicleImage: { size: 70 },
      _blank_optionBtn: { size: 50 },
    },
    disableTruncateOnColumns: ['status', '_blank_optionBtn'],
    filterableColumns: [
      'year',
      'model',
      'stock_number',
      'vin',
      'color',
      'sale_type',
      'date_added',
      'location',
      'price',
      'cost',
      'status',
    ],
    disabledSortColumns: ['_blank_vehicleImage', '_blank_optionBtn'],
  });

  const [filters, setFilters] = useState<{
    entryStockFrom: any;
    entryStockTo: any;
    inventoryStatus: any[];
    priceFrom: any;
    priceTo: any;
    millageFrom: any;
    millageTo: any;
    locations: string;
    search: string;
  }>({
    entryStockFrom: undefined,
    entryStockTo: undefined,
    inventoryStatus: [],
    priceFrom: '',
    priceTo: '',
    millageFrom: '',
    millageTo: '',
    locations: '',
    search: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    const numericValue = value.replace(/[^0-9.]/g, '');
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: numericValue,
    }));
  };

  const handleClickOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;
    const { identity, datakey } = e.currentTarget.dataset;

    if (identity === 'inventoryStatus') {
      setInventoryStatus((prevOptions) =>
        prevOptions.map((option) =>
          option.name === name ? { ...option, checked: false } : option,
        ),
      );

      setFilters((prevFilters) => ({
        ...prevFilters,
        [identity]: [...prevFilters[identity].filter((item) => item !== datakey)],
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.currentTarget;
    const { identity, datakey } = e.currentTarget.dataset;

    if (identity === 'inventoryStatus') {
      setInventoryStatus((prevOptions) =>
        prevOptions.map((option) =>
          option.name === name ? { ...option, checked: checked } : option,
        ),
      );

      checked &&
        setFilters((prevFilters) => ({
          ...prevFilters,
          [identity]: [...prevFilters[identity], datakey],
        }));

      !checked &&
        setFilters((prevFilters) => ({
          ...prevFilters,
          [identity]: [...prevFilters[identity].filter((item) => item !== datakey)],
        }));
    }
  };

  const handleDeleteDecision = async (decision: boolean) => {
    if (selectedVehicleId && decision) {
      const apiUrl = `/api/inventory/vehicle/${selectedVehicleId}`;

      await makeAsyncFetch({
        apiUrl,
        method: 'DELETE',
        permissionForFetch: 26,
        options: {
          onSuccess: () => {
            updateDataWithSocket('inventory');
          },
        },
      });

      setDeleteConfirmationMessage('');
    } else {
      setDeleteConfirmationMessage('');
    }

    setSelectedVehicleId('');
  };

  const options = [
    {
      key: 1,
      name: 'Days in stock',
      icon: <DaysInStockIcon />,
      from: {
        name: 'entryStockFrom',
        value: filters.entryStockFrom,
        width: 8,
        label: 'From',
        type: 'date',
        placeholder: 'from',
        onChange: handleFilterChange,
      },
      to: {
        name: 'entryStockTo',
        value: filters.entryStockTo,
        width: 8,
        label: 'To',
        type: 'date',
        placeholder: 'to',
        onChange: handleFilterChange,
      },
    },
    {
      key: 2,
      name: 'Inventory status',
      icon: <InventoryStatusIcon />,
      onCheckboxChange: handleCheckboxChange,
      onClick: handleClickOption,
      options: inventoryStatus,
    },
    {
      key: 3,
      name: 'Price range',
      icon: <PriceRangeIcon />,
      from: {
        name: 'priceFrom',
        value: `${
          filters.priceFrom ? `$${parseInt(filters.priceFrom).toLocaleString('en-US')}` : ''
        }`,
        width: 6,
        label: '',
        type: 'text',
        placeholder: 'from',
        onChange: handleRangeChange,
      },
      to: {
        name: 'priceTo',
        value: filters.priceTo ? `$${parseInt(filters.priceTo).toLocaleString('en-US')}` : '',
        width: 6,
        label: '',
        type: 'text',
        placeholder: 'to',
        onChange: handleRangeChange,
      },
    },
    {
      key: 4,
      name: 'Millage range',
      icon: <MillageRangeIcon />,
      from: {
        name: 'millageFrom',
        value: filters.millageFrom,
        width: 6,
        label: '',
        type: 'text',
        placeholder: 'from',
        onChange: handleRangeChange,
      },
      to: {
        name: 'millageTo',
        value: filters.millageTo,
        width: 6,
        label: '',
        type: 'text',
        placeholder: 'to',
        onChange: handleRangeChange,
      },
    },
    {
      key: 5,
      name: 'Location',
      icon: <LocationIcon />,
      from: {
        name: 'locations',
        value: filters.locations,
        width: 13,
        label: '',
        type: 'text',
        placeholder: 'Location',
        onChange: handleFilterChange,
      },
    },
  ];

  const applyFilters = () => {
    let filteredData = vehicles;

    if (filters.entryStockFrom && filteredData) {
      filteredData = filteredData.filter(
        (vehicle) =>
          vehicle.entry_stock &&
          filters.entryStockFrom &&
          new Date(vehicle.entry_stock) >= new Date(filters.entryStockFrom),
      );
    }
    if (filters.entryStockTo && filteredData) {
      filteredData = filteredData.filter(
        (vehicle) =>
          vehicle.entry_stock &&
          filters.entryStockTo &&
          new Date(vehicle.entry_stock) <= new Date(filters.entryStockTo),
      );
    }

    if (filters.inventoryStatus.length > 0 && filteredData) {
      filteredData = filteredData.filter((vehicle) =>
        filters.inventoryStatus.includes(vehicle.vehicle_status_id?.toString()),
      );
    }

    if (filters.priceFrom && filteredData) {
      filteredData = filteredData.filter(
        (vehicle) =>
          parseFloat(vehicle.title_license?.floor_price || '0') >= parseFloat(filters.priceFrom),
      );
    }
    if (filters.priceTo && filteredData) {
      filteredData = filteredData.filter(
        (vehicle) =>
          parseFloat(vehicle.title_license?.floor_price || '0') <= parseFloat(filters.priceTo),
      );
    }

    if (filters.millageFrom && filteredData) {
      filteredData = filteredData.filter(
        (vehicle) => parseFloat(vehicle.odometer || '0') >= parseFloat(filters.millageFrom),
      );
    }
    if (filters.millageTo && filteredData) {
      filteredData = filteredData.filter(
        (vehicle) => parseFloat(vehicle.odometer || '0') <= parseFloat(filters.millageTo),
      );
    }

    if (filters.locations && filteredData) {
      const loc = filters.locations
        .toLowerCase()
        .split(' ')
        .filter((el) => el.trim() !== '');
      filteredData = filteredData.filter((vehicle) => {
        const location = vehicle.general_info?.location?.toLowerCase();
        return loc.some((el) => location?.includes(el));
      });
    }

    if (filters.search && filteredData) {
      const data = filters.search
        .toLowerCase()
        .split(' ')
        .filter((el) => el.trim() !== '');
      filteredData = filteredData.filter((vehicle) => {
        const brand = vehicle.vehicle_brands?.brand?.toLowerCase();
        const model = vehicle.vehicle_models?.model?.toLowerCase();
        const vinNum = vehicle.vehicle_identification_numbers?.vin?.toLowerCase();
        const stockNum = vehicle.stock_no?.toLowerCase();
        const year = vehicle.vehicle_manufacture_years?.year.toLowerCase();
        return data.some(
          (el) =>
            brand?.includes(el) ||
            model?.includes(el) ||
            vinNum?.includes(el) ||
            stockNum?.includes(el) ||
            year?.includes(el),
        );
      });
    }

    setDataForTable(filteredData);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const tableData = useTableData({
    data: dataForTable,
    initialItem: {
      id: '',
      _blank_vehicleImage: '',
      year: '',
      model: '',
      stock_number: '',
      vin: '',
      color: '',
      sale_type: '',
      date_added: '',
      location: '',
      price: '',
      cost: '',
      status: '',
      _blank_optionBtn_CAN_25_26_: '',
    },
    mapper: (el) => {
      return {
        id: el.id?.toString(),
        _blank_vehicleImage: (
          <ImageContainer width={2.32} height={5} img={el.vehicle_image?.path} />
        ),
        year: el.vehicle_manufacture_years?.year || '',
        model: `${el.vehicle_brands?.brand} ${el.vehicle_models?.model}`,
        vin: el.vehicle_identification_numbers?.vin,
        stock_number: el.stock_no,
        // color: el.exterior_vehicle_colors?.color,
        sale_type: el.general_info?.sales_category?.type,
        date_added: dateFormatted(2, el.entry_stock),
        location: el.general_info?.location,
        price: `$${el.title_license?.floor_price || '0'}`,
        cost: el.title_license?.cost_adds,
        status: (
          <StatusPicker
            identity="status"
            onClick={handleButton}
            status={el.vehicle_status_id || 5}
            itemId={el.id || 0}
            options={statuses?.map((el) => {
              return { id: el.id, option: el.status };
            })}
            optionsBackgroundColor="#FFF"
            optionsHeight={6}
            optionsWidth={11}
            optionsRadius={0.8}
            optionsTop={4.5}
            noOpenItemOptions={!can(24)}
          />
        ),
        _blank_optionBtn_CAN_25_26_: (
          <OptionsButton
            identity="deleteEdit"
            optionsBackgroundColor="#FFF"
            optionsHeight={6}
            optionsWidth={7}
            optionsRight={1.5}
            optionsTop={0}
            optionsRadius={0.8}
            itemId={el.id || 0}
            options={
              can(25) && !can(26)
                ? [{ id: 1, option: 'Edit', icon: <EditIcon /> }]
                : !can(25) && can(26)
                  ? [{ id: 2, option: 'Delete', icon: <TrashIcon /> }]
                  : can([25, 26])
                    ? [
                        { id: 1, option: 'Edit', icon: <EditIcon /> },
                        { id: 2, option: 'Delete', icon: <TrashIcon /> },
                      ]
                    : undefined
            }
            onClick={handleButton}
          />
        ),
      };
    },
  });

  useEffect(() => {
    if (!iconedSelectOptions) {
      setShowFilter(false);
    }
  }, [iconedSelectOptions]);

  return (
    <Slide
      title="Inventory"
      paddingTop={2.4}
      paddingInline={0.6}
      decisionMessage={deleteConfirmationMessage}
      loadingConfirmation={loadingFetch}
      onDecision={handleDeleteDecision}
    >
      <ButtonContainer marginTop={0} alignContentEnd widthFull justify="space-between">
        <ButtonContainer marginTop={0} gap={1} alignContentEnd>
          {buttonInfo1.map((el) =>
            el.button && el.identity && !el.can ? (
              <Button
                key={el.key}
                width={el.width}
                backgroundColor={el.backgroundColor}
                identity={el.identity}
                buttonText={el.buttonText}
                iconTextGap={el.gap}
                borderRadius={el.borderRadius}
                buttonIcon={el.icon}
                iconRight={el.iconRight}
                textColor={el.textColor}
                onClick={el.onClick}
              />
            ) : el.input && el.key ? (
              <Input
                label={el.label}
                name={el.name}
                value={el.value}
                width={el.width}
                backgroundColor={el.backgroundColor}
                textAlterColor={el.textColor}
                type={el.type}
                borderRadius={el.borderRadius}
                options={el.options}
                onChange={el.onChange}
              />
            ) : el.can ? (
              <Can key={el.key} requiredPermission={el.can}>
                <Button
                  key={el.key}
                  width={el.width}
                  backgroundColor={el.backgroundColor}
                  identity={el.identity}
                  buttonText={el.buttonText}
                  iconTextGap={el.gap}
                  borderRadius={el.borderRadius}
                  buttonIcon={el.icon}
                  iconRight={el.iconRight}
                  textColor={el.textColor}
                  onClick={el.onClick}
                />
              </Can>
            ) : (
              el.onChange &&
              el.height && (
                <SearchInput
                  key={el.key}
                  width={el.width}
                  height={el.height}
                  name={el.name}
                  value={el.value}
                  placeholder={el.placeholder}
                  backgroundColor={el.backgroundColor}
                  textColor={el.textColor}
                  onChange={el.onChange}
                  borderRadius={el.borderRadius}
                />
              )
            ),
          )}
        </ButtonContainer>
        <ButtonContainer marginTop={0} gap={0.7} positionRelative>
          <Filter options={options} />
          {buttonInfo2.map((el) => (
            <Can key={el.key} requiredPermission={el.can}>
              <Button
                width={el.width}
                backgroundColor={el.backgroundColor}
                identity={el.identity}
                buttonText={el.buttonText}
                iconTextGap={el.gap}
                borderRadius={el.borderRadius}
                buttonIcon={el.icon}
                iconRight={el.iconRight}
                textColor={el.textColor}
                onClick={el.onClick}
              />
            </Can>
          ))}
          <AnimatePresence></AnimatePresence>
        </ButtonContainer>
      </ButtonContainer>
      <ModalContent>
        {/* <ColoredTable
          height={48}
          textColor="#FFF"
          tableData={tableData}
          paginationTable
          itemsPerPage={10}
          loading={loading || loadingFetch}
          printButton
        /> */}
        <ColoredTableV2
          height={48}
          data={tableData}
          columns={columns}
          initialColumnsDef={initialColumnsDef}
          itemsPerPage={10}
          loading={loading}
          paginationIsActive
          paginationTextColor="#fff"
          textColor="#FFF"
          rowSelectionIsActive={false}
          printButtonIsActive
        />
      </ModalContent>
    </Slide>
  );
}
