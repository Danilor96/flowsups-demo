import { SearchLens } from '&/icons/Icons';
import { taskFilterSearchInputStore } from '@/store/adminDashboard';
import { useState } from 'react';

export function SearchInput() {
  //   ----- global states -----

  const { taskSearchFilterInput } = taskFilterSearchInputStore();
  const { setTaskSearchFilterInput } = taskFilterSearchInputStore();

  // ----- local states -----

  const [widthFull, setWidthFull] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;

    setTaskSearchFilterInput(value);
  };

  return (
    <aside className="w-fit h-[5vh] flex flex-row items-center justify-center gap-[0.5vw] bg-[#92CEC3] rounded-[1.041667vw] px-[1vw]">
      <input
        type="text"
        value={taskSearchFilterInput}
        placeholder="Search"
        className="w-[7vw] text-[#FFF] text-[1.8vh] bg-[#92CEC3] outline-none placeholder:text-[#FFF] placeholder:text-[1.8vh]"
        style={{
          display: widthFull ? 'block' : 'none',
        }}
        onChange={handleChange}
      />
      <aside className="w-fit h-fit cursor-pointer" onClick={() => setWidthFull(!widthFull)}>
        <SearchLens />
      </aside>
    </aside>
  );
}
