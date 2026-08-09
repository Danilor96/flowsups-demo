import { OneFireLead, ThreeFiresLead, TwoFiresLead } from '&/icons/Icons';

export function CustomerTemperatureIndicator({ temperatureId }: { temperatureId?: number }) {
  // ----- global states -----

  // ----- local states -----

  if (temperatureId === 1) {
    return <OneFireLead />;
  } else if (temperatureId === 2) {
    return <TwoFiresLead />;
  } else if (temperatureId === 3) {
    return <ThreeFiresLead />;
  } else {
    return '';
  }
}
