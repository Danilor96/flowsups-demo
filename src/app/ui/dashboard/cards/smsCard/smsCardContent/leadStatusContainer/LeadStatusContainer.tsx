import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { OneFire, ThreeFires, TwoFires } from '&/icons/Icons';
import { useEffect, useState } from 'react';

export function LeadStatusContainer({ leadStatus }: { leadStatus?: number | null }) {
  // ----- global states -----

  // ----- local states -----

  const [leadIcon, setLeadIcon] = useState<React.ReactNode>();

  useEffect(() => {
    switch (leadStatus) {
      case 1:
        setLeadIcon(<OneFire />);
        break;

      case 2:
        setLeadIcon(<TwoFires />);
        break;

      case 3:
        setLeadIcon(<ThreeFires />);
        break;
    }
  }, [leadStatus]);

  if (leadStatus) {
    return (
      <section className="w-full h-fit flex flex-col justify-center items-center gap-[2vh]">
        <Paragraph color="#FFF" fontSize={1.851852} fontWeight={700}>
          Lead Status
        </Paragraph>

        {leadIcon}
      </section>
    );
  } else {
    return (
      <section className="w-full h-fit flex flex-col justify-center items-center gap-[2vh]">
        <Paragraph color="#FFF" fontSize={1.851852} fontWeight={700}>
          Lead Status
        </Paragraph>
        <Paragraph fontSize={1.8} color="#FFF">
          No lead stablished
        </Paragraph>
      </section>
    );
  }
}
