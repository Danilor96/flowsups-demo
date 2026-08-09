'use client';

import { useState } from 'react';
import {
  InventoryOption,
  InventoryOptionSelected,
  MyReportsOption,
  MyReportsOptionSelected,
  ShowInfo,
} from '&/icons/Icons';

export function ReportInformation() {
  const [inventorySelected, setInventorySelected] = useState(false);
  const [myReportsSelected, setMyReportsSelected] = useState(false);

  const handleReportInventory = (e: any) => {
    console.log(e);
  };

  return (
    <div className="w-[67.916667vw] h-[46.018519vh] mx-auto mt-[4.259259vh] rounded-[1.041667vw]">
      <aside className="bg-[#C9EBE6] rounded-t-[inherit] border-t-[0.15625vw] border-[#C9EBE6]">
        <button className="w-[64.21875vw] mx-auto flex flex-row justify-between items-center pt-[1.759259vh] pb-[1.643519vh]">
          <p className="text-[2.222222vh] font-semibold text-[#00A78B]">Report information</p>
          <ShowInfo />
        </button>
        <aside className="w-full h-full pt-[1.689815vh] bg-[#FFFFFF] rounded-b-[inherit] border-b-[0.15625vw] border-[#C9EBE6]">
          <section className="w-[40.9375vw] h-[34.259259vh] ml-[3.072917vw] mt-[1.689815vh]">
            <article className="flex flex-col gap-[0.625rem]">
              <label htmlFor="name" className="text-[1.626852vh] font-medium text-[#B3B3B3]">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-[#F4F4F4] w-full rounded-[0.520833vw] h-[5.277778vh]"
              />
            </article>
            <article className="mt-[2.314815vh]">
              <p className="text-[1.626852vh] font-medium text-[#B3B3B3]">Entity</p>
              <div className="flex flex-row gap-[2.1875rem] mt-[1.125rem]">
                <label
                  htmlFor="inventory"
                  className="cursor-pointer"
                  onClick={handleReportInventory}
                >
                  {inventorySelected ? (
                    <div className="">
                      <InventoryOptionSelected />
                    </div>
                  ) : (
                    <InventoryOption />
                  )}
                </label>
                <input type="checkbox" name="inventory" id="inventory" />
                <label htmlFor="my-reports" className="cursor-pointer">
                  {myReportsSelected ? <MyReportsOptionSelected /> : <MyReportsOption />}
                </label>
                <input type="checkbox" name="my-reports" id="my-reports" />
              </div>
            </article>
          </section>
        </aside>
      </aside>
    </div>
  );
}
