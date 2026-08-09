import { EyeClosed, EyeIcon } from '@/app/ui/icons/Icons';
import { IsLoadingComponent } from '@/app/ui/inputs/isLoadingComponent/IsLoadingComponent';
import { phoneNumbersFormatStore } from '@/store/phoneNumbersFormat';
import { useState } from 'react';

export function SsnInput({
  onChange,
  disabled,
  value,
  isLoading,
}: {
  value: string;
  disabled?: boolean;
  isLoading?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, showSsn: boolean) => void;
}) {
  // global states

  const { ssnFormat } = phoneNumbersFormatStore();

  // local states

  const [showSSN, setShowSSN] = useState(false);

  return (
    <div className="flex relative w-[16.458333vw] items-center">
      <input
        type="text"
        onChange={(e) => onChange(e, showSSN)}
        value={
          showSSN
            ? ssnFormat(value)
            : (() => {
                const digits = value.replaceAll('-', ''); //replace(/\D/g, '');
                if (digits.length <= 4) return ssnFormat(digits);
                const visiblePart = digits.slice(-4);
                const maskedPart = digits.slice(0, -4).replace(/./g, '•');
                const fullMasked = maskedPart + visiblePart;
                let formattedMasked = '';
                if (fullMasked.length > 0) formattedMasked += fullMasked.slice(0, 3);
                if (fullMasked.length > 3) formattedMasked += '-' + fullMasked.slice(3, 5);
                if (fullMasked.length > 5) formattedMasked += '-' + fullMasked.slice(5, 9);
                return formattedMasked;
              })()
        }
        name="ssn"
        id="ssn"
        disabled={disabled}
        placeholder="AAA-GG-SSSS"
        className="w-full h-[5.277778vh] rounded-[0.520833vw] text-[1.666667vh] text-[#585858] font-medium leading-[1.805555vh] pl-[1.041666vw] pr-[3vw] outline-none"
        style={{ backgroundColor: disabled ? '#C9EBE6' : '#F4F4F4' }}
      />
      <button
        type="button"
        onClick={() => setShowSSN(!showSSN)}
        className="absolute right-[0.6vw] z-10"
      >
        {showSSN ? <EyeIcon /> : <EyeClosed />}
      </button>
      {isLoading && <IsLoadingComponent />}
    </div>
  );
}
