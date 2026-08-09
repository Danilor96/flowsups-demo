import { useEffect, useState } from 'react';
import { AddingSelect } from '../../inputs/addingSelect/AddingSelect';
import { Banks, getData } from './banks.services';

export function BankSelect({
  value,
  name,
  fieldErrors,
  onChange,
  onSelect,
}: {
  name: string;
  value: string;
  fieldErrors?: {
    [key: string]: [string | undefined];
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSelect: (option: { value: number | string | undefined; option: string | undefined }) => void;
}) {
  const fetchData = async () => {
    const res = await getData();

    setData(res);
  };

  const [data, setData] = useState<Banks[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AddingSelect
      name={name}
      width={12}
      value={value}
      label="Bank"
      options={data.map((el) => ({
        value: el.id,
        option: el.bank,
      }))}
      onChange={onChange}
      onSelect={onSelect}
      fieldErrors={fieldErrors}
      capitalString
    />
  );
}
