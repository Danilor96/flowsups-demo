import { ModalContainer } from '&/modalWindowsStructure/ModalContainer';
import { ModalContainerTitle } from '&/modalWindowsStructure/ModalContainerTitle';
import { ModalWindow } from '&/modalWindowsStructure/ModalWindow';
import { CustomerSettings } from '&/dashboard/settings/customer/customerSettings/CustomerSettings';
import { CustomBeBackReasons } from '&/dashboard/settings/customer/customBeBackReasons/CustomBeBackReasons';
import { ConversiontrackingCode } from '&/dashboard/settings/customer/conversionTrackingCode/ConversionTrackingCode';
import { messagesStore, modalWindowStore } from '@/store/adminDashboard';
import { RoundRobinSettings } from './roundRobinSettings/RoundRobinSettings';
import { ConsentTerms } from './consentTerms/ConsentTerms';
import { TabNavigation } from '&/miscellaneous/tabNavigation/TabNavigation';

export function Customer() {
  // ----- global status -----

  const { messages } = messagesStore();

  const { openCustomerSettingsFromConsentWindow } = modalWindowStore();
  const { openCloseCustomerSettings, closeSettings, openCloseCustomerSettingsFromConsentWindow } =
    modalWindowStore();

  // ----- local states -----

  return (
    <ModalWindow
      top={0}
      successMessage={messages.successMessage}
      failMessage={messages.serverError}
    >
      <ModalContainer width={82.552083} marginTop={5.833333} positionRelative>
        <ModalContainerTitle
          title="Customer Settings"
          closeWindowFunction={() => {
            if (openCustomerSettingsFromConsentWindow) {
              openCloseCustomerSettingsFromConsentWindow();

              closeSettings();
            }

            openCloseCustomerSettings();
          }}
        />
        {!openCustomerSettingsFromConsentWindow ? (
          <TabNavigation
            renderedElements={[
              <CustomerSettings key={1} />,
              <RoundRobinSettings key={2} />,
              <ConsentTerms key={3} />,
            ]}
            optionDescription={['Customer Settings', 'Round Robin', 'Consent Settings']}
            canByPosition={[[54], [55], [56]]}
          />
        ) : (
          <ConsentTerms />
        )}
        {/* {index === 3 && <CustomBeBackReasons />} */}
        {/* {index === 3 && <ConversiontrackingCode setMessages={setMessage} />} */}
      </ModalContainer>
    </ModalWindow>
  );
}
