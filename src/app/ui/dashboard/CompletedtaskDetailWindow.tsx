import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ModalWindow } from '../modalWindowsStructure/ModalWindow';
import { ModalContainer } from '../modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '../modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '../modalWindowsStructure/ModalContent';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';
import { ContentRow } from '../modalWindowsStructure/ContentRow';
import { Input } from '../inputs/Input';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { MultiOptionsSelect } from '../miscellaneous/multiOptionsSelect/MultiOptionsSelect';
import { TextAreaInput } from '../inputs/TextAreaInput';
import { ButtonContainer } from '../buttons/ButtonContainer';
import { Button } from '../buttons/Button';
import { useSocketStore } from '@/store/socketIo';
import { TaskSlideStatusIcon } from '../miscellaneous/taskSlideStatusIcon/TaskSlideStatusIcon';

export function CompletedTaskDetailWIndow({
  handleNextTaskOrder,
}: {
  handleNextTaskOrder: () => Promise<true | undefined>;
}) {
  // ----- global states -----
  const { data: session } = useSession();

  const userId = session?.user.id;

  const { closeCompletedTaskDetail } = modalWindowStore();

  const { sellersData, singleClientTasks } = adminDashboardStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  const { updateDataWithSocket } = useSocketStore();

  // ----- local states -----

  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpDateTime, setFollowUpDateTime] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [completedBy, setCompletedBy] = useState(userId?.toString() || '');
  const [noteInput, setNoteInput] = useState('');

  const { fieldErrors, loadingFetch, makeAsyncFetch, setManualFieldErrors } = useAsyncFetching();

  const handleSave = async () => {
    if (noteInput && completedBy) {
      const formData = new FormData();

      formData.append('noteInput', noteInput);
      formData.append('assignedTo', JSON.stringify(assignedTo));
      formData.append('followUpDate', followUpDate);
      formData.append('completedBy', completedBy);

      const apiUrl = `/api/adminDashboard/tasks/followUp/${singleClientTasks?.id}`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'PUT',
        options: {
          onSuccess: async () => {
            updateDataWithSocket('tasks');

            updateDataWithSocket('dailyTotals');

            const dontUpdateThis = await handleNextTaskOrder();

            updateDataWithSocket('taskDetail', undefined, {
              taskId: singleClientTasks?.id,
              dontUpdateThis,
            });

            closeCompletedTaskDetail();
          },
        },
      });
    } else {
      setManualFieldErrors({
        noteInput: !noteInput ? ['Note is required'] : [''],
        completedBy: !completedBy ? ['Required'] : [''],
      });
    }
  };

  const handleDayPick = (e: Date) => {
    setFollowUpDate(formatIncomingObjectDate(e));
    setFollowUpDateTime('');
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.currentTarget;

    setFollowUpDateTime(value);
    setFollowUpDate(followUpDate ? `${followUpDate.split(',')[0]}, ${value}` : followUpDate);
  };

  const handleAssigned = (value: string[]) => {
    setAssignedTo(value);
  };

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer marginTop={11} width={45.520833}>
        <ModalContainerTitle
          title="Task Detail"
          closeWindowFunction={closeCompletedTaskDetail}
          extraTitleComponent={
            singleClientTasks?.task_status?.status && (
              <TaskSlideStatusIcon
                statusId={singleClientTasks?.status}
                status={singleClientTasks?.task_status.status}
              />
            )
          }
        />
        <ModalContent loading={loadingFetch}>
          <ContentRow
            cols={2}
            gap={0}
            widthFull
            justifyContent="space-between"
            marginBottom={4.351852}
          >
            <Input
              label="Follow Up Date"
              name="followUpDate"
              width={17}
              value={followUpDate}
              type="DottedDate"
              timeDataValue={followUpDateTime}
              identity="followUpDate"
              fetchTimeData={true}
              dayPickerDisabledbefore={new Date()}
              disabled={true}
              onChange={() => {}}
              onDayPickerClick={handleDayPick}
              onTimeChanged={handleTimeChange}
              dontCloseDatePickerAfterPick={true}
              showTimeAdvise={true}
              noDatePickerYearSelect={true}
              fieldErrors={fieldErrors}
              noDisabledBgColor={true}
              inputWidth={85}
              selectBtnWidth={15}
            />
            <MultiOptionsSelect
              label="Assigned To"
              width={17}
              optionsSelected={assignedTo}
              options={sellersData?.map((el) => ({
                value: el.id,
                option: `${el.name || ''} ${el.last_name || ''}${
                  el.username ? ` - ${el.username}` : ''
                }`,
              }))}
              fieldErrors={fieldErrors}
              name="assignedTo"
              onClick={handleAssigned}
            />
          </ContentRow>
          <Input
            type="select"
            options={sellersData?.map((el) => ({
              value: el.id,
              option: `${el.name || ''} ${el.last_name || ''}${
                el.username ? ` - ${el.username}` : ''
              }`,
            }))}
            value={completedBy}
            name="completedBy"
            label="Completed By"
            width={17}
            fieldErrors={fieldErrors}
            onChange={(e) => setCompletedBy(e.currentTarget.value)}
          />
          <TextAreaInput
            width={0}
            widthFull
            label="Note"
            value={noteInput}
            name="noteInput"
            marginTop={4.351852}
            height={19.351852}
            fieldErrors={fieldErrors}
            onChange={(e) => setNoteInput(e.currentTarget.value)}
          />
          <ButtonContainer marginTop={4.351852} widthFull justify="right">
            <Button
              width={11.875}
              backgroundColor="#00A78B"
              identity=""
              textColor="#FFF"
              buttonText="Save"
              onClick={handleSave}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
