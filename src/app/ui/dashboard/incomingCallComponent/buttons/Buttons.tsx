import { HangUpCallIcon, SpeakerOffIcon, SpeakerOnIcon, TransferCallIcon } from '&/icons/Icons';
import { singleCLientDataStore } from '@/store/adminDashboard';
import { useTwilioStore } from '@/store/phoneDevice';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { UsersOptions } from '../usersOptions/UsersOptions';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { useSocketStore } from '@/store/socketIo';
import { useSession } from 'next-auth/react';

export function Buttons({
  bdcName,
  bdcLastname,
  bdcNum,
  salesRepName,
  salesRepLastname,
  salesRepNum,
}: {
  bdcName: string;
  bdcLastname: string;
  bdcNum: string;
  salesRepName: string;
  salesRepLastname: string;
  salesRepNum: string;
}) {
  // ----- global states -----

  const { data: session } = useSession();
  const userAuthEmail = session?.user.email;

  const {
    call,
    creatingCall,
    callInProgress,
    // trasnferInProgressOrCompleted,
    device,
    incomingCallsArray,
    outgoingCall,
    outgoingCallData,
  } = useTwilioStore();

  const { setCurrentCall, resetCallTiming } = useTwilioStore();
  const { socket } = useSocketStore();

  const { singleCLientData } = singleCLientDataStore();

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const [conferenceName, setConferenceName] = useState('');
  const [conferenceSid, setConferenceSid] = useState('');
  const [callAnswerLoading, setCallAnswerLoading] = useState(false);

  const [usersAssigned, setUsersAssigned] = useState<{
    bdc: boolean;
    seller: boolean;
  }>({
    bdc: false,
    seller: false,
  });

  const handleAnswerHandupCall = async () => {
    resetCallTiming();

    setCallAnswerLoading(true);
    if (call) {
      console.log('disconnecting call');
      call.disconnect();
      setCurrentCall(null);
      setCallAnswerLoading(false);
      return;
    }

    if (!call && device && conferenceName && conferenceSid) {
      console.log('answering call...');
      socket?.emit(
        'call:answer',
        { conferenceName, conferenceSid, userAuthEmail },
        async (response: any) => {
          if (response.success) {
            const answeredCall = await device.connect({
              params: {
                To: conferenceName,
              },
            });
            console.log('answeredCall con bloqueo de llamada: ', answeredCall);
            setCurrentCall(answeredCall);
            setCallAnswerLoading(false);
          }
          if (!response.success) {
            setCallAnswerLoading(false);
            console.log('not available');
          }
        },
      );
    }
  };

  useEffect(() => {
    function handleCallError(error: any) {
      if (call) {
        call.disconnect();
      }
      setCurrentCall(null);
    }
    if (call) {
      call.on('error', (error) => {
        console.log('evento error: ', error);
        handleCallError(error);
      });
      call.on('disconnect', (data) => {
        console.log('event disconnect: ', data);
        setCurrentCall(null);
      });
    }

    return () => {
      console.log('return useEffect');
      if (call) {
        call?.disconnect();
        call?.removeAllListeners();
        setCurrentCall(null);
      }
    };
  }, [call]);

  useEffect(() => {
    if (incomingCallsArray.length > 0) {
      const activeCall = incomingCallsArray.find((callInfo) => callInfo.isActive);

      if (activeCall) {
        setConferenceName(activeCall.conferenceName);
        setConferenceSid(activeCall.conferenceSid);

        setUsersAssigned({
          bdc: activeCall.incomingCallIdentity?.bdc ? true : false,
          seller: activeCall.incomingCallIdentity?.seller ? true : false,
        });
      }
    }
  }, [incomingCallsArray]);

  const handleMainCallButtonBackgroundRules = () => {
    return !trasnferInProgressOrCompleted
      ? outgoingCall
        ? '#ED0000'
        : call && (creatingCall || callInProgress)
        ? '#ED0000'
        : '#2563eb'
      : '#C9EBE6';
  };

  const handleMainCallButtonIconRotationRules = () => {
    return outgoingCall
      ? 'rotate-0'
      : call && (creatingCall || callInProgress)
      ? 'rotate-0'
      : '-rotate-90';
  };

  const activeCall = incomingCallsArray.find((callInfo) => callInfo.isActive);
  const trasnferInProgressOrCompleted = activeCall?.transferInProgress;
  const isClientRegistered = activeCall?.incomingCallIdentity?.id;

  const handleTransferButtonBorderRules = () => {
    return outgoingCall
      ? creatingCall
        ? ''
        : outgoingCallData?.salesRep || outgoingCallData?.bdc
        ? !trasnferInProgressOrCompleted
          ? '0.104166vw solid #00A78B'
          : ''
        : ''
      : conferenceName
      ? usersAssigned.seller || usersAssigned.bdc
        ? !trasnferInProgressOrCompleted
          ? '0.104166vw solid #00A78B'
          : ''
        : ''
      : singleCLientData
      ? singleCLientData.seller || singleCLientData.bdc
        ? '0.104166vw solid #00A78B'
        : ''
      : '';
  };

  const handleTransferButtonBackgroundColorRules = () => {
    return outgoingCall
      ? creatingCall
        ? '#C9EBE6'
        : outgoingCallData?.salesRep || outgoingCallData?.bdc
        ? trasnferInProgressOrCompleted
          ? '#C9EBE6'
          : ''
        : ''
      : conferenceName
      ? usersAssigned.seller || usersAssigned.bdc
        ? trasnferInProgressOrCompleted
          ? '#C9EBE6'
          : ''
        : '#C9EBE6'
      : singleCLientData
      ? singleCLientData.seller || singleCLientData.bdc
        ? ''
        : '#C9EBE6'
      : '#C9EBE6';
  };

  const handleTransferButtonDisabledRules = () => {
    return !trasnferInProgressOrCompleted
      ? outgoingCall
        ? creatingCall
          ? true
          : outgoingCallData?.bdc || outgoingCallData?.salesRep
          ? false
          : true
        : conferenceName
        ? usersAssigned.seller || usersAssigned.bdc
          ? false
          : true
        : singleCLientData
        ? singleCLientData.bdc || singleCLientData.seller
          ? false
          : true
        : outgoingCall
        ? outgoingCallData?.bdcMobilePhone || outgoingCallData?.salesRepMobilePhone
          ? false
          : true
        : true
      : true;
  };

  const sizeButton = {
    width: '3.5vw',
    height: '3.5vw',
  }

  const buttonData = [
    {
      id: 1,
      style: {
        ...sizeButton,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        backgroundColor: handleMainCallButtonBackgroundRules(),
      },
      className: `w-fit h-fit ${handleMainCallButtonIconRotationRules()}`,
      icon: <HangUpCallIcon />,
      disabled: trasnferInProgressOrCompleted || callAnswerLoading,
      onClick: handleAnswerHandupCall,
    },
    {
      id: 2,
      style: {
        ...sizeButton,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        border: !trasnferInProgressOrCompleted
          ? call?.isMuted()
            ? '0.104166vw solid #00A78B'
            : ''
          : '',
        backgroundColor: !trasnferInProgressOrCompleted
          ? call?.isMuted()
            ? '#FFF'
            : '#C9EBE6'
          : '#C9EBE6',
      },
      icon: <SpeakerOnIcon />,
      disabled: !trasnferInProgressOrCompleted
        ? call
          ? call.isMuted()
            ? false
            : true
          : true
        : true,
      onClick: () => {
        if (call && call.isMuted()) {
          call.mute(false);
        }
      },
    },
    {
      id: 3,
      style: {
        ...sizeButton,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        border: !trasnferInProgressOrCompleted
          ? call?.isMuted()
            ? ''
            : '0.104166vw solid #00A78B'
          : '',
        backgroundColor: !trasnferInProgressOrCompleted
          ? call?.isMuted()
            ? '#C9EBE6'
            : '#FFF'
          : '#C9EBE6',
      },
      icon: <SpeakerOffIcon />,
      disabled: !trasnferInProgressOrCompleted
        ? call
          ? call.isMuted()
            ? true
            : false
          : true
        : true,
      onClick: () => {
        if (call && !call.isMuted()) {
          call.mute(true);
        }
      },
    },
    {
      id: 4,
      ref: ref,
      style: {
        ...sizeButton,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        border: handleTransferButtonBorderRules(),
        backgroundColor: handleTransferButtonBackgroundColorRules(),
      },
      icon: <TransferCallIcon />,
      disabled:
        (isClientRegistered && handleTransferButtonDisabledRules()) ||
        trasnferInProgressOrCompleted,
      onClick: toggleOpen,
    },
  ];

  return (
    <div className="relative flex flex-row items-center justify-around w-full h-fit" ref={ref}>
      {buttonData.map((el, index) => (
        <motion.button
          // ref={el.ref}
          whileHover={!trasnferInProgressOrCompleted ? { scale: 1.1 } : ''}
          whileTap={!trasnferInProgressOrCompleted ? { scale: 0.9 } : ''}
          key={`${33 * el.id}opk${index * 77}`}
          style={el.style}
          disabled={el.disabled}
          onClick={el.onClick}
        >
          <aside className={el.className}>{el.icon}</aside>
        </motion.button>
      ))}
      <AnimatePresence>
        {isOpen && (
          <UsersOptions
            left={21.5}
            top={-1}
            bdcName={bdcName}
            bdcLastname={bdcLastname}
            bdcNum={bdcNum}
            salesRepName={salesRepName}
            salesRepLastname={salesRepLastname}
            salesRepNum={salesRepNum}
            toggleOpenOptions={toggleOpen}
            activeCall={activeCall}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
