/* eslint-disable @next/next/no-img-element */
import { DraggableInputIcon } from '&/icons/Icons';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { ButtonContainer } from '&/buttons/ButtonContainer';
import { motion } from 'framer-motion';

export function FileUploader({
  name,
  height,
  width,
  image,
  onChange,
  fieldErrors,
}: {
  name: string;
  width: number;
  height: number;
  image: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
}) {
  return (
    <section className="relative">
      <input
        type="file"
        name={name}
        id={name}
        draggable
        className="hidden"
        accept="PDF, JPG, JPEG, PNG"
        onChange={onChange}
      />
      <label htmlFor={name} draggable className="w-fit h-fit">
        <div
          className="flex flex-col justify-center items-center gap-1vh border-[0.2vw] border-[#00A78B] border-dashed rounded-[0.520833vw] overflow-hidden"
          style={{
            width: `${width}vw`,
            height: `${height}vh`,
          }}
        >
          {image ? (
            <img
              src={image}
              alt="Image of the new vehicle"
              className="w-full h-full object-contain object-center"
            />
          ) : (
            <>
              <DraggableInputIcon />
              <Paragraph color="#ABE3DB" fontSize={1.9} fontWeight={600}>
                Drag and Drop File here
              </Paragraph>
              <Paragraph color="#ABE3DB" fontSize={1.8} fontWeight={500}>
                PDF , JPG ,JPEG y PNG
              </Paragraph>
            </>
          )}
          <ButtonContainer marginTop={image ? 0 : 3}>
            <motion.label
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              htmlFor={name}
              className="w-[10.2921875vw] h-[5.277778vh] flex justify-center items-center font-semibold rounded-[0.653646vw] bg-[#00A78B] text-[2.3vh] text-[#FFF] cursor-pointer"
            >
              {!image ? 'Choose File' : 'Replace File'}
            </motion.label>
          </ButtonContainer>
        </div>
      </label>
      {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute bottom-[-2.1vh] text-[1.666667vh] text-[#F00]"
        >
          {fieldErrors[name][0]}
        </motion.p>
      )}
    </section>
  );
}
