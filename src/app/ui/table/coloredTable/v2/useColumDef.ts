import { useCan } from '@/hooks/permissions';
import { ColumnDef, createColumnHelper, FilterFn } from '@tanstack/react-table';
import { useMemo } from 'react';

// --- Función de Filtro Personalizada para Números ---
const numberFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  const rowValue: number = row.getValue(columnId);
  if (rowValue === null || rowValue === undefined) return false;

  const { value, condition = 'equals' } = filterValue;
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return true;

  switch (condition) {
    case 'equals':
      return rowValue === numValue;
    case 'does_not_equal':
      return rowValue !== numValue;
    case 'greater_than':
      return rowValue > numValue;
    case 'greater_than_or_equal_to':
      return rowValue >= numValue;
    case 'less_than':
      return rowValue < numValue;
    case 'less_than_or_equal_to':
      return rowValue <= numValue;
    default:
      return true;
  }
};

// --- Función de Filtro Personalizada para Fechas ---
const dateFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  const rowValue: string | Date = row.getValue(columnId);
  if (!rowValue) return false;

  const { value, condition = 'is' } = filterValue;
  if (!value) return true;

  const rowDate = new Date(rowValue);
  const filterDate = new Date(value);

  switch (condition) {
    case 'is':
      return rowDate.getTime() === filterDate.getTime();
    case 'is_not':
      return rowDate.getTime() !== filterDate.getTime();
    case 'is_after':
      return rowDate.getTime() > filterDate.getTime();
    case 'is_before':
      return rowDate.getTime() < filterDate.getTime();
    default:
      return true;
  }
};

const formatHeaderText = (columnId: string) => {
  if (columnId.includes('_')) {
    return columnId
      .split('_')
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(' ');
  }
  return `${columnId.charAt(0).toUpperCase()}${columnId.slice(1)}`;
};

/**
 * Hook to generate dynamic table columns based on an object of column IDs
 * and their respective visibility states.
 *
 * @param {Object} initialColumnsDef - An object where the key is the column ID and
 * the value is a boolean indicating the column's visibility state.
 * @returns {Object} An object containing a single property, columns, which is an array
 * of ColumnDef objects.
 */
export const useDynamicTableColumns = <T, K extends { [key: string]: boolean }>({
  initialColumnsDef,
  excludeKeys = ['id'],
  columnStyles,
  disableTruncateOnColumns = [],
  hideHeaderFor = [],
  columnGroups = {},
  columnRenderers,
  sortableColumns,
  filterableColumns,
  disabledSortColumns,
  permissionsById,
  accessorFnMapper,
  columnDataTypes = {},
  dynamicRenderVariable,
}: {
  initialColumnsDef: K;
  columnDataTypes?: { [P in keyof K]?: string };
  excludeKeys?: (keyof K | 'id')[];
  columnStyles?: { [P in keyof K]?: { size?: number; minSize?: number; maxSize?: number } };
  disableTruncateOnColumns?: (keyof K | 'id')[];
  hideHeaderFor?: (keyof K | 'id')[];
  columnGroups?: { [groupHeader: string]: string[] };
  columnRenderers?: {
    [columnId: string]: (value: any) => React.ReactNode | string | number | boolean | Date;
  };
  sortableColumns?: (keyof K | 'id')[];
  filterableColumns?: (keyof K | 'id')[];
  disabledSortColumns?: (keyof K | 'id')[];
  permissionsById?: { [id: string]: number[] };
  accessorFnMapper?: { [P in keyof K]?: (row: T) => any };
  dynamicRenderVariable?: any;
}) => {
  const { can } = useCan();

  const result: { columns: ColumnDef<any>[]; columnVisibility: { [key: string]: boolean } } =
    useMemo(() => {
      const columnHelper = createColumnHelper<any>();
      const allColumnKeys = Object.keys(initialColumnsDef).filter(
        (key) => !excludeKeys.includes(key),
      );

      const allColumnKeysFilteredByPermissions = allColumnKeys.filter((key) => {
        const requiredPermissions = permissionsById?.[key];
        if (!requiredPermissions) return true;

        return can(requiredPermissions);
      });
      console.log('allKeyFiltered: ', allColumnKeysFilteredByPermissions);
      const columnVisibility: { [key: string]: boolean } = {};
      allColumnKeysFilteredByPermissions.forEach((key) => {
        columnVisibility[key] = initialColumnsDef[key];
      });
      console.log('columnVisi from hook: ', columnVisibility);

      const resultColumns: ColumnDef<any>[] = [];
      const processedColumns = new Set<string>();

      // Helper para crear una definición de columna individual
      const createColumn = (columnId: string, parentId?: string) => {
        processedColumns.add(columnId);

        const isSortable = (columnId: string) => {
          if (sortableColumns) return sortableColumns.includes(columnId);
          if (disabledSortColumns) return !disabledSortColumns.includes(columnId);
          return true;
        };
        const isFilterable =
          (filterableColumns ? filterableColumns.includes(columnId) : true) && !disabledSortColumns?.includes(columnId);
        const dataType = columnDataTypes?.[columnId] || 'text';

        let filterFn: FilterFn<any> | 'includesString' | undefined;
        switch (dataType) {
          case 'number':
            filterFn = numberFilterFn;
            break;
          case 'date':
            filterFn = dateFilterFn;
            break;
          case 'text':
            filterFn = 'includesString';
            break;
          default:
            filterFn = 'includesString';
        }

        const accessor = accessorFnMapper?.[columnId] || columnId;
        return columnHelper.accessor(accessor, {
          id: columnId,
          header: hideHeaderFor.includes(columnId) ? '' : formatHeaderText(columnId),
          cell: (info) => {
            const hasColumnRenderer = columnRenderers && columnRenderers[columnId];
            const value = hasColumnRenderer ? info.row.original : info.getValue();
            const renderer = columnRenderers?.[columnId];
            return columnRenderers && renderer ? renderer(value) : value;
          },
          minSize: columnStyles?.[columnId]?.minSize,
          size: columnStyles?.[columnId]?.size,
          maxSize: columnStyles?.[columnId]?.maxSize,
          enableResizing: true,
          enableSorting: isSortable(columnId),
          enableColumnFilter: isFilterable,
          sortingFn: 'auto',
          filterFn: isFilterable ? filterFn : undefined,
          meta: {
            disableTruncate: disableTruncateOnColumns.includes(columnId),
            parentId,
            dataType,
          },
        });
      };

      // return columnsToDisplay.map(columnId => {
      //   return {
      //     id: columnId,
      //     accessorKey: columnId,
      //     header: () => {
      //       if (hideHeaderFor.includes(columnId)) return '';
      //       return formatHeaderText(columnId);
      //     },
      //     cell: info => info.getValue(),
      //     minSize: columnStyles?.[columnId]?.minSize,
      //     size: columnStyles?.[columnId]?.size,
      //     maxSize: columnStyles?.[columnId]?.maxSize,
      //     enableResizing: true,
      //     meta: { disableTruncate: disableTruncateOnColumns.includes(columnId) },
      //   };
      // });

      // Mapeo para encontrar rápidamente a qué grupo pertenece una columna
      const columnToGroupMap = new Map<string, string>();
      for (const groupHeader in columnGroups) {
        for (const columnId of columnGroups[groupHeader]) {
          columnToGroupMap.set(columnId, groupHeader);
        }
      }

      allColumnKeysFilteredByPermissions.forEach((columnId: string) => {
        if (processedColumns.has(columnId)) {
          return; // Ya fue procesada dentro de un grupo
        }

        const groupHeader = columnToGroupMap.get(columnId);

        // Asegurarse de que solo se cree un grupo si tiene MÁS de una columna,
        if (groupHeader && (columnGroups[groupHeader].length > 1 || groupHeader !== columnId)) {
          // Esta columna pertenece a un grupo
          const groupColumns = columnGroups[groupHeader];
          resultColumns.push(
            columnHelper.group({
              id: groupHeader,
              header: hideHeaderFor.includes(groupHeader) ? '' : formatHeaderText(groupHeader),
              columns: groupColumns.map((id) => createColumn(id, groupHeader)),
              size: columnStyles?.[groupHeader]?.size,
              // enableResizing: true,
              meta: { isGroup: true },
            }),
          );
        } else {
          // Es una columna individual
          resultColumns.push(createColumn(columnId));
        }
      });

      return { columns: resultColumns, columnVisibility };
    }, [dynamicRenderVariable]);

  return { columns: result.columns, columnVisibility: result.columnVisibility };
};
