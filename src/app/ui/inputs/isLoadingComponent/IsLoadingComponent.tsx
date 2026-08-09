import { LoadingIcon } from '../../icons/Icons';

export function IsLoadingComponent() {
  // global states

  // local states

  return (
    <aside className="absolute left-[100%] top-[50%] animate-spin">
      <LoadingIcon />
    </aside>
  );
}
