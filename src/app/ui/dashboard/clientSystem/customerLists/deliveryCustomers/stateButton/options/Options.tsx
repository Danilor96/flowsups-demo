import { Options } from '&/miscellaneous/optionsButton/options/Options';
import { adminDashboardStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';

enum RequiredCustomerStatusIds {
  Undelivery = 5,
  Sold = 10,
}

export function DeliveryOptions({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  const { clientStatusesData } = adminDashboardStore();

  // ----- local states -----

  const [options, setOptions] = useState<{ id: number; option: string }[]>([]);

  useEffect(() => {
    if (clientStatusesData && clientStatusesData.length > 0) {
      const requiredStatuses = clientStatusesData.map((el) => {
        if (
          el.id === RequiredCustomerStatusIds.Sold ||
          el.id === RequiredCustomerStatusIds.Undelivery
        ) {
          return {
            id: el.id,
            option: el.status.toLowerCase(),
          };
        }
      });

      const newState = requiredStatuses.filter((el) => el !== undefined);

      setOptions(newState);
    }
  }, [clientStatusesData]);

  return (
    <aside className="absolute top-[50%] translate-y-[-50%]">
      <Options
        identity=""
        itemId={1}
        optionsBackgroundColor="#FFF"
        optionsHeight={4}
        optionsRadius={0.5}
        optionsWidth={6}
        options={options}
        onClick={onClick}
      />
    </aside>
  );
}
