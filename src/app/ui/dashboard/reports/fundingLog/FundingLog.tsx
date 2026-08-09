import { useCallback, useEffect, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { StatisticsIcon } from '&/icons/Icons';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { AnimatePresence } from 'framer-motion';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { MonthNavigator } from '&/miscellaneous/monthNavigator/MonthNavigator';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { Statistics } from '&/dashboard/reports/fundingLog/statistics/Statistics';
import { useDynamicTableColumns } from '&/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '&/table/coloredTable/v2';
import { getData } from './fundingLog.services';
import { FundingLogSummary } from '@/app/api/reports/fundingLog/types';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { dateFormatsStore } from '@/store/dateFormats';
import { CustomerName } from '&/miscellaneous/customerName/CustomerName';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { VehiclePicker } from '&/miscellaneous/vehicelPicker/VehiclePicker';
import { numberFormatterStore } from '@/store/adminDashboard';
import { TableInput } from './tableInput/TableInput';
import { dealStore } from '@/store/deal';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { UserPicker } from '&/miscellaneous/userPicker/UserPicker';
import { FundingStatuses } from '@/app/libs/customer/customersFunctions';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';
import { useCalendarStore } from '@/store/monthNavigation';
import { MultipleCustomers } from '@/app/ui/miscellaneous/customerName/multipleCustomers/MultipleCustomers';

export function FundingLog({ closeWindow }: CloseWindow) {
  // ----- global states -----

  const { dateFormatted } = dateFormatsStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { numberFilter } = numberFormatterStore();

  const { setDealId, dealIdSelected, resetDealData, dealData, leadId, setLeadId } = dealStore();

  const { currentMonth, currentYear, resetMonthFilter, setFetchingData } = useCalendarStore();

  const getPromiseData = useCallback(() => {
    return [fetchData()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentYear]);

  const { loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [openStatistics, setOpenStatistics] = useState<boolean>(false);

  const fetchData = async () => {
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear);

    const res = await getData(urlParams);

    setData(res);
  };

  const [data, setData] = useState<FundingLogSummary[]>([]);

  const initialColumnsDef = {
    date: true,
    customer_name: true,
    phone_number: true,
    vehicle: true,
    sales_assigned: true,
    manager_assigned: true,
    lender: true,
    loan_id: true,
    status: true,
    down_payment: true,
    paid: true,
    bonus: true,
    deferred_downpayment: true,
  };

  const columnRenderers: { [key: string]: (el: FundingLogSummary) => any } = {
    date: (el) => dateFormatted(5, el.fundingDate),
    customer_name: (el) => (
      <MultipleCustomers
        multipleCustomers={[
          {
            customerId: el.customerId,
            customerName: el.customerName,
          },
          {
            customerId: el.cobuyerId,
            customerName: el.cobuyerName,
            label: 'CB:',
          },
        ]}
        renderRules={{
          mxAuto: false,
        }}
      />
    ),
    phone_number: (el) => formatPhoneNumber(el.phoneNumber),
    vehicle: (el) => (
      <VehiclePicker
        leadId={el.leadId}
        customerId={el.customerId}
        interestedVehicleId={el.vehicleId}
        vehicleName={el.vehicle}
        onSuccess={getPromiseData}
        pickerParentAbsolutePos
      />
    ),
    sales_assigned: (el) => (
      <UserPicker
        leadId={el.leadId}
        customerId={el.customerId}
        salesRep={{
          id: el.salesId,
          userFullname: el.salesRep,
        }}
        onSuccess={getPromiseData}
        pickerParentAbsolutePos
      />
    ),
    manager_assigned: (el) => (
      <UserPicker
        leadId={el.leadId}
        customerId={el.customerId}
        salesManager={{
          id: el.managerId,
          userFullname: el.managerRep,
        }}
        onSuccess={getPromiseData}
        pickerParentAbsolutePos
      />
    ),
    lender: (el) => (
      <TableInput
        defaultValue={el.lender}
        name="lender"
        dealId={el.dealId}
        openDeal
        customerId={el.customerId}
      />
    ),
    loan_id: (el) => <TableInput defaultValue={el.loanId} name="loanId" dealId={el.dealId} />,
    status: (el) => (
      <TableInput
        defaultValue={el.fundingStatus}
        name="status"
        dealId={el.dealId}
        customerId={el.customerId}
      />
    ),
    down_payment: (el) => (
      <TableInput
        defaultValue={numberFilter(el.downPayment, 1)}
        name="downPayment"
        dealId={el.dealId}
        openDeal
        customerId={el.customerId}
      />
    ),
    paid: (el) => (
      <TableInput
        defaultValue={numberFilter(el.paid, 1)}
        name="paid"
        dealId={el.dealId}
        openDeal
        customerId={el.customerId}
      />
    ),
    bonus: (el) => (
      <TableInput
        defaultValue={numberFilter(el.bonus, 1)}
        name="bonus"
        dealId={el.dealId}
        openDeal
        customerId={el.customerId}
      />
    ),
    deferred_downpayment: (el) => (
      <TableInput
        defaultValue={numberFilter(el.deferredDownpayment, 1)}
        name="deferredDownpayment:"
        dealId={el.dealId}
        openDeal
        customerId={el.customerId}
      />
    ),
  };

  const { columns } = useDynamicTableColumns<FundingLogSummary, typeof initialColumnsDef>({
    initialColumnsDef,
    columnRenderers,
    excludeKeys: ['id'],
    accessorFnMapper: {
      date: (el) => el.fundingDate,
      customer_name: (el) => el.customerName,
      phone_number: (el) => el.phoneNumber,
      vehicle: (el) => el.vehicle,
      sales_assigned: (el) => el.salesRep,
      manager_assigned: (el) => el.managerRep,
      lender: (el) => el.lender,
      loan_id: (el) => el.loanId,
      status: (el) => el.fundingStatus,
      down_payment: (el) => el.downPayment,
      paid: (el) => el.paid,
      bonus: (el) => el.bonus,
      deferred_downpayment: (el) => el.deferredDownpayment,
    },
  });

  const { fieldErrors, loadingFetch, makeAsyncFetch, setMessages } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'statistics') {
      setOpenStatistics(true);
    }

    if (identity === 'save' && dealIdSelected) {
      const formData = new FormData();

      for (const [name, value] of Object.entries(dealData)) {
        if (value) formData.append(name, value);
      }

      formData.append('leadId', leadId?.toString() || '');

      const apiUrl = `/api/reports/fundingLog/tableModifications/${dealIdSelected}`;

      await makeAsyncFetch({
        apiUrl,
        formData,
        method: 'PUT',
        options: {
          onSuccess() {
            setDealId(null);

            getPromiseData();
          },
          onFieldErrors(errors) {
            const err = errors['deal'];

            if (err && err.length > 0) {
              setMessages(err[0]);
            }
          },
        },
      });
    }
  };

  // button data
  const buttonInfo = [
    {
      key: 1,
      backgroundColor: '#FFF',
      height: 5.462963,
      identity: 'statistics',
      textColor: '#00A78B',
      width: 8.125,
      border: 0.104167,
      borderColor: '#00A78B',
      buttonText: 'Statistics',
      buttonTextSize: 1.9,
      iconTextGap: 0.729167,
      buttonIcon: <StatisticsIcon />,
      onClick: handleButton,
    },
    {
      key: 2,
      backgroundColor: '#00A78B',
      height: 5.462963,
      identity: 'save',
      textColor: '#FFF',
      width: 8.125,
      buttonText: 'Save',
      buttonTextSize: 1.9,
      disabled: loading || loadingFetch,
      onClick: handleButton,
    },
  ];

  // handling close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  useEffect(() => {
    setFetchingData(loading || loadingFetch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadingFetch]);

  return (
    <ModalWindow top={0}>
      <ModalContainer marginTop={5.555556} width={87.395833}>
        <ModalContainerTitle
          title="Funding Log"
          closeWindowFunction={() => {
            setDealId(null);

            setLeadId(null);

            resetDealData();

            resetMonthFilter();

            handleCloseWindow();
          }}
          extraComponent={<MonthNavigator />}
        />
        <ModalContent>
          <ColoredTableV2
            data={data}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            textColor="#FFF"
            height={55.833333}
            bodyTrHeight={7}
            rowSelectionIsActive={false}
            loading={loading || loadingFetch}
            onRowClick={(rowData) => {
              const data: FundingLogSummary = rowData;

              const dealId = data.dealId;

              const newState = dealIdSelected ? null : dealId;

              setDealId(newState);

              const leadId = data.leadId;

              setLeadId(leadId);
            }}
            relativeBodyTr
            paginationIsActive
            itemsPerPage={8}
            printButtonIsActive
            rowHighlightCondition={(originalRow: FundingLogSummary) => {
              return originalRow.fundingStatus === FundingStatuses.Returned;
            }}
            highlightColor="rgba(185, 67, 67, 1)"
          />
          {fieldErrors && <p className="text-red-600 text-[2.2vh]">{fieldErrors['deal']}</p>}
          <ButtonContainer widthFull justify="right" marginTop={8.055556} gap={1.302083}>
            {buttonInfo.map((el) => (
              <Button
                key={el.key}
                backgroundColor={el.backgroundColor}
                height={el.height}
                identity={el.identity}
                textColor={el.textColor}
                width={el.width}
                border={el.border}
                borderColor={el.borderColor}
                buttonText={el.buttonText}
                buttonTextSize={el.buttonTextSize}
                buttonIcon={el.buttonIcon}
                iconTextGap={el.iconTextGap}
                onClick={el.onClick}
                disabled={el.disabled}
              />
            ))}
          </ButtonContainer>
        </ModalContent>
        <AnimatePresence>
          {openStatistics && <Statistics closeWindow={setOpenStatistics} />}
        </AnimatePresence>
      </ModalContainer>
    </ModalWindow>
  );
}
