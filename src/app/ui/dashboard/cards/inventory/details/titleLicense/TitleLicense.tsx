import { useEffect, useState } from 'react';
import { adminDashboardStore, inventoryStore, messagesStore } from '@/store/adminDashboard';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '&/inputs/Input';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { TotalDisplay } from '&/dashboard/cards/inventory/details/titleLicense/totalDisplay/TotalDisplay';
import { Button } from '&/buttons/Button';
import {
  detailsInventorySystemIndexStore,
  DetailsTitleLicense,
  detailTitleLicenseStore,
  editVehicleStore,
} from '@/store/inventory';
import { titleLicenseSchema } from '&/dashboard/cards/inventory/details/titleLicense/titleLicenseSchema';
import { ZodError } from 'zod';
import { DottedInput } from '&/inputs/dottedInput/DottedInput';

export function TitleLicense() {
  // ----- global state -----

  const { idStateData } = adminDashboardStore();
  const { getIdState } = adminDashboardStore();

  const { titleStatus, titleBrand } = inventoryStore();
  const { getTitleStatus, getTitleBrand } = inventoryStore();

  const { titleLicense } = detailTitleLicenseStore();
  const { setField } = detailTitleLicenseStore();

  const { setDetailsIndex } = detailsInventorySystemIndexStore();

  const { vehicleData } = editVehicleStore();
  const { getVehicleData } = editVehicleStore();

  const { setMessages } = messagesStore();

  useEffect(() => {
    getTitleBrand();
    getTitleStatus();
    getIdState();
  }, [getTitleStatus, getTitleBrand, getIdState]);

  // ----- local state -----

  const [minDownType, setMinDownType] = useState<string>('1');
  const [depositType, setDepositType] = useState<string>('1');

  const [totals, setTotals] = useState<{
    vehiclePrice: number;
    potentialProfit: number;
    water: number;
    total: number;
  }>({
    potentialProfit: 0,
    vehiclePrice: 0,
    water: 0,
    total: 0,
  });

  const [inputs, setInputs] = useState<{
    titleOwner: string;
    rosTitle: string;
    titleState: string;
    titleStatus: string;
    titleBrand: string;
    licenseNo: string;
    licenseState: string;
    licenseExpiration: string;
    askingPrice: string;
    wholePrice: string;
    adversiting: string;
    floorPrice: string;
    specialPrice: string;
    specialPriceStartDate: string;
    specialPriceEndDate: string;
    buyNowPrice: string;
    msrp: string;
    startBid: string;
    minDown: string;
    percent: string;
    amount: string;
    startBid2: string;
    minDeposit: string;
    depositPercent: string;
    depositAmount: string;
    bidIncrement: string;
    vehicleCost: string;
    costAdds: string;
    packs: string;
    additional: string;
    buyerFee: string;
    lotFee: string;
  }>({
    titleOwner: '',
    rosTitle: '',
    titleState: '1',
    titleStatus: '1',
    titleBrand: '1',
    licenseNo: '',
    licenseState: '1',
    licenseExpiration: '',
    askingPrice: '',
    wholePrice: '',
    adversiting: '',
    floorPrice: '',
    specialPrice: '',
    specialPriceStartDate: '',
    specialPriceEndDate: '',
    buyNowPrice: '',
    msrp: '',
    startBid: '',
    minDown: '',
    percent: '',
    amount: '',
    startBid2: '',
    minDeposit: '',
    depositPercent: '',
    depositAmount: '',
    bidIncrement: '',
    vehicleCost: '',
    costAdds: '',
    packs: '',
    additional: '',
    buyerFee: '',
    lotFee: '',
  });

  useEffect(() => {
    if (vehicleData && vehicleData.id && vehicleData.title_license) {
      setInputs({
        titleOwner: vehicleData.title_license?.title_owner || '',
        rosTitle: vehicleData.title_license?.ros_title || '',
        titleState: vehicleData.title_license?.title_state_id?.toString() || '1',
        titleStatus: vehicleData.title_license?.title_status_id?.toString() || '1',
        titleBrand: vehicleData.title_license?.title_brand_id?.toString() || '1',
        licenseNo: vehicleData.title_license?.license_no || '',
        licenseState: vehicleData.title_license?.license_state_id?.toString() || '1',
        licenseExpiration:
          vehicleData.title_license?.license_expiration?.toLocaleString().split('T')[0] || '',
        askingPrice: vehicleData.title_license?.asking_price || '',
        wholePrice: vehicleData.title_license?.whole_price || '',
        adversiting: vehicleData.title_license?.adversiting || '',
        floorPrice: vehicleData.title_license?.floor_price || '',
        specialPrice: vehicleData.title_license?.special_price || '',
        specialPriceStartDate:
          vehicleData.title_license?.special_price_start_date?.toLocaleString().split('T')[0] || '',
        specialPriceEndDate:
          vehicleData.title_license?.special_price_end_date?.toLocaleString().split('T')[0] || '',
        buyNowPrice: vehicleData.title_license?.buy_now_price || '',
        msrp: vehicleData.title_license?.msrp || '',
        startBid: vehicleData.title_license?.start_bid || '',
        minDown: vehicleData.title_license?.min_down || '',
        percent:
          (vehicleData.title_license?.min_down &&
            `${
              (parseFloat(vehicleData.title_license.min_down) *
                parseFloat(
                  vehicleData.title_license.special_price &&
                    vehicleData.title_license.special_price !== '0'
                    ? vehicleData.title_license.special_price
                    : vehicleData.title_license.adversiting &&
                      vehicleData.title_license.adversiting !== '0'
                    ? vehicleData.title_license.adversiting
                    : vehicleData.title_license.asking_price &&
                      vehicleData.title_license.asking_price !== '0'
                    ? vehicleData.title_license.asking_price
                    : '0',
                )) /
              100
            }`) ||
          '',
        amount:
          (vehicleData.title_license?.min_down &&
            `${
              (parseFloat(vehicleData.title_license.min_down) /
                parseFloat(
                  vehicleData.title_license.special_price &&
                    vehicleData.title_license.special_price !== '0'
                    ? vehicleData.title_license.special_price
                    : vehicleData.title_license.adversiting &&
                      vehicleData.title_license.adversiting !== '0'
                    ? vehicleData.title_license.adversiting
                    : vehicleData.title_license.asking_price &&
                      vehicleData.title_license.asking_price !== '0'
                    ? vehicleData.title_license.asking_price
                    : '0',
                )) *
              100
            }`) ||
          '',
        startBid2: vehicleData.title_license?.start_bid_2 || '',
        minDeposit: vehicleData.title_license?.min_deposit || '',
        depositPercent:
          (vehicleData.title_license?.min_deposit &&
            `${
              (parseFloat(vehicleData.title_license.min_deposit) *
                parseFloat(
                  vehicleData.title_license.special_price &&
                    vehicleData.title_license.special_price !== '0'
                    ? vehicleData.title_license.special_price
                    : vehicleData.title_license.adversiting &&
                      vehicleData.title_license.adversiting !== '0'
                    ? vehicleData.title_license.adversiting
                    : vehicleData.title_license.asking_price &&
                      vehicleData.title_license.asking_price !== '0'
                    ? vehicleData.title_license.asking_price
                    : '0',
                )) /
              100
            }`) ||
          '',
        depositAmount:
          (vehicleData.title_license?.min_deposit &&
            `${
              (parseFloat(vehicleData.title_license.min_deposit) /
                parseFloat(
                  vehicleData.title_license.special_price &&
                    vehicleData.title_license.special_price !== '0'
                    ? vehicleData.title_license.special_price
                    : vehicleData.title_license.adversiting &&
                      vehicleData.title_license.adversiting !== '0'
                    ? vehicleData.title_license.adversiting
                    : vehicleData.title_license.asking_price &&
                      vehicleData.title_license.asking_price !== '0'
                    ? vehicleData.title_license.asking_price
                    : '0',
                )) *
              100
            }`) ||
          '',
        bidIncrement: vehicleData.title_license?.bid_increment || '',
        vehicleCost: vehicleData.title_license?.vehicle_cost || '',
        costAdds: vehicleData.title_license?.cost_adds || '',
        packs: vehicleData.title_license?.packs || '',
        additional: vehicleData.title_license?.additional || '',
        buyerFee: '',
        lotFee: '',
      });

      // set totals

      if (
        vehicleData.title_license.special_price &&
        vehicleData.title_license.special_price !== '0'
      ) {
        setTotals((prevState) => ({
          ...prevState,
          vehiclePrice: parseInt(vehicleData.title_license?.special_price || '0'),
          potentialProfit: parseInt(vehicleData.title_license?.special_price || '0'),
        }));
      }

      if (
        vehicleData.title_license.adversiting &&
        (!vehicleData.title_license.special_price ||
          vehicleData.title_license.special_price === '0')
      ) {
        setTotals((prevState) => ({
          ...prevState,
          vehiclePrice: parseInt(vehicleData.title_license?.adversiting || '0'),
          potentialProfit: parseInt(vehicleData.title_license?.adversiting || '0'),
        }));
      }

      if (
        vehicleData.title_license.asking_price &&
        (!vehicleData.title_license.special_price ||
          vehicleData.title_license.special_price === '0') &&
        (!vehicleData.title_license.adversiting || vehicleData.title_license.adversiting === '0')
      ) {
        setTotals((prevState) => ({
          ...prevState,
          vehiclePrice: parseInt(vehicleData.title_license?.asking_price || '0'),
          potentialProfit: parseInt(vehicleData.title_license?.asking_price || '0'),
        }));
      }
    }
  }, [vehicleData]);

  useEffect(() => {
    if (titleLicense && Object.values(titleLicense).some((el) => el !== '')) {
      setInputs({
        titleOwner: titleLicense.titleOwner,
        rosTitle: titleLicense.rosTitle,
        titleState: titleLicense.titleState,
        titleStatus: titleLicense.titleStatus,
        titleBrand: titleLicense.titleBrand,
        licenseNo: titleLicense.licenseNo,
        licenseState: titleLicense.licenseState,
        licenseExpiration: titleLicense.licenseExpiration,
        askingPrice: titleLicense.askingPrice,
        wholePrice: titleLicense.wholePrice,
        adversiting: titleLicense.adversiting,
        floorPrice: titleLicense.floorPrice,
        specialPrice: titleLicense.specialPrice,
        specialPriceStartDate: titleLicense.specialPriceStartDate,
        specialPriceEndDate: titleLicense.specialPriceEndDate,
        buyNowPrice: titleLicense.buyNowPrice,
        msrp: titleLicense.msrp,
        startBid: titleLicense.startBid,
        minDown: titleLicense.minDown,
        percent: '',
        amount: '',
        startBid2: titleLicense.startBid2,
        minDeposit: titleLicense.minDeposit,
        depositPercent: '',
        depositAmount: '',
        bidIncrement: titleLicense.bidIncrement,
        vehicleCost: titleLicense.vehicleCost,
        costAdds: titleLicense.costAdds,
        packs: titleLicense.packs,
        additional: titleLicense.additional,
        buyerFee: titleLicense.buyerFee,
        lotFee: titleLicense.lotFee,
      });
    }
  }, [titleLicense]);

  const [fieldErrors, setFieldErrors] = useState<{
    titleOwner: [string | undefined];
    rosTitle: [string | undefined];
    titleState: [string | undefined];
    titleStatus: [string | undefined];
    titleBrand: [string | undefined];
    licenseNo: [string | undefined];
    licenseState: [string | undefined];
    licenseExpiration: [string | undefined];
    askingPrice: [string | undefined];
    wholePrice: [string | undefined];
    adversiting: [string | undefined];
    floorPrice: [string | undefined];
    specialPrice: [string | undefined];
    specialPriceStartDate: [string | undefined];
    specialPriceEndDate: [string | undefined];
    buyNowPrice: [string | undefined];
    msrp: [string | undefined];
    startBid: [string | undefined];
    minDown: [string | undefined];
    startBid2: [string | undefined];
    minDeposit: [string | undefined];
    bidIncrement: [string | undefined];
    vehicleCost: [string | undefined];
    costAdds: [string | undefined];
    packs: [string | undefined];
    additional: [string | undefined];
  }>({
    titleOwner: [''],
    rosTitle: [''],
    titleState: [''],
    titleStatus: [''],
    titleBrand: [''],
    licenseNo: [''],
    licenseState: [''],
    licenseExpiration: [''],
    askingPrice: [''],
    wholePrice: [''],
    adversiting: [''],
    floorPrice: [''],
    specialPrice: [''],
    specialPriceStartDate: [''],
    specialPriceEndDate: [''],
    buyNowPrice: [''],
    msrp: [''],
    startBid: [''],
    minDown: [''],
    startBid2: [''],
    minDeposit: [''],
    bidIncrement: [''],
    vehicleCost: [''],
    costAdds: [''],
    packs: [''],
    additional: [''],
  });

  // return total function

  const handleTotal = (name: string, value: string) => {
    let total: number, val;

    val = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;

    const costAdds = parseFloat(inputs.costAdds.replace(/[^0-9.]/g, '')) || 0;
    const packs = parseFloat(inputs.packs.replace(/[^0-9.]/g, '')) || 0;
    const buyerFee = parseFloat(inputs.buyerFee.replace(/[^0-9.]/g, '')) || 0;
    const lotFee = parseFloat(inputs.lotFee.replace(/[^0-9.]/g, '')) || 0;
    const vehicleCost = parseFloat(inputs.vehicleCost.replace(/[^0-9.]/g, '')) || 0;

    switch (name) {
      case 'vehicleCost':
        total = val + costAdds + packs + buyerFee + lotFee;
        break;
      case 'costAdds':
        total = val + packs + buyerFee + vehicleCost + lotFee;
        break;
      case 'packs':
        total = val + costAdds + vehicleCost + buyerFee + lotFee;
        break;
      case 'buyerFee':
        total = val + costAdds + vehicleCost + lotFee + packs;
        break;
      case 'lotFee':
        total = val + costAdds + vehicleCost + buyerFee + packs;
        break;
      default:
        total = 0;
        break;
    }

    return total;
  };

  // handling inputs changing

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'minDownType') {
      setMinDownType(`${value}`);
    }

    if (name === 'depositType') {
      setDepositType(`${value}`);
    }

    // retail pricess and totals logic

    if (name === 'specialPrice') {
      setTotals((prevState) => ({
        ...prevState,
        vehiclePrice: parseFloat(value),
        potentialProfit: parseFloat(value),
      }));
    }

    if (name === 'adversiting' && (!inputs.specialPrice || inputs.specialPrice === '0')) {
      const numericValue = value.replace(/[^0-9.]/g, '');

      setTotals((prevState) => ({
        ...prevState,
        vehiclePrice: parseFloat(numericValue),
        potentialProfit: parseFloat(numericValue),
      }));
    }

    if (
      name === 'askingPrice' &&
      (!inputs.specialPrice || inputs.specialPrice === '0') &&
      (!inputs.adversiting || inputs.adversiting === '0')
    ) {
      const numericValue = value.replace(/[^0-9.]/g, '');

      setTotals((prevState) => ({
        ...prevState,
        vehiclePrice: parseFloat(numericValue),
        potentialProfit: parseFloat(numericValue),
      }));
    }

    // min down logic

    if (name === 'percent') {
      const mult =
        inputs.specialPrice && inputs.specialPrice !== '0'
          ? parseFloat(inputs.specialPrice)
          : inputs.adversiting && inputs.adversiting !== '0'
          ? parseFloat(inputs.adversiting)
          : inputs.askingPrice && inputs.askingPrice !== '0'
          ? parseFloat(inputs.askingPrice)
          : 0;
      const porcentValue = (parseFloat(value) * mult) / 100;
      setInputs((prevState) => ({
        ...prevState,
        minDown: porcentValue.toString(),
        amount: porcentValue.toString(),
      }));
    }

    if (name === 'amount') {
      const div =
        inputs.specialPrice && inputs.specialPrice !== '0'
          ? parseFloat(inputs.specialPrice)
          : inputs.adversiting && inputs.adversiting !== '0'
          ? parseFloat(inputs.adversiting)
          : inputs.askingPrice && inputs.askingPrice !== '0'
          ? parseFloat(inputs.askingPrice)
          : 0;
      const por = div !== 0 ? (parseFloat(value) / div) * 100 : 0;
      setInputs((prevState) => ({
        ...prevState,
        minDown: value,
        percent: por.toString(),
      }));
    }

    // deposit logic

    if (name === 'depositPercent') {
      const mult =
        inputs.specialPrice && inputs.specialPrice !== '0'
          ? parseFloat(inputs.specialPrice)
          : inputs.adversiting && inputs.adversiting !== '0'
          ? parseFloat(inputs.adversiting)
          : inputs.askingPrice && inputs.askingPrice !== '0'
          ? parseFloat(inputs.askingPrice)
          : 0;
      const porcentValue = (parseFloat(value) * mult) / 100;
      setInputs((prevState) => ({
        ...prevState,
        minDeposit: porcentValue.toString(),
        depositAmount: porcentValue.toString(),
      }));
    }

    if (name === 'depositAmount') {
      const div =
        inputs.specialPrice && inputs.specialPrice !== '0'
          ? parseFloat(inputs.specialPrice)
          : inputs.adversiting && inputs.adversiting !== '0'
          ? parseFloat(inputs.adversiting)
          : inputs.askingPrice && inputs.askingPrice !== '0'
          ? parseFloat(inputs.askingPrice)
          : 0;
      const por = div !== 0 ? (parseFloat(value) / div) * 100 : 0;
      setInputs((prevState) => ({
        ...prevState,
        minDeposit: value,
        depositPercent: por.toString(),
      }));
    }

    // additional logic

    if (name === 'buyerFee') {
      const addition = parseFloat(value || '0') + parseFloat(inputs.lotFee || '0');

      setInputs((prevState) => ({
        ...prevState,
        additional: addition.toString(),
      }));

      setTotals((prevState) => ({
        ...prevState,
        total: handleTotal(name, value),
        water: handleTotal(name, value),
        potentialProfit: totals.vehiclePrice - handleTotal(name, value),
      }));
    }

    if (name === 'lotFee') {
      const addition = parseFloat(value || '0') + parseFloat(inputs.buyerFee || '0');

      setInputs((prevState) => ({
        ...prevState,
        additional: addition.toString(),
      }));

      setTotals((prevState) => ({
        ...prevState,
        total: handleTotal(name, value),
        water: handleTotal(name, value),
        potentialProfit: totals.vehiclePrice - handleTotal(name, value),
      }));
    }

    // total vehicle price logic

    if (name === 'vehicleCost' || name === 'costAdds' || name === 'packs') {
      setTotals((prevState) => ({
        ...prevState,
        total: handleTotal(name, value),
        water: handleTotal(name, value),
        potentialProfit: totals.vehiclePrice - handleTotal(name, value),
      }));
    }

    // inputs logic

    if (
      [
        'titleOwner',
        'rosTitle',
        'titleState',
        'titleStatus',
        'titleBrand',
        'licenseNo',
        'licenseState',
        'licenseExpiration',
      ].some((val) => name.includes(val))
    ) {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      return;
    }

    const numericValue = value.replace(/[^0-9.]/g, '');

    setInputs((prevState) => ({
      ...prevState,
      [name]: numericValue,
    }));
  };

  // handling buttons

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'continue') {
      try {
        titleLicenseSchema.parse(inputs);

        for (const [name, value] of Object.entries(inputs)) {
          setField(name as keyof DetailsTitleLicense['titleLicense'], value);
        }

        setDetailsIndex(3);
      } catch (error) {
        if (error instanceof ZodError) {
          const newErrors: typeof fieldErrors = {
            titleOwner: [''],
            rosTitle: [''],
            titleState: [''],
            titleStatus: [''],
            titleBrand: [''],
            licenseNo: [''],
            licenseState: [''],
            licenseExpiration: [''],
            askingPrice: [''],
            wholePrice: [''],
            adversiting: [''],
            floorPrice: [''],
            specialPrice: [''],
            specialPriceStartDate: [''],
            specialPriceEndDate: [''],
            buyNowPrice: [''],
            msrp: [''],
            startBid: [''],
            minDown: [''],
            startBid2: [''],
            minDeposit: [''],
            bidIncrement: [''],
            vehicleCost: [''],
            costAdds: [''],
            packs: [''],
            additional: [''],
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

        const res = await (
          await fetch(`/api/inventory/titleLicense/${vehicleData?.id}`, {
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
      setDetailsIndex(3);
    }

    if (identity === 'prevPage') {
      setDetailsIndex(1);
    }
  };

  // handling inputs

  const inputsInfo1 = [
    {
      key: 1,
      label: 'Title Owner',
      value: inputs.titleOwner,
      name: 'titleOwner',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 2,
      label: 'ROS / Title',
      value: inputs.rosTitle,
      name: 'rosTitle',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 3,
      label: 'Title State',
      value: inputs.titleState,
      name: 'titleState',
      width: 10.208333,
      type: 'select',
      options: idStateData.map((el) => {
        return { value: el.id, option: el.id_state };
      }),
      onChange: handleChange,
      extra: {
        label: 'Title Status',
        value: inputs.titleStatus,
        name: 'titleStatus',
        width: 10.208333,
        type: 'select',
        options: titleStatus?.map((el) => {
          return { value: el.id, option: el.status };
        }),
        onChange: handleChange,
      },
    },
    {
      key: 4,
      label: 'Title Brand',
      value: inputs.titleBrand,
      name: 'titleBrand',
      width: 20.9375,
      type: 'select',
      options: titleBrand?.map((el) => {
        return { value: el.id, option: el.brand };
      }),
      onChange: handleChange,
    },
    {
      key: 5,
      label: 'License No.',
      value: inputs.licenseNo,
      name: 'licenseNo',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
    },
    {
      key: 6,
      label: 'License State',
      value: inputs.licenseState,
      name: 'licenseState',
      width: 10.208333,
      type: 'select',
      options: idStateData.map((el) => {
        return { value: el.id, option: el.id_state };
      }),
      onChange: handleChange,
      extra: {
        label: 'License Expiration',
        value: inputs.licenseExpiration,
        name: 'licenseExpiration',
        width: 10.208333,
        type: 'date',
        onChange: handleChange,
      },
    },
  ];

  const inputsInfo2 = [
    {
      key: 1,
      title: 'Retail',
    },
    {
      key: 2,
      title: 'Wholesale',
    },
    {
      key: 3,
      label: 'Asking Price',
      value: inputs.askingPrice ? inputs.askingPrice : '0',
      name: 'askingPrice',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
    {
      key: 4,
      label: 'Wholesale Price',
      value: inputs.wholePrice ? inputs.wholePrice : '0',
      name: 'wholePrice',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
    {
      key: 5,
      label: 'Adversiting',
      value: inputs.adversiting ? inputs.adversiting : '0',
      name: 'adversiting',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
    {
      key: 6,
      label: 'Floor Price',
      value: inputs.floorPrice ? inputs.floorPrice : '0',
      name: 'floorPrice',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
    {
      key: 7,
      label: 'Sepcial Price',
      value: inputs.specialPrice ? inputs.specialPrice : '0',
      name: 'specialPrice',
      width: 20.9375,
      type: 'dottedInput',
      onChange: handleChange,
      optionsWidth: 12,
      optionsHeight: 34,
      optionsColumns: 1,
      disabled: true,
      optionsColumnsGap: 1,
      optionsRight: true,
      placeholder: '$0.00',
      optionsInputs: [
        {
          key: 1,
          label: 'Special price',
          value: inputs.specialPrice ? inputs.specialPrice : '0',
          name: 'specialPrice',
          width: 9,
          type: 'text',
          onChange: handleChange,
        },
        {
          key: 2,
          label: 'Start Date',
          value: inputs.specialPriceStartDate,
          name: 'specialPriceStartDate',
          width: 9,
          type: 'date',
          onChange: handleChange,
        },
        {
          key: 3,
          label: 'End Date',
          value: inputs.specialPriceEndDate,
          name: 'specialPriceEndDate',
          width: 9,
          type: 'date',
          onChange: handleChange,
        },
      ],
    },
    {
      key: 8,
      label: 'Buy Now Price',
      value: inputs.buyNowPrice ? inputs.buyNowPrice : '0',
      name: 'buyNowPrice',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
    {
      key: 9,
      label: 'MSRP',
      value: inputs.msrp ? inputs.msrp : '0',
      name: 'msrp',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
    {
      key: 10,
      label: 'Start Bid',
      value: inputs.startBid ? inputs.startBid : '0',
      name: 'startBid',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
    {
      key: 11,
      label: 'Min. Down',
      value: inputs.minDown ? inputs.minDown : '0',
      name: 'minDown',
      width: 20.9375,
      type: 'dottedInput',
      onChange: handleChange,
      optionsWidth: 12,
      optionsHeight: 32,
      optionsColumns: 1,
      disabled: true,
      optionsColumnsGap: 1,
      optionsRight: true,
      optionsTop: -28.7,
      placeholder: '$0.00',
      optionsInputs: [
        {
          key: 1,
          label: 'Type',
          value: minDownType,
          name: 'minDownType',
          width: 9,
          type: 'select',
          options: [
            { value: 1, option: '% of selling price' },
            { value: 2, option: 'Amount' },
          ],
          onChange: handleChange,
        },
        {
          key: 2,
          label: `${minDownType === '1' ? 'Percent' : 'Amount'}`,
          value: minDownType === '1' ? inputs.percent : inputs.amount,
          name: `${minDownType === '1' ? 'percent' : 'amount'}`,
          width: 9,
          type: 'text',
          placeholder: '$0.00',
          onChange: handleChange,
        },
        {
          key: 3,
          label: `${minDownType === '1' ? 'Amount' : 'Percent'}`,
          value: minDownType === '1' ? inputs.amount : inputs.percent,
          name: `${minDownType === '1' ? 'amount' : 'percent'}`,
          width: 9,
          type: 'text',
          placeholder: '$0.00',
          disabled: true,
          onChange: handleChange,
        },
      ],
    },
    {
      key: 12,
      label: 'Start Bid',
      value: inputs.startBid2 ? inputs.startBid2 : '0',
      name: 'startBid2',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
    {
      key: 13,
      label: 'Min. Deposit',
      value: inputs.minDeposit ? inputs.minDeposit : '0',
      name: 'minDeposit',
      width: 20.9375,
      type: 'dottedInput',
      onChange: handleChange,
      optionsWidth: 12,
      optionsHeight: 32,
      optionsColumns: 1,
      disabled: true,
      optionsColumnsGap: 1,
      optionsRight: true,
      optionsTop: -28.7,
      placeholder: '$0.00',
      optionsInputs: [
        {
          key: 1,
          label: 'Type',
          value: depositType,
          name: 'depositType',
          width: 9,
          type: 'select',
          options: [
            { value: 1, option: '% of selling price' },
            { value: 2, option: 'Amount' },
          ],
          onChange: handleChange,
        },
        {
          key: 2,
          label: `${depositType === '1' ? 'Percent' : 'Amount'}`,
          value: depositType === '1' ? inputs.depositPercent : inputs.depositAmount,
          name: `${depositType === '1' ? 'depositPercent' : 'depositAmount'}`,
          width: 9,
          type: 'text',
          onChange: handleChange,
          placeholder: '$0.00',
        },
        {
          key: 3,
          label: `${depositType === '1' ? 'Amount' : 'Percent'}`,
          value: depositType === '1' ? inputs.depositAmount : inputs.depositPercent,
          name: `${depositType === '1' ? 'depositAmount' : 'depositPercent'}`,
          width: 9,
          type: 'text',
          disabled: true,
          onChange: handleChange,
          placeholder: '$0.00',
        },
      ],
    },
    {
      key: 14,
      label: 'Bid Increment',
      value: inputs.bidIncrement ? inputs.bidIncrement : '0',
      name: 'bidIncrement',
      width: 20.9375,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
  ];

  const inputsInfo3 = [
    {
      key: 1,
      title: 'Cost Info',
    },
    {
      key: 2,
      label: 'Vehicle Cost',
      value: inputs.vehicleCost ? inputs.vehicleCost : '0',
      name: 'vehicleCost',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
    {
      key: 3,
      label: 'Cost Adds',
      value: inputs.costAdds ? inputs.costAdds : '0',
      name: 'costAdds',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
    {
      key: 4,
      label: 'Packs',
      value: inputs.packs ? inputs.packs : '0',
      name: 'packs',
      width: 10.208333,
      type: 'text',
      onChange: handleChange,
      placeholder: '$0.00',
    },
    {
      key: 5,
      label: 'Additional',
      value: inputs.additional ? inputs.additional : '0',
      name: 'additional',
      width: 10.208333,
      type: 'dottedInput',
      onChange: handleChange,
      optionsWidth: 12,
      optionsHeight: 24,
      optionsColumns: 1,
      disabled: true,
      optionsColumnsGap: 1.5,
      optionsRight: true,
      optionsTop: 0,
      placeholder: '$0.00',
      optionsInputs: [
        {
          key: 1,
          label: 'Buyer Fee',
          value: inputs.buyerFee ? inputs.buyerFee : '0',
          name: 'buyerFee',
          width: 9,
          type: 'text',
          onChange: handleChange,
          placeholder: '$0.00',
        },
        {
          key: 2,
          label: 'Lot Fee',
          value: inputs.lotFee ? inputs.lotFee : '0',
          name: 'lotFee',
          width: 9,
          type: 'text',
          onChange: handleChange,
          placeholder: '$0.00',
        },
      ],
    },
  ];

  return (
    <ModalContent>
      <BorderedContent title="Title / License">
        <ContentRow cols={3} gap={4} centerContent>
          {inputsInfo1.map((el) => (
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
                  options={el.extra.options}
                  fieldErrors={fieldErrors}
                />
              )}
            </ButtonContainer>
          ))}
        </ContentRow>
      </BorderedContent>
      <BorderedContent title="Price Info" marginTop={2.777778}>
        <ContentRow cols={2} gap={9} centerContent alignItems="start">
          <ContentRow cols={2} gap={2} centerContent>
            {inputsInfo2.map((el) =>
              el.title ? (
                <ButtonContainer key={el.key} marginTop={0} marginLeft={el.key === 2 ? 3 : 0}>
                  <Paragraph fontSize={2} fontWeight={600} color="#00A78B">
                    {el.title}
                  </Paragraph>
                </ButtonContainer>
              ) : (
                el.onChange && (
                  <ButtonContainer
                    key={el.key}
                    marginTop={0}
                    gap={0.520833}
                    marginLeft={
                      ['2', '4', '6', '8', '10', '12'].some((opt) =>
                        el.key.toString().includes(opt),
                      )
                        ? 3
                        : 0
                    }
                  >
                    {el.type === 'dottedInput' && el.optionsWidth && el.optionsInputs ? (
                      <DottedInput
                        label={el.label}
                        name={el.name}
                        value={`$${parseInt(el.value).toLocaleString('en-US')}`}
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
                        optionsTop={el.optionsTop}
                        placeholder={el.placeholder}
                      />
                    ) : (
                      <Input
                        label={el.label}
                        name={el.name}
                        value={`$${parseInt(el.value).toLocaleString('en-US')}`}
                        width={el.width}
                        type={el.type}
                        onChange={el.onChange}
                        fieldErrors={fieldErrors}
                        placeholder={el.placeholder}
                      />
                    )}
                  </ButtonContainer>
                )
              ),
            )}
          </ContentRow>
          <ContentRow cols={2} gap={2} centerContent>
            {inputsInfo3.map((el) =>
              el.title ? (
                <aside key={el.key} className="col-span-2">
                  <Paragraph fontSize={2} fontWeight={600} color="#00A78B">
                    {el.title}
                  </Paragraph>
                </aside>
              ) : (
                el.onChange && (
                  <ButtonContainer key={el.key} marginTop={0} gap={0.520833}>
                    {el.type === 'dottedInput' && el.optionsWidth && el.optionsInputs ? (
                      <DottedInput
                        label={el.label}
                        name={el.name}
                        value={`$${parseInt(el.value).toLocaleString('en-US')}`}
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
                        optionsTop={el.optionsTop}
                        placeholder={el.placeholder}
                      />
                    ) : (
                      <Input
                        label={el.label}
                        name={el.name}
                        value={`$${parseInt(el.value).toLocaleString('en-US')}`}
                        width={el.width}
                        type={el.type}
                        onChange={el.onChange}
                        fieldErrors={fieldErrors}
                        placeholder={el.placeholder}
                      />
                    )}
                  </ButtonContainer>
                )
              ),
            )}
            <TotalDisplay totals={totals} />
            <aside className="mt-[5vh] col-span-2">
              <ButtonContainer marginTop={0} widthFull justify="space-between">
                <Button
                  backgroundColor="#3e64e7"
                  identity="prevPage"
                  onClick={handleButton}
                  textColor="#FFF"
                  width={6}
                  buttonText="Prev page"
                />
                {vehicleData && vehicleData.id && (
                  <Button
                    backgroundColor="#3e64e7"
                    identity="nextPage"
                    onClick={handleButton}
                    textColor="#FFF"
                    width={6}
                    buttonText="Next page"
                  />
                )}
                <Button
                  backgroundColor="#00A78B"
                  identity={`${vehicleData?.id ? 'save' : 'continue'}`}
                  onClick={handleButton}
                  textColor="#FFF"
                  width={vehicleData?.id ? 8 : 20.9375}
                  buttonText={`${vehicleData?.id ? 'Save' : 'Continue'}`}
                />
              </ButtonContainer>
            </aside>
          </ContentRow>
        </ContentRow>
      </BorderedContent>
    </ModalContent>
  );
}
