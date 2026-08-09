import { DateFormats } from '&/miscellaneous/dateFormats/DateFormats';

export function NoteCreator({ creator, createdAt }: { creator: string; createdAt: Date }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <p className="text-[1.296296vh] text-[#959595] font-light leading-[1.805556.vh]">
      <span className="font-bold mr-[1.1vw]">{creator}</span>
      <span>
        <DateFormats date={createdAt} format={2} />
      </span>
    </p>
  );
}
