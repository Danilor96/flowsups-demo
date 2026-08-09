import { RegularSearchableSelect } from '&/select/regularSearchableSelect/RegularSearchableSelect';
import { adminDashboardStore } from '@/store/adminDashboard';

export function BulkSetUpADealCustomersList({
  onClick,
  loading,
  currentCustomerId,
}: {
  onClick: (value: string) => void;
  loading: boolean;
  currentCustomerId: number;
}) {
  // ----- global states -----

  const { selectedCustomersIds, clients } = adminDashboardStore();

  // ----- local states -----

  const returnCurrentCustomerList = () => {
    const dataForOptions: { value: string; name: string }[] = [];

    if (clients && clients.length > 0) {
      for (let i = 0; i < clients.length; i++) {
        const client = clients[i];

        if (selectedCustomersIds.includes(client.id)) {
          dataForOptions.push({
            value: client.id.toString(),
            name: `${client.first_name || ''} ${client.last_name || ''}`,
          });
        }
      }
    }

    return dataForOptions;
  };

  return (
    <RegularSearchableSelect
      iconTextGap={0}
      label="Customers Selected"
      name="customersSelected"
      width={12}
      optionsBackgroundColor="#FFF"
      optionsHeight={6}
      optionsRadius={0}
      noTextSearch
      optionsContainerHeight={60}
      labelLeft
      optionsCenter
      optionsPaddingY={2}
      optionsWidth={12}
      textColor="#00A78B"
      labelFontSize={2}
      labelSameColor
      loading={loading}
      value={currentCustomerId.toString()}
      options={returnCurrentCustomerList()}
      onClick={onClick}
    />
  );
}
