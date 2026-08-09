import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { PaginationControl } from '&/miscellaneous/paginationControl/PaginationControl';
import { Button } from '&/buttons/Button';
import { GreenPrinterIcon } from '&/icons/Icons';
import { Loader } from '&/miscellaneous/loader/Loader';
import {
  adminDashboardStore,
  clientMessagesStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
// import { pdfDataStore } from '@/store/pdfData';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { CheckboxInput } from '../../inputs/CheckboxInput';

export function ColoredTable({
  tableData,
  fontSize,
  width,
  textColor,
  headTextColor,
  headTextCenter,
  headBackgroundColor,
  headBorderBottom,
  headAllBorderBottom,
  headBorderRight,
  bodyTextColor,
  bodyFirstColor,
  bodySecondColor,
  bodyTextCenter,
  height,
  borderColor,
  specialRow,
  eightyTwentyColumnWidth,
  specialButton,
  specialButtonText,
  specialButtonIcon,
  specialButtonBackgroundColor,
  specialButtonHeight,
  specialButtonTextColor,
  specialButtonTextSize,
  categoryData,
  categoryTextColor,
  categoryTextCenter,
  categoryBackgroundColor,
  paginationTable,
  headerTrHeight,
  headerTrHeightHidden,
  tableWidth,
  customColumnWidth,
  customerIdForSingleClientData,
  bodyRowClickEvent,
  heightFitContent,
  itemsPerPage,
  printButton,
  lazyPrinting = false,
  bottomNoRadius,
  extraComponent,
  relativeBodyTr,
  showAbsoluteTrComponent,
  loading,
  customersIdsSelected,
  isSelectable = false,
  onRowsSelectedChange,
  onPaginationChange,
  visibleColumns = [],
  rowOnClickEvent,
  paginationControlWidth,
}: {
  tableData: any[];
  fontSize?: number;
  textColor: string;
  headTextColor?: string;
  headTextCenter?: boolean;
  headBackgroundColor?: string;
  headBorderRight?: number[];
  headBorderBottom?: number[];
  headAllBorderBottom?: boolean;
  bodyTextColor?: string;
  bodyFirstColor?: string;
  bodySecondColor?: string;
  bodyTextCenter?: boolean;
  width?: number;
  tableWidth?: number;
  paginationControlWidth?: number;
  height: number;
  heightFitContent?: boolean;
  eightyTwentyColumnWidth?: boolean;
  customColumnWidth?: { column: string; widthInPorcent: number }[];
  borderColor?: string;
  specialRow?: any[];
  specialButton?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  specialButtonHeight?: number;
  specialButtonBackgroundColor?: string;
  specialButtonText?: string;
  customerIdForSingleClientData?: number;
  bodyRowClickEvent?: () => void;
  rowOnClickEvent?: (id: number) => void;
  specialButtonTextSize?: number;
  headerTrHeight?: number;
  headerTrHeightHidden?: boolean;
  specialButtonTextColor?: string;
  specialButtonIcon?: React.ReactNode;
  categoryData?: { category: string; colSpan: number }[];
  categoryTextColor?: string;
  categoryTextCenter?: boolean;
  categoryBackgroundColor?: string;
  paginationTable?: boolean;
  itemsPerPage?: number;
  printButton?: boolean;
  lazyPrinting?: boolean;
  bottomNoRadius?: boolean;
  extraComponent?: React.ReactNode;
  relativeBodyTr?: boolean;
  showAbsoluteTrComponent?: boolean;
  loading?: boolean;
  isSelectable?: boolean;
  customersIdsSelected?: number[];
  visibleColumns?: string[];
  onRowsSelectedChange?: (selectedRows: number[]) => void;
  onPaginationChange?: ({
    currentPage,
    totalPages,
    itemsPerPage,
  }: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  }) => void;
}) {
  // ----- global states -----

  // get single client data

  const { getSingleClientData } = singleCLientDataStore();

  // printing table

  const { openClosePrintingData } = modalWindowStore();

  // const { setPdfData, clearPdfData } = pdfDataStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { getClientMessages, getClientMessagesByPhoneNumber } = clientMessagesStore();

  const handlePrinting = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (lazyPrinting) {
      generateTablePdf();
    }
    openClosePrintingData();
  };

  const { setSelectedCustomersIds } = adminDashboardStore();

  // ----- local states -----

  // table pagination

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentItems, setCurrentItems] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const jumpStep = 5;

  useEffect(() => {
    if (tableData && itemsPerPage && tableData.length > 0) {
      // total pages
      const newTotalPages = Math.ceil(tableData.length / itemsPerPage);
      setTotalPages(newTotalPages);

      // total pages excess
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }

      // refresh current page elements
      setCurrentItems(
        tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
      );
    } else {
      setTotalPages(0);
      setCurrentItems([]);
    }
  }, [currentPage, tableData, itemsPerPage]);

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange({
        currentPage,
        totalPages,
        itemsPerPage: itemsPerPage ? itemsPerPage : 9,
      });
    }
  }, [currentPage, totalPages]);

  const handlePagination = (e: React.MouseEvent<HTMLButtonElement>, page?: number) => {
    const { next, prev, jumpnext, jumpprev } = e.currentTarget.dataset;

    if (page) {
      setCurrentPage(page);
    } else {
      if (next) {
        if (currentPage < totalPages) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      }

      if (prev) {
        if (currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }
      }

      if (jumpnext) {
        const newPage = Math.min(currentPage + jumpStep, totalPages);
        setCurrentPage(newPage);
      }

      if (jumpprev) {
        const newPage = Math.max(currentPage - jumpStep, 1);
        setCurrentPage(newPage);
      }
    }
  };

  // cols name definition
  const dontCount = [
    'id',
    'customerIdForSingleClientData',
    'unknowCustomerIdForData',
    'absoluteBodyTrComponent',
  ];

  const cols =
    tableData && tableData.length > 0
      ? Object.keys(tableData[0]).filter((col) => !dontCount.includes(col))
      : [''];

  const visibleCols =
    !visibleColumns || visibleColumns.length === 0
      ? cols
      : cols.filter((col) => visibleColumns?.includes(col));
  // total data for establishing width
  const totalData = 100 / visibleCols.length;

  // if there is no id defined set table data false
  const emptyData = !tableData[0]?.id ? true : false;

  const test = 'a'.padStart(2, '0');

  // blanks td data for "no data available" row
  let emptyTd: number[] = [];

  for (let i = 1; i < cols.length; i++) {
    emptyTd.push(i);
  }

  // formatting table text
  const formattedTh = (str: string) => {
    let string: string = `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

    // formatting cols name that only includes: _blank
    if (str.includes('_blank')) {
      string = '';
    }

    // formatting cols name that only includes: _
    if (str.includes('_') && !str.includes('_blank')) {
      string = str
        .split('_')
        .map((word) => {
          // Capitalize the first word
          if (word !== '_') {
            return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
          }
          // Return the rest words as they are
          return word;
        })
        .join(' ');
    }

    return string;
  };

  // creating the data for printing function
  const generateTablePdf = () => {
    if (!tableData || tableData.length === 0) return;
    const tableKeys = Object.keys(tableData[0]).filter((col) => col !== 'id');

    const newPdfData: string[][] | undefined = [['']];

    const newPdfDataCols: string[] = tableKeys.filter((el) => !el.includes('_blank'));

    newPdfData.splice(
      0,
      1,
      newPdfDataCols.map((el) => (el.includes('_') ? el.split('_').join(' ') : el)),
    );

    let newPdfDataBody: any[] = [];

    tableData.forEach((el) => {
      newPdfDataBody = [];

      newPdfDataCols.forEach((col) => {
        if (typeof el[col] === 'string') {
          newPdfDataBody.push(el[col]);
        } else if (typeof el[col] === 'object') {
          if (el[col]?.props) {
            if (el[col]?.props?.customer) {
              newPdfDataBody.push(el[col].props.customer);
            } else if (el[col]?.props?.contact) {
              newPdfDataBody.push(formatPhoneNumber(el[col].props.contact));
            } else if (el[col]?.props?.userName) {
              const userName =
                el[col].props.userName +
                `${el[col].props.userLastname ? ` ${el[col].props.userLastname}` : ''}`;
              newPdfDataBody.push(userName);
            } else if (el[col]?.props?.interestedVehicleId) {
              const vehicleName = el[col].props.vehicleName || '';
              newPdfDataBody.push(vehicleName);
            } else if (el[col]?.props?.status) {
              let status = el[col]?.props?.status;

              switch (status) {
                case 1:
                  status = 'In stock';
                  break;

                case 2:
                  status = 'Out of stock';
                  break;

                case 3:
                  status = 'Sold';
                  break;

                case 4:
                  status = 'Awaiting repair';
                  break;
              }

              newPdfDataBody.push(status);
            } else if (el[col]?.props?.temperatureId) {
              let temp = 'No temperature';

              switch (el[col]?.props?.temperatureId) {
                case 1:
                  temp = 'Normal';
                  break;

                case 2:
                  temp = 'Warm';
                  break;

                case 3:
                  temp = 'Hot';
                  break;
              }

              newPdfDataBody.push(temp);
            } else {
              newPdfDataBody.push('');
            }
          }
        } else {
          newPdfDataBody.push('');
        }
      });

      newPdfData.push(newPdfDataBody);
    });
    console.log('newPdfData: ', newPdfData);
    // setPdfData(newPdfData);
  };

  useEffect(() => {
    if (lazyPrinting) return;
    generateTablePdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  useEffect(() => {
    if (emptyData) {
      // clearPdfData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emptyData]);

  const handleCheckboxChange = (id: number, isChecked: boolean) => {
    let newSelectedRows = customersIdsSelected ? [...customersIdsSelected] : [];

    if (isChecked) {
      const selectedSet = new Set(newSelectedRows);
      selectedSet.add(id);
      newSelectedRows = Array.from(selectedSet);
    } else {
      newSelectedRows = newSelectedRows.filter((el) => el !== id);
    }

    setSelectedRows(newSelectedRows);
    onRowsSelectedChange?.(newSelectedRows);
  };

  const currentItemIds = currentItems.map((item) => item.id);
  const allCurrentItemsSelected =
    currentItems.length > 0 &&
    currentItemIds.every((itemId) => customersIdsSelected?.includes(itemId));

  return (
    <>
      <aside
        className="relative border-[0.2vw]"
        style={{
          width: `${width ? `${width}vw` : '100%'}`,
          height: `${heightFitContent ? 'fit-content' : height}vh`,
          borderColor: `${borderColor ? borderColor : '#92CEC3'}`,
          overflowY: `${heightFitContent ? 'auto' : 'scroll'}`,
          borderRadius: `0.520833vw 0.520833vw ${bottomNoRadius ? '0 0' : '0.520833vw 0.520833vw'}`,
        }}
      >
        {loading ? (
          <Loader />
        ) : (
          <table
            className="h-fit font-medium"
            style={{
              fontSize: `${fontSize ? `${fontSize}vh` : '1.8vh'}`,
              color: `${textColor}`,
              width: tableWidth ? `${tableWidth}vw` : '100%',
            }}
          >
            <thead className="">
              {/* 1) */}
              {categoryData && (
                <tr
                  className="h-[4.907407vh]"
                  style={{
                    color: categoryTextColor,
                    textAlign: `${categoryTextCenter ? 'center' : 'left'}`,
                    backgroundColor: `${
                      categoryBackgroundColor ? categoryBackgroundColor : '#92CEC3'
                    }`,
                  }}
                >
                  {categoryData.map((el, index) => (
                    <th
                      key={`${el.category}--${index}oneee111`}
                      colSpan={el.colSpan}
                      className="border-r-[0.052083vw] border-b-[0.052083vw] border-[#FFF]"
                    >
                      {formattedTh(el.category)}
                    </th>
                  ))}
                </tr>
              )}
              {/* 2) */}
              <tr
                className=""
                style={{
                  color: headTextColor,
                  textAlign: `${headTextCenter ? 'center' : 'left'}`,
                  backgroundColor: `${headBackgroundColor ? headBackgroundColor : '#92CEC3'}`,
                  height: headerTrHeightHidden
                    ? '0vh'
                    : headerTrHeight
                    ? `${headerTrHeight}vh`
                    : '4.907407vh',
                }}
              >
                {isSelectable && (
                  <th className="px-2 flex items-center h-full justify-center">
                    <input
                      title="select all"
                      type="checkbox"
                      checked={allCurrentItemsSelected}
                      onChange={(e) => {
                        const { checked } = e.currentTarget;
                        let newSelectedRows = customersIdsSelected ? [...customersIdsSelected] : [];
                        const currentItemIds = currentItems.map((item) => item.id);

                        if (checked) {
                          const selectedSet = new Set(customersIdsSelected);
                          currentItems.forEach((item) => selectedSet.add(item.id));
                          newSelectedRows = Array.from(selectedSet);
                        } else {
                          newSelectedRows = newSelectedRows.filter(
                            (selectedId) => !currentItemIds.includes(selectedId),
                          );
                        }

                        setSelectedRows(newSelectedRows);

                        onRowsSelectedChange?.(newSelectedRows);
                      }}
                      className="w-[1.14375vw] h-[1.14375vw] accent-[white]"
                    />
                  </th>
                )}
                {visibleCols.map((el, index) => (
                  <th
                    key={`${el}ct--twoo=${index + 7}`}
                    className="border-[#FFF]"
                    style={{
                      width: `${
                        customColumnWidth && customColumnWidth.length > 0
                          ? customColumnWidth.find((customCol) => customCol.column === el)
                              ?.widthInPorcent || totalData
                          : totalData
                      }%`,
                      // `${
                      //   index === 0
                      //     ? eightyTwentyColumnWidth
                      //       ? 80
                      //       : totalData
                      //     : index === 1
                      //     ? eightyTwentyColumnWidth
                      //       ? 20
                      //       : totalData
                      //     : totalData
                      // }%`
                      borderRightWidth: `${headBorderRight?.includes(index) && '0.052083vw'}`,
                      borderBottomWidth: `${
                        headAllBorderBottom
                          ? '0.052083vw'
                          : headBorderBottom?.includes(index) && '0.052083vw'
                      }`,
                      borderColor: '#FFF',
                    }}
                  >
                    {formattedTh(el)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className=""
              style={{
                color: bodyTextColor,
              }}
            >
              {!emptyData ? (
                !paginationTable ? (
                  tableData.map((row, index) => (
                    <tr
                      key={`${row.id}<->three---ct${index - 1003}`}
                      onDoubleClick={async () => {
                        if (bodyRowClickEvent) {
                          bodyRowClickEvent();
                        }
                        if (row.customerIdForSingleClientData) {
                          getSingleClientData(row.customerIdForSingleClientData.toString());
                        } else if (row.unknowCustomerIdForData) {
                          await getClientMessagesByPhoneNumber(row.unknowCustomerIdForData);
                        }
                      }}
                      className="h-[5.740741vh]"
                      style={{
                        backgroundColor:
                          index % 2
                            ? bodyFirstColor
                              ? bodyFirstColor
                              : 'rgb(67, 185, 165)'
                            : bodySecondColor
                              ? bodySecondColor
                              : '#00A78B',
                        textAlign: bodyTextCenter ? 'center' : 'left',
                      }}
                    >
                      {cols.map((el, index) => (
                        <td key={`${el}....ct-=four${index + 13}ct`}>{row[el]}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  currentItems.map((row, index) => (
                    <tr
                      key={`${row.id}ctdddd--five${index + 66}cctt`}
                      onClick={async () => {
                        if (rowOnClickEvent) {
                          rowOnClickEvent(row.id);
                        }
                      }}
                      onDoubleClick={async () => {
                        if (bodyRowClickEvent) {
                          bodyRowClickEvent();
                        }
                        if (row.customerIdForSingleClientData) {
                          getSingleClientData(row.customerIdForSingleClientData.toString());
                        } else if (row.unknowCustomerIdForData) {
                          await getClientMessagesByPhoneNumber(row.unknowCustomerIdForData);
                        }
                      }}
                      className={`h-[5.740741vh] ${rowOnClickEvent ? 'cursor-pointer' : ''}`}
                      style={{
                        backgroundColor:
                          index % 2
                            ? bodyFirstColor
                              ? bodyFirstColor
                              : 'rgb(67, 185, 165)'
                            : bodySecondColor
                              ? bodySecondColor
                              : '#00A78B',
                        textAlign: bodyTextCenter ? 'center' : 'left',
                        position: relativeBodyTr ? 'relative' : 'static',
                      }}
                    >
                      {isSelectable && (
                        <td className="max-w-[4px]">
                          <div
                            className="flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              checked={customersIdsSelected?.includes(row.id)}
                              type="checkbox"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleCheckboxChange(row.id, e.target.checked)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-[1.14375vw] h-[1.14375vw] accent-[white]"
                            />
                          </div>
                        </td>
                      )}
                      {visibleCols.map((el, index) => (
                        <td
                          className="py-[1rem]"
                          key={`${el}cccctttt--->>${index - 90 + 77}aaaasix`}
                        >
                          {row[el]}
                        </td>
                      ))}
                      {showAbsoluteTrComponent && row.absoluteBodyTrComponent}
                    </tr>
                  ))
                )
              ) : (
                <tr
                  style={{
                    backgroundColor: bodyFirstColor ? bodyFirstColor : '#00A78B',
                  }}
                >
                  <td className="h-[5.740741vh]">No data available</td>
                  {emptyTd.map((el, index) => (
                    <td key={`${el}ssssssevenct${index + 331}`}></td>
                  ))}
                </tr>
              )}
              {specialRow && (
                <tr className="sticky bottom-0 text-center bg-[#CEE8E4] text-[#00A78B]">
                  {Object.keys(specialRow[0]).map((key, index) => (
                    <td
                      className="h-[5.740741vh]"
                      key={`${index + 88}eight--ct--cctt-ooo${index - 1234567}`}
                    >
                      {specialRow[0][key]}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        )}
        {specialButton && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="absolute bottom-0 w-full flex flex-row justify-center items-center gap-[0.833333vw]"
            style={{
              height: `${specialButtonHeight}vh`,
              color: specialButtonTextColor,
              backgroundColor: specialButtonBackgroundColor,
              fontSize: `${specialButtonTextSize}vh`,
            }}
          >
            {specialButtonIcon}
            <p>{specialButtonText}</p>
          </motion.button>
        )}
      </aside>
      {extraComponent}
      <aside className="relative">
        {paginationTable && (
          <PaginationControl
            currentPage={currentPage}
            onClick={handlePagination}
            totalPages={totalPages}
            paginationControlWidth={paginationControlWidth}
          />
        )}
        {printButton && !loading && (
          <article className="absolute right-0 top-0 w-fit h-fit">
            <Button
              backgroundColor="#FFF"
              height={5.462963}
              width={paginationControlWidth ? 5.125 : 8.125}
              identity="print"
              onClick={handlePrinting}
              textColor="#00A78B"
              border={0.104167}
              borderColor="#00A78B"
              buttonText="Print"
              buttonIcon={<GreenPrinterIcon />}
              iconTextGap={0.3}
              right={paginationControlWidth ? 2 : 0}
              positionAbsolute
            />
          </article>
        )}
      </aside>
    </>
  );
}
