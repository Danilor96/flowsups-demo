import { SearchLensGreen } from '&/icons/Icons';
import { handlingCapitalWords } from '@/app/libs/functions/inputs/inputsFunction';
import { messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { dashboardSearchStore } from '@/store/dashboardSearch';
import { useRef, useState } from 'react';

interface props {
  setLoading: (value: boolean) => void;
  resultsIsOpen: boolean;
  toggleOpen: () => void;
}

export function InputLogo({ setLoading, resultsIsOpen, toggleOpen }: props) {
  // ----- global states -----

  const { customersList, dashboardSearchCustomers } = dashboardSearchStore();
  const { openCustomersLists, getDashboardSearchCustomers, closeCustomersLists } =
    dashboardSearchStore();

  const { iconedSelectOptions } = modalWindowStore();
  const { openCloseIconedSelectOptions, closeUserNotifications, closeUserInfoOptions } =
    modalWindowStore();

  const { setMessages } = messagesStore();

  // ----- local states -----
  const searchDebounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [val, setVal] = useState('');

  const handleMakeSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    const { value } = e.currentTarget;

    setVal(handlingCapitalWords(value));

    if (value.trim() === '' && inputRef.current) {
      inputRef.current.value = '';
      closeCustomersLists();
      return;
    }

    searchDebounceRef.current = setTimeout(async () => {
      try {
        if (!resultsIsOpen) toggleOpen();
        openCustomersLists();
        setLoading(true);

        await getDashboardSearchCustomers(value).finally(() => {
          setLoading(false);
        });
      } catch (error) {
        setLoading(false);
        setMessages('An error occurred');
      }
    }, 500);
  };

  return (
    <article className="relative w-full h-[5.277778vh] border-[0.104167vw] border-[#00A78B] rounded-[1vw] pl-[0.9375vw] pr-[0.9375vw] flex flex-row justify-between items-center">
      <label htmlFor="customerSearch">
        <SearchLensGreen />
      </label>
      <input
        ref={inputRef}
        onChange={handleMakeSearch}
        // onClick={() => {
        //   if(customersList) return closeCustomersLists();
        //   openCustomersLists();
        //   // closeUserNotifications();
        //   // closeUserInfoOptions();
        //   // if (
        //   //   !iconedSelectOptions &&
        //   //   !customersList &&
        //   //   dashboardSearchCustomers &&
        //   //   dashboardSearchCustomers.length > 0
        //   // ) {
        //   //   openCloseIconedSelectOptions();
        //   //   openCustomersLists();
        //   // }
        // }}
        // value={inputValue}
        type="text"
        // disabled={loading}
        value={val}
        id="customerSearch"
        autoComplete="off"
        className="w-full pl-3 pr-2 h-full bg-[#00000000] text-[#00A78B] text-[1.481481vh] placeholder:text-[#00A78B] placeholder:text-[1.481481vh] outline-none"
        placeholder="Customer search"
      />
    </article>
  );
}
