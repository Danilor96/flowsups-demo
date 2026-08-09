import { AnimatePresence, motion } from 'framer-motion';
import { VerticalWhiteThreeDotsIcon } from '&/icons/Icons';
import { Options } from '&/miscellaneous/optionsButton/options/Options';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { FloatingFocusManager, FloatingPortal, useClick, useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import { useState } from 'react';

export function OptionsButton({
  options,
  optionsWidth,
  optionsHeight,
  optionsBackgroundColor,
  optionsRadius,
  optionsRight,
  optionsLeft,
  optionsBottom,
  optionsTop,
  optionsZIndex,
  identity,
  itemId,
  placement = 'left',
  buttonColor = '#fff',
  onClick,
}: {
  options?: { id?: number; option?: string; icon?: React.ReactNode }[];
  optionsWidth: number;
  optionsHeight: number;
  optionsBackgroundColor: string;
  optionsRadius: number;
  optionsRight?: number;
  optionsLeft?: number;
  optionsBottom?: number;
  optionsTop?: number;
  optionsZIndex?: number;
  identity: string;
  itemId: number;
  buttonColor?: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';  
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  // ----- global states -----

  // ----- local states -----

  // const { isOpen, ref, toggleOpen } = useUiHandler();
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: placement || 'left', // Puedes cambiar la posición aquí
  });

  // 2. Hooks de interacción para controlar cuándo se abre y se cierra el popover
  const click = useClick(context);
  const dismiss = useDismiss(context);

  // 3. Combina las interacciones en props que se pueden pasar a los elementos
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <div className="relative w-fit h-fit mx-auto">
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        // onClick={toggleOpen}
        className="w-fit h-fit flex justify-center items-center hover:scale-105"
      >
        <VerticalWhiteThreeDotsIcon color={buttonColor} />
      </button>
      <FloatingPortal preserveTabOrder>
        <AnimatePresence>
          {isOpen && (
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                // style={floatingStyles}
                {...getFloatingProps()}
                // className="z-[3]"
                style={{
                  ...floatingStyles,
                  zIndex: optionsZIndex ? optionsZIndex : 3,
                }}
              >
                <Options
                  identity={identity}
                  optionsBackgroundColor={optionsBackgroundColor}
                  optionsHeight={optionsHeight}
                  optionsRadius={optionsRadius}
                  optionsWidth={optionsWidth}
                  itemId={itemId}
                  options={options}
                  optionsBottom={optionsBottom}
                  optionsLeft={optionsLeft}
                  optionsRight={optionsRight}
                  optionsTop={optionsTop}
                  optionsZIndex={optionsZIndex}
                  onClick={(e) => {
                    onClick(e);
                    setIsOpen(false);
                  }}
                />
              </div>
            </FloatingFocusManager>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  );
}
