import { useAsyncFetching } from '@/hooks/asyncFetchingHandler';
import { messagesStore } from '@/store/adminDashboard';
import { useSocketStore } from '@/store/socketIo';

export function DefaultPhoneNumber({
  customerId,
  defaultNumber,
  homePhone,
  mobilePhone,
  workPhone,
  phoneNumber,
}: {
  customerId?: number;
  defaultNumber: string;
  mobilePhone?: boolean;
  homePhone?: boolean;
  workPhone?: boolean;
  phoneNumber?: string;
}) {
  // ----- global states -----
  const setMessage = messagesStore(store => store.setMessages);
  const { updateDataWithSocket } = useSocketStore();

  // ----- local states -----

  const { fieldErrors, loadingFetch, makeAsyncFetch } = useAsyncFetching();

  const handleButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const formData = new FormData();

    const apiUrl = `/api/defaultPhoneNumber/${customerId}`;

    if (mobilePhone) formData.append('mobileSelected', '1');
    if (homePhone) formData.append('homeSelected', '1');
    if (workPhone) formData.append('workSelected', '1');
    formData.append('phoneNumber', phoneNumber || '');

    await makeAsyncFetch({
      formData,
      apiUrl,
      method: 'PUT',
      permissionForFetch: 67,
      options: {
        onSuccess: () => {
          updateDataWithSocket('singleClient', undefined, {
            customerId: customerId,
          });
        },
        onFieldErrors: (errors) => {
          if (errors.phoneNumber) {
            setMessage(errors.phoneNumber[0]);
          }
        },
      },
    });
  };

  return (
    <button
      onClick={handleButton}
      disabled={
        loadingFetch ||
        (defaultNumber ? true : false) ||
        (!phoneNumber ||
        phoneNumber.length < 10)
      }
      className={`absolute top-0 right-0 flex justify-center items-center text-[2vh] border rounded-md px-[0.2vw] ${
        defaultNumber
          ? 'text-primaryColor border-primaryColor'
          : 'text-red-400 border-red-400 hover:bg-red-400 hover:text-white'
      } ${
        (!phoneNumber || phoneNumber.length < 10)
          ? 'opacity-50 cursor-not-allowed'
          : ''
      }`}
    >
      {defaultNumber ? 'Default' : 'Not Default'}
    </button>
  );
}
