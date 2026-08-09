import { adminDashboardStore } from '@/store/adminDashboard';
import React, { useCallback, useEffect, useState } from 'react';
import { pdfDataStore } from '@/store/pdfData';
import { TableOne } from './tableOne/TableOne';
import { TableTwo } from './tableTwo/TableTwo';
import { Filter } from './filter/Filter';
import { useLoadingGetData } from '@/hooks/loadingGetData';

export function DailyActivityContent() {
  // ----- global states -----

  const { getDailyActivityAppointments, getAutomaticSms } = adminDashboardStore();

  const getPromiseData = useCallback(() => {
    return [getDailyActivityAppointments(), getAutomaticSms()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData);

  const { setPdfName } = pdfDataStore();

  useEffect(() => {
    setPdfName('Daily Activity');
  }, [setPdfName]);

  // ----- local states -----

  const [customerNameFilter, setCustomerNameFilter] = useState('');
  const [assignedNameFilter, setAssignedNameFilter] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    if (name === 'assigned') {
      setAssignedNameFilter(value);
    }

    if (name === 'customer') {
      setCustomerNameFilter(value);
    }
  };

  return (
    <article className="flex flex-col gap-[1.5vh] pt-[2.5vh] px-[0.25vw]">
      <Filter assigned={assignedNameFilter} customer={customerNameFilter} onChange={handleChange} />
      <aside className="flex flex-row justify-between">
        <TableOne
          loading={loading}
          assignedFilter={assignedNameFilter}
          customerFilter={customerNameFilter}
        />
        <TableTwo
          loading={loading}
          assignedFilter={assignedNameFilter}
          customerFilter={customerNameFilter}
        />
      </aside>
    </article>
  );
}
