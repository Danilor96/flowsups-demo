import { Button } from '&/buttons/Button';
import { ThreeDotsBtn } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { DailyActivityOptions } from './dailyActivityOptions/DailyActivityOptions';
import {
  useFloating,
  useClick,
  useDismiss,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react';
import { useState } from 'react';

export function StatusBtn({
  appointmentId,
  customerId,
  customerVisit,
  isOtionsButton = false,
}: {
  customerId: number;
  appointmentId: number;
  customerVisit: boolean;
  isOtionsButton?: boolean;
}) {
  // ----- global states -----

  // ----- local states -----

  // const { isOpen, ref, toggleOpen } = useUiHandler();

  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip(),
      shift(),
    ],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <div className="relative">
      <Button
        title={isOtionsButton ? `Options` : undefined}
        buttonText={isOtionsButton ? `Options` : undefined}
        borderColor={isOtionsButton ? '#00A78B' : ''}
        backgroundColor={isOtionsButton ? '#C9EBE6' : ''}
        textColor={isOtionsButton ? '#41B4A0' : '#FFF'}
        border={isOtionsButton ? 0.138889 : undefined}
        borderRadius={isOtionsButton ? 1.2 : undefined}
        ref={refs.setReference}
        otherProps={getReferenceProps()}
        identity="statusBtn"
        // onClick={toggleOpen}
        value={`${appointmentId}-${customerId}`}
        widthFitContent={!isOtionsButton}
        heightFitContent={!isOtionsButton}
        marginInlineAuto
        buttonIcon={!isOtionsButton ? <ThreeDotsBtn /> : undefined}
      />
      {/* {isOpen && (
        <DailyActivityOptions
          appointmentId={appointmentId}
          customerId={customerId}
          customerVisit={customerVisit}
        />
      )} */}
      <FloatingPortal preserveTabOrder>
        {isOpen && (
          // FloatingFocusManager mejora la accesibilidad al gestionar el foco
          <FloatingFocusManager context={context} modal={false}>
            <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()} className="z-[60]">
              {/* Contenido de tu menú de opciones */}
              <DailyActivityOptions
                appointmentId={appointmentId}
                customerId={customerId}
                customerVisit={customerVisit}
              />
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </div>
  );
}
