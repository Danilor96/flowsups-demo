import { Button } from '&/miscellaneous/dottedOptionsButton/button/Button';
import { Options } from '&/miscellaneous/dottedOptionsButton/options/Options';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { adminDashboardStore, messagesStore } from '@/store/adminDashboard';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
//
export function DottedOptionsButton({ appId }: { appId: number }) {
  // ----- global states -----
  const { data: session } = useSession();

  const userId = session?.user.id;

  const { setMessages } = messagesStore();

  const { getDailyMadeAppointments } = adminDashboardStore();

  // ----- local states -----
  const { isOpen, ref, toggleOpen } = useUiHandler();

  const [disabledInput, setDisabledInput] = useState(false);

  const [inputs, setInputs] = useState<{
    completed: string;
    cancel: string;
    reschedule: string;
  }>({
    completed: '',
    cancel: '',
    reschedule: '',
  });

  const handleAction = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.currentTarget;

    if (e.currentTarget instanceof HTMLInputElement) {
      const { checked } = e.currentTarget;
      const { index } = e.currentTarget.dataset;

      if (checked && name && index) {
        setDisabledInput(true);

        const formData = new FormData();

        formData.append('action', name);

        try {
          const res = await (
            await fetch(`/api/adminDashboard/dailyAppointments/${index}`, {
              method: 'PUT',
              body: formData,
            })
          ).json();

          if (res.successMessage) {
            setMessages(undefined, res.successMessage);
            userId && getDailyMadeAppointments(userId);
            toggleOpen();
          }
          if (res.serverError) {
            setMessages(res.serverError);
          }
        } catch (error) {
          setMessages('An error occurred');
        }

        setDisabledInput(false);
      }
    }
  };

  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleOpen();
  };

  return (
    <aside className="relative w-fit h-fit mx-auto" ref={ref}>
      <Button onClick={handleButton} />
      {isOpen && (
        <Options onChange={handleAction} inputs={inputs} disabled={disabledInput} appId={appId} />
      )}
    </aside>
  );
}
