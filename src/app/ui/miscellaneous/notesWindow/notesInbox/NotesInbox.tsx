import { adminDashboardStore, messagesStore } from '@/store/adminDashboard';
import { useState } from 'react';
import { NoteInboxInput } from '&/miscellaneous/notesWindow/notesInbox/noteInboxInput/NoteInboxInput';
import { useSession } from 'next-auth/react';
import { Note } from '&/miscellaneous/notesWindow/notesInbox/note/Note';
import { Loader } from '&/miscellaneous/loader/Loader';

export function NotesInbox() {
  // ----- global states -----
  const session = useSession();
  const userId = session.data?.user.id;

  const { noteCustomerIdSelected, noteFromIdSelected, noteCustomerStatusIdSelected } =
    adminDashboardStore();

  const { getSpecificClientsNotes } = adminDashboardStore();

  const { setMessages } = messagesStore();

  // ----- local states -----
  const [loading, setLoading] = useState(false);

  const [noteInput, setNoteInput] = useState<string>('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;

    setNoteInput(value);
  };

  const handleSaveNote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();

    try {
      setLoading(true);

      formData.append('note', noteInput);
      formData.append('created_by', `${userId}`);
      formData.append('from', `${noteFromIdSelected}`);
      formData.append('client_id', `${noteCustomerIdSelected}`);

      formData.append('today', new Date().toISOString());

      const res = await (
        await fetch('/api/adminDashboard/clientsNotes', { method: 'POST', body: formData })
      ).json();

      if (res.successMessage) {
        setNoteInput('');
        getSpecificClientsNotes(`${noteCustomerStatusIdSelected}`);
        setMessages(undefined, res.successMessage);
      }
      if (res.serverError) {
        setMessages(res.serverError);
      }

      setLoading(false);
    } catch (error) {
      setMessages('An error occurred');

      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <article className="h-[52vh] overflow-y-scroll">
        <Note />
      </article>
      <NoteInboxInput
        handleSaveNote={handleSaveNote}
        handleTextChange={handleTextChange}
        noteInput={noteInput}
      />
      {loading && <Loader />}
    </div>
  );
}
