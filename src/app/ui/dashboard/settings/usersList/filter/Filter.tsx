import { Input } from '&/inputs/Input';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { adminDashboardStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';

export function Filter({
  name,
  status,
  onChange,
}: {
  name: string;
  status: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  const { userStatus } = adminDashboardStore();
  const { getUserStatus } = adminDashboardStore();

  useEffect(() => {
    getUserStatus();
  }, [getUserStatus]);

  // ----- local states -----

  const [options, setOptions] = useState<
    | {
        value: number | undefined;
        option: string | undefined;
      }[]
    | undefined
  >(undefined);

  useEffect(() => {
    if (userStatus && userStatus.length > 0) {
      const newState: { value: number | undefined; option: string | undefined }[] = [
        { value: 0, option: 'All' },
      ];

      for (let i = 0; i < userStatus.length; i++) {
        const status = userStatus[i];

        newState.push({
          value: status.id,
          option: status.status?.replace(status.status[0], status.status[0].toUpperCase()),
        });
      }

      setOptions(newState);
    }
  }, [userStatus]);

  return (
    <div className="pb-[3vh]">
      <ContentRow cols={2} gap={5}>
        <Input
          label="Name / Lastname / Username"
          name="name"
          type="text"
          value={name}
          backgroundColor="#FFF"
          border={0.104167}
          borderColor="#00A78B"
          placeholder="Search"
          labelSameColor
          textAlterColor="#00A78B"
          width={9.635417}
          borderRadius={1.4}
          fontSize={2}
          labelFontSize={1.95}
          onChange={onChange}
        />
        <Input
          label="User Status"
          name="status"
          type="select"
          value={status}
          backgroundColor="#FFF"
          border={0.104167}
          borderColor="#00A78B"
          labelSameColor
          textAlterColor="#00A78B"
          width={9.635417}
          borderRadius={1.4}
          fontSize={2}
          labelFontSize={1.95}
          options={options}
          onChange={onChange}
        />
      </ContentRow>
    </div>
  );
}
