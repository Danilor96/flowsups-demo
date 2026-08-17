import { TrashDeleteIcon } from '&/icons/Icons';
import { useConsentTermsStore } from '@/store/consentTerms';
import { useState } from 'react';

export function CheckElement({
  id,
  description,
  required,
  onChange,
  onClick,
}: {
  id: number;
  description: string;
  required: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  const { checks } = useConsentTermsStore();

  // ----- local states -----

  const [trashColor, setTrashColor] = useState('#ef4444');

  const checkElExists = () => {
    const checkExists = checks?.find((el) => el.id === id);

    return checkExists ? true : false;
  };

  return (
    <li className="w-full h-[8vh] flex flex-row border-b border-primaryColor">
      <textarea
        onChange={onChange}
        spellCheck="false"
        data-id={id}
        className="w-[84.5%] h-full outline-primaryColor text-[2vh] px-[0.5vw] py-[0.6vh] resize-none max-lg:text-sm max-lg:px-2"
      >
        {description}
      </textarea>
      <aside className="w-[15.5%] h-full flex flex-row gap-[1vw] items-center border-l-2 border-primaryColor text-[2vh] pl-[0.1vw] max-lg:gap-1 max-lg:text-xs">
        <button
          onClick={onClick}
          data-id={id}
          data-identity="requered"
          className={`w-[50%] h-[50%] rounded-md font-semibold transition-colors max-lg:h-8 ${
            required
              ? 'border-2 border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white'
              : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
          }`}
        >
          {required ? 'True' : 'False'}
        </button>
        {checkElExists() && id !== 3 && (
          <button
            onClick={onClick}
            data-id={id}
            data-identity="delete"
            onMouseEnter={() => setTrashColor('#FFF')}
            onMouseLeave={() => setTrashColor('#ef4444')}
            className="w-[50%] h-[50%] flex justify-center items-center border-2 border-red-500 rounded-md hover:bg-red-500 transition-colors max-lg:h-8"
          >
            <TrashDeleteIcon color={trashColor} />
          </button>
        )}
      </aside>
    </li>
  );
}
