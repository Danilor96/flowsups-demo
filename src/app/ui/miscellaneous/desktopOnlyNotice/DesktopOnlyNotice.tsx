'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'flowsups_desktop_notice_dismissed';

export function DesktopOnlyNotice() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === 'true');
    } catch (e) {}
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}
  };

  if (dismissed) return null;

  return (
    <aside className="lg:hidden fixed top-0 left-0 right-0 z-[9999] flex flex-row items-center justify-center gap-2 px-4 py-2 bg-[#009075] text-white text-sm text-center shadow-md">
      <p>
        This project is designed for large screens (≥1024px). Some layouts may not display
        correctly on this device.
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss notice"
        className="shrink-0 ml-2 w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-white font-semibold leading-none hover:bg-white/40"
      >
        &times;
      </button>
    </aside>
  );
}