import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { adminDashboardStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { dateFormatsStore } from '@/store/dateFormats';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';

export function SingleUserHistory({
  setAccessHistory,
}: {
  setAccessHistory: React.Dispatch<boolean>;
}) {
  // ----- global states -----

  const { selectedUserSystemAccess, systemAccessesData } = adminDashboardStore();

  const { setSelectedUserSystemAccess } = adminDashboardStore();

  const { dateFormatted } = dateFormatsStore();

  // ----- local states -----

  const [user, setUser] = useState('');

  const [tableData, setTableData] = useState<any>([
    {
      id: '',
      user: '',
      entry_date: '',
      exit_date: '',
    },
  ]);

  const initialColumnsDef = {
    user: true,
    entry_date: true,
    exit_date: true,
  };

  const { columns } = useDynamicTableColumns({
    initialColumnsDef,
    excludeKeys: ['id'],
  });

  useEffect(() => {
    if (systemAccessesData && systemAccessesData.length > 0 && selectedUserSystemAccess) {
      const newData: any[] = [];

      const filteredData = systemAccessesData
        .filter((el) => el.user_id === selectedUserSystemAccess)
        .sort((a, b) => {
          if (a.entry_date > b.entry_date) {
            return -1;
          }

          if (a.entry_date < b.entry_date) {
            return 1;
          }

          return 0;
        });

      const userSelected = `${filteredData[0]?.user.name || 'No entries registered'} ${
        filteredData[0]?.user?.last_name || ''
      }${filteredData[0]?.user?.username ? ` - ${filteredData[0]?.user?.username}` : ''}`;

      setUser(userSelected);

      for (let i = 0; i < filteredData.length; i++) {
        const singleHistory = filteredData[i];

        newData.push({
          id: singleHistory.id,
          user: userSelected,
          entry_date: dateFormatted(3, singleHistory.entry_date),
          exit_date: dateFormatted(3, singleHistory.exit_date),
        });
      }

      setTableData(newData);
    } else {
      setTableData([
        {
          id: '',
          user: '',
          entry_date: '',
          exit_date: '',
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserSystemAccess, systemAccessesData]);

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer width={72} marginTop={7}>
        <ModalContainerTitle title={user} closeWindowFunction={() => setAccessHistory(false)} />
        <ModalContent>
          <ColoredTableV2
            data={tableData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            itemsPerPage={10}
            paginationIsActive
            textColor="#FFF"
            height={65}
            bodyTrHeight={6}
            rowSelectionIsActive={false}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
