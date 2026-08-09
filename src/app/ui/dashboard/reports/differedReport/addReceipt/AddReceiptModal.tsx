import { useEffect, useState } from 'react';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '@/app/ui/inputs/Input';
import { Deal } from '@/app/libs/definitions';
import { ContentRow } from '@/app/ui/modalWindowsStructure/ContentRow';
import { currencyFormat } from '../../utils';
import { messagesStore, numberFormatterStore } from '@/store/adminDashboard';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import DecimalInput from '../../../settings/usersList/userDetail/payPlan/PercentInput';
import { dateToUTCfromInputDateString } from '@/app/libs/dateTimeZone';

interface AddReceiptModalProps {
  closeWindow: (value: boolean) => void;
  dealId: number;
  onSave?: () => void;
}

export function AddReceiptModal({ closeWindow, dealId, onSave }: AddReceiptModalProps) {
  const setMessages = messagesStore(state => state.setMessages);
  const formatIncomingObjectDate = inputTypeDateFormatStore(state => state.formatIncomingObjectDate);
  const { numberFormatter, numberFilter } = numberFormatterStore();

  const [loading, setLoading] = useState(true);
  const [stockNumber, setStockNumber] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [deal, setDeal] = useState<Deal | null>(null);
  const [selectedPaymentDateId, setSelectedPaymentDateId] = useState<number | 'new' | null>(null);
  const [newPaymentDate, setNewPaymentDate] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<
    | {
        [key: string]: [string | undefined];
      }
    | undefined
  >(undefined);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await fetch(`/api/reports/storeReport/sold-customers/deal/${dealId}`);
        const data = await response.json();
        if (data.deal) {
            setDeal(data.deal);
        }
        if (data.deal && data.deal.lead && data.deal.lead.vehicle) {
            setStockNumber(data.deal.lead.vehicle.stock_no || '');
        }
      } catch (error) {
        console.error('Error fetching deal:', error);
      } finally {
        setLoading(false);
      }
    };
    if (dealId) {
        fetchDeal();
    }
  }, [dealId]);

  const handlePaymentDateSelect = (id: number | 'new') => {
    setSelectedPaymentDateId(id);
    if (id === 'new') {
        setAmount('');
        setNewPaymentDate('');
    } else {
        const payment = deal?.paymentDate.find(p => p.id === id);
        if (payment && payment.amountPerDate && payment.amountPerDate.length > 0) {
            // Assuming we pick the first amount for now, or sum them?
            // Usually amountPerDate has one entry per payment date in this context?
            // Let's check schema/data structure. Schema says AmountPerDate[]
            // But usually it's one amount per date.
            setAmount(payment.amountPerDate[0].amount.toString());
        }
    }
  };

  const handleDayPickerClick = (date: Date) => {
    setNewPaymentDate(formatIncomingObjectDate(date));
  };                                                    

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/storeReport/sold-customers/deal/${dealId}/receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockNumber,
          receiptNumber,
          amount,
          selectedPaymentDateId,
          newPaymentDate: selectedPaymentDateId === 'new' && newPaymentDate ? dateToUTCfromInputDateString(`${newPaymentDate}, 12:00 PM`) : null,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(undefined, data.successMessage || 'Receipt saved successfully');
        onSave?.();
        closeWindow(false);
      } else {
        if (data.fieldErrors) {
            setMessages('Form errors');
            setFieldErrors(data.fieldErrors);
            return;
        }
        console.error('Failed to save receipt');
        setMessages(data.serverError || 'Failed to save receipt');
      }
    } catch (error) {
      console.error('Error saving receipt:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWindow top={0}>
      <ModalContainer width={40} marginTop={5}>
        <ModalContainerTitle title="Add Receipt" closeWindowFunction={() => closeWindow(false)} />
        <ModalContent loading={loading} overflowVisible>
          <div className="flex flex-col gap-4 p-4">
            <div className='w-full gap-[2vh] grid grid-cols-2'>
              <Input
                type="text"
                name="stockNumber"
                label="Stock Number"
                value={stockNumber}
                onChange={() => {}}
                width={0}
                widthFull
                disabled
              />
              <Input
                type="text"
                name="deferred"
                label="Deferred Downpayment"
                value={currencyFormat.format(Number(deal?.deferredDownpayment || 0))}
                onChange={() => {}}
                width={0}
                widthFull
                disabled
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="font-medium text-[#B3B3B3] text-[1.6vh]">Select Payment to Apply To</label>
              <div className="flex flex-col gap-2 max-h-[20vh] pr-2">
                <ContentRow cols={2} gap={2} widthFull>
                {deal?.paymentDate?.map((payment) => (
                  <div
                    key={payment.id}
                    onClick={() => handlePaymentDateSelect(payment.id)}
                    className={`relative p-2 rounded-md border cursor-pointer transition-colors flex justify-between items-center ${
                      selectedPaymentDateId === payment.id
                        ? 'bg-[#E6F6F3] border-[#00A78B]'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${payment.amountPerDate?.[0]?.paid ? 'text-gray-500' : 'text-gray-700'}`}>
                        {new Date(payment.date).toLocaleDateString()}
                      </span>
                      {payment.amountPerDate?.[0]?.paid && (
                        <span className="flex items-center gap-1 px-2 py-[1px] rounded-full bg-green-50 text-green-700 text-[10px] font-bold border border-green-200 uppercase tracking-wide">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Paid
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-bold ${payment.amountPerDate?.[0]?.paid ? 'text-gray-400' : 'text-[#00A78B]'}`}>
                      ${payment.amountPerDate?.[0]?.amount || '0.00'}
                    </span>
                  </div>
                ))}
                </ContentRow>                     
                {fieldErrors && fieldErrors.selectedPaymentDateId && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.selectedPaymentDateId[0] || 'Required'}</p>
                )}
                <div
                  onClick={() => handlePaymentDateSelect('new')}
                  className={`p-2 rounded-md border cursor-pointer transition-colors flex justify-center items-center ${
                    selectedPaymentDateId === 'new'
                      ? 'bg-[#E6F6F3] border-[#00A78B]'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm font-medium text-[#00A78B]">+ Create New Payment Date</span>
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] bg-gray-200 my-2"></div>

            <div className="flex flex-col gap-4 items-center w-full">
              {selectedPaymentDateId === 'new' && (
                <Input
                  type="DottedDate"
                  name="newPaymentDate"
                  label="New Payment Date"
                  value={newPaymentDate}
                  onChange={e => {
                    // setNewPaymentDate(e.target.value)
                    console.log({target: e.target.value});
                  }}
                  onDayPickerClick={handleDayPickerClick}
                  width={34}
                  fieldErrors={fieldErrors}
                />
              )}
              <ContentRow cols={2} gap={2} widthFull>
                <Input
                  type="text"
                  name="receiptNumber"
                  label="Receipt Number"
                  value={receiptNumber}
                  onChange={e => setReceiptNumber(e.target.value)}
                  width={0}
                  widthFull
                  fieldErrors={fieldErrors}
                />
                <Input
                  type='text'
                  name="amount"
                  label="Amount"
                  value={amount}
                  onChange={e => {
                    // const valueClean = e.target.value.replace('$', '');
                    const formattedValue = numberFormatter(e.target.value, true);
                    setAmount(formattedValue)
                  }}
                  width={0}
                  widthFull
                  fieldErrors={fieldErrors}
                />
              </ContentRow>
              <Input
               label='Result Deferred Downpayment' 
               name= 'resultDeferredDownpayment' 
               type='text' 
               value={currencyFormat.format(Number(deal?.deferredDownpayment || 0) - Number(amount))}
               disabled 
               onChange={() => {}}
               fieldErrorWidthMaxContent={false} 
               fieldErrorBgWhite={true}
               width={0}
               widthFull
              />
            </div>
          </div>
          <ButtonContainer widthFull justify="center" gap={1} marginTop={2}>
            <Button
              buttonText="Cancel"
              identity="cancel"
              onClick={() => closeWindow(false)}
              backgroundColor="#CCC"
              textColor="#000"
              width={10}
            />
            <Button
              buttonText="Save"
              identity="save"
              onClick={handleSave}
              backgroundColor="#00A78B"
              textColor="#FFF"
              width={10}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
