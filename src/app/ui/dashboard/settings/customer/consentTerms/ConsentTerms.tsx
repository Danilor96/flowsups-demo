import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { useConsentTermsStore } from '@/store/consentTerms';
import { useCallback, useEffect, useState } from 'react';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { CheckElement } from './checkElement/CheckElement';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';
import { Loader } from '&/miscellaneous/loader/Loader';

export function ConsentTerms() {
  // ----- global states -----

  const { checks, statement } = useConsentTermsStore();
  const { getChecks, getStatement } = useConsentTermsStore();

  const { updateDataWithSocket } = useSocketStore();

  const getPromiseData = useCallback(() => {
    return [getChecks(), getStatement()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error } = useLoadingGetData(getPromiseData);

  useEffect(() => {
    if (statement) {
      setStatementText(statement.consent_statement);
    }
  }, [statement]);

  useEffect(() => {
    if (checks && checks.length > 0) {
      const checkData = [...checks];

      checkData.sort((a, b) => {
        if (a.id === 3 && b.id !== 3) {
          return 1;
        }

        if (b.id === 3 && a.id !== 3) {
          return -1;
        }

        return 0;
      });

      setChecksEl(checkData);
    }
  }, [checks]);

  // ----- local states -----

  const [statementText, setStatementText] = useState('');
  const [checksEl, setChecksEl] = useState<
    { id: number; description: string; required: boolean }[]
  >([]);
  const [warningDeleteCheck, setWarningDeleteCheck] = useState('');
  const [checkIdSelected, setCheckIdSelected] = useState('');

  const handleChangeStatement = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;

    setStatementText(value);
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleSavePolicy = async () => {
    const formData = new FormData();

    formData.append('description', statementText);

    const apiUrl = `/api/consentTerms/statement/${statement?.id}`;

    await makeAsyncFetch({
      formData,
      apiUrl,
      permissionForFetch: 56,
      method: 'PUT',
      options: {
        onSuccess: () => {
          updateDataWithSocket('consentTerms');
        },
      },
    });
  };

  const handleChecksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    const { id } = e.currentTarget.dataset;

    if (id) {
      setChecksEl((prevState) => {
        const newState = [...prevState];

        const check = newState.find((el) => el.id === parseInt(id));

        if (check) {
          check.description = value;
        }

        return newState;
      });
    }
  };

  const handleCheckRequiredDeleteButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id, identity } = e.currentTarget.dataset;

    if (id) {
      if (identity === 'requered') {
        const prevValue = checksEl.find((el) => el.id === parseInt(id))?.required;

        setChecksEl((prevState) => {
          const newState = [...prevState];

          const check = newState.find((el) => el.id === parseInt(id));

          if (check && typeof prevValue === 'boolean') {
            check.required = !prevValue;
          }

          return newState;
        });
      }

      if (identity === 'delete') {
        setWarningDeleteCheck('Proceed with delete action?');

        setCheckIdSelected(id);
      }
    }
  };

  const handleSaveChecks = async () => {
    const formData = new FormData();

    formData.append('checks', JSON.stringify(checksEl));

    const apiUrl = '/api/consentTerms/checks';

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'PUT',
      permissionForFetch: 56,
      options: {
        onSuccess: () => {
          updateDataWithSocket('consentChecks');
        },
      },
    });
  };

  const returnNewId = async () => {
    const currentCheckEl = [...checksEl];

    let newId = 1;

    for (let i = 0; i < currentCheckEl.length; i++) {
      const checkEl = currentCheckEl[i];

      if (newId === checkEl.id) {
        newId = newId + 1;
      }
    }

    return newId;
  };

  const handleAddCheckEl = async () => {
    const newId = await returnNewId();

    setChecksEl((prevState) => {
      const newState = [...prevState];

      newState.push({
        id: newId,
        description: '',
        required: true,
      });

      newState.sort((a, b) => {
        if (a.id === 3 && b.id !== 3) {
          return 1;
        }

        if (b.id === 3 && a.id !== 3) {
          return -1;
        }

        return 0;
      });

      return newState;
    });
  };

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      const formData = new FormData();

      const apiUrl = `/api/consentTerms/checks/${checkIdSelected}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        permissionForFetch: 56,
        method: 'DELETE',
        options: {
          onSuccess: () => {
            updateDataWithSocket('consentChecks');
          },
        },
      });

      setWarningDeleteCheck('');
    } else {
      setWarningDeleteCheck('');
    }
  };

  return (
    <ModalContent
      loading={loading}
      minHeight={80}
      decisionMessage={warningDeleteCheck}
      onDecision={handleDecision}
      loadingConfirmation={loadingFetch}
    >
      <BorderedContent>
        <div className="relative flex flex-col gap-[1.5vh] mb-[2.5vh] overflow-hidden">
          <label htmlFor="statement" className="text-[2.3vh] text-primaryColor font-semibold max-lg:text-base">
            Policy Statement
          </label>
          <textarea
            onChange={handleChangeStatement}
            id="statement"
            spellCheck="false"
            className="w-full h-[14vh] px-[0.8vw] py-[0.8vh] resize-none outline-none border focus:outline-2 focus:outline-primaryColor border-primaryColor rounded-md text-[2vh] max-lg:text-sm max-lg:px-2"
            value={statementText}
          />
          {loadingFetch && <Loader />}
        </div>
        <ButtonContainer marginTop={2.5} marginBottom={2.5} widthFull justify="right">
          <Button
            backgroundColor="#00a78b"
            identity="save"
            textColor="#FFF"
            buttonTextSize={2}
            buttonText="Save"
            width={7}
            onClick={handleSavePolicy}
          />
        </ButtonContainer>
        <div className="relative flex flex-col gap-[1.5vh]">
          <label htmlFor="" className="text-[2.3vh] text-primaryColor font-semibold max-lg:text-base">
            Terms and Conditions to Accept
          </label>
          <ButtonContainer marginTop={0} marginBottom={1} widthFull justify="right">
            <Button
              backgroundColor="#FFF"
              identity="add"
              textColor="#00a78b"
              buttonTextSize={2}
              buttonText="Add Term/Condition"
              width={15}
              border={0.05}
              borderColor="#00a78b"
              onClick={handleAddCheckEl}
            />
          </ButtonContainer>
          <ul className="relative w-full h-[50vh] overflow-y-scroll border-x-2 border-primaryColor">
            <li className="sticky top-0 z-[1] w-full flex flex-row bg-white border-b-2 border-primaryColor text-[2.3vh] text-primaryColor font-medium px-[1vh] max-lg:text-sm">
              <p className="w-[85%]">Description</p>
              <aside className="w-[15%] flex flex-row gap-[1vw] border-l-2 border-primaryColor">
                <p className="w-[50%] text-center">Required</p>
                <p className="w-[50%] text-center">Delete</p>
              </aside>
            </li>
            {checksEl.length > 0 &&
              checksEl.map((el, index) => (
                <CheckElement
                  key={`${el.id}---checkstermsconditions33${index}`}
                  onChange={handleChecksChange}
                  onClick={handleCheckRequiredDeleteButton}
                  id={el.id}
                  description={el.description}
                  required={el.required}
                />
              ))}
          </ul>
          {loadingFetch && <Loader zIndex={2} />}
        </div>
        <ButtonContainer marginTop={2.5} widthFull justify="space-between">
          <a
            href="consent/test"
            target="_blank"
            className="flex justify-center items-center text-[2vh] text-primaryColor border border-primaryColor rounded-md px-[0.3vw] py-[0.4vh] hover:bg-primaryColor hover:text-white transition-colors"
          >
            Go to Test Page
          </a>
          <Button
            backgroundColor="#00a78b"
            identity="save"
            textColor="#FFF"
            buttonTextSize={2}
            buttonText="Save"
            width={7}
            onClick={handleSaveChecks}
          />
        </ButtonContainer>
      </BorderedContent>
    </ModalContent>
  );
}
