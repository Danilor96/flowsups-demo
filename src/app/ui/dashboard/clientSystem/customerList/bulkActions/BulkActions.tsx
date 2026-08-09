import { BulkActionIcon } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { Options } from './options/Options';

export function BulkActions() {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div ref={ref} className="relative">
      <button
        className="bg-[#00A78B] py-2 px-4 rounded-[20px] font-normal text-sm text-white flex items-center justify-center gap-2 hover:scale-105 transition-all"
        onClick={toggleOpen}
      >
        <BulkActionIcon />
        Bulk Actions
      </button>
      {isOpen && <Options toggleOpen={toggleOpen} />}
    </div>
  );
}
