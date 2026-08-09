import { create } from 'zustand';
import { adminDashboardStore, modalWindowStore, singleUserDataStore } from './adminDashboard';
import { editVehicleStore, userActionStore } from './inventory';

interface NewTab {
  handlingNewTab: (newTabUrl: string) => Promise<void>;
}

const flowsupsWindowsLists = [
  'new',
  'contactattempt',
  'lost',
  'contacted',
  'creditapp',
  'appointment',
  'delivery',
  'showup',
  'noshowup',
  'deposit',
  'undelivered',
  'sold',
  'funding',
  'dailycalls',
  'dailymessages',
  'dailymadeappointments',
  'missingtasks',
  'dailymadecreditapp',
  'dailysells',
];

export const useNewTabStore = create<NewTab>((set, get) => ({
  handlingNewTab: async (newTabUrl) => {
    const {
      openSingleUser,
      setLoadingNewTab,
      openInventorySystem,
      openTaskDetail,
      openNewCustomersList,
      openContactAttemptCustomersList,
      openContactedCustomersList,
      openCreditAppCustomersList,
      openShowUpCustomersList,
      openLostCustomersList,
      openNoShowUpCustomersList,
      openSoldCustomersList,
      openDepositCustomersList,
      openDeliveryCustomersList,
      openUndeliveredCustomersList,
      openAppointmentCustomersList,
      openPaidCustomersList,
      openDailyAppointments,
      openDailyCalls,
      openMissingTasks,
      openDailyMessages,
      openDailyMadeCreditApp,
      openDailySells,
    } = modalWindowStore.getState();

    const { getSingleClientTasks } = adminDashboardStore.getState();

    const { getSingleUserData } = singleUserDataStore.getState();

    const { getVehicleData } = editVehicleStore.getState();

    const { setAddNewVehicle } = userActionStore.getState();

    const urlArray = newTabUrl.split('-');

    // the first part of the url is for gets the
    // modal window that will be opened

    const windowThatWillBeOpened = urlArray[0] ? urlArray[0] : '';

    // the second part of the url is for gets the
    // id related to a data

    const idSelected = urlArray[1] ? urlArray[1] : '';

    if (windowThatWillBeOpened === 'userDetail' && idSelected) {
      openSingleUser();

      setLoadingNewTab(false);

      await getSingleUserData(idSelected).catch(() => {
        window.close();
      });
    }

    if (windowThatWillBeOpened === 'inventory') {
      setAddNewVehicle(false);

      openInventorySystem();

      setLoadingNewTab(false);

      getVehicleData(idSelected);
    }

    if (windowThatWillBeOpened === 'task') {
      getSingleClientTasks(idSelected);

      openTaskDetail();

      setLoadingNewTab(false);
    }

    if (flowsupsWindowsLists.includes(windowThatWillBeOpened)) {
      const indexFromWindow = flowsupsWindowsLists.indexOf(windowThatWillBeOpened);
      const windowsOpenFunctions = [
        openNewCustomersList,
        openContactAttemptCustomersList,
        openLostCustomersList,
        openContactedCustomersList,
        openCreditAppCustomersList,
        openAppointmentCustomersList,
        openDeliveryCustomersList,
        openShowUpCustomersList,
        openNoShowUpCustomersList,
        openDepositCustomersList,
        openUndeliveredCustomersList,
        openSoldCustomersList,
        openPaidCustomersList,
        openDailyCalls,
        openDailyMessages,
        openDailyAppointments,
        openMissingTasks,
        openDailyMadeCreditApp,
        openDailySells,
      ];

      if (indexFromWindow !== -1) {
        const openThisWindow = windowsOpenFunctions[indexFromWindow];

        openThisWindow();
      }

      setLoadingNewTab(false);
    }
  },
}));
