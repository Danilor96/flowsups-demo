import { useEffect, useState } from 'react';
import { CloseWindow, SmsReportData } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { ReportsFilter } from '&/miscellaneous/reportsFilter/ReportsFilter';
import { SmsPorcentValWatching } from '&/miscellaneous/smsPorcentValWatching/SmsPorcentValWatching';
import { storeReportsStore } from '@/store/reports';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { FilterGroupV2 } from '@/app/ui/miscellaneous/filterGroup/FilterGroupV2';
import { FilterableField } from '@/store/customerList/types';
import { ExtraTitleButtonsReports } from '@/app/ui/miscellaneous/extraTitleButtonsReports/ExtraTitleButtonsReports';
import { reportsFiltersStore, transformDateToQuery } from '@/store/filtersHandling';
import { buildDateQueryString } from '@/app/libs/buildDatePrismaFilter';
import { SmsDetailSubTable } from '@/app/ui/miscellaneous/smsDetailSubTable/SmsDetailSubTable';
import { AnimatePresence } from 'framer-motion';
import { Table } from '@/app/ui/miscellaneous/smsDetailSubTable/table/Table';

interface SmsByUser {
  id: number;
  name: string;
  last_name: string;
  username: string;
  fullName: string;
  smsTotal: number;
  smsDelivery: number;
  smsFailed: number;
  smsReplies: number;
}

export function SmsReport({ closeWindow }: CloseWindow) {
  // ----- global states -----
  const createdDate = reportsFiltersStore((store) => store.createDate);
  const clearFilters = reportsFiltersStore((store) => store.clearFilters);

  // ----- local states -----

  const porcentOfTotal = (total: number, count: number) => {
    const porcentVal = (count * 100) / total;

    return porcentVal;
  };

  // table data
  const [smsReportData, setSmsReportData] = useState<SmsByUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(true);
  const [smsSubDetail, setSmsSubDetail] = useState<{
    userId: number;
    userName: string;
    total: number;
    smsStatus?: 'sent' | 'delivered' | 'failed' | 'clientReplied' | null;
  } | null>(null);

  const initialColumnsDef = {
    rep: true,
    sent: true,
    delivered: true,
    replied: true,
    failed: true,
  };

  const openSubDetail = (
    userId: number,
    userName: string,
    total: number,
    smsStatus?: 'sent' | 'delivered' | 'failed' | 'clientReplied' | null,
  ) => setSmsSubDetail({ userId, userName, total, smsStatus });

  const columsRenderers: { [key in keyof typeof initialColumnsDef]?: (el: SmsByUser) => any } = {
    rep: val => `${val.name || ''} ${val.last_name || ''}`,
    sent: val => <SmsDetailSubTable statistics={val.smsTotal} userId={val.id} userName={val.fullName} />,
    delivered: val => (
      <div onClick={() => openSubDetail(val.id, val.fullName, val.smsTotal, 'delivered')}>
        <SmsPorcentValWatching total={val.smsTotal} count={val.smsDelivery} barColor="#FFF" />
      </div>
    ),
    replied: val => (
      <div onClick={() => openSubDetail(val.id, val.fullName, val.smsTotal, 'clientReplied')}>
        <SmsPorcentValWatching
          total={val.smsTotal}
          // count={val.mssgs?.filter(el => el.status_id === 3).length || 0}
          count={val.smsReplies}
          barColor="#FFF"
        />
      </div>
    ),
    failed: val => (
      <div onClick={() => openSubDetail(val.id, val.fullName, val.smsTotal, 'failed')}>
        <SmsPorcentValWatching
          total={val.smsTotal}
          // count={val.mssgs?.filter(el => el.status_id === 4).length || 0}
          count={val.smsFailed}
          barColor="red"
        />
      </div>
    ),
  };

  const { columns } = useDynamicTableColumns<SmsByUser, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers: columsRenderers,
    accessorFnMapper: {
      rep: el => el.fullName,
      sent: el => el.smsTotal,
      delivered: el => `${el.smsDelivery} -  ${porcentOfTotal(el.smsTotal, el.smsDelivery)}%`,
      replied: el => `${el.smsReplies} - ${porcentOfTotal(el.smsTotal, el.smsReplies)}$`,
      failed: el => `${el.smsFailed} -  ${porcentOfTotal(el.smsTotal, el.smsFailed)}%`,
    },
  });

  // table totals data
  const [totalsData, setTotalsData] = useState<any[]>([
    {
      totals: 'Totals',
      sent: '',
      delivered: '',
      replied: '',
      failed: '',
    },
  ]);

  // messages joining function by creator id

  const handleJoiningMssg = (messagesData: SmsReportData) => {
    if (!messagesData) return {};

    return messagesData.reduce((accumulator, mssg) => {
      const senderId = mssg?.id;

      if (!accumulator[senderId]) {
        accumulator[senderId] = {
          senderId: senderId,
          fullName: `${mssg.user[0]?.name} ${mssg.user[0]?.last_name}`,
          totalMssgs: 0,
          mssgs: [],
        };
      }

      accumulator[senderId].mssgs?.push(mssg);
      accumulator[senderId].totalMssgs += 1;

      return accumulator;
    }, {} as Record<number, { senderId: number; fullName: string; totalMssgs: number; mssgs: SmsReportData }>);
  };

  // useEffect(() => {
  //   if (smsReport && smsReport.length > 0) {
  //     const newTableData: any[] = [];
  //     const newTotalData: any[] = [];

  //     const mssgAccumulated = handleJoiningMssg(smsReport);

  //     for (const [index, val] of Object.entries(mssgAccumulated)) {
  //       newTableData.push({
  //         id: index,
  //         rep: val.fullName,
  //         sent: val.totalMssgs,
  //         delivered: (
  //           <SmsPorcentValWatching
  //             total={val.totalMssgs}
  //             count={val.mssgs?.filter((el) => el.status_id === 1).length || 0}
  //             barColor="#FFF"
  //           />
  //         ),
  //         replied: (
  //           <SmsPorcentValWatching
  //             total={val.totalMssgs}
  //             count={val.mssgs?.filter((el) => el.status_id === 3).length || 0}
  //             barColor="#FFF"
  //           />
  //         ),
  //         failed: (
  //           <SmsPorcentValWatching
  //             total={val.totalMssgs}
  //             count={val.mssgs?.filter((el) => el.status_id === 4).length || 0}
  //             barColor="#FFF"
  //           />
  //         ),
  //       });
  //     }

  //     newTotalData.push({
  //       totals: 'Totals',
  //       sent: smsReport.length,
  //       delivered: `${smsReport.filter((el) => el.status_id === 1).length} - ${
  //         porcentOfTotal(smsReport.length, smsReport.filter((el) => el.status_id === 1).length) || 0
  //       }%`,
  //       replied: `${smsReport.filter((el) => el.status_id === 3).length} - ${
  //         porcentOfTotal(smsReport.length, smsReport.filter((el) => el.status_id === 3).length) || 0
  //       }%`,
  //       failed: `${smsReport.filter((el) => el.status_id === 4).length} - ${
  //         porcentOfTotal(smsReport.length, smsReport.filter((el) => el.status_id === 4).length) || 0
  //       }%`,
  //     });

  //     setTableData(newTableData);
  //     setTotalsData(newTotalData);
  //   }
  // }, [smsReport]);

  const fetchSmsReportData = async (filter: object | null) => {
    try {
      setLoading(true);
      const dateQueryString = buildDateQueryString(filter);
      const response = await fetch(`/api/reports/storeReport/smsReport?${dateQueryString}`);
      const data = (await response.json()) as {
        data: SmsByUser[];
      };
      setSmsReportData(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching activity counts:', error);
    }
  };

  useEffect(() => {
    const dateToExternalFilter = transformDateToQuery(createdDate);
    if (dateToExternalFilter) {
      // between
      if (dateToExternalFilter.optionDate === '13' && (!dateToExternalFilter.fromDate || !dateToExternalFilter.toDate))
        return;
      // previous / upcoming / last x days / last x months
      const options = ['4', '5', '10', '11'];
      if (
        options.includes(dateToExternalFilter.optionDate || '0') &&
        (!dateToExternalFilter.valueDate || dateToExternalFilter.valueDate === '0')
      )
        return;
    }
    fetchSmsReportData(dateToExternalFilter);
  }, [createdDate]);

  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
    clearFilters();
  };

  const reloadHandling = async () => {
    const dateToExternalFilter = transformDateToQuery(createdDate);
    await fetchSmsReportData(dateToExternalFilter);
  };

  // handling buttons
  const handleButtons = (e: React.MouseEvent<HTMLButtonElement>) => {};

  // handling search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const filterableFields: FilterableField[] = [{ id: 'fullName', label: 'Rep', type: 'text' }];

  return (
    <ModalWindow top={0}>
      <ModalContainer width={97.395833} marginTop={1.759259}>
        <ModalContainerTitle
          title="SMS Report"
          closeWindowFunction={handleCloseWindow}
          extraTitleComponent={
            <ExtraTitleButtonsReports
              isFilterVisible={showFilter}
              filterableFields={filterableFields}
              filterToggle={() => setShowFilter(!showFilter)}
              reloadData={reloadHandling}
            />
          }
        />
        <ModalContent>
          <ButtonContainer marginTop={0} marginBottom={2.5} widthFull justify="space-between" alignContentCenter>
            {showFilter && (
              <FilterGroupV2
                advancedFilterFields={filterableFields}
                availableFilters={{
                  createDate: true,
                  createDateLabel: 'Date',
                }}
              />
            )}
          </ButtonContainer>
          {/* <ColoredTable
            height={63.2}
            textColor="#FFF"
            tableData={tableData}
            headTextCenter
            categoryTextCenter
            bodyTextCenter
            specialRow={totalsData}
            paginationTable
            fontSize={2}
            itemsPerPage={8}
            printButton
          /> */}
          <ColoredTableV2
            data={smsReportData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={10}
            loading={loading}
            paginationIsActive
            textColor="#FFF"
            height={!showFilter ? 63.2 : 56}
            rowSelectionIsActive={false}
            printButtonIsActive
          />
          <AnimatePresence>
            {smsSubDetail && (
              <Table
                onCloseWindow={() => setSmsSubDetail(null)}
                userId={smsSubDetail.userId}
                userName={smsSubDetail.userName}
                auto={false}
                smsStatus={smsSubDetail.smsStatus}
              />
            )}
          </AnimatePresence>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
