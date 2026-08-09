import { Input } from '&/inputs/Input';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { TrashIcon } from '&/icons/Icons';
import { messagesStore, numberFormatterStore } from '@/store/adminDashboard';
import { useCallback, useState } from 'react';
import { getData } from './amountForm.services';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { AmountForm as AmountFormType } from '@/app/api/reports/storeReport/comissionReport/types';
import { useCalendarStore } from '@/store/monthNavigation';

export function AmountForm({
  userId,
  type,
  closeFn,
}: {
  userId: number;
  type: 'spiff' | 'bonus' | 'salary';
  closeFn: () => void;
}) {
  // global states

  const { setMessages } = messagesStore();

  const { numberFormatter } = numberFormatterStore();

  const { stateToDoFetch, setStateToDoFetch } = useCalendarStore();

  const getPromiseData = useCallback(() => {
    return [fetchData()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading } = useLoadingGetData(getPromiseData);

  // local states

  const fetchData = async () => {
    const res = await getData(userId, type);

    const dataFetched = res.map((el) => ({
      id: el.id.toString(),
      amount: el.amount,
      description: el.description,
    }));

    if (dataFetched.length > 0) {
      setForms(dataFetched);
    }
  };

  const defaultValue = {
    id: '',
    amount: '',
    description: '',
  };

  const [forms, setForms] = useState([defaultValue]);
  const [deletedFormsIds, setDeletedFormsIds] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { value, name } = e.currentTarget;
    const { index } = e.currentTarget.dataset;

    if (index) {
      const i = Number(index);

      setForms((prevState) => {
        const state = [...prevState];

        if (name === 'amount') {
          state[i].amount = numberFormatter(value);
        } else {
          state[i].description = value;
        }

        return state;
      });
    }
  };

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity, index } = e.currentTarget.dataset;

    if (identity == 'add') {
      setForms((prevState) => [...prevState, { ...defaultValue }]);
    }

    if (identity == 'save') {
      await handleSave();
    }

    if (identity == 'delete' && index) {
      const idsDeleted = [...deletedFormsIds, forms[Number(index)].id];

      setDeletedFormsIds(idsDeleted);

      if (forms.length === 1) {
        setForms([{ ...defaultValue }]);

        return;
      }

      setForms((prevState) => prevState.filter((_, i) => i !== Number(index)));
    }
  };

  const [loadingFetch, setLoadingFetch] = useState(false);

  const handleSave = async () => {
    setLoadingFetch(true);

    const apiUrl = `/api/reports/storeReport/comissionReport/amount/${userId}`;

    const bodyData = {
      deletedFormsIds,
      type,
      forms,
    };

    const res = await fetch(apiUrl, { method: 'PUT', body: JSON.stringify(bodyData) });

    const json = await res.json();

    if (json?.successMessage) {
      setMessages(undefined, json.successMessage);

      setDeletedFormsIds([]);

      setStateToDoFetch(!stateToDoFetch);
    }

    if (json?.data) {
      const data: AmountFormType[] = json.data;

      const newState = data.map((el) => ({
        id: el.id.toString(),
        amount: el.amount,
        description: el.description,
      }));

      if (data.length > 0) {
        setForms(newState);
      } else {
        setForms([defaultValue]);
      }
    }

    setLoadingFetch(false);
  };

  return (
    <ModalWindow>
      <ModalContainer marginTop={7} width={80}>
        <ModalContainerTitle
          title={type.replace(type[0], type[0].toUpperCase())}
          closeWindowFunction={closeFn}
        />
        <ModalContent loading={loadingFetch || loading}>
          <ContentRow
            cols={3}
            gap={4}
            widthFull
            justifyContent="space-between"
            gridTrack="minmax(0,1fr)"
          >
            {forms.map((form, index) => (
              <div key={`amountfOrMqqqq-${index}`} className="relative flex flex-row gap-[0.5vw]">
                <Input
                  label="Amount"
                  name="amount"
                  type="text"
                  value={numberFormatter(form.amount, false, 1)}
                  width={8}
                  onChange={handleChange}
                  index={index}
                />
                <TextAreaInput
                  label="Description"
                  name="description"
                  value={form.description}
                  width={15}
                  height={10}
                  index={index}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 w-[1.2vw] h-[1.2vw]"
                  data-index={index}
                  data-identity="delete"
                  onClick={handleButton}
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </ContentRow>
          <ButtonContainer marginTop={2} widthFull justify="right" gap={1}>
            <Button
              backgroundColor="#FFF"
              identity="add"
              textColor="#00a78b"
              buttonText="Add amount"
              buttonTextSize={2}
              border={0.05}
              borderColor="#00a78b"
              widthFitContent
              onClick={handleButton}
            />
            <Button
              backgroundColor="#00a78b"
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
