import {
  adminDashboardStore,
  currentSectionStore,
  messagesStore,
  modalWindowStore,
} from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { dateFormatsStore } from '@/store/dateFormats';
import { OptionButton } from './optionButton/OptionButton';
import { Filter } from './filter/Filter';
import { Users } from '@/app/libs/definitions';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';
import { useTableData } from '@/hooks/tableData';

export function UsersList() {
  // ----- global states -----

  const { closeManageUsers } = modalWindowStore();

  const { users } = adminDashboardStore();
  const { getUsers, getSystemAccesses } = adminDashboardStore();

  const { getCurrentSection } = currentSectionStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { dateFormatted } = dateFormatsStore();

  const { messages } = messagesStore();

  const getPromiseData = useCallback(() => {
    return [getSystemAccesses(), getUsers()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error } = useLoadingGetData(getPromiseData);

  useEffect(() => {
    getCurrentSection('Users list');
  }, [getCurrentSection]);

  // ----- local states -----

  const [filterValue, setFilterValue] = useState({
    name: '',
    status: '',
  });

  const [usersFilter, setUsersFilter] = useState<Users>(undefined);

  useEffect(() => {
    if (users && users.length > 0) {
      setUsersFilter(users);
    }
  }, [users]);

  const tableData = useTableData({
    data: usersFilter,
    initialItem: {
      id: '',
      username: '',
      name: '',
      lastname: '',
      phone: '',
      role: '',
      status: '',
      options: '',
      since: '',
    },
    mapper: (el) => {
      return {
        id: el.id,
        username: el.username || '',
        name: el.name,
        lastname: el.last_name,
        phone: el.mobile_phone ? formatPhoneNumber(el.mobile_phone) : '',
        role: el.user_has[0]?.role?.role || '',
        status: el.users_status?.status || '',
        options_CAN_34_35_: (
          <OptionButton userId={el.id} userName={`${el.name || ''} ${el.last_name || ''}`} />
        ),
        since: dateFormatted(2, el.created_at),
      };
    },
  });

  const initialColumnsDef = {
    username: true,
    name: true,
    lastname: true,
    phone: true,
    role: true,
    status: true,
    options: true,
    since: true,
  };

  const { columns } = useDynamicTableColumns({
    initialColumnsDef,
    excludeKeys: ['id'],
    disableTruncateOnColumns: ['options'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setFilterValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    let usersList = users;

    if (filterValue.name) {
      const valueArray = filterValue.name.toLowerCase().split(' ');

      usersList = usersList?.filter((user) => {
        const userName = user.name?.toLowerCase() || '';
        const userLastname = user.last_name?.toLowerCase() || '';
        const username = user.username?.toLowerCase() || '';

        return valueArray.every(
          (word) =>
            userName.includes(word) || userLastname.includes(word) || username.includes(word),
        );
      });
    }

    if (filterValue.status && filterValue.status !== '0') {
      const statusSelected = filterValue.status;

      usersList = usersList?.filter((user) => {
        const userStatus = user.status_id?.toString();

        return userStatus === statusSelected;
      });
    }

    setUsersFilter(usersList);
  }, [filterValue, users]);

  return (
    <ModalWindow
      top={0}
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
      positionFixed
      overflowYScroll
      height={100}
    >
      <ModalContainer width={86.510417} marginTop={6.592593}>
        <ModalContainerTitle title="Users List" closeWindowFunction={closeManageUsers} openNewTab />
        <ModalContent>
          <Filter name={filterValue.name} status={filterValue.status} onChange={handleChange} />
          <ColoredTableV2
            data={tableData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={9}
            paginationIsActive
            loading={loading}
            textColor="#FFF"
            height={54}
            rowSelectionIsActive={false}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
