import { SingleUser } from '@/app/libs/definitions';
import { adminDashboardStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export function useUserPermission() {
  const users = adminDashboardStore(state => state.users);
  const [idsSelected, setIdsSelected] = useState<number[]>([]);
  const [onlyManagers, setOnlyManagersValue] = useState(false);

  const currentUser = useSession().data?.user;


  const handleUserSelect = (id: number) => {
    if (idsSelected.includes(id)) {
      setIdsSelected(idsSelected.filter(item => item !== id));
    } else {
      setIdsSelected([...idsSelected, id]);
    }
  };

  const selectAllManagers = () => {
    const roleIsManager = (user: SingleUser) =>
      user?.user_has?.some(
        userHas => userHas.role.id === 3 || userHas.role.id === 4 || userHas.role.id === 1 || userHas.role.id === 2
      );
    const managers = users?.filter(user => roleIsManager(user as SingleUser));
    const newUserIdsSelected = managers?.map(manager => manager.id);
    setIdsSelected(newUserIdsSelected || []);
  };

  const setOnlyManagers = (value: boolean) => {
    setOnlyManagersValue(value);
    if (value) selectAllManagers();
    else setIdsSelected(users?.map(user => user.id) || []);
  };

  return {
    users : users?.filter(user => user.id !== currentUser?.id),
    idsSelected,
    onlyManagers,
    selectAllManagers,
    setOnlyManagers,
    setIdsSelected,
    handleUserSelect
  };
}
