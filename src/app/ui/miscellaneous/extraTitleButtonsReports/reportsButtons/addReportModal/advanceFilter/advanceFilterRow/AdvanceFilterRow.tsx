import { FilterableField, FilterableFieldType } from '@/store/customerList/types';

const conditionsByType: Record<FilterableFieldType, { value: FilterCondition; label: string }[]> = {
  text: [
    { value: 'equals', label: 'equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'doesNotContain', label: 'Does Not Contain' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'greaterThanOrEqual', label: 'Greater or Equal' },
    { value: 'lessThanOrEqual', label: 'Less or Equal' },
    { value: 'between', label: 'Between' },
  ],
  date: [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'greaterThanOrEqual', label: 'Greater or Equal' },
    { value: 'lessThanOrEqual', label: 'Less or Equal' },
    { value: 'between', label: 'Between' },
  ],
  boolean: [
    { value: 'isTrue', label: 'is True' },
    { value: 'isFalse', label: 'is False' },
  ],
  select: [
    { value: 'is', label: 'is' },
    { value: 'isNot', label: 'is Not' },
  ],
};

interface AdvancedFilterRowProps {
  filter: AppliedFilter;
  filterableFields: FilterableField[];
  onUpdate: (updatedFilter: AppliedFilter) => void;
  onRemove: (filterId: string) => void;
}

export const AdvanceFilterRow: React.FC<AdvancedFilterRowProps> = ({
  filter,
  filterableFields,
  onUpdate,
  onRemove,
}) => {
  const selectedFieldConfig = filterableFields.find((f) => f.id === filter.field);
  const availableConditions = selectedFieldConfig ? conditionsByType[selectedFieldConfig.type] : [];

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...filter, field: e.target.value, condition: '', value: null, value2: null });
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({
      ...filter,
      condition: e.target.value as FilterCondition,
      value: null,
      value2: null,
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const fieldType = selectedFieldConfig?.type;
    let val: FilterValue = e.target.value;
    if (fieldType === 'number') val = e.target.value === '' ? null : parseFloat(e.target.value);

    onUpdate({ ...filter, value: val });
  };

  const handleValue2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldType = selectedFieldConfig?.type;
    let val: FilterValue = e.target.value;
    if (fieldType === 'number') val = e.target.value === '' ? null : parseFloat(e.target.value);
    onUpdate({ ...filter, value2: val });
  };

  const renderValueInput = () => {
    if (!selectedFieldConfig || !filter.condition) return null;

    const commonInputClass =
      'bg-[#F4F4F4] text-sm mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00A78B] focus:border-[#00A78B] sm:text-sm';

    switch (selectedFieldConfig.type) {
      case 'text':
        return (
          <input
            type="text"
            value={(filter.value as string) || ''}
            onChange={handleValueChange}
            className={commonInputClass}
            placeholder="Value"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={(filter.value as number) || ''}
            onChange={handleValueChange}
            className={commonInputClass}
            placeholder="Value"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={filter.value ? (filter.value as string).split('T')[0] : ''}
            onChange={handleValueChange}
            className={commonInputClass}
          />
        );
      case 'select':
        return (
          <select
            value={(filter.value as string) || ''}
            onChange={handleValueChange}
            className={commonInputClass}
          >
            <option value="">Select</option>
            {selectedFieldConfig.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            value={(filter.value as string) || ''}
            onChange={handleValueChange}
            className={commonInputClass}
            placeholder="Value"
            disabled
          />
        );
    }
  };

  const renderValue2Input = () => {
    if (filter.condition !== 'between' || !selectedFieldConfig) return null;
    const commonInputClass =
      'bg-[#F4F4F4] text-sm mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00A78B] focus:border-[#00A78B] sm:text-sm';

    switch (selectedFieldConfig.type) {
      case 'number':
        return (
          <input
            type="number"
            value={(filter.value2 as number) || ''}
            onChange={handleValue2Change}
            className={commonInputClass}
            placeholder="Value"
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={filter.value2 ? (filter.value2 as string).split('T')[0] : ''}
            onChange={handleValue2Change}
            className={commonInputClass}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-sm flex gap-2 items-end p-3 border-b border-gray-200 w-full">
      <div className="md:col-span-1">
        {/* <label className="block text-sm font-medium text-gray-700">Field</label> */}
        <select
          value={filter.field}
          onChange={handleFieldChange}
          className="text-sm bg-[#F4F4F4] placeholder:text-[#B3B3B3] mt-1 block py-2 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00A78B] focus:border-[#00A78B] sm:text-sm"
        >
          <option value="">Select Field</option>
          {filterableFields.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-1">
        {/* <label className="block text-sm font-medium text-gray-700">Condition</label> */}
        <select
          value={filter.condition}
          onChange={handleConditionChange}
          disabled={!filter.field}
          className="bg-[#F4F4F4] placeholder:text-[#B3B3B3] w-fit mt-1 block py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Condition</option>
          {availableConditions.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className={`min-w-[120px] ${!selectedFieldConfig || !filter.condition ? 'hidden' : ''}`}>
        {renderValueInput()}
      </div>
      {filter.condition === 'between' && <div className="min-w-[120px]">{renderValue2Input()}</div>}
      <div className={`md:col-span-1 flex items-end `}>
        <button
          onClick={() => onRemove(filter.id)}
          className={`p-2 text-red-500 hover:text-red-700 ${!selectedFieldConfig ? 'hidden' : ''}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
