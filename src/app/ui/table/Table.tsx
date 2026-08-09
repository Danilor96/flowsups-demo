import { useEffect, useState } from 'react';
import { PaginationControl } from '&/miscellaneous/paginationControl/PaginationControl';

export function Table({
  headBorderColor,
  marginBottom,
  marginTop,
  tableData,
  itemsPerPage,
  paginationTable,
  centerText,
  centerHeadText,
}: {
  tableData: any[];
  headBorderColor?: string;
  marginTop?: number;
  marginBottom?: number;
  itemsPerPage?: number;
  paginationTable?: boolean;
  centerText?: boolean;
  centerHeadText?: boolean;
}) {
  // table pagination

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentItems, setCurrentItems] = useState<any[]>([]);

  useEffect(() => {
    if (tableData && itemsPerPage && tableData.length > 0) {
      setTotalPages(Math.ceil(tableData.length / itemsPerPage));
      setCurrentItems(
        tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
      );
    } else {
      setTotalPages(0);
      setCurrentItems([]);
    }
  }, [currentPage, tableData, itemsPerPage]);

  const handlePagination = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { next, prev } = e.currentTarget.dataset;

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
  };

  // cols name definition
  const cols = Object.keys(tableData[0]).filter((col) => col !== 'id');

  // total data for establishing width
  const smallColumns = cols.filter((col) => col.includes('_smallColumn'));
  const normalColumns = cols.filter((col) => !col.includes('_smallColumn'));

  const smallColumnWidth = 5;
  const normalColumnWidth = (100 - smallColumnWidth * smallColumns.length) / normalColumns.length;

  // if there is no id defined set table data false
  const emptyData = !tableData[0].id ? true : false;

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

  return (
    <>
      <table
        className="w-full text-[1.8vh] text-[#999999] font-medium"
        style={{
          marginTop: `${marginTop ? `${marginTop}vh` : 0}`,
          marginBottom: `${marginBottom ? `${marginBottom}vh` : 0}`,
        }}
      >
        <thead
          className="border-b-[0.052083vw]"
          style={{
            borderColor: `${headBorderColor ? `${headBorderColor}` : '#92CEC3'}`,
          }}
        >
          <tr>
            {cols.map((el) => (
              <th
                key={el}
                style={{
                  width: `${el.includes('_smallColumn') ? smallColumnWidth : normalColumnWidth}%`,
                  textAlign: `${centerHeadText ? 'center' : 'left'}`,
                }}
              >
                {formattedTh(el)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!emptyData ? (
            tableData.map((row, index) => (
              <tr key={index}>
                {cols.map((el) => (
                  <td
                    key={el}
                    style={{
                      textAlign: `${centerText ? 'center' : 'left'}`,
                    }}
                  >
                    {row[el]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      {paginationTable && (
        <PaginationControl
          currentPage={currentPage}
          onClick={handlePagination}
          totalPages={totalPages}
        />
      )}
    </>
  );
}
