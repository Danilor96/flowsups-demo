import { MessageBody } from '&/dashboard/clientSystem/clientDetail/smsModal/smsChat/customerMessageContainer/messageBody/MessageBody';
import { CustomerInitialsContainer } from '&/dashboard/clientSystem/clientDetail/smsModal/smsChat/customerMessageContainer/customerInitialsContainer/CustomerInitialsContainer';
import { CustomerNameAndDateContainer } from '&/dashboard/clientSystem/clientDetail/smsModal/smsChat/customerMessageContainer/customerNameAndDateContainer/CustomerNameAndDateContainer';

export function CustomerMessageContainer({
  name,
  message,
  date,
  filesAttachment,
  clientPhoneNumber,
}: {
  name: string;
  message: string;
  date: Date | null;
  filesAttachment?: { name: string; url: string }[] | null;
  clientPhoneNumber: string | null;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <article className="w-fit h-fit flex flex-col gap-[0.8vh] my-[2.5vh]">
      <section className="w-[19vw] flex flex-row items-center gap-[0.25vw]">
        <CustomerInitialsContainer name={name} />
        <MessageBody message={message} filesAttachment={filesAttachment} />
      </section>
      <CustomerNameAndDateContainer name={name} date={date} clientPhoneNumber={clientPhoneNumber} />
    </article>
  );
}
