import {
  adminDashboardStore,
  modalWindowStore,
  singleCLientDataStore,
} from '@/store/adminDashboard';
import { useCallback, useEffect, useState } from 'react';
import { useSocketStore } from '@/store/socketIo';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { Input } from '&/inputs/Input';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { leadsStore } from '@/store/leads';

export function SetLeadTemperature() {
  // ----- global states -----

  const { updateDataWithSocket } = useSocketStore();

  const { closeLeadTemperature } = modalWindowStore();

  const { singleCLientData } = singleCLientDataStore();

  const { leadTemperatures } = adminDashboardStore();
  const { getLeadTemperatures } = adminDashboardStore();

  const currentLead = leadsStore((state) => state.currentLead);

  const getPromiseData = useCallback(() => {
    return [getLeadTemperatures()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { error, loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [leadSelected, setLeadSelected] = useState('');
  const [options, setOptions] = useState<{ value: number; option: string }[]>([]);

  useEffect(() => {
    if (
      singleCLientData &&
      singleCLientData?.client_lead_temperature &&
      singleCLientData?.client_lead_temperature.temperature
    ) {
      setLeadSelected(singleCLientData?.client_lead_temperature.id.toString());
    }
  }, [singleCLientData]);

  useEffect(() => {
    if (leadTemperatures && leadTemperatures.length > 0) {
      const newOptions = leadSelected ? [] : [{ value: 0, option: 'select a temperature' }];

      for (let i = 0; i < leadTemperatures.length; i++) {
        const leadTemp = leadTemperatures[i];

        newOptions.push({ value: leadTemp.id, option: leadTemp.temperature });
      }

      setOptions(newOptions);
    }
  }, [leadTemperatures, leadSelected]);

  const handleSelectTemp = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.currentTarget;

    setLeadSelected(value);
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleSaveTemp = async () => {
    if (leadSelected && singleCLientData?.id) {
      if (parseInt(leadSelected) !== singleCLientData?.client_lead_temperature?.id) {
        const formData = new FormData();

        formData.append('lead_temperature', leadSelected);

        const customerId = singleCLientData?.id;

        const apiUrl = `/api/adminDashboard/leadTemperature/${customerId}${currentLead ? `?leadId=${currentLead}` : ''}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'PUT',
          permissionForFetch: 71,
          options: {
            onSuccess: () => {
              updateDataWithSocket('singleClient', undefined, {
                customerId: singleCLientData?.id,
              });
            },
          },
        });
      }
    }
  };

  return (
    <ModalWindow top={0} positionFixed>
      <ModalContainer marginTop={25} width={45.3125}>
        <ModalContainerTitle
          title="Set Lead Temperature"
          closeWindowFunction={closeLeadTemperature}
        />
        <ModalContent loading={loading || loadingFetch} minHeight={29}>
          <Input
            label="Lead Temperature"
            name=""
            type="select"
            value={leadSelected}
            width={0}
            widthFull
            textAlterColor="#00A78B"
            fontSize={2}
            labelFontSize={2}
            // options={leadTemperatures.map((el) => ({ value: el.id, option: el.temperature }))}
            options={options}
            disabled={loading || loadingFetch}
            fieldErrors={fieldErrors}
            onChange={handleSelectTemp}
          />
          <ButtonContainer marginTop={7.962962} widthFull justify="right">
            <Button
              onClick={handleSaveTemp}
              width={11.875}
              backgroundColor="#00A78B"
              identity="save"
              textColor="#FFF"
              buttonText="Save"
              disabled={loading || loadingFetch}
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
