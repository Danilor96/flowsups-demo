import { Input } from '&/inputs/Input';

export function Options({
  inputs,
  disabled,
  appId,
  onChange,
}: {
  disabled: boolean;
  inputs: {
    completed: string;
    cancel: string;
    reschedule: string;
  };
  appId: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const inputData = [
    {
      id: 1,
      label: '',
      name: '2',
      type: 'checkbox',
      value: inputs.completed,
      width: 1.2,
      disabled: disabled,
      onChange: onChange,
      chekcboxText: 'Completed',
      textAlterColor: '#00A78B',
    },
    {
      id: 2,
      label: '',
      name: '3',
      type: 'checkbox',
      value: inputs.cancel,
      width: 1.2,
      disabled: disabled,
      onChange: onChange,
      chekcboxText: 'Cancel',
      textAlterColor: '#00A78B',
    },
    {
      id: 3,
      label: '',
      name: '4',
      type: 'checkbox',
      value: inputs.reschedule,
      width: 1.2,
      disabled: disabled,
      onChange: onChange,
      chekcboxText: 'Reschedule',
      textAlterColor: '#00A78B',
    },
  ];

  return (
    <article className="absolute right-[2.5vw] top-[1vh] w-[10.833333vw] h-[19.6296296vh] flex flex-col justify-between items-start text-[1.666667vh] rounded-[0.520833vw] bg-[#FFF] font-medium shadow-crmFormShadow px-[1.2vw] py-[1.5vh]">
      {inputData.map((el) => (
        <Input
          key={el.id}
          label={el.label}
          name={el.name}
          index={appId}
          type={el.type}
          value={el.value}
          width={el.width}
          disabled={el.disabled}
          onChange={el.onChange}
          chekcboxText={el.chekcboxText}
          textAlterColor={el.textAlterColor}
        />
      ))}
    </article>
  );
}
