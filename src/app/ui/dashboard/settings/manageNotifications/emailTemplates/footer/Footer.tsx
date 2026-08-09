/* eslint-disable @next/next/no-img-element */
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { Button } from '&/buttons/Button';
import { motion } from 'framer-motion';

export function Footer({
  width,
  height,
  img,
  letterhead,
  onChange,
}: {
  height: number;
  width: number;
  img: any;
  letterhead: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <article className="w-full min-h-[6vh] flex flex-col gap-[2vh] justify-center items-center mt-3 border-[0.01vw] border-[#B3B3B3] rounded-[0.2vw]">
      <aside className="h-fit w-full px-[0.5vw] py-[0.5vh] border-b-[0.01vw] border-[#B3B3B3] bg-[#C9EBE6]">
        <Paragraph color="#00A78B">Footer</Paragraph>
      </aside>
      {!letterhead && (
        <aside className="w-full h-fit px-[0.5vw]">
          <input
            type="file"
            name="footer"
            id="footer"
            className="hidden"
            accept="PDF, JPG, JPEG, PNG"
            onChange={onChange}
          />
          <label htmlFor="footer">
            <motion.aside
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-[6.25vw] h-[5.277778vh] flex justify-center items-center text-[#00A78B] bg-[#FFF] border-[0.02vw] border-[#00A78B] font-semibold transition-colors ease-in-out rounded-[0.653646vw] text-[1.626852vh] cursor-pointer"
              data-identity={'footer'}
            >
              {img ? 'Clear image' : 'Select image'}
            </motion.aside>
          </label>
        </aside>
      )}
      {img ? (
        <img
          width={`${width}vw`}
          height={`${height}vh`}
          src={img}
          alt="Image for the email header template"
          className="px-[1.5vw] py-[1.5vh]"
        />
      ) : (
        <Paragraph fontSize={3}>No footer configured</Paragraph>
      )}
    </article>
  );
}
