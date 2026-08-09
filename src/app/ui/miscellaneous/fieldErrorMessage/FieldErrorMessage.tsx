import { AnimatePresence, motion } from 'framer-motion';

export function FieldErrorMessage({
  fieldErrors,
  fieldErrorWidthMaxContent,
  name,
  top,
  left,
  right,
  fontSize,
  positionStatic,
  textCenter,
  rightLeftAuto,
}: {
  fieldErrors?: { [key: string]: [string | undefined] };
  fieldErrorWidthMaxContent?: boolean;
  name: string;
  top?: number;
  left?: number;
  right?: number;
  fontSize?: number;
  positionStatic?: boolean;
  rightLeftAuto?: boolean;
  textCenter?: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <AnimatePresence>
      {fieldErrors && name && fieldErrors[name] && fieldErrors[name].length > 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="text-[#F00]"
          style={{
            position: positionStatic ? 'static' : 'absolute',
            width: fieldErrorWidthMaxContent ? 'max-content' : undefined,
            bottom: !top ? '-2.1vh' : '',
            top: top ? `${top}vh` : '100%',
            left: left ? `${left}vw` : '',
            right: rightLeftAuto ? '50%' : right ? `${right}vw` : '',
            textAlign: textCenter ? 'center' : undefined,
            fontSize: fontSize ? `${fontSize}vh` : '1.666667vh',
            translateX: rightLeftAuto ? '50%' : '',
          }}
        >
          {fieldErrors[name][0]}
        </motion.p>
      ) : (
        ''
      )}
    </AnimatePresence>
  );
}
