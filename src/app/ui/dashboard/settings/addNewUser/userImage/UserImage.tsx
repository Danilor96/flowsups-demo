/* eslint-disable @next/next/no-img-element */
import { UploadUserImageIcon } from '&/icons/Icons';
import { AnimatePresence, motion } from 'framer-motion';

export function UserImage({
  localImageUploaded,
  fieldErrors,
  name,
  fieldErrorBottom,
  fieldErrorWidthMaxContent,
  width,
  height,
  onChange,
}: {
  localImageUploaded: any;
  fieldErrors?: { [key: string]: [string | undefined] };
  name: string;
  fieldErrorWidthMaxContent?: boolean;
  fieldErrorBottom?: number;
  width?: number;
  height?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <section className="relative w-fit h-fit">
      <article
        className="rounded-[0.78125vw] overflow-hidden"
        style={{
          width: width ? `${width}vw` : '19.166667vw',
          height: height ? `${height}vh` : '31.666667vh',
        }}
      >
        <img
          src={
            localImageUploaded
              ? localImageUploaded
              : 'https://firebasestorage.googleapis.com/v0/b/flowsups-iles.appspot.com/o/documents%2Fflowsups_default_avatar.png?alt=media&token=dd8f6b14-d933-4c9c-a694-51ef5f71e353'
          }
          alt="User image"
          className="w-full h-full object-contain object-center"
        />
      </article>
      <label
        htmlFor="userImage"
        className="absolute bottom-[-1.4vh] right-[-0.8vw] w-fit h-fit cursor-pointer object-cover bg-white rounded-md shadow-addNewReportHeadShadow"
      >
        <UploadUserImageIcon />
      </label>
      <input
        type="file"
        accept="image/*"
        name="userImage"
        id="userImage"
        hidden
        onChange={onChange}
      />
      <AnimatePresence>
        {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute text-[1.666667vh] text-[#F00]"
            style={{
              width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
              bottom: fieldErrorBottom ? `${fieldErrorBottom}vh` : '-2.1vh',
            }}
          >
            {fieldErrors[name][0]}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
