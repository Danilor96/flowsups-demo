import { modalWindowStore, singleCLientDataStore } from '@/store/adminDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ClipIcon,
  CloseWindow,
  OneFireLead,
  ThreeFiresLead,
  TrashDeleteIcon,
  TwoFiresLead,
} from '../../icons/Icons';
import { useEffect, useState } from 'react';
import { FailNotification, SuccessNotification } from '../../notifications/Notification';

export function EmailModal() {
  const { singleCLientData } = singleCLientDataStore();

  const { closeEmailModal } = modalWindowStore();

  const [emailSubject, setEmailSubject] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [serverSuccessMessage, setServerSuccessMessage] = useState('');

  const handleSendEmail = async () => {
    if (!emailInput) {
      setServerErrorMessage('Enter a message in order to send the email');

      return;
    }
    if (!emailSubject) {
      setServerErrorMessage('Enter a subject in order to send the email');

      return;
    }
    if (!singleCLientData?.email) {
      setServerErrorMessage('Recipient email not found');

      return;
    }

    try {
      const formData = new FormData();

      formData.append('email_input', emailInput);
      formData.append('email_subject', emailSubject);
      formData.append('email_recipient', singleCLientData?.email);

      const res = await (
        await fetch(`/api/email/${singleCLientData?.id}`, { method: 'POST', body: formData })
      ).json();

      if (res.successMessage) {
        setEmailSubject('');
        setEmailInput('');
        setServerSuccessMessage(res.successMessage);
      }
    } catch (error) {
      setServerErrorMessage('Client Error');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      serverErrorMessage && setServerErrorMessage('');
      serverSuccessMessage && setServerSuccessMessage('');
    }, 4000);
  }, [serverErrorMessage, serverSuccessMessage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute z-50 top-0 right-0 left-0 bottom-0 bg-[#0000008A]"
    >
      <AnimatePresence>
        {serverSuccessMessage && <SuccessNotification apiMessage={serverSuccessMessage} />}
      </AnimatePresence>
      <AnimatePresence>
        {serverErrorMessage && <FailNotification apiMessage={serverErrorMessage} />}
      </AnimatePresence>
      <aside className="w-[45.520833vw] h-[74.722222vh] bg-[#FFF] mx-auto mt-[12.685185vh] rounded-[0.520833vw]">
        <article className="h-[9.259259vh] shadow-crmFormShadow flex justify-center items-center">
          <section className="w-[43vw] flex flex-row justify-between items-center">
            <p className="flex flex-row items-center gap-[1.041667vw]">
              <span className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B]">{`${singleCLientData?.first_name} ${singleCLientData?.last_name}`}</span>
              <span className="w-fit h-[5.462963vh] text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B] px-[1.640625vw] py-[1.805556vh] bg-[#C9EBE6] flex justify-center items-center rounded-[0.520833vw]">{`${
                singleCLientData?.client_status?.status
                  ? singleCLientData?.client_status?.status
                  : ''
              }`}</span>
              <span className="">
                {singleCLientData?.client_lead_temperature &&
                singleCLientData?.client_lead_temperature.temperature.toLowerCase() === 'normal' ? (
                  <OneFireLead />
                ) : singleCLientData?.client_lead_temperature &&
                  singleCLientData?.client_lead_temperature.temperature.toLowerCase() === 'warm' ? (
                  <TwoFiresLead />
                ) : singleCLientData?.client_lead_temperature &&
                  singleCLientData?.client_lead_temperature.temperature.toLowerCase() === 'hot' ? (
                  <ThreeFiresLead />
                ) : (
                  false
                )}
              </span>
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={closeEmailModal}
            >
              <CloseWindow />
            </motion.button>
          </section>
        </article>
        <article className="relative w-full h-[64vh] mx-auto mt-[1.2vh]">
          <div className="min-h-full bg-[#FFF]">
            <aside className="pl-[1.5vw] pt-[1.5vh] flex flex-row items-center">
              <span className="text-[2vh] font-medium leading-[1.805555vh] text-[#959595] mr-[0.5vw]">
                To:
              </span>
              <input
                type="text"
                value={singleCLientData?.email}
                disabled
                className="w-full text-[2vh] leading-[1.805555vh] text-[#959595] outline-none bg-[#FFF]"
              />
            </aside>
            <section className="w-full h-[0.25vh] mt-[1.296296vh] mb-[1.296296vh] bg-[#F1F1F1]"></section>
            <aside className="pl-[1.5vw] flex flex-row items-center">
              <span className="text-[2vh] font-medium leading-[1.805555vh] text-[#959595] mr-[0.5vw]">
                Subject:
              </span>
              <input
                type="text"
                onChange={(e: any) => setEmailSubject(e.target.value)}
                value={emailSubject}
                className="w-full text-[2vh] leading-[1.805555vh] text-[#959595] bg-none outline-none"
              />
            </aside>
            <section className="w-full h-[0.4vh] mt-[1.296296vh] bg-[#F1F1F1]"></section>
            <textarea
              onChange={(e: any) => setEmailInput(e.target.value)}
              value={emailInput}
              className="w-full min-h-[40vh] resize-none outline-none px-[1vw] py-[1vh] text-[2vh] font-normal text-[#959595]"
            ></textarea>
          </div>
          <div className="absolute bottom-0 z-30 w-full h-[8vh] flex flex-row justify-between items-center px-[1vw]">
            <aside className="flex flex-row gap-[1.5vw]">
              <motion.button
                onClick={handleSendEmail}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-[9.010417vw] h-[5.462963vh] flex justify-center items-center text-[1.626852vh] ml-[0.729167vw] font-semibold leading-[2.440741vh] rounded-[0.653646vw] bg-[#00A78B] text-[#FFFFFF]"
              >
                Send
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="flex justify-center items-center"
              >
                <ClipIcon />
              </motion.button>
            </aside>
            <aside>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-[1.8vh]"
              >
                <TrashDeleteIcon />
              </motion.button>
            </aside>
          </div>
        </article>
      </aside>
    </motion.div>
  );
}
