export function DateFormats({ date, format }: { date?: Date | null; format?: number }) {
  // ----- global states -----

  // ----- local states -----

  if (date) {
    let newDateFormat = {
      // timeZone: 'UTC',
    };

    switch (format) {
      case 1:
        Object.assign(newDateFormat, { hour: '2-digit', minute: '2-digit' });
        break;

      case 2:
        Object.assign(newDateFormat, { day: '2-digit', month: '2-digit', year: 'numeric' });
        return new Intl.DateTimeFormat('default', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(new Date(date)).replace(/\./g, '').toUpperCase();
        break;

      case 3:
        Object.assign(newDateFormat, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        break;

      case 4:
        Object.assign(newDateFormat, { month: 'long' });
        break;

      case 5:
        Object.assign(newDateFormat, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        break;
    }

    return new Date(date).toLocaleString('en-US', newDateFormat);
  } else {
    <p>No date stablished</p>;
  }
}
