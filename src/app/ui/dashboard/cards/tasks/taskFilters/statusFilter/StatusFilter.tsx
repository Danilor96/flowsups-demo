import { Input } from '&/inputs/Input';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { taskFilterStore } from '@/store/tasksHandling';

export function StatusFilter() {
  // ----- global states -----

  const { taskStatusFilter, fetching, setTaskStatusFilter } = taskFilterStore();

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const options = [
    { value: '1', name: 'Pending', identity: 'taskStatusFilter' },
    { value: '2', name: 'Completed', identity: 'taskStatusFilter' },
    { value: '3', name: 'Canceled', identity: 'taskStatusFilter' },
    { value: '4', name: 'Late', identity: 'taskStatusFilter' },
    { value: '5', name: 'All', identity: 'taskStatusFilter' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === '5') {
      setTaskStatusFilter(0);
    } else {
      setTaskStatusFilter(Number(identity));
    }
  };

  return (
    <div ref={ref} className="relative flex flex-row items-center justify-center gap-[1vw]">
      <aside
        className="w-[8vw] h-[5vh] flex justify-center items-center rounded-full bg-[#92CEC3] text-white text-[1.8vh] cursor-pointer"
        onClick={toggleOpen}
      >
        Task Status
      </aside>
      {isOpen && !fetching && (
        <ul className="absolute top-[5.3vh] left-0 z-10 w-[8vw] px-[0.3vw] py-[0.3vh] bg-[#92CEC3] rounded-lg shadow-crmFormShadow">
          {options.map((el, index) => (
            <li
              key={`${el.value}kkktaskoptstatusaaa${index}`}
              className="flex flex-row justify-between items-center py-[0.4vh]"
            >
              <p className="text-white text-[1.8vh]">{el.name}</p>
              <Input
                label=""
                name={el.value}
                type="checkbox"
                value={taskStatusFilter.includes(Number(el.value)) ? el.value : ''}
                width={0}
                identity={el.value}
                customCheckbox
                onChange={handleChange}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
