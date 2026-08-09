import { Button } from '&/buttons/Button';
import { adminDashboardStore, userPermissionAllowedStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { SpecialBtnOptions } from './specialBtnOptions/SpecialBtnOptions';
import { ConfirmNotification } from '&/notifications/Notification';
import { useCallback, useState } from 'react';
import { useSocketStore } from '@/store/socketIo';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { AdderSelect } from '&/select/adderSelect/AdderSelect';
import { useLoadingGetData } from '@/hooks/loadingGetData';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';
import { useCan } from '@/hooks/permissions';
import { DashboardPagesIndex } from '@/app/ui/dashboard/admin/AdminDashboard';

export function SpecialBtn({
  waitingAprove,
  appointmentId,
  customerId,
  preventedStartDate,
  preventedEndDate,
  changeReason,
  appointmentAccepted,
  confirmationSent,
  defaultHomePhoneNumber,
  mobilePhone,
  homePhone,
  onChangeSuccess,
}: {
  waitingAprove: boolean | null;
  appointmentId: number;
  customerId: number;
  preventedStartDate: Date | null;
  preventedEndDate: Date | null;
  changeReason: string | null;
  appointmentAccepted: boolean;
  confirmationSent: boolean;
  defaultHomePhoneNumber: boolean;
  homePhone?: string | null;
  mobilePhone: string;
  onChangeSuccess?: () => Promise<void>;
}) {
  // ----- global states -----

  const { data: session } = useSession();

  const roleId = session?.user.user_has[0].role_id;
  const userId = session?.user.id;

  const { returnPermission } = userPermissionAllowedStore();

  const { updateDataWithSocket } = useSocketStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { can } = useCan();

  const { automaticSms, smsTemplateVariables, dailyMadeAppointments, currentDashboardIndex } =
    adminDashboardStore();
  const { getSmsTemplateVariables, getDailyMadeAppointments, getDailyActivityAppointments } =
    adminDashboardStore();

  const [openTextComponent, setOpenTextComponent] = useState(false);

  const getPromiseData = useCallback(() => {
    if (openTextComponent) {
      return [getSmsTemplateVariables()];
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTextComponent]);

  const { error, loading } = useLoadingGetData(getPromiseData);

  // ----- local states -----

  const [notiMssg, setNotiMssg] = useState('');
  const [noConfirmMssg, setNoConfirmMssg] = useState('');

  const [adderSelectText, setAdderSelectText] = useState('');
  const [toggleNumber, setToggleNumber] = useState(defaultHomePhoneNumber);
  const [manualConfirmationMssg, setManualConfirmationMssg] = useState('');
  const [manualMssgError, setManualMssgError] = useState<{ [key: string]: [string | undefined] }>({
    message: [''],
  });

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (waitingAprove) {
      toggleOpen();

      return;
    }

    if (!appointmentAccepted) {
      setNotiMssg('You want to send a confirmation sms? Sms will be sent to ');
    }
  };

  const handleButtonText = () => {
    if (waitingAprove && changeReason) {
      return { text: 'Cancelation requested', disabled: !returnPermission([1, 2, 3, 4], roleId) };
    }

    if (waitingAprove && preventedStartDate && preventedEndDate) {
      return { text: 'Reschedule requested', disabled: !returnPermission([1, 2, 3, 4], roleId) };
    }

    if (appointmentAccepted) {
      return { text: 'Confirmed', disabled: true };
    }

    if (confirmationSent) {
      return { text: 'Confirmation Sent', disabled: true };
    }

    return { text: 'Confirm', disabled: false };
  };

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleSelectVariable = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget;
    const { category } = e.currentTarget.dataset;

    setManualConfirmationMssg(
      `${manualConfirmationMssg}{${category?.toLowerCase()}.${name
        .toLowerCase()
        .split(' ')
        .join('_')}}`,
    );
  };

  const handleDecision = async (decision: boolean) => {
    if (decision) {
      if (notiMssg) {
        if (
          automaticSms?.appointment_confirmation &&
          automaticSms.appointment_confirmation_template_id
        ) {
          const formData = new FormData();

          formData.append('customerId', customerId.toString());

          formData.append('toggleNumber', toggleNumber ? '1' : '');

          const apiUrl = `/api/adminDashboard/confirmAppointmentSms/${appointmentId}`;

          await makeAsyncFetch({
            formData,
            apiUrl,
            method: 'POST',
            permissionForFetch: 5,
            options: {
              onSuccess: () => {
                if (dailyMadeAppointments && userId) {
                  getDailyMadeAppointments(userId);
                }

                if (currentDashboardIndex === DashboardPagesIndex.DailyActivity) {
                  getDailyActivityAppointments();
                }

                onChangeSuccess?.();

                updateDataWithSocket('dailyAppointmentsList');

                setNotiMssg('');
              },
            },
          });
        } else {
          setNoConfirmMssg(
            'There is no an active template for the confirmation message. Do you want to write a message instead?',
          );

          setNotiMssg('');
        }
      } else if (noConfirmMssg) {
        setNoConfirmMssg('');

        setOpenTextComponent(true);
      } else if (openTextComponent) {
        if (!manualConfirmationMssg) {
          setManualMssgError({ message: ['Enter a message'] });

          return;
        } else {
          setManualMssgError({ message: [''] });
        }

        const formData = new FormData();

        formData.append('customerId', customerId.toString());

        formData.append('toggleNumber', toggleNumber ? '1' : '');

        formData.append('manualConfirmationMssg', manualConfirmationMssg);

        const apiUrl = `/api/adminDashboard/confirmAppointmentSms/${appointmentId}`;

        await makeAsyncFetch({
          formData,
          apiUrl,
          method: 'POST',
          permissionForFetch: 5,
          options: {
            onSuccess: () => {
              if (dailyMadeAppointments && userId) {
                getDailyMadeAppointments(userId);
              }

              if (currentDashboardIndex === DashboardPagesIndex.DailyActivity) {
                getDailyActivityAppointments();
              }

              onChangeSuccess?.();

              updateDataWithSocket('dailyAppointmentsList');

              setNotiMssg('');

              setOpenTextComponent(false);

              setNoConfirmMssg('');
            },
          },
        });
      }
    } else {
      setNotiMssg('');

      setNoConfirmMssg('');

      setOpenTextComponent(false);
    }
  };

  return (
    <div ref={ref}>
      {(notiMssg || noConfirmMssg || openTextComponent) && (
        <ConfirmNotification
          notiMessage={notiMssg || noConfirmMssg}
          loading={loadingFetch || loading}
          onDecision={handleDecision}
          overflowVisible
          alterNotiMessage={
            notiMssg &&
            `${homePhone && toggleNumber ? 'Home phone' : 'Mobile phone'}: ${
              toggleNumber && homePhone
                ? formatPhoneNumber(homePhone)
                : formatPhoneNumber(mobilePhone)
            }`
          }
          alterNotiMessageColor="#0000ff"
          yesAlterText={openTextComponent ? 'Accept' : undefined}
          noAlterText={openTextComponent ? 'Cancel' : undefined}
          nullMssgDontRemovesNoti={openTextComponent}
        >
          {notiMssg && (
            <button
              onClick={() => setToggleNumber(!toggleNumber)}
              className="w-fit flex justify-center items-center px-[0.3vw] py-[0.4vh] mx-auto border border-[#0000ff] rounded-md text-[2vh] text-[#0000ff] hover:bg-[#0000ff] hover:text-white transition-colors"
            >
              Toggle number
            </button>
          )}
          {openTextComponent && (
            <div className="relative flex flex-row justify-center items-start gap-[0.5vw]">
              <AdderSelect
                width={17}
                iconTextGap={0}
                optionsWidth={17}
                optionsRadius={0.045}
                optionsHeight={5}
                optionsBackgroundColor="#FFF"
                optionsNameColor="#00A78B"
                value={adderSelectText}
                optionsContainerHeight={40}
                marginInlineAuto
                label="Variable"
                name="variables"
                optionsWithCategory={smsTemplateVariables?.map((el) => {
                  return {
                    value: el.id.toString(),
                    name: el.variable,
                    categoryId: el.category_id,
                    category: el.category,
                    identity: 'variables',
                  };
                })}
                onChange={(e) => setAdderSelectText(e.currentTarget.value)}
                onClick={handleSelectVariable}
                fieldErrors={fieldErrors}
              />
              <textarea
                value={manualConfirmationMssg}
                onChange={(e) => setManualConfirmationMssg(e.currentTarget.value)}
                className="w-[25vw] h-[18vh] border border-primaryColor rounded-md outline-none px-[0.3vw] py-[0.3vh] resize-none text-[2vh]"
              />
              <FieldErrorMessage
                fieldErrors={fieldErrors || manualMssgError}
                name="message"
                right={0}
                top={18}
                fontSize={2}
              />
            </div>
          )}
        </ConfirmNotification>
      )}
      <Button
        width={7.03125}
        backgroundColor="#C9EBE6"
        textColor="#41B4A0"
        border={0.138889}
        borderColor="#00A78B"
        identity=""
        marginInlineAuto
        dropShadow
        borderRadius={1.2}
        buttonTextSize={2}
        disabledSameColor
        lineHeight={0.8}
        disabled={handleButtonText().disabled}
        buttonText={handleButtonText().text}
        onClick={handleButton}
      />
      {isOpen && (can(6) || can(7)) && (
        <SpecialBtnOptions
          appointmentId={appointmentId}
          changeReason={changeReason}
          preventedStartDate={preventedStartDate}
          preventedEndDate={preventedEndDate}
        />
      )}
    </div>
  );
}
