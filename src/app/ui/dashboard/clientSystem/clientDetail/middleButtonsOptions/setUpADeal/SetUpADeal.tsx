import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Input } from '&/inputs/Input';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import {
  adminDashboardStore,
  modalWindowStore,
  numberFormatterStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { CancelIcon } from '&/icons/Icons';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { Deal } from '@/app/libs/definitions';
import { dateToUTCfromInputDateString } from '@/app/libs/dateTimeZone';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { BulkSetUpADealCustomersList } from './bulkSetUpADealCustomersList/BulkSetUpADealCustomersList';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { BankSelect } from '@/app/ui/miscellaneous/bankSelect/BankSelect';
import { leadsStore } from '@/store/leads';

interface SetUpADealProps {
  dealId?: number;
  closeModalFromParent?: () => void;
}

export function SetUpADeal({ dealId, closeModalFromParent }: SetUpADealProps = {}) {
  // ----- global states -----

  const { bulkSetUpADeal } = modalWindowStore();
  const { closeSetUpADeal, openCloseBulkSetUpADeal } = modalWindowStore();

  const { numberFormatter, numberFilter } = numberFormatterStore();

  const currentLead = leadsStore((state) => state.currentLead);

  const { singleCLientData } = singleCLientDataStore();

  const { deal, dealLeadActive, selectedCustomersIds } = adminDashboardStore();
  const { getDeal, setSelectedCustomersIds, getDealByDealId } = adminDashboardStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { updateDataWithSocket } = useSocketStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  const getPromiseData = useCallback(() => {
    if (dealId) {
      return [getDealByDealId(dealId)];
    }

    let idSelected = -1;

    if (singleCLientData) {
      idSelected = singleCLientData.id;
    } else if (selectedCustomersIds && selectedCustomersIds.length > 0) {
      idSelected = selectedCustomersIds[currentIndex];
    }

    return [getDeal(idSelected, currentLead)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleCLientData, selectedCustomersIds, currentIndex, dealId]);

  const { loading, error } = useLoadingGetData(getPromiseData);

  useEffect(() => {
    if (deal && deal.id) {
      setInputs({
        id: deal.id.toString(),
        downpayment: deal.downpayment,
        paid: deal.paid,
        bonus: deal.bonus,
        moneyDuePaid: deal.moneyDuePaid,
        frontend: deal.frontend,
        backend: deal.backend,
        totalProfit: deal.totalProfit,
        deferredDownpayment: deal.deferredDownpayment,
        paymentDate:
          !deal.paymentDate || deal.paymentDate.length < 1
            ? [{ dateId: '', amountId: '', date: '', amount: '0', paid: '' }]
            : deal.paymentDate?.map((el, index) => {
                return {
                  dateId: el.id.toString(),
                  amountId:
                    el.amountPerDate
                      .find((elAmount) => elAmount.paymentDateId === el.id)
                      ?.id.toString() || '',
                  date: formatIncomingObjectDate(el.date),
                  amount:
                    el.amountPerDate.find((elAmount) => elAmount.paymentDateId === el.id)?.amount ||
                    '',
                  paid: el.amountPerDate.find((elAmount) => elAmount.paymentDateId === el.id)?.paid
                    ? '1'
                    : '',
                };
              }),
        bankId: deal.bank?.id?.toString() || '',
        bankName: deal.bank?.bank || '',
        soldDateInput: dealLeadActive
          ? formatIncomingObjectDate(dealLeadActive?.sold_created_at)
          : '',
        sellerCommission: deal.sellerCommission,
        bdcCommission: deal.bdcCommission,
      });
    } else {
      setInputs({
        id: '',
        downpayment: '',
        paid: '0',
        bonus: '0',
        moneyDuePaid: '0',
        frontend: '',
        backend: '',
        totalProfit: '0',
        deferredDownpayment: '0',
        paymentDate: [{ dateId: '', amountId: '', date: '', amount: '0', paid: '' }],
        bankId: '',
        bankName: '',
        sellerCommission: '0',
        bdcCommission: '0',
        soldDateInput: dealLeadActive
          ? formatIncomingObjectDate(dealLeadActive?.sold_created_at)
          : '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deal, dealLeadActive, selectedCustomersIds]);

  // ----- local states -----

  const [changeCustomerWarning, setChangeCustomerWarning] = useState('');
  const [rejectMoneyDuePaidWarning, setRejectMoneyDuePaidWarning] = useState('');
  const [indexToReturnAmount, setIndexToReturnAmount] = useState<number | null>(null);
  const [selectedCustomerIdToShow, setSelectedCustomerIdToShow] = useState('');

  const [inputs, setInputs] = useState({
    id: '',
    downpayment: '',
    paid: '0',
    bonus: '0',
    moneyDuePaid: '0',
    frontend: '',
    backend: '',
    totalProfit: '0',
    deferredDownpayment: '0',
    paymentDate: [{ dateId: '', amountId: '', date: '', amount: '0', paid: '' }],
    bankId: '',
    bankName: '',
    soldDateInput: '',
    sellerCommission: '0',
    bdcCommission: '0',
  });

  const [totals, setTotals] = useState({
    moneyDuePaid: 0,
    deferredDownpayment: 0,
  });

  useEffect(() => {
    let totalMoneyDuePaid = 0;
    let totalDeferredDownpayment = 0;

    inputs.paymentDate.forEach((el) => {
      if (el.paid) {
        totalMoneyDuePaid += Number(numberFormatter(el.amount));
      }
    });

    const { bonus, downpayment, paid } = inputs;
    const downpaymentNumber = downpayment === '' ? 0 : Number(numberFormatter(downpayment));

    totalDeferredDownpayment =
      downpaymentNumber -
      Number(numberFormatter(bonus)) -
      Number(numberFormatter(paid)) -
      totalMoneyDuePaid;

    setTotals({ moneyDuePaid: totalMoneyDuePaid, deferredDownpayment: totalDeferredDownpayment });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  const [dateIdsDeleted, setDateIdsDeleted] = useState<string[]>([]);

  //   handling change inputs

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    const formattedValue = numberFormatter(value, true);

    if (name === 'frontend') {
      setInputs((prevState) => {
        const newState = { ...prevState };

        const totalProfit =
          parseFloat(formattedValue.replace(/,/g, '')) +
          parseFloat(newState.backend.replace(/,/g, ''));

        newState.totalProfit = totalProfit.toFixed(2);
        newState.frontend = formattedValue;

        return newState;
      });

      return;
    }

    if (name === 'backend') {
      setInputs((prevState) => {
        const newState = { ...prevState };

        const totalProfit =
          parseFloat(formattedValue.replace(/,/g, '')) +
          parseFloat(prevState.frontend.replace(/,/g, ''));

        newState.totalProfit = totalProfit.toFixed(2);
        newState.backend = formattedValue;

        return newState;
      });

      return;
    }

    if (name === 'bankName') {
      setInputs((prevState) => ({
        ...prevState,
        bankName: value,
        bankId: !value ? '' : prevState.bankId,
      }));

      return;
    }

    if (name === 'downpayment' || name === 'paid' || name === 'bonus' || name === 'moneyDuePaid') {
      setInputs((prevState) => {
        const newState = { ...prevState };

        let paid = parseFloat(newState.paid.replace(/,/g, ''));
        let downpayment = parseFloat(newState.downpayment.replace(/,/g, ''));
        let bonus = parseFloat(newState.bonus.replace(/,/g, ''));

        switch (name as keyof typeof inputs) {
          case 'downpayment':
            newState.downpayment = numberFormatter(value);

            downpayment = parseFloat(newState.downpayment.replace(/,/g, ''));

            break;

          case 'paid':
            newState.paid = numberFormatter(value);

            paid = parseFloat(newState.paid.replace(/,/g, ''));

            break;

          case 'bonus':
            newState.bonus = numberFormatter(value);

            bonus = parseFloat(newState.bonus.replace(/,/g, ''));

            break;
        }

        let totalToTakeOut = 0;

        for (let i = 0; i < newState.paymentDate.length; i++) {
          const paymentDate = newState.paymentDate[i];

          totalToTakeOut = totalToTakeOut + parseInt(paymentDate.amount);
        }

        const totalDeferredDownpayment = downpayment - paid - bonus - totalToTakeOut;

        newState.deferredDownpayment = totalDeferredDownpayment.toFixed(2);

        return newState;
      });
    }
  };

  const handleSelect = (option: {
    value: number | string | undefined;
    option: string | undefined;
  }) => {
    setInputs((prevState) => ({
      ...prevState,
      bankId: option.value?.toString() || '',
      bankName: option.option || '',
    }));
  };

  const handleChangePaymentDate = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
  ) => {
    const { name, value } = e.currentTarget;

    let checked: boolean | null = null;

    if (e.currentTarget instanceof HTMLInputElement) {
      checked = e.currentTarget.checked;
    }

    setInputs((prevState) => {
      const newState = { ...prevState };

      const dateKey = name as keyof (typeof newState.paymentDate)[0];

      const paymentDateSelected = newState.paymentDate[index];

      if (dateKey === 'paid' && paymentDateSelected.amount !== '0') {
        if (checked) {
          paymentDateSelected.paid = checked ? '1' : '';

          let totalMoneyDuePaid = 0;
          let totalDeferredDownpayment = Number(newState.deferredDownpayment);

          for (let i = 0; i < newState.paymentDate.length; i++) {
            const dateForm = newState.paymentDate[i];

            if (dateForm.paid) {
              totalMoneyDuePaid += Number(dateForm.amount);
              totalDeferredDownpayment -= Number(dateForm.amount);
            }
          }

          newState.moneyDuePaid = totalMoneyDuePaid.toFixed(2);
          newState.deferredDownpayment = totalDeferredDownpayment.toFixed(2);
        } else {
          setIndexToReturnAmount(index);
          setRejectMoneyDuePaidWarning('Are you sure you want to return this amount?');
        }
      } else if (dateKey === 'amount') {
        const formattedValue = numberFormatter(value);

        newState.paymentDate[index][dateKey] = formattedValue;
      } else {
        newState.paymentDate[index][dateKey] = value;
      }

      let totalToTakeOut = 0;

      for (let i = 0; i < newState.paymentDate.length; i++) {
        const paymentDate = newState.paymentDate[i];

        totalToTakeOut = totalToTakeOut + parseFloat(paymentDate.amount.replace(/,/g, ''));
      }

      // const totalDeferredDownpayment =
      //   parseFloat(newState.downpayment.replace(/,/g, '')) -
      //   parseFloat(newState.paid.replace(/,/g, '')) -
      //   parseFloat(newState.bonus.replace(/,/g, '')) -
      //   totalToTakeOut;

      // newState.deferredDownpayment = totalDeferredDownpayment.toFixed(2);

      return newState;
    });
  };

  const handlePickDate = (e: Date, index?: number) => {
    setInputs((prevState) => {
      const newState = { ...prevState };
      console.log('index:', { data: formatIncomingObjectDate(e), index });
      if (index || index === 0) {
        newState.paymentDate[index].date = formatIncomingObjectDate(e);
      }

      return newState;
    });
  };

  const handleBulkCustomersChange = (value: string) => {
    if (selectedCustomersIds[currentIndex] !== parseInt(value)) {
      setSelectedCustomerIdToShow(value);

      setChangeCustomerWarning(
        'Are you sure you want to change the customer? Current unsaved changes will be deleted',
      );
    }
  };

  const handleDecision = (decision: boolean) => {
    if (changeCustomerWarning) {
      if (decision) {
        if (selectedCustomerIdToShow) {
          setInputs({
            id: '',
            downpayment: '',
            paid: '0',
            bonus: '0',
            moneyDuePaid: '0',
            frontend: '',
            backend: '',
            totalProfit: '0',
            deferredDownpayment: '0',
            paymentDate: [{ dateId: '', amountId: '', date: '', amount: '0', paid: '' }],
            bankId: '',
            bankName: '',
            sellerCommission: '0',
            bdcCommission: '0',
            soldDateInput: '',
          });

          const newIndex = selectedCustomersIds.findIndex(
            (id) => id === parseInt(selectedCustomerIdToShow),
          );

          if (newIndex !== -1) setCurrentIndex(newIndex);
        }

        setChangeCustomerWarning('');
      } else {
        setChangeCustomerWarning('');
      }
    }

    if (rejectMoneyDuePaidWarning) {
      if (decision) {
        if (indexToReturnAmount || indexToReturnAmount === 0) {
          setInputs((prevState) => {
            const newState = { ...prevState };

            const amountToReturn = newState.paymentDate[indexToReturnAmount].amount;

            newState.paymentDate[indexToReturnAmount].paid = '';

            const totalMoneyDuePaid = Number(newState.moneyDuePaid) - Number(amountToReturn);

            const totalDeferredDownpayment =
              Number(newState.deferredDownpayment) + Number(amountToReturn);

            newState.moneyDuePaid = totalMoneyDuePaid.toFixed(2);
            newState.deferredDownpayment = totalDeferredDownpayment.toFixed(2);

            return newState;
          });
        }

        setIndexToReturnAmount(null);

        setRejectMoneyDuePaidWarning('');
      } else {
        setRejectMoneyDuePaidWarning('');
      }
    }
  };

  const handleNextCustomerInBulkList = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < selectedCustomersIds.length) {
      setCurrentIndex(nextIndex);
    } else {
      // getDeal(-1);
      closeSetUpADeal();
      if (bulkSetUpADeal) openCloseBulkSetUpADeal();
    }
  };

  //   handling buttons

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;
    const { value } = e.currentTarget;

    if (identity === 'addPaymentDate') {
      inputs.paymentDate.push({
        dateId: '',
        amountId: '',
        date: '',
        amount: '0',
        paid: '',
      });
    }

    if (identity === 'deleteDateForm') {
      if (value === '0' && inputs.paymentDate.length === 1) {
        setInputs((prevState) => ({
          ...prevState,
          paymentDate: [{ dateId: '', amountId: '', date: '', amount: '0', paid: '' }],
        }));

        return;
      }

      setInputs((prevState) => {
        const newState = { ...prevState };

        const paymentDate = newState.paymentDate[parseInt(value)];

        if (newState.moneyDuePaid !== '0' && paymentDate.paid) {
          const amountDeleted = paymentDate.amount;

          newState.deferredDownpayment = `${Number(newState.deferredDownpayment) + Number(amountDeleted)}`;

          newState.moneyDuePaid = `${Number(newState.moneyDuePaid) - Number(amountDeleted)}`;
        }

        if (paymentDate.dateId) {
          const idsDeleted = [...dateIdsDeleted, paymentDate.dateId];

          setDateIdsDeleted(idsDeleted);
        }

        newState.paymentDate = newState.paymentDate.filter(
          (el, index) => index !== parseInt(value),
        );

        return newState;
      });
    }

    if (identity === 'save') {
      const formData = new FormData();

      const ignoreInput = [
        'deferredDownpaymentToCancel',
        'paymentDate',
        'moneyDuePaid',
        'deferredDownpayment',
      ];

      for (const [name, value] of Object.entries(inputs)) {
        if (!ignoreInput.includes(name) && typeof value === 'string') {
          formData.append(name, value);
        }
      }

      if (inputs.soldDateInput) {
        formData.append('soldDateInput', inputs.soldDateInput);
      }

      formData.append('moneyDuePaid', totals.moneyDuePaid.toString());
      formData.append('deferredDownpayment', totals.deferredDownpayment.toString());

      let paymentDateSetted = false;

      for (let i = 0; i < inputs.paymentDate.length; i++) {
        const paymentDate = inputs.paymentDate[i];

        if (paymentDate.amount !== '0' || paymentDate.date) {
          paymentDateSetted = true;

          break;
        }
      }

      if (paymentDateSetted) {
        console.log('inputs.paymentDate:', inputs.paymentDate);
        const paymentDatesToSubmit = inputs.paymentDate.map((pd) => {
          if (pd.date) {
            return {
              ...pd,
              date: dateToUTCfromInputDateString(`${pd.date}, 12:00 PM`),
            };
          }
          return pd;
        });

        formData.append('paymentDates', JSON.stringify(paymentDatesToSubmit));
      }

      if (paymentDateSetted) {
        formData.append('deletedPaymentDatesIds', JSON.stringify(dateIdsDeleted));
      }

      if (singleCLientData?.id) {
        formData.append('customerId', singleCLientData.id.toString());
      } else if (selectedCustomersIds && selectedCustomersIds.length > 0) {
        const idSelected = selectedCustomersIds[currentIndex];

        formData.append('customerId', idSelected.toString());
      } else if (deal?.customer_id) {
        formData.append('customerId', deal.customer_id.toString());
      }

      const finalDealId = dealId?.toString() || inputs.id;

      if (finalDealId) {
        const apiUrl = `/api/deal/${finalDealId}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'PUT',
          options: {
            onSuccess: (data) => {
              updateDataWithSocket('setUpADeal', undefined, { customerId: parseInt(data) });

              if (!dealId && !singleCLientData && selectedCustomersIds.length > 0) {
                handleNextCustomerInBulkList();

                return;
              }

              getDeal(-1);
              closeSetUpADeal();
              if (closeModalFromParent) closeModalFromParent();
            },
          },
        });
      } else {
        const apiUrl = `/api/deal${currentLead ? `?leadId=${currentLead}` : ''}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'POST',
          options: {
            onSuccess: (data: Deal | null) => {
              if (data && data.id) {
                updateDataWithSocket('setUpADeal', undefined, { customerId: data.customer_id });

                if (singleCLientData) {
                  setInputs((prevState) => ({
                    ...prevState,
                    id: data.id.toString(),
                  }));
                }
              }

              if (!singleCLientData && selectedCustomersIds.length > 0) {
                setInputs({
                  id: '',
                  downpayment: '',
                  paid: '0',
                  bonus: '0',
                  moneyDuePaid: '0',
                  frontend: '',
                  backend: '',
                  totalProfit: '0',
                  deferredDownpayment: '0',
                  paymentDate: [{ dateId: '', amountId: '', date: '', amount: '0', paid: '' }],
                  bankId: '',
                  bankName: '',
                  sellerCommission: '0',
                  bdcCommission: '0',
                  soldDateInput: '',
                });

                handleNextCustomerInBulkList();

                return;
              }

              getDeal(-1);
              closeSetUpADeal();
              if (closeModalFromParent) closeModalFromParent();
            },
          },
        });
      }
    }
  };

  const handleDayPick = (date: Date) => {
    const formattedDate = formatIncomingObjectDate(date);
    setInputs((prev) => ({
      ...prev,
      soldDateInput: formattedDate,
    }));
  };

  //   input data

  const inputData = [
    {
      id: 1,
      value: `${inputs.downpayment}`,
      label: 'Downpayment',
      name: 'downpayment',
      type: 'text',
      width: 12,
      onChange: handleChange,
      fieldErrorWidthMaxContent: true,
      fieldErrorBgWhite: false,
    },
    {
      id: 2,
      value: inputs.paid,
      label: 'Paid',
      name: 'paid',
      type: 'text',
      width: 12,
      onChange: handleChange,
      fieldErrorWidthMaxContent: true,
      fieldErrorBgWhite: false,
    },
    {
      id: 3,
      value: inputs.bonus,
      label: 'Bonus',
      name: 'bonus',
      type: 'text',
      width: 12,
      onChange: handleChange,
      fieldErrorWidthMaxContent: true,
      fieldErrorBgWhite: false,
    },
    {
      id: 4,
      value: totals.moneyDuePaid.toString(),
      label: 'Money Due Paid',
      name: 'moneyDuePaid',
      type: 'text',
      width: 12,
      disabled: true,
      onChange: handleChange,
      fieldErrorWidthMaxContent: true,
      fieldErrorBgWhite: false,
    },
    {
      id: 5,
      value: inputs.frontend,
      label: 'Front end',
      name: 'frontend',
      type: 'text',
      width: 12,
      onChange: handleChange,
      fieldErrorWidthMaxContent: true,
      fieldErrorBgWhite: false,
    },
    {
      id: 6,
      value: inputs.backend,
      label: 'Back end',
      name: 'backend',
      type: 'text',
      width: 12,
      onChange: handleChange,
      fieldErrorWidthMaxContent: true,
      fieldErrorBgWhite: false,
    },
    {
      id: 7,
      value: inputs.totalProfit,
      label: 'Total profit',
      name: 'totalProfit',
      type: 'text',
      width: 12,
      disabled: true,
      onChange: handleChange,
      fieldErrorWidthMaxContent: true,
      fieldErrorBgWhite: false,
    },
    {
      id: 8,
      value: totals.deferredDownpayment.toString(),
      label: 'Deferred Downpayment',
      name: 'deferredDownpayment',
      type: 'text',
      width: 12,
      disabled: true,
      onChange: handleChange,
      fieldErrorWidthMaxContent: false,
      fieldErrorBgWhite: true,
    },
    {
      id: 9,
      value: inputs.bankName,
      label: 'Bank',
      name: 'bankName',
      type: 'addingSelect',
      width: 12,
      onChange: handleChange,
      fieldErrorWidthMaxContent: true,
      fieldErrorBgWhite: false,
    },
  ];

  const inputDataTwo =
    inputs.paymentDate && inputs.paymentDate.length > 0
      ? inputs.paymentDate.map((el) => {
          return [
            {
              id: 10,
              value: el.date,
              label: 'Payment Date',
              name: 'date',
              type: 'DottedDate',
              width: 12,
              disabled: true,
              onChange: handleChangePaymentDate,
            },
            {
              id: 11,
              value: el.amount,
              label: 'Amount',
              name: 'amount',
              type: 'text',
              width: 12,
              disabled: false,
              onChange: handleChangePaymentDate,
            },
            {
              id: 12,
              value: el.paid,
              label: '',
              name: 'paid',
              type: 'checkbox',
              chekcboxText: 'Paid',
              width: 1.5,
              disabled: false,
              onChange: handleChangePaymentDate,
            },
          ];
        })
      : null;

  return (
    <ModalWindow top={0} minSizeFull positionFixed height={100} overflowYScroll>
      <ModalContainer marginTop={13} width={60} positionRelative>
        <ModalContainerTitle
          title="Set up a deal"
          closeWindowFunction={() => {
            getDeal(-1);
            closeSetUpADeal();
            if (bulkSetUpADeal) openCloseBulkSetUpADeal();
            if (closeModalFromParent) closeModalFromParent();
          }}
          extraComponent={
            !singleCLientData &&
            selectedCustomersIds.length > 0 && (
              <BulkSetUpADealCustomersList
                onClick={handleBulkCustomersChange}
                loading={loading || loadingFetch}
                currentCustomerId={selectedCustomersIds[currentIndex]}
              />
            )
          }
        />
        <ModalContent
          loading={loading || loadingFetch}
          minHeight={65}
          overflowVisible
          decisionMessage={changeCustomerWarning || rejectMoneyDuePaidWarning}
          onDecision={handleDecision}
        >
          <ContentRow cols={4} gap={3} centerContent alignItems="start">
            {inputData.map((el, index) => {
              if (el.type === 'addingSelect') {
                return (
                  <BankSelect
                    key={`${el.id + index}---${index + 90}fff`}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    value={el.value}
                    name={el.name}
                    fieldErrors={fieldErrors}
                  />
                );
              }
              return (
                <Input
                  key={`${el.id + index}---${index + 90}fff`}
                  label={el.label}
                  name={el.name}
                  type={el.type}
                  value={`${
                    !['bank', 'paymentDate'].includes(el.name) && el.value !== ''
                      ? numberFormatter(el.value, true, 1)
                      : el.value
                  }`}
                  width={el.width}
                  disabled={el.disabled}
                  onChange={el.onChange}
                  fieldErrors={fieldErrors}
                  fontSize={2}
                  labelFontSize={2}
                  fieldErrorFontSize={2}
                  fieldErrorBgWhite={el.fieldErrorBgWhite}
                  // fieldErrorWidthMaxContent={el.fieldErrorWidthMaxContent}
                />
              );
            })}
            <div className="w-[12vw]">
              <Input
                label="Sold Date"
                name="soldDate"
                width={0}
                widthFull
                value={inputs.soldDateInput}
                type={'DottedDate'}
                // timeDataValue={inputs.soldDateTimeInput}
                identity="soldDate"
                fetchTimeData={true}
                disabled={false}
                onChange={() => {}}
                onDayPickerClick={handleDayPick}
                // onTimeChanged={handleTimeChange}
                dayPickerDisabledAfter={new Date()}
                fieldErrors={fieldErrors}
                noDisabledBgColor
                enableFloating
              />
            </div>
            {inputDataTwo &&
              inputDataTwo.map((el, index) => (
                <ContentRow key={`aaaaa${index + 3}`} cols={1} gap={1.5} positionRelative>
                  {el.map((elForm, elIndex) => (
                    <Input
                      key={`${elForm.id + elIndex}---${elIndex + 90}fff`}
                      label={elForm.label}
                      name={elForm.name}
                      type={elForm.type}
                      value={`${
                        !['paid', 'date', ''].includes(elForm.name)
                          ? numberFilter(elForm.value, 1)
                          : elForm.value
                      }`}
                      width={elForm.width}
                      // dayPickerDisabledbefore={new Date()}
                      onDayPickerClick={handlePickDate}
                      index={index}
                      chekcboxText={elForm.chekcboxText}
                      onChange={(event) => elForm.onChange(event, index)}
                      fieldErrors={fieldErrors}
                      fontSize={2}
                      labelFontSize={2}
                      fieldErrorFontSize={2}
                      // fieldErrorWidthMaxContent
                      disabled={elForm.disabled}
                      noDisabledBgColor
                    />
                  ))}
                  {/* {index !== 0 && ( */}
                  {
                    <Button
                      width={2}
                      height={2}
                      backgroundColor=""
                      identity="deleteDateForm"
                      textColor=""
                      buttonIcon={<CancelIcon width={1} height={1} />}
                      onClick={handleButton}
                      value={index}
                      positionAbsolute
                      top={0}
                      right={0}
                    />
                  }
                  {index === 0 && (
                    <FieldErrorMessage
                      top={25.5}
                      name="paymentDates"
                      fontSize={2}
                      fieldErrors={fieldErrors}
                      fieldErrorWidthMaxContent
                    />
                  )}
                </ContentRow>
              ))}
          </ContentRow>
          <ButtonContainer marginTop={4} widthFull justify="right" gap={2}>
            <Button
              backgroundColor="#3e64e7"
              identity="addPaymentDate"
              textColor="#FFF"
              buttonText="Add Payment Date"
              buttonTextSize={2}
              widthFitContent
              onClick={handleButton}
            />
            <Button
              backgroundColor="#00A78B"
              identity="save"
              textColor="#FFF"
              buttonText="Save"
              buttonTextSize={2}
              onClick={handleButton}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}