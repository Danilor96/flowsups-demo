import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Table } from './table/Table';

export function SmsDetailSubTable({
  statistics,
  userId,
  userName,
  auto,
}: {
  userId: number;
  statistics: number | string;
  userName: string;
  auto?: boolean;
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
          <Table onCloseWindow={openCloseWindow} userId={userId} userName={userName} auto={auto} />
        </AnimatePresence>
      )}
    </div>
  );
}
