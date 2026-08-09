import { BorderedContent } from '&/modalWindowsStructure/BorderedContent';
import { LeadCard } from '&/dashboard/clientSystem/clientDetail/leadHistory/leadCard/LeadCard';
import { adminDashboardStore } from '@/store/adminDashboard';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { Button } from '&/buttons/Button';
import { Can } from '&/auth/Can';

export function NoteContent({
  noteInput,
  onChange,
  onClick,
}: {
  noteInput: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  const { singleClientTasks } = adminDashboardStore();

  // ----- local states -----

  return (
    <>
      <BorderedContent title="Note" marginTop={4.074074}>
        <aside className="w-full h-[36.759259vh] flex flex-col gap-[1.666667vh] pb-2 overflow-y-scroll">
          {singleClientTasks && singleClientTasks.notes && singleClientTasks.notes.length > 0 ? (
            singleClientTasks.notes.map((el, index) => (
              <LeadCard
                key={`${el.id + index}leadhistory${index * 300 - 27}---`}
                leadId={0}
                createdAt={el.created_at}
                text={el.note}
                name={`${el?.user?.name || ''} ${el?.user?.last_name || ''}`}
                fromLead={''}
              />
            ))
          ) : (
            <p className="mt-[0.5vh] text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#585858]">{`You don't have notes`}</p>
          )}
        </aside>
        <Can requiredPermission={20}>
          <div className="w-full h-fit flex justify-center items-center">
            <textarea
              onChange={onChange}
              value={noteInput}
              name=""
              id=""
              cols={20}
              rows={10}
              className="w-full h-[8vh] resize-none outline-none bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] font-medium leading-//[1.805556vh] text-[#585858] py-[1.388889vh] px-[0.885417vw] mx-auto mt-[1.666667vh]"
              placeholder="Type note here"
            ></textarea>
          </div>
        </Can>
      </BorderedContent>
      <Can requiredPermission={20}>
        <ButtonContainer marginTop={4.166667} widthFull justify="right">
          <Button
            width={11.875}
            backgroundColor="#00A78B"
            identity=""
            textColor="#FFF"
            buttonText="Save Note"
            buttonTextSize={2}
            onClick={onClick}
          />
        </ButtonContainer>
      </Can>
    </>
  );
}
