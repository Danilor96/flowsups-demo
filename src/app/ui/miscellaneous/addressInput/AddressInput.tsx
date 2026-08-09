import { HTMLAttributes, useEffect } from 'react';
import { MainInput } from './mainInput/MainInput';
import { adminDashboardStore } from '@/store/adminDashboard';
import { IsLoadingComponent } from '../../inputs/isLoadingComponent/IsLoadingComponent';

export function AddressInput({
  width,
  mainInput,
  dontGetStates,
  addressOptions,
  props,
  manualStates,
  fieldErrorWidthMaxContent,
  fieldErrorBottom,
  fieldErrorMessage,
  disabled,
  fieldErrorTop,
  isLoading,
}: {
  width: number;
  dontGetStates?: boolean;
  isLoading?: boolean;
  mainInput: {
    label: string;
    name: string;
    value: string;
    id: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, index?: number) => void;
  };
  addressOptions: {
    street: string;
    streetName: string;
    city: string;
    cityName: string;
    state: string;
    stateName: string;
    zip: string;
    zipName: string;
    county: string;
    countyName: string;
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      index?: number,
    ) => void;
  };
  manualStates?:
    | {
        id: number;
        state: string;
      }[];
  props?: HTMLAttributes<HTMLElement>;
  fieldErrorWidthMaxContent?: boolean;
  fieldErrorBottom?: number;
  fieldErrorTop?: number;
  fieldErrorMessage?: string | null;
  disabled?: boolean;
}) {
  // ----- global states -----

  const { getStates } = adminDashboardStore();

  useEffect(() => {
    if (!dontGetStates) {
      getStates();
    }
  }, [getStates, dontGetStates]);

  // ----- local states -----

  return (
    <div
      className="relative flex flex-col gap-[1.666667vh]"
      style={{
        width: width === 0 ? '100%' : `${width}vw`,
      }}
      {...props}
    >
      <label
        htmlFor={mainInput.id}
        className="text-[1.626852vh] font-medium leading-[2.440741vh] text-[#B3B3B3]"
      >
        {mainInput.label}
      </label>
      <MainInput
        value={mainInput.value}
        addressOptions={addressOptions}
        onChange={mainInput.onChange}
        name={mainInput.name}
        manualStates={manualStates}
        id={mainInput.id}
        disabled={disabled}
      />
      {fieldErrorMessage && (
        <p
          className="absolute text-[1.666667vh] text-[#F00]"
          style={{
            width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
            bottom: !fieldErrorTop ? (fieldErrorBottom ? `${fieldErrorBottom}vh` : '-2.1vh') : '',
            top: fieldErrorTop ? `${fieldErrorTop}vh` : '100%',
          }}
        >
          {fieldErrorMessage}
        </p>
      )}
      {isLoading && <IsLoadingComponent />}
    </div>
  );
}
