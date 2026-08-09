import { UserMessageContainer } from '&/dashboard/clientSystem/clientDetail/smsModal/smsChat/userMessageContainer/UserMessageContainer';
import { CustomerMessageContainer } from '&/dashboard/clientSystem/clientDetail/smsModal/smsChat/customerMessageContainer/CustomerMessageContainer';
import { clientMessagesStore } from '@/store/adminDashboard';
import { useEffect, useRef, useState } from 'react';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';

export function SmsChat() {
  // ----- global states -----

  const { clientMessages, waitingSendCurrentMessage } = clientMessagesStore();
  const { formatPhoneNumber } = phoneNumbersFormatStore();

  // ----- local states -----

  const smsChatRef = useRef<HTMLElement>(null);

  const [smsList, setSmsList] = useState<
    | {
        id: number;
        message: string;
        name: string;
        date: Date | null;
        sentByUser: boolean;
        sending?: boolean;
        filesAttachment?: { name: string; url: string }[] | null;
        sent: boolean;
        delivered: boolean;
        failed: boolean;
        clientPhoneNumber: string | null;
      }[]
    | undefined
  >(undefined);

  useEffect(() => {
    if (clientMessages && clientMessages.length > 0) {
      const newData: {
        id: number;
        message: string;
        name: string;
        date: Date | null;
        sentByUser: boolean;
        filesAttachment?: { name: string; url: string }[] | null;
        sent: boolean;
        delivered: boolean;
        failed: boolean;
        clientPhoneNumber: string | null;
      }[] = [];

      clientMessages.forEach((el) => {
        newData.push({
          id: el.id,
          date: el.date_sent,
          message: el.message,
          name: el.sent_by_user
            ? `${el.user[0]?.name} ${el.user[0]?.last_name}`
            : `${el.client_message?.first_name || 'Unregistered'} ${
                el.client_message?.last_name || 'Customer'
              }`,
          sentByUser: el.sent_by_user,
          filesAttachment: el.fileAttachment ? el.fileAttachment : null,
          sent: el.sent,
          delivered: el.delivered,
          failed: el.failed,
          clientPhoneNumber: el.client_phone_number,
        });
      });

      setSmsList(newData);
    } else {
      setSmsList(undefined);
    }
  }, [clientMessages]);

  useEffect(() => {
    if (waitingSendCurrentMessage && waitingSendCurrentMessage.length > 0) {
      setSmsList((prevState) => {
        if (prevState) {
          const newSmsList = [...prevState];

          waitingSendCurrentMessage.forEach((el, index) => {
            newSmsList?.push({
              date: el.date,
              id: el.id + index,
              message: el.message,
              name: el.name,
              sentByUser: el.sentByUser,
              sending: true,
              sent: false,
              failed: false,
              delivered: false,
              filesAttachment: el.files
                ? el.files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))
                : null, // TODO.
              clientPhoneNumber: '',
            });
          });

          return newSmsList;
        }
      });
    } else {
      setSmsList((prevState) => {
        if (prevState) {
          const newSmsLIst = [...prevState.filter((sms) => !sms.sending)];

          return newSmsLIst;
        }
      });
    }
  }, [waitingSendCurrentMessage]);

  useEffect(() => {
    if (smsChatRef.current) {
      smsChatRef.current.scrollTo({ top: smsChatRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [smsList]);

  return (
    <article
      ref={smsChatRef}
      className="relative w-full flex-1 min-h-0 overflow-y-scroll overflow-x-hidden pr-[1vw]"
    >
      <div className="min-h-full">
        {smsList && smsList.length > 0
          ? smsList.map((el, index) =>
              el.sentByUser ? (
                <UserMessageContainer
                  key={`${index + 1}/${el.id + 2}`}
                  name={el.name}
                  message={el.message}
                  date={el.date}
                  sending={el.sending}
                  filesAttachment={el.filesAttachment}
                  sent={el.sent}
                  delivered={el.delivered}
                  failed={el.failed}
                  clientPhoneNumber={
                    el.clientPhoneNumber ? formatPhoneNumber(el.clientPhoneNumber) : ''
                  }
                />
              ) : (
                <CustomerMessageContainer
                  key={`${index - 1}--${el.id + 2}`}
                  name={el.name}
                  date={el.date}
                  message={el.message}
                  filesAttachment={el.filesAttachment}
                  clientPhoneNumber={
                    el.clientPhoneNumber ? formatPhoneNumber(el.clientPhoneNumber) : ''
                  }
                />
              ),
            )
          : false}
      </div>
    </article>
  );
}
