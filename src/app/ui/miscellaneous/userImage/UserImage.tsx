/* eslint-disable @next/next/no-img-element */
import { UploadUserImageIcon } from '&/icons/Icons';
import { adminDashboardStore } from '@/store/adminDashboard';
import { AnimatePresence, motion } from 'framer-motion';
import { Can } from '&/auth/Can';
import { useCan } from '@/hooks/permissions';

export function UserImage({
  localImageUploaded,
  fieldErrors,
  handleImageUpload,
  profileUrl,
}: {
  localImageUploaded: any;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors?: { [key: string]: [string | undefined] };
  profileUrl?: string;
}) {
  // ----- global states -----

  const { userImage } = adminDashboardStore();

  const { can } = useCan();

  // ----- local states -----

  const profileImageUrl = localImageUploaded ? localImageUploaded : profileUrl;

  return (
    <section className="relative w-fit h-fit mt-[4vh]">
      <article className="w-[16.2vw] h-[27vh] rounded-[0.78125vw] overflow-hidden">
        <img
          src={
            profileImageUrl
              ? profileImageUrl
              : 'https://firebasestorage.googleapis.com/v0/b/flowsups-iles.appspot.com/o/documents%2Fflowsups_default_avatar.png?alt=media&token=dd8f6b14-d933-4c9c-a694-51ef5f71e353'
          }
          alt="User image"
          className="w-full h-full object-contain object-center"
        />
      </article>
      <Can requiredPermission={36}>
        <label
          htmlFor="userImage"
          className="absolute bottom-[-1.4vh] right-[-0.8vw] z-10 w-fit h-fit cursor-pointer object-cover"
        >
          <UploadUserImageIcon />
        </label>
      </Can>
      <input
        type="file"
        accept="image/*"
        name="userImage"
        id="userImage"
        hidden
        onChange={can(36) ? handleImageUpload : () => {}}
      />
      <AnimatePresence>
        {fieldErrors && fieldErrors.userImage && fieldErrors.userImage.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-[-5vh] text-[1.666667vh] text-[#F00]"
          >
            {fieldErrors && fieldErrors.userImage[0]}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
}
