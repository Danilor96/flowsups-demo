import { Table } from './table/Table';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export function CallDetailSubTable({
  userId,
  statistics,
  inbound,
  userName,
}: {
  userId: number;
  statistics: number | string;
  inbound: boolean;
  userName: string;
}) {
  // ----- global states -----

  // ----- local states -----

  const [open, setOpen] = useState(false);

  const openCloseWindow = () => {
    setOpen(!open);
  };

  return (
    <div>
      <button type="button" onClick={openCloseWindow}>
        <p>{statistics}</p>
      </button>
      {open && (
        <AnimatePresence>
          <Table
            onCloseWindow={openCloseWindow}
            userId={userId}
            inbound={inbound}
            userName={userName}
          />
        </AnimatePresence>
      )}
    </div>
  );
}
