import { CloseWindow } from '@/app/libs/definitions';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { Button } from '&/buttons/Button';
import { NextBtnIcon, PrevBtnIcon } from '&/icons/Icons';
import { SalesScore } from '&/dashboard/reports/salesLog/salesLogStatistics/salesScore/SalesScore';
// import { Marketing } from '&/dashboard/reports/salesLog/salesLogStatistics/marketing/Marketing';
import { Sources } from '&/dashboard/reports/salesLog/salesLogStatistics/sources/Sources';
import { Banks } from '&/dashboard/reports/salesLog/salesLogStatistics/banks/Banks';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MonthNavigator } from '@/app/ui/miscellaneous/monthNavigator/MonthNavigator';

export function SalesLogStatistics({ closeWindow }: CloseWindow) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // handling close window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  //   handling buttons
  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { identity } = e.currentTarget.dataset;

    if (identity === 'prev') {
      currentIndex === 0 ? setCurrentIndex(2) : setCurrentIndex(currentIndex - 1);
    }

    if (identity === 'next') {
      currentIndex === 2 ? setCurrentIndex(0) : setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <ModalWindow top={0} minSizeFull>
      <ModalContainer marginTop={3} width={85.916667}>
        <ModalContainerTitle title="Sales Log Statistics" closeWindowFunction={handleCloseWindow}
          extraComponent={<div className='ml-[-10vw]'>
            <MonthNavigator />
          </div>}
        />
        <ModalContent height={83.518519} flexbox flexRow >
          <Button
            backgroundColor="#FFF"
            height={5}
            width={2}
            identity="prev"
            textColor="#048969"
            buttonIcon={<PrevBtnIcon height={4} />}
            verticalCenter
            onClick={handleButton}
          />
          <AnimatePresence>
            {currentIndex === 0 && <SalesScore />}
            {/* {currentIndex === 1 && <Marketing />} */}
            {currentIndex === 1 && <Sources />}
            {currentIndex === 2 && <Banks />}
          </AnimatePresence>
          <Button
            backgroundColor="#FFF"
            height={5}
            width={2}
            identity="next"
            textColor="#048969"
            buttonIcon={<NextBtnIcon height={4} />}
            verticalCenter
            onClick={handleButton}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
