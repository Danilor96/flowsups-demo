import { LoadingIcon } from '@/app/ui/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { messagesStore } from '@/store/adminDashboard';
import { useRef, useState } from 'react';

export const DailyTargetUserInput = ({
  userId,
  currentDailyTarget,
  dailybusinessTarget,
}: {
  currentDailyTarget: number;
  userId: number;
  dailybusinessTarget?: number;
}) => {
  const setMessages = messagesStore(state => state.setMessages);
  const [inputValue, setInputValue] = useState<number | null>(currentDailyTarget);
  const [loading, setLoading] = useState<boolean>(false);
  const inputEditedRef = useRef<NodeJS.Timeout | null>(null);

  const updateDailyTargetPut = async (userId: number, dailyTarget: number | null) => {
    const formData = new FormData();
    dailyTarget && formData.append('daily_target', dailyTarget.toString());

    try {
      setLoading(true);
      const response = await fetch(`/api/adminDashboard/users/${userId}/dailyPointsTarget`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (data.serverError || data.error) {
        setMessages(data.serverError || data.error);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error updating daily target:', error);
    }
  };

  const handleUpdateDailyTarget = async (userId: number, dailyTarget: number | null) => {
    if (inputEditedRef.current) clearTimeout(inputEditedRef.current);

    inputEditedRef.current = setTimeout(async () => {
      await updateDailyTargetPut(userId, dailyTarget);
    }, 1000);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? null : parseInt(e.target.value);
    setInputValue(newValue);
    handleUpdateDailyTarget(userId, newValue);
  };

  return (
    <div className="flex gap-1 relative items-center">
      <input
        type="number"
        value={inputValue || ''}
        className="w-[4rem] h-full px-2 p-1 bg-transparent transition-colors outline-none
          text-white border border-transparent hover:border-white focus:border-white
        "
        onChange={e => onChange(e)}
      />
      {/* <span className="absolute right-0 animate-spin text-white">{loading && <LoadingIcon />}</span> */}
      {loading && (
        <svg
          className="size-5 animate-spin text-white z-[10]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
    </div>
  );
};

export default DailyTargetUserInput;
