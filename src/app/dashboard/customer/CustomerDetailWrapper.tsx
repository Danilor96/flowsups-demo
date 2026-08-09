'use client';
import { CustomerDetail } from '@/app/ui/dashboard/clientSystem/clientDetail/CustomerDetail';
import { modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useEffect } from 'react';

const CustomerDetailWrapper = ({ customerId }: { customerId?: number | null }) => {
  const showCientDetail = modalWindowStore(state => state.clientDetail);
  const openClientDetail = modalWindowStore(state => state.openClientDetail);

  const getSingleClientData = singleCLientDataStore(state => state.getSingleClientData);
  useEffect(() => {
    if (customerId) {
      openClientDetail();
      getSingleClientData(customerId?.toString());
    }
  }, [getSingleClientData, customerId]);

  if (!customerId) {
    return <h1>No customer id</h1>;
  }

  if (!showCientDetail) {
    return true;
  }

  return <CustomerDetail newTab={true} />;
};

export default CustomerDetailWrapper;
