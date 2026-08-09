'use client';

import { useState } from 'react';

export function SessionExpiration({ reason }: { reason?: string }) {
  const [showMssg, setShowMssg] = useState(true);

  if (!reason || !showMssg) {
    return null;
  }

  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 flex justify-center items-center bg-black/70">
      <aside className="flex flex-col justify-center gap-3 p-2 bg-white rounded-md">
        <section>
          <p className="text-slate-700 font-medium">Your session has expired due to inactivity</p>
        </section>
        <button
          type="button"
          onClick={() => setShowMssg(false)}
          className="w-fit p-1 mx-auto text-base text-slate-700 border-2 border-primaryColor rounded-md hover:bg-primaryColor hover:text-white transition-colors"
        >
          Accept
        </button>
      </aside>
    </div>
  );
}
