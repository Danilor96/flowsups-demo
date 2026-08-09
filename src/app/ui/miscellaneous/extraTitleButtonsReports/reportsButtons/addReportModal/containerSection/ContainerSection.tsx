import { SelectDropIcon } from '@/app/ui/icons/Icons';
import { useState } from 'react';

export const ContainerSection = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="w-full flex flex-col border border-[#C9EBE6] rounded-xl overflow-hidden">
      <button
        className="h-[20%] bg-[#C9EBE6] flex items-center justify-between px-4 py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h6 className="text-[#00A78B] text-lg font-semibold">{title}</h6>
        <SelectDropIcon color="#00A78B" />

        {/* </div> */}
      </button>
      <div
        className={`h-[80%] px-6 py-4 transition-all duration-300 opacity-${isOpen ? '100' : '0'} ${
          isOpen ? 'block ' : 'hidden'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
