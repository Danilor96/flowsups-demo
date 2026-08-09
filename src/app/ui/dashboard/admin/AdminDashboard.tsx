'use client';

import { DashboardOptions } from '@/app/ui/dashboard/dashboardOptions/DashboardOptions';
import { DailyActivityCard } from '@/app/ui/dashboard/cards/dailyActivity/DailyActivityCard';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { TasksCard } from '@/app/ui/dashboard/cards/tasks/TasksCard';
import { AnimatePresence, motion } from 'framer-motion';
import { AddNewReport } from '&/dashboard/addNewReport/AddNewReport';
import { AppointmentSystem } from '&/dashboard/appointmentSystem/AppointmentSystem';
import { AppointmentDetailForm } from '&/dashboard/appointmentSystem/appointmentCalendar/pointmentDetail/AppointmentDetail';
import { InventorySystem } from '&/dashboard/inventorySystem/InventorySystem';
import { ClientSystem } from '&/dashboard/clientSystem/ClientSystem';
import { CustomerDetail } from '&/dashboard/clientSystem/clientDetail/CustomerDetail';
import {
  adminDashboardStore,
  clientMessagesStore,
  creditAppPaginationStore,
  modalWindowStore,
  singleCLientDataStore,
  singleUserDataStore,
  userStore,
} from '@/store/adminDashboard';
import { FlowsUp } from '&/dashboard/cards/flowsups/FlowsUpCard';
import { CustomerList } from '&/dashboard/clientSystem/customerList/CustomerList';
import { DailyAppointment } from '&/dashboard/DailyAppointments';
import { DailyCalls } from '&/dashboard/DailyCalls';
import { MissingTasks } from '&/dashboard/MissingTasks';
import { SmsCard } from '&/dashboard/cards/smsCard/SmsCard';
import { DailyMessages } from '&/dashboard/dailyDataBar/dailyMessages/DailyMessages';
import { DailyMadeCreditApp } from '&/dashboard/DailyMadeCreditApp';
import { WorkInProgress } from '&/workInProgressMessage/WorkInProgress';
import { NextBtnIcon, PrevBtnIcon } from '&/icons/Icons';
import { NewCustomers } from '&/dashboard/clientSystem/customerLists/NewCustomers';
import { ContactAttemptCustomers } from '&/dashboard/clientSystem/customerLists/ContactAttemptCustomers';
import { ContactedCustomers } from '&/dashboard/clientSystem/customerLists/ContactedCustomers';
import { CreditAppCustomers } from '&/dashboard/clientSystem/customerLists/CreditAppCustomers';
import { ShowUpCustomers } from '&/dashboard/clientSystem/customerLists/ShowUpCustomers';
import { LostCustomers } from '&/dashboard/clientSystem/customerLists/LostCustomers';
import { NoShowUpCustomers } from '&/dashboard/clientSystem/customerLists/NoShowUpCustomers';
import { SoldCustomers } from '&/dashboard/clientSystem/customerLists/SoldCustomers';
import { DepositCustomers } from '&/dashboard/clientSystem/customerLists/DepositCustomers';
import { DeliveryCustomers } from '@/app/ui/dashboard/clientSystem/customerLists/deliveryCustomers/DeliveryCustomers';
import { UndeliveredCustomers } from '&/dashboard/clientSystem/customerLists/UndeliveredCustomers';
import { PaidCustomers } from '@/app/ui/dashboard/clientSystem/customerLists/fundedCustomers/PaidCustomers';
import { Settings } from '&/dashboard/settings/Settings';
import { AddManagerTask } from '&/dashboard/managerTask/AddManagerTask';
import { Reports } from '&/dashboard/reports/Reports';
import { Inventory } from '&/dashboard/cards/inventory/Inventory';
import { Import } from '&/miscellaneous/importExportData/import/Import';
import { Export } from '&/miscellaneous/importExportData/export/Export';
import { TaskDetail } from '@/app/ui/dashboard/cards/tasks/taskDetail/TaskDetail';
import { DailySells } from '&/dashboard/dailyDataBar/dailySells/DailySells';
import { useSocketStore } from '@/store/socketIo';
import { NotesWindow } from '&/miscellaneous/notesWindow/NotesWindow';
import PdfContainer from '&/miscellaneous/pdf/pdfContainer/PdfContainer';
import { SmsModal } from '&/dashboard/clientSystem/clientDetail/smsModal/SmsModal';
import { useTwilioStore } from '@/store/phoneDevice';
import { IncomingCallComponent } from '&/dashboard/incomingCallComponent/IncomingCallComponent';
import { timeSpansStore } from '@/store/dateFormats';
import { emailTemplateStore } from '@/store/emailTemplate';
import { UserDetail } from '../settings/usersList/userDetail/UserDetail';
import { useConsentTermsStore } from '@/store/consentTerms';
import { useLocalStorage } from '@/hooks/localStorage';
import { useNewTabStore } from '@/store/newTabHandling';
import { Loader } from '../../miscellaneous/loader/Loader';
import { leadsStore } from '@/store/leads';
import { creditAppStore } from '@/store/creditApp';
import { revalidateUser } from '@/app/libs/actions';
import { vehiclesDataStore } from '@/store/inventory';
import { CustomersStatuses } from '@/app/libs/customer/customersFunctions';
import { taskFilterStore } from '@/store/tasksHandling';
import { getData } from '../clientSystem/clientDetail/options/creditApp/creditApp.services';

const variants = {
  initial: (direction: any) => {
    return { x: direction > 0 ? 200 : -200, opacity: 0 };
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: any) => {
    return { x: direction > 0 ? -200 : 200, opacity: 0 };
  },
};

export enum DashboardPagesIndex {
  DailyActivity = 0,
  Tasks = 1,
  Inventory = 2,
  Flowsups = 3,
  SmsAndEmails = 4,
}

export function AdminDashboard({ newTabUrl }: { newTabUrl?: string }) {
  const { data: session, update } = useSession();

  const { setCurrentUser } = userStore();

  const userEmail = session?.user.email;

  const userId = session?.user.id;

  const roleId = session?.user.user_has[0].role_id;

  // const { getPermissions } = permissionsStore();

  useEffect(() => {
    if (session) {
      setCurrentUser(session.user);
    } else {
      update({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, setCurrentUser, update]);

  // ---- global states ----

  const { todaySpan } = timeSpansStore();

  const {
    callIncoming,
    call,
    callTimingInterval,
    callInProgress,
    showDashboardCallHandler,
    creatingCall,
    incomingCallsArray,
    transferedConferencesNames,
    outgoingCall,
  } = useTwilioStore();

  const {
    initializeDevice,
    createCallStatusInDatabase,
    setCallInProgress,
    setCreatingCall,
    setCurrentCall,
    startCallTimingCount,
    setCallSid,
    setTrasnferInProgressOrCompleted,
    setCallArray,
    setShowDashboardCallHandler,
    startCallAutoAcceptTimeout,
    resetCallTiming,
    setCallIncoming,
    setIncomingCallsArray,
    clearAnIncomingCallInTheArray,
    deleteTheUserThatResponseTheCallLate,
    disconnectCurrentTransferedCall,
    setTransferedConferencesNames,
    clearTransferedConferencesNames,
    setOutgoingCall,
    setActiveCall,
  } = useTwilioStore();

  const {
    addNewReport,
    inventorySystem,
    clientSystem,
    clientDetail,
    customerList,
    dailyAppointments,
    dailyCalls,
    missingTasks,
    dailyMessages,
    dailyMadeCreditApp,
    workInprogress,
    newCustomersList,
    contactAttemptCustomersList,
    contactedCustomersList,
    creditAppCustomersList,
    showUpCustomersList,
    lostCustomersList,
    noShowUpCustomersList,
    soldCustomersList,
    depositCustomersList,
    deliveryCustomersList,
    undeliveredCustomersList,
    appointmentCustomersList,
    paidCustomersList,
    settings,
    addManagerTask,
    reports,
    importData,
    exportData,
    taskDetail,
    dashboardSmsModal,
    dailySells,
    printingData,
    noteWindow,
    smsModal,
    showCallModal,
    manageNotifications,
    manageUsers,
    setUpADeal,
    customerSettings,
    consentModal,
    loadingNewTab,
    clientCreditApp,
    businessInfo,
    callendarAppointmentDetail,
  } = modalWindowStore();

  const singleUser = modalWindowStore((state) => state.singleUser);

  const { incomingCallIdentity, singleClientTasks, dailyMadeAppointments } = adminDashboardStore();

  const {
    getTotalNotifications,
    getNotifications,
    getClients,
    getAppointments,
    getDailyActivityAppointments,
    getDailyMadeAppointments,
    getTodayTotals,
    getDailysCalls,
    getTasks,
    getSmsTemplates,
    getLeadSources,
    getUsers,
    getBdc,
    getDeal,
    getUserImage,
    getNotificationsPreference,
    getTaskSettings,
    getRoles,
    getSingleClientTasks,
    getCreditAppAddress,
    getCustomerEmployment,
    clearLostCustomersFromSpecificClients,
    getBusiness,
    getBusinessWebsites,
    getBusinessVehicleUrl,
    getBusinessPrimaryUrl,
    getAutomaticEmails,
    getAutomaticSms,
    getCustomerSettings,
    getSpecificClients,
    getSpecificClientsTwo,
    getSpecificClientsThree,
    setCurrentDashboardIndex,
  } = adminDashboardStore();

  const { getCreditAppNavigation } = creditAppPaginationStore();

  const { getCreditAppStart } = creditAppStore();

  const { getLeads } = leadsStore();

  const { getSingleUserData } = singleUserDataStore();

  const { getEmailTemplates } = emailTemplateStore();

  const { getVehiclesData } = vehiclesDataStore();

  const { taskStatusFilter } = taskFilterStore();

  const {
    closeIconedSelectOptions,
    closeUserInfoOptions,
    closeUserNotifications,
    closeSmsAndEmailFilter,
    closeSmsAndEmailDateFilter,
    setShowCallModal,
    setShowConsentModal,
    toggleOpenInNewTab,
    setCloseNewTab,
    setLoadingCustomerDetail,
    appointmentIdToDetail,
  } = modalWindowStore();

  const { singleCLientData } = singleCLientDataStore();

  const { getSingleClientData } = singleCLientDataStore();

  const {
    getClientMessages,
    getClientMessagesByPhoneNumber,
    getDailyMessages,
    getAllClientsMessages,
    setMessagesStatusToRead,
  } = clientMessagesStore();

  const { clientMessages } = clientMessagesStore();

  const { socket, initializeSocket, setEmiterUser } = useSocketStore();

  const { getStatement, getChecks } = useConsentTermsStore();

  useEffect(() => {
    if (userEmail) {
      initializeSocket(userEmail);

      setEmiterUser(userEmail);
    }
  }, [initializeSocket, setEmiterUser, userEmail]);

  const [currentIndex, setCurrentIndex] = useState(3);
  const [incomingCallRingingAudio, setIncomingCallRingingAudio] = useState<HTMLAudioElement | null>(
    null,
  );

  useEffect(() => {
    const handleUpdate = async (dataToUpdate: string, extraData: any, emiterUser: string) => {
      switch (dataToUpdate) {
        case 'customersLists':
          if (emiterUser === userEmail) return;

          if (extraData && extraData?.specificCustomers) {
            const statusIdArray = extraData?.specificCustomers;

            if (statusIdArray.includes(CustomersStatuses.Delivery) && deliveryCustomersList) {
              getSpecificClients(CustomersStatuses.Delivery);
            }

            if (statusIdArray.includes(CustomersStatuses.Undelivery) && undeliveredCustomersList) {
              getSpecificClients(CustomersStatuses.Undelivery);
            }

            if (statusIdArray.includes(CustomersStatuses.Sold) && soldCustomersList) {
              getSpecificClients(CustomersStatuses.Sold);
            }

            if (statusIdArray.includes(CustomersStatuses.Funded) && paidCustomersList) {
              getSpecificClients(CustomersStatuses.Sold);
              getSpecificClientsTwo(CustomersStatuses.Sold);
              getSpecificClientsThree(CustomersStatuses.Sold);
            }
          }

          break;

        case 'roundRobin':
          if (customerSettings) {
            getCustomerSettings();
          }

          break;

        case 'business':
          if (businessInfo) {
            getBusiness();
          }

          break;

        case 'businessWebsite':
          if (businessInfo) {
            getBusinessWebsites();
          }

          break;

        case 'businessVehicleDetailPageUrl':
          if (businessInfo) {
            getBusinessVehicleUrl();
          }

          break;

        case 'businessPrimaryUrl':
          if (businessInfo) {
            getBusinessPrimaryUrl();
          }

          break;

        case 'automaticEmails':
          if (manageNotifications) {
            getAutomaticEmails();
          }

          break;

        case 'automaticSms':
          if (manageNotifications) {
            getAutomaticSms();
          }

          break;

        case 'usersList':
          if (manageUsers) {
            getUsers();
          }
          break;

        case 'inventory':
          if (currentIndex === 2) {
            getVehiclesData();
          }

          break;

        case 'creditApp':
          if (emiterUser === userEmail) return;

          if (clientCreditApp && singleCLientData && singleCLientData.id) {
            if (extraData) {
              if (extraData?.customerId) {
                if (extraData.customerId === singleCLientData.id) {
                  if (extraData?.start || extraData?.address || extraData?.employmentStatus) {
                    await getData(singleCLientData.id);

                    getCreditAppNavigation(singleCLientData.id);
                  }
                }
              }
            }
          }

          break;

        case 'tasks':
          if (currentIndex === 1 && userId) {
            getTasks(userId, taskStatusFilter);
          }

          break;

        case 'taskDetail':
          if (
            taskDetail &&
            extraData?.taskId &&
            singleClientTasks &&
            singleClientTasks.id == extraData.taskId &&
            !extraData.dontUpdateThis
          ) {
            getSingleClientTasks(extraData?.taskId);
          }
          break;

        case 'dailyAppointmentsList':
          if (emiterUser === userEmail) return;

          currentIndex === 0 && getDailyActivityAppointments();

          if (userId && dailyMadeAppointments) {
            getDailyMadeAppointments(userId);
          }

          break;

        case 'notifications':
          if (userId && roleId) {
            getTotalNotifications(userId, roleId);
            // getNotifications({ userId: userId.toString(), roleId: roleId.toString() });
          }

          break;

        case 'notificationsPreferences':
          getNotificationsPreference();
          break;

        case 'setUpADeal':
          if (setUpADeal && extraData?.customerId) {
            if (singleCLientData && singleCLientData.id === extraData.customerId) {
              getDeal(extraData.customerId);
            }
          }
          break;

        case 'customersList':
          getClients();

          break;

        case 'lostCustomers':
          if (
            extraData?.modifiedCustomersId &&
            typeof extraData?.modifiedCustomersId === 'object'
          ) {
            const modifiedCustomers: number[] = extraData.modifiedCustomersId;

            clearLostCustomersFromSpecificClients(modifiedCustomers);
          }

          break;

        case 'usersAndSingleUser':
          getBdc();
          if (manageUsers) {
            getUsers();

            if (extraData?.singleUserId) {
              getSingleUserData(extraData?.singleUserId);
              // getUserImage(extraData?.singleUserId);
            }
          }

          break;

        case 'updateRole':
          await update({});

          await revalidateUser();

          getRoles();

          break;

        case 'singleClient':
          if (singleCLientData && singleCLientData.id && extraData?.customerId) {
            if (singleCLientData.id === extraData.customerId) {
              setLoadingCustomerDetail(true);

              await Promise.all([
                getSingleClientData(singleCLientData.id.toString()),
                getLeads(singleCLientData.id),
              ]);

              if (consentModal) {
                setShowConsentModal(false);
              }

              setLoadingCustomerDetail(false);
            }
          }

          if (extraData?.data) {
            getLeadSources();
          }

          break;

        case 'smsTemplate':
          getSmsTemplates();
          break;

        case 'emailTemplate':
          getEmailTemplates();
          break;

        case 'leadSources':
          getLeadSources();
          break;

        case 'taskSettings':
          if (customerSettings) {
            getTaskSettings();
          }
          break;

        case 'smsModal':
          if ((smsModal || dashboardSmsModal) && userId) {
            if (singleCLientData && singleCLientData.mobile_phone) {
              await getClientMessages(singleCLientData.id);
              await setMessagesStatusToRead(singleCLientData.id, userId);
              await getAllClientsMessages();
              getDailyMessages(userId);
            }

            if (
              clientMessages &&
              clientMessages.length > 0 &&
              clientMessages[0]?.unregistered_customer[0]?.mobile_phone_number &&
              !singleCLientData
            ) {
              await getClientMessagesByPhoneNumber(
                clientMessages[0].unregistered_customer[0].mobile_phone_number,
              );
              await setMessagesStatusToRead(
                clientMessages[0]?.unregistered_customer[0]?.id,
                userId,
              );
              await getAllClientsMessages();
              getDailyMessages(userId);
            }
          } else if (currentIndex === 4 && userId) {
            await getAllClientsMessages();
          }
          break;

        case 'customerMessage':
          if (smsModal && singleCLientData && singleCLientData?.mobile_phone) {
            getClientMessages(singleCLientData?.id);
          }

          if (dailyMessages) {
            userId && getDailyMessages(userId);
          }

          if (currentIndex === 4) {
            getAllClientsMessages();
          }

          if (userId && roleId) {
            getNotifications({ userId: userId.toString(), roleId: roleId.toString() });
            getTotalNotifications(userId, roleId);
          }

          // if the message confirms an appointment, then check other conditions
          if (extraData?.appointment && extraData?.appointment === '1') {
            // if the user has the customers appointment list open, then update the appointments
            if (appointmentCustomersList) {
              getAppointments();
            }

            //if the current slide is the "Daily Activity", then check others conditions
            if (currentIndex === 0) {
              // if the date from the accepted appointment is for today, then update daily activity appointments list
              if (
                extraData?.appointmentAcceptStartDate &&
                todaySpan(new Date(extraData.appointmentAcceptStartDate))
              ) {
                getDailyActivityAppointments();
              }
            }
          }

          break;

        case 'appointments':
          appointmentCustomersList && getAppointments();

          break;

        case 'consentTerms':
          customerSettings && getStatement();

          break;

        case 'consentChecks':
          customerSettings && getChecks();

          break;

        case 'dailyTotals':
          userId && getTodayTotals(userId);

          break;

        // calls system

        case 'joinConference':
          setIncomingCallsArray(
            extraData?.conferenceName,
            extraData?.conferenceSid,
            extraData?.phoneNumber,
          );

          break;

        case 'lastParticipant':
          if (extraData?.userEmail !== userEmail) {
            if (call) {
              if (extraData?.callSidArray?.includes(call?.parameters.CallSid)) {
                deleteTheUserThatResponseTheCallLate(extraData?.conferenceSid, userEmail);
                call.disconnect();
                if (incomingCallRingingAudio) {
                  incomingCallRingingAudio.currentTime = 0;
                }
                setCurrentCall(null);
                setCreatingCall(false);
                setCallInProgress(false);
                callTimingInterval && clearInterval(callTimingInterval);
                setTrasnferInProgressOrCompleted(false);
                if (incomingCallsArray.length === 0) {
                  if (incomingCallRingingAudio) {
                    incomingCallRingingAudio.pause();
                  }
                  setCallIncoming(false);
                  setShowDashboardCallHandler(false);
                }
              }
            }

            if (extraData?.inProgressConferenceName) {
              clearAnIncomingCallInTheArray(extraData.inProgressConferenceName);
            }
          }

          break;

        case 'callInProgress':
          // setCallInProgress(true);
          if (outgoingCall) {
            const outgoingCallSid = [extraData?.callSid, extraData?.parentCallSid];

            if (
              call &&
              call.parameters.CallSid &&
              outgoingCallSid.includes(call.parameters.CallSid)
            ) {
              startCallTimingCount();
              setCreatingCall(false);

              if (extraData) {
                if (callIncoming) {
                  setCallSid(extraData?.parentCallSid);
                } else {
                  setCallSid(extraData?.callSid);
                }
              }
            }
          }

          break;

        case 'callDisconnect':
          if (callIncoming && !outgoingCall) {
            if (extraData?.endedConferenceName) {
              if (
                incomingCallsArray.find((callInfo) => callInfo.isActive)?.conferenceName ===
                extraData.endedConferenceName
              ) {
                if (incomingCallRingingAudio) {
                  incomingCallRingingAudio.currentTime = 0;
                  incomingCallRingingAudio.pause();
                }
                setCurrentCall(null);
                setCreatingCall(false);
                setCallInProgress(false);
                setCallIncoming(false);
                setTrasnferInProgressOrCompleted(false);
                setShowDashboardCallHandler(false);
                callTimingInterval && clearInterval(callTimingInterval);
                resetCallTiming();
                userId && getTodayTotals(userId);
                dailyCalls && userId && getDailysCalls(userId);
              }

              clearAnIncomingCallInTheArray(extraData.endedConferenceName);
            }
          } else if (!outgoingCall) {
            setCurrentCall(null);
            callTimingInterval && clearInterval(callTimingInterval);
            setCallInProgress(false);
            setTrasnferInProgressOrCompleted(false);
            !clientDetail && getSingleClientData('clear');
            userId && getTodayTotals(userId);
            dailyCalls && userId && getDailysCalls(userId);
          }

          const outgoingCallSid = [];

          if (extraData?.callSid) outgoingCallSid.push(extraData?.callSid);

          if (extraData?.parentCallSid) outgoingCallSid.push(extraData?.parentCallSid);

          if (
            call &&
            outgoingCall &&
            outgoingCallSid.length > 0 &&
            !outgoingCallSid.includes(call.parameters.CallSid)
          ) {
            return;
          }

          if (outgoingCall && incomingCallsArray.length < 1) {
            setCurrentCall(null);
            setOutgoingCall(false);
            setCreatingCall(false);
            setCallInProgress(false);
            setCallIncoming(false);
            setTrasnferInProgressOrCompleted(false);
            setShowDashboardCallHandler(false);
            callTimingInterval && clearInterval(callTimingInterval);
            resetCallTiming();
            userId && getTodayTotals(userId);
            dailyCalls && userId && getDailysCalls(userId);
          }

          if (outgoingCall && incomingCallsArray.length > 0) {
            setCurrentCall(null);
            setOutgoingCall(false);
            setCallInProgress(false);
            callTimingInterval && clearInterval(callTimingInterval);
            resetCallTiming();
            setActiveCall(incomingCallsArray[0].conferenceSid);
          } else if (
            outgoingCall &&
            incomingCallsArray.length > 0 &&
            extraData?.endedConferenceName
          ) {
            clearAnIncomingCallInTheArray(extraData.endedConferenceName);
          }

          if (extraData?.endedConferenceName) {
            clearTransferedConferencesNames(extraData.endedConferenceName);
          }

          break;

        case 'trasnferInProgress':
          if (extraData?.conferenceName) {
            const call = incomingCallsArray.find(
              (callInfo) => callInfo.conferenceName === extraData.conferenceName,
            );
            if (call) {
              let incomingCallsArrayCopy = structuredClone(incomingCallsArray);
              const nextActiveCallIndex = incomingCallsArrayCopy.findIndex(
                (call) => !call.isActive,
              );
              if (nextActiveCallIndex !== -1 && call.isActive) {
                incomingCallsArrayCopy[nextActiveCallIndex].isActive = true;
              }

              const callIndex = incomingCallsArrayCopy.findIndex(
                (call) => call.conferenceName === extraData.conferenceName,
              );
              if (callIndex !== -1) {
                incomingCallsArrayCopy[callIndex].isActive = false;
                incomingCallsArrayCopy[callIndex].transferInProgress = true;
                const deletedCalls = incomingCallsArrayCopy.splice(callIndex, 1);
                if (deletedCalls.length > 0) {
                  incomingCallsArrayCopy.push(deletedCalls[0]);
                }
              }

              setCallArray(incomingCallsArrayCopy);
              // setTrasnferInProgressOrCompleted(true);
            }
          }

          break;

        case 'transferCompleted':
          if (extraData?.conferenceName) {
            clearAnIncomingCallInTheArray(extraData.conferenceName);
            // setTransferedConferencesNames(extraData.conferenceName);
          }

          break;
      }
    };

    socket?.on('update_data', handleUpdate);

    return () => {
      socket?.off('update_data');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getSpecificClients,
    getAutomaticSms,
    getAutomaticEmails,
    getSmsTemplates,
    getAppointments,
    getClientMessages,
    getClientMessagesByPhoneNumber,
    getClients,
    setShowCallModal,
    getDailyActivityAppointments,
    getNotifications,
    getTotalNotifications,
    getTodayTotals,
    update,
    setTrasnferInProgressOrCompleted,
    setCallInProgress,
    setCreatingCall,
    startCallTimingCount,
    setCallSid,
    setCurrentCall,
    setCallIncoming,
    setShowDashboardCallHandler,
    resetCallTiming,
    startCallAutoAcceptTimeout,
    setIncomingCallsArray,
    clearAnIncomingCallInTheArray,
    getDailysCalls,
    deleteTheUserThatResponseTheCallLate,
    getDailyMessages,
    getSingleClientData,
    getAllClientsMessages,
    todaySpan,
    getTasks,
    clearLostCustomersFromSpecificClients,
    setMessagesStatusToRead,
    setTransferedConferencesNames,
    clearTransferedConferencesNames,
    setOutgoingCall,
    setActiveCall,
    getLeadSources,
    getEmailTemplates,
    getDeal,
    getSingleUserData,
    getUserImage,
    getUsers,
    getNotificationsPreference,
    getStatement,
    getChecks,
    setShowConsentModal,
    getTaskSettings,
    getRoles,
    getVehiclesData,
    getLeads,
    setLoadingCustomerDetail,
    getSingleClientTasks,
    getCreditAppStart,
    getCreditAppAddress,
    getCustomerEmployment,
    getCreditAppNavigation,
    getBusiness,
    getBusinessWebsites,
    getBusinessVehicleUrl,
    getBusinessPrimaryUrl,
    getCustomerSettings,
    paidCustomersList,
    soldCustomersList,
    undeliveredCustomersList,
    deliveryCustomersList,
    businessInfo,
    clientCreditApp,
    singleClientTasks,
    taskDetail,
    consentModal,
    customerSettings,
    manageUsers,
    setUpADeal,
    outgoingCall,
    session,
    clientDetail,
    socket,
    appointmentCustomersList,
    currentIndex,
    roleId,
    singleCLientData,
    userId,
    smsModal,
    callTimingInterval,
    callIncoming,
    userEmail,
    incomingCallRingingAudio,
    call,
    callInProgress,
    incomingCallsArray,
    dailyCalls,
    dailyMessages,
    dashboardSmsModal,
    clientMessages,
    manageNotifications,
  ]);

  // useEffect(() => {
  //   if (call && transferedConferencesNames && !outgoingCall) {
  //     const calledConferenceName = call.customParameters.get('To');
  //     if (calledConferenceName) {
  //       if (transferedConferencesNames.includes(calledConferenceName)) {
  //         disconnectCurrentTransferedCall();
  //       }
  //     }
  //   }
  // }, [call, transferedConferencesNames, outgoingCall, disconnectCurrentTransferedCall]);

  useEffect(() => {
    if (incomingCallsArray.length > 0 && outgoingCall) {
      setShowCallModal(false);
      setShowDashboardCallHandler(true);
    }
  }, [incomingCallsArray, outgoingCall, setShowCallModal, setShowDashboardCallHandler]);

  useEffect(() => {
    if (userEmail) {
      initializeDevice(userEmail);
      setIncomingCallRingingAudio(new Audio('/incomingCallRingingSound.mp3'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  useEffect(() => {
    if (incomingCallsArray.length > 0 && !call && !callInProgress && !outgoingCall) {
      if (incomingCallRingingAudio && document.hasFocus()) {
        incomingCallRingingAudio.play();
      }

      setCallIncoming(true);
      setShowDashboardCallHandler(true);
    } else if (incomingCallsArray.length === 0 && !call && !callInProgress) {
      if (incomingCallRingingAudio) {
        incomingCallRingingAudio.pause();
      }
      setCallIncoming(false);
      setShowDashboardCallHandler(false);
    }
  }, [
    outgoingCall,
    incomingCallsArray,
    incomingCallRingingAudio,
    call,
    callInProgress,
    setShowDashboardCallHandler,
    setCallIncoming,
  ]);

  useEffect(() => {
    if (incomingCallsArray.length < 1) {
      if (incomingCallRingingAudio) {
        incomingCallRingingAudio.pause();
      }
    }
  }, [incomingCallsArray, incomingCallRingingAudio]);

  useEffect(() => {
    if (call) {
      call.on('accept', () => {
        if (incomingCallRingingAudio) {
          incomingCallRingingAudio.pause();
        }

        if (callIncoming) {
          startCallTimingCount();
          setCallInProgress(true);
          setCreatingCall(false);
        } else if (!callIncoming && singleCLientData && singleCLientData.id) {
          createCallStatusInDatabase(
            singleCLientData.id,
            userId,
            call.parameters.CallSid,
            callIncoming ? 1 : 2,
          );
        }

        setCreatingCall(true);
      });

      call.on('disconnect', () => {
        if (callIncoming && !outgoingCall) {
          if (incomingCallRingingAudio) {
            incomingCallRingingAudio.currentTime = 0;
            incomingCallRingingAudio.pause();
          }
          setCurrentCall(null);
          setCreatingCall(false);
          setCallInProgress(false);
          setCallIncoming(false);
          setTrasnferInProgressOrCompleted(false);
          setShowDashboardCallHandler(false);
          callTimingInterval && clearInterval(callTimingInterval);
          resetCallTiming();
          userId && getTodayTotals(userId);
          dailyCalls && userId && getDailysCalls(userId);
        }
      });
    }
  }, [
    call,
    singleCLientData,
    incomingCallIdentity,
    userId,
    userEmail,
    callIncoming,
    callTimingInterval,
    socket,
    incomingCallRingingAudio,
    dailyCalls,
    outgoingCall,
    getDailysCalls,
    getTodayTotals,
    resetCallTiming,
    setCallIncoming,
    setShowDashboardCallHandler,
    setTrasnferInProgressOrCompleted,
    setCurrentCall,
    setCallInProgress,
    setCreatingCall,
    createCallStatusInDatabase,
    startCallTimingCount,
  ]);

  // ---- local states ----
  const [direction, setDirection] = useState(0);

  const cards = [
    <DailyActivityCard key={1} />,
    <TasksCard key={2} />,
    <Inventory key={3} />,
    <FlowsUp key={4} />,
    <SmsCard key={5} />,
  ];

  const handlePrevView = () => {
    setDirection(-1);

    const prevIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;

    setCurrentIndex(prevIndex);
    setCurrentDashboardIndex(prevIndex);
  };

  const handleNextView = () => {
    setDirection(1);

    const nextIndex = currentIndex === cards.length - 1 ? 0 : currentIndex + 1;

    setCurrentIndex(nextIndex);
    setCurrentDashboardIndex(nextIndex);
  };

  const handleDashboardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    closeIconedSelectOptions();
    closeUserInfoOptions();
    closeUserNotifications();
    closeSmsAndEmailFilter();
    closeSmsAndEmailDateFilter();
  };

  const [openInNewTab] = useLocalStorage('openInNewTab', false);

  useEffect(() => {
    toggleOpenInNewTab(openInNewTab);
  }, [openInNewTab, toggleOpenInNewTab]);

  const { handlingNewTab } = useNewTabStore();

  useEffect(() => {
    if (newTabUrl) {
      setCloseNewTab(true);

      handlingNewTab(newTabUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newTabUrl]);

  return (
    <div onClick={handleDashboardClick}>
      {newTabUrl && loadingNewTab && <Loader fixed zIndex={2000} />}
      {(incomingCallsArray.find((callInfo) => callInfo.isActive)?.conferenceName || call) &&
        showDashboardCallHandler &&
        !showCallModal && <IncomingCallComponent />}
      {/* <IncomingCallComponent /> */}
      <section className="">
        <AnimatePresence>{workInprogress && <WorkInProgress />}</AnimatePresence>
        <DashboardOptions />
        <AnimatePresence>{singleUser && <UserDetail />}</AnimatePresence>
        <article className="flex flex-row">
          {/* prev btn */}
          <motion.button
            animate={{
              transitionDuration: '600ms',
            }}
            whileHover={{
              width: '6vw',
            }}
            type="button"
            onClick={handlePrevView}
            className="w-[5.3125vw] h-[57.685185vh] mt-[13.935185vh] rounded-r-[0.520833vw] bg-[#92CEC3] flex justify-center items-center"
          >
            <PrevBtnIcon />
          </motion.button>
          {/* slideshow container */}
          <div className="relative w-full mx-auto">
            <AnimatePresence initial={false} custom={direction}>
              {/* slide */}
              <motion.aside
                variants={variants}
                animate="animate"
                initial="initial"
                exit="exit"
                key={currentIndex}
                custom={direction}
                className="absolute top-0 bottom-0 left-0 right-0 h-full mx-auto w-fit"
              >
                {cards[currentIndex]}
              </motion.aside>
            </AnimatePresence>
          </div>
          {/* next btn */}
          <motion.button
            animate={{
              transitionDuration: '600ms',
            }}
            whileHover={{
              width: '6vw',
            }}
            type="button"
            onClick={handleNextView}
            className="w-[5.260417vw] h-[57.685185vh] mt-[13.981481vh] rounded-l-[0.520833vw] bg-[#92CEC3] flex justify-center items-center"
          >
            <NextBtnIcon />
          </motion.button>
        </article>
      </section>
      {/* pdf printing data modal */}
      <AnimatePresence>{printingData && <PdfContainer />}</AnimatePresence>
      {addNewReport ? <AddNewReport /> : false}
      {/* inventory system */}
      <AnimatePresence>{inventorySystem && <InventorySystem />}</AnimatePresence>
      {/* client system */}
      <AnimatePresence>
        {clientSystem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ClientSystem />
          </motion.div>
        )}
      </AnimatePresence>
      {/* customer detail */}
      <AnimatePresence>
        {clientDetail && (
          <motion.div
            initial={{ opacity: 0, zIndex: 0 }}
            animate={{ opacity: 1, zIndex: 50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CustomerDetail />
          </motion.div>
        )}
      </AnimatePresence>
      {/* customer list */}
      <AnimatePresence>
        {customerList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CustomerList />
          </motion.div>
        )}
      </AnimatePresence>

      {/* daily appointments */}
      <AnimatePresence>{dailyAppointments && <DailyAppointment />}</AnimatePresence>
      {/* daily calls */}
      <AnimatePresence>{dailyCalls && <DailyCalls />}</AnimatePresence>
      {/* missing tasks */}
      <AnimatePresence>{missingTasks && <MissingTasks />}</AnimatePresence>
      {/* daily messages */}
      <AnimatePresence>{dailyMessages && <DailyMessages />}</AnimatePresence>
      {/* daily made credit app */}
      <AnimatePresence>{dailyMadeCreditApp && <DailyMadeCreditApp />}</AnimatePresence>
      {/* daily sells */}
      <AnimatePresence>{dailySells && <DailySells />}</AnimatePresence>
      <AnimatePresence>
        {newCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NewCustomers />
          </motion.aside>
        )}
        {contactAttemptCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ContactAttemptCustomers />
          </motion.aside>
        )}
        {contactedCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ContactedCustomers />
          </motion.aside>
        )}
        {creditAppCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CreditAppCustomers />
          </motion.aside>
        )}
        {showUpCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShowUpCustomers />
          </motion.aside>
        )}
        {lostCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LostCustomers />
          </motion.aside>
        )}
        {noShowUpCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NoShowUpCustomers />
          </motion.aside>
        )}
        {soldCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SoldCustomers />
          </motion.aside>
        )}
        {depositCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DepositCustomers />
          </motion.aside>
        )}
        {deliveryCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DeliveryCustomers />
          </motion.aside>
        )}
        {undeliveredCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UndeliveredCustomers />
          </motion.aside>
        )}
        {appointmentCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AppointmentSystem />
          </motion.aside>
        )}
        {paidCustomersList && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PaidCustomers />
          </motion.aside>
        )}
        {settings && <Settings />}
        {reports && <Reports />}
        {importData && <Import />}
        {exportData && <Export />}
        <AnimatePresence>{taskDetail && <TaskDetail />}</AnimatePresence>
      </AnimatePresence>
      {/* manager task modal window */}
      <AnimatePresence>{addManagerTask && <AddManagerTask />}</AnimatePresence>
      {/* sms dashboard modal */}
      <AnimatePresence>{dashboardSmsModal && <SmsModal />}</AnimatePresence>
      {/* note window */}
      <AnimatePresence>{noteWindow && <NotesWindow />}</AnimatePresence>
      <AnimatePresence>
        {callendarAppointmentDetail && appointmentIdToDetail && (
          <AppointmentDetailForm appointmentId={appointmentIdToDetail} />
        )}
      </AnimatePresence>
    </div>
  );
}
