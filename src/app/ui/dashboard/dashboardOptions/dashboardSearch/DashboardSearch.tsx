import { InputLogo } from '&/dashboard/dashboardOptions/dashboardSearch/inputLogo/InputLogo';
import { CustomersList } from '&/dashboard/dashboardOptions/dashboardSearch/customersList/CustomersList';
import { dashboardSearchStore } from '@/store/dashboardSearch';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { useState } from 'react';

export function DashboardSearch() {
  // ----- global states -----

  const { customersList } = dashboardSearchStore();

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <section ref={ref} onClick={toggleOpen} className="relative w-[14.489583vw]">
      <InputLogo setLoading={setLoading} resultsIsOpen={isOpen} toggleOpen={toggleOpen} />
      {isOpen && customersList && <CustomersList loading={loading} />}
    </section>
  );
}
