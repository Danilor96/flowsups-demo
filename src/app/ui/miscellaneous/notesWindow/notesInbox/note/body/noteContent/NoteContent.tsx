export function NoteContent({ noteContent }: { noteContent: string }) {
  // ----- global states -----

  // ----- local states -----

  return (
    <p className="text-[1.666667vh] font-normal leading-[2.314815vh] text-[#959595] mb-[5vh]">
      {noteContent}
    </p>
  );
}
