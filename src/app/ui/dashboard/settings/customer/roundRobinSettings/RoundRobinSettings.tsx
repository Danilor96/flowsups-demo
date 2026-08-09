import { useEffect, useState } from 'react';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '&/inputs/Input';
import { Button } from '&/buttons/Button';
import { adminDashboardStore, messagesStore } from '@/store/adminDashboard';
import { CustomerSettingsCheckbox } from '&/miscellaneous/customerSettingsCheckbox/CustomerSettingsCheckbox';
import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { AddingSelect } from '&/inputs/addingSelect/AddingSelect';
import { TrashDeleteIcon } from '&/icons/Icons';
import {
  getRaundRobinSettings,
  getTimeSpan,
  saveRaundRobinSettings,
  updateUserInRoundRobinList,
} from '@/app/libs/services/raundRobin.services';
import { Round_robin, Time_span } from '@prisma/client';
import { Loader } from '&/miscellaneous/loader/Loader';

interface AutoReassignLeads {
  optionId: number;
  isActive: boolean;
}
interface AssignLeadsDuringStoreHours extends AutoReassignLeads {}

export function RoundRobinSettings() {
  // ----- global states -----

  const { users } = adminDashboardStore();
  const { getUsers } = adminDashboardStore();
  const { setMessages } = messagesStore();

  // ----- local states -----

  const [warningDeleteUser, setWarningDeleteUser] = useState('');

  const [settingsData, setSettingsData] = useState<Round_robin | null>(null);
  const [timeSpanData, setTimeSpanData] = useState<Time_span[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableIsLoading, setTableIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [readyForLeadsInput, setReadyForLeadsInput] = useState(false);
  const [userIdSelected, setUserIdSelected] = useState<number | null>(null);
  const [autoReassignLeadsInput, setAutoReassignLeadsInput] = useState<AutoReassignLeads>({
    optionId: 1,
    isActive: false,
  });
  const [createTaskAfterAssignNewLead, setCreateTaskAfterAssignNewLead] = useState(false);
  const [notAssignLeadsOlderThanInput, setNotAssignLeadsOlderThanInput] = useState<number | null>(
    null,
  );
  const [assignLeadsDuringStoreHours, setAssignLeadsDuringStoreHours] =
    useState<AssignLeadsDuringStoreHours>({
      optionId: 1,
      isActive: false,
    });
  const [usersMustActivateReadyForLeads, setUsersMustActivateReadyForLeads] =
    useState<boolean>(false);

  const [fieldErrors, setFieldErrors] = useState<{
    customLostReasons: [string | undefined];
  }>({
    customLostReasons: [''],
  });
  const [usersSelected, setUsersSelected] = useState<any[]>([]);

  useEffect(() => {
    const fetchSettingsData = async () => {
      setIsLoading(true);
      const [settings, timeSpan] = await Promise.all([
        getRaundRobinSettings(),
        getTimeSpan(),
        getUsers(),
      ]);
      setSettingsData(settings);
      setTimeSpanData(timeSpan);
      setReadyForLeadsInput(settings.ready_for_leads);
      setAutoReassignLeadsInput({
        optionId: settings.span_time_id || 1,
        isActive: settings.automatic_reassign_leads,
      });
      setNotAssignLeadsOlderThanInput(settings.days_until_avoid);
      setAssignLeadsDuringStoreHours({
        optionId: settings.assign_leads_during_store_hours ? 1 : 2,
        isActive:
          settings.assign_leads_during_store_hours || settings.assign_leads_during_shift_hours,
      });
      setUsersMustActivateReadyForLeads(settings.users_must_activate_ready_for_leads);
      setCreateTaskAfterAssignNewLead(settings.create_task_after_assign_new_lead);
    };
    fetchSettingsData().finally(() => setIsLoading(false));
  }, [getUsers]);

  useEffect(() => {
    if (users && users.length > 0) {
      const usersSelected = users
        .filter((el) => el.round_robin)
        .toSorted((el1, el2) => (el1.round_robin_order || 0) - (el2.round_robin_order || 0));
      setUsersSelected(usersSelected);
    }
  }, [users]);

  // handling change inputs
  const handleAutoReassignLeads = (data: Partial<AutoReassignLeads>) => {
    setAutoReassignLeadsInput({ ...autoReassignLeadsInput, ...data });
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchInput(e.currentTarget.value);
  };

  const handleUserSelected = async (option: {
    value: number | string | undefined;
    option: string | undefined;
  }) => {
    setTableIsLoading(true);

    const userId = option.value;
    const isUserAlreadySelected = usersSelected.find((el) => el.id === userId);

    if (isUserAlreadySelected || !userId) {
      setTableIsLoading(false);

      return;
    }

    const userSelected = users?.find((el) => el.id === userId);
    const res = await updateUserInRoundRobinList(userId.toString(), {
      isEnabled: true,
      readyForLeads: userSelected?.ready_for_leads,
    });
    const newUsersSelected = [...usersSelected, userSelected].toSorted(
      (el1, el2) => el1.round_robin_order - el2.round_robin_order,
    );
    setUsersSelected(newUsersSelected);
    if (res.successMessage) {
      setMessages(undefined, res.successMessage);
    }

    setTableIsLoading(false);
  };

  const handleDeleteUser = (userId: number) => {
    setWarningDeleteUser('Are you sure you want to remove this user?');

    setUserIdSelected(userId);
  };

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (userIdSelected) {
        setTableIsLoading(true);

        const res = await updateUserInRoundRobinList(userIdSelected.toString(), {
          isEnabled: false,
          readyForLeads: false,
        });

        await getUsers();

        if (res.successMessage) {
          setMessages(undefined, res.successMessage);
        }

        setUsersSelected((prev) => prev.filter((el) => el.id !== userIdSelected));

        setTableIsLoading(false);
      }

      setWarningDeleteUser('');
    } else {
      setWarningDeleteUser('');
    }
  };

  const handleActivateReadyForLeads = async (userId: number, isActive: boolean) => {
    setTableIsLoading(true);

    const res = await updateUserInRoundRobinList(userId.toString(), {
      isEnabled: true,
      readyForLeads: isActive,
    });
    if (res.successMessage) {
      setMessages(undefined, res.successMessage);
      const newUsersSelected = usersSelected.map((el) =>
        el.id === userId ? { ...el, ready_for_leads: isActive } : el,
      );
      setUsersSelected(newUsersSelected);
    }

    setTableIsLoading(false);
  };

  // handling buttons
  const handleSaveButton = async () => {
    setIsLoading(true);

    const formData = new FormData();

    formData.append('readyForLeads', readyForLeadsInput ? '1' : '0');
    formData.append('automaticReassignLeads', autoReassignLeadsInput.isActive ? '1' : '0');
    formData.append('spanTimeId', autoReassignLeadsInput.optionId.toString());
    formData.append('avoidAutomaticReassignOldersLeads', '1');
    formData.append('daysUntilAvoid', notAssignLeadsOlderThanInput?.toString() || '');

    if (assignLeadsDuringStoreHours.optionId === 1) {
      const isActive = assignLeadsDuringStoreHours.isActive ? '1' : '0';

      formData.append('assignLeadsDuringStoreHours', isActive);
      formData.append('assignLeadsDuringShiftHours', '0');
    }

    if (assignLeadsDuringStoreHours.optionId === 2) {
      const isActive = assignLeadsDuringStoreHours.isActive ? '1' : '0';

      formData.append('assignLeadsDuringStoreHours', '0');
      formData.append('assignLeadsDuringShiftHours', isActive);
    }

    formData.append('usersMustActivateReadyForLeads', usersMustActivateReadyForLeads ? '1' : '0');
    formData.append('createTaskAfterAssignNewLead', createTaskAfterAssignNewLead ? '1' : '0');

    const res = await saveRaundRobinSettings(settingsData?.id.toString() || '1', formData);

    await getUsers();

    if (res.successMessage) {
      setMessages(undefined, res.successMessage);
    }

    if (res.serverError) {
      setMessages(res.serverError);
    }

    setIsLoading(false);
  };

  return (
    <ModalContent
      flexbox
      flexCol
      loading={isLoading}
      minHeight={70}
      decisionMessage={warningDeleteUser}
      loadingConfirmation={tableIsLoading}
      onDecision={handleDecision}
    >
      <BorderedContent width={75} centerComponent title="Lead Assignment (RR)">
        <div className="flex flex-col gap-2 my-4 items-start">
          <CustomerSettingsCheckbox
            checkboxText={'Automatically assign leads when reps are ready for leads'}
            name={'autoAssignLeads'}
            checked={readyForLeadsInput}
            onChange={() => {
              setReadyForLeadsInput(!readyForLeadsInput);
            }}
          />
          <div className="flex flex-row gap-2 justify-center items-center pr-3 rounded-[1.041667vw]">
            <CustomerSettingsCheckbox
              checkboxText={
                'Automatically reassign internet leads to another rep if lead has not been dispositioned in'
              }
              name={'autoReassignLeads'}
              checked={autoReassignLeadsInput.isActive}
              onChange={() =>
                handleAutoReassignLeads({ isActive: !autoReassignLeadsInput.isActive })
              }
            />
            <select
              name="time"
              value={autoReassignLeadsInput.optionId}
              onChange={(e) => handleAutoReassignLeads({ optionId: Number(e.target.value) })}
            >
              {timeSpanData?.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.time_span}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-row gap-2 justify-center items-center">
            <span className="text-[2vh] text-[#999999] font-medium peer-checked:text-[#FFFFFF] transition-colors ease-in-out">
              Do not automatically assign/reassign leads older than
            </span>
            <Input
              label=""
              name="notAssignLeadsOlderThan"
              type="number"
              value={notAssignLeadsOlderThanInput?.toString()}
              width={3}
              onChange={(e) => setNotAssignLeadsOlderThanInput(Number(e.target.value))}
              fieldErrors={fieldErrors}
            />
            <span className="text-[2vh] text-[#999999] font-medium transition-colors ease-in-out">
              days
            </span>
          </div>
          <div className="flex flex-row gap-2 justify-center items-center pr-3 rounded-[1.041667vw]">
            <CustomerSettingsCheckbox
              checkboxText={'Assign leads to reps during'}
              name={'assignLeadsToRepsDuring'}
              checked={assignLeadsDuringStoreHours.isActive}
              onChange={() =>
                setAssignLeadsDuringStoreHours({
                  ...assignLeadsDuringStoreHours,
                  isActive: !assignLeadsDuringStoreHours.isActive,
                })
              }
            />
            <select
              name="asingLeadsDuring"
              value={assignLeadsDuringStoreHours.optionId}
              onChange={(e) =>
                setAssignLeadsDuringStoreHours({
                  ...assignLeadsDuringStoreHours,
                  optionId: Number(e.target.value),
                })
              }
            >
              <option value="1">Store hours</option>
              <option value="2">Shift hours</option>
            </select>
          </div>
          <CustomerSettingsCheckbox
            checkboxText={'Require sales rep to set themselves as "Ready for leads" every day'}
            name={'usersMustActivateReadyForLeads'}
            checked={usersMustActivateReadyForLeads}
            onChange={() => {
              setUsersMustActivateReadyForLeads(!usersMustActivateReadyForLeads);
            }}
          />
          <CustomerSettingsCheckbox
            checkboxText={'Create Task After Assign a New Lead'}
            name={'createTaskAfterAssignNewLead'}
            checked={createTaskAfterAssignNewLead}
            onChange={() => {
              setCreateTaskAfterAssignNewLead(!createTaskAfterAssignNewLead);
            }}
          />
        </div>
        <HorizontalLine marginTop={2} marginBottom={2} />
        <ButtonContainer marginTop={0} alignContentEnd gap={1.3}>
          <AddingSelect
            name="addingUser"
            label="Assignment Users"
            value={searchInput}
            width={25}
            disabled={tableIsLoading}
            options={users?.map((el) => ({ value: el.id, option: `${el.name} ${el.last_name}` }))}
            onChange={handleSearch}
            onSelect={handleUserSelected}
          />
        </ButtonContainer>
        <div className="mt-4 w-full">
          <table className="relative w-full h-fit border-[0.130208vw] border-[#92CEC3] rounded-[0.520833vw]">
            {tableIsLoading && <Loader zIndex={2} />}
            <thead>
              <tr className="h-[4.907407vh] text-[2vh] font-bold text-[#00A78B] text-center bg-gray-100 *:min-w-[7vw]">
                <td className="text-left pl-6">Name</td>
                <td>Ready for leads status</td>
                <td></td>
              </tr>
            </thead>
            <tbody className="text-[2vh] font-normal text-gray-700">
              {usersSelected && usersSelected.length > 0 ? (
                usersSelected.map((el, index) => (
                  <tr key={el.id} className="h-[5.740741vh] even:bg-gray-100  text-center">
                    {/* name */}
                    <td className="text-left pl-6">{`${el.name && el.name} ${
                      el.last_name && el.last_name
                    }`}</td>
                    {/* stutus */}
                    <td>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          checked={el.ready_for_leads}
                          type="checkbox"
                          onChange={() => handleActivateReadyForLeads(el.id, !el.ready_for_leads)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00A78B]"></div>
                      </label>
                    </td>
                    {/* delete button */}
                    <td className="text-left">
                      <Button
                        backgroundColor=""
                        height={5.277778}
                        width={6.25}
                        textColor="#FFF"
                        identity="deleteUser"
                        buttonIcon={<TrashDeleteIcon />}
                        onClick={() => handleDeleteUser(el.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="odd:bg-[#00A78B] even:bg-[#92CEC3] h-[5.740740vh] text-center">
                  <td>No Users Selected</td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ButtonContainer marginTop={3.703704} widthFull justify="right">
          <Button
            buttonText="Save"
            backgroundColor="#00A78B"
            height={5.277778}
            identity="save"
            textColor="#FFF"
            width={6.25}
            onClick={handleSaveButton}
          />
        </ButtonContainer>
      </BorderedContent>
    </ModalContent>
  );
}
