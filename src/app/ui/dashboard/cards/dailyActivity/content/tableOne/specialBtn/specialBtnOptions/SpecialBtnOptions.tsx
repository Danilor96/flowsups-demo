import { Can } from '&/auth/Can';
import { CancelRequestElement } from './cancelRequestElement/CancelRequestElement';
import { RescheduleRequestElement } from './rescheduleRequestElement/RescheduleRequestElement';

export function SpecialBtnOptions({
  appointmentId,
  changeReason,
  preventedStartDate,
  preventedEndDate,
}: {
  appointmentId: number;
  changeReason: string | null;
  preventedStartDate: Date | null;
  preventedEndDate: Date | null;
}) {
  // ----- global states -----

  // ----- local states -----

  return (
    <>
      {changeReason && (
        <Can requiredPermission={6}>
          <CancelRequestElement appointmentId={appointmentId} cancelReason={changeReason} />
        </Can>
      )}
      {preventedStartDate && (
        <Can requiredPermission={7}>
          <RescheduleRequestElement
            appointmentId={appointmentId}
            preventedStartDate={preventedStartDate}
            preventedEndDate={preventedEndDate}
          />
        </Can>
      )}
    </>
  );
}
