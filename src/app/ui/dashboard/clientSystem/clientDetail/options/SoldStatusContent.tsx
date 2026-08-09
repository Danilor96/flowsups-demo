import { useEffect, useState } from 'react';
import { InfoSold } from './InfoSold';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { SingleClient } from '@/app/libs/definitions';

export interface SoldDataPayload {
  vehicleId: string;
  managerId: string;
  sellerIds: string[];
  splitSold: { splitSoldYes: string; splitSoldNo: string };
  soldDate: string | null;
  soldNote: string;
  cobuyerSelected: number | string | null;
  relationshipSelected: number | string | null;
}

export const appendSoldDataToForm = (formData: FormData, data: SoldDataPayload | null) => {
  if (data) {
    formData.append('vehicleId', data.vehicleId || '');
    formData.append('managerId', data.managerId || '');
    formData.append('cobuyer', data.cobuyerSelected?.toString() || '');
    formData.append('cobuyerRelationhip', data.relationshipSelected?.toString() || '');
    formData.append('sellerIds', data.sellerIds?.join(',') || '');
    if (data.soldDate) formData.append('soldDate', data.soldDate);
    if (data.soldNote) formData.append('soldNote', data.soldNote);
    formData.append('timeZone', new Intl.DateTimeFormat().resolvedOptions().timeZone);
  }
};

export function SoldStatusContent({
  singleCLientData,
  onChange,
}: {
  singleCLientData: SingleClient;
  onChange: (data: SoldDataPayload | null) => void;
}) {
  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const [cobuyerSelected, setCobuyerSelected] = useState<number | string | null>(null);
  const [relationshipSelected, setRelationshipSelected] = useState<number | string | null>(null);
  const [cobuyerSelectedDefaultName, setCobuyerSelectedDefaultName] = useState('');

  const [dataForSold, setDataForSold] = useState<{
    vehicleId: string;
    managerId: string;
    sellerIds: string[];
    splitSold: { splitSoldYes: string; splitSoldNo: string };
    soldDate: string | null;
    soldNote: string;
  } | null>(null);

  useEffect(() => {
    if (
      singleCLientData &&
      singleCLientData.buyer_client &&
      singleCLientData.buyer_client.length > 0
    ) {
      setCobuyerSelected(singleCLientData.buyer_client[0].cobuyer.id);
      setRelationshipSelected(singleCLientData.buyer_client[0].relationship.id);

      const name = singleCLientData.buyer_client[0].cobuyer.name_lastname;

      if (name) {
        setCobuyerSelectedDefaultName(name);
      }
    } else {
      setCobuyerSelected(null);
      setRelationshipSelected(null);
    }
  }, [singleCLientData]);

  useEffect(() => {
    if (dataForSold) {
      onChange({
        ...dataForSold,
        cobuyerSelected,
        relationshipSelected,
      });
    } else {
      onChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataForSold, cobuyerSelected, relationshipSelected]);

  if (!singleCLientData) return null;

  const salesRepName = `${singleCLientData?.seller?.name || ''} ${
    singleCLientData?.seller?.last_name || ''
  }`;
  const customerName = `${singleCLientData?.first_name || ''} ${singleCLientData?.last_name || ''}`;
  const street = singleCLientData?.client_address?.street || '';
  const city = singleCLientData?.client_address?.city || '';
  const state = singleCLientData?.client_address?.state?.state || '';
  const zip = singleCLientData?.client_address?.zip || '';
  const customerAddress = `${street}, ${city}, ${state}${zip ? `, ${zip}` : ''}`;

  return (
    <section className="relative w-full">
      <div className="flex flex-row justify-center items-center gap-3">
        <InfoSold
          customer={customerName}
          salesRep={salesRepName}
          salesRepId={singleCLientData?.seller?.id}
          customerId={singleCLientData?.id}
          address={customerAddress}
          homePhone={formatPhoneNumber(singleCLientData.home_phone)}
          workPhone={formatPhoneNumber(singleCLientData.work_phone)}
          mobilePhone={formatPhoneNumber(singleCLientData.mobile_phone)}
          vehicleId={singleCLientData?.interested_vehicle?.id}
          salesManagerId={singleCLientData?.sales_manager?.id}
          email={singleCLientData?.email}
          leadType={singleCLientData?.lead_type?.type || ''}
          setCobuyerSelected={setCobuyerSelected}
          cobuyerSelected={cobuyerSelected}
          cobuyerSelectedDefaultName={cobuyerSelectedDefaultName}
          cobuyerRelationshipSelected={relationshipSelected}
          setRelationshipSelected={setRelationshipSelected}
          onChange={(data) => {
            setDataForSold((prev) => ({
              vehicleId: '',
              sellerIds: [],
              managerId: '',
              splitSold: { splitSoldNo: '', splitSoldYes: '' },
              soldDate: data.soldDate || null,
              soldNote: '',
              ...prev,
              ...data,
            }));
          }}
        />
      </div>
    </section>
  );
}
