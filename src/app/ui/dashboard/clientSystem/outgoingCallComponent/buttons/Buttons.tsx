import { Button } from '@/app/ui/buttons/Button';
import { HangUpCallIcon, SpeakerOffIcon, SpeakerOnIcon } from '&/icons/Icons';
import { ContentRow } from '@/app/ui/modalWindowsStructure/ContentRow';
import { messagesStore, modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useTwilioStore } from '@/store/phoneDevice';
import { TransferButton } from './transferButton/TransferButton';
import { useCan } from '@/hooks/permissions';

export function Buttons({ phoneNumberSelected }: { phoneNumberSelected: string }) {
  // ----- global states -----

  const { call, device } = useTwilioStore();
  const {
    setOutgoingCall,
    setCurrentCall,
    setCreatingCall,
    setOutgoingCallData,
    setShowDashboardCallHandler,
  } = useTwilioStore();

  const { setShowCallModal } = modalWindowStore();

  const { singleCLientData } = singleCLientDataStore();

  const { setMessages } = messagesStore();

  const { can } = useCan();

  // ----- local states -----

  const handleButtons = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (can(65)) {
      if (identity === 'makeCallHangupCall') {
        if (!call) {
          if (device && singleCLientData) {
            setCreatingCall(true);

            try {
              const formatNumberSelected = phoneNumberSelected && phoneNumberSelected.length > 10 ? phoneNumberSelected.slice(-10) : phoneNumberSelected;
              const outgoingCall = await device.connect({
                params: {
                  To: `+1${formatNumberSelected}`,
                },
              });

              const customerName = `${
                singleCLientData.first_name ? singleCLientData.first_name : ''
              } ${singleCLientData.last_name ? singleCLientData.last_name : ''}`;

              const customerPhone = formatNumberSelected || singleCLientData.mobile_phone;

              const salesRep = `${
                singleCLientData.seller?.name ? singleCLientData.seller?.name : ''
              } ${singleCLientData.seller?.last_name ? singleCLientData.seller?.last_name : ''}`;

              const salesRepPhone = singleCLientData.seller?.mobile_phone || '';

              const bdc = `${singleCLientData.bdc?.name ? singleCLientData.bdc?.name : ''} ${
                singleCLientData.bdc?.last_name ? singleCLientData.bdc?.last_name : ''
              }`;

              const bdcPhone = singleCLientData.bdc?.mobile_phone || '';

              setOutgoingCallData(
                customerName,
                customerPhone,
                salesRep,
                salesRepPhone,
                bdc,
                bdcPhone,
              );

              setOutgoingCall(true);

              setCurrentCall(outgoingCall);

              setShowCallModal(false);

              setShowDashboardCallHandler(true);
            } catch (error) {
              setMessages('An error occured');

              setCreatingCall(false);
            }
          }
        } else {
          call.disconnect();

          setCurrentCall(null);
        }
      }

      if (identity === 'unmute') {
        call?.mute(false);
      }

      if (identity === 'mute') {
        call?.mute(true);
      }
    }
  };

  const buttonsData = [
    {
      id: 1,
      backgroundColor: !call ? '#2563eb' : '#ED0000',
      identity: 'makeCallHangupCall',
      textColor: '',
      onClick: handleButtons,
      width: 5.208332,
      height: 5.208332,
      icon: <HangUpCallIcon />,
      border: 0.104166,
      borderColor: '',
      borderRadius: 100,
      disabled: call ? true : false,
    },
    // {
    //   id: 2,
    //   backgroundColor: call ? (call.isMuted() ? '' : '#C9EBE6') : '#C9EBE6',
    //   identity: 'unmute',
    //   textColor: '',
    //   onClick: handleButtons,
    //   width: 5.208332,
    //   height: 5.208332,
    //   icon: <SpeakerOnIcon />,
    //   border: 0.104166,
    //   borderColor: call ? (call.isMuted() ? '#00A78B' : '#C9EBE6') : '#C9EBE6',
    //   borderRadius: 100,
    //   disabled: call ? (call.isMuted() ? false : true) : true,
    // },
    // {
    //   id: 3,
    //   backgroundColor: call ? (!call.isMuted() ? '' : '#C9EBE6') : '#C9EBE6',
    //   identity: 'mute',
    //   textColor: '',
    //   onClick: handleButtons,
    //   width: 5.208332,
    //   height: 5.208332,
    //   icon: <SpeakerOffIcon />,
    //   border: 0.104166,
    //   borderColor: call ? (!call.isMuted() ? '#00A78B' : '#C9EBE6') : '#C9EBE6',
    //   borderRadius: 100,
    //   disabled: call ? (!call.isMuted() ? false : true) : true,
    // },
  ];

  return (
    <ContentRow
      cols={2}
      gap={2}
      marginTop={6}
      widthFull
      justifyContent="center"
      alignItems="center"
    >
      {buttonsData.map((el, index) => (
        <Button
          key={`buttonsssss${el.id * index - 1}---${index + 3}`}
          backgroundColor={el.backgroundColor}
          identity={el.identity}
          textColor={el.textColor}
          onClick={el.onClick}
          width={el.width}
          height={el.height}
          buttonIcon={el.icon}
          border={el.border}
          borderColor={el.borderColor}
          heightVw
          borderRadius={el.borderRadius}
          disabled={el.disabled}
        />
      ))}
      <TransferButton />
    </ContentRow>
  );
}
