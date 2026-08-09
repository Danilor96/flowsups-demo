import { adminDashboardStore, currentSectionStore, modalWindowStore } from '@/store/adminDashboard';
import { StarIcon } from '&/icons/Icons';
import React, { useCallback, useEffect, useState } from 'react';
import 'react-day-picker/dist/style.css';
import { useSocketStore } from '@/store/socketIo';
import { Input } from '&/inputs/Input';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { RegularSearchableSelect } from '../../select/regularSearchableSelect/RegularSearchableSelect';
import UserAssignmentSelector from '@/app/ui/select/UserAssignmentSelector/UserAssignmentSelector';
import { Users } from '@/app/libs/definitions';
import { AnimatePresence, motion } from 'framer-motion';

const Type_Requirement  = {
  'ID' : 'ID',
  'POR' : 'POR',
  'POI' : 'POI',
  'OTHER' : 'OTHER',
}

export function AddManagerTask({
  isTypeBank,
  isTypeBankManager,
  customerId,
  assignedToIds,
  onCloseWindow,
  reloadData,
}: {
  isTypeBank?: boolean;
  isTypeBankManager?: boolean;
  customerId?: number;
  assignedToIds?: string[];
  onCloseWindow?: () => void;
  reloadData?: () => Promise<void>;
}) {
  // ----- global states -----
  const { updateDataWithSocket } = useSocketStore();

  const { closeAddManagerTask } = modalWindowStore();

  const { sellersData } = adminDashboardStore();
  const { getSellers } = adminDashboardStore();

  const { getCurrentSection } = currentSectionStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const getPromiseData = useCallback(() => {
    return [getSellers()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData);

  useEffect(() => {
    getCurrentSection('Manager Task');
  }, [getCurrentSection]);

  // ----- local states -----

  const [inputs, setInputs] = useState<{
    followUpDateInput: string;
    followUpDateTimeInput: string;
    assigned: string[];
    subject: string;
    noteInput: string;
  }>({
    followUpDateInput: '',
    followUpDateTimeInput: '',
    assigned: assignedToIds || [],
    subject: '',
    noteInput: '',
  });

  const [requirementOptionSelected, setRequirementOptionSelected] = useState<keyof typeof Type_Requirement | null>(null);

  const returnAssignedUsersEmails = (usersIds: string[]) => {
    const emails: string[] = [];

    if (usersIds.length > 0 && sellersData) {
      const usersList = [...sellersData];

      const usersSelected = usersList.filter(el => usersIds.includes(el.id.toString()));

      for (let i = 0; i < usersSelected.length; i++) {
        const user = usersSelected[i];

        emails.push(user.email);
      }
    }

    return emails;
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleSave = async () => {
    const formData = new FormData();

    formData.append('noteInput', inputs.noteInput);
    formData.append('assigned', JSON.stringify(inputs.assigned));
    if (inputs.followUpDateInput) {
      formData.append('finalDate', new Date(inputs.followUpDateInput).toISOString());
    }
    formData.append('subject', inputs.subject);

    const apiForManagerUrl = '/api/adminDashboard/managerTask';
    // const apiForBankUrl = `/api/adminDashboard/lead/addTask/${customerId}`;
  
    if (isTypeBankManager || isTypeBank) {
      formData.append('customerId', `${customerId}`);
      // formData.append('requirement', requirementOptionSelected || '');
      formData.append('isTypeBank', `${isTypeBankManager || isTypeBank}`);
      formData.append('isTaskBankForManager', `${isTypeBankManager || false }`);
      formData.delete('subject');
      formData.append('subject', `${requirementOptionSelected ? Type_Requirement[requirementOptionSelected] : ''}`);
    }

    const usersEmails = returnAssignedUsersEmails(inputs.assigned);

    await makeAsyncFetch({
      formData,
      apiUrl: apiForManagerUrl,
      method: 'POST',
      options: {
        onSuccess: () => {
          setInputs({
            followUpDateInput: '',
            followUpDateTimeInput: '',
            assigned: [],
            subject: '',
            noteInput: '',
          });

          for (let i = 0; i < usersEmails.length; i++) {
            const email = usersEmails[i];

            updateDataWithSocket('tasks', email);
          }
          onCloseWindow?.();
          closeAddManagerTask();
          reloadData?.();
        },
      },
    });
  };

  const handleDayPick = (e: Date) => {
    setInputs(prevState => ({
      ...prevState,
      followUpDateInput: formatIncomingObjectDate(e),
      followUpDateTimeInput: '',
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;

    setInputs(prevState => ({
      ...prevState,
      followUpDateTimeInput: value,
      followUpDateInput: inputs.followUpDateInput
        ? `${inputs.followUpDateInput.split(',')[0]}, ${value}`
        : inputs.followUpDateInput,
    }));
  };

  const handleAssignedSelected = (value: string[]) => {
    setInputs(prevState => ({
      ...prevState,
      assigned: value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { value, name } = e.currentTarget;

    setInputs(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const optionsRequirement = Object.keys(Type_Requirement).map(key => ({
    value: key,
    name : key
  }))

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer width={45.520833} marginTop={11}>
        <ModalContainerTitle
          title={isTypeBank && !isTypeBankManager ? 'Add Bank Task' : 'Add Manager Task'}
          extraTitleComponent={!isTypeBank ? <StarIcon /> : null}
          closeWindowFunction={() => {
            closeAddManagerTask();
            onCloseWindow?.();
          }}
        />
        <ModalContent loading={loading || loadingFetch}>
          {/* <ContentRow cols={2} widthFull alignItems='start' gap={0} marginBottom={4.351852}> */}
          <div className="flex flex-row gap-[2vw] items-start justify-start">
            <div className="flex flex-col gap-[2.8vh]">
              <Input
                label="Follow Up Date"
                name="finalDate"
                width={16.44}
                value={inputs.followUpDateInput}
                type={'DottedDate'}
                timeDataValue={inputs.followUpDateTimeInput}
                identity="followUpDate"
                fetchTimeData={true}
                dayPickerDisabledbefore={new Date()}
                disabled={true}
                onChange={() => {}}
                onDayPickerClick={handleDayPick}
                onTimeChanged={handleTimeChange}
                dontCloseDatePickerAfterPick
                showTimeAdvise
                noDatePickerYearSelect
                fieldErrors={fieldErrors}
                noDisabledBgColor
              />
              {!isTypeBank && !isTypeBankManager && (
                <Input
                  label="Subject"
                  name="subject"
                  type="text"
                  value={inputs.subject}
                  width={16.44}
                  onChange={handleChange}
                  fieldErrors={fieldErrors}
                />
              )}
              {(isTypeBank || isTypeBankManager) && (
                <RegularSearchableSelect
                  label="Requirement"
                  name="requirement"
                  iconTextGap={0}
                  value={requirementOptionSelected || ''}
                  onClick={(value: any, identity) => {
                    setRequirementOptionSelected(value || null);
                  }}
                  optionsBackgroundColor="#FFF"
                  optionsHeight={4}
                  optionsPaddingY={1}
                  optionsRadius={0}
                  width={16.44}
                  optionsWidth={16.44}
                  options={optionsRequirement}
                />
              )}
            </div>
            <div className="w-full h-fit flex items-start justify-start">
              <UserAssignmentSelector
                label="Assigned to"
                width="w-full"
                users={(sellersData as Users) || []}
                defaultValue={inputs.assigned}
                onChange={handleAssignedSelected}
                // isMultiSelect={!(isTypeBank || isTypeBankManager)}
                isMultiSelect={true}
                enableFloating={true}
              />
              <AnimatePresence>
                {fieldErrors?.assigned && fieldErrors.assigned.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute top-[100%] z-[1] text-[#F00] text-[1.666667vh]"
                  >
                    {fieldErrors.assigned[0]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* </ContentRow> */}
          <TextAreaInput
            label={`${isTypeBank || isTypeBankManager ? 'Note' : 'Description'}`}
            name="noteInput"
            value={inputs.noteInput}
            width={0}
            height={16}
            widthFull
            marginTop={3}
            fieldErrors={fieldErrors}
            onChange={handleChange}
          />
          <ButtonContainer marginTop={5.740741} widthFull justify="right">
            <Button
              backgroundColor="#00A78B"
              identity=""
              textColor="#FFF"
              buttonText="Save"
              width={11.875}
              buttonTextSize={2}
              onClick={handleSave}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
