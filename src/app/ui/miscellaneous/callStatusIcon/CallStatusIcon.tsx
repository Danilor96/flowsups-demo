import { CallAcceptedByReceptorIcon, CallNotMadeIcon } from '&/icons/Icons';

export function CallStatusIcon({
  callStatus,
  callDuration,
}: {
  callStatus: number;
  callDuration: string;
}) {
  // ----- global states -----

  // ----- local states -----

  if (callStatus === 1 && callDuration !== '0') {
    return <CallAcceptedByReceptorIcon />;
  } else if (callStatus === 3) {
    return <CallNotMadeIcon />;
  } else {
    return <CallNotMadeIcon />;
  }
}
