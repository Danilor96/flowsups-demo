import { Options } from '&/miscellaneous/optionsButton/options/Options';

enum FundedStatuses {
  InPorgress = 1,
  Funded = 2,
  returned = 3,
}

export function FundedOptions({
  currentState,
  onClick,
}: {
  currentState?: number | null;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  const returnOptions = () => {
    const options = [
      {
        id: 1,
        option: 'In process',
      },
      {
        id: 2,
        option: 'funded',
      },
      {
        id: 3,
        option: 'returned',
      },
    ];

    const availableOptions = options.filter((el) => {
      if (!currentState) {
        return el.id !== FundedStatuses.InPorgress;
      }

      return currentState !== el.id;
    });

    return availableOptions;
  };

  return (
    <aside className="absolute top-[50%] translate-y-[-50%]">
      <Options
        identity=""
        itemId={1}
        optionsBackgroundColor="#FFF"
        optionsHeight={4}
        optionsRadius={0.5}
        optionsWidth={6}
        options={returnOptions()}
        onClick={onClick}
      />
    </aside>
  );
}
