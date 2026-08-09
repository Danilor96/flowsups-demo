import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NotesWindow } from './notesWindow/NotesWindow';
import { InboundCallDetail } from '@/app/api/reports/storeReport/callActivity/inbound/types';

export function NoteButton({ notes }: { notes: InboundCallDetail['notes'] }) {
  // ----- global states -----

  // ----- local states -----

  const [btnNote, setBtnNote] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    handleNotes(notes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  const handleNotes = (notesData: typeof notes) => {
    if (!notesData || notesData.length == 0) return;

    const lastNote = notesData[notesData.length - 1];

    const note = `${lastNote.note.slice(0, 17)}...`;

    setBtnNote(note);
  };

  const handleOpenNoteWindow = () => {
    if (!notes || notes.length == 0) return;

    setOpen(!open);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={handleOpenNoteWindow}
        whileHover={{ scale: btnNote ? 1.1 : 1 }}
        whileTap={{ scale: btnNote ? 0.9 : 1 }}
        className="flex flex-row justify-center items-center gap-[0.3vw] mx-auto px-[0.4vw] py-[0.6vh] rounded-[1.041666vw] shadow-crmFormShadow"
        style={{
          backgroundColor: btnNote ? '#FFFFFF21' : '#C9EBE6',
          color: btnNote ? '#FFF' : '#41B4A0',
        }}
      >
        {btnNote ? <p>{btnNote}</p> : <p>No notes</p>}
      </motion.button>
      {open && <NotesWindow onClose={handleOpenNoteWindow} notes={notes} />}
    </>
  );
}
