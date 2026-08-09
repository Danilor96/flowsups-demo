import { DailyActivityContent } from '&/dashboard/cards/dailyActivity/content/DailyActivityContent';
import { currentSectionStore } from '@/store/adminDashboard';
import { useEffect } from 'react';
import { Slide } from '&/slide/Slide';

export function DailyActivityCard() {
  // global states
  const { getCurrentSection } = currentSectionStore();

  useEffect(() => {
    getCurrentSection('Daily Activity slide');
  }, [getCurrentSection]);

  // local states

  return (
    <Slide title="Daily activity">
      <DailyActivityContent />
    </Slide>
  );
}
