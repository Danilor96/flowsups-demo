import { CustomerMessageContainer } from '&/dashboard/clientSystem/clientDetail/smsModal/smsChat/customerMessageContainer/CustomerMessageContainer';
import { UserMessageContainer } from '&/dashboard/clientSystem/clientDetail/smsModal/smsChat/userMessageContainer/UserMessageContainer';
import { SmsData } from '@/app/api/reports/storeReport/callActivity/smsDetail/types';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { useMemo, useState } from 'react';

interface SmsDataWithFile extends Omit<SmsData, 'fileAttachment'> {
  fileAttachment?: { name: string; url: string }[] | null;
}

export function PropSmsChat({ smsData }: { smsData: SmsData[] }) {
  // ----- global states -----

  const { formatPhoneNumber } = phoneNumbersFormatStore();

  // ----- local states -----

  const [smsList, setSmsList] = useState<SmsDataWithFile[]>();

  useMemo(() => {
    const data = smsData.map((el) => ({
      ...el,
      fileAttachment: el.fileAttachment as SmsDataWithFile['fileAttachment'],
    }));

    setSmsList(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className="relative w-full h-[58.7vh] overflow-y-scroll overflow-x-hidden pr-[1vw]">
      <div className="min-h-full">
        {smsList && smsList.length > 0
          ? smsList.map((el, index) =>
              el.sentByUser ? (
                <UserMessageContainer
                  key={`${index + 1}usermssgCont---`}
                  name={el.user}
                  message={el.message}
                  date={el.dateSent}
                  filesAttachment={el.fileAttachment}
                  sent={el.sent}
                  failed={el.failed}
                  delivered={el.delivered}
                  clientPhoneNumber={
                    el.clientPhoneNumber ? formatPhoneNumber(el.clientPhoneNumber) : ''
                  }
                />
              ) : (
                <CustomerMessageContainer
                  key={`${index - 1}customermssgCont---`}
                  name={el.customer}
                  date={el.dateSent}
                  message={el.message}
                  filesAttachment={el.fileAttachment}
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
