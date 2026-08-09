import { Button } from '&/buttons/Button';
import { ThreeDots } from '&/icons/Icons';
import useUiHandler from '@/hooks/closeComponentsHandler';
import { Options } from './options/Options';

export function OptionButton({ userId, userName }: { userId: number; userName: string }) {
  // ----- global states -----

  // ----- local states -----

  const { isOpen, ref, toggleOpen } = useUiHandler();

  return (
    <div className="relative w-fit mx-auto" ref={ref}>
      <Button
        width={2.03125}
        height={2.03125}
        heightVw
        backgroundColor="#FFFFFF40"
        identity="option"
        textColor=""
        dropShadow
        buttonIcon={<ThreeDots />}
        onClick={toggleOpen}
      />
      {isOpen && <Options onClick={toggleOpen} userId={userId} userName={userName} />}
    </div>
  );
}
