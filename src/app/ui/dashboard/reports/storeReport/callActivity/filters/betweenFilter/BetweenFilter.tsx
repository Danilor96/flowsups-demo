import { Input } from '&/inputs/Input';

export function BetweenFilter({
  betweenFrom,
  betweenTo,
  onChange,
  onDayPickFrom,
  onDayPickTo,
}: {
  betweenFrom: string;
  betweenTo: string;
  onDayPickFrom: (e: Date, index?: number) => void;
  onDayPickTo: (e: Date, index?: number) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <aside className="flex flex-row gap-[1vw]">
      <Input
        label="From"
        name="from"
        type="DottedDate"
        value={betweenFrom}
        width={9}
        labelColor="#FFF"
        inputWidth={70}
        selectBtnWidth={30}
        labelBottom={5}
        onChange={onChange}
        onDayPickerClick={onDayPickFrom}
      />
      <Input
        label="To"
        name="to"
        type="DottedDate"
        value={betweenTo}
        width={9}
        labelColor="#FFF"
        inputWidth={70}
        selectBtnWidth={30}
        labelBottom={5}
        onChange={onChange}
        onDayPickerClick={onDayPickTo}
      />
    </aside>
  );
}
