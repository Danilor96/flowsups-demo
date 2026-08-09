import { Button } from '&/buttons/Button';
import { TransferCallIcon } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { singleCLientDataStore } from '@/store/adminDashboard';
import { useTwilioStore } from '@/store/phoneDevice';
import { CallTransferOptions } from '../callTransferOptions/CallTransferOptions';

export function TransferButton() {
  // ----- global states -----

  const { call, creatingCall } = useTwilioStore();

  const { singleCLientData } = singleCLientDataStore();

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  const isAnUserAssigned = () => {
    if (singleCLientData) {
      const salesRep = singleCLientData.seller;
      const bdc = singleCLientData.bdc;

      return salesRep !== null || bdc !== null;
    } else {
      return false;
    }
  };

  return (
    <div ref={ref} className="relative flex flex-row w-fit h-fit">
      <Button
        backgroundColor={call ? (isAnUserAssigned() ? '' : '#C9EBE6') : '#C9EBE6'}
        identity={'transfer'}
        textColor={''}
        onClick={toggleOpen}
        width={5.208332}
        height={5.208332}
        buttonIcon={<TransferCallIcon />}
        border={0.104166}
        borderColor={
          call ? (creatingCall ? '#C9EBE6' : isAnUserAssigned() ? '#00A78B' : '#C9EBE6') : '#C9EBE6'
        }
        heightVw
        borderRadius={100}
        disabled={call ? (creatingCall ? true : !isAnUserAssigned()) : true}
      />
      {isOpen && <CallTransferOptions toggleOpen={toggleOpen} />}
    </div>
  );
}
