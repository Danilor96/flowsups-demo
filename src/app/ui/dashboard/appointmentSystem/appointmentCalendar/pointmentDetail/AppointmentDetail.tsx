import { Input } from '&/inputs/Input';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { adminDashboardStore, modalWindowStore } from '@/store/adminDashboard';
import { dateFormatsStore } from '@/store/dateFormats';
import { useCallback, useEffect, useState } from 'react';
import { ConfirmNotification } from '&/notifications/Notification';
import { useSocketStore } from '@/store/socketIo';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { Can } from '@/app/ui/auth/Can';
import { StatusBtn } from '&/dashboard/cards/dailyActivity/content/tableOne/statusBtn/StatusBtn';
import { SpecialBtn } from '&/dashboard/cards/dailyActivity/content/tableOne/specialBtn/SpecialBtn';
import { TextAreaInput } from '&/inputs/TextAreaInput';
import { useSession } from 'next-auth/react';

export function AppointmentDetailForm({ appointmentId }: { appointmentId: string }) {
  // ----- global states -----
  const { data: session } = useSession();
  const { updateDataWithSocket, socket } = useSocketStore();

  const [appointment, setAppointment] = useState<any>(null);

  const { openCloseCallendarAppointmentDetail } = modalWindowStore();

  const { dateFormatted } = dateFormatsStore();

  // ----- local states -----
  const [loadingInit, setLoadingInit] = useState<boolean>(true);

  const [showDeleteNoti, setShowDeleteNoti] = useState<boolean>(false);

  const [inputs, setinputs] = useState({
    customer: '',
    seller: '',
    startDate: '',
    endTime: '',
    note: '',
  });

  const inputDataOne = [
    {
      id: 1,
      label: 'Customer',
      name: 'customer',
      value: inputs.customer,
      width: 25,
      optionsBackgroundColor: '#FFF',
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      optionsRadius: 0.2,
      optionsWidth: 2,
      optionsContainerHeight: 15,
      disabledInput: true,
      disabledButton: true,
      options: [{ value: '', name: '' }],
      onChange: () => {},
      onClick: () => {},
    },
    {
      id: 2,
      label: 'Seller',
      name: 'seller',
      value: inputs.seller,
      width: 25,
      optionsBackgroundColor: '#FFF',
      optionsHeight: 5,
      optionsNameColor: '#00A78B',
      optionsRadius: 0.2,
      optionsWidth: 2,
      optionsContainerHeight: 15,
      disabledInput: true,
      disabledButton: true,
      options: [{ value: '', name: '' }],
      onChange: () => {},
      onClick: () => {},
    },
  ];

  const inputDatatwo = [
    {
      id: 3,
      label: 'Start Date',
      name: 'startDate',
      value: inputs.startDate,
      width: 25,
      type: 'text',
      onChange: () => {},
      disabled: true,
    },
    {
      id: 4,
      label: 'End Time',
      name: 'endTime',
      value: inputs.endTime,
      width: 25,
      type: 'text',
      onChange: () => {},
      disabled: true,
    },
  ];

  const handleClickOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'delete') {
      setShowDeleteNoti(true);
    } else if (identity === 'save-note') {
      handleSaveNote();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setinputs(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const { loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleConfirmDecision = async (decision: boolean) => {
    if (decision) {
      setShowDeleteNoti(false);

      const apiUrl = `/api/adminDashboard/appointments/${appointmentId}`;

      await makeAsyncFetch({
        apiUrl,
        method: 'DELETE',
        permissionForFetch: 76,
        options: {
          onSuccess() {
            updateDataWithSocket('appointments');
            updateDataWithSocket('dailyAppointmentsList');

            openCloseCallendarAppointmentDetail();
          },
        },
      });
    } else {
      setShowDeleteNoti(false);
    }
  };

  const handleSaveNote = async () => {
    const apiUrl = `/api/adminDashboard/appointments/${appointmentId}/note`;
    const formData = new FormData();
    formData.append('note', inputs.note);
    if (session?.user?.id) {
      formData.append('userId', String(session.user.id));
    }

    await makeAsyncFetch({
      apiUrl,
      method: 'PUT',
      formData: formData,
      permissionForFetch: 76,
      options: {
        onSuccess() {
          updateDataWithSocket('appointments');
          updateDataWithSocket('dailyAppointmentsList');
        },
      },
    });
  };

  const fetchAppointment = useCallback(async () => {
    setLoadingInit(true);
    try {
      const response = await fetch(`/api/adminDashboard/appointments/${appointmentId}`);
      const data = await response.json();

      if (data) {
        setAppointment(data);
        const customer = data.customers;
        const seller = data.users;
        const startDate = data.start_date;
        const endDate = data.end_date;

        setinputs({
          customer: `${customer?.first_name} ${customer?.last_name}`,
          seller: `${seller?.name} ${seller?.last_name}`,
          startDate: dateFormatted(5, startDate),
          endTime: dateFormatted(1, endDate),
          note: data.lead_appointment?.[0]?.note_assigned?.note || '',
        });
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
    } finally {
      setLoadingInit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId, fetchAppointment]);

  useEffect(() => {
    const handleUpdate = (dataToUpdate: string) => {
      if (dataToUpdate === 'dailyAppointmentsList' || dataToUpdate === 'appointments') {
        fetchAppointment();
      }
    };

    socket?.on('update_data', handleUpdate);

    return () => {
      socket?.off('update_data', handleUpdate);
    };
  }, [socket, fetchAppointment]);

  return (
    <ModalWindow zIndex={60}>
      {showDeleteNoti && (
        <ConfirmNotification
          notiMessage="Are you sure you want to delete this appointment?"
          onDecision={handleConfirmDecision}
        />
      )}
      <ModalContainer marginTop={15} width={52}>
        <ModalContainerTitle title="Appointment Detail" closeWindowFunction={openCloseCallendarAppointmentDetail} />
        <ModalContent widthFull loading={loadingFetch || loadingInit}>
          <ContentRow widthFull cols={2} gap={2}>
            {inputDataOne.map((el, index) => (
              <AdderSelect
                key={`${el.id})${index - el.id * 2}`}
                name={el.name}
                value={el.value}
                width={0}
                widthFull
                label={el.label}
                onChange={el.onChange}
                options={el.options}
                iconTextGap={0}
                onClick={el.onClick}
                optionsBackgroundColor={el.optionsBackgroundColor}
                optionsHeight={el.optionsHeight}
                optionsNameColor={el.optionsNameColor}
                optionsRadius={el.optionsRadius}
                optionsWidth={el.optionsWidth}
                disabledButton={el.disabledButton}
                disabledInput={el.disabledInput}
                optionsWidthFull
                backgroundColor="#C9EBE6"
                selectBtnBackgroundColor="#C9EBE6"
                textColor="#00A78B"
                optionsContainerHeight={el.optionsContainerHeight}
              />
            ))}
            {inputDatatwo.map((el, index) => (
              <Input
                key={`${el.id})${index - el.id * 2}`}
                label={el.label}
                name={el.name}
                type={el.type}
                value={el.value}
                width={0}
                widthFull
                onChange={el.onChange}
                disabled={el.disabled}
                textAlterColor="#00A78B"
              />
            ))}
          </ContentRow>
          <ButtonContainer marginTop={2.5} widthFull>
            <TextAreaInput
              label="Note"
              name="note"
              value={inputs.note}
              width={0}
              widthFull
              height={10}
              onChange={handleInputChange}
              placeholder="Type note here"
            />
          </ButtonContainer>
          <ButtonContainer marginTop={6} widthFull justify="right" gap={1}>
            <div className="w-full flex gap-[1vw] justify-start">
              <Can
                requiredPermission={[5, 6, 7]}
                fallback={
                  <p className="w-fit capitalize text-center border-2 border-[#C9EBE6] rounded-md py-1 px-2 text-[#00A78B]">
                    {appointment?.appointments_status?.status}
                  </p>
                }
              >
                {appointment && (
                  <SpecialBtn
                    appointmentId={appointment.id}
                    customerId={appointment.customer_id}
                    changeReason={appointment.change_reason}
                    preventedEndDate={appointment.prevented_end_date}
                    preventedStartDate={appointment.prevented_start_date}
                    waitingAprove={appointment.waiting_aprove}
                    appointmentAccepted={appointment.client_accept_appointment}
                    confirmationSent={appointment.confirmation_sent}
                    defaultHomePhoneNumber={appointment.customers.home_default}
                    homePhone={appointment.customers.home_phone}
                    mobilePhone={appointment.customers.mobile_phone}
                  />
                )}
              </Can>
              {!appointment?.waiting_aprove && appointment && (
                <StatusBtn
                  appointmentId={appointment.id}
                  customerId={appointment.customer_id}
                  customerVisit={true}
                  isOtionsButton={true}
                />
              )}
            </div>
            <Can requiredPermission={77}>
              <Button
                widthFitContent
                backgroundColor="#F00"
                identity="delete"
                onClick={handleClickOption}
                textColor="#FFF"
                buttonText="Delete Appointment"
              />
            </Can>
            <Button
              width={6}
              backgroundColor="#00A78B"
              identity="save-note"
              onClick={handleClickOption}
              textColor="#FFF"
              buttonText="Save"
            />
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
