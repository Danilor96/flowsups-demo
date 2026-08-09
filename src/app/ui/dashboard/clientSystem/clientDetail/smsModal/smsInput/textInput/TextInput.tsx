import { useEffect, useRef } from 'react';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';

export function TextInput({
  sms,
  disabled,
  widthFull,
  fieldErrors,
  handleChangeSms,
}: {
  sms: string;
  disabled: boolean;
  widthFull?: boolean;
  fieldErrors?:
    | {
        [key: string]: [string | undefined];
      }
    | undefined;
  handleChangeSms: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = '0px';
      const scrollHeight = textAreaRef.current.scrollHeight;
      textAreaRef.current.style.height = scrollHeight + 'px';
    }
  }, [sms]);

  return (
    <article
      className="relative"
      style={{
        width: widthFull ? '100%' : '90%',
      }}
    >
      <textarea
        ref={textAreaRef}
        disabled={disabled}
        spellCheck="false"
        name="message"
        id="message"
        value={sms}
        onChange={handleChangeSms}
        placeholder="Enter Text here"
        className="w-full outline-none bg-[#F4F4F4] font-medium text-[#959595] resize-none py-[1.2vh] max-h-[20vh] overflow-y-auto"
        style={{
          paddingInline: widthFull ? '0.5vw' : '',
          lineHeight: widthFull ? '2.5vh' : '1.805556vh',
          fontSize: widthFull ? '1.8vh' : '1.666667vh',
        }}
      />
      <FieldErrorMessage name="message" fieldErrors={fieldErrors} fieldErrorWidthMaxContent />
    </article>
  );
}
