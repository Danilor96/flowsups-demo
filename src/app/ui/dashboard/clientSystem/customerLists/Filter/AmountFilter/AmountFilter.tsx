import { useEffect, useState } from 'react';
import { AmountFilterCriteria } from './filterByAmount';
import { Button } from '@/app/ui/buttons/Button';

interface AmountFilterInputProps {
  label?: string;
  filter?: AmountFilterCriteria;
  onChange: (newFilter: AmountFilterCriteria | null) => void;
}

const AmountFilter = ({ label, filter, onChange }: AmountFilterInputProps) => {
  const [selectedCondition, setSelectedCondition] = useState<string>(filter?.condition || '');
  const [filterValue, setFilterValue] = useState<string>(filter?.value || '');
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    setSelectedCondition(filter?.condition || '');
    setFilterValue(filter?.value || '');
  }, [filter]);

  const conditionOptions = [
    { value: '', label: 'Condition' },
    { value: '=', label: 'Equal' },
    { value: '!=', label: 'Not Equal' },
    { value: '>', label: 'Greater Than' },
    { value: '>=', label: 'Greater Than Or Equal' },
    { value: '<', label: 'Less Than' },
    { value: '<=', label: 'Less Than Or Equal' }
  ];

  const handleConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCondition = event.target.value;
    setSelectedCondition(newCondition);

    if (newCondition === '') {
      onChange(null);
      setFilterValue('');
    } else {
      onChange({ condition: newCondition as AmountFilterCriteria['condition'], value: filterValue });
    }
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFilterValue(newValue);
    if (selectedCondition !== '') {
      onChange({ condition: selectedCondition as AmountFilterCriteria['condition'], value: newValue });
    }
  };

  const handleClear = () => {
    setSelectedCondition('');
    setFilterValue('');
    onChange(null);
  };

  return (
    <div className={'w-fit relative flex flex-col gap-[1vw]'}>
      {label && (
        <label className="text-[1.626852vh] font-medium leading-[2.440741vh] text-[rgb(0,167,139)]">{label}</label>
      )}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="h-[5.55vh] shadow border-[0.13vw] text-[#00A78B] border-[#00A78B] py-[0.55rem]/ px-[0.6vw] rounded-[1.302083vw] font-normal text-[1.8vh]  flex 
        items-center justify-center gap-2 hover:scale-105 transition-all"
      >
        Amount
      </button>
      {showPanel && (
        <div
          className={`flex gap-2 absolute z-20 top-full mt-2 min-w-[430px] max-w-[800px] right-0 p-4 border border-gray-300 rounded-lg shadow-lg bg-white`}
        >
          <select
            value={selectedCondition}
            onChange={handleConditionChange}
            className="block w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {conditionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={filterValue}
            onChange={handleValueChange}
            placeholder="Amount"
            disabled={selectedCondition === ''}
            className={`
            block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
            focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
            ${selectedCondition === '' ? 'disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed' : ''}
          `}
          />
          <div className="md:col-span-1 flex items-end">
            <button onClick={handleClear} className={`p-2 text-red-500 hover:text-red-700 ${!filter ? 'hidden' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmountFilter;
