import { filterDataByPermissions } from '@/app/libs/auth-helpers';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface UseTableDataProps<T, U> {
  data: T[] | undefined;
  mapper: (item: T) => U;
  initialItem: {};
}

export const useTableData = <T, U>({ data, mapper, initialItem }: UseTableDataProps<T, U>) => {
  // ----- global states -----

  const { data: session } = useSession();

  const permissions = session?.user.user_has[0]?.role.roles_has[0]?.permission_id;

  // ----- local states -----

  const [tableData, setTableData] = useState<any[]>([initialItem]);

  useEffect(() => {
    if (data && data.length > 0) {
      const mappedData = data.map(mapper);

      const filteredDataByPermissions = filterDataByPermissions(mappedData, permissions);

      setTableData(filteredDataByPermissions);
    } else {
      const filteredDataByPermissions = filterDataByPermissions([initialItem], permissions);

      setTableData(filteredDataByPermissions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, session]);

  return tableData;
};
