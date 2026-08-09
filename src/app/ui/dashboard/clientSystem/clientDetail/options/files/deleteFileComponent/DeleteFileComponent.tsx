import { Button } from '&/buttons/Button';
import { useState } from 'react';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '@/firebase/firebase.config';
import { adminDashboardStore, messagesStore, singleCLientDataStore } from '@/store/adminDashboard';
import { Loader } from '@/app/ui/miscellaneous/loader/Loader';

export function DeleteFileComponent({ id, path }: { id: number; path: string }) {
  // ----- global states -----

  const { singleCLientData } = singleCLientDataStore();

  const { setMessages } = messagesStore();

  const { getFiles } = adminDashboardStore();

  // ----- local states -----

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    const { identity } = e.currentTarget.dataset;

    if (value && identity) {
      setLoading(true);

      const fileRef = ref(storage, value);

      try {
        await deleteObject(fileRef);

        const res = await (
          await fetch(`/api/adminDashboard/files/${identity}`, { method: 'DELETE' })
        ).json();

        if (res.successMessage && singleCLientData?.id) {
          setMessages(undefined, res.successMessage);
          getFiles(parseInt(singleCLientData?.id.toString()));
        }
        if (res.serverError) {
          setMessages(res.serverError);
        }
      } catch (error) {
        setMessages('An error occurred');
      }

      setLoading(false);
    } else {
      setMessages('An error occurred');
    }
  };

  return (
    <th>
      {loading && <Loader zIndex={100} />}
      <button
        onClick={() => setShowConfirmation(!showConfirmation)}
        className="absolute top-0 right-0 bottom-0 left-0 bg-red-500 hover:opacity-70 transition-opacity opacity-45"
      ></button>
      {showConfirmation && (
        <section className="absolute top-0 right-[50%] translate-x-[50%] w-fit h-fit flex flex-row justify-center items-center gap-[0.7vw] pl-[0.2vw] bg-red-800 bg-opacity-55 rounded-[0.5vw]">
          <p className="text-[2.25vh]">Are you sure you want to delete this file?</p>
          <article className="flex flex-row justify-center items-center gap-[1vw]">
            <Button
              width={7}
              backgroundColor="#FFF"
              identity="no"
              onClick={() => setShowConfirmation(false)}
              textColor="#111827"
              buttonText="No"
              buttonTextSize={2}
              borderRadius={0.520833}
            />
            <Button
              width={7}
              backgroundColor="#ef4444"
              identity={`${id}`}
              value={path}
              onClick={handleDelete}
              textColor="#FFF"
              buttonText="Yes"
              buttonTextSize={2}
              borderRadius={0.520833}
            />
          </article>
        </section>
      )}
    </th>
  );
}
