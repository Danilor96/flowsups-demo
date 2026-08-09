import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { CloseWindow } from '@/app/libs/definitions';
import { DateFormats } from '@/app/ui/miscellaneous/dateFormats/DateFormats';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { storeReportsStore } from '@/store/reports';
import { ColumnDef, ColumnOrderState, VisibilityState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

const totalsColumnsInit = {
  // id: true,
  created_date: true,
  targeted: true,
  cannot_contact: true,
  started_date: true,
  completed_date: true,
  created_by: true,
  message: false,
};

export function SmsBulkReport({ closeWindow }: CloseWindow) {
  // ----- global states -----
  const smsBulkReport = storeReportsStore(state => state.smsBulkReport);
  const getSmsBulkReport = storeReportsStore(state => state.getSmsBulkReport);

  // table data
  const [tableData, setTableData] = useState<any[]>([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 9,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ select: false, ...totalsColumnsInit });
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(Object.keys(totalsColumnsInit));
  const [loading, setLoading] = useState<boolean>(true);
  const [viewSmsBody, setViewSmsBody] = useState<string | null>('');

  const fetchData = async () => {
    setLoading(true);
    const data = await getSmsBulkReport();
    if (data) {
      const dataToTable = data.map(item => ({
        id: item.id,
        created_date: <DateFormats date={item.created_at} format={5} />,
        targeted: item.total_recipients,
        cannot_contact: item.failed_to_send,
        started_date: item.created_at ? <DateFormats date={item.created_at} format={5} /> : 'N/A',
        completed_date: item.completed_at ? <DateFormats date={item.completed_at} format={5} /> : 'N/A',
        created_by: item.bulk_sms_creator
          ? `${item.bulk_sms_creator.name || ''} ${item.bulk_sms_creator.last_name || ''}`
          : 'N/A',
        message: item.message,
      }));
      setTableData(dataToTable);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [getSmsBulkReport]);

  // ----- local states -----

  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  // handling buttons
  const handleButtons = (e: React.MouseEvent<HTMLButtonElement>) => {};

  // handling search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handleRowClick = (row: any) => {
    console.log('Row clicked:', row);
    setViewSmsBody(row.message);
  };

  const columns: ColumnDef<any>[] = useMemo(() => {
    const firstRowKeys = Object.keys(totalsColumnsInit);
    const columnsToDisplay = firstRowKeys.filter(key => key !== 'id');
    // const columnsStyles: Record<string, { size?: number }>  = {
    //   created_date: { size: 130 },
    // };

    return columnsToDisplay.map(columnId => {
      return {
        id: columnId,
        accessorKey: columnId,
        header: () => {
          let headerText = columnId;
          if (columnId.includes('_')) {
            headerText = columnId
              .split('_')
              .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
              .join(' ');
          } else {
            headerText = `${columnId.charAt(0).toUpperCase()}${columnId.slice(1)}`;
          }
          return headerText;
        },
        cell: info => info.getValue(),
        // minSize: 250,
        // size: columnsStyles[columnId]?.size || undefined,
        enableResizing: true,
      };
    });
  }, []);

  return (
    <ModalWindow top={0}>
      <ModalContainer width={97.395833} marginTop={1.759259}>
        <ModalContainerTitle
          title="Bulk SMS Report"
          closeWindowFunction={handleCloseWindow}
          extraTitleComponent={
            <div className="ml-4 flex gap-3 justify-center items-center w-fit">
              <button
                className="w-[40px] h-[35px] p-[10px] flex items-center justify-center bg-[#00A78B] rounded-[16px]
        hover:scale-105 transition-all
        "
                onClick={fetchData}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2_48616)">
                    <path
                      d="M6.53125 15.7812H2.40625M2.40625 15.7812C2.40625 15.7812 5.84375 20.5938 11 20.5938C15.7465 20.5938 19.5938 17.1562 19.5938 13.0312M2.40625 15.7812V20.5938M15.4688 8.21875H19.5938M19.5938 8.21875C19.5938 8.21875 16.1562 3.40625 11 3.40625C6.2535 3.40625 2.40625 6.84375 2.40625 10.9688M19.5938 8.21875V3.40625"
                      stroke="white"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2_48616">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          }
        />
        <ModalContent>
          <ColoredTableV2
            data={tableData}
            columns={columns}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            // width={tableWidth}
            height={72.2}
            rowSelectionIsActive={false}
            onRowClick={handleRowClick}
          />
          {viewSmsBody && <ViewSmsBody smsBody={viewSmsBody} handleCloseWindow={() => setViewSmsBody(null)} />}
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}

const ViewSmsBody = ({ smsBody, handleCloseWindow }: { smsBody: any, handleCloseWindow: () => void }) => {
  return (
    <ModalWindow top={0}>
      <ModalContainer width={ 50 } marginTop={1.759259}>
        <ModalContainerTitle title="SMS Content" closeWindowFunction={handleCloseWindow} />
        <ModalContent height={50}> 
          <div className="h-full overflow-y-auto p-2 border border-gray-300 rounded">
            <p className="whitespace-pre-wrap break-words">{smsBody}</p>
          </div>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
};
