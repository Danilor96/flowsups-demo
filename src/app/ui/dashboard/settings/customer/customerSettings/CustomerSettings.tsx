import { useCallback, useEffect, useState } from 'react';
import { adminDashboardStore } from '@/store/adminDashboard';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Input } from '&/inputs/Input';
import { CustomerSettingsCheckbox } from '&/miscellaneous/customerSettingsCheckbox/CustomerSettingsCheckbox';
import { HorizontalLine } from '&/miscellaneous/separators/HorizontalLine';
import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { Button } from '&/buttons/Button';
import { TagList } from '&/miscellaneous/tagList/TagList';
import { ContentRow } from '@/app/ui/modalWindowsStructure/ContentRow';
import { Paragraph } from '@/app/ui/miscellaneous/paragraph/Paragraph';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useSocketStore } from '@/store/socketIo';

interface ResponseData {
  id: number;
  active_lost_customer: boolean;
  show_followup: boolean;
  complete_all_open_tasks: boolean;
  followup_task_visibility: number;
  ignore_first_name: boolean;
  lead_lost_after: number;
  set_active_lost_customer_status_to: number;
}

export function CustomerSettings() {
  // ----- global status -----

  const { updateDataWithSocket } = useSocketStore();

  const {
    clientStatusesData,
    followupVisibility,
    customerSettings,
    emailToLead,
    taskSettings,
    taskDueTimeLimit,
  } = adminDashboardStore();
  const {
    getClientStatuses,
    getFollowupVisibility,
    getCustomerSettings,
    getEmailToLead,
    getTaskSettings,
    getTaskDueTimeLimit,
  } = adminDashboardStore();

  const getPromisesData = useCallback(() => {
    return [
      getClientStatuses(),
      getFollowupVisibility(),
      getCustomerSettings(),
      getEmailToLead(),
      getTaskDueTimeLimit(),
      getTaskSettings(),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromisesData);

  // ----- local states -----

  const [items, setItems] = useState<{ id: number | undefined; name: string | undefined }[]>([]);

  const [inputs, setInputs] = useState<{
    id: string | undefined;
    setLead: string | undefined;
    setActivated: string | undefined;
    followup: string | undefined;
    forwardIncoming: string | undefined;
    // ignoreFirstNameLastName: boolean;
    activateLostCustomerWhenContacted: boolean;
    showFollowupWindowWhenCompletingATask: boolean;
    completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken: boolean;
  }>({
    id: undefined,
    setLead: undefined,
    followup: '1',
    setActivated: '1',
    forwardIncoming: undefined,
    // ignoreFirstNameLastName: false,
    activateLostCustomerWhenContacted: false,
    showFollowupWindowWhenCompletingATask: false,
    completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken: false,
  });

  useEffect(() => {
    if (customerSettings) {
      setInputs({
        id: customerSettings.id?.toString(),
        setLead: customerSettings.lead_lost_after?.toString() || '0',
        followup: customerSettings.followup_task_visibility?.toString() || '',
        setActivated: customerSettings.set_active_lost_customer_status_to?.toString() || '',
        // ignoreFirstNameLastName: customerSettings.ignore_first_name
        //   ? customerSettings.ignore_first_name
        //   : false,
        activateLostCustomerWhenContacted: customerSettings.active_lost_customer
          ? customerSettings.active_lost_customer
          : false,
        showFollowupWindowWhenCompletingATask: customerSettings.show_followup
          ? customerSettings.show_followup
          : false,
        completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken:
          customerSettings.complete_all_open_tasks
            ? customerSettings.complete_all_open_tasks
            : false,
        forwardIncoming: undefined,
      });
    }
    if (emailToLead) {
      const newItems: { id: number | undefined; name: string | undefined }[] = [];
      emailToLead.map((el) => newItems.push({ id: el.id, name: el.lead }));
      setItems(newItems);
    }
  }, [customerSettings, emailToLead]);

  // handling buttons

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity, id } = e.currentTarget.dataset;

    if (identity === 'save') {
      if (inputs.id) {
        const formData = new FormData();

        for (const [name, value] of Object.entries(inputs)) {
          typeof value !== 'undefined' &&
            name !== 'id' &&
            name !== 'forwardIncoming' &&
            formData.append(name, `${value}`);
        }

        const apiUrl = `/api/settings/customerSettings/${inputs.id}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'PUT',
          permissionForFetch: 54,
          options: {
            onSuccess: () => {
              updateDataWithSocket('roundRobin');
            },
          },
        });
      } else {
        const formData = new FormData();

        for (const [name, value] of Object.entries(inputs)) {
          typeof value !== 'undefined' &&
            name !== 'id' &&
            name !== 'forwardIncoming' &&
            formData.append(name, `${value}`);
        }

        const apiUrl = '/api/settings/customerSettings/';

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'POST',
          permissionForFetch: 54,
          options: {
            onSuccess: (data: ResponseData) => {
              updateDataWithSocket('roundRobin');

              setInputs((prevState) => ({
                ...prevState,
                id: data.id.toString(),
              }));
            },
          },
        });
      }
    }

    if (identity === 'forwardIncoming') {
      const formData = new FormData();

      inputs.forwardIncoming && formData.append('forwardIncoming', inputs.forwardIncoming);

      const apiUrl = '/api/settings/emailToLead';

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 54,
        options: {
          onSuccess: () => {
            getEmailToLead();

            setInputs((prevState) => ({
              ...prevState,
              forwardIncoming: '',
            }));
          },
        },
      });
    }

    if (id) {
      const apiUrl = `/api/settings/emailToLead/${id}`;

      await makeAsyncFetch({
        apiUrl,
        method: 'DELETE',
        permissionForFetch: 54,
        options: {
          onSuccess: () => {
            getEmailToLead();
          },
        },
      });
    }

    if (identity === 'saveTaskSettings') {
      const formData = new FormData();

      if (taskInputs.id) {
        const apiUrl = `/api/settings/customerSettings/taskSettings/${taskInputs.id}`;

        for (const [name, value] of Object.entries(taskInputs)) {
          formData.append(name, value);
        }

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'PUT',
          permissionForFetch: 54,
          options: {
            onSuccess: () => {
              updateDataWithSocket('taskSettings');
            },
          },
        });
      } else {
        const apiUrl = '/api/settings/customerSettings/taskSettings';

        for (const [name, value] of Object.entries(taskInputs)) {
          formData.append(name, value);
        }

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'POST',
          permissionForFetch: 54,
          options: {
            onSuccess: (data) => {
              if (data) {
                setTaskInputs((prevState) => ({
                  ...prevState,
                  id: data,
                }));
              }
            },
          },
        });
      }
    }
  };

  // handling checkboxes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    // if (name === 'ignoreFirstNameLastName') {
    //   setInputs((prevState) => ({
    //     ...prevState,
    //     ignoreFirstNameLastName: !inputs.ignoreFirstNameLastName,
    //   }));
    // }

    if (name === 'activateLostCustomerWhenContacted') {
      setInputs((prevState) => ({
        ...prevState,
        activateLostCustomerWhenContacted: !inputs.activateLostCustomerWhenContacted,
      }));
    }

    if (name === 'showFollowupWindowWhenCompletingATask') {
      setInputs((prevState) => ({
        ...prevState,
        showFollowupWindowWhenCompletingATask: !inputs.showFollowupWindowWhenCompletingATask,
      }));
    }

    if (name === 'completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken') {
      setInputs((prevState) => ({
        ...prevState,
        completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken:
          !inputs.completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken,
      }));
    }

    if (
      name === 'setLead' ||
      name === 'followup' ||
      name === 'setActivated' ||
      name === 'forwardIncoming'
    ) {
      setInputs((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const inputsInfo1 = [
    // {
    //   key: 1,
    //   name: 'ignoreFirstNameLastName',
    //   checkboxText: 'Ignore first name and last name',
    //   checked: inputs.ignoreFirstNameLastName,
    //   onChange: handleChange,
    // },
    {
      key: 2,
      name: 'activateLostCustomerWhenContacted',
      checkboxText: 'Activate Lost Customer when contacted',
      checked: inputs.activateLostCustomerWhenContacted,
      onChange: handleChange,
    },
    {
      key: 3,
      name: 'showFollowupWindowWhenCompletingATask',
      checkboxText: 'Show Followup window when completing a task',
      checked: inputs.showFollowupWindowWhenCompletingATask,
      onChange: handleChange,
    },
  ];

  const inputsInfo2 = [
    {
      key: 4,
      label: 'Set the lead as lost after',
      name: 'setLead',
      type: 'number',
      value: inputs.setLead,
      width: 20.885417,
      onChange: handleChange,
      fieldError: fieldErrors,
      placeholder: 'days',
    },
    {
      key: 5,
      label: 'Set activated lost customer status to',
      name: 'setActivated',
      type: 'select',
      value: inputs.setActivated,
      width: 20.9375,
      options: clientStatusesData?.map((el) => {
        return { value: el.id, option: el.status };
      }),
      onChange: handleChange,
      fieldError: fieldErrors,
    },
    {
      key: 6,
      label: 'Followup task visibility',
      name: 'followup',
      type: 'select',
      value: inputs.followup,
      width: 20.9375,
      options: followupVisibility?.map((el) => {
        return { value: el.id, option: el.followup };
      }),
      onChange: handleChange,
      fieldError: fieldErrors,
    },
  ];

  const [timeLimit, setTimeLimit] = useState<{ value: number | undefined; option: string }[]>([]);

  useEffect(() => {
    if (taskSettings && taskSettings.id) {
      setTaskInputs({
        id: taskSettings.id.toString(),
        first: taskSettings.first_span_limit_id?.toString() || '',
        second: taskSettings.second_span_limit_id?.toString() || '',
        third: taskSettings.third_span_limit_id?.toString() || '',
      });
    }
  }, [taskSettings]);

  const [taskInputs, setTaskInputs] = useState({
    id: '',
    first: '',
    second: '',
    third: '',
  });

  const inputData = [
    {
      id: 1,
      label: 'First 24 hours',
      name: 'first',
      type: 'text',
      width: 13.5,
      value: taskInputs.first,
      disabled: true,
    },
    {
      id: 2,
      label: 'Between 48 and 72 hours',
      name: 'second',
      type: 'text',
      width: 13.5,
      value: taskInputs.second,
      disabled: true,
    },
    {
      id: 3,
      label: '72 hours and beyond',
      name: 'third',
      type: 'text',
      width: 13.5,
      value: taskInputs.third,
      disabled: true,
    },
  ];

  const handleTaskSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setTaskInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (taskDueTimeLimit && taskDueTimeLimit.length > 0) {
      const currentState: typeof timeLimit = !taskInputs.id
        ? [
            { value: undefined, option: 'select' },
            { value: undefined, option: 'off' },
          ]
        : [{ value: undefined, option: 'off' }];

      for (let i = 0; i < taskDueTimeLimit.length; i++) {
        const newLimit = taskDueTimeLimit[i];

        currentState.push({ value: newLimit.id, option: newLimit.span });
      }

      setTimeLimit(currentState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDueTimeLimit]);

  return (
    <ModalContent loading={loading || loadingFetch} minHeight={90}>
      <BorderedContent title="Customer Settings" positionRelative>
        <ButtonContainer marginTop={0} gap={1.5625}>
          {inputsInfo1.map((el) => (
            <CustomerSettingsCheckbox
              key={el.key}
              checkboxText={el.checkboxText}
              name={el.name}
              checked={el.checked}
              onChange={el.onChange}
            />
          ))}
        </ButtonContainer>
        <ButtonContainer marginTop={2}>
          <CustomerSettingsCheckbox
            checkboxText="Complete all open phone tasks when spoke to prospect disposition is taken"
            checked={inputs.completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken}
            name="completeAllOpenPhoneTasksWhenSpokeToProspectDispositionIsTaken"
            onChange={handleChange}
          />
        </ButtonContainer>
        <HorizontalLine marginTop={3.703704} marginBottom={3.703704} />
        <ButtonContainer marginTop={0} widthFull justify="space-between">
          {inputsInfo2.map((el) => (
            <Input
              key={el.key}
              label={el.label}
              name={el.name}
              type={el.type}
              value={el.value}
              width={el.width}
              options={el.options}
              onChange={el.onChange}
              labelFontSize={2}
              fieldErrors={el.fieldError}
              placeholder={el.placeholder}
            />
          ))}
        </ButtonContainer>
        <ButtonContainer marginTop={3.703704} widthFull justify="right">
          <Button
            buttonText="Save"
            backgroundColor="#00A78B"
            height={5.277778}
            identity="save"
            textColor="#FFF"
            width={6.25}
            onClick={handleBtn}
          />
        </ButtonContainer>
      </BorderedContent>
      <BorderedContent marginTop={3.703704} title="Task Settings">
        <div className="flex flex-row mb-[1vh] max-lg:flex-col max-lg:gap-2">
          <aside className="w-[15vw] max-lg:w-full">
            <Paragraph fontSize={2} color="#00a78b" fontWeight={600}>
              Time Span
            </Paragraph>
          </aside>
          <Paragraph fontSize={2} color="#00a78b" fontWeight={600}>
            Max Task Due Time
          </Paragraph>
        </div>
        <ContentRow cols={1} gap={3}>
          {inputData.map((el, index) => (
            <ContentRow key={`${el.id}ssssstasksettings;;${index + 183}`} cols={3} gap={3}>
              <aside className="w-[13.5vw] max-lg:w-full">
                <Input
                  label=""
                  name={el.name}
                  type={el.type}
                  width={el.width}
                  value={el.label}
                  disabled={el.disabled}
                  noDisabledBgColor
                  fontSize={2}
                  labelFontSize={2}
                  textAlterColor="#00a78b"
                  onChange={handleTaskSettingsChange}
                />
              </aside>
              <Input
                label=""
                name={el.name}
                type="select"
                width={10}
                value={el.value}
                options={timeLimit}
                textAlterColor="#00a78b"
                uniqueIdPrefix={`select-${el.id}-${index}`}
                onChange={handleTaskSettingsChange}
              />
            </ContentRow>
          ))}
        </ContentRow>
        <ButtonContainer marginTop={2} widthFull justify="right">
          <Button
            backgroundColor="#00a78b"
            identity="saveTaskSettings"
            textColor="#FFF"
            buttonText="Save"
            buttonTextSize={2}
            onClick={handleBtn}
          />
        </ButtonContainer>
      </BorderedContent>
      <BorderedContent marginTop={3.703704} title="Email to lead">
        <ButtonContainer marginTop={0} gap={1.302083} alignContentEnd>
          <Input
            label="Forward Incoming Leads To"
            name="forwardIncoming"
            type="text"
            value={inputs.forwardIncoming}
            width={20.885417}
            onChange={handleChange}
            labelFontSize={2}
            fieldErrors={fieldErrors}
          />
          <Button
            buttonText="Add"
            backgroundColor="#00A78B"
            height={5.277778}
            identity="forwardIncoming"
            textColor="#FFF"
            width={6.25}
            onClick={handleBtn}
          />
        </ButtonContainer>
        <TagList marginTop={2.777778} height={26.388889} items={items} onClick={handleBtn} />
        <ButtonContainer marginTop={2.777778} widthFull justify="right">
          <Button
            backgroundColor="#00A78B"
            buttonText="Integrated lead sources"
            height={5.277778}
            width={13.177083}
            identity="integratedLead"
            textColor="#FFF"
            onClick={handleBtn}
          />
        </ButtonContainer>
      </BorderedContent>
    </ModalContent>
  );
}
