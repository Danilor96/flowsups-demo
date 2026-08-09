import { Input } from '&/inputs/Input';
import { referrerStore } from '@/store/reports';

export function AmountInput({ value, id }: { value: string; id: number }) {
  // ----- global status -----

  const { amount, setAmount, referrerId } = referrerStore();

  // ----- local states -----

  const showInput = id === referrerId;

  if (!showInput) {
    return value;
  }

  return (
    <Input
      label=""
      name=""
      type="text"
      value={amount}
      width={7}
      onChange={(e) => {
        const { value } = e.currentTarget;

        setAmount(value);
      }}
      stopPropagationOnClick
    />
  );
}
