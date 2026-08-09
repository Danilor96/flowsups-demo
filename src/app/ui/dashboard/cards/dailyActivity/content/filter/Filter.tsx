import { Input } from '&/inputs/Input';

export function Filter({
  assigned,
  customer,
  onChange,
}: {
  assigned: string;
  customer: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <div className="w-full flex justify-end gap-[1.5vw] px-[2vw]">
      <Input
        label=""
        name="assigned"
        type="text"
        value={assigned}
        width={13.489583}
        borderRadius={1.2}
        searchLensIcon
        backgroundColor="#00A28A"
        border={0.104167}
        borderColor="#FFF"
        textAlterColor="#FFF"
        placeholder="Assigned search"
        onChange={onChange}
        capitalString
      />
      <Input
        label=""
        name="customer"
        type="text"
        value={customer}
        width={13.489583}
        borderRadius={1.2}
        searchLensIcon
        backgroundColor="#00A28A"
        border={0.104167}
        borderColor="#FFF"
        textAlterColor="#FFF"
        placeholder="Customer search"
        onChange={onChange}
        capitalString
      />
    </div>
  );
}
