import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { adminDashboardStore } from '@/store/adminDashboard';
import { useSocketStore } from '@/store/socketIo';
import { useCallback, useEffect, useState } from 'react';

export function Picker({
  customerId,
  userType,
  appId,
  leadId,
  onSuccess,
}: {
  customerId: number;
  userType: string;
  appId?: number;
  leadId?: number;
  onSuccess?: () => void;
}) {
  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();

  const { users } = adminDashboardStore();
  const { getUsers } = adminDashboardStore();

  const getPromiseData = useCallback(() => {
    return [getUsers()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const usersTypes = ['salesRep', 'bdc', 'financeManager', 'salesManager'];

  const [selectedUserName, setSelectedUserName] = useState('');
  const [options, setOptions] = useState<
    | {
        value: string;
        name: string;
      }[]
    | undefined
  >();

  useEffect(() => {
    if (users && users.length > 0) {
      const newOptions: { value: string; name: string }[] = [];

      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        const userTypeIndex = usersTypes.indexOf(userType);

        if (userTypeIndex !== -1) {
          const typeSelected = usersTypes[userTypeIndex];

          let roleId = -1;

          switch (typeSelected) {
            case 'salesRep':
              roleId = 6;
              break;

            case 'bdc':
              roleId = 5;
              break;

            case 'financeManager':
              roleId = 4;
              break;

            case 'salesManager':
              roleId = 3;
              break;
          }

          const specialUsers = [1, 2];

          if (roleId !== -1) {
            if (
              user.user_has[0]?.role?.id === roleId ||
              specialUsers.includes(user.user_has[0]?.role?.id)
            ) {
              newOptions.push({
                name: `${user.name} ${user.last_name}`,
                value: user.id.toString(),
              });
            }
          } else {
            newOptions.push({
              name: `${user.name} ${user.last_name}`,
              value: user.id.toString(),
            });
          }
        } else {
          newOptions.push({
            name: `${user.name} ${user.last_name}`,
            value: user.id.toString(),
          });
        }
      }

      setOptions(newOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, userType]);

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name, value } = e.currentTarget;

    setSelectedUserName(name);

    const formData = new FormData();

    formData.append('userId', value);

    const userTypeIndex = usersTypes.indexOf(userType);

    if (userTypeIndex !== -1) {
      formData.append('userType', userTypeIndex.toString());
    }

    if (appId) formData.append('appId', appId.toString());

    if (leadId) formData.append('leadId', leadId.toString());

    const apiUrl = `/api/userPicker/${customerId}`;

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'PUT',
      permissionForFetch: 69,
      options: {
        onSuccess: () => {
          updateDataWithSocket('dailyAppointmentsList');

          updateDataWithSocket('customersList');

          updateDataWithSocket('singleClient');

          if (onSuccess) onSuccess();
        },
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setSelectedUserName(value);
  };

  return (
    <aside className="w-full absolute/ top-[50%]/ translate-y-[-50%]/ right-[50%]/ translate-x-[50%]/ z-[1]">
      <AdderSelect
        onChange={handleChange}
        onClick={handleButton}
        label=""
        name=""
        iconTextGap={0}
        optionsBackgroundColor="#FFF"
        optionsHeight={7}
        optionsNameColor="#00a78b"
        textColor="#00a78b"
        optionsRadius={0.5}
        optionsWidth={7}
        value={selectedUserName}
        width={7}
        widthFull
        optionsContainerHeight={14}
        optionsWidthFull
        options={options}
        loading={loadingFetch || loading}
      />
    </aside>
  );
}
