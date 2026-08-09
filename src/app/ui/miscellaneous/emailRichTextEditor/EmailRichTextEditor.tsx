import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { Input } from '&/inputs/Input';
import { FieldErrorMessage } from '&/miscellaneous/fieldErrorMessage/FieldErrorMessage';

const DynamicComponentWithNoSSR = dynamic(() => import('react-quill'), { ssr: false });

export function EmailRichTextEditor({
  value,
  subject,
  fieldErrors,
  onChange,
  onSubjectChange,
}: {
  value: string;
  subject: string;
  onSubjectChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onChange: (value: string) => void;
  fieldErrors?: {
    [key: string]: [string | undefined];
  };
}) {
  // ----- global states -----

  // ----- local states -----

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
  ];

  return (
    <>
      <div className="px-[0.5vw] border-x border-t border-[#c0c0c0] overflow-hidden">
        <aside className="relative w-full h-[5vh] flex flex-row items-center">
          <Paragraph fontSize={2} color="#00a78b">
            Subject:{' '}
          </Paragraph>
          <Input
            fontSize={2}
            label=""
            name="subject"
            type="text"
            width={0}
            widthFull
            backgroundColor="#FFF"
            value={subject}
            onChange={onSubjectChange}
          />
        </aside>
        <FieldErrorMessage
          name="subject"
          top={2.5}
          left={0}
          positionStatic
          fieldErrors={fieldErrors}
          fontSize={2}
        />
      </div>
      <div>
        <DynamicComponentWithNoSSR
          theme="snow"
          value={value}
          onChange={onChange}
          modules={{
            toolbar: toolbarOptions,
          }}
          className="toolbar"
        />
        <FieldErrorMessage
          name="emailBody"
          top={0}
          left={0}
          fieldErrors={fieldErrors}
          fontSize={2}
          positionStatic
        />
      </div>
    </>
  );
}
