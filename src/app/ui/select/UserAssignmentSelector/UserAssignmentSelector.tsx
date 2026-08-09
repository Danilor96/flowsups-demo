import React, { useState, useRef, useEffect } from 'react';
import { SelectDropIcon, XIcon } from '../../icons/Icons';
import { User } from '@/app/libs/definitions';
import { getColorFromName, getInitials } from './utils';
import { UserListSearch } from './UserListSearch';
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

interface UserAssignmentSelectProps {
  users: User[];
  defaultValue?: string[];
  label?: string;
  width?: string;
  bgColor?: string;
  isMultiSelect?: boolean;
  onChange: (selectedIds: string[]) => void;
  enableFloating?: boolean;
}

export default function UserAssignmentSelect({
  users,
  defaultValue = [],
  label,
  width = 'w-full',
  bgColor = '#F4F4F4',
  isMultiSelect = true,
  onChange,
  enableFloating = false,
}: UserAssignmentSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [currentPlacement, setCurrentPlacement] = useState<Placement>('bottom-start');

  const previousDefaultValue = useRef(JSON.stringify(defaultValue));

  useEffect(() => {
    const currentDefaultStr = JSON.stringify(defaultValue);
    if (previousDefaultValue.current !== currentDefaultStr) {
      setSelectedIds(defaultValue);
      previousDefaultValue.current = currentDefaultStr;
    }
  }, [defaultValue]);

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
      setIsOpen(open);
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

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (!enableFloating && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  useEffect(() => {
    onChange(selectedIds);
  }, [selectedIds]);

  const toggleUser = (id: string) => {
    if (!isMultiSelect) {
      setSelectedIds((prev) => (prev.includes(id) ? [] : [id]));
      setIsOpen(false);
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const removeUser = (e: any, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) => prev.filter((uid) => uid !== id));
  };

  const selectedUsers = users.filter((user: User) => selectedIds.includes(user.id.toString()));

  return (
    <div className={`relative flex flex-col w-full`} ref={dropdownRef}>
      {label && (
        <label
          htmlFor={label ? label : ''}
          className="w-fit text-[1.626852vh] font-medium text-[#B3B3B3] mt-0 mb-[1.2vh]"
        >
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        ref={enableFloating ? refs.setReference : undefined}
        {...(enableFloating ? getReferenceProps() : {})}
        className={`${width} bg-[${bgColor}] ${label ? '' : ''} min-h-[42px] border rounded-xl cursor-pointer flex items-center justify-between 
          px-3 py-2 transition-all shadow-sm
          ${isOpen ? 'border-teal-500 ring-2 ring-teal-100 shadow-teal-100' : 'border-slate-200 hover:border-teal-300'}
        `}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {selectedUsers.length === 0 ? (
            <span className="text-slate-400 flex items-center gap-2 text-sm font-medium">
              <AddUserIcon size={2} />
              Select...
            </span>
          ) : (
            selectedUsers.map((user) => {
              const userName = `${user.name || ''} ${user.last_name || ''}`;
              return (
                <span
                  key={user.id}
                  className="inline-flex items-center gap-1 bg-teal-50 border border-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium animate-in fade-in zoom-in duration-200"
                >
                  <div
                    className={`w-4 h-4 rounded-full ${getColorFromName(
                      `${userName}`,
                    )} text-white flex items-center justify-center text-[8px]`}
                  >
                    {getInitials(userName)}
                  </div>
                  {userName}
                  <button
                    onClick={(e) => removeUser(e, user.id.toString())}
                    className="hover:bg-teal-200 rounded-full p-0.5 ml-1 text-teal-400 hover:text-teal-700 transition-colors"
                  >
                    <XIcon width={10} height={10} />
                  </button>
                </span>
              );
            })
          )}
        </div>
        <div className="flex items-center text-slate-400 pl-2 border-l border-slate-300 ml-1 h-6">
          <div
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-600' : ''}`}
          >
            <SelectDropIcon color={isOpen ? '#14b8a6' : undefined} />
          </div>
        </div>
      </div>
      {isOpen && (
        <>
          {enableFloating ? (
            <FloatingPortal>
              <FloatingFocusManager context={context} modal={false}>
                <div
                  ref={refs.setFloating}
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                    width: 'w-full',
                    minWidth: '340px',
                    maxWidth: '600px',
                    zIndex: 9999,
                  }}
                  {...getFloatingProps()}
                  className="bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                >
                  <UserListSearch users={users} selectedIds={selectedIds} toggleUser={toggleUser} />
                  {/* Footer */}
                  <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
                    <span className="text-slate-500 px-2 font-medium">
                      <span className="text-teal-600 font-bold">{selectedIds.length}</span> selected
                    </span>
                    {selectedIds.length > 0 && (
                      <button
                        onClick={() => setSelectedIds([])}
                        className="text-slate-500 hover:text-teal-700 font-medium px-2 py-1 rounded hover:bg-teal-100 transition-colors"
                      >
                        Remove {`${isMultiSelect ? 'All' : ''}`}
                      </button>
                    )}
                  </div>
                </div>
              </FloatingFocusManager>
            </FloatingPortal>
          ) : (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              <UserListSearch users={users} selectedIds={selectedIds} toggleUser={toggleUser} />
              {/* Footer */}
              <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
                <span className="text-slate-500 px-2 font-medium">
                  <span className="text-teal-600 font-bold">{selectedIds.length}</span> selected
                </span>
                {selectedIds.length > 0 && (
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-slate-500 hover:text-teal-700 font-medium px-2 py-1 rounded hover:bg-teal-100 transition-colors"
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

export function AddUserIcon({ size = 5.15625 }: { size: number }) {
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
