/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { UploadUserImageIcon } from '&/icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';

export function ImageInput({
  width,
  height,
  radius,
  name,
  onChange,
  localImageUploaded,
  fieldErrors,
  path,
  shadow,
}: {
  width: number;
  height: number;
  radius: number;
  name: string;
  path?: string;
  localImageUploaded: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
  shadow?: boolean;
}) {
  return (
    <section className="relative w-fit h-fit">
      <article
        className={`overflow-hidden ${shadow ? 'shadow-crmFormShadow' : ''}`}
        style={{
          width: `${width}vw`,
          height: `${height}vh`,
          borderRadius: `${radius}vw`,
        }}
      >
        <img
          src={
            localImageUploaded
              ? localImageUploaded
              : path
              ? path
              : '/users/flowsups_default_avatar.png'
          }
          alt="Business Image"
          className="w-full h-full object-contain object-center"
        />
        <label
          htmlFor={name}
          className="absolute bottom-[-1.4vh] right-[-0.8vw] z-10 w-fit h-fit cursor-pointer object-cover"
        >
          <UploadUserImageIcon />
        </label>
        <input type="file" accept="image/*" name={name} id={name} hidden onChange={onChange} />
      </article>
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-[-6vh] text-[1.666667vh] text-[#F00]"
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
