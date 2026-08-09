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
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { useLoadingGetData } from '@/hooks/loadingGetData';

export function SetUpADeal({
  closeModalFromParent,
  dealId,
}: {
  closeModalFromParent?: () => void;
  dealId: number;
}) {
  // ----- global states -----

  const { bulkSetUpADeal } = modalWindowStore();
  const { closeSetUpADeal, openCloseBulkSetUpADeal } = modalWindowStore();
  // const { singleCLientData } = singleCLientDataStore();
  const { selectedCustomersIds } = adminDashboardStore();
  const { setSelectedCustomersIds } = adminDashboardStore();

  const { numberFormatter, numberFilter } = numberFormatterStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { updateDataWithSocket } = useSocketStore();

  const [dealData, setDealData] = useState<Deal>();
  const [loading, setLoading] = useState(false);

  const fectDealData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reports/storeReport/sold-customers/deal/${dealId}`);
      const data = await res.json();
      if (data && data.deal) {
        setDealData(data.deal);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fectDealData();
  }, []);

  useEffect(() => {
    const deal = dealData;
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
        bank: deal.bank?.bank || '',
        sellerCommission: deal.sellerCommission,
        bdcCommission: deal.bdcCommission,
      });
    } else {
      setInputs({
        id: '',
        downpayment: '0',
        paid: '0',
        bonus: '0',
        moneyDuePaid: '0',
        frontend: '0',
        backend: '0',
        totalProfit: '0',
        deferredDownpayment: '0',
        paymentDate: [{ dateId: '', amountId: '', date: '', amount: '0', paid: '' }],
        bank: '',
        sellerCommission: '0',
        bdcCommission: '0',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealData]);

  // ----- local states -----

  const [changeCustomerWarning, setChangeCustomerWarning] = useState('');
  const [rejectMoneyDuePaidWarning, setRejectMoneyDuePaidWarning] = useState('');
  const [indexToReturnAmount, setIndexToReturnAmount] = useState<number | null>(null);
  const [selectedCustomerIdToShow, setSelectedCustomerIdToShow] = useState('');

  const [inputs, setInputs] = useState({
    id: '',
    downpayment: '0',
    paid: '0',
    bonus: '0',
    moneyDuePaid: '0',
    frontend: '0',
    backend: '0',
    totalProfit: '0',
    deferredDownpayment: '0',
    paymentDate: [{ dateId: '', amountId: '', date: '', amount: '0', paid: '' }],
    bank: '',
    sellerCommission: '0',
    bdcCommission: '0',
  });

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

    if (name === 'bank') {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
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

      if (dateKey === 'paid' && newState.paymentDate[index].amount !== '0') {
        if (checked) {
          newState.paymentDate[index][dateKey] = checked ? '1' : '';

          let totalMoneyDuePaid = 0;

          for (let i = 0; i < newState.paymentDate.length; i++) {
            const dateForm = newState.paymentDate[i];

            if (dateForm.paid) {
              totalMoneyDuePaid = totalMoneyDuePaid + parseFloat(dateForm.amount);
            }
          }

          newState.moneyDuePaid = totalMoneyDuePaid.toFixed(2);
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

      const totalDeferredDownpayment =
        parseFloat(newState.downpayment.replace(/,/g, '')) -
        parseFloat(newState.paid.replace(/,/g, '')) -
        parseFloat(newState.bonus.replace(/,/g, '')) -
        totalToTakeOut;

      newState.deferredDownpayment = totalDeferredDownpayment.toFixed(2);

      return newState;
    });
  };

  const handlePickDate = (e: Date, index?: number) => {
    setInputs((prevState) => {
      const newState = { ...prevState };

      if (index || index === 0) {
        newState.paymentDate[index].date = formatIncomingObjectDate(e);
      }

      return newState;
    });
  };

  const handleBulkCustomersChange = (value: string) => {
    if (selectedCustomersIds[0] !== parseInt(value)) {
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
            downpayment: '0',
            paid: '0',
            bonus: '0',
            moneyDuePaid: '0',
            frontend: '0',
            backend: '0',
            totalProfit: '0',
            deferredDownpayment: '0',
            paymentDate: [{ dateId: '', amountId: '', date: '', amount: '0', paid: '' }],
            bank: '',
            sellerCommission: '0',
            bdcCommission: '0',
          });

          const selectedCustomersIdsCopy = [...selectedCustomersIds];

          const sortSelectedCustomerIds = selectedCustomersIdsCopy.sort((a) => {
            if (a === parseInt(selectedCustomerIdToShow)) {
              return -1;
            }

            return 0;
          });

          setSelectedCustomersIds(sortSelectedCustomerIds);
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

            const totalMoneyDuePaid =
              parseFloat(newState.moneyDuePaid) - parseFloat(amountToReturn);

            newState.moneyDuePaid = totalMoneyDuePaid.toFixed(2);

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
    const arrayCopy = [...selectedCustomersIds];

    const firstCurrentCustomer = arrayCopy.shift();

    if (firstCurrentCustomer) arrayCopy.push(firstCurrentCustomer);

    setSelectedCustomersIds(arrayCopy);
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
      setInputs((prevState) => {
        const newState = { ...prevState };

        const amountDeleted = newState.paymentDate[parseInt(value)].amount;

        newState.deferredDownpayment = `${
          parseFloat(newState.deferredDownpayment) + parseFloat(amountDeleted)
        }`;

        newState.paymentDate = newState.paymentDate.filter(
          (el, index) => index !== parseInt(value),
        );

        return newState;
      });
    }

    if (identity === 'save') {
      const formData = new FormData();

      const ignoreInput = ['deferredDownpaymentToCancel', 'paymentDate'];

      for (const [name, value] of Object.entries(inputs)) {
        if (!ignoreInput.includes(name) && typeof value === 'string') {
          formData.append(name, value);
        }
      }

      let paymentDateSetted = false;

      for (let i = 0; i < inputs.paymentDate.length; i++) {
        const paymentDate = inputs.paymentDate[i];

        if (paymentDate.amount !== '0' || paymentDate.date) {
          paymentDateSetted = true;

          break;
        }
      }

      if (paymentDateSetted) {
        formData.append('paymentDates', JSON.stringify(inputs.paymentDate));
      }

      // if (singleCLientData?.id) {
      //   formData.append('customerId', singleCLientData.id.toString());
      // } else if (selectedCustomersIds && selectedCustomersIds.length > 0) {
      //   const idSelected = selectedCustomersIds[0];

      //   formData.append('customerId', idSelected.toString());
      // }

      if (dealData) {
        formData.append('customerId', dealData.customer_id.toString());
      }

      if (dealId) {
        const apiUrl = `/api/deal/${dealId}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'PUT',
          options: {
            onSuccess: (data) => {
              updateDataWithSocket('setUpADeal', undefined, { customerId: parseInt(data) });
              // if (!singleCLientData && selectedCustomersIds.length > 0) {
              //   handleNextCustomerInBulkList();
              // }

              closeModalFromParent && closeModalFromParent();
              closeSetUpADeal();
            },
          },
        });
      } else {
        const apiUrl = `/api/deal/${dealId}`;

        // await makeAsyncFetch({
        //   formData,
        //   apiUrl,
        //   method: 'POST',
        //   options: {
        //     onSuccess: (data: Deal | null) => {
        //       if (data && data.id) {
        //         updateDataWithSocket('setUpADeal', undefined, { customerId: data.customer_id });
        //       //   if (singleCLientData) {
        //       //     setInputs((prevState) => ({
        //       //       ...prevState,
        //       //       id: data.id.toString(),
        //       //     }));
        //       //   }
        //       // }
        //       // if (!singleCLientData && selectedCustomersIds.length > 0) {
        //       //   setInputs({
        //       //     id: '',
        //       //     downpayment: '0',
        //       //     paid: '0',
        //       //     bonus: '0',
        //       //     moneyDuePaid: '0',
        //       //     frontend: '0',
        //       //     backend: '0',
        //       //     totalProfit: '0',
        //       //     deferredDownpayment: '0',
        //       //     paymentDate: [{ dateId: '', amountId: '', date: '', amount: '0', paid: '' }],
        //       //     bank: '',
        //       //     sellerCommission: '0',
        //       //     bdcCommission: '0',
        //       //   });

        //         // handleNextCustomerInBulkList();
        //       }
        //     },
        //   },
        // });
      }
    }
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
      value: inputs.moneyDuePaid,
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
      value: inputs.deferredDownpayment,
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
      value: inputs.bank,
      label: 'Bank',
      name: 'bank',
      type: 'text',
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
              onChange: handleChangePaymentDate,
            },
            {
              id: 11,
              value: el.amount,
              label: 'Amount',
              name: 'amount',
              type: 'text',
              width: 12,
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
            // if (bulkSetUpADeal) openCloseBulkSetUpADeal();
            closeModalFromParent && closeModalFromParent();
          }}
          // extraComponent={
          //   !singleCLientData &&
          //   selectedCustomersIds.length > 0 && (
          //     <BulkSetUpADealCustomersList
          //       onClick={handleBulkCustomersChange}
          //       loading={loading || loadingFetch}
          //     />
          //   )
          // }
        />
        <ModalContent
          loading={loading || loadingFetch}
          minHeight={65}
          overflowVisible
          decisionMessage={changeCustomerWarning || rejectMoneyDuePaidWarning}
          onDecision={handleDecision}
        >
          <ContentRow cols={4} gap={3} centerContent alignItems="start">
            {inputData.map((el, index) => (
              <Input
                key={`${el.id + index}---${index + 90}fff`}
                label={el.label}
                name={el.name}
                type={el.type}
                value={`${
                  !['bank', 'paymentDate'].includes(el.name) ? numberFilter(el.value, 1) : el.value
                }`}
                width={el.width}
                disabled={el.disabled}
                onChange={el.onChange}
                fieldErrors={fieldErrors}
                fontSize={2}
                labelFontSize={2}
                fieldErrorFontSize={2}
                fieldErrorBgWhite={el.fieldErrorBgWhite}
                fieldErrorWidthMaxContent={el.fieldErrorWidthMaxContent}
              />
            ))}
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
                      dayPickerDisabledbefore={new Date()}
                      onDayPickerClick={handlePickDate}
                      index={index}
                      chekcboxText={elForm.chekcboxText}
                      onChange={(event) => elForm.onChange(event, index)}
                      fieldErrors={fieldErrors}
                      fontSize={2}
                      labelFontSize={2}
                      fieldErrorFontSize={2}
                      fieldErrorWidthMaxContent
                    />
                  ))}
                  {index !== 0 && (
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
                  )}
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
