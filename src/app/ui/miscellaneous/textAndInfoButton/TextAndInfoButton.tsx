import { ButtonContainer } from '&/buttons/ButtonContainer';
import { ContentRow } from '&/modalWindowsStructure/ContentRow';
import { Paragraph } from '&/miscellaneous/paragraph/Paragraph';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoDisplay } from '&/miscellaneous/textAndInfoButton/infoDisplay/InfoDisplay';
import { useState } from 'react';
import { InfoIcon } from '&/icons/Icons';

export function TextAndInfoButton({ text, info }: { text: string; info: string }) {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  return (
    <ContentRow cols={1} gap={1.5}>
      <ButtonContainer marginTop={0} widthFull justify="space-between">
        <article className="w-fit h-fit flex flex-row justify-center items-center gap-[0.5vw]">
          <Paragraph fontSize={1.9} fontWeight={500}>
            {text}
          </Paragraph>
          <section className="relative w-fit h-fit flex flex-col justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowInfo(!showInfo)}
              className="w-[1.2vw] h-[1.2vw] flex justify-center items-center rounded-full font-semibold"
            >
              <InfoIcon />
            </motion.button>
            <AnimatePresence>{showInfo && <InfoDisplay info={info} />}</AnimatePresence>
          </section>
        </article>
      </ButtonContainer>
    </ContentRow>
  );
}
