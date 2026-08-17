import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Button } from '&/buttons/Button';
import { CancelTaskIcon, CompleteTaskIcon } from '&/icons/Icons';
import { adminDashboardStore } from '@/store/adminDashboard';
import { Can } from '&/auth/Can';

export function TaskProcessor({
  onChange,
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // ----- global states -----

  const { singleClientTasks } = adminDashboardStore();

  // ----- local states -----

  const buttonData = [
    {
      id: 1,
      width: 10.208333,
      backgroundColor: '#FFF',
      identity: 'complete',
      textColor: '#00A78B',
      buttonText: 'Complete',
      border: 0.104167,
      borderColor: '#00A78B',
      buttonIcon: <CompleteTaskIcon />,
      iconTextGap: 1,
      can: 12,
      onClick: onClick,
    },
    {
      id: 2,
      width: 9.895833,
      backgroundColor: '#FFF',
      identity: 'cancel',
      textColor: '#00A78B',
      buttonText: 'Cancel Task',
      border: 0.104167,
      borderColor: '#00A78B',
      buttonIcon: <CancelTaskIcon />,
      iconTextGap: 1,
      can: 13,
      onClick: onClick,
    },
  ];

  return (
    <ContentRow cols={4} gap={1.5} marginBottom={2.5}>
      {singleClientTasks &&
      singleClientTasks.status &&
      (singleClientTasks.status === 1 || singleClientTasks.status === 4) ? (
        <>
          {buttonData.map((el, index) => (
            <Can key={`taskprocessor-${el.id}---${index * 2}`} requiredPermission={el.can}>
              <Button
                width={el.width}
                backgroundColor={el.backgroundColor}
                identity={el.identity}
                textColor={el.textColor}
                buttonText={el.buttonText}
                border={el.border}
                borderColor={el.borderColor}
                buttonIcon={el.buttonIcon}
                iconTextGap={el.iconTextGap}
                buttonTextSize={2}
                onClick={el.onClick}
              />
            </Can>
          ))}
          <Can requiredPermission={[12, 13]}>
            <aside className="w-[14.21875vw] h-[5.462963vh] flex flex-row items-center justify-center border-[0.104167vw] border-[#00A78B] bg-[#FFF] rounded-[0.653646vw] max-lg:w-full max-lg:h-auto max-lg:py-3 max-lg:px-3 max-lg:rounded-lg">
              <div className="w-[10.9375vw] flex justify-between items-center max-lg:w-full max-lg:gap-2">
                <input
                  type="checkbox"
                  name=""
                  id=""
                  className="accent-[#00A78B] max-lg:w-4 max-lg:h-4"
                  onChange={onChange}
                />
                <p className="text-[1.626851vh] font-medium text-[#00A78B] max-lg:text-sm">
                  Process To Next Task
                </p>
              </div>
            </aside>
          </Can>
        </>
      ) : (
        ''
      )}
    </ContentRow>
  );
}
