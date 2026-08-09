'use client';

import { useState } from 'react';
import { CloseWindow } from '&/icons/Icons';
import { ReportInformation } from './ReportInformation';
import { Columns } from './Columns';

export function AddNewReport() {
  return (
    <section className="absolute top-[-18%] right-0 bottom-0 left-0 bg-[#00000054] h-fit">
      <article className="w-[75.15625vw] h-[296.018519vh] bg-[#FFFFFF] mt-[8.518519vh] ml-[12.395833vw] rounded-[0.520833vw]">
        <div className="w-full h-[9.259259vh] shadow-addNewReportHeadShadow pt-[2.037037vh]">
          <aside className="w-[67.916667vw] h-[5.555556vh] ml-[3.697917vw] flex flex-row justify-between items-center">
            <h2 className="text-[2.777778vh] font-semibold text-[#00A78B]">Add a new report</h2>
            <button>
              <CloseWindow />
            </button>
          </aside>
        </div>
        <ReportInformation />
        {/* <Columns /> */}
      </article>
    </section>
  );
}
