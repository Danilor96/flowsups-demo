'use client';

import { motion } from 'framer-motion';
import { CloseWindow } from '&/icons/Icons';
import { modalWindowStore } from '@/store/adminDashboard';

export function Duplicates() {
  // ---- global states ----
  const { closeClientDuplicates } = modalWindowStore();

  // ---- local states ----

  const handleCloseWindow = () => {
    closeClientDuplicates();
  };

  return (
    <section className="absolute top-0 right-0 left-0 bottom-0 bg-[#0000008A] h-full">
      {/* modal window main body block */}
      <article className="relative w-[82.8125vw] h-fit mt-[135vh] ml-[8.4375vw] mb-[55.185185vh] bg-[#FFFFFF] rounded-[0.520833vw] pb-[3.055555vh] !max-lg:w-full !max-lg:mt-0 !max-lg:ml-0 max-lg:rounded-none max-lg:min-h-screen">
        {/* modal window header block */}
        <aside className="w-full h-[9.259259vh] shadow-crmFormShadow flex items-center justify-center pt-[2.037037vh] pb-[1.6vh] max-lg:h-auto max-lg:py-3 max-lg:px-2">
          <div className="w-[79.6875vw] flex flex-row items-center justify-between !max-lg:w-full">
            <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B]">
              Duplicates
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleCloseWindow}
            >
              <CloseWindow />
            </motion.button>
          </div>
        </aside>
        {/* modal window content block */}
        {/* 1 */}
        <button className="w-[11.875vw] h-[5.462963vh] flex justify-center items-center mt-[2.777778vh] ml-[2.291667vw] text-[1.626852vh] font-semibold leading-[2.440741vh] rounded-[0.653646vw] border-[0.104167vw] border-[#00A78B] text-[#00A78B] !max-lg:w-[calc(100%-1rem)] max-lg:mx-2 max-lg:mt-4 max-lg:h-11 !max-lg:text-sm">
          Find Duplicates
        </button>
        {/* 2 */}
        <aside className="mt-[5.277778vh] pl-[2.291667vw] mb-[3.518519vh] pr-[2.5vw] max-lg:mt-4 max-lg:pl-2 max-lg:pr-2 max-lg:overflow-x-auto">
          <table className="w-full h-fit border-[0.130208vw] border-[#92CEC3] rounded-[0.520833vw] max-lg:min-w-[560px]">
            <thead>
              <tr className="h-[4.907407vh] text-[2vh] font-bold text-[#FFFFFF] text-center bg-[#92CEC3]">
                <td>Customer Name</td>
                <td>Lead Source</td>
                <td>Interested Vehicle</td>
                <td>Created Date</td>
              </tr>
            </thead>
            <tbody className="text-[2vh] font-normal text-[#FFFFFF]"></tbody>
          </table>
        </aside>
        {/* 3 */}
        <button className="w-[11.875vw] h-[5.462963vh] flex justify-center items-center mt-[6.018519vh] ml-[68.385417vw] text-[1.626852vh] font-semibold leading-[2.440741vh] rounded-[0.653646vw] bg-[#00A78B] text-[#FFFFFF] !max-lg:w-[calc(100%-1rem)] max-lg:mx-2 max-lg:mt-4 max-lg:h-11 !max-lg:text-sm">
          Save
        </button>
      </article>
    </section>
  );
}
