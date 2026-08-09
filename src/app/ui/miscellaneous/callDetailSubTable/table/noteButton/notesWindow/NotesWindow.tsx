import { Body } from '&/miscellaneous/notesWindow/notesInbox/note/body/Body';
import { NoteContent } from '&/miscellaneous/notesWindow/notesInbox/note/body/noteContent/NoteContent';
import { NoteCreator } from '&/miscellaneous/notesWindow/notesInbox/note/body/noteCreator/NoteCreator';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { InboundCallDetail } from '@/app/api/reports/storeReport/callActivity/inbound/types';

export function NotesWindow({
  onClose,
  notes,
}: {
  onClose: () => void;
  notes: InboundCallDetail['notes'];
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <ModalWindow>
      <ModalContainer width={45.520833} marginTop={6}>
        <ModalContainerTitle title="Note" closeWindowFunction={onClose} />
        <ModalContent>
          <div className="relative">
            <article className="h-[52vh] overflow-y-scroll">
              {notes &&
                notes.length > 0 &&
                notes.map((note, index) => {
                  return (
                    <Body key={`noteFromCallDetail---${index + 1}??`}>
                      <NoteContent noteContent={`${note.note}`} />
                      <NoteCreator
                        creator={`${note.created_by?.name} ${note.created_by?.last_name}`}
                        createdAt={note.created_at || new Date()}
                      />
                    </Body>
                  );
                })}
            </article>
          </div>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
