import { Input } from '&/inputs/Input';
import { taskFilterSearchInputStore } from '@/store/adminDashboard';
import inputTypeDateFormatStore from '@/store/inputTypeDateFormat';

export function BetweenFilter() {
  // ----- global states -----

  const { taskBetweenFrom, taskBetweenTo } = taskFilterSearchInputStore();
  const { setTaskBetweenFrom, setTaskBetweenTo } = taskFilterSearchInputStore();

  const { formatIncomingObjectDate } = inputTypeDateFormatStore();

  // ----- local states -----

  return (
    <aside className="flex flex-row gap-[1vw]">
      <Input
        label="From"
        name="from"
        type="DottedDate"
        value={taskBetweenFrom}
        width={9}
        labelColor="#FFF"
        inputWidth={70}
        selectBtnWidth={30}
        labelBottom={5}
        onChange={(e) => {
          const { value } = e.currentTarget;

          setTaskBetweenFrom(value);
        }}
        onDayPickerClick={(date) => setTaskBetweenFrom(formatIncomingObjectDate(date))}
      />
      <Input
        label="To"
        name="to"
        type="DottedDate"
        value={taskBetweenTo}
        width={9}
        labelColor="#FFF"
        inputWidth={70}
        selectBtnWidth={30}
        labelBottom={5}
        onChange={(e) => {
          const { value } = e.currentTarget;

          setTaskBetweenTo(value);
        }}
        onDayPickerClick={(date) => setTaskBetweenTo(formatIncomingObjectDate(date))}
      />
    </aside>
  );
}
