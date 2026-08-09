import { FilterIcon, FilterIconBtn } from '@/app/ui/icons/Icons';
import { Input } from '@/app/ui/inputs/Input';
import {
  FloatingFocusManager,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react';
import { Column } from '@tanstack/react-table';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useRef, useState } from 'react';

export const FilterPopover = ({ column }: { column: Column<any, any> }) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState<{
    followUpDateInput: string;
    followUpDateTimeInput: string;
  }>({
    followUpDateInput: '',
    followUpDateTimeInput: '',
  });

  // 1. Configuración de Floating UI para la posición y el contexto
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start', // Puedes cambiar la posición aquí
  });

  // 2. Hooks de interacción para controlar cuándo se abre y se cierra el popover
  const click = useClick(context);
  const dismiss = useDismiss(context);

  // 3. Combina las interacciones en props que se pueden pasar a los elementos
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const dataType = (column.columnDef.meta as any)?.dataType || 'text';
  const filterValue = column.getFilterValue() as any;

  const currentCondition = dataType === 'text' ? '' : filterValue?.condition || (dataType === 'date' ? 'is' : 'equals');
  const currentValue = dataType === 'text' ? filterValue ?? '' : filterValue?.value ?? '';

  const setFilter = (value: any, condition?: string) => {
    if (dataType === 'text') {
      column.setFilterValue(value || undefined); // Pass undefined to clear the filter
    } else {
      // If a condition is being set, we should always set the filter value object,
      // even if the value is empty. The filter functions are designed to handle this.
      if (condition) {
        column.setFilterValue({ value, condition });
        return;
      }

      // If only a value is being set, and it's empty, clear the filter.
      if (value === '' || value === null || value === undefined) {
        column.setFilterValue(undefined);
      } else {
        column.setFilterValue({ value, condition: condition || currentCondition });
      }
    }
  };

  return (
    <>
      <div
        className="relative"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <button
          className="p-1 hover:bg-slate-300 rounded"
        >
          {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg> */}
          <FilterIcon width="1" height="1.8" />
        </button>
        {column.getFilterValue() !== undefined && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-amber-300" />
        )}
      </div>
      <FloatingPortal preserveTabOrder>
        {isOpen && (
          // FloatingFocusManager mejora la accesibilidad al gestionar el foco
          <FloatingFocusManager context={context} modal={false}>
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className="z-[100] w-full">
              <div
                ref={popoverRef}
                className="absolute top-0 pt-4 bg-white border border-gray-300 rounded-md shadow-lg z-30 p-4"
              >
                {/* <h4 className="font-bold mb-2 text-gray-800">Filter</h4> */}
                {dataType === 'text' && (
                  <input
                    type="text"
                    value={currentValue}
                    onChange={e => {
                      e.stopPropagation();
                      setFilter(e.target.value)
                    }}
                    placeholder="Filter..."
                    className="w-full text-sm font-normal border border-gray-300 rounded p-2 text-black"
                  />
                )}
                {dataType === 'number' && (
                  <div className="space-y-2">
                    <select
                      value={currentCondition}
                      onChange={e => setFilter(currentValue, e.target.value)}
                      className="w-full text-sm font-normal border border-gray-300 rounded p-2 text-black"
                    >
                      <option value="equals">Equals</option>
                      <option value="does_not_equal">Does not equal</option>
                      <option value="greater_than">Greater than</option>
                      <option value="greater_than_or_equal_to">Greater than or equal to</option>
                      <option value="less_than">Less than</option>
                      <option value="less_than_or_equal_to">Less than or equal to</option>
                    </select>
                    <input
                      type="number"
                      value={currentValue}
                      onChange={e => setFilter(e.target.value)}
                      placeholder="Value..."
                      className="w-full text-sm font-normal border border-gray-300 rounded p-2 text-black"
                    />
                  </div>
                )}
                {dataType === 'date' && (
                  <div className="space-y-2">
                    <select
                      value={currentCondition}
                      onChange={e => {
                        e.stopPropagation();
                        setFilter(currentValue, e.target.value);
                      }}
                      className="w-full text-sm font-normal border border-gray-300 rounded p-2 text-black"
                    >
                      <option value="is">Is</option>
                      <option value="is_not">Is not</option>
                      <option value="is_after">Is after</option>
                      <option value="is_before">Is before</option>
                    </select>
                    <Input
                      label=""
                      type="DottedDate"
                      name="date-filter"
                      value={inputs.followUpDateInput}
                      timeDataValue={inputs.followUpDateTimeInput}
                      onDayPickerClick={date => {
                        const newDate = currentValue ? new Date(currentValue) : new Date();
                        newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                        setFilter(newDate.toISOString());
                        setInputs(prevState => ({
                          ...prevState,
                          followUpDateInput: formatIncomingObjectDate(date),
                        }));
                      }}
                      onTimeChanged={e => {
                        const time = e.target.value;
                        if (!time) {
                          const newDate = currentValue ? new Date(currentValue) : new Date();
                          newDate.setHours(0, 0, 0, 0);
                          setFilter(newDate.toISOString());
                          return;
                        }
                        const [hour, minutes, period] = time.split(/:| /);
                        let h = parseInt(hour, 10);
                        if (period?.toLowerCase() === 'pm' && h !== 12) h += 12;
                        if (period?.toLowerCase() === 'am' && h === 12) h = 0;

                        const newDate = currentValue ? new Date(currentValue) : new Date();
                        newDate.setHours(h, parseInt(minutes, 10), 0, 0);
                        setFilter(newDate.toISOString());
                        setInputs(prevState => ({
                          ...prevState,
                          followUpDateTimeInput: time,
                          followUpDateInput: inputs.followUpDateInput
                            ? `${inputs.followUpDateInput.split(',')[0]}, ${time}`
                            : inputs.followUpDateInput,
                        }));
                      }}
                      onChange={() => {}}
                      width={0}
                      height={5}
                      fontSize={1.8}
                      fetchTimeData={true}
                      dontCloseDatePickerAfterPick={true}
                    />
                  </div>
                )}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    column.setFilterValue(undefined);
                    setInputs({ followUpDateInput: '', followUpDateTimeInput: '' });
                    setIsOpen(false);
                  }}
                  className="text-xs text-blue-500 mt-2 hover:underline"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
};

function formatIncomingObjectDate(date: Date | null | undefined) {
  if (date && typeof date !== 'undefined' && date !== null) {
    const dateFormatted = format(date, 'MM/dd/yyyy', { locale: enUS });

    return dateFormatted;
  } else {
    return '';
  }
}
