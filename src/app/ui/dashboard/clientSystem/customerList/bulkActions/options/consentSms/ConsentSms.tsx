import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { Button } from '&/buttons/Button';
import { dateFormatsStore } from '@/store/dateFormats';
import { useSocketStore } from '@/store/socketIo';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';

export function ConsentSms() {
  // ----- global states -----

  const { openCloseBulkConsentSms } = modalWindowStore();

  const { sellersData, clients, selectedCustomersIds } = adminDashboardStore();
  const { getSellers } = adminDashboardStore();

  const { dateFormatted } = dateFormatsStore();

  const { updateDataWithSocket } = useSocketStore();

  const getPromiesesData = useCallback(() => {
    return [getSellers()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { loading, error } = useLoadingGetData(getPromiesesData);

  const findNewestMessageObject = (
    messageArray?: {
      date_sent: Date | null;
    }[],
  ) => {
    if (!messageArray || messageArray.length === 0) {
      return null;
    }

    const newestMessageObject = messageArray.reduce((acc, currentItem) => {
      const accDate = acc?.date_sent ? new Date(acc.date_sent) : null;
      const currentDate = currentItem?.date_sent ? new Date(currentItem.date_sent) : null;

      const accTimestamp = accDate ? accDate.getTime() : -Infinity;
      const currentTimestamp = currentDate ? currentDate.getTime() : -Infinity;

      if (currentTimestamp > accTimestamp) {
        return currentItem;
      } else {
        return acc;
      }
    });

    const finalDate = newestMessageObject?.date_sent
      ? new Date(newestMessageObject.date_sent)
      : null;
    if (finalDate === null) {
      return null;
    }

    return newestMessageObject;
  };

  useEffect(() => {
    if (selectedCustomersIds.length > 0) {
      const newData: any[] = [];

      for (let i = 0; i < selectedCustomersIds.length; i++) {
        const selectedId = selectedCustomersIds[i];

        const customer = clients?.find((el) => el.id === selectedId);

        const salesRep = sellersData?.find((el) => el.id === customer?.seller?.id);

        const lastContacted = findNewestMessageObject(customer?.message);

        newData.push({
          id: selectedId.toString(),
          sales_rep: `${salesRep?.name || ''} ${salesRep?.last_name || ''}${
            salesRep?.username ? ` - ${salesRep.username}` : ''
          }`,
          status: `${customer?.client_status?.status || ''}`,
          first_name: `${customer?.first_name || ''}`,
          last_name: `${customer?.last_name || ''}`,
          city: `${customer?.client_address?.city || ''}`,
          last_contacted: dateFormatted(2, lastContacted?.date_sent),
          consent: customer?.consent_approved ? 'Aproved' : 'Not Approved',
        });
      }

      setTableData(newData);
    } else {
      setTableData([
        {
          id: '',
          sales_rep: '',
          status: '',
          first_name: '',
          last_name: '',
          city: '',
          last_contacted: '',
          consent: '',
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomersIds, clients]);

  // ----- local states -----

  const [consentSms, setConsentSms] = useState<{
    on: string;
    off: string;
  }>({
    on: '',
    off: '',
  });

  const [tableData, setTableData] = useState<any[]>([
    {
      id: '',
      sales_rep: '',
      status: '',
      first_name: '',
      last_name: '',
      city: '',
      last_contacted: '',
      consent: '',
    },
  ]);

  const initialColumnsDef = {
    sales_rep: true,
    status: true,
    first_name: true,
    last_name: true,
    city: true,
    last_contacted: true,
    consent: true,
  };

  const { columns } = useDynamicTableColumns({
    initialColumnsDef,
    excludeKeys: ['id'],
  });

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    const formData = new FormData();

    if (identity === 'remove') {
      formData.append('off', '1');
    } else {
      formData.append('on', '1');
    }

    formData.append('customers', JSON.stringify(selectedCustomersIds));

    const apiUrl = `/api/bulkActions/consentSms`;

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'POST',
      permissionForFetch: 63,
      options: {
        onSuccess: () => {
          updateDataWithSocket('customersList');

          for (let i = 0; i < selectedCustomersIds.length; i++) {
            const id = selectedCustomersIds[i];

            updateDataWithSocket('singleClient', undefined, {
              customerId: id,
            });
          }
        },
      },
    });
  };

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer width={85} marginTop={2.5}>
        <ModalContainerTitle title="Consent Sms" closeWindowFunction={openCloseBulkConsentSms} />
        <ModalContent>
          <ColoredTableV2
            data={tableData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            // itemsPerPage={8}
            // paginationIsActive
            loading={loading || loadingFetch}
            textColor="#FFF"
            height={60}
            rowSelectionIsActive={false}
          />
          <ButtonContainer marginTop={5} widthFull justify="space-between" alignContentCenter>
            <Paragraph fontSize={2} color="#00a78b">
              Update Consent Sms
            </Paragraph>
          </ButtonContainer>
          <ButtonContainer marginTop={5} widthFull justify="right" gap={1.5}>
            <Button
              backgroundColor="#00a78b"
              identity="remove"
              textColor="#FFF"
              buttonText="Remove Consent"
              buttonTextSize={2}
              disabled={loading || loadingFetch}
              widthFitContent
              onClick={handleClick}
            />
            <Button
              backgroundColor="#00a78b"
              identity="add"
              textColor="#FFF"
              buttonText="Approve Consent"
              buttonTextSize={2}
              disabled={loading || loadingFetch}
              widthFitContent
              onClick={handleClick}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
