import { Input } from '&/inputs/Input';
import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';
import { dealStore } from '@/store/deal';
import { useEffect } from 'react';

const fundingStatuses = [
  {
    value: FundingStatuses.InProcess,
    option: 'In Process',
  },
  {
    value: FundingStatuses.Funded,
    option: 'Funded',
  },
  {
    value: FundingStatuses.Returned,
    option: 'Returned',
  },
];

const returnFundedStatusName = (id: number) => {
  let name = '';

  switch (id) {
    case FundingStatuses.InProcess:
      name = 'In Process';
      break;

    case FundingStatuses.Funded:
      name = 'Funded';
      break;

    case FundingStatuses.Returned:
      name = 'Returned';
      break;
  }

  return name;
};

export function TableInput({
  defaultValue,
  name,
  dealId,
  customerId,
  openDeal,
}: {
  defaultValue: string | number | null;
  name: string;
  dealId: number;
  customerId?: number;
  openDeal?: boolean;
}) {
  // ----- global states -----

  const { dealIdSelected, dealData, setDealData } = dealStore();

  const { getSingleClientData } = singleCLientDataStore();

  const { openClientDetail, openSetUpADeal } = modalWindowStore();

  // ----- local states -----

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    setDealData(name, value, identity);
  };

  const value = dealData[name as keyof typeof dealData];

  useEffect(() => {
    if (defaultValue && !value) {
      let defValue = typeof defaultValue === 'number' ? defaultValue.toString() : defaultValue;

      setDealData(name, defValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (defaultValue === null || value === null || value === undefined) return null;

  if (!dealIdSelected || dealIdSelected !== dealId || openDeal) {
    if (openDeal && customerId) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();

            getSingleClientData(customerId.toString());

            openClientDetail();

            openSetUpADeal();
          }}
        >
          {defaultValue}
        </button>
      );
    }

    if (typeof defaultValue === 'number') {
      return returnFundedStatusName(defaultValue);
    }

    return defaultValue;
  }

  if (customerId) {
    return (
      <Input
        label=""
        name={name}
        onChange={handleChange}
        value={value?.toString()}
        type="select"
        options={fundingStatuses}
        width={0}
        stopPropagationOnClick
        identity={customerId.toString()}
      />
    );
  }

  if (typeof value === 'number') return null;

  return (
    <Input
      label=""
      name={name}
      onChange={handleChange}
      value={value}
      type="text"
      width={0}
      stopPropagationOnClick
    />
  );
}
