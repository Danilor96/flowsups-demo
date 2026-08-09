import { useEffect, useState } from 'react';
import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { PlusIcon } from '@/app/ui/icons/Icons';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { AnimatePresence, motion } from 'framer-motion';
import DecimalInput from '../../../settings/usersList/userDetail/payPlan/PercentInput';
import { FieldErrorMessage } from '@/app/ui/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { ButtonContainer } from '@/app/ui/buttons/ButtonContainer';
import { Button } from '@/app/ui/buttons/Button';
import { messagesStore } from '@/store/adminDashboard';
import { currencyFormat } from '../../utils';
import { MonthNavigator } from '@/app/ui/miscellaneous/monthNavigator/MonthNavigator';
import { useCalendarStore } from '@/store/monthNavigation';
import { getMonthDateRangeParams } from '@/app/libs/monthAndYearDateFilter';

interface ChargesBack {
  id: number;
  description: string;
  amount: string;
  created_at: Date;
  business_id: number;
  newAdd?: boolean
}

export function AddChargeBack({ closeWindow }: CloseWindow) {
  const { setMessages } = messagesStore();
  const { currentMonth, currentYear, resetMonthFilter, setFetchingData } = useCalendarStore();

  // handling close window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  // table data
  const [tableData, setTableDate] = useState<ChargesBack[]>([]);
  const [loading, setLoading] = useState(false);
  const [newChargesBack, setNewChargeBack] = useState<ChargesBack[]>([]);
  const [showNewChargeModal, setShowNewChargeModal] = useState(false);
  
  const initialColumnsDef = {
    description: true,
    amount: true,
  };

  const { columns } = useDynamicTableColumns<ChargesBack, typeof initialColumnsDef>({
    initialColumnsDef,
    excludeKeys: ['id'],
    columnRenderers: {
      description: (el) => el.description,
      amount: (el) => currencyFormat.format(el.amount),
    }
  });

  const fechData = async () => {
    const urlParams = getMonthDateRangeParams(currentMonth, currentYear);
    try {
      setLoading(true);
      // const dateQueryString = undefined; // buildDateQueryString(filter);
      const response = await fetch(`/api/reports/salesLog/charges?${urlParams || ''}`);
      const data = (await response.json()) as ChargesBack[];
      setTableDate(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching activity counts:', error);
    }
  };
  useEffect(() => {
    fechData();
  }, [currentMonth, currentYear]);

  // handling add charge back
  const handleAddChargeBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const newChargeBack = {
      id: tableData.length + newChargesBack.length + 1,
      description: '',
      amount: '',
      created_at: new Date(),
      business_id: 1,
      newAdd: true
    };

    setNewChargeBack((prevState) => [...prevState, newChargeBack]);
  };

  const updateNewChargeBack = (id: number, data: {amount?: string , description?: string }) => {
    const updatedChargesBack = newChargesBack.map((chargeBack) => {
      if (chargeBack.id === id) {
        return { ...chargeBack, ...data };
      }
      return chargeBack;
    });
    setNewChargeBack(updatedChargesBack);
  }

  const saveChargePOST = async ({amount, description}: {amount: string, description: string}) => {
    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('description', description);
      const response = await fetch('/api/reports/salesLog/charges', {
        method: 'POST',
        body: formData
      });
      if(!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if(data.serverError || '') {
        return setMessages(data.serverError || '');
      }

      if(data.successMessage) {
        setMessages(undefined,data.successMessage);
        fechData();
      }

      return data;
    } catch (error) {
      setMessages('An error occurred');
      console.error('Error fetching activity counts:', error);
    }
  }

  const specialButton = () => setShowNewChargeModal(true); // handleAddChargeBack;
  const specialButtonHeight = 5.740741;
  const specialButtonBackgroundColor = '#92CEC375';
  const specialButtonText = 'Add Charge Back';
  const specialButtonTextColor = '#00A78B';
  const specialButtonTextSize = 1.851852;
  const specialButtonIcon = <PlusIcon />;

  return (
    <ModalWindow top={0} minSizeFull>
      <ModalContainer width={82.916667} marginTop={4.6296296}>
        <ModalContainerTitle
          title="Add Charge back"
          closeWindowFunction={handleCloseWindow}
          extraComponent={
            <div className="ml-[-10vw]">
              <MonthNavigator />
            </div>
          }
        />
        <ModalContent>
          <ColoredTableV2
            data={tableData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            loading={loading}
            textColor="#FFF"
            height={54}
            rowSelectionIsActive={false}
            extraComponent={
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="rounded-b rounded-md w-full flex flex-row justify-center items-center gap-[0.833333vw]"
                style={{
                  height: `${specialButtonHeight}vh`,
                  color: specialButtonTextColor,
                  backgroundColor: specialButtonBackgroundColor,
                  fontSize: `${specialButtonTextSize}vh`,
                }}
                onClick={specialButton}
              >
                {specialButtonIcon}
                <p>{specialButtonText}</p>
              </motion.button>
            }
          />
          <AnimatePresence>
            {showNewChargeModal && (
              <NewChargesModal saveCharge={saveChargePOST} handleCloseWindow={() => setShowNewChargeModal(false)} />
            )}
          </AnimatePresence>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}


const NewChargesModal = ({ handleCloseWindow, saveCharge }: { handleCloseWindow: () => void, saveCharge: ({ amount, description }: { amount: string, description: string }) => void }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: [string | undefined] }>({});
  const widthFull = true;

  const handleSaveCharge = () => {
    if(!amount) {
      setFieldErrors({ amount: ['Please enter an amount'] })
      return
    }

    if(!description) {
      setFieldErrors({ description: ['Please enter a description'] })
      return
    }

    if (amount && description) {
      saveCharge({ amount, description });
      handleCloseWindow();
    }
  }

  return (
    <ModalWindow top={0} minSizeFull>
      <ModalContainer width={50} marginTop={20}>
        <ModalContainerTitle title="Add New Charge" closeWindowFunction={handleCloseWindow} />
        <ModalContent>
          <DecimalInput
            label={'Amount'}
            name={'amount'}
            onChange={e => setAmount(e.target.value)}
            value={amount}
            width={7}
            placeholder="0.00"
            fieldErrors={fieldErrors}
            type="money"
          />
          <article
            className="relative h-full mt-[1.5vh]"
            style={{
              width: widthFull ? '100%' : '90%',
            }}
          >
            <textarea
              spellCheck="false"
              name="description"
              id="description"
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full h-full outline-none bg-[#F4F4F4] font-medium text-[#959595] resize-none pt-[1.5vh]"
              style={{
                paddingInline: widthFull ? '0.5vw' : '',
                lineHeight: widthFull ? '2.5vh' : '1.805556vh',
                fontSize: widthFull ? '1.8vh' : '1.666667vh',
              }}
            />
            <FieldErrorMessage name="description" fieldErrors={fieldErrors} fieldErrorWidthMaxContent />
          </article>
          <ButtonContainer marginTop={1} alignContentEnd widthFull>
            <Button
              onClick={() => {
                handleSaveCharge();
              }}
              backgroundColor="#00A78B"
              textColor="#FFF"
              width={10.416667}
              height={5.740741}
              borderRadius={0.468085}
              identity="save"
              buttonText="Save"
              iconTextGap={1.145833}
            >
            </Button>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
};