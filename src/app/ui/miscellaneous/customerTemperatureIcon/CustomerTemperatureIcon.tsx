import { OneFire, ThreeFires, TwoFires } from '&/icons/Icons';

export function CustomerTemperatureIcon({ temperatureId }: { temperatureId?: number }) {
  //   ----- global states -----

  // ----- local states -----

  if (temperatureId) {
    let icon: React.ReactNode = '';

    switch (temperatureId) {
      case 1:
        icon = <OneFire />;
        break;

      case 2:
        icon = <TwoFires />;
        break;
      case 3:
        icon = <ThreeFires />;
        break;
    }

    return <aside className="w-fit h-fit mx-auto">{icon}</aside>;
  } else {
    return <p>No temperature stablished</p>;
  }
}
