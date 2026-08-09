import { useState, useEffect, useRef } from 'react';

function useUiHandler(ignoreClass?: string) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    function handlerClickOutside(event: any) {
      if (ignoreClass && (event.target as HTMLElement).closest(`.${ignoreClass}`)) {
        return;
      }

      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlerClickOutside);

    return () => {
      document.removeEventListener('mousedown', handlerClickOutside);
    };
  }, [ignoreClass]);

  const toggleOpen = () => setIsOpen(!isOpen);

  return { isOpen, toggleOpen, ref, setIsOpen };
}

export default useUiHandler;
