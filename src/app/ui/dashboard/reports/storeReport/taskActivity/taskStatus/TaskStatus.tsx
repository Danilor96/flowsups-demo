export enum TaskStatuses {
  Pending = 1,
  Completed = 2,
  Canceled = 3,
  Late = 4,
}

export function TaskStatus({ statusId }: { statusId: number }) {
  // ----- global states -----

  // ----- local states -----

  const handleStatusName = () => {
    let status = '';
    let bgColor = '';
    let textColor = '';

    switch (statusId) {
      case TaskStatuses.Pending:
        status = 'Pending';
        bgColor = '#1962B0';
        textColor = '#FFFFFF';

        break;

      case TaskStatuses.Completed:
        status = 'Completed';
        bgColor = '#C9EBE6';
        textColor = '#00A78B';

        break;

      case TaskStatuses.Canceled:
        status = 'Canceled';
        bgColor = '#ED000099';
        textColor = '#FFFFFF';

        break;

      case TaskStatuses.Late:
        status = 'Late';
        bgColor = '#e67b16';
        textColor = '#FFFFFF';

        break;
    }

    return { status, bgColor, textColor };
  };

  return (
    <aside
      className="w-fit h-fit flex justify-center items-center px-[0.5vw] py-[0.5vh] rounded-full"
      style={{
        backgroundColor: handleStatusName().bgColor,
        color: handleStatusName().textColor,
      }}
    >
      {handleStatusName().status}
    </aside>
  );
}
