import { adminDashboardStore } from '@/store/adminDashboard';

export function EventsElements({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  const { eventsTypes } = adminDashboardStore();

  // ----- local states -----

  return (
    <ul>
      {eventsTypes && eventsTypes.length > 0 ? (
        eventsTypes.map((event, index) => (
          <li key={`eventtype${event.id}___${index / 9}`}>
            <button
              type="button"
              value={event.id}
              name="eventType"
              onClick={onClick}
              className="w-fit h-[4vh] flex justify-center items-center px-[0.3vw] py-[0.4vh] rounded-md hover:bg-primaryColor hover:text-white text-primaryColor text-[2vh] border border-primaryColor transition-colors"
              style={{
                marginBottom: index !== eventsTypes.length - 1 ? '1.5vh' : '',
              }}
            >
              {event.type.replace(event.type[0], event.type[0].toUpperCase())}
            </button>
          </li>
        ))
      ) : (
        <li className="text-primaryColor text-[2vh]">No events configured</li>
      )}
    </ul>
  );
}
