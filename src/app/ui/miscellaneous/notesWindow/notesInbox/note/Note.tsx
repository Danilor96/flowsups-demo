import { adminDashboardStore } from '@/store/adminDashboard';
import { Body } from '&/miscellaneous/notesWindow/notesInbox/note/body/Body';
import { NoteContent } from '&/miscellaneous/notesWindow/notesInbox/note/body/noteContent/NoteContent';
import { NoteCreator } from '&/miscellaneous/notesWindow/notesInbox/note/body/noteCreator/NoteCreator';

export function Note() {
  // ----- global states -----

  const { specificClientsNotesData, noteCustomerIdSelected, noteFromIdSelected } =
    adminDashboardStore();

  // ----- local states -----

  return (
    specificClientsNotesData &&
    specificClientsNotesData.length > 0 &&
    specificClientsNotesData
      .filter((el) => el.client_id === noteCustomerIdSelected && el.from?.id === noteFromIdSelected)
      .map((note, index) => (
        <Body key={`${note.id}-${index + 1}`}>
          <NoteContent noteContent={`${note.note}`} />
          <NoteCreator
            creator={`${note.created_by?.name} ${note.created_by?.last_name}`}
            createdAt={note.created_at || new Date()}
          />
        </Body>
      ))
  );
}
