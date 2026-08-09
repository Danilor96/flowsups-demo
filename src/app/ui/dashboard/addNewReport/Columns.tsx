'use client';

import { Add, DownArrow, ShowInfo, UpArrow } from '&/icons/Icons';

export function Columns() {
  return (
    <div className="w-[81.5rem] ml-[4.4375rem] mt-[2.8125rem] border-[0.1875rem] border-[#C9EBE6] rounded-[1.25rem] bg-[#C9EBE6]">
      <button className="w-full flex flex-row justify-between items-center pl-[1.875rem] pr-[2.5625rem] pt-[1.1875rem] pb-[1.109375rem]">
        <p className="text-addNewReportInfo text-[#00A78B]">Report information</p>
        <ShowInfo />
      </button>
      <aside>
        <section className="w-[16.8125rem] bg-[#029B81] rounded-bl-[1.25rem] pt-[2.8125rem]">
          <button className="mx-auto w-[15.125rem] flex flex-row items-center justify-between rounded-[1.25rem] bg-[#44B19D] pl-[1.875rem] pr-[1.9375rem] py-[0.65625rem]">
            <Add />
            <p className="text-[1.25rem] text-[#FFFFFF] font-[600] ">Add a Column</p>
          </button>
          <button className="mt-[1.75rem] flex flex-row">
            <UpArrow />
            <p>Move Up</p>
          </button>
          <button className="mt-[1.75rem] flex flex-row">
            <DownArrow />
            <p>Move Down</p>
          </button>
        </section>
        <article className="w-full"></article>
      </aside>
    </div>
  );
}
