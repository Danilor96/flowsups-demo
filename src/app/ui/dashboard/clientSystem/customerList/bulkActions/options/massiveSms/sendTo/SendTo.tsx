import { Clients } from '@/app/libs/definitions';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { adminDashboardStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { HandleCustomersList } from './handleCustomersList/HandleCustomerList';
import { CustomerRecipient } from './customerRecipient/CustomerRecipient';

export function SendTo({
  gridColumns,
  showEmails,
}: {
  gridColumns?: number;
  showEmails?: boolean;
}) {
  // ----- global states -----

  const clients = adminDashboardStore((state) => state.clients);
  const selectedCustomersIds = adminDashboardStore((state) => state.selectedCustomersIds);

  const singleCLientData = singleCLientDataStore((state) => state.singleCLientData);

  // ----- local states -----

  const [customers, setCustomers] = useState<Clients>([]);

  useEffect(() => {
    if (selectedCustomersIds.length > 0) {
      const newData: Clients = [];

      for (let i = 0; i < selectedCustomersIds.length; i++) {
        const selectedId = selectedCustomersIds[i];

        const pushCustomer = clients?.find((customer) => customer.id === selectedId);

        if (pushCustomer) newData.push(pushCustomer);
      }

      setCustomers(newData);
    } else {
      setCustomers([]);
    }
  }, [selectedCustomersIds, clients]);

  const testData = [
    {
      id: 1,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 2,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 3,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 4,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 5,
      first_name: 'Daniel',
      last_name: 'Romeroooooooooooooooooooooo',
    },
    {
      id: 6,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 7,
      first_name: 'Danieeeeeeeeel',
      last_name: 'Romero',
    },
    {
      id: 8,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 9,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 10,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 11,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 12,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 13,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 14,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
    {
      id: 15,
      first_name: 'Daniel',
      last_name: 'Romero',
    },
  ];

  return (
    <>
      <Paragraph fontSize={2.5} color="#00a78b">
        To:
      </Paragraph>
      <div className="h-fit flex flex-row px-[0.5vw] py-[0.6vh] border-[0.1vw] border-[#00a78b] rounded-md">
        <aside
          className="w-[90%] h-[10.5vh] grid gap-[0.4vw] overflow-y-scroll text-wrap leading-none"
          style={{
            gridTemplateColumns: `repeat(${
              gridColumns ? `${gridColumns}` : '4'
            }, minmax(0, max-content))`,
          }}
        >
          {customers &&
            !singleCLientData &&
            customers.length > 0 &&
            customers.map((customer, index) => (
              <CustomerRecipient
                key={`${customer.id}sendtocomponent${index + customer.id}`}
                id={customer.id}
                email={customer.email || ''}
                firstname={customer.first_name}
                lastname={customer.last_name}
                showEmails={showEmails}
              />
            ))}
          {singleCLientData && (
            <CustomerRecipient
              key={`${singleCLientData.id}sendtocomponentsinglecccl${singleCLientData.id}`}
              id={singleCLientData.id}
              email={singleCLientData.email || ''}
              firstname={singleCLientData.first_name}
              lastname={singleCLientData.last_name}
              showEmails={showEmails}
            />
          )}
        </aside>
        {!singleCLientData && <HandleCustomersList />}
      </div>
    </>
  );
}
