import { CloseWindow, ShowInfo, SmsIcon, StarIcon, ThreeGreenDots } from '@/app/ui/icons/Icons';
import { motion } from 'framer-motion';

export function ManagerTaskDetail() {
  return (
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 right-0 bottom-0 left-0 bg-[#0000008A]"
    >
      <div className="w-[73.541667vw] h-[165.092593vh] bg-[#FFFFFF] mt-[4vh] ml-[6vw] rounded-[0.520833vw] !max-lg:w-full !max-lg:h-auto !max-lg:mt-0 !max-lg:ml-0 max-lg:rounded-none">
        {/* header */}
        <section className="w-full h-[9.259259vh] shadow-crmFormShadow flex items-center justify-center pt-[2.037037vh] pb-[1.6vh] max-lg:h-auto max-lg:py-3 max-lg:px-2">
          <div className="w-[70vw] flex flex-row items-center justify-between !max-lg:w-full">
            <article className="flex flex-row items-center justify-center gap-[0.7vw]">
              <StarIcon />
              <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B]">
                Manager Task
              </p>
            </article>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              //   onClick={() => setManagerTaskModal(false)}
            >
              <CloseWindow />
            </motion.button>
          </div>
        </section>
        {/* content */}
        <section className="w-[67.916667vw] h-[87.222222vh] mt-[3.425926vh] ml-[2.65625vw] !max-lg:w-full max-lg:h-auto max-lg:mt-2 max-lg:ml-0 max-lg:px-2">
          <article className="w-full flex flex-row justify-between items-center py-[2.314815vh] px-[2.083333vw] bg-[#C9EBE6] rounded-t-[1.041667vw]">
            <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B]">
              General Detail Information
            </p>
            <ShowInfo />
          </article>
          <article className="w-full flex flex-row border-b-[0.15625vw] border-l-[0.15625vw] border-r-[0.15625vw] border-[#C9EBE6] rounded-b-[1.041667vw] pb-[4.074074vh]">
            <div className="w-[63.75vw] mx-auto mt-[3.434259vh] !max-lg:w-full max-lg:mt-2">
              <section className="relative flex flex-row w-full items-center justify-between gap-[7.135417vw] mb-[2.314815vh] max-lg:flex-col max-lg:items-stretch max-lg:gap-2">
                <label
                  htmlFor="clientName"
                  className="h-[5.277778vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-center items-center"
                >
                  <p>Customer</p>
                </label>
                <aside className="flex flex-row w-[51.25vw] h-[5.277778vh] !max-lg:w-full">
                  <input
                    type="text"
                    name="clientName"
                    id="clientName"
                    // value={
                    //   pendingModalWindowData &&
                    //   pendingModalWindowData[0].name_lastname
                    // }
                    className="w-[95%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                  />
                  <button
                    type="button"
                    className="w-[5%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw]"
                  >
                    <ThreeGreenDots />
                  </button>
                </aside>
              </section>
              <section className="relative flex flex-row w-full items-center justify-between gap-[7.135417vw] mb-[2.314815vh] max-lg:flex-col max-lg:items-stretch max-lg:gap-2">
                <label
                  htmlFor="clientName"
                  className="h-[5.277778vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-center items-center"
                >
                  <p>Subject</p>
                </label>
                <aside className="flex flex-row w-[51.25vw] h-[5.277778vh] !max-lg:w-full">
                  <input
                    type="text"
                    name="clientName"
                    id="clientName"
                    // onChange={handleChangeTaskSubject}
                    // value={taskSubject}
                    className="w-full h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                  />
                </aside>
              </section>
              <section className="relative flex flex-row w-full items-center justify-between gap-[4vw] mb-[2.314815vh]">
                <label
                  htmlFor="clientName"
                  className="h-[5.277778vh] w-fit text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-center items-center"
                >
                  <p>Interested Vehicle</p>
                </label>
                <aside className="flex flex-row w-[51.25vw] h-[5.277778vh] !max-lg:w-full">
                  <input
                    type="text"
                    name="clientName"
                    id="clientName"
                    // value={
                    //   pendingModalWindowData &&
                    //   `${pendingModalWindowData[0].interested_vehicle?.vehicle_brands.brand} ${pendingModalWindowData[0].interested_vehicle?.vehicle_models.model}`
                    // }
                    className="w-[95%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                  />
                  <button
                    type="button"
                    className="w-[5%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw]"
                  >
                    <ThreeGreenDots />
                  </button>
                </aside>
              </section>
              <section className="relative flex flex-row w-[63.75vw] items-center justify-between gap-[4vw] mb-[2.314815vh] max-lg:flex-col max-lg:items-stretch max-lg:gap-2 !max-lg:w-full">
                <article className="w-[55%] flex flex-row gap-[2.838542vw] max-lg:w-full">
                  <label
                    htmlFor="clientName"
                    className="h-[5.277778vh] w-[12vw] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-start items-center"
                  >
                    <p>Seller assigned to</p>
                  </label>
                  <aside className="flex flex-row w-full h-[5.277778vh]">
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      //   value={
                      //     pendingModalWindowData && pendingModalWindowData[0].seller
                      //       ? `${pendingModalWindowData[0].seller?.name} ${pendingModalWindowData[0].seller?.last_name}`
                      //       : 'No seller asigned'
                      //   }
                      className="w-[90%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                    <button
                      type="button"
                      className="w-[10%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw]"
                    >
                      <ThreeGreenDots />
                    </button>
                  </aside>
                </article>
                <article className="w-[45%] relative flex flex-row justify-between items-center max-lg:w-full">
                  <label
                    htmlFor="noteReminderTime"
                    className="text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
                  >
                    Reminder Time
                  </label>
                  <select
                    name="noteReminderTime"
                    id="noteReminderTime"
                    className="w-[16.590104vw] h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw] !max-lg:w-full max-lg:text-sm"
                  >
                    <option value="">None</option>
                    <option value="1">5 min</option>
                    <option value="2">10 min</option>
                    <option value="3">15 min</option>
                  </select>
                </article>
              </section>
              <section className="relative flex flex-row w-[63.75vw] items-center justify-between gap-[4vw] mb-[2.314815vh] max-lg:flex-col max-lg:items-stretch max-lg:gap-2 !max-lg:w-full">
                <article className="w-[55%] flex flex-row gap-[2.838542vw] max-lg:w-full">
                  <label
                    htmlFor="clientName"
                    className="h-[5.277778vh] w-[12vw] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-start items-center"
                  >
                    <p>BDC assigned to</p>
                  </label>
                  <aside className="flex flex-row w-full h-[5.277778vh]">
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      className="w-[90%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                    <button
                      type="button"
                      className="w-[10%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw]"
                    >
                      <ThreeGreenDots />
                    </button>
                  </aside>
                </article>
                <article className="w-[45%] flex flex-row justify-between max-lg:w-full">
                  <label
                    htmlFor="clientName"
                    className="h-[5.277778vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-center items-center"
                  >
                    <p>Mobile Phone</p>
                  </label>
                  <aside className="flex flex-row w-[16.590104vw] h-[5.277778vh] !max-lg:w-full">
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      //   value={
                      //     pendingModalWindowData &&
                      //     pendingModalWindowData[0].mobile_phone
                      //   }
                      className="w-[87%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                    <button
                      type="button"
                      className="w-[13%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw] px-[0.15vw] py-[0.18vh]"
                    >
                      <SmsIcon />
                    </button>
                  </aside>
                </article>
              </section>
              <section className="relative flex flex-row w-[63.75vw] items-center justify-between gap-[4vw] mb-[2.314815vh] max-lg:flex-col max-lg:items-stretch max-lg:gap-2 !max-lg:w-full">
                <article className="w-[55%] flex flex-row gap-[2.838542vw] max-lg:w-full">
                  <label
                    htmlFor="clientName"
                    className="h-[5.277778vh] w-[12vw] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-center items-center"
                  >
                    <p>Manager assigned to</p>
                  </label>
                  <aside className="flex flex-row w-full h-[5.277778vh]">
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      className="w-[90%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                    <button
                      type="button"
                      className="w-[10%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw]"
                    >
                      <ThreeGreenDots />
                    </button>
                  </aside>
                </article>
                <article className="w-[45%] flex flex-row justify-between max-lg:w-full">
                  <label
                    htmlFor="clientName"
                    className="h-[5.277778vh] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-center items-center"
                  >
                    <p>Email</p>
                  </label>
                  <aside className="flex flex-row w-[16.590104vw] h-[5.277778vh] !max-lg:w-full">
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      //   value={
                      //     pendingModalWindowData && pendingModalWindowData[0].email
                      //   }
                      className="w-[87%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                    <button
                      type="button"
                      className="w-[13%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw] px-[0.15vw] py-[0.18vh]"
                    >
                      <ThreeGreenDots />
                    </button>
                  </aside>
                </article>
              </section>
              <section className="relative flex flex-row w-[63.75vw] items-center justify-between gap-[4vw] mb-[2.314815vh] max-lg:flex-col max-lg:items-stretch max-lg:gap-2 !max-lg:w-full">
                <article className="w-[55%] flex flex-row gap-[2.838542vw] max-lg:w-full">
                  <label
                    htmlFor="clientName"
                    className="h-[5.277778vh] w-[12vw] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-center items-center"
                  >
                    <p>Finance Manager assigned to</p>
                  </label>
                  <aside className="flex flex-row w-full h-[5.277778vh]">
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      className="w-[90%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                    <button
                      type="button"
                      className="w-[10%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw]"
                    >
                      <ThreeGreenDots />
                    </button>
                  </aside>
                </article>
                <article className="w-[45%] flex flex-row justify-between max-lg:w-full"></article>
              </section>
              <section className="relative flex flex-row w-[63.75vw] items-center justify-between gap-[4vw] mb-[2.314815vh] max-lg:flex-col max-lg:items-stretch max-lg:gap-2 !max-lg:w-full">
                <article className="w-[55%] flex flex-row gap-[2.838542vw] max-lg:w-full">
                  <label
                    htmlFor="clientName"
                    className="h-[5.277778vh] w-[12vw] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-start items-center"
                  >
                    <p>Follow Up Date</p>
                  </label>
                  <aside className="flex flex-row w-full h-[5.277778vh]">
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      className="w-[90%] h-[5.277778vh] bg-[#F4F4F4] rounded-l-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                    <button
                      type="button"
                      className="w-[10%] h-[5.277778vh] bg-[#C9EBE6] flex justify-center items-center rounded-r-[0.520833vw]"
                    >
                      <ThreeGreenDots />
                    </button>
                  </aside>
                </article>
                <article className="w-[45%] flex flex-row justify-between max-lg:w-full"></article>
              </section>
              <section className="relative flex flex-row w-[63.75vw] items-center justify-between gap-[4vw] mb-[2.314815vh] max-lg:flex-col max-lg:items-stretch max-lg:gap-2 !max-lg:w-full">
                <article className="w-[55%] flex flex-row gap-[2.838542vw] max-lg:w-full">
                  <label
                    htmlFor="clientName"
                    className="h-[5.277778vh] w-[12vw] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-start items-center"
                  >
                    <p>Home Phone</p>
                  </label>
                  <aside className="flex flex-row w-full h-[5.277778vh]">
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      //   value={
                      //     pendingModalWindowData &&
                      //     pendingModalWindowData[0].home_phone
                      //   }
                      className="w-[100%] h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                  </aside>
                </article>
                <article className="w-[45%] flex flex-row justify-between max-lg:w-full"></article>
              </section>
              <section className="relative flex flex-row w-[63.75vw] items-center justify-between gap-[4vw] max-lg:flex-col max-lg:items-stretch max-lg:gap-2 !max-lg:w-full">
                <article className="w-[55%] flex flex-row gap-[2.838542vw] max-lg:w-full">
                  <label
                    htmlFor="clientName"
                    className="h-[5.277778vh] w-[12vw] text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3] flex justify-start items-center"
                  >
                    <p>Work Phone</p>
                  </label>
                  <aside className="flex flex-row w-full h-[5.277778vh]">
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      //   value={
                      //     pendingModalWindowData &&
                      //     pendingModalWindowData[0].work_phone
                      //   }
                      className="w-[100%] h-[5.277778vh] bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] text-[#959595] font-medium leading-[1.805555vh] pl-[1.041666vw]"
                    />
                  </aside>
                </article>
                <article className="w-[45%] flex flex-row justify-between max-lg:w-full"></article>
              </section>
            </div>
          </article>
        </section>
        {/* note section */}
        <section className="w-[67.916667vw] h-[36.481481vh] mt-[4.074074vh] ml-[2.65625vw] !max-lg:w-full max-lg:h-auto max-lg:mt-2 max-lg:ml-0 max-lg:px-2">
          {/* header */}
          <article className="w-full flex flex-row justify-between items-center py-[2.314815vh] px-[2.083333vw] bg-[#C9EBE6] rounded-t-[1.041667vw]">
            <p className="text-[2.777778vh] font-semibold leading-[1.805556vh] text-[#00A78B]">
              Note
            </p>
            <ShowInfo />
          </article>
          <article className="w-full flex flex-col border-b-[0.15625vw] border-l-[0.15625vw] border-r-[0.15625vw] border-[#C9EBE6] rounded-b-[1.041667vw] pb-[4.074074vh]">
            {/* note */}
            <div className="h-[14vh] overflow-y-scroll">
              {/* <section className="relative w-[63.90625vw] h-fit bg-[#DEF2FF] pt-[1.018519vh] pl-[0.885417vw] pr-[0.885417vw] pb-[1.388889vh] rounded-[0.520833vw] mx-auto mt-[1.666667vh]">
                                <p className="text-[1.666667vh] font-normal leading-[2.314815vh] text-[#959595] mb-[5vh]">
                                  Hey
                                </p>
                                <p className="text-[1.296296vh] text-[#959595] font-light leading-[1.805556.vh] ">
                                  <span className="font-bold mr-[1.1vw]">{`Daniel R.`}</span>{' '}
                                  25/05/2024
                                </p>
                              </section>
                              <section className="relative w-[63.90625vw] h-fit bg-[#DEF2FF] pt-[1.018519vh] pl-[0.885417vw] pr-[0.885417vw] pb-[1.388889vh] rounded-[0.520833vw] mx-auto mt-[1.666667vh]">
                                <p className="text-[1.666667vh] font-normal leading-[2.314815vh] text-[#959595] mb-[5vh]">
                                  Hey
                                </p>
                                <p className="text-[1.296296vh] text-[#959595] font-light leading-[1.805556.vh] ">
                                  <span className="font-bold mr-[1.1vw]">{`Daniel R.`}</span>{' '}
                                  25/05/2024
                                </p>
                              </section> */}
            </div>
            {/* input */}
            <textarea
              // onChange={handleChangeNote}
              // value={noteInput}
              name=""
              id=""
              cols={20}
              rows={10}
              className="w-[63.90625vw] h-[19.351852vh] resize-none outline-none bg-[#F4F4F4] rounded-[0.520833vw] text-[1.666667vh] font-medium leading-[1.805556vh] text-[#959595] py-[1.388889vh] px-[0.885417vw] mx-auto mt-[1.666667vh] !max-lg:w-full max-lg:h-32 !max-lg:text-sm"
              placeholder="Type note here"
            ></textarea>
          </article>
          <motion.button
            // onClick={handleClosePendingWindow}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-[11.875vw] h-[5.462963vh] mt-[4.166667vh] ml-[56vw] flex justify-center items-center text-[1.626852vh] font-semibold leading-[2.440741vh] rounded-[0.653646vw] bg-[#00A78B] text-[#FFFFFF] !max-lg:w-[calc(100%-1rem)] max-lg:mx-2 max-lg:mt-4 max-lg:h-11 !max-lg:text-sm"
          >
            Save
          </motion.button>
        </section>
      </div>
    </motion.aside>
  );
}
