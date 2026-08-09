import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { SmsReadIcon, SmsRepliedIcon, SmsUnreadIcon, SmsUnrepliedIcon } from '&/icons/Icons';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export function Status({ status, readBy }: { status: number; readBy: number[] }) {
  // ----- global states -----

  const { data: session } = useSession();

  const userId = session?.user.id;

  // ----- local states -----

  const [smsStatus, setSmsStatus] = useState<string>('');
  const [smsStatusIcon, setSmsStatusIcon] = useState<React.ReactNode>();

  useEffect(() => {
    if (userId) {
      if (status === 1 && !readBy.includes(userId)) {
        setSmsStatus('Unread');
        setSmsStatusIcon(<SmsUnreadIcon />);

        return;
      }

      switch (status) {
        case 1:
          setSmsStatus('Read');
          setSmsStatusIcon(<SmsReadIcon />);
          break;

        case 2:
          setSmsStatus('Unread');
          setSmsStatusIcon(<SmsUnreadIcon />);
          break;

        case 3:
          setSmsStatus('Replied');
          setSmsStatusIcon(<SmsRepliedIcon />);
          break;

        case 4:
          setSmsStatus('Un-Replied');
          setSmsStatusIcon(<SmsUnrepliedIcon />);
          break;
      }
    }
  }, [status, userId, readBy]);

  return (
    <div className="w-fit h-fit flex flex-row justify-center items-center gap-[0.7vw]">
      <Paragraph fontSize={1.851852} color="#FFF">
        {smsStatus}
      </Paragraph>
      {smsStatusIcon}
    </div>
  );
}
