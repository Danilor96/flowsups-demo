import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { InboundCallIcon, OutboundCallIcon } from '&/icons/Icons';
import { CallStatusIcon } from '&/miscellaneous/callStatusIcon/CallStatusIcon';
import { CustomerContactFormat } from '&/miscellaneous/customerContactFormat/CustomerContactFormat';
import { DateFormats } from '&/miscellaneous/dateFormats/DateFormats';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { adminDashboardStore, singleCLientDataStore } from '@/store/adminDashboard';
import { useEffect, useState } from 'react';
import { DropdownContent } from '&/modalWindowsStructure/dropdownContent/DropdownContent';
import { AnsweredBy } from './answeredBy/AnsweredBy';
import { motion } from 'framer-motion';
import { NotesWindow } from '&/miscellaneous/callDetailSubTable/table/noteButton/notesWindow/NotesWindow';
import { Lead } from '../options/lead/Lead';
import { leadCardStore } from '@/store/leadCard';
import { NotesData } from '@/app/api/reports/storeReport/callActivity/inbound/types';

export function Calls() {
  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();

  const { setCallIdToAddNote } = leadCardStore();

  const { customerCalls } = adminDashboardStore();
  const { getCustomerCalls } = adminDashboardStore();

  useEffect(() => {
    if (singleCLientData && singleCLientData.id) {
      getCustomerCalls(singleCLientData.id).finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleCLientData]);

  // ----- local states -----

  const [loading, setLoading] = useState(true);

  const [openNote, setOpenNote] = useState(false);
  const [openAddNote, setOpenAddNote] = useState(false);
  const [noteSelected, setNoteSelected] = useState<NotesData[]>();

  const handleNotes = (note?: string) => {
    if (!note) return '';

    return `${note.slice(0, 17)}...`;
  };

  const handleCallDuration = (seconds: string) => {
    const numSeconds = parseInt(seconds);
    const secondsPerMinute = 60;
    const secondsPerHour = 3600;

    const hours = Math.floor(numSeconds / secondsPerHour);
    const minutes = Math.floor((numSeconds % secondsPerHour) / secondsPerMinute);
    const remainingSeconds = numSeconds % secondsPerMinute;
    let result = '';

    if (hours > 0) {
      result = `${hours} h `;
    }
    if (minutes > 0) {
      result += `${minutes} min `;
    }
    if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
      result += `${remainingSeconds} sec`;
    }

    return result;
  };

  return (
    <DropdownContent title="Calls" loading={loading}>
      <ul className="w-full h-[65vh] overflow-y-scroll">
        {customerCalls && customerCalls.length > 0 ? (
          customerCalls.map((el) => (
            <li key={el.id} className="w-full mb-[2.5vh] py-[0.5vh]">
              <ContentRow cols={7} gap={0} alignItems="center" widthFull gridTrack="minmax(0,1fr)">
                <aside className="flex justify-start items-center">
                  {el.call_direction_id === 1 ? <InboundCallIcon /> : <OutboundCallIcon />}
                </aside>
                <aside className="flex justify-start items-center">
                  <Paragraph>{handleCallDuration(el.call_duration)}</Paragraph>
                </aside>
                <aside className="flex justify-start items-center">
                  <AnsweredBy user={el.user} callDirectionId={el.call_direction_id} />
                </aside>
                <aside className="h-fit flex flex-col justify-center items-center gap-[0.2vh]">
                  <Paragraph color="#00A78B" fontSize={2} widthFitContent>
                    {`${el.client_call?.first_name} ${el.client_call?.last_name}`}
                  </Paragraph>
                  <CustomerContactFormat
                    contact={el.client_call?.mobile_phone}
                    fontSize={2}
                    color="#959595"
                    noIcon
                  />
                </aside>
                <aside className="h-fit flex flex-col justify-center items-end gap-[0.2vh]">
                  <Paragraph fontSize={2} color="#00A78B">
                    <DateFormats date={el.call_date} format={1} />
                  </Paragraph>
                  <Paragraph fontSize={2} color="#959595">
                    <DateFormats date={el.call_date} format={2} />
                  </Paragraph>
                </aside>
                <aside className="flex justify-end items-center">
                  <CallStatusIcon callStatus={el.call_status_id} callDuration={el.call_duration} />
                </aside>
                <aside className="flex justify-end pr-[0.1vw]">
                  <motion.button
                    type="button"
                    onClick={() => {
                      const { note } = el;

                      if (!note) {
                        setCallIdToAddNote(el.id);

                        setOpenAddNote(!openAddNote);

                        return;
                      }

                      if (el.note) {
                        setNoteSelected([
                          {
                            created_at: note.created_at,
                            created_by: {
                              name: note.created_by.name,
                              last_name: note.created_by.last_name,
                            },
                            note: note.note,
                          },
                        ]);
                      }

                      setOpenNote(!openNote);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex justify-center items-center gap-[0.3vw] px-[0.4vw] py-[0.6vh] rounded-[1.041666vw] text-[2vh]"
                    style={{
                      // backgroundColor: handleNotes(el.note?.note) ? '#FFFFFF21' : '#C9EBE6',
                      backgroundColor: '#C9EBE6',
                      color: handleNotes(el.note?.note) ? '#00a78b' : '#41B4A0',
                    }}
                  >
                    {handleNotes(el.note?.note) ? (
                      <p>{handleNotes(el.note?.note)}</p>
                    ) : (
                      <p>No notes</p>
                    )}
                  </motion.button>
                </aside>
              </ContentRow>
            </li>
          ))
        ) : (
          <p className="text-[2.5vh] text-[#00A78B] font-bold">No calls made</p>
        )}
      </ul>
      {openAddNote && (
        <Lead
          closeAddNoteFromCAllHistory={() => {
            setCallIdToAddNote(undefined);

            setOpenAddNote(!openAddNote);
          }}
        />
      )}
      {openNote && (
        <NotesWindow
          onClose={() => {
            setNoteSelected(undefined);

            setOpenNote(!openNote);
          }}
          notes={noteSelected}
        />
      )}
    </DropdownContent>
  );
}
