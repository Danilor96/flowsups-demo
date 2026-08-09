import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { Button } from '&/buttons/Button';
import { dateFormatsStore } from '@/store/dateFormats';
import { useSocketStore } from '@/store/socketIo';
import { useDynamicTableColumns } from '@/app/ui/table/coloredTable/v2/useColumDef';
import { ColoredTableV2 } from '@/app/ui/table/coloredTable/v2';

export function CustomerStatus() {
  // ----- global states -----

  const { openCloseCustomerStatus } = modalWindowStore();

  const { sellersData, clients, selectedCustomersIds, clientStatusesData } = adminDashboardStore();
  const { getSellers, getClientStatuses } = adminDashboardStore();

  const { dateFormatted } = dateFormatsStore();

  const { updateDataWithSocket } = useSocketStore();

  const getPromiesesData = useCallback(() => {
    return [getSellers(), getClientStatuses()];
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
          follow_up: '',
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
          follow_up: '',
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomersIds, clients]);

  // ----- local states -----

  const [status, setStatus] = useState<{
    id: string;
    name: string;
  }>({
    id: '',
    name: '',
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
      follow_up: '',
    },
  ]);

  const initialColumnsDef = {
    sales_rep: true,
    status: true,
    first_name: true,
    last_name: true,
    city: true,
    last_contacted: true,
    follow_up: true,
  };

  const { columns } = useDynamicTableColumns({
    initialColumnsDef,
    excludeKeys: ['id'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setStatus((prevState) => ({
      ...prevState,
      name: value,
    }));
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (identity === 'status') {
      const id = value;

      const statusSelected = clientStatusesData?.find((status) => status.id.toString() === id);

      setStatus({
        id: id,
        name: `${statusSelected?.status || ''}`,
      });
    }

    if (identity === 'save') {
      const formData = new FormData();

      formData.append('customers', JSON.stringify(selectedCustomersIds));

      formData.append('status', status.id);

      const apiUrl = `/api/bulkActions/status`;

      await makeAsyncFetch({
        formData,
        apiUrl,
        method: 'POST',
        permissionForFetch: 61,
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
    }
  };

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer width={85} marginTop={2.5}>
        <ModalContainerTitle
          title="Customer Status"
          closeWindowFunction={openCloseCustomerStatus}
        />
        <ModalContent>
          <ColoredTableV2
            data={tableData}
            columns={columns}
            initialColumnsDef={initialColumnsDef}
            loading={loading || loadingFetch}
            textColor="#FFF"
            height={60}
            rowSelectionIsActive={false}
          />
          <ButtonContainer marginTop={3} widthFull justify="space-between" alignContentCenter>
            <Paragraph fontSize={2} color="#00a78b">
              Update Customer Status
            </Paragraph>
            <AdderSelect
              iconTextGap={0}
              label=""
              name="status"
              onChange={handleChange}
              onClick={handleClick}
              optionsBackgroundColor="#FFF"
              optionsHeight={7}
              optionsNameColor="#00a78b"
              optionsRadius={0.05}
              optionsWidth={21}
              value={status.name}
              width={21}
              optionsBottom={6}
              optionsContainerHeight={42}
              options={clientStatusesData?.map((el) => {
                return {
                  value: el.id.toString(),
                  name: `${el.status}`,
                  identity: 'status',
                };
              })}
              loading={loading || loadingFetch}
              fieldErrors={fieldErrors}
            />
          </ButtonContainer>
          <ButtonContainer marginTop={5} widthFull justify="right">
            <Button
              backgroundColor="#00a78b"
              identity="save"
              textColor="#FFF"
              buttonText="Save"
              buttonTextSize={2}
              disabled={loading || loadingFetch}
              onClick={handleClick}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
