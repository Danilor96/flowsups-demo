import { CloseWindow } from '@/app/libs/definitions';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalContent } from '&/modalWindowsStructure/ModalContent';
import { CsvIcon, PdfIcon, XlsxIcon } from '&/icons/Icons';
import { Button } from '&/buttons/Button';
import { ButtonContainer } from '&/buttons/ButtonContainer';

export function DownloadWindow({ closeWindow }: CloseWindow) {
  // handle close current window
  const handleCloseWindow = () => {
    closeWindow(false);
  };

  //   handling buttons
  const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {};

  const btnInfo = [
    {
      key: 1,
      backgroundColor: '#FFF',
      height: 18.518519,
      identity: 'csv',
      textColor: '#00A78B',
      width: 10.416667,
      border: 0.104167,
      borderColor: '#00A78B',
      buttonText: 'CSV',
      buttonTextSize: 1.9,
      iconTextGap: 0.729167,
      buttonIcon: <CsvIcon />,
      iconAbove: true,
      onClick: handleButton,
    },
    {
      key: 2,
      backgroundColor: '#FFF',
      height: 18.518519,
      identity: 'pdf',
      textColor: '#00A78B',
      width: 10.416667,
      border: 0.104167,
      borderColor: '#00A78B',
      buttonText: 'PDF',
      buttonTextSize: 1.9,
      iconTextGap: 0.729167,
      buttonIcon: <PdfIcon />,
      iconAbove: true,
      onClick: handleButton,
    },
    {
      key: 3,
      backgroundColor: '#FFF',
      height: 18.518519,
      identity: 'xlsx',
      textColor: '#00A78B',
      width: 10.416667,
      border: 0.104167,
      borderColor: '#00A78B',
      buttonText: 'XLSX',
      buttonTextSize: 1.9,
      iconTextGap: 0.729167,
      buttonIcon: <XlsxIcon />,
      iconAbove: true,
      onClick: handleButton,
    },
  ];

  return (
    <ModalWindow top={0} minSizeFull>
      <ModalContainer marginTop={30} width={43.177083}>
        <ModalContainerTitle title="Download" closeWindowFunction={handleCloseWindow} />
        <ModalContent>
          <ButtonContainer marginTop={0} widthFull gap={3.125}>
            {btnInfo.map((el) => (
              <Button
                key={el.key}
                backgroundColor={el.backgroundColor}
                height={el.height}
                identity={el.identity}
                textColor={el.textColor}
                width={el.width}
                border={el.border}
                borderColor={el.borderColor}
                buttonText={el.buttonText}
                buttonTextSize={el.buttonTextSize}
                buttonIcon={el.buttonIcon}
                iconTextGap={el.iconTextGap}
                iconAbove={el.iconAbove}
                onClick={el.onClick}
              />
            ))}
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWindow>
  );
}
