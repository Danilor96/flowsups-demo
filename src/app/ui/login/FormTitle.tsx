export function FormTitle({ title, text }: { title: string; text: string }) {
  return (
    <article className="w-full mb-[2rem] lg:w-[24.579167vw] flex flex-col justify-center items-center lg:mb-[5.185185vh]">
      <p className="mb-2 lg:h-[4.166667vh] text-center max-2xl:text-[2.2vh] lg:text-[2.788889vh] font-semibold lg:leading-[4.183333vh] text-mainColor lg:mb-[0.92963vh]">
        {title}
      </p>
      <hr className="w-[60vw] lg:w-[24.033333vw] bg-[#EBEBEB] lg:mb-[1.394444vh]" />
      <p className="max-lg:mt-4 text-lg lg:h-[2.222222vh] lg:text-[1.859259vh] font-medium lg:leading-[2.231481vh] text-formSecondaryColor">
        {text}
      </p>
    </article>
  );
}
