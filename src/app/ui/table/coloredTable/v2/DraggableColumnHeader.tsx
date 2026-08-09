import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column, Header, flexRender } from '@tanstack/react-table';
import { FilterPopover } from './FilterPopover';

interface DraggableColumnHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
  table: any;
  rowSpan?: number;
  headerTextCenter?: boolean;
  headerBorder?: boolean;
  autosizeColumn: (columnId: string) => void;
}

export const DraggableColumnHeader = <TData, TValue>({
  header,
  table,
  rowSpan,
  headerTextCenter,
  headerBorder = false,
  autosizeColumn,
}: DraggableColumnHeaderProps<TData, TValue>) => {
  const isSelectColumn = header.column.id === 'select';
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: header.column.id,
    disabled: isSelectColumn,
    data: {
      parentId: (header.column.columnDef.meta as any)?.parentId,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    // opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
    width: header.getSize(),
    textAlign: headerTextCenter ? 'center' : undefined,
    border: headerBorder ? '1.5px solid #FFFFFF' : undefined, //#92CEC3
    // verticalAlign: rowSpan && rowSpan > 1 ? 'middle' : undefined,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      colSpan={header.colSpan}
      data-header-id={header.column.id}
      rowSpan={rowSpan}
      className={`relative px-4 py-2 text-left/ transition-shadow ${
        isDragging ? 'shadow-lg bg-white/80 text-gray-500' : ''
      }`}
    >
      {header.isPlaceholder ? null : (
        <div
          {...attributes}
          {...listeners}
          style={{ justifyContent: headerTextCenter ? 'center' : undefined }}
          className={`flex items-center justify-between truncate w-fit/ ${
            !isSelectColumn ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
          onClick={header.column.getToggleSortingHandler()}
        >
          <div className="w-fit flex text-center bg-blue-100/" data-header-content-id={header.column.id}>
            {flexRender(header.column.columnDef.header, header.getContext())}
            <div className="ml-2 flex items-center">
              {{
                asc: <ArrowUpIcon width={1.3} height={3} />,
                desc: <ArrowUpIcon down  width={1.3} height={3} />,
              }[header.column.getIsSorted() as string] ?? null}
              {header.column.getCanFilter() && (
                <div onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
                  <FilterPopover
                    column={header.column}
                    // onClose={() => setActivePopover(null)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* El manejador de redimensionamiento */}
      {!isSelectColumn && (
        <div
          {...{
            // onDoubleClick: () => header.column.resetSize(),
            onDoubleClick: () => autosizeColumn(header.column.id),
            onMouseDown: header.getResizeHandler(),
            onTouchStart: header.getResizeHandler(),
            className: `resizer absolute top-1.5 right-0 w-[0.20rem] h-[70%] h-[70vh]/ bg-[#C9EBE6] cursor-col-resize select-none touch-none ${
              header.column.getIsResizing() ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`,
            style: {
              // Estilo visual mientras se redimensiona
              transform:
                table.options.columnResizeMode === 'onEnd' && header.column.getIsResizing()
                  ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
                  : '',
            },
          }}
        />
      )}
    </th>
  );
};

const ArrowUpIcon = ({ down, width, height }: { down?: boolean, width?: number, height?: number }) => (
  <svg
    style={{ transform: down ? 'rotate(180deg)' : '' }}
    xmlns="http://www.w3.org/2000/svg"
    width={width ? `${width}vw` : '24px'}
    height={height ? `${height}vh` : '24px'}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-up"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 5l0 14" />
    <path d="M18 11l-6 -6" />
    <path d="M6 11l6 -6" />
  </svg>
);
