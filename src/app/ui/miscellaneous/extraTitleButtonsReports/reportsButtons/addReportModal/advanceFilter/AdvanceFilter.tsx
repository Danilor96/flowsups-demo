import { useState } from 'react';
import { AdvanceFilterRow } from './advanceFilterRow/AdvanceFilterRow';
import { ContainerSection } from '../containerSection/ContainerSection';
import { FilterableField } from '@/store/customerList/types';

export function AdvanceFilter({ filterableFields }: { filterableFields: FilterableField[] }) {
  // ----- global states -----

  // ----- local states -----

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([
    { id: '0', field: '0', condition: '', value: null },
  ]);

  const updateFilter = (updatedFilter: AppliedFilter) => {
    setAppliedFilters(appliedFilters.map((f) => (f.id === updatedFilter.id ? updatedFilter : f)));
  };

  const removeFilter = (filterId: string) => {
    const newFilters = appliedFilters.filter((f) => f.id !== filterId);
    if (newFilters.length === 0) {
      newFilters.push({ id: '0', field: '0', condition: '', value: null });
    }
    setAppliedFilters(newFilters);
  };

  return (
    <ContainerSection title="Advanced Filter">
      {appliedFilters.map((el, index) => (
        <AdvanceFilterRow
          key={`------${index}|||advancefil`}
          filter={el}
          filterableFields={filterableFields}
          onUpdate={updateFilter}
          onRemove={removeFilter}
        />
      ))}
    </ContainerSection>
  );
}
