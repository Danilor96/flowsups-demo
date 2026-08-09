import { MessageBody } from '&/dashboard/clientSystem/clientDetail/smsModal/smsChat/userMessageContainer/messageBody/MessageBody';
import { UserInitialsContainer } from '&/dashboard/clientSystem/clientDetail/smsModal/smsChat/userMessageContainer/userInitialsContainer/UserInitialsContainer';
import { UserNameAndDateContainer } from '&/dashboard/clientSystem/clientDetail/smsModal/smsChat/userMessageContainer/userNameAndDateContainer/UserNameAndDateContainer';

export function UserMessageContainer({
  name,
  date,
  message,
  sending,
  failed,
  filesAttachment,
  delivered,
  sent,
  clientPhoneNumber,
}: {
  message: string;
  name: string;
  date: Date | null;
  sending?: boolean;
  filesAttachment?: { name: string; url: string }[] | null;
  sent: boolean;
  delivered: boolean;
  failed: boolean;
  clientPhoneNumber: string | null;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <article className="w-fit h-fit flex flex-col gap-[0.8vh] ml-auto my-[2.5vh]">
      <section className="w-[19vw] flex flex-row items-center gap-[0.25vw]">
        <MessageBody message={message} filesAttachment={filesAttachment} />
        <UserInitialsContainer name={name} />
      </section>
      <UserNameAndDateContainer
        name={name}
        date={date}
        sending={sending}
        sent={sent}
        delivered={delivered}
        failed={failed}
        clientPhoneNumber={clientPhoneNumber}
      />
    </article>
  );
}
