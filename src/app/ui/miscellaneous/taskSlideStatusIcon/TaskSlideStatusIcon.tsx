export function TaskSlideStatusIcon({ statusId, status }: { statusId?: number; status?: string }) {
  //   ----- global states -----

  // ----- local states -----

  if (statusId) {
    let bgColor: string = '';
    let color: string = '';

    switch (statusId) {
      case 1:
        bgColor = '#FED979';
        color = '#A87900';
        break;

      case 2:
        bgColor = '#C9EBE6';
        color = '#00A78B';
        break;

      case 3:
        bgColor = '#ED000073';
        color = '#FFFFFF';
        break;

      case 4:
        bgColor = '#e67b16';
        color = '#FFFFFF';
        break;
    }

    return (
      <div
        className="w-fit mx-auto px-[0.5vw] py-[0.5vh] rounded-[1.01vw]"
        style={{
          backgroundColor: bgColor,
          color: color,
        }}
      >
        {status}
      </div>
    );
  } else {
    return <p>No status</p>;
  }
}
