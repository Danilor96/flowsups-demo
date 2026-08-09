import React, { useState } from 'react';
import { DropdownProps } from 'react-day-picker';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  FloatingPortal,
  useDismiss,
  useInteractions
} from '@floating-ui/react';

export function CustomDayPickerDropdown(props: DropdownProps) {
  const { options, value, onChange } = props;
  const [isOpen, setIsOpen] = useState(false);

  // Floating UI setup
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
  });

  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  const handleValueChange = (newValue: string | number) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          value: newValue,
        },
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    }
    setIsOpen(false);
  };

  // Find selected option
  const selectedOption = options?.find((opt) => String(opt.value) === String(value));
  const displayLabel = selectedOption?.label || value;

  // Sort options if they look like years (heuristic: values > 1000)
  const sortedOptions = React.useMemo(() => {
    if (!options) return [];
    const isYear = options.some((o) => Number(o.value) > 1000);
    if (isYear) {
      return [...options].sort((a, b) => Number(b.value) - Number(a.value));
    }
    return options;
  }, [options]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className="relative inline-block mx-1">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between cursor-pointer bg-white px-0 py-1 hover:border-[#00A78B] transition-colors"
          style={{ minWidth: '30px', height: '32px' }}
        >
          <span className="font-semibold text-sm text-[#00A78B] whitespace-nowrap">{displayLabel}</span>
          <span className="ml-2 text-[2.5vh] text-[#00A78B]">▼</span>
        </div>
      </div>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            {...getFloatingProps()}
            style={{
              ...floatingStyles,
              zIndex: 99999, // Ensure it sits on top of everything
            }}
            className="bg-white shadow-xl max-h-[40vh] overflow-y-auto border border-gray-200 rounded scrollbar-thin scrollbar-thumb-gray-300 min-w-[100px]"
          >
            {sortedOptions?.map(option => (
              <div
                key={option.value}
                onClick={e => {
                  e.stopPropagation();
                  handleValueChange(option.value);
                }}
                className={`px-3 py-1.5 cursor-pointer text-sm hover:bg-[#C9EBE6] hover:text-[#005f4e] whitespace-nowrap transition-colors ${
                  String(option.value) === String(value) ? 'bg-[#00A78B] text-white' : 'text-gray-700'
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
