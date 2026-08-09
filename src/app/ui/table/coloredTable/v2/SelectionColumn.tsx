import { ColumnDef } from '@tanstack/react-table';
import { HTMLProps, useEffect, useRef } from 'react';

// A helper component for an indeterminate checkbox
export function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`${className} cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500`}
      {...rest}
    />
  );
}

export const selectionColumn: ColumnDef<any, any> = {
  id: 'select',
  header: ({ table }) => (
    <div className="flex items-center justify-center">
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    </div>
  ),
  cell: ({ row }) => (
    <div className="flex items-center justify-center">
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    </div>
  ),
  size: 50,
};
