import React, { useState, useRef, useEffect } from 'react';
import { SelectDropIcon, XIcon, CheckedIcon } from '../../icons/Icons';
import { GenericListSearch } from './GenericListSearch';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  Placement,
} from '@floating-ui/react';

export interface GenericSelectorProps<T> {
  options: T[];
  selectedIds?: string[];
  defaultValue?: string[];
  label?: string;
  width?: string;
  optionsWidth?: string;
  bgColor?: string;
  isMultiSelect?: boolean;
  onChange: (selectedIds: string[]) => void;
  enableFloating?: boolean;
  placeholder?: string;
  capitalWords?: boolean;
  getOptionId: (option: T) => string;
  getOptionLabel: (option: T) => string;
  moveSelectedToTop?: boolean;
  disabled?: boolean;
  open?: boolean;

  // Render props
  renderOption?: (option: T, isSelected: boolean, toggle: () => void) => React.ReactNode;
  renderTrigger?: (
    selectedOptions: T[],
    removeOption: (e: React.MouseEvent, id: string) => void,
  ) => React.ReactNode;
  children?: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
  disableRemove?: boolean;
  loading?: boolean;
  getSearchLabel?: (option: T) => string;
}

export function GenericSelector<T>({
  options,
  selectedIds,
  defaultValue = [],
  label,
  width = 'w-full',
  optionsWidth = 'w-full',
  bgColor = '#F4F4F4',
  isMultiSelect = true,
  onChange,
  enableFloating = false,
  placeholder = 'Select...',
  getOptionId,
  getOptionLabel,
  renderOption,
  renderTrigger,
  capitalWords,
  moveSelectedToTop = false,
  disabled = false,
  open: controlledOpen,
  children,
  onOpenChange,
  disableRemove = false,
  loading = false,
  getSearchLabel,
}: GenericSelectorProps<T>) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlledOpen = controlledOpen !== undefined;
  const isOpen = isControlledOpen ? controlledOpen : internalIsOpen;
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(defaultValue);
  const isControlled = selectedIds !== undefined;
  const currentSelectedIds = selectedIds !== undefined ? selectedIds : internalSelectedIds;

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [currentPlacement, setCurrentPlacement] = useState<Placement>('bottom-start');

  // Floating UI configuration
  const {
    x,
    y,
    strategy,
    refs,
    context,
    placement: computedPlacement,
  } = useFloating({
    open: isOpen,
    onOpenChange: (open) => {
      if (!isControlledOpen) {
        setInternalIsOpen(open);
      }
      onOpenChange?.(open);
      if (!open) {
        // Reset to default when closing so next open calculates freshly
        setCurrentPlacement('bottom-start');
      }
    },
    middleware: [offset(10), flip({ fallbackAxisSideDirection: 'end' }), shift()],
    whileElementsMounted: autoUpdate,
    placement: currentPlacement,
  });

  // stick to the computed placement to avoid flipping during resize
  useEffect(() => {
    if (isOpen && computedPlacement !== currentPlacement) {
      setCurrentPlacement(computedPlacement);
    }
  }, [isOpen, computedPlacement, currentPlacement]);

  const dismiss = useDismiss(context, { enabled: !!enableFloating });
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  // Click outside listener for non-floating mode
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (!enableFloating && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (!isControlledOpen) {
          setInternalIsOpen(false);
        }
        onOpenChange?.(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef, enableFloating]);

  useEffect(() => {
    if (!isControlled) {
      onChange(internalSelectedIds);
    }
  }, [internalSelectedIds, isControlled, onChange]);

  const toggleOption = (id: string) => {
    let newIds: string[];
    if (!isMultiSelect) {
      newIds = currentSelectedIds.includes(id) ? [] : [id];
      if (!isControlledOpen) {
        setInternalIsOpen(false);
      }
      onOpenChange?.(false);
    } else {
      newIds = currentSelectedIds.includes(id)
        ? currentSelectedIds.filter((uid) => uid !== id)
        : [...currentSelectedIds, id];
    }

    if (!isControlled) {
      setInternalSelectedIds(newIds);
    }
    onChange(newIds);
  };

  const removeOption = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newIds = currentSelectedIds.filter((uid) => uid !== id);
    if (!isControlled) {
      setInternalSelectedIds(newIds);
    }
    onChange(newIds);
  };

  const selectedOptions = options.filter((opt) => currentSelectedIds.includes(getOptionId(opt)));

  // Default Renderers
  const defaultRenderOption = (option: T, isSelected: boolean, toggle: () => void) => (
    <div
      onClick={toggle}
      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-150 mb-1 ${
        isSelected
          ? 'bg-teal-50 border border-teal-100'
          : 'hover:bg-slate-50 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span
            className={`text-sm font-medium ${isSelected ? 'text-teal-800' : 'text-slate-700'}`}
          >
            {getOptionLabel(option)}
          </span>
        </div>
      </div>
      <div
        className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-200 ${
          isSelected
            ? 'bg-teal-600 text-white shadow-sm scale-100'
            : 'bg-slate-100 text-transparent scale-90 group-hover:bg-slate-200'
        }`}
      >
        {isSelected && <CheckedIcon color="white" />}
      </div>
    </div>
  );

  const defaultRenderTrigger = (
    selected: T[],
    remove: (e: React.MouseEvent, id: string) => void,
  ) => (
    <>
      {selected.length === 0 ? (
        <span className="text-slate-400 flex items-center gap-2 text-sm font-medium">
          {placeholder}
        </span>
      ) : (
        selected.map((opt) => {
          const id = getOptionId(opt);
          const label = getOptionLabel(opt);
          return (
            <span
              key={id}
              className={`inline-flex capitalize items-center gap-1 text-[1.626852vh] font-medium animate-in fade-in zoom-in duration-200 ${isMultiSelect ? 'bg-teal-50 border border-teal-100 text-teal-800 px-1 py-1/ rounded-full' : 'text-[#585858]'}`}
            >
              {label}
              {!disableRemove && (
                <button
                  onClick={(e) => remove(e, id)}
                  className="hover:bg-teal-200 rounded-full p-0.5 ml-1 text-teal-400 hover:text-teal-700 transition-colors"
                  type="button"
                >
                  <XIcon width={10} height={10} />
                </button>
              )}
            </span>
          );
        })
      )}
    </>
  );

  const _renderOption = renderOption || defaultRenderOption;
  const _renderTrigger = renderTrigger || defaultRenderTrigger;

  return (
    <div className={`relative flex flex-col w-full`} ref={dropdownRef}>
      {label && (
        <label htmlFor={label ? label : ''} className="w-fit text-[1.626852vh] font-medium text-[#B3B3B3]">
          {label}
        </label>
      )}
      <div
        onClick={() => {
          if (!disabled) {
            const nextOpen = !isOpen;
            if (!isControlledOpen) {
              setInternalIsOpen(nextOpen);
            }
            onOpenChange?.(nextOpen);
          }
        }}
        ref={enableFloating ? refs.setReference : undefined}
        {...(enableFloating ? getReferenceProps() : {})}
        className={`${width} bg-[${bgColor}] ${label ? 'mt-[1.2vh]' : ''} min-h-[42px] border rounded-xl flex items-center justify-between 
          px-3 py-2 transition-all shadow-sm
          ${disabled ? 'bg-slate-50 cursor-not-allowed border-slate-200' : 'cursor-pointer'}
          ${!disabled && isOpen ? 'border-teal-500 ring-2 ring-teal-100 shadow-teal-100' : 'border-slate-200'}
          ${!disabled && !isOpen ? 'hover:border-teal-300' : ''}
        `}
      >
        <div className="flex flex-wrap gap-2 items-center">{_renderTrigger(selectedOptions, removeOption)}</div>
        <div className="flex items-center text-slate-400 pl-2 border-l border-slate-300 ml-1 h-6">
          <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-600' : ''}`}>
            <SelectDropIcon color={isOpen ? '#14b8a6' : undefined} />
          </div>
        </div>
      </div>
      {isOpen && (
        <>
          {enableFloating ? (
            <FloatingPortal>
              <div className="floating-portal-container">
                <FloatingFocusManager context={context} modal={false}>
                  <div
                    ref={refs.setFloating}
                    style={{
                      position: strategy,
                      top: y ?? 0,
                      left: x ?? 0,
                      width: 'max-content',
                      maxWidth: '50rem',
                      zIndex: 9999,
                    }}
                    {...getFloatingProps()}
                    className={`bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden ${width}`}
                  >
                    {children ? (
                      children
                    ) : (
                      <GenericListSearch
                        capitalWords={capitalWords}
                        options={options}
                        selectedIds={currentSelectedIds}
                        toggleOption={toggleOption}
                        getOptionId={getOptionId}
                        getOptionLabel={getOptionLabel}
                        renderOption={_renderOption}
                        moveSelectedToTop={moveSelectedToTop}
                        loading={loading}
                        getSearchLabel={getSearchLabel}
                      />
                    )}
                    {/* Footer */}
                    <div
                      className={`${children ? 'hidden' : ''} p-2 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs`}
                    >
                      <span className="text-slate-500 px-2 font-medium">
                        <span className="text-teal-600 font-bold">{currentSelectedIds.length}</span> selected
                      </span>
                      {currentSelectedIds.length > 0 && !disableRemove && (
                        <button
                          onClick={() => {
                            if (!isControlled) setInternalSelectedIds([]);
                            onChange([]);
                          }}
                          className="text-slate-500 hover:text-teal-700 font-medium px-2 py-1 rounded hover:bg-teal-100 transition-colors"
                          type="button"
                        >
                          Remove {`${isMultiSelect ? 'All' : ''}`}
                        </button>
                      )}
                    </div>
                  </div>
                </FloatingFocusManager>
              </div>
            </FloatingPortal>
          ) : (
            <div
              className={`${optionsWidth} absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden`}
            >
              {children ? (
                children
              ) : (
                <GenericListSearch
                  options={options}
                  selectedIds={currentSelectedIds}
                  toggleOption={toggleOption}
                  getOptionId={getOptionId}
                  getOptionLabel={getOptionLabel}
                  renderOption={_renderOption}
                  moveSelectedToTop={moveSelectedToTop}
                  loading={loading}
                  getSearchLabel={getSearchLabel}
                />
              )}
              {/* Footer */}
              <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
                <span className="text-slate-500 px-2 font-medium">
                  <span className="text-teal-600 font-bold">{currentSelectedIds.length}</span> selected
                </span>
                {currentSelectedIds.length > 0 && !disableRemove && (
                  <button
                    onClick={() => {
                      if (!isControlled) setInternalSelectedIds([]);
                      onChange([]);
                    }}
                    className="text-slate-500 hover:text-teal-700 font-medium px-2 py-1 rounded hover:bg-teal-100 transition-colors"
                    type="button"
                  >
                    Remove {`${isMultiSelect ? 'All' : ''}`}
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function AddIcon({ size = 5.15625 }: { size: number }) {
  return (
    <svg
      width={size + 'vw'}
      height={size + 'vh'}
      viewBox="0 0 99 73"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M63 45.625C50.985 45.625 27 51.6931 27 63.875V73H99V63.875C99 51.6931 75.015 45.625 63 45.625ZM22.5 27.375V13.6875H13.5V27.375H0V36.5H13.5V50.1875H22.5V36.5H36V27.375M63 36.5C67.7739 36.5 72.3523 34.5772 75.7279 31.1547C79.1036 27.7322 81 23.0902 81 18.25C81 13.4098 79.1036 8.76784 75.7279 5.3453C72.3523 1.92276 67.7739 0 63 0C58.2261 0 53.6477 1.92276 50.2721 5.3453C46.8964 8.76784 45 13.4098 45 18.25C45 23.0902 46.8964 27.7322 50.2721 31.1547C53.6477 34.5772 58.2261 36.5 63 36.5Z"
        fill="#00A78B"
      />
    </svg>
  );
}
