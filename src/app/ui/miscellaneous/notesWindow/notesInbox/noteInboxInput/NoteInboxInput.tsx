import { ClipIcon, SendMessageIcon } from '&/icons/Icons';
import { motion } from 'framer-motion';

export function NoteInboxInput({
  noteInput,
  handleTextChange,
  handleSaveNote,
}: {
  noteInput: string;
  handleTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSaveNote: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <article className="mt-[3.148148vh]">
      <aside className="w-full h-[5.092593vh] flex flex-row items-center px-[0.4vw] py-[0.25vh] bg-[#F4F4F4]">
        <textarea
          name="message"
          id="message"
          value={noteInput}
          onChange={handleTextChange}
          placeholder="Enter Text here"
          className="w-[90%] h-full outline-none bg-[#F4F4F4] text-[1.666667vh] font-medium leading-[1.805556vh] text-[#959595] resize-none pt-[1.5vh]"
        />
        <article className="w-[10%] flex flex-row justify-around">
          <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <ClipIcon />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSaveNote}
          >
            <SendMessageIcon />
          </motion.button>
        </article>
      </aside>
    </article>
  );
}
