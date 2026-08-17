import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { ToggleBtn } from '&/miscellaneous/userSchedule/dayToggle/toggleBtn/ToggleBtn';
import { DayTimeInput } from '&/miscellaneous/userSchedule/dayToggle/dayTimeInput/DayTimeInput';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { dayweekStore } from '@/store/userSchedule';

export function DayToggle({
  day,
  index,
  currentTimeFrom,
  currentTimeTo,
}: {
  day: string;
  index: number;
  currentTimeFrom: number;
  currentTimeTo: number;
}) {
  // ----- global states -----

  const { dayweek } = dayweekStore();

  // ----- local states -----

  return (
    <section className="w-full h-full flex flex-row items-center justify-between max-lg:gap-2">
      <div className="w-[8vw] flex flex-row items-center justify-between max-lg:w-20">
        <Paragraph color="#959595" fontSize={2} widthFitContent>
          {day}
        </Paragraph>
        <ToggleBtn index={index} />
      </div>
      <ButtonContainer marginTop={0} gap={0.25} alignContentCenter>
        {dayweek[index] && (
          <>
            <DayTimeInput currentTime={currentTimeFrom} index={index} from={true} />
            <Paragraph>-</Paragraph>
            <DayTimeInput currentTime={currentTimeTo} index={index} from={false} />
          </>
        )}
      </ButtonContainer>
    </section>
  );
}
