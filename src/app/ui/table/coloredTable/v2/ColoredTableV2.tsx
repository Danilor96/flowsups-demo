import { Button } from '@/app/ui/buttons/Button';
import { GreenPrinterIcon } from '@/app/ui/icons/Icons';
import { Loader } from '@/app/ui/miscellaneous/loader/Loader';
import { PaginationControlV2 } from '@/app/ui/miscellaneous/paginationControl/v2/PaginationControl';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import {
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DraggableColumnHeader } from './DraggableColumnHeader';
import { selectionColumn } from './SelectionColumn';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { modalWindowStore } from '@/store/adminDashboard';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FilterPopover } from './FilterPopover';
import { pdfDataStore } from '@/store/pdfData';

type OverflowX = 'visible' | 'hidden' | 'scroll' | 'auto' | 'initial' | 'inherit' | 'clip';

const StaticColumnHeader = ({ header }: { header: Header<any, unknown> }) => {
  return (
    <th
      style={{ width: header.getSize() }}
      colSpan={header.colSpan}
      className="relative px-4 py-2 text-left"
    >
      <div className="flex items-center justify-between">
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>
      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={`resizer absolute top-0 right-0 w-2 h-full bg-blue-500 cursor-col-resize select-none touch-none ${
          header.column.getIsResizing() ? 'isResizing' : ''
        }`}
      />
    </th>
  );
};

interface ColoredTableV2Props<TData extends object> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  initialColumnsDef?: { [key: string]: boolean };
  initialColumnOrder?: string[];
  columnVisibility?: VisibilityState;
  columnOrder?: ColumnOrderState;
  itemsPerPage?: number;
  loading?: boolean;
  height?: number;
  width?: number;
  textColor?: string;
  fontSize?: number;
  borderColor?: string;
  heightFitContent?: boolean;
  paginationIsActive?: boolean;
  printButtonIsActive?: boolean;
  customPrint?: () => void;
  bottomNoRadius?: boolean;
  headerTrHeight?: number;
  bodyTrHeight?: number;
  headTextColor?: string;
  headerTextCenter?: boolean;
  headerBorder?: boolean;
  headBackgroundColor?: string;
  bodyFirstColor?: string;
  bodySecondColor?: string;
  bodyTextCenter?: boolean;
  paginationTextColor?: string;
  rowSelectionIsActive?: boolean;
  extraComponent?: React.ReactNode;
  relativeBodyTr?: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
  onRowClick?: (rowData: TData) => void;
  onRowDoubleClick?: (rowData: TData) => void;
  setColumnVisibility?: Dispatch<SetStateAction<VisibilityState>>;
  setColumnOrder?: Dispatch<SetStateAction<ColumnOrderState>>;
  lazyPrinting?: boolean;
  bodyTdContentHeight?: string;
  bodyTdContentOverflowX?: OverflowX;
  rowHighlightCondition?: (row: any) => boolean | string;
  highlightColor?: string;
  specialRow?: Record<string, any>;
  onVisibleDataChange?: (data: TData[]) => void;
}

interface PdfHeaderCell {
  id: string;
  content: string;
  colSpan: number;
  rowSpan: number;
  isPlaceholder?: boolean;
}
type PdfHeaderRow = PdfHeaderCell[];

interface PdfData {
  headers: PdfHeaderRow[];
  body: string[][];
  columnWidths?: number[]; // Anchos % de las columnas hoja
  maxDepth: number; // Profundidad máxima del encabezado
}

export function ColoredTableV2<TData extends object>({
  data,
  columns,
  columnVisibility,
  initialColumnsDef,
  initialColumnOrder,
  columnOrder,
  itemsPerPage = 9,
  loading,
  height = 50,
  width,
  textColor = '#000',
  headTextColor = '#FFF',
  paginationTextColor,
  fontSize,
  heightFitContent,
  paginationIsActive = false,
  printButtonIsActive = false,
  customPrint,
  headBackgroundColor = '#43B9A5',
  bodyFirstColor = '#00A78B',
  bodySecondColor = '#43B9A5',
  borderColor = '#92CEC3',
  bottomNoRadius,
  headerTrHeight,
  headerTextCenter = false,
  headerBorder = false,
  bodyTrHeight,
  bodyTextCenter = false,
  rowSelectionIsActive = false,
  relativeBodyTr = false,
  extraComponent,
  onSelectionChange,
  onRowClick,
  onRowDoubleClick,
  setColumnVisibility,
  setColumnOrder,
  bodyTdContentHeight,
  bodyTdContentOverflowX,
  lazyPrinting = false,
  rowHighlightCondition,
  highlightColor = '#FF0000',
  specialRow,
  onVisibleDataChange,
}: ColoredTableV2Props<TData>) {
  const { setPdfData } = pdfDataStore();
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: itemsPerPage, // default page size = 9
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [internalColumnVisibility, setInternalColumnVisibility] = useState<VisibilityState>({
    select: false,
    ...initialColumnsDef,
  });
  // const [internalColumnOrder, setInternalColumnOrder] = useState<ColumnOrderState>(
  //   initialColumnOrder ? initialColumnOrder : Object.keys(initialColumnsDef || {}),
  // );
  const [internalColumnOrder, setInternalColumnOrder] = useState<ColumnOrderState>(
    initialColumnOrder
      ? initialColumnOrder
      : columns.flatMap((col) =>
          'columns' in col && col.columns
            ? (col.columns as ColumnDef<TData>[]).map((subCol) => subCol.id!)
            : [col.id!],
        ),
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [activePopover, setActivePopover] = useState<{
    columnId: string;
    position: { top: number; left: number };
  } | null>(null);

  const [animationParent] = useAutoAnimate<HTMLTableSectionElement>({
    easing: 'ease-in-out',
    duration: 350,
  });

  // const [ headerRowAnimationParent ] = useAutoAnimate<HTMLTableSectionElement>({
  //   easing: 'ease-in-out',
  //   duration: 350
  // });

  // const [ bodyRowAnimationParent ] = useAutoAnimate<HTMLTableSectionElement>({
  //   easing: 'ease-in-out',
  //   duration: 350
  // });

  const columnVisibilityC = columnVisibility ? columnVisibility : internalColumnVisibility;
  const setColumnVisibilityC = setColumnVisibility
    ? setColumnVisibility
    : setInternalColumnVisibility;
  const columnOrderC = columnOrder ? columnOrder : internalColumnOrder;
  const setColumnOrderC = setColumnOrder ? setColumnOrder : setInternalColumnOrder;

  const tableRef = useRef<HTMLTableElement>(null);

  const table = useReactTable({
    data,
    columns: columns.length > 0 ? [selectionColumn as any, ...columns] : [],
    state: {
      columnVisibility: columnVisibilityC,
      columnOrder: columns.length > 0 ? ['select', ...columnOrderC] : [],
      columnSizing,
      pagination: paginationIsActive ? pagination : undefined,
      rowSelection,
      sorting,
      columnFilters,
    },
    enableRowSelection: rowSelectionIsActive,
    onRowSelectionChange: setRowSelection,
    columnResizeMode: 'onChange',
    onColumnVisibilityChange: setColumnVisibilityC,
    onColumnOrderChange: setColumnOrderC,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: paginationIsActive ? getPaginationRowModel() : undefined,
    onPaginationChange: paginationIsActive ? setPagination : undefined,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  // useEffect(() => {
  //   if (!table) return;
  //   table.getColumn('select')?.toggleVisibility(rowSelectionIsActive);
  // }, [rowSelectionIsActive]);

  useEffect(() => {
    if (onSelectionChange) {
      const selectedOriginalRows = table.getSelectedRowModel().rows.map((row) => row.original);
      onSelectionChange(selectedOriginalRows);
    }
  }, [rowSelection]);
  
  useEffect(() => {
    if (onVisibleDataChange) {
      const visibleRows = table.getPaginationRowModel().rows.map(row => row.original);
      onVisibleDataChange(visibleRows);
    }
  }, [table.getPaginationRowModel().rows, onVisibleDataChange]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  // const handleDragEnd = useCallback((event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (active && over && active.id !== over.id) {
  //     setColumnOrderC(old => {
  //       const oldIndex = old.indexOf(active.id as string);
  //       const newIndex = old.indexOf(over.id as string);
  //       return arrayMove(old, oldIndex, newIndex);
  //     });
  //   }
  // }, []);

  const allDraggableIds = table.getHeaderGroups().flatMap((g) => g.headers.map((h) => h.column.id));

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over || active.id === over.id) return;

      const activeData = active.data.current as { parentId?: string };
      const overData = over.data.current as { parentId?: string };
      const activeParentId = activeData?.parentId;
      const overParentId = overData?.parentId;

      // Reordenar sub-columnas DENTRO del mismo grupo
      if (activeParentId && activeParentId === overParentId) {
        setColumnOrderC((currentOrder) => {
          const oldIndex = currentOrder.indexOf(active.id as string);
          const newIndex = currentOrder.indexOf(over.id as string);
          if (oldIndex === -1 || newIndex === -1) return currentOrder;
          return arrayMove(currentOrder, oldIndex, newIndex);
        });
        return;
      }

      //       // Reordenar grupos principales (o columnas de nivel superior)
      // if (!activeParentId && !overParentId) {
      //   if (active.id === 'select') return; // No se puede arrastrar la columna de selección

      //   const draggableHeaderIds = table
      //     .getHeaderGroups()[0]
      //     .headers.map(h => h.column.id)
      //     .filter(id => id !== 'select');

      //   const oldIndex = draggableHeaderIds.indexOf(active.id as string);
      //   const newIndex =
      //     over.id === 'select' ? 0 : draggableHeaderIds.indexOf(over.id as string);

      //   if (oldIndex === -1 || newIndex === -1) return;

      //   const newOrderIds = arrayMove(draggableHeaderIds, oldIndex, newIndex);

      //   const newFlatOrder = newOrderIds.flatMap(headerId => {
      //     const header = table
      //       .getHeaderGroups()[0]
      //       .headers.find(h => h.column.id === headerId);
      //     return header ? header.getLeafHeaders().map(h => h.column.id) : [];
      //   });
      //   setColumnOrderC(newFlatOrder);
      //   return;
      // }

      // CASO 2: Reordenar grupos principales (o columnas de nivel superior)
      if (!activeParentId && !overParentId) {
        const topLevelHeaders = table.getHeaderGroups()[0].headers.map((h) => h.column.id);
        const oldIndex = topLevelHeaders.indexOf(active.id as string);
        const newIndex = topLevelHeaders.indexOf(over.id as string);
        if (oldIndex === -1 || newIndex === -1) return;

        const newTopLevelOrder = arrayMove(topLevelHeaders, oldIndex, newIndex);

        const newFlatOrder = newTopLevelOrder.flatMap((headerId) => {
          const header = table.getHeaderGroups()[0].headers.find((h) => h.column.id === headerId);
          return header ? header.getLeafHeaders().map((h) => h.column.id) : [];
        });
        setColumnOrderC(newFlatOrder);
        return;
      }
    },
    [table, setColumnOrderC],
  );

  const autosizeColumn = (columnId: string) => {
    if (!tableRef.current) return;

    const getElementWidth = (element: HTMLElement | null) => {
      if (!element) return 0;
      const style = window.getComputedStyle(element);
      const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      return element.scrollWidth + paddingX;
    };

    const headerElement = tableRef.current.querySelector<HTMLElement>(
      `[data-header-id="${columnId}"]`,
    );
    // const cellElements = tableRef.current.querySelectorAll<HTMLElement>(`[data-column-id="${columnId}"]`);
    const cellContentElements = tableRef.current.querySelectorAll<HTMLElement>(
      `div[data-cell-id="${columnId}"]`,
    );

    // const headerContentWidth = getElementWidth(headerElement?.querySelector('div') || null);
    const headerContentWidth = getElementWidth(
      headerElement?.querySelector(`[data-header-content-id="${columnId}"]`) || null,
    );

    const maxCellWidth = Math.max(
      0,
      ...Array.from(cellContentElements).map((cell) => getElementWidth(cell)),
    );

    const headerStyle = headerElement ? window.getComputedStyle(headerElement) : null;
    const paddingX = headerStyle
      ? parseFloat(headerStyle.paddingLeft) + parseFloat(headerStyle.paddingRight)
      : 32;

    const newSize = Math.ceil(Math.max(headerContentWidth, maxCellWidth) + paddingX);

    table.setColumnSizing((old) => ({
      ...old,
      [columnId]: newSize,
    }));
  };

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  // const generateTablePdf = () => {
  //   const headerRows: string[][] = table.getHeaderGroups().map(headerGroup =>
  //     headerGroup.headers
  //       .filter(header => header.column.getIsVisible() && header.id !== 'select')
  //       .map(header => {
  //         const headerValue = flexRender(header.column.columnDef.header, header.getContext());
  //         return typeof headerValue === 'string' ? headerValue : header.id;
  //       }),
  //   );

  //   const bodyRows: string[][] = table.getRowModel().rows.map(row =>
  //     row
  //       .getVisibleCells()
  //       .filter(cell => cell.column.id !== 'select')
  //       .map(cell => {
  //         const value = cell.getValue();
  //         if (value instanceof Date) {
  //           return value.toLocaleDateString();
  //         }
  //         if (typeof value === 'object' && value !== null) {
  //           if ('name' in value) return String(value.name);
  //           if ('label' in value) return String(value.label);
  //           return JSON.stringify(value);
  //         }
  //         return value ? String(value) : '';
  //       }),
  //   );

  //   setPdfData([...headerRows, ...bodyRows]);
  // };

  const generatePdfData = (): PdfData | null => {
    const headerData: PdfHeaderRow[] = [];
    const maxDepth = table.getHeaderGroups().length;
    let finalColumnCount = 0;

    table.getHeaderGroups().forEach((headerGroup, depth) => {
      const headerRow: PdfHeaderRow[] = [[]];

      headerGroup.headers
        .filter((header) => columnVisibilityC[header.column.id] !== false && header.id !== 'select')
        .forEach((header) => {
          const headerValue = flexRender(header.column.columnDef.header, header.getContext());
          const content =
            typeof headerValue === 'object' ? String(header.column.id) : String(headerValue || '');

          const rowSpan =
            !header.subHeaders || header.subHeaders.length === 0 ? maxDepth - header.depth : 1;

          const cellData: PdfHeaderCell = {
            id: header.id,
            content: header.isPlaceholder || header.id.includes('_blank') ? '' : content,
            colSpan: header.colSpan,
            rowSpan: rowSpan,
            isPlaceholder: header.isPlaceholder,
          };

          headerRow[headerRow.length - 1].push(cellData);
        });
      if (headerRow[0].length > 0) headerData.push(headerRow[0]);
    });

    if (headerData.length > 0) {
      finalColumnCount = headerData[headerData.length - 1].reduce(
        (sum, cell) => sum + cell.colSpan,
        0,
      );
    }

    const bodyData: string[][] = table.getFilteredRowModel().rows.map((row) =>
      row
        .getVisibleCells()
        .filter((cell) => cell.column.id !== 'select')
        .map((cell) => {
          const value = cell.getValue();
          if (value instanceof Date) return value.toLocaleDateString();
          if (React.isValidElement(value)) {
            try {
            } catch (e) {}
            return `[Componente:${cell.column.id}]`;
          }
          if (typeof value === 'object' && value !== null) return JSON.stringify(value);
          return value ? String(value) : '';
        }),
    );

    // // Calcular anchos proporcionales
    const columnWidths: number[] = [];
    if (finalColumnCount > 0) {
      const leafColumns = table.getVisibleLeafColumns().filter((col) => col.id !== 'select');
      // leafColumns.forEach(col => {
      //   console.log(`Col size ${col.id}: `, col.get);
      // })
      const totalSize = leafColumns.reduce((sum, col) => sum + col.getSize(), 0);
      if (totalSize > 0 && leafColumns.length === finalColumnCount) {
        // Asegurar consistencia
        leafColumns.forEach((col) => {
          columnWidths.push((col.getSize() / totalSize) * 100);
        });
      } else {
        // Fallback a anchos iguales
        const equalWidth = 100 / finalColumnCount;
        for (let i = 0; i < finalColumnCount; i++) columnWidths.push(equalWidth);
      }
    }

    if (headerData.length === 0 && bodyData.length === 0) return null;

    return { headers: headerData, body: bodyData, columnWidths: undefined, maxDepth };
  };

  const { openClosePrintingData } = modalWindowStore();
  const handlePrinting = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (customPrint) {
      return customPrint();
    }
    // if (lazyPrinting) {
    // generateTablePdf();
    const pdfData = generatePdfData();
    setPdfData(pdfData as any);
    // }
    openClosePrintingData();
  };

  const truncateStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <aside
        className="relative border-[0.2vw] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-[#00A78B] scrollbar-thumb-rounded-full scrollbar-corner-transparent scrollbar-track-rounded-full"
        style={{
          width: `${width ? `${width}vw` : '100%'}`,
          height: `${heightFitContent ? 'fit-content' : height}vh`,
          borderColor: `${borderColor ? borderColor : '#92CEC3'}`,
          backgroundColor: `${bodyFirstColor ? bodyFirstColor : '#FFF'}`,
          overflowY: 'auto', //`${heightFitContent ? 'auto' : 'scroll'}`,
          overflowX: 'auto',
          borderRadius: `0.520833vw 0.520833vw ${bottomNoRadius ? '0 0' : '0.520833vw 0.520833vw'}`,
        }}
      >
        {loading && <Loader />}
        {!loading && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <table
              ref={tableRef}
              style={{
                width: '100%', //table.getTotalSize(),
                color: textColor,
                // fontSize: `${fontSize ? `${fontSize}vh` : '1rem'}`,
                // fontSize: `${fontSize ? `${fontSize}vh` : '1.8vh'}`,
                tableLayout: 'fixed',
              }}
              className="h-fit font-medium border-collapse relative xl:text-[0.9rem] 2xl:text-[1.15rem]"
            >
              <SortableContext items={allDraggableIds} strategy={horizontalListSortingStrategy}>
                <thead className="sticky top-0 z-[2] group">
                  {table.getHeaderGroups().map((headerGroup, headerRowIndex) => (
                    <tr
                      key={headerGroup.id}
                      style={{
                        color: headTextColor,
                        backgroundColor: headBackgroundColor,
                        height: headerTrHeight ? `${headerTrHeight}vh` : '4.907407vh',
                        borderTop: headerBorder ? '2px solid #92CEC3' : undefined,
                      }}
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <DraggableColumnHeader
                            // key={header.id}
                            key={header.column.id}
                            header={header}
                            table={table}
                            autosizeColumn={autosizeColumn}
                            headerTextCenter={header.column.id === 'rep' ? false : headerTextCenter}
                            headerBorder={headerBorder}
                            // rowSpan={!header.isPlaceholder && (header.id === 'rep' || header.column.id === 'rep') ? 3 : undefined }
                          />
                        );
                      })}
                    </tr>
                  ))}
                </thead>
              </SortableContext>
              <tbody ref={animationParent}>
                {table.getRowModel().rows.map((row, index) => {
                  const highlightResult = rowHighlightCondition
                    ? rowHighlightCondition(row.original)
                    : false;
                  
                  let backgroundColor = index % 2 === 0 ? bodyFirstColor : bodySecondColor;
                  if (typeof highlightResult === 'string') {
                    backgroundColor = highlightResult;
                  } else if (highlightResult) {
                    backgroundColor = highlightColor;
                  }

                  return (
                    <tr
                      key={row.id}
                      onClick={() => onRowClick && onRowClick(row.original)}
                      onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row.original)}
                      style={{
                        backgroundColor,
                        cursor: onRowClick ? 'pointer' : 'default',
                        position: relativeBodyTr ? 'relative' : undefined,
                        height: bodyTrHeight ? `${bodyTrHeight}vh` : undefined,
                      }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const disableTruncate = (
                          cell.column.columnDef.meta as { disableTruncate?: boolean }
                        )?.disableTruncate;
                        const isRepColumn = cell.column.id === 'rep';
                        return (
                          <td
                            key={cell.id}
                            data-column-id={cell.column.id}
                            style={{
                              width: cell.column.getSize(),
                              ...(disableTruncate ? {} : truncateStyle),
                            }}
                            className="px-4 py-2 truncate- text-left"
                          >
                            <div
                              className="w-full"
                              style={{
                                display: bodyTextCenter ? 'flex' : 'flex',
                                justifyContent:
                                  bodyTextCenter && !isRepColumn ? 'center' : undefined,
                                height: bodyTdContentHeight,
                              }}
                            >
                              <div
                                data-cell-id={cell.column.id}
                                className="w-fit"
                                style={{
                                  overflowX: bodyTdContentOverflowX,
                                }}
                                // style={{ justifyContent: bodyTextCenter ? 'center' : undefined }}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {specialRow && (
                  <tr className="sticky bottom-0 text-center bg-[#CEE8E4] text-[#00A78B]">
                    {table
                      .getVisibleLeafColumns()
                      .filter((column) => column.id !== 'select')
                      .map((column) => {
                        const keyString = column.id;

                        const columnSize = column.getSize();

                        return (
                          <td
                            className="h-[5.740741vh]"
                            key={`special-row-cell-${keyString}`}
                            style={{ width: columnSize }}
                          >
                            {specialRow[keyString as keyof typeof specialRow]}
                          </td>
                        );
                      })}
                  </tr>
                )}
              </tbody>
            </table>
          </DndContext>
        )}
      </aside>
      {extraComponent}
      <aside className="relative flex flex-row items-center mt-[1.8vh] w-full">
        <div className="flex-1 flex justify-center">
          {paginationIsActive && !loading && (
            <PaginationControlV2
              currentPage={pagination.pageIndex + 1}
              onClick={() => {}}
              totalPages={table.getPageCount()}
              totalItems={data.length}
              nextPageActive={table.getCanNextPage()}
              previousPageActive={table.getCanPreviousPage()}
              handleNextPage={() => table.nextPage()}
              handleFirstPage={() => table.firstPage()}
              handlePreviousPage={() => table.previousPage()}
              handleLastPage={() => table.lastPage()}
              paginationTextColor={paginationTextColor}
              // paginationControlWidth={paginationControlWidth}
            />
          )}
        </div>
        {printButtonIsActive && !loading && (
          <div
            className="absolute right-0"
            style={{
              marginTop: !paginationIsActive ? '2.5vh' : undefined,
            }}
          >
            <Button
              backgroundColor="#FFF"
              // height={5.462963}
              width={7.125}
              identity="print"
              onClick={handlePrinting}
              textColor="#00A78B"
              border={0.104167}
              borderColor="#00A78B"
              buttonText="Print"
              buttonIcon={<GreenPrinterIcon />}
              iconTextGap={0.3}
              // right={paginationControlWidth ? 2 : 0}
            />
          </div>
        )}
      </aside>
    </>
  );
}
