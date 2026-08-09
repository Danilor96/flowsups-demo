import { useTwilioStore } from '@/store/phoneDevice';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { adminDashboardStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { Buttons } from '&/dashboard/incomingCallComponent/buttons/Buttons';
import { TotalIncomingCallsIndicator } from '&/dashboard/incomingCallComponent/totalIncomingCallsIndicator/TotalIncomingCallsIndicator';
import { DraggableWrapper } from '&/miscellaneous/draggableWrapper/DraggableWrapper';
import { HangUpCallIcon, SpeakerOffIcon, SpeakerOnIcon } from '&/icons/Icons';
import { motion } from 'framer-motion';

export function IncomingCallComponent() {
  // ----- global states -----

  const { incomingCallsArray, call, outgoingCallData, outgoingCall } = useTwilioStore();
  const { returnCallTimingWithFormat } = useTwilioStore();

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  const { singleCLientData } = singleCLientDataStore();
  const bdcUsers = adminDashboardStore(state => state.bdc);
  const getBdcUser = adminDashboardStore(state => state.getBdc);

  // ----- loca states -----
  const [isMinimized, setIsMinimized] = useState(false);

  const [customerMobilePhone, setCustomerMobilePhone] = useState('');

  const [customerInfo, setCustomerInfo] = useState<{
    firstName: string;
    lastName: string;
  }>();

  const [userInChargeInfo, setUserInChargeInfo] = useState<{
    bdcName: string;
    bdcLastname: string;
    bdcNum: string;
    salesRepName: string;
    salesRepLastname: string;
    salesRepNum: string;
  }>({
    bdcName: '',
    bdcLastname: '',
    bdcNum: '',
    salesRepName: '',
    salesRepLastname: '',
    salesRepNum: '',
  });

  useEffect(() => {
    if (!bdcUsers || bdcUsers.length === 0) {
      getBdcUser();
    }
  }, []);

  useEffect(() => {
    if (incomingCallsArray.length > 0 && !call) {
      const activeCustomer = incomingCallsArray.find(callInfo => callInfo.isActive);

      const mobilePhoneNumber = activeCustomer?.phoneNumber ?? '';

      setCustomerMobilePhone(mobilePhoneNumber);

      setUserInChargeInfo({
        bdcName: activeCustomer?.incomingCallIdentity?.bdc?.name ?? '',
        bdcLastname: activeCustomer?.incomingCallIdentity?.bdc?.last_name ?? '',
        bdcNum: activeCustomer?.incomingCallIdentity?.bdc?.mobile_phone ?? '',
        salesRepName: activeCustomer?.incomingCallIdentity?.seller?.name ?? '',
        salesRepLastname: activeCustomer?.incomingCallIdentity?.seller?.last_name ?? '',
        salesRepNum: activeCustomer?.incomingCallIdentity?.seller?.mobile_phone ?? '',
      });

      setCustomerInfo({
        firstName: activeCustomer?.incomingCallIdentity?.first_name ?? '',
        lastName: activeCustomer?.incomingCallIdentity?.last_name ?? '',
      });
    } else if (singleCLientData && !call) {
      setCustomerMobilePhone(singleCLientData.mobile_phone);

      setUserInChargeInfo({
        bdcName: singleCLientData.first_name ?? '',
        bdcLastname: singleCLientData.last_name ?? '',
        bdcNum: singleCLientData.bdc?.mobile_phone ?? '',
        salesRepName: singleCLientData.seller?.name ?? '',
        salesRepLastname: singleCLientData.seller?.last_name ?? '',
        salesRepNum: singleCLientData.seller?.mobile_phone ?? '',
      });

      setCustomerInfo({
        firstName: singleCLientData.first_name ?? '',
        lastName: singleCLientData.last_name ?? '',
      });
    }
  }, [incomingCallsArray, singleCLientData, call]);

  useEffect(() => {
    if (outgoingCallData && outgoingCall) {
      setUserInChargeInfo({
        bdcName: outgoingCallData.bdc,
        bdcLastname: '',
        bdcNum: outgoingCallData.bdcMobilePhone,
        salesRepName: outgoingCallData.salesRep,
        salesRepLastname: '',
        salesRepNum: outgoingCallData.salesRepMobilePhone,
      });

      setCustomerInfo({
        firstName: outgoingCallData.customer,
        lastName: '',
      });

      setCustomerMobilePhone(outgoingCallData.customerMobilePhone);
    }
  }, [outgoingCallData, outgoingCall]);

  const activeCall = incomingCallsArray.find(callInfo => callInfo.isActive);
  const transferInProgressOrCompleted = activeCall?.transferInProgress;

  return (
    <div
      className="absolute top-[-2vh] right-[50%] translate-x-[50%] pointer-events-none"
      style={{
        zIndex: 2000,
      }}
    >
      <DraggableWrapper>
        <div
          className={`relative w-[24vw] h-fit flex flex-col justify-center items-center gap-[1.5vh] px-[2vw] py-[2.5vh] rounded-[0.4vw] bg-white pointer-events-auto shadow-[0_10px_40px_-10px_rgba(0,0,0,0.20)] ${isMinimized ? 'hidden' : ''}`}
        >
          <button
            className="absolute top-[1.5vh] right-[1vw] text-slate-400 hover:text-[#0a646f] transition-colors"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-arrows-diagonal-minimize-2"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 10h-4v-4" />
              <path d="M20 4l-6 6" />
              <path d="M6 14h4v4" />
              <path d="M10 14l-6 6" />
            </svg>
          </button>

          <section className="w-full">
            <aside className="flex flex-row items-center w-full h-fit">
              <Paragraph fontSize={2.5} fontWeight={600} color="#0a646f">{`${
                customerInfo?.firstName || 'Unknown'
              } ${customerInfo?.lastName || ''}`}</Paragraph>
            </aside>
            <aside className="flex flex-row items-center w-full h-fit my-[0.8vh]">
              <Paragraph fontSize={2} color="">{`${formatPhoneNumber(customerMobilePhone)}`}</Paragraph>
            </aside>
          </section>
          <section>
            <Paragraph fontSize={3.5} color="" fontWeight={500}>
              {returnCallTimingWithFormat()}
            </Paragraph>
          </section>
          <section>
            {transferInProgressOrCompleted && (
              <p className="w-fit h-fit mx-auto text-[2vh] text-[#00A78B]">Transfer in progress</p>
            )}
          </section>
          <Buttons
            salesRepName={userInChargeInfo.salesRepName}
            salesRepLastname={userInChargeInfo.salesRepLastname}
            salesRepNum={userInChargeInfo.salesRepNum}
            bdcName={userInChargeInfo.bdcName}
            bdcLastname={userInChargeInfo.bdcLastname}
            bdcNum={userInChargeInfo.bdcNum}
          />

          <TotalIncomingCallsIndicator />
        </div>
        <div
          className={`relative pointer-events-auto  flex flex-row items-center justify-between w-[25vw] h-[10vh] bg-white rounded-[1.2vw] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.20)] border-l-[0.6vw] border-[#0a646f] px-[1.5vw] ${isMinimized ? '' : 'hidden'}`}
        >
          <div className="flex flex-col justify-center gap-[0.2vh] max-w-[12vw]">
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              <Paragraph fontSize={2} fontWeight={600} color="#0a646f">{`${
                customerInfo?.firstName || 'Unknown'
              } ${customerInfo?.lastName || ''}`}</Paragraph>
            </div>
            <Paragraph fontSize={2} color="#0a646f" fontWeight={400}>
              {returnCallTimingWithFormat()}
            </Paragraph>
          </div>

          <div className="flex flex-row items-center gap-[1.5vw]">
            {/* Mute/Speaker Toggle simulated icons */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => call?.mute(!call?.isMuted())}
              className="text-[#0a646f] opacity-80 hover:opacity-100 transition-opacity"
            >
              <SpeakerOffIcon />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-[#0a646f] opacity-80 hover:opacity-100 transition-opacity"
              onClick={() => call?.mute(!call?.isMuted())}
            >
              <SpeakerOnIcon />
            </motion.button>

            {/* Hang up button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => call?.disconnect()}
              className="w-[3vw] h-[3vw] flex items-center justify-center bg-[#ED0000] rounded-full text-white  transition-all"
            >
              <div className="">
                <HangUpCallIcon height="1.2vh" width="2vw" />
              </div>
            </motion.button>

            {/* Maximize Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setIsMinimized(false)}
              className="text-[#0a646f] ml-[0.5vw]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h6v6" />
                <path d="M9 21H3v-6" />
                <path d="M21 3l-7 7" />
                <path d="M3 21l7-7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </DraggableWrapper>
    </div>
  );
}
