import { create } from "zustand";
import {
  Appointments,
  AppointmentsStatuses,
  ClientTypes,
  Clients,
  ContactMethod,
  InquiryTypeData,
  LeadSources,
  LeadTypes,
  NewProspect,
  Sellers,
  SingleClient,
  VehicleTypes,
  VehicleMileage,
  SingleClientMessages,
  CobuyerRelationship,
  ClientDetailLeads,
  ClientStatuses,
  Language,
  States,
  FilesData,
  VehicleOptions,
  Gender,
  IdType,
  IdState,
  CreditAppMonths,
  CreditAddressType,
  ClientsNotes,
  CreditAppStart,
  EventsData,
  ContactTime,
  LeadTemperatures,
  DepositMethods,
  Tasks,
  CreditAppListStatus,
  SingleClientTasks,
  DayTime,
  DailyAppointments,
  Calls,
  AllSms,
  Notifications,
  Roles,
  Users,
  UserStatus,
  SingleUser,
  Permissions,
  SingleRole,
  DailyActivityAppointments,
  Business,
  NotificationsPreference,
  FollowupVisibility,
  CustomerSettings,
  EmailToLead,
  CustomBeBackReasons,
  CustomNoSaleReasons,
  CustomLostReasons,
  AutomatedReview,
  UnknownAdfElements,
  Color,
  Condition,
  DriveTrain,
  Engine,
  FuelType,
  Make,
  Model,
  Odometer,
  OdometerType,
  Transmission,
  Trim,
  InventoryType,
  InventoryStatus,
  SalesType,
  DetailCondition,
  DetailSource,
  AcqType,
  TitleStatus,
  TitleBrand,
  InspectionStatus,
  EmissionStatus,
  PaymentMethod,
  SmsTemplateVariables,
  SmsTemplates,
  AddressInputs,
  EmploymentStatus,
  Occupation,
  IncomeType,
  CustomerEmployment,
  CreditAppReferenceRelationship,
  CreditAppReferences,
  Dayweeks,
  DailyCalls,
  BusinessWebsites,
  BusinessVehicleUrl,
  BusinessPrimaryUrl,
  SpecificClients,
  DailyMadeAppointments,
  DailyTotalsDashboard,
  DailyMessagesData,
  IncomingCallCustomerIdentity,
  CreditAppStartData,
  CreditAppAddressData,
  Deal,
  NewCobuyerReferrer,
  ReminderTimeData,
  SmsTemplateCategory,
  AutomaticEmails,
  PaymentTypes,
  DisableSelectValues,
  AutomaticSms,
  SystemAccessesData,
  EventsTypes,
  TaskSettings,
  TaskDueTimeLimit,
  DailySells,
  LeadDeal,
  NotificationCounts,
  NotificationsPagination,
  DailyMadeLeadWithCreditApp,
} from "@/app/libs/definitions";
import { dateFormatsStore } from "./dateFormats";
import { CallActivitySummary } from "@/app/api/reports/storeReport/callActivity/route";
import { TaskActivityData } from "@/app/api/reports/storeReport/taskActivity/types";
import { useSocketStore } from "./socketIo";
import { CUSTOMER_STATUSES_LIST } from "@/app/libs/customer/customersFunctions";

// general data for display in admin dashboard

interface AdminDashboardStore {
  appointmentsData: Appointments;
  clientsData: Clients;
  sellersData: Sellers;
  appointmentStatusesData: AppointmentsStatuses;
  leadTypesData: LeadTypes;
  leadSourcesData: LeadSources;
  clientTypesData: ClientTypes;
  contactMethodData: ContactMethod;
  inquiryTypeData: InquiryTypeData;
  vehicleTypesData: VehicleTypes;
  vehicleMileagesData: VehicleMileage;
  cobuyerRelationshipData: CobuyerRelationship | undefined;
  clientDetailLeadData: ClientDetailLeads;
  clientStatusesData: ClientStatuses | undefined;
  languagesData: Language;
  statesData: States;
  clientDetailLeadSelectedData: string;
  genderData: Gender;
  idTypeData: IdType;
  idStateData: IdState;
  specificClientsData: SpecificClients;
  specificClientsDataTwo: SpecificClients;
  specificClientsDataThree: SpecificClients;
  filesData: FilesData;
  creditAddressMonthsData: CreditAppMonths;
  creditAddressTypeData: CreditAddressType;
  clientsNotesData: ClientsNotes;
  vehicleOptions: VehicleOptions;
  clientEvents: EventsData;
  leadTemperatures: LeadTemperatures;
  contactTimeData: ContactTime;
  depositMethodData: DepositMethods;
  creditAppListStatus: CreditAppListStatus;
  tasks: Tasks;
  tasksActivity: TaskActivityData[];
  dayTime: DayTime;
  singleClientTasks: SingleClientTasks | undefined;
  dailyAppointments: DailyAppointments;
  dailyCalls: DailyCalls;
  missingTasks: Tasks;
  dailyMadeCreditApp: DailyMadeLeadWithCreditApp[];
  notifications: Notifications;
  notificationCounts: NotificationCounts;
  notificationsPagination: NotificationsPagination | null;
  dailyActivityAppointments: DailyActivityAppointments;
  roles: Roles;
  users: Users;
  userStatus: UserStatus;
  permissions: Permissions;
  totalNotifications: number | undefined;
  business: Business;
  notificationPreference: NotificationsPreference | null;
  followupVisibility: FollowupVisibility;
  customerSettings: CustomerSettings;
  emailToLead: EmailToLead;
  customBeBackReasons: CustomBeBackReasons;
  customNoSaleReasons: CustomNoSaleReasons;
  customLostReasons: CustomLostReasons;
  currentDashboardIndex: number;
  unknownAdfElements: UnknownAdfElements;
  automatedReview: AutomatedReview;
  smsTemplateCategory: SmsTemplateCategory;
  smsTemplateVariables: SmsTemplateVariables;
  smsTemplates: SmsTemplates;
  specificClientsNotesData: ClientsNotes;
  bdc: Users;
  financeManagers: Users;
  salesManagers: Users;
  employmentStatus: EmploymentStatus;
  occupation: Occupation;
  incomeType: IncomeType;
  customerEmployment: CustomerEmployment;
  creditAppReferenceRelationship: CreditAppReferenceRelationship;
  creditAppReferences: CreditAppReferences;
  dayweeks: Dayweeks;
  customerCalls: Calls;
  callActivityCalls: CallActivitySummary[];
  businessWebsites: BusinessWebsites;
  businessVehicleUrl: BusinessVehicleUrl;
  businessPrimaryUrl: BusinessPrimaryUrl;
  noteCustomerIdSelected: number | null;
  noteFromIdSelected: number | null;
  noteCustomerStatusIdSelected: number | null;
  dailyMadeAppointments: DailyMadeAppointments;
  userImage: {
    img: string | null;
  } | null;
  dailyTotals: DailyTotalsDashboard;
  incomingCallIdentity: IncomingCallCustomerIdentity;
  creditAppAddress: CreditAppAddressData | null;
  deal: Deal | null;
  dealLeadActive: LeadDeal | null;
  reminderTime: ReminderTimeData | null;
  automaticEmails: AutomaticEmails;
  paymentTypes: PaymentTypes;
  disableSelectValues: DisableSelectValues;
  automaticSms: AutomaticSms;
  selectedCustomersIds: number[];
  clients: Clients;
  systemAccessesData: SystemAccessesData;
  selectedUserSystemAccess: number | null;
  eventsTypes: EventsTypes | null;
  taskSettings: TaskSettings;
  taskDueTimeLimit: TaskDueTimeLimit;
  eventCategories: { id: number; category: string }[];
  dailySells: DailySells | undefined;
  depositOpenedFromEndVisit: boolean;
  endVisitWithDeposit: boolean;
  lostReasons?: { id: number; reason: string }[] | null;
  getLostReasons: () => Promise<void>;
  getTasksActivity: (
    userId: number | null | undefined,
    createDate?: string | null,
    dueDate?: string | null,
  ) => Promise<void>;
  setEndVisitWithDeposit: (value: boolean) => void;
  setDepositOpenedFromEndVisit: (value: boolean) => void;
  getDailySells: () => Promise<void>;
  getEventCategories: () => Promise<void>;
  getTaskDueTimeLimit: () => Promise<void>;
  getTaskSettings: () => Promise<void>;
  getEventsTypes: () => Promise<void>;
  setSelectedUserSystemAccess: (userId: number | null) => void;
  getSystemAccesses: () => Promise<void>;
  setClients: (clientsData: Clients) => void;
  setSelectedCustomersIds: (selectedCustomersIdsRows: number[]) => void;
  getAutomaticSms: () => Promise<void>;
  getDisableSelectValues: () => Promise<void>;
  getPaymentTypes: () => Promise<void>;
  getAutomaticEmails: () => Promise<void>;
  getReminderTime: () => Promise<void>;
  getDeal: (
    customerId: number,
    leadId?: string | number | null,
  ) => Promise<void>;
  getDealByDealId: (dealId: number) => Promise<void>;
  getCreditAppAddress: (customerId: number) => Promise<void>;
  getIncomingCallIdentity: (phoneNumber: string) => Promise<void>;
  getTodayTotals: (userId: number) => Promise<void>;
  getUserImage: (userId: string) => Promise<void>;
  getDailyMadeAppointments: (userId: number) => Promise<void>;
  setNoteCustomerStatusIdSelected: (statusId: number | null) => void;
  setNoteFromIdSelected: (fromId: number | null) => void;
  setNoteCustomerIdSelected: (customerId: number | null) => void;
  getBusinessPrimaryUrl: () => Promise<void>;
  getBusinessVehicleUrl: () => Promise<void>;
  getBusinessWebsites: () => Promise<void>;
  getCallActivity: (dateFilter: string | null) => Promise<void>;
  getCustomerCalls: (customerId?: number | null) => Promise<void>;
  getDayweeks: () => Promise<void>;
  getCreditAppReferences: (id: number) => Promise<void>;
  getCreditAppReferenceRelationship: () => Promise<void>;
  getCustomerEmployment: (id: number) => Promise<void>;
  setCurrentDashboardIndex: (id: number) => void;
  getIncomeType: () => Promise<void>;
  getOccuaption: () => Promise<void>;
  getEmploymentStatus: () => Promise<void>;
  getBdc: () => Promise<void>;
  getFinanceManagers: () => Promise<void>;
  getSalesManagers: () => Promise<void>;
  getSpecificClientsNotes: (customerStatusId: string) => Promise<void>;
  clearSpecificClientsNotes: () => void;
  getSmsTemplates: () => Promise<void>;
  getSmsTemplateVariables: () => Promise<void>;
  getSmsTemplateCategory: () => Promise<void>;
  getUnknownAdfElements: () => Promise<void>;
  getAutomatedReview: () => Promise<void>;
  getCustomBeBackReasons: () => Promise<void>;
  getCustomNoSaleReasons: () => Promise<void>;
  getCustomLostReasons: () => Promise<void>;
  getEmailToLead: () => Promise<void>;
  getCustomerSettings: () => Promise<void>;
  getFollowupVisibility: () => Promise<void>;
  getNotificationsPreference: () => Promise<void>;
  getBusiness: () => Promise<void>;
  getTotalNotifications: (userId: number, roleId: number) => Promise<void>;
  getPermissions: () => Promise<void>;
  getUserStatus: () => Promise<void>;
  getUsers: () => Promise<Users>;
  getRoles: () => Promise<void>;
  getDailyActivityAppointments: () => Promise<void>;
  getNotifications: ({
    userId,
    roleId,
    page,
    typeId,
    append,
  }: {
    userId: string;
    roleId: string;
    page?: number;
    typeId?: number;
    append?: boolean;
  }) => Promise<void>;
  getNotificationCounts: (userId: string, roleId: string) => Promise<void>;
  resetNotifications: () => void;
  optimisticMarkAsRead: (id: number, isRead: boolean, typeId: number) => void;
  optimisticDelete: (id: number, typeId: number) => any | undefined;
  restoreNotification: (notification: any, typeId: number) => void;
  getDailyMadeCreditApp: () => Promise<void>;
  getMissingTasks: (userId: number) => Promise<void>;
  getDailysCalls: (userId: number) => Promise<void>;
  getDailyAppointments: () => Promise<void>;
  getDayTime: () => Promise<void>;
  getTasks: (userId: number, status: number[]) => Promise<void>;
  getCreditAppListStatus: () => Promise<void>;
  getDepositMethods: () => Promise<void>;
  getLeadTemperatures: () => Promise<void>;
  getAppointments: () => Promise<void>;
  getClients: () => Promise<void>;
  getSpecificClients: (customerStatusId: string | number) => Promise<void>;
  getSpecificClientsTwo: (customerStatusId: string | number) => Promise<void>;
  getSpecificClientsThree: (customerStatusId: string | number) => Promise<void>;
  clearLostCustomersFromSpecificClients: (specificClientsIds: number[]) => void;
  getSellers: () => Promise<void>;
  clearSpecificClientsData: () => void;
  getAppointmentsStatuses: () => Promise<void>;
  getLeadTypes: () => Promise<void>;
  getLeadSources: () => Promise<void>;
  getClientTypes: () => Promise<void>;
  getContactMethod: () => Promise<void>;
  getInquiryType: () => Promise<void>;
  getVehicleTypes: () => Promise<void>;
  getVehicleMileages: () => Promise<void>;
  getCobuyerRelationship: () => Promise<void>;
  getClientDetailLead: () => Promise<void>;
  getClientDetailLeadSelected: (lead: string) => void;
  getClientStatuses: () => Promise<void>;
  getLanguages: () => Promise<void>;
  getStates: () => Promise<void>;
  getFiles: (id: number) => Promise<void>;
  getVehicleOptions: () => Promise<void>;
  getIdType: () => Promise<void>;
  getIdState: () => Promise<void>;
  getGender: () => Promise<void>;
  getCreditAddressMonth: () => Promise<void>;
  getCreditAddressType: () => Promise<void>;
  getClientsNotes: () => Promise<void>;
  getClientEvents: (id: string) => Promise<void>;
  getContactTime: () => Promise<void>;
  getSingleClientTasks: (id: string) => Promise<void>;
  clearSingleClientTasks: () => void;
}

export const adminDashboardStore = create<AdminDashboardStore>((set) => ({
  // states
  appointmentsData: undefined,
  leadTemperatures: [],
  depositMethodData: [],
  clientsData: undefined,
  sellersData: undefined,
  appointmentStatusesData: [],
  leadTypesData: [],
  leadSourcesData: [],
  clientTypesData: [],
  contactMethodData: [],
  inquiryTypeData: [],
  vehicleTypesData: [],
  vehicleMileagesData: [],
  cobuyerRelationshipData: undefined,
  clientDetailLeadData: [],
  clientStatusesData: CUSTOMER_STATUSES_LIST,
  languagesData: [],
  statesData: undefined,
  filesData: [],
  specificClientsData: undefined,
  specificClientsDataTwo: undefined,
  specificClientsDataThree: undefined,
  vehicleOptions: [],
  genderData: [],
  idStateData: [],
  idTypeData: [],
  currentDashboardIndex: 3,
  creditAddressMonthsData: [],
  creditAddressTypeData: [],
  clientsNotesData: [],
  clientEvents: [],
  contactTimeData: [],
  creditAppListStatus: [],
  tasks: undefined,
  singleClientTasks: undefined,
  dayTime: undefined,
  dailyAppointments: undefined,
  dailyCalls: undefined,
  missingTasks: undefined,
  dailyMadeCreditApp: [],
  notifications: undefined,
  notificationCounts: {
    general: 0,
    appointment: 0,
    inventory: 0,
    customers: 0,
    warnings: 0,
  },
  notificationsPagination: null,
  dailyActivityAppointments: undefined,
  roles: undefined,
  users: undefined,
  userStatus: undefined,
  permissions: undefined,
  totalNotifications: undefined,
  business: undefined,
  notificationPreference: null,
  followupVisibility: undefined,
  customerSettings: undefined,
  emailToLead: undefined,
  customBeBackReasons: undefined,
  customNoSaleReasons: undefined,
  customLostReasons: undefined,
  automatedReview: undefined,
  unknownAdfElements: undefined,
  smsTemplateCategory: undefined,
  smsTemplateVariables: undefined,
  smsTemplates: undefined,
  specificClientsNotesData: [],
  clientDetailLeadSelectedData: "",
  bdc: undefined,
  financeManagers: undefined,
  salesManagers: undefined,
  employmentStatus: undefined,
  occupation: undefined,
  incomeType: undefined,
  customerEmployment: undefined,
  creditAppReferenceRelationship: undefined,
  creditAppReferences: undefined,
  dayweeks: undefined,
  customerCalls: undefined,
  callActivityCalls: [],
  businessWebsites: undefined,
  businessVehicleUrl: undefined,
  businessPrimaryUrl: undefined,
  noteCustomerIdSelected: null,
  noteFromIdSelected: null,
  noteCustomerStatusIdSelected: null,
  dailyMadeAppointments: undefined,
  userImage: null,
  dailyTotals: {
    dailyCallsCount: 0,
    dailyMessagesCount: 0,
    dailyMadeAppointmentCount: 0,
    missingTasksCount: 0,
    dailyMadeCreditAppCount: 0,
    dailySellsCount: 0,
  },
  incomingCallIdentity: null,
  creditAppAddress: null,
  deal: null,
  dealLeadActive: null,
  reminderTime: null,
  automaticEmails: null,
  paymentTypes: null,
  disableSelectValues: null,
  automaticSms: null,
  selectedCustomersIds: [],
  clients: [],
  systemAccessesData: [],
  selectedUserSystemAccess: null,
  eventsTypes: null,
  taskSettings: null,
  taskDueTimeLimit: [],
  eventCategories: [],
  dailySells: undefined,
  depositOpenedFromEndVisit: false,
  endVisitWithDeposit: false,
  tasksActivity: [],
  lostReasons: null,
  // setStates
  getLostReasons: async () => {
    const res = await fetch("/api/lostReasons");

    const json = await res.json();

    set({ lostReasons: json });
  },
  getTasksActivity: async (userId, createDate, dueDate) => {
    if (userId) {
      const apiUrl = `/api/reports/storeReport/taskActivity/${userId}${
        createDate ? `?${createDate}` : ""
      }${dueDate ? (createDate ? `&${dueDate}` : `?${dueDate}`) : ""}`;

      const res = await fetch(apiUrl);

      const json: TaskActivityData[] = await res.json();

      set({ tasksActivity: json });
    }
  },
  setEndVisitWithDeposit: (value) => {
    set({ endVisitWithDeposit: value });
  },
  setCurrentDashboardIndex: (index) => {
    set({ currentDashboardIndex: index });
  },
  setDepositOpenedFromEndVisit: (value) => {
    set({ depositOpenedFromEndVisit: value });
  },
  getDailySells: async () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const res = await fetch(
      `/api/adminDashboard/dailySells?timeZone=${encodeURIComponent(timeZone)}`,
    );

    const json = await res.json();

    set({ dailySells: json });
  },
  getEventCategories: async () => {
    const res = await fetch("/api/adminDashboard/eventsCategories");

    const json = await res.json();

    set({ eventCategories: json });
  },
  getTaskDueTimeLimit: async () => {
    const res = await fetch("/api/taskDueTimeLimit");

    const json = await res.json();

    set({ taskDueTimeLimit: json });
  },
  getTaskSettings: async () => {
    const res = await fetch("/api/settings/customerSettings/taskSettings");

    const json = await res.json();

    set({ taskSettings: json });
  },
  getEventsTypes: async () => {
    const res = await fetch("/api/eventsTypes");

    const json = await res.json();

    set({ eventsTypes: json });
  },
  setSelectedUserSystemAccess: (userId) => {
    set({ selectedUserSystemAccess: userId });
  },
  getSystemAccesses: async () => {
    const res = await fetch("/api/systemAccesses");

    const json = await res.json();

    set({
      systemAccessesData: json,
    });
  },
  setClients: (clientsData) => {
    set({ clients: clientsData });
  },
  setSelectedCustomersIds: (selectedCustomersIdsRows) => {
    set({ selectedCustomersIds: selectedCustomersIdsRows });
  },
  getAutomaticSms: async () => {
    const res = await fetch("/api/settings/automaticSms");

    const json = await res.json();

    set({ automaticSms: json });
  },
  getDisableSelectValues: async () => {
    const res = await fetch("/api/disableSelects");

    const json = await res.json();

    set({ disableSelectValues: json });
  },
  getPaymentTypes: async () => {
    const res = await fetch("/api/settings/paymentTypes");

    const json = await res.json();

    set({ paymentTypes: json });
  },
  getAutomaticEmails: async () => {
    const res = await fetch("/api/settings/automaticEmails");

    const json = await res.json();

    set({ automaticEmails: json });
  },
  getReminderTime: async () => {
    const res = await fetch("/api/adminDashboard/reminderTime");

    const json = await res.json();

    set({ reminderTime: json });
  },
  getDeal: async (customerId, leadId) => {
    const res = await fetch(
      `/api/deal/${customerId}${leadId ? `?leadId=${leadId}` : ""}`,
    );

    const json = await res.json();

    set({ deal: json?.deal, dealLeadActive: json?.dealLeadActive });
  },
  getDealByDealId: async (dealId: number) => {
    const res = await fetch(
      `/api/reports/storeReport/sold-customers/deal/${dealId}`,
    );

    const json = await res.json();

    set({ deal: json?.deal, dealLeadActive: json?.deal?.lead });
  },
  getCreditAppAddress: async (customerId) => {
    const res = await fetch(
      `/api/adminDashboard/creditApp/address/${customerId}`,
    );

    const json = await res.json();

    set({ creditAppAddress: json });
  },
  getIncomingCallIdentity: async (phoneNumber) => {
    const data = await (
      await fetch(`/api/incomingCallerIdentity/${phoneNumber}`, {
        cache: "no-store",
      })
    ).json();

    set((state) => ({
      ...state,
      incomingCallIdentity: data,
    }));
  },
  getTodayTotals: async (userId) => {
    if (userId) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const data = await (
        await fetch(
          `/api/adminDashboard/dailyTotals/${userId}?timeZone=${encodeURIComponent(timeZone)}`,
          { cache: "no-store" },
        )
      ).json();

      set((state) => ({
        ...state,
        dailyTotals: data,
      }));
    }
  },
  getUserImage: async (userId) => {
    const data = await (await fetch(`/api/user/userImage/${userId}`)).json();

    set((state) => ({
      ...state,
      userImage: data,
    }));
  },
  getDailyMadeAppointments: async (userId) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const data = await (
      await fetch(
        `/api/adminDashboard/dailyMadeAppointments/${userId}?timezone=${encodeURIComponent(timeZone)}`,
        { cache: "no-store" },
      )
    ).json();

    set((state) => ({
      ...state,
      dailyMadeAppointments: data,
    }));
  },
  setNoteCustomerStatusIdSelected: (statusId) => {
    set({ noteCustomerStatusIdSelected: statusId });
  },
  setNoteFromIdSelected: (fromId) => {
    set({ noteFromIdSelected: fromId });
  },
  setNoteCustomerIdSelected: (customerId) => {
    set({ noteCustomerIdSelected: customerId });
  },
  getBusinessPrimaryUrl: async () => {
    const data = await (
      await fetch("/api/adminDashboard/primaryDealerWebsiteUrl")
    ).json();

    set((state) => ({
      ...state,
      businessPrimaryUrl: data,
    }));
  },
  getBusinessVehicleUrl: async () => {
    const data = await (
      await fetch("/api/adminDashboard/vehicleDetailPageUrl")
    ).json();

    set((state) => ({
      ...state,
      businessVehicleUrl: data,
    }));
  },
  getBusinessWebsites: async () => {
    const data = await (await fetch("/api/adminDashboard/website")).json();

    set((state) => ({
      ...state,
      businessWebsites: data,
    }));
  },
  getCallActivity: async (dateQuery) => {
    const apiUrl = "/api/reports/storeReport/callActivity";

    const data = await (
      await fetch(dateQuery ? apiUrl + `?${dateQuery}` : apiUrl)
    ).json();

    set((state) => ({
      ...state,
      callActivityCalls: data,
    }));
  },
  getCustomerCalls: async (customerId) => {
    if (!customerId) return;

    const data = await (
      await fetch(`/api/adminDashboard/calls/${customerId}`)
    ).json();

    set((state) => ({
      ...state,
      customerCalls: data,
    }));
  },
  getDayweeks: async () => {
    const data = await (await fetch("/api/adminDashboard/dayweeks")).json();

    set((state) => ({
      ...state,
      dayweeks: data,
    }));
  },
  getCreditAppReferences: async (id) => {
    const data = await (
      await fetch(`/api/adminDashboard/creditApp/references/${id}`)
    ).json();

    set((state) => ({
      ...state,
      creditAppReferences: data,
    }));
  },
  getCreditAppReferenceRelationship: async () => {
    const data = await (
      await fetch("/api/adminDashboard/creditAppReferenceRelationship")
    ).json();

    set((state) => ({
      ...state,
      creditAppReferenceRelationship: data,
    }));
  },
  getCustomerEmployment: async (id) => {
    const data = await (
      await fetch(`/api/adminDashboard/creditApp/employmentStatus/${id}`)
    ).json();

    set((state) => ({
      ...state,
      customerEmployment: data,
    }));
  },
  getIncomeType: async () => {
    const data = await (await fetch("/api/adminDashboard/incomeType")).json();

    set((state) => ({
      ...state,
      incomeType: data,
    }));
  },
  getOccuaption: async () => {
    const data = await (await fetch("/api/adminDashboard/occupation")).json();

    set((state) => ({
      ...state,
      occupation: data,
    }));
  },
  getEmploymentStatus: async () => {
    const data = await (
      await fetch("/api/adminDashboard/employmentStatus")
    ).json();

    set((state) => ({
      ...state,
      employmentStatus: data,
    }));
  },
  getBdc: async () => {
    const data = await (await fetch("/api/adminDashboard/bdc")).json();

    set((state) => ({
      ...state,
      bdc: data,
    }));
  },
  getFinanceManagers: async () => {
    const data = await (
      await fetch("/api/adminDashboard/financeManager")
    ).json();

    set((state) => ({
      ...state,
      financeManagers: data,
    }));
  },
  getSalesManagers: async () => {
    const data = await (await fetch("/api/adminDashboard/salesManager")).json();

    set((state) => ({
      ...state,
      salesManagers: data,
    }));
  },
  getSpecificClientsNotes: async (customerStatusId) => {
    const notes = await (
      await fetch(`/api/adminDashboard/clientsNotes/${customerStatusId}`, {
        cache: "no-store",
      })
    ).json();

    set((state) => ({
      ...state,
      specificClientsNotesData: notes,
    }));
  },
  clearSpecificClientsNotes: () => {
    set({ specificClientsNotesData: [] });
  },
  getSmsTemplates: async () => {
    const data = await (
      await fetch(`/api/message/smsTemplate`, { cache: "no-store" })
    ).json();

    set((state) => ({
      ...state,
      smsTemplates: data,
    }));
  },
  getSmsTemplateVariables: async () => {
    const data = await (
      await fetch(`/api/message/smsTemplateVariables`)
    ).json();

    set((state) => ({
      ...state,
      smsTemplateVariables: data,
    }));
  },
  getSmsTemplateCategory: async () => {
    const data = await (await fetch(`/api/message/smsTemplateCategory`)).json();

    set((state) => ({
      ...state,
      smsTemplateCategory: data,
    }));
  },
  clearSpecificClientsData: () => {
    set({ specificClientsData: undefined });
  },
  getUnknownAdfElements: async () => {
    const el = await (await fetch(`/api/settings/unknownAdfElements`)).json();

    set((state) => ({
      ...state,
      unknownAdfElements: el,
    }));
  },
  getAutomatedReview: async () => {
    const review = await (await fetch(`/api/settings/automatedReview`)).json();

    set((state) => ({
      ...state,
      automatedReview: review,
    }));
  },
  clearLostCustomersFromSpecificClients: (specificClientsIds) => {
    set((prevStates) => ({
      ...prevStates,
      specificClientsData: prevStates.specificClientsData?.filter(
        (customer) =>
          customer.client_status?.id !== 12 &&
          !specificClientsIds.includes(customer.id),
      ),
    }));
  },
  getSpecificClients: async (customerStatusId) => {
    const data = await (
      await fetch(`/api/adminDashboard/clients/${customerStatusId}`, {
        cache: "no-store",
      })
    ).json();

    set((state) => ({
      ...state,
      specificClientsData: data,
    }));
  },
  getSpecificClientsTwo: async (customerStatusId) => {
    const data = await (
      await fetch(`/api/adminDashboard/clients/${customerStatusId}`, {
        cache: "no-store",
      })
    ).json();

    set((state) => ({
      ...state,
      specificClientsDataTwo: data,
    }));
  },
  getSpecificClientsThree: async (customerStatusId) => {
    const data = await (
      await fetch(`/api/adminDashboard/clients/${customerStatusId}`, {
        cache: "no-store",
      })
    ).json();

    set((state) => ({
      ...state,
      specificClientsDataThree: data,
    }));
  },
  getCustomBeBackReasons: async () => {
    const reasons = await (
      await fetch(`/api/settings/customBeBackReasons`)
    ).json();

    set((state) => ({
      ...state,
      customBeBackReasons: reasons,
    }));
  },
  getCustomNoSaleReasons: async () => {
    const reasons = await (
      await fetch(`/api/settings/customNoSaleReasons`)
    ).json();

    set((state) => ({
      ...state,
      customNoSaleReasons: reasons,
    }));
  },
  getCustomLostReasons: async () => {
    const reasons = await (
      await fetch(`/api/settings/customLostReason`)
    ).json();

    set((state) => ({
      ...state,
      customLostReasons: reasons,
    }));
  },
  getEmailToLead: async () => {
    const leads = await (await fetch(`/api/settings/emailToLead`)).json();

    set((state) => ({
      ...state,
      emailToLead: leads,
    }));
  },
  getCustomerSettings: async () => {
    const settings = await (
      await fetch(`/api/settings/customerSettings`)
    ).json();

    set((state) => ({
      ...state,
      customerSettings: settings,
    }));
  },
  getFollowupVisibility: async () => {
    const followup = await (
      await fetch(`/api/adminDashboard/followupVisibility`)
    ).json();

    set((state) => ({
      ...state,
      followupVisibility: followup,
    }));
  },
  getNotificationsPreference: async () => {
    const notiPref = await (
      await fetch(`/api/adminDashboard/notificationsPreferences`)
    ).json();

    set({ notificationPreference: notiPref });
  },
  getBusiness: async () => {
    const business = await (
      await fetch("/api/adminDashboard/business", { method: "GET" })
    ).json();

    set((state) => ({
      ...state,
      business: business,
    }));
  },
  getTotalNotifications: async (userId, roleId) => {
    const formData = new FormData();

    userId && formData.append("userRoleId", roleId?.toString());

    const totalNoti = await (
      await fetch(`/api/adminDashboard/totalNotifications/${userId}`, {
        method: "POST",
        body: formData,
      })
    ).json();

    set((state) => ({
      ...state,
      totalNotifications: totalNoti > 0 ? totalNoti : undefined,
    }));
  },
  getPermissions: async () => {
    const perm = await (await fetch("/api/adminDashboard/permission")).json();

    set((state) => ({
      ...state,
      permissions: perm,
    }));
  },
  getUserStatus: async () => {
    const userStatus = await (
      await fetch("/api/adminDashboard/userStatus")
    ).json();

    set({ userStatus: userStatus });
  },
  getUsers: async () => {
    const users = await (await fetch("/api/adminDashboard/users")).json();

    set({ users: users });
    return users;
  },
  getRoles: async () => {
    const roles = await (await fetch("/api/adminDashboard/roles")).json();

    set((state) => ({
      ...state,
      roles: roles,
    }));
  },
  getDailyActivityAppointments: async () => {
    const { dateFormatted } = dateFormatsStore.getState();

    const today = dateFormatted(2, new Date());
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const dailyActApp = await (
      await fetch(
        `/api/adminDashboard/dailyActvityAppointments/${today.replaceAll(
          "/",
          "-",
        )}?timezone=${timeZone}`,
        {
          cache: "no-store",
        },
      )
    ).json();

    set((state) => ({
      ...state,
      dailyActivityAppointments: dailyActApp,
    }));
  },
  getNotifications: async ({
    userId,
    roleId,
    page = 1,
    typeId,
    append = false,
  }) => {
    const formData = new FormData();

    formData.append("userRoleId", roleId);
    formData.append("page", page.toString());
    formData.append("limit", "10");
    if (typeId !== undefined) {
      formData.append("typeId", typeId.toString());
    }

    const response = await (
      await fetch(`/api/adminDashboard/notifications/${userId}`, {
        method: "POST",
        body: formData,
      })
    ).json();

    if (response.notifications && response.pagination) {
      set((state) => ({
        ...state,
        notifications:
          append && state.notifications
            ? [...state.notifications, ...response.notifications]
            : response.notifications,
        notificationsPagination: response.pagination,
      }));
    }
  },
  getNotificationCounts: async (userId, roleId) => {
    const formData = new FormData();

    formData.append("userRoleId", roleId);

    const counts = await (
      await fetch(`/api/adminDashboard/notificationsCounts/${userId}`, {
        method: "POST",
        body: formData,
      })
    ).json();

    if (counts && !counts.serverError) {
      set((state) => ({
        ...state,
        notificationCounts: counts,
      }));
    }
  },
  optimisticMarkAsRead: (id, isRead, typeId) => {
    set((state) => {
      // 1. Update list
      const updatedNotifications = state.notifications?.map((n) =>
        n.id === id ? { ...n, is_read: isRead } : n,
      );

      // 2. Update counts if changing from unread -> read or read -> unread
      const currentNoti = state.notifications?.find((n) => n.id === id);
      let newCounts = { ...state.notificationCounts };
      let totalChange = 0;

      // Only update counts if the read status actually changed
      if (currentNoti && currentNoti.is_read !== isRead) {
        const change = isRead ? -1 : 1; // if marking read, decrease count. if marking unread, increase.
        totalChange = change;

        // General count (assuming typeId 1 is general, etc. mapping needed based on your system)
        // types: 1=General, 2=Appointments, 3=Inventory, 4=Customers, 5=Warnings
        switch (typeId) {
          case 1:
            newCounts.general = Math.max(0, newCounts.general + change);
            break;
          case 2:
            newCounts.appointment = Math.max(0, newCounts.appointment + change);
            break;
          case 3:
            newCounts.inventory = Math.max(0, newCounts.inventory + change);
            break;
          case 4:
            newCounts.customers = Math.max(0, newCounts.customers + change);
            break;
          case 5:
            newCounts.warnings = Math.max(0, newCounts.warnings + change);
            break;
        }
      }

      const newTotal =
        state.totalNotifications !== undefined
          ? Math.max(0, state.totalNotifications + totalChange)
          : undefined;

      return {
        ...state,
        notifications: updatedNotifications,
        notificationCounts: newCounts,
        totalNotifications: newTotal,
      };
    });
  },
  optimisticDelete: (id, typeId) => {
    let deletedItem: any | undefined;

    set((state) => {
      const notiToDelete = state.notifications?.find((n) => n.id === id);
      deletedItem = notiToDelete;

      // Remove from list
      const updatedNotifications = state.notifications?.filter(
        (n) => n.id !== id,
      );

      let newCounts = { ...state.notificationCounts };

      // If it was unread, we also need to decrease the specific category unread count and total count
      let totalChange = 0;

      if (notiToDelete && !notiToDelete.is_read) {
        totalChange = -1;
        switch (typeId) {
          case 1:
            newCounts.general = Math.max(0, newCounts.general - 1);
            break;
          case 2:
            newCounts.appointment = Math.max(0, newCounts.appointment - 1);
            break;
          case 3:
            newCounts.inventory = Math.max(0, newCounts.inventory - 1);
            break;
          case 4:
            newCounts.customers = Math.max(0, newCounts.customers - 1);
            break;
          case 5:
            newCounts.warnings = Math.max(0, newCounts.warnings - 1);
            break;
        }
      }

      const newTotal =
        state.totalNotifications !== undefined
          ? Math.max(0, state.totalNotifications + totalChange)
          : undefined;

      return {
        ...state,
        notifications: updatedNotifications,
        notificationCounts: newCounts,
        totalNotifications: newTotal,
      };
    });

    return deletedItem;
  },
  restoreNotification: (notification, typeId) => {
    set((state) => {
      // Add back to list (prepend or append? prepend usually better for "undo" feel or just keep order if we knew index, but prepend is safe)
      // Actually, let's just add it back.
      const updatedNotifications = state.notifications
        ? [notification, ...state.notifications]
        : [notification];
      // Sort by date descding to be safe?
      updatedNotifications.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      let newCounts = { ...state.notificationCounts };
      let totalChange = 0;

      if (notification && !notification.is_read) {
        totalChange = 1;
        switch (typeId) {
          case 1:
            newCounts.general = newCounts.general + 1;
            break;
          case 2:
            newCounts.appointment = newCounts.appointment + 1;
            break;
          case 3:
            newCounts.inventory = newCounts.inventory + 1;
            break;
          case 4:
            newCounts.customers = newCounts.customers + 1;
            break;
          case 5:
            newCounts.warnings = newCounts.warnings + 1;
            break;
        }
      }

      const newTotal =
        state.totalNotifications !== undefined
          ? state.totalNotifications + totalChange
          : undefined;

      return {
        ...state,
        notifications: updatedNotifications,
        notificationCounts: newCounts,
        totalNotifications: newTotal,
      };
    });
  },
  resetNotifications: () => {
    set((state) => ({
      ...state,
      notifications: undefined,
      notificationsPagination: null,
    }));
  },

  getDailyMadeCreditApp: async () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const creApp = await (
      await fetch(`/api/adminDashboard/dailyMadeCreditApp?timezone=${timeZone}`)
    ).json();

    set((state) => ({
      ...state,
      dailyMadeCreditApp: creApp,
    }));
  },
  getMissingTasks: async (userId) => {
    const misTask = await (
      await fetch(`/api/adminDashboard/missingTasks/${userId}`, {
        cache: "no-store",
      })
    ).json();

    set((state) => ({
      ...state,
      missingTasks: misTask,
    }));
  },
  getDailysCalls: async (userId) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dailyCalls = await (
      await fetch(
        `/api/adminDashboard/dailyCalls/${userId}?timezone=${timeZone}`,
        {
          cache: "no-store",
        },
      )
    ).json();

    set((state) => ({
      ...state,
      dailyCalls: dailyCalls,
    }));
  },
  getDailyAppointments: async () => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dailyApp = await (
      await fetch(`/api/adminDashboard/dailyAppointments?timezone=${timeZone}`)
    ).json();

    set((state) => ({
      ...state,
      dailyAppointments: dailyApp,
    }));
  },
  getDayTime: async () => {
    const times = await (await fetch("/api/adminDashboard/dayTime")).json();

    set((state) => ({
      ...state,
      dayTime: times,
    }));
  },
  getSingleClientTasks: async (id: string) => {
    const tasks = await (await fetch(`/api/adminDashboard/tasks/${id}`)).json();

    set((state) => ({
      ...state,
      singleClientTasks: tasks,
    }));
  },
  clearSingleClientTasks: () => {
    set((state) => ({
      ...state,
      singleClientTasks: undefined,
    }));
  },
  getTasks: async (userId, status) => {
    const params = new URLSearchParams();

    status.forEach((id) => {
      params.append("status", id.toString());
    });

    const allTasks = await (
      await fetch(
        `/api/adminDashboard/tasks/taskList/${userId}?${params.toString()}`,
      )
    ).json();

    set((state) => ({
      ...state,
      tasks: allTasks,
    }));
  },
  getCreditAppListStatus: async () => {
    const statuses = await (
      await fetch("/api/adminDashboard/creditAppListStatus")
    ).json();

    set((state) => ({
      ...state,
      creditAppListStatus: statuses,
    }));
  },
  getDepositMethods: async () => {
    const methods = await (
      await fetch("/api/adminDashboard/depositMethods")
    ).json();

    set((state) => ({
      ...state,
      depositMethodData: methods,
    }));
  },
  getLeadTemperatures: async () => {
    const temp = await (
      await fetch("/api/adminDashboard/leadTemperature")
    ).json();

    set((state) => ({
      ...state,
      leadTemperatures: temp,
    }));
  },
  getContactTime: async () => {
    const contactTimes = await (
      await fetch("/api/adminDashboard/contactTime")
    ).json();

    set((state) => ({
      ...state,
      contactTimeData: contactTimes,
    }));
  },
  getClientEvents: async (id: string) => {
    const events = await (
      await fetch(`/api/adminDashboard/events/${id}`)
    ).json();

    set((state) => ({
      ...state,
      clientEvents: events,
    }));
  },
  getClientsNotes: async () => {
    const notes = await (
      await fetch("/api/adminDashboard/clientsNotes", { cache: "no-store" })
    ).json();

    set((state) => ({
      ...state,
      clientsNotesData: notes,
    }));
  },
  getAppointments: async () => {
    const allAppointments = await (
      await fetch("/api/adminDashboard/appointments")
    ).json();

    set((state) => ({
      ...state,
      appointmentsData: allAppointments,
    }));
  },
  getClients: async () => {
    const data: Clients = await (
      await fetch("/api/adminDashboard/clients", { cache: "no-store" })
    ).json();

    set((state) => ({
      ...state,
      clientsData: data,
    }));
  },
  getSellers: async () => {
    const allSellers = await (
      await fetch("/api/adminDashboard/sellers", { cache: "no-store" })
    ).json();

    set((state) => ({
      ...state,
      sellersData: allSellers,
    }));
  },
  getAppointmentsStatuses: async () => {
    const allAppointmentsStatuses = await (
      await fetch("/api/adminDashboard/statuses")
    ).json();

    set((state) => ({
      ...state,
      appointmentStatusesData: allAppointmentsStatuses,
    }));
  },
  getLeadTypes: async () => {
    const allLeadTypes = await (
      await fetch("/api/adminDashboard/leadTypes")
    ).json();

    set((state) => ({
      ...state,
      leadTypesData: allLeadTypes,
    }));
  },
  getLeadSources: async () => {
    const allLeadSources = await (
      await fetch("/api/adminDashboard/leadSources")
    ).json();

    set((state) => ({
      ...state,
      leadSourcesData: allLeadSources,
    }));
  },
  getClientTypes: async () => {
    const allClientTypes = await (
      await fetch("/api/adminDashboard/clientTypes")
    ).json();

    set((state) => ({
      ...state,
      clientTypesData: allClientTypes,
    }));
  },
  getContactMethod: async () => {
    const allContactMethods = await (
      await fetch("/api/adminDashboard/contactMethods")
    ).json();

    set((state) => ({
      ...state,
      contactMethodData: allContactMethods,
    }));
  },
  getInquiryType: async () => {
    const allInquirTypes = await (
      await fetch("/api/adminDashboard/inquiryTypes")
    ).json();

    set((state) => ({
      ...state,
      inquiryTypeData: allInquirTypes,
    }));
  },
  getVehicleTypes: async () => {
    const allVehiclesTypes = await (
      await fetch("/api/adminDashboard/vehicleTypes")
    ).json();

    set((state) => ({
      ...state,
      vehicleTypesData: allVehiclesTypes,
    }));
  },
  getVehicleMileages: async () => {
    const allVehiclesMileages = await (
      await fetch("/api/adminDashboard/vehicleMileages")
    ).json();

    set((state) => ({
      ...state,
      vehicleMileagesData: allVehiclesMileages,
    }));
  },
  getCobuyerRelationship: async () => {
    const cobuyerRelationship = await (
      await fetch("/api/adminDashboard/cobuyerRelationship")
    ).json();

    set((state) => ({
      ...state,
      cobuyerRelationshipData: cobuyerRelationship,
    }));
  },
  getClientDetailLead: async () => {
    const clientDetailLead = await (
      await fetch("/api/adminDashboard/clientDetailLeads")
    ).json();

    set((state) => ({
      ...state,
      clientDetailLeadData: clientDetailLead,
    }));
  },
  getClientDetailLeadSelected: (lead: string) => {
    set((state) => ({
      ...state,
      clientDetailLeadSelectedData: lead,
    }));
  },
  getClientStatuses: async () => {
    // const statuses = await (await fetch('/api/adminDashboard/clientStatuses')).json();
    const statuses = CUSTOMER_STATUSES_LIST;

    set((state) => ({
      ...state,
      clientStatusesData: statuses,
    }));
  },
  getLanguages: async () => {
    const languages = await (
      await fetch("/api/adminDashboard/languages")
    ).json();

    set((state) => ({
      ...state,
      languagesData: languages,
    }));
  },
  getStates: async () => {
    const states = await (await fetch("/api/adminDashboard/states")).json();

    set((state) => ({
      ...state,
      statesData: states,
    }));
  },
  getFiles: async (id: number) => {
    if (id) {
      const files = await (
        await fetch(`/api/adminDashboard/files/${id}`)
      ).json();

      set((state) => ({
        ...state,
        filesData: files,
      }));
    }
  },
  getVehicleOptions: async () => {
    const options = await (
      await fetch("/api/adminDashboard/vehicleOptions")
    ).json();

    set((state) => ({
      ...state,
      vehicleOptions: options,
    }));
  },
  getIdState: async () => {
    const idState = await (
      await fetch("/api/adminDashboard/clientIdState")
    ).json();

    set((state) => ({
      ...state,
      idStateData: idState,
    }));
  },
  getIdType: async () => {
    const idType = await (
      await fetch("/api/adminDashboard/clientIdType")
    ).json();

    set((state) => ({
      ...state,
      idTypeData: idType,
    }));
  },
  getGender: async () => {
    const gender = await (await fetch("/api/adminDashboard/gender")).json();

    set((state) => ({
      ...state,
      genderData: gender,
    }));
  },
  getCreditAddressMonth: async () => {
    const months = await (
      await fetch("/api/adminDashboard/creditAddressMonth")
    ).json();

    set((state) => ({
      ...state,
      creditAddressMonthsData: months,
    }));
  },
  getCreditAddressType: async () => {
    const types = await (
      await fetch("/api/adminDashboard/creditAddressType")
    ).json();

    set((state) => ({
      ...state,
      creditAddressTypeData: types,
    }));
  },
}));

// inventory logic

interface InventoryStore {
  colors: Color;
  conditions: Condition;
  driveTrains: DriveTrain;
  engines: Engine;
  fuelTypes: FuelType;
  makes: Make;
  models: Model;
  odometers: Odometer;
  odometersType: OdometerType;
  statuses: InventoryStatus;
  transmissions: Transmission;
  trims: Trim;
  types: InventoryType;
  salesType: SalesType;
  detailCondition: DetailCondition;
  detailSource: DetailSource;
  acqType: AcqType;
  titleStatus: TitleStatus;
  titleBrand: TitleBrand;
  inspectionStatus: InspectionStatus;
  emissionStatus: EmissionStatus;
  paymentMethod: PaymentMethod;
  getPaymentMethod: () => Promise<void>;
  getEmissionStatus: () => Promise<void>;
  getInspectionStatus: () => Promise<void>;
  getTitleBrand: () => Promise<void>;
  getTitleStatus: () => Promise<void>;
  getAcqType: () => Promise<void>;
  getDetailSource: () => Promise<void>;
  getDetailCondition: () => Promise<void>;
  getSalesTypes: () => Promise<void>;
  getTypes: () => Promise<void>;
  getTrims: () => Promise<void>;
  getTransmissions: () => Promise<void>;
  getStatuses: () => Promise<void>;
  getOdometersType: () => Promise<void>;
  getOdometers: () => Promise<void>;
  getModels: () => Promise<void>;
  getMakes: () => Promise<void>;
  getFuelTypes: () => Promise<void>;
  getEngines: () => Promise<void>;
  getDriveTrains: () => Promise<void>;
  getConditions: () => Promise<void>;
  getColors: () => Promise<void>;
}

export const inventoryStore = create<InventoryStore>((set) => ({
  // states
  colors: undefined,
  conditions: undefined,
  driveTrains: undefined,
  engines: undefined,
  fuelTypes: undefined,
  makes: undefined,
  models: undefined,
  odometers: undefined,
  odometersType: undefined,
  statuses: undefined,
  transmissions: undefined,
  trims: undefined,
  types: undefined,
  salesType: undefined,
  detailCondition: undefined,
  detailSource: undefined,
  acqType: undefined,
  titleStatus: undefined,
  titleBrand: undefined,
  inspectionStatus: undefined,
  emissionStatus: undefined,
  paymentMethod: undefined,
  // api's
  getPaymentMethod: async () => {
    const data = await (await fetch("/api/inventory/paymentMethod")).json();

    set((state) => ({
      ...state,
      paymentMethod: data,
    }));
  },
  getEmissionStatus: async () => {
    const data = await (await fetch("/api/inventory/emissionStatus")).json();

    set((state) => ({
      ...state,
      emissionStatus: data,
    }));
  },
  getInspectionStatus: async () => {
    const data = await (await fetch("/api/inventory/inspectionStatus")).json();

    set((state) => ({
      ...state,
      inspectionStatus: data,
    }));
  },
  getTitleBrand: async () => {
    const data = await (await fetch("/api/inventory/titleBrand")).json();

    set((state) => ({
      ...state,
      titleBrand: data,
    }));
  },
  getTitleStatus: async () => {
    const data = await (await fetch("/api/inventory/titleStatus")).json();

    set((state) => ({
      ...state,
      titleStatus: data,
    }));
  },
  getAcqType: async () => {
    const data = await (await fetch("/api/inventory/acqType")).json();

    set((state) => ({
      ...state,
      acqType: data,
    }));
  },
  getDetailSource: async () => {
    const data = await (await fetch("/api/inventory/source")).json();

    set((state) => ({
      ...state,
      detailSource: data,
    }));
  },
  getDetailCondition: async () => {
    const data = await (await fetch("/api/inventory/detailCondition")).json();

    set((state) => ({
      ...state,
      detailCondition: data,
    }));
  },
  getSalesTypes: async () => {
    const data = await (await fetch("/api/inventory/salesType")).json();

    set((state) => ({
      ...state,
      salesType: data,
    }));
  },
  getColors: async () => {
    const data = await (await fetch("/api/inventory/color")).json();

    set((state) => ({
      ...state,
      colors: data,
    }));
  },
  getConditions: async () => {
    const data = await (await fetch("/api/inventory/condition")).json();

    set((state) => ({
      ...state,
      conditions: data,
    }));
  },
  getDriveTrains: async () => {
    const data = await (await fetch("/api/inventory/driveTrain")).json();

    set((state) => ({
      ...state,
      driveTrains: data,
    }));
  },
  getEngines: async () => {
    const data = await (await fetch("/api/inventory/engine")).json();

    set((state) => ({
      ...state,
      engines: data,
    }));
  },
  getFuelTypes: async () => {
    const data = await (await fetch("/api/inventory/fuelType")).json();

    set((state) => ({
      ...state,
      fuelTypes: data,
    }));
  },
  getMakes: async () => {
    const data = await (await fetch("/api/inventory/make")).json();

    set((state) => ({
      ...state,
      makes: data,
    }));
  },
  getModels: async () => {
    const data = await (await fetch("/api/inventory/model")).json();

    set((state) => ({
      ...state,
      models: data,
    }));
  },
  getOdometers: async () => {
    const data = await (await fetch("/api/inventory/odometer")).json();

    set((state) => ({
      ...state,
      odometers: data,
    }));
  },
  getOdometersType: async () => {
    const data = await (await fetch("/api/inventory/odometerType")).json();

    set((state) => ({
      ...state,
      odometersType: data,
    }));
  },
  getStatuses: async () => {
    const data = await (await fetch("/api/inventory/status")).json();

    set((state) => ({
      ...state,
      statuses: data,
    }));
  },
  getTransmissions: async () => {
    const data = await (await fetch("/api/inventory/transmission")).json();

    set((state) => ({
      ...state,
      transmissions: data,
    }));
  },
  getTrims: async () => {
    const data = await (await fetch("/api/inventory/trim")).json();

    set((state) => ({
      ...state,
      trims: data,
    }));
  },
  getTypes: async () => {
    const data = await (await fetch("/api/inventory/type")).json();

    set((state) => ({
      ...state,
      types: data,
    }));
  },
}));

// logic to handle the display of modal windows through the admin dashboard

interface ModalWindowStore {
  addNewReport: boolean;
  appointmentSystem: boolean;
  inventorySystem: boolean;
  clientSystem: boolean;
  clientDetail: boolean;
  clientDetailTasks: boolean;
  clientCobuyer: boolean;
  clientVehicle: boolean;
  clientFiles: boolean;
  clientReferrer: boolean;
  clientDuplicates: boolean;
  clientEvents: boolean;
  clientLead: boolean;
  clientCreditApp: boolean;
  customerList: boolean;
  newCustomersList: boolean;
  contactAttemptCustomersList: boolean;
  contactedCustomersList: boolean;
  creditAppCustomersList: boolean;
  showUpCustomersList: boolean;
  lostCustomersList: boolean;
  noShowUpCustomersList: boolean;
  soldCustomersList: boolean;
  depositCustomersList: boolean;
  deliveryCustomersList: boolean;
  undeliveredCustomersList: boolean;
  appointmentCustomersList: boolean;
  paidCustomersList: boolean;
  leadTemperature: boolean;
  deposit: boolean;
  taskDetail: boolean;
  completedTaskDetail: boolean;
  smsModal: boolean;
  emailModal: boolean;
  dailyAppointments: boolean;
  dailyCalls: boolean;
  addManagerTask: boolean;
  missingTasks: boolean;
  dailyMessages: boolean;
  dashboardSmsModal: boolean;
  dailyMadeCreditApp: boolean;
  workInprogress: boolean;
  settings: boolean;
  addNewUser: boolean;
  manageUsers: boolean;
  manageIntegrations: boolean;
  manageRoles: boolean;
  storeSettings: boolean;
  singleUser: boolean;
  addRole: boolean;
  singleRole: boolean;
  businessInfo: boolean;
  manageNotifications: boolean;
  reports: boolean;
  importData: boolean;
  exportData: boolean;
  createEmailView: boolean;
  editLetterhead: boolean;
  setUpADeal: boolean;
  dailySells: boolean;
  noteWindow: boolean;
  printingData: boolean;
  iconedSelectOptions: boolean;
  userInfoOptions: boolean;
  userNotifications: boolean;
  createCallendarAppointment: boolean;
  callendarAppointmentDetail: boolean;
  appointmentIdToDetail: string | null;
  profileOpenFromuUserOptions: boolean;
  appointmentSms: boolean;
  smsAndEmailFilter: boolean;
  smsAndEmailDateFilter: boolean;
  showCallModal: boolean;
  showAllIncomingCalls: boolean;
  showTransferOptions: boolean;
  showNotiOptions: boolean;
  showEmailModal: boolean;
  consentModal: boolean;
  openInNewTab: boolean;
  rescheduleSms: boolean;
  bulkSetUpADeal: boolean;
  massiveSms: boolean;
  reassignLeads: boolean;
  customerStatus: boolean;
  bulkLeadTemperature: boolean;
  bulkConsentSms: boolean;
  massiveEmails: boolean;
  systemAccesses: boolean;
  sendCreditApp: boolean;
  customerSettings: boolean;
  openCustomerSettingsFromConsentWindow: boolean;
  currentScrollTop: number;
  closeNewTab: boolean;
  loadingNewTab: boolean;
  pendingToFund: boolean;
  loadingCustomerDetail: boolean;
  setLoadingCustomerDetail: (val: boolean) => void;
  openClosePendingToFund: () => void;
  setLoadingNewTab: (val: boolean) => void;
  setCloseNewTab: (close: boolean) => void;
  setCurrentScrollTop: (scroll: number) => void;
  openCloseCustomerSettingsFromConsentWindow: () => void;
  openCloseCustomerSettings: () => void;
  openCloseSendCreditApp: () => void;
  openCloseSystemAccesses: () => void;
  openCloseMassiveEmails: () => void;
  openCloseBulkConsentSms: () => void;
  openCloseBulkTemperature: () => void;
  openCloseCustomerStatus: () => void;
  openCloseReassignLeads: () => void;
  openCloseMassiveSms: () => void;
  openCloseBulkSetUpADeal: () => void;
  openCloseRescheduleSms: () => void;
  toggleOpenInNewTab: (openInNewTab: boolean) => void;
  setShowConsentModal: (show: boolean) => void;
  setShowEmailModal: (show: boolean) => void;
  setShowNotiOptions: (show: boolean) => void;
  setShowTransferOptions: (show: boolean) => void;
  setShowAllIncomingCalls: (show: boolean) => void;
  setShowCallModal: (show: boolean) => void;
  openSmsAndEmailDateFilter: () => void;
  closeSmsAndEmailDateFilter: () => void;
  openSmsAndEmailFilter: () => void;
  closeSmsAndEmailFilter: () => void;
  openCloseAppointmentSms: () => void;
  openProfileOpenFromuUserOptions: () => void;
  closeProfileOpenFromuUserOptions: () => void;
  openCloseCallendarAppointmentDetail: (appointmentId?: string) => void;
  openCloseCreateCallendarAppointment: () => void;
  openCloseUserNotifications: () => void;
  closeUserNotifications: () => void;
  openCloseUserInfoOptions: () => void;
  closeUserInfoOptions: () => void;
  openCloseIconedSelectOptions: () => void;
  openIconedSelectOptions: () => void;
  closeIconedSelectOptions: () => Promise<void>;
  openClosePrintingData: () => void;
  openCloseNoteWindow: () => void;
  openDailySells: () => void;
  closeDailySells: () => void;
  openSetUpADeal: () => void;
  closeSetUpADeal: () => void;
  openEditLetterhead: () => void;
  closeEditLetterhead: () => void;
  openCreateEmailView: () => void;
  closeCreateEmailView: () => void;
  openExportData: () => void;
  closeExportData: () => void;
  openImportData: () => void;
  closeImportData: () => void;
  openReports: () => void;
  closeReports: () => void;
  openManageNotifications: () => void;
  closeManageNotifications: () => void;
  openBusinessInfo: () => void;
  closeBusinessInfo: () => void;
  openSingleRole: () => void;
  closeSingleRole: () => void;
  openAddRole: () => void;
  closeAddRole: () => void;
  openSingleUser: () => void;
  closeSingleUser: () => void;
  openStoreSettings: () => void;
  closeStoreSettings: () => void;
  openManageRoles: () => void;
  closeManageRoles: () => void;
  openManageIntegrations: () => void;
  closeManageIntegrations: () => void;
  openManageUsers: () => void;
  closeManageUsers: () => void;
  openAddNewUser: () => void;
  closeAddNewUser: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  openWorkInProgress: () => void;
  closeWorkInProgress: () => void;
  openDailyMadeCreditApp: () => void;
  closeDailyMadeCreditApp: () => void;
  openDashboardSmsModal: () => void;
  closeDashboardSmsModal: () => void;
  openDailyMessages: () => void;
  closeDailyMessages: () => void;
  openMissingTasks: () => void;
  closeMissingTasks: () => void;
  openAddManagerTask: () => void;
  closeAddManagerTask: () => void;
  openDailyCalls: () => void;
  closeDailyCalls: () => void;
  openDailyAppointments: () => void;
  closeDailyAppointments: () => void;
  openEmailModal: () => void;
  closeEmailModal: () => void;
  openSmsModal: () => void;
  closeSmsModal: () => void;
  openCompletedTaskDetail: () => void;
  closeCompletedTaskDetail: () => void;
  openDeposit: () => void;
  closeDeposit: () => void;
  openNewReport: () => void;
  closeNewReport: () => void;
  openAppointmentSystem: () => void;
  closeAppointmentSystem: () => void;
  openInventorySystem: () => void;
  closeInventorySystem: () => void;
  openClientSystem: () => void;
  closeClientSystem: () => void;
  openClientDetail: () => void;
  closeClientDetail: () => void;
  openCloseClientDetailTasks: (open: boolean) => void;
  openClientCobuyer: () => void;
  closeClientCobuyer: () => void;
  openClientVehicle: () => void;
  closeClientVehicle: () => void;
  openClientFiles: () => void;
  closeClientFiles: () => void;
  openClientReferrer: () => void;
  closeClientReferrer: () => void;
  openClientDuplicates: () => void;
  closeClientDuplicates: () => void;
  openClientEvents: () => void;
  closeClientEvents: () => void;
  openClientLead: () => void;
  closeClientLead: () => void;
  openClientCreditApp: () => void;
  closeClientCreditApp: () => void;
  openCustomerList: () => void;
  closeCustomerList: () => void;
  openNewCustomersList: () => void;
  closeNewCustomersList: () => void;
  openContactAttemptCustomersList: () => void;
  closeContactAttemptCustomersList: () => void;
  openContactedCustomersList: () => void;
  closeContactedCustomersList: () => void;
  openCreditAppCustomersList: () => void;
  closeCreditAppCustomersList: () => void;
  openShowUpCustomersList: () => void;
  closeShowUpCustomersList: () => void;
  openLostCustomersList: () => void;
  closeLostCustomersList: () => void;
  openNoShowUpCustomersList: () => void;
  closeNoShowUpCustomersList: () => void;
  openSoldCustomersList: () => void;
  closeSoldCustomersList: () => void;
  openDepositCustomersList: () => void;
  closeDepositCustomersList: () => void;
  openDeliveryCustomersList: () => void;
  closeDeliveryCustomersList: () => void;
  openUndeliveredCustomersList: () => void;
  closeUndeliveredCustomersList: () => void;
  openAppointmentCustomersList: () => void;
  closeAppointmentCustomersList: () => void;
  openPaidCustomersList: () => void;
  closePaidCustomersList: () => void;
  openLeadTemperature: () => void;
  closeLeadTemperature: () => void;
  openTaskDetail: () => void;
  closeTaskDetail: () => void;
}

export const modalWindowStore = create<ModalWindowStore>((set) => ({
  // state
  deposit: false,
  addNewReport: false,
  appointmentSystem: false,
  inventorySystem: false,
  clientSystem: false,
  clientDetail: false,
  clientCobuyer: false,
  clientVehicle: false,
  clientFiles: false,
  clientReferrer: false,
  clientDuplicates: false,
  clientEvents: false,
  clientLead: false,
  clientCreditApp: false,
  customerList: false,
  newCustomersList: false,
  contactAttemptCustomersList: false,
  contactedCustomersList: false,
  creditAppCustomersList: false,
  showUpCustomersList: false,
  lostCustomersList: false,
  noShowUpCustomersList: false,
  soldCustomersList: false,
  depositCustomersList: false,
  deliveryCustomersList: false,
  undeliveredCustomersList: false,
  appointmentCustomersList: false,
  paidCustomersList: false,
  leadTemperature: false,
  taskDetail: false,
  completedTaskDetail: false,
  smsModal: false,
  emailModal: false,
  dailyAppointments: false,
  dailyCalls: false,
  addManagerTask: false,
  missingTasks: false,
  dailyMessages: false,
  dashboardSmsModal: false,
  dailyMadeCreditApp: false,
  workInprogress: false,
  settings: false,
  addNewUser: false,
  manageUsers: false,
  manageIntegrations: false,
  manageRoles: false,
  storeSettings: false,
  singleUser: false,
  addRole: false,
  singleRole: false,
  businessInfo: false,
  manageNotifications: false,
  reports: false,
  importData: false,
  exportData: false,
  createEmailView: false,
  editLetterhead: false,
  setUpADeal: false,
  dailySells: false,
  noteWindow: false,
  printingData: false,
  iconedSelectOptions: false,
  userInfoOptions: false,
  userNotifications: false,
  createCallendarAppointment: false,
  callendarAppointmentDetail: false,
  appointmentIdToDetail: null,
  profileOpenFromuUserOptions: false,
  appointmentSms: false,
  smsAndEmailFilter: false,
  smsAndEmailDateFilter: false,
  showCallModal: false,
  showAllIncomingCalls: false,
  showTransferOptions: false,
  showNotiOptions: false,
  clientDetailTasks: false,
  showEmailModal: false,
  consentModal: false,
  openInNewTab: false,
  rescheduleSms: false,
  bulkSetUpADeal: false,
  massiveSms: false,
  reassignLeads: false,
  customerStatus: false,
  bulkLeadTemperature: false,
  bulkConsentSms: false,
  massiveEmails: false,
  systemAccesses: false,
  sendCreditApp: false,
  customerSettings: false,
  openCustomerSettingsFromConsentWindow: false,
  currentScrollTop: 0,
  closeNewTab: false,
  loadingNewTab: true,
  pendingToFund: false,
  loadingCustomerDetail: true,
  // setState
  setLoadingCustomerDetail: (val) => {
    set({ loadingCustomerDetail: val });
  },
  openClosePendingToFund: () => {
    set((prevState) => ({
      ...prevState,
      pendingToFund: !prevState.pendingToFund,
    }));
  },
  setLoadingNewTab: (val) => {
    set({ loadingNewTab: val });
  },
  setCloseNewTab: (close) => {
    set({ closeNewTab: close });
  },
  setCurrentScrollTop: (scroll) => {
    set({ currentScrollTop: scroll });
  },
  openCloseCustomerSettingsFromConsentWindow: () => {
    set((prevState) => ({
      ...prevState,
      openCustomerSettingsFromConsentWindow:
        !prevState.openCustomerSettingsFromConsentWindow,
    }));
  },
  openCloseCustomerSettings: () => {
    set((prevState) => ({
      ...prevState,
      customerSettings: !prevState.customerSettings,
    }));
  },
  openCloseSendCreditApp: () => {
    set((prevState) => ({
      ...prevState,
      sendCreditApp: !prevState.sendCreditApp,
    }));
  },
  openCloseSystemAccesses: () => {
    set((prevState) => ({
      ...prevState,
      systemAccesses: !prevState.systemAccesses,
    }));
  },
  openCloseMassiveEmails: () => {
    set((prevState) => ({
      ...prevState,
      massiveEmails: !prevState.massiveEmails,
    }));
  },
  openCloseBulkConsentSms: () => {
    set((prevState) => ({
      ...prevState,
      bulkConsentSms: !prevState.bulkConsentSms,
    }));
  },
  openCloseBulkTemperature: () => {
    set((prevState) => ({
      ...prevState,
      bulkLeadTemperature: !prevState.bulkLeadTemperature,
    }));
  },
  openCloseCustomerStatus: () => {
    set((prevState) => ({
      ...prevState,
      customerStatus: !prevState.customerStatus,
    }));
  },
  openCloseReassignLeads: () => {
    set((prevState) => ({
      ...prevState,
      reassignLeads: !prevState.reassignLeads,
    }));
  },
  openCloseMassiveSms: () => {
    set((prevState) => ({
      ...prevState,
      massiveSms: !prevState.massiveSms,
    }));
  },
  openCloseBulkSetUpADeal: () => {
    set((prevState) => ({
      ...prevState,
      bulkSetUpADeal: !prevState.bulkSetUpADeal,
    }));
  },
  openCloseRescheduleSms: () => {
    set((prevState) => ({
      ...prevState,
      rescheduleSms: !prevState.rescheduleSms,
    }));
  },
  toggleOpenInNewTab: (openInNewTab) => {
    set({ openInNewTab: openInNewTab });
  },
  setShowConsentModal: (show) => {
    set({ consentModal: show });
  },
  setShowEmailModal: (show) => {
    set({ showEmailModal: show });
  },
  openCloseClientDetailTasks: (open) => {
    set({ clientDetailTasks: open });
  },
  setShowNotiOptions: (show) => {
    set({ showNotiOptions: show });
  },
  setShowTransferOptions: (show) => {
    set({ showTransferOptions: show });
  },
  setShowAllIncomingCalls: (show) => {
    set({ showAllIncomingCalls: show });
  },
  setShowCallModal: (show) => {
    set({ showCallModal: show });
  },
  openSmsAndEmailDateFilter: () => {
    set((state) => ({
      ...state,
      smsAndEmailDateFilter: true,
    }));
  },
  closeSmsAndEmailDateFilter: () => {
    set((state) => ({
      ...state,
      smsAndEmailDateFilter: false,
    }));
  },
  openSmsAndEmailFilter: () => {
    set((state) => ({
      ...state,
      smsAndEmailFilter: true,
    }));
  },
  closeSmsAndEmailFilter: () => {
    set((state) => ({
      ...state,
      smsAndEmailFilter: false,
    }));
  },
  openCloseAppointmentSms: () => {
    set((state) => ({
      ...state,
      appointmentSms: !state.appointmentSms,
    }));
  },
  openProfileOpenFromuUserOptions: () => {
    set((state) => ({
      ...state,
      profileOpenFromuUserOptions: true,
    }));
  },
  closeProfileOpenFromuUserOptions: () => {
    set((state) => ({
      ...state,
      profileOpenFromuUserOptions: false,
    }));
  },
  openCloseCallendarAppointmentDetail: (appointmentId) => {
    set((state) => ({
      ...state,
      callendarAppointmentDetail: !state.callendarAppointmentDetail,
      appointmentIdToDetail: appointmentId || null,
    }));
  },
  openCloseCreateCallendarAppointment: () => {
    set((state) => ({
      ...state,
      createCallendarAppointment: !state.createCallendarAppointment,
    }));
  },
  openCloseUserNotifications: () => {
    set((state) => ({
      ...state,
      userNotifications: !state.userNotifications,
    }));
  },
  closeUserNotifications: () => {
    set((state) => ({
      ...state,
      userNotifications: false,
    }));
  },
  openCloseUserInfoOptions: () => {
    set((state) => ({
      ...state,
      userInfoOptions: !state.userInfoOptions,
    }));
  },
  closeUserInfoOptions: () => {
    set((state) => ({
      ...state,
      userInfoOptions: false,
    }));
  },
  openCloseIconedSelectOptions: () => {
    set((state) => ({
      ...state,
      iconedSelectOptions: !state.iconedSelectOptions,
    }));
  },
  openIconedSelectOptions: () => {
    set((state) => ({
      ...state,
      iconedSelectOptions: true,
    }));
  },
  closeIconedSelectOptions: async () => {
    set((state) => ({
      ...state,
      iconedSelectOptions: false,
    }));
  },
  openClosePrintingData: () => {
    set((state) => ({
      ...state,
      printingData: !state.printingData,
    }));
  },
  openCloseNoteWindow: () => {
    set((state) => ({
      ...state,
      noteWindow: !state.noteWindow,
    }));
  },
  openDailySells: () => {
    set((state) => ({
      ...state,
      dailySells: true,
    }));
  },
  closeDailySells: () => {
    set((state) => ({
      ...state,
      dailySells: false,
    }));
  },
  openSetUpADeal: () => {
    set((state) => ({
      ...state,
      setUpADeal: true,
    }));
  },
  closeSetUpADeal: () => {
    set((state) => ({
      ...state,
      setUpADeal: false,
    }));
  },
  openEditLetterhead: () => {
    set((state) => ({
      ...state,
      editLetterhead: true,
    }));
  },
  closeEditLetterhead: () => {
    set((state) => ({
      ...state,
      editLetterhead: false,
    }));
  },
  openCreateEmailView: () => {
    set((state) => ({
      ...state,
      createEmailView: true,
    }));
  },
  closeCreateEmailView: () => {
    set((state) => ({
      ...state,
      createEmailView: false,
    }));
  },
  openExportData: () => {
    set((state) => ({
      ...state,
      exportData: true,
    }));
  },
  closeExportData: () => {
    set((state) => ({
      ...state,
      exportData: false,
    }));
  },
  openImportData: () => {
    set((state) => ({
      ...state,
      importData: true,
    }));
  },
  closeImportData: () => {
    set((state) => ({
      ...state,
      importData: false,
    }));
  },
  openReports: () => {
    set((state) => ({
      ...state,
      reports: true,
    }));
  },
  closeReports: () => {
    set((state) => ({
      ...state,
      reports: false,
    }));
  },
  openManageNotifications: () => {
    set((state) => ({
      ...state,
      manageNotifications: true,
    }));
  },
  closeManageNotifications: () => {
    set((state) => ({
      ...state,
      manageNotifications: false,
    }));
  },
  openBusinessInfo: () => {
    set((state) => ({
      ...state,
      businessInfo: true,
    }));
  },
  closeBusinessInfo: () => {
    set((state) => ({
      ...state,
      businessInfo: false,
    }));
  },
  openSingleRole: () => {
    set((state) => ({
      ...state,
      singleRole: true,
    }));
  },
  closeSingleRole: () => {
    set((state) => ({
      ...state,
      singleRole: false,
    }));
  },
  openAddRole: () => {
    set((state) => ({
      ...state,
      addRole: true,
    }));
  },
  closeAddRole: () => {
    set((state) => ({
      ...state,
      addRole: false,
    }));
  },
  openSingleUser: () => {
    set((state) => ({
      ...state,
      singleUser: true,
    }));
  },
  closeSingleUser: () => {
    set((state) => ({
      ...state,
      singleUser: false,
    }));
  },
  openStoreSettings: () => {
    set((state) => ({
      ...state,
      storeSettings: true,
    }));
  },
  closeStoreSettings: () => {
    set((state) => ({
      ...state,
      storeSettings: false,
    }));
  },
  openManageRoles: () => {
    set((state) => ({
      ...state,
      manageRoles: true,
    }));
  },
  closeManageRoles: () => {
    set((state) => ({
      ...state,
      manageRoles: false,
    }));
  },
  openManageIntegrations: () => {
    set((state) => ({
      ...state,
      manageIntegrations: true,
    }));
  },
  closeManageIntegrations: () => {
    set((state) => ({
      ...state,
      manageIntegrations: false,
    }));
  },
  openManageUsers: () => {
    set((state) => ({
      ...state,
      manageUsers: true,
    }));
  },
  closeManageUsers: () => {
    set((state) => ({
      ...state,
      manageUsers: false,
    }));
  },
  openAddNewUser: () => {
    set((state) => ({
      ...state,
      addNewUser: true,
    }));
  },
  closeAddNewUser: () => {
    set((state) => ({
      ...state,
      addNewUser: false,
    }));
  },
  openSettings: () => {
    set((state) => ({
      ...state,
      settings: true,
    }));
  },
  closeSettings: () => {
    set((state) => ({
      ...state,
      settings: false,
    }));
  },
  openWorkInProgress: () => {
    set((state) => ({
      ...state,
      workInprogress: true,
    }));
  },
  closeWorkInProgress: () => {
    set((state) => ({
      ...state,
      workInprogress: false,
    }));
  },
  openDailyMadeCreditApp: () => {
    set((state) => ({
      ...state,
      dailyMadeCreditApp: true,
    }));
  },
  closeDailyMadeCreditApp: () => {
    set((state) => ({
      ...state,
      dailyMadeCreditApp: false,
    }));
  },
  openDashboardSmsModal: () => {
    set((state) => ({
      ...state,
      dashboardSmsModal: true,
    }));
  },
  closeDashboardSmsModal: () => {
    set((state) => ({
      ...state,
      dashboardSmsModal: false,
    }));
  },
  openDailyMessages: () => {
    set((state) => ({
      ...state,
      dailyMessages: true,
    }));
  },
  closeDailyMessages: () => {
    set((state) => ({
      ...state,
      dailyMessages: false,
    }));
  },
  openMissingTasks: () => {
    set((state) => ({
      ...state,
      missingTasks: true,
    }));
  },
  closeMissingTasks: () => {
    set((state) => ({
      ...state,
      missingTasks: false,
    }));
  },
  openAddManagerTask: () => {
    set((state) => ({
      ...state,
      addManagerTask: true,
    }));
  },
  closeAddManagerTask: () => {
    set((state) => ({
      ...state,
      addManagerTask: false,
    }));
  },
  openDailyCalls: () => {
    set((state) => ({
      ...state,
      dailyCalls: true,
    }));
  },
  closeDailyCalls: () => {
    set((state) => ({
      ...state,
      dailyCalls: false,
    }));
  },
  openDailyAppointments: () => {
    set((state) => ({
      ...state,
      dailyAppointments: true,
    }));
  },
  closeDailyAppointments: () => {
    set((state) => ({
      ...state,
      dailyAppointments: false,
    }));
  },
  openEmailModal: () => {
    set((state) => ({
      ...state,
      emailModal: true,
    }));
  },
  closeEmailModal: () => {
    set((state) => ({
      ...state,
      emailModal: false,
    }));
  },
  openSmsModal: () => {
    set((state) => ({
      ...state,
      smsModal: true,
    }));
  },
  closeSmsModal: () => {
    set((state) => ({
      ...state,
      smsModal: false,
    }));
  },
  openCompletedTaskDetail: () => {
    set((state) => ({
      ...state,
      completedTaskDetail: true,
    }));
  },
  closeCompletedTaskDetail: () => {
    set((state) => ({
      ...state,
      completedTaskDetail: false,
    }));
  },
  openTaskDetail: () => {
    set((state) => ({
      ...state,
      taskDetail: true,
    }));
  },
  closeTaskDetail: () => {
    set((state) => ({
      ...state,
      taskDetail: false,
    }));
  },
  openDeposit: () => {
    set((state) => ({
      ...state,
      deposit: true,
    }));
  },
  closeDeposit: () => {
    set((state) => ({
      ...state,
      deposit: false,
    }));
  },
  openLeadTemperature: () => {
    set((state) => ({
      ...state,
      leadTemperature: true,
    }));
  },
  closeLeadTemperature: () => {
    set((state) => ({
      ...state,
      leadTemperature: false,
    }));
  },
  openNewReport: () => {
    set((state) => ({
      ...state,
      addNewReport: true,
    }));
  },
  closeNewReport: () => {
    set((state) => ({
      ...state,
      addNewReport: false,
    }));
  },
  openAppointmentSystem: () => {
    set((state) => ({
      ...state,
      appointmentSystem: true,
    }));
  },
  closeAppointmentSystem: () => {
    set((state) => ({
      ...state,
      appointmentSystem: false,
    }));
  },
  openInventorySystem: () => {
    set((state) => ({
      ...state,
      inventorySystem: true,
    }));
  },
  closeInventorySystem: () => {
    set((state) => ({
      ...state,
      inventorySystem: false,
    }));
  },
  openClientSystem: () => {
    set((state) => ({
      ...state,
      clientSystem: true,
    }));
  },
  closeClientSystem: () => {
    set((state) => ({
      ...state,
      clientSystem: false,
    }));
  },
  openClientDetail: () => {
    set((state) => ({
      ...state,
      clientDetail: true,
    }));
  },
  closeClientDetail: () => {
    set((state) => ({
      ...state,
      clientDetail: false,
    }));
  },
  openClientCobuyer: () => {
    set((state) => ({
      ...state,
      clientCobuyer: true,
    }));
  },
  closeClientCobuyer: () => {
    set((state) => ({
      ...state,
      clientCobuyer: false,
    }));
  },
  openClientVehicle: () => {
    set((state) => ({
      ...state,
      clientVehicle: true,
    }));
  },
  closeClientVehicle: () => {
    set((state) => ({
      ...state,
      clientVehicle: false,
    }));
  },
  openClientFiles: () => {
    set((state) => ({
      ...state,
      clientFiles: true,
    }));
  },
  closeClientFiles: () => {
    set((state) => ({
      ...state,
      clientFiles: false,
    }));
  },
  openClientReferrer: () => {
    set((state) => ({
      ...state,
      clientReferrer: true,
    }));
  },
  closeClientReferrer: () => {
    set((state) => ({
      ...state,
      clientReferrer: false,
    }));
  },
  openClientDuplicates: () => {
    set((state) => ({
      ...state,
      clientDuplicates: true,
    }));
  },
  closeClientDuplicates: () => {
    set((state) => ({
      ...state,
      clientDuplicates: false,
    }));
  },
  openClientEvents: () => {
    set((state) => ({
      ...state,
      clientEvents: true,
    }));
  },
  closeClientEvents: () => {
    set((state) => ({
      ...state,
      clientEvents: false,
    }));
  },
  openClientLead: () => {
    set((state) => ({
      ...state,
      clientLead: true,
    }));
  },
  closeClientLead: () => {
    set((state) => ({
      ...state,
      clientLead: false,
    }));
  },
  openClientCreditApp: () => {
    set((state) => ({
      ...state,
      clientCreditApp: true,
    }));
  },
  closeClientCreditApp: () => {
    set((state) => ({
      ...state,
      clientCreditApp: false,
    }));
  },
  openCustomerList: () => {
    set((state) => ({
      ...state,
      customerList: true,
    }));
  },
  closeCustomerList: () => {
    set((state) => ({
      ...state,
      customerList: false,
    }));
  },
  openNewCustomersList: () => {
    set(() => ({
      newCustomersList: true,
    }));
  },
  closeNewCustomersList: () => {
    set(() => ({
      newCustomersList: false,
    }));
  },
  openContactAttemptCustomersList: () => {
    set(() => ({
      contactAttemptCustomersList: true,
    }));
  },
  closeContactAttemptCustomersList: () => {
    set(() => ({
      contactAttemptCustomersList: false,
    }));
  },
  openContactedCustomersList: () => {
    set(() => ({
      contactedCustomersList: true,
    }));
  },
  closeContactedCustomersList: () => {
    set(() => ({
      contactedCustomersList: false,
    }));
  },
  openCreditAppCustomersList: () => {
    set(() => ({
      creditAppCustomersList: true,
    }));
  },
  closeCreditAppCustomersList: () => {
    set(() => ({
      creditAppCustomersList: false,
    }));
  },
  openShowUpCustomersList: () => {
    set(() => ({
      showUpCustomersList: true,
    }));
  },
  closeShowUpCustomersList: () => {
    set(() => ({
      showUpCustomersList: false,
    }));
  },
  openLostCustomersList: () => {
    set(() => ({
      lostCustomersList: true,
    }));
  },
  closeLostCustomersList: () => {
    set(() => ({
      lostCustomersList: false,
    }));
  },
  openNoShowUpCustomersList: () => {
    set(() => ({
      noShowUpCustomersList: true,
    }));
  },
  closeNoShowUpCustomersList: () => {
    set(() => ({
      noShowUpCustomersList: false,
    }));
  },
  openSoldCustomersList: () => {
    set(() => ({
      soldCustomersList: true,
    }));
  },
  closeSoldCustomersList: () => {
    set(() => ({
      soldCustomersList: false,
    }));
  },
  openDepositCustomersList: () => {
    set(() => ({
      depositCustomersList: true,
    }));
  },
  closeDepositCustomersList: () => {
    set(() => ({
      depositCustomersList: false,
    }));
  },
  openDeliveryCustomersList: () => {
    set(() => ({
      deliveryCustomersList: true,
    }));
  },
  closeDeliveryCustomersList: () => {
    set(() => ({
      deliveryCustomersList: false,
    }));
  },
  openUndeliveredCustomersList: () => {
    set(() => ({
      undeliveredCustomersList: true,
    }));
  },
  closeUndeliveredCustomersList: () => {
    set(() => ({
      undeliveredCustomersList: false,
    }));
  },
  openAppointmentCustomersList: () => {
    set(() => ({
      appointmentCustomersList: true,
    }));
  },
  closeAppointmentCustomersList: () => {
    set(() => ({
      appointmentCustomersList: false,
    }));
  },
  openPaidCustomersList: () => {
    set(() => ({
      paidCustomersList: true,
    }));
  },
  closePaidCustomersList: () => {
    set(() => ({
      paidCustomersList: false,
    }));
  },
}));

// logic to handle the current new prospect data for showing in client detail window

interface CurrentNewProspectData {
  currentNewProspect: NewProspect;
  getCurrentNewProspect: (currentNewProspect: NewProspect) => void;
}

export const newProspectStore = create<CurrentNewProspectData>((set) => ({
  currentNewProspect: {},
  getCurrentNewProspect: (currentNewProspect: NewProspect) => {
    set((state) => ({
      ...state,
      currentNewProspect,
    }));
  },
}));

// logic to handle single client data

interface SingleClientData {
  singleCLientData: SingleClient;
  currentController: AbortController | null;
  getSingleClientData: (id: string, leadId?: string | number) => Promise<void>;
  clearSingleClientData: () => void;
}

export const singleCLientDataStore = create<SingleClientData>((set, get) => ({
  singleCLientData: undefined,
  currentController: null,
  getSingleClientData: async (id: string, leadId) => {
    const previousController = get().currentController;

    if (previousController) {
      previousController.abort();
    }

    if (id === "clear" || id === "") {
      set({ singleCLientData: undefined, currentController: null });
      return;
    }

    const controller = new AbortController();
    set({ currentController: controller });

    try {
      const response = await fetch(
        `/api/adminDashboard/singleClient/${id}${leadId ? `?leadId=${leadId}` : ""}`,
        { signal: controller.signal },
      );

      if (!response.ok) throw new Error("Fetching error");

      const singleCLient: SingleClient = await response.json();

      set({
        singleCLientData: singleCLient,
        currentController: null,
      });
    } catch (error: any) {
      if (error.name === "AbortError") {
      } else {
        console.error("Error en fetch:", error);
        set({ currentController: null });
      }
    }
  },
  clearSingleClientData: () => {
    const controller = get().currentController;
    if (controller) controller.abort();
    set({ singleCLientData: undefined, currentController: null });
  },
}));

// logic to handle referrer/cobuyer single client data

interface CobuyerReferrerSingleClientData {
  cobuyerReferrerSingleCLientData: SingleClient;
  getCobuyerReferrerSingleClientData: (id: string) => Promise<void>;
}

export const cobuyerReferrerSingleCLientDataStore =
  create<CobuyerReferrerSingleClientData>((set) => ({
    cobuyerReferrerSingleCLientData: undefined,
    getCobuyerReferrerSingleClientData: async (id: string) => {
      if (id != "clear" && id != "") {
        console.log("Buscando!");

        const singleCLient: SingleClient = await (
          await fetch(`/api/adminDashboard/cobuyerReferrerSingleClient/${id}`, {
            method: "GET",
          })
        ).json();

        set((state) => ({
          ...state,
          cobuyerReferrerSingleCLientData: singleCLient,
        }));
      }
      if (id == "clear") {
        set((state) => ({
          ...state,
          cobuyerReferrerSingleCLientData: undefined,
        }));
      }
    },
  }));

// logic to handle the updating of a client

interface UpdateClientData {
  updateClientData: boolean;
  doUpdateClient: ({}: SingleClient, clear?: boolean) => Promise<void>;
}

export const updateClientDataStore = create<UpdateClientData>((set) => ({
  updateClientData: false,
  doUpdateClient: async (data: SingleClient, clear?: boolean) => {
    let doUpdate: boolean | null = null;

    if (clear) {
      doUpdate = false;
    } else if (data) {
      const doUpdateFetch = await (
        await fetch(`/api/adminDashboard/singleClient/${data.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        })
      ).json();

      doUpdate = doUpdateFetch ? true : false;
    }

    set((state) => ({
      ...state,
      updateClientData: doUpdate ? true : false,
    }));
  },
}));

// logic to handle the deleting of a client

interface DeleteClient {
  deleteResponse: null;
  doDeleteClient: (id: string) => Promise<void>;
  clearDeleteResponse: () => void;
}

export const deleteClientStore = create<DeleteClient>((set) => ({
  deleteResponse: null,
  doDeleteClient: async (id: string) => {
    const { setMessages } = messagesStore.getState();
    const { updateDataWithSocket } = useSocketStore.getState();

    try {
      const doDelete = await (
        await fetch(`/api/adminDashboard/singleClient/${id}`, {
          method: "DELETE",
        })
      ).json();

      setMessages(undefined, "Customer Successfully Deleted");

      set((state) => ({
        ...state,
        deleteResponse: doDelete,
      }));

      updateDataWithSocket("customersList");
    } catch (error) {
      setMessages("An error occurred");
    }
  },
  clearDeleteResponse: () => {
    set((state) => ({
      ...state,
      deleteResponse: null,
    }));
  },
}));

// logic to handle the client messages

interface ClientMessages {
  clientMessages: SingleClientMessages;
  dailyMessages: DailyMessagesData;
  waitingSendCurrentMessage:
    | {
        id: number;
        message: string;
        name: string;
        date: Date;
        sentByUser: boolean;
        files: File[] | null | undefined;
      }[]
    | undefined;
  allClientsMessages: AllSms;
  setWaitingSendCurrentMessage: (
    id: number,
    message: string,
    name: string,
    date: Date,
    sentByUser: boolean,
    files: File[] | null | undefined,
  ) => void;
  getDailyMessages: (userId: number) => Promise<void>;
  clearWaitingSendCurrentMessage: () => void;
  getAllClientsMessages: () => Promise<void>;
  getClientMessages: (clientId: number) => Promise<void>;
  getClientMessagesByPhoneNumber: (phoneNumber: string) => Promise<void>;
  clearClientMessages: () => void;
  setMessagesStatusToRead: (
    customerId?: number,
    readBy?: number,
  ) => Promise<void>;
}

export const clientMessagesStore = create<ClientMessages>((set) => ({
  allClientsMessages: undefined,
  clientMessages: undefined,
  waitingSendCurrentMessage: undefined,
  dailyMessages: [],
  getDailyMessages: async (userId) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const data = await (
      await fetch(
        `/api/adminDashboard/dailyMessages/${userId}?timezone=${encodeURIComponent(timeZone)}`,
        {
          cache: "no-store",
        },
      )
    ).json();

    set((state) => ({
      ...state,
      dailyMessages: data,
    }));
  },
  setWaitingSendCurrentMessage: (
    id,
    message,
    name,
    date,
    sentByUser,
    files = null,
  ) => {
    const waitingObject: {
      id: number;
      message: string;
      name: string;
      date: Date;
      sentByUser: boolean;
      files: File[] | null | undefined;
    }[] = [];

    waitingObject.push({
      date,
      id,
      message,
      name,
      sentByUser,
      files,
    });

    set((state) => ({
      ...state,
      waitingSendCurrentMessage: waitingObject,
    }));
  },
  clearWaitingSendCurrentMessage: () => {
    set({ waitingSendCurrentMessage: undefined });
  },
  getAllClientsMessages: async () => {
    const allSms = await (
      await fetch("/api/message", { cache: "no-store" })
    ).json();

    set((state) => ({
      ...state,
      allClientsMessages: allSms,
    }));
  },
  getClientMessages: async (clientId: number) => {
    const data = await (await fetch(`/api/message/v2/${clientId}`)).json();

    set((state) => ({
      ...state,
      clientMessages: data,
    }));
  },
  getClientMessagesByPhoneNumber: async (phoneNumber: string) => {
    const data = await (await fetch(`/api/message/${phoneNumber}`)).json();

    set((state) => ({
      ...state,
      clientMessages: data,
    }));
  },
  clearClientMessages: () => {
    set({ clientMessages: [] });
  },
  setMessagesStatusToRead: async (customerId, readBy) => {
    if (customerId && readBy) {
      const data = await (
        await fetch(`/api/message/status/${customerId}_${readBy}`, {
          method: "PUT",
        })
      ).json();

      set((state) => ({
        ...state,
        allClientsMessages: state.allClientsMessages?.map((message) =>
          message.client_id === customerId
            ? { ...message, total_no_read_messages: 0 }
            : message,
        ),
      }));
    }
  },
}));

// logic to handle client detail lead

interface LeadSelectedOptions {
  lead: String;
  follow_up_date: Date | null;
  assigned_to: String;
  note: String;
  reminder_time: Date | null;
  appointment: {
    seller_id: string;
    client_id: string;
    start: Date;
    end: Date;
  } | null;
  incoming: Boolean;
  outcoming: Boolean;
  dealtime: Date | null;
  setSelctedOptions: (opt: {
    lead?: string;
    followDate?: Date;
    assignedTo?: string;
    appointment?: any;
    dealtime?: Date;
    incoming?: boolean;
    outcoming?: boolean;
    note?: string;
    reminderTime?: Date;
  }) => void;
}

export const clientDetailSelectedOptionsStore = create<LeadSelectedOptions>(
  (set) => ({
    lead: "",
    follow_up_date: null,
    assigned_to: "",
    appointment: null,
    dealtime: null,
    incoming: false,
    outcoming: false,
    note: "",
    reminder_time: null,
    setSelctedOptions: (opt: {
      lead?: string;
      followDate?: Date;
      assignedTo?: string;
      appointment?: any;
      dealtime?: Date;
      incoming?: boolean;
      outcoming?: boolean;
      note?: string;
      reminderTime?: Date;
    }) => {
      set((state) => ({
        ...state,
        lead: opt.lead,
        follow_up_date: opt.followDate,
        assigned_to: opt.assignedTo,
        appointment: opt.appointment,
        dealtime: opt.dealtime,
        incoming: opt.incoming,
        outcoming: opt.outcoming,
        note: opt.note,
        reminder_time: opt.reminderTime,
      }));
    },
  }),
);

// logic to handle credit app

interface CreditAppInputs {
  creditAppStartData: CreditAppStart;
  startInputs?: {
    ssn?: string;
    date_of_birth?: Date;
    id_type?: string;
    id_state?: string;
    id_number?: string;
    id_issue_date?: Date;
    id_exp_date?: Date;
    gender?: string;
    consent?: boolean;
    cashdown?: string;
  };
  addressInputs?: AddressInputs;
  setSsn: (ssn?: string) => void;
  setDateBirth: (dateBirth?: Date) => void;
  setIdType: (idType?: string) => void;
  setIdState: (IdState?: string) => void;
  setIdNumber: (IdNumber?: string) => void;
  setDateIssue: (dateIssue?: Date) => void;
  setDateExp: (dateExp?: Date) => void;
  setGender: (gender?: string) => void;
  setConsent: (consent?: boolean) => void;
  setCashdown: (cashdown?: string) => void;
  setAddress: (
    address: {
      id?: string;
      currentAddress?: string;
      currentStreet?: string;
      currentCity?: string;
      currentState?: string;
      currentState_id?: string;
      currentZip?: string;
      currentCounty?: string;
      currentYear?: string;
      currentMonth?: string;
      currentType?: string;
      currentRent?: string;
      mailingAddress?: string;
      mailingStreet?: string;
      mailingCity?: string;
      mailingState?: string;
      mailingState_id?: string;
      mailingZip?: string;
      mailingCounty?: string;
      prevAddress?: string;
      prevStreet?: string;
      prevCity?: string;
      prevState?: string;
      prevState_id?: string;
      prevZip?: string;
      prevCounty?: string;
      prevYear?: string;
      prevMonth?: string;
      prevType?: string;
      prevRent?: string;
    }[],
  ) => void;
  clearCreditAppInputs: () => void;
  clearCreditAppStart: () => void;
  getCreditApp: (id: number) => Promise<void>;
  getCreditAppAddress: (id: number) => Promise<void>;
}

export const creditAppInputsStore = create<CreditAppInputs>((set) => ({
  creditAppStartData: undefined,
  startInputs: {
    ssn: undefined,
    date_of_birth: undefined,
    id_type: undefined,
    id_state: undefined,
    id_number: undefined,
    id_issue_date: undefined,
    id_exp_date: undefined,
    gender: undefined,
    consent: undefined,
    cashdown: undefined,
  },
  addressInputs: undefined,
  getCreditApp: async (id: number) => {
    const creditApp = await (
      await fetch(`/api/adminDashboard/creditApp/start/${id}`)
    ).json();

    set((state) => ({
      ...state,
      creditAppStartData: creditApp,
    }));
  },
  getCreditAppAddress: async (id: number) => {
    const address = await (
      await fetch(`/api/adminDashboard/creditApp/address/${id}`)
    ).json();

    set(() => ({
      addressInputs: address,
    }));
  },
  setSsn: (ssn?: string) => {
    set((state) => ({
      startInputs: {
        ...state.startInputs,
        ssn,
      },
    }));
  },
  setConsent: (consent?: boolean) => {
    set((state) => ({
      startInputs: {
        ...state.startInputs,
        consent,
      },
    }));
  },
  setDateBirth: (dateBirth?: Date) => {
    dateBirth &&
      set((state) => ({
        startInputs: {
          ...state.startInputs,
          date_of_birth: new Date(dateBirth),
        },
      }));
  },
  setIdType: (idType?: string) => {
    set((state) => ({
      startInputs: {
        ...state.startInputs,
        id_type: idType,
      },
    }));
  },
  setIdState: (IdState?: string) => {
    set((state) => ({
      startInputs: {
        ...state.startInputs,
        id_state: IdState,
      },
    }));
  },
  setIdNumber: (IdNumber?: string) => {
    set((state) => ({
      startInputs: {
        ...state.startInputs,
        id_number: IdNumber,
      },
    }));
  },
  setDateIssue: (dateIssue?: Date) => {
    dateIssue &&
      set((state) => ({
        startInputs: {
          ...state.startInputs,
          id_issue_date: new Date(dateIssue),
        },
      }));
  },
  setDateExp: (dateExp?: Date) => {
    dateExp &&
      set((state) => ({
        startInputs: {
          ...state.startInputs,
          id_exp_date: new Date(dateExp),
        },
      }));
  },
  setGender: (gender?: string) => {
    set((state) => ({
      startInputs: {
        ...state.startInputs,
        gender,
      },
    }));
  },
  setCashdown: (cashdown?: string) => {
    set((state) => ({
      startInputs: {
        ...state.startInputs,
        cashdown,
      },
    }));
  },
  setAddress: (address: any) => {
    set(() => ({
      addressInputs: address,
    }));
  },
  clearCreditAppInputs: () => {
    set(() => ({
      startInputs: {
        cashdown: undefined,
        consent: undefined,
        date_of_birth: undefined,
        gender: undefined,
        id_exp_date: undefined,
        id_issue_date: undefined,
        id_number: undefined,
        id_state: undefined,
        id_type: undefined,
        ssn: undefined,
      },
    }));
  },
  clearCreditAppStart: () => {
    set((state) => ({
      creditAppStartData: {},
    }));
  },
}));

// referrer / cobuyer states

interface CobuyerReferrer {
  isCobuyerReferrer: boolean;
  newCobuyerReferrer: NewCobuyerReferrer;
  setCobuyerReferrerTrue: () => void;
  setCobuyerReferrerFalse: () => void;
  getNewCobuyerReferrer: (data: NewCobuyerReferrer) => void;
  clearNewCobuyerReferrer: () => void;
}

export const cobuyerReferrerStore = create<CobuyerReferrer>((set) => ({
  isCobuyerReferrer: false,
  newCobuyerReferrer: undefined,
  clearNewCobuyerReferrer: () => {
    set(() => ({
      newCobuyerReferrer: undefined,
    }));
  },
  getNewCobuyerReferrer: (data: NewCobuyerReferrer) => {
    set({ newCobuyerReferrer: data });
  },
  setCobuyerReferrerTrue: () => {
    set(() => ({
      isCobuyerReferrer: true,
    }));
  },
  setCobuyerReferrerFalse: () => {
    set(() => ({
      isCobuyerReferrer: false,
    }));
  },
}));

// credit app address

interface CreditAppAddress {
  currentAddressForm: {
    id?: string;
    currentAddress?: string;
    currentYear?: string;
    currentMonthId?: string;
    currentAddressTypeId?: string;
    currentRentMort?: string;
    currentStreet?: string;
    currentCity?: string;
    currentState?: string;
    currentStateId?: string;
    currentZip?: string;
    currentCounty?: string;
    mailingAddress?: string;
    mailingStreet?: string;
    mailingCity?: string;
    mailingState?: string;
    mailingStateId?: string;
    mailingZip?: string;
    mailingCounty?: string;
  };
}

interface CreditAppAddressState extends CreditAppAddress {
  updateCurrentAddress: (key: string, value: string) => void;
}

const states = [
  { id: 1, state: "Alabama" },
  { id: 2, state: "Alaska" },
  { id: 3, state: "Arizona" },
  { id: 4, state: "Arkansas" },
  { id: 5, state: "California" },
  { id: 6, state: "Colorado" },
  { id: 7, state: "Connecticut" },
  { id: 8, state: "Dsitrict of Columbia" },
  { id: 9, state: "Delaware" },
  { id: 10, state: "Florida" },
  { id: 11, state: "Georgia" },
  { id: 12, state: "Hawaii" },
  { id: 13, state: "Idaho" },
  { id: 14, state: "Illinois" },
  { id: 15, state: "Indiana" },
  { id: 16, state: "Indiana" },
  { id: 17, state: "Iowa" },
  { id: 18, state: "Kansas" },
  { id: 19, state: "Kentucky" },
  { id: 20, state: "Louisiana" },
  { id: 21, state: "Maine" },
  { id: 22, state: "Maryland" },
  { id: 23, state: "Massachusetts" },
  { id: 24, state: "Michigan" },
  { id: 25, state: "Minnesota" },
  { id: 26, state: "Mississippi" },
  { id: 27, state: "Missouri" },
  { id: 28, state: "Montana" },
  { id: 29, state: "Nebraska" },
  { id: 30, state: "Nevada" },
  { id: 31, state: "New Hampshire" },
  { id: 32, state: "New Jersey" },
  { id: 33, state: "New Mexico" },
  { id: 34, state: "New York" },
  { id: 35, state: "North Carolina" },
  { id: 36, state: "North Dakota" },
  { id: 37, state: "Ohio" },
  { id: 38, state: "Oklahoma" },
  { id: 39, state: "Oregon" },
  { id: 40, state: "Pennsylvania" },
  { id: 41, state: "Rhode Island" },
  { id: 42, state: "South Carolina" },
  { id: 43, state: "South Dakota" },
  { id: 44, state: "Tennessee" },
  { id: 45, state: "Texas" },
  { id: 46, state: "Utah" },
  { id: 47, state: "Vermont" },
  { id: 48, state: "Virginia" },
  { id: 49, state: "Washington" },
  { id: 50, state: "West Virginia" },
  { id: 51, state: "Wisconsin" },
  { id: 52, state: "Wyoming" },
];

export const creditAppAddressStore = create<CreditAppAddressState>((set) => ({
  currentAddressForm: {
    id: "",
    currentAddress: "",
    showCurrentAddressOptions: false,
    currentYear: "0",
    currentMonthId: "1",
    currentAddressTypeId: "",
    currentRentMort: "",
    currentStreet: "",
    currentCity: "",
    currentState: "",
    currentStateId: "",
    currentZip: "",
    currentCounty: "",
    mailingAddress: "",
    showMailingAddressOptions: false,
    mailingStreet: "",
    mailingCity: "",
    mailingState: "",
    mailingStateId: "",
    mailingZip: "",
    mailingCounty: "",
  },
  updateCurrentAddress: (key, value) =>
    set((state) => {
      const updatedForm = {
        ...state.currentAddressForm,
        [key]: value,
      };

      if (
        [
          "currentStreet",
          "currentCity",
          "currentStateId",
          "currentZip",
          "currentCounty",
        ].includes(key)
      ) {
        updatedForm.currentAddress = [
          updatedForm.currentStreet,
          updatedForm.currentCity,
          updatedForm.currentStateId &&
            states[parseInt(updatedForm.currentStateId) - 1].state,
          updatedForm.currentZip,
          updatedForm.currentCounty,
        ]
          .filter(Boolean)
          .join(", ");
      }

      if (
        [
          "mailingStreet",
          "mailingCity",
          "mailingState",
          "mailingZip",
          "mailingCounty",
        ].includes(key)
      ) {
        updatedForm.mailingAddress = [
          updatedForm.mailingStreet,
          updatedForm.mailingCity,
          updatedForm.mailingState,
          updatedForm.mailingZip,
          updatedForm.mailingCounty,
        ]
          .filter(Boolean)
          .join(", ");
      }

      return { currentAddressForm: updatedForm };
    }),
}));

// previous address

interface PreviousAddressForm {
  id?: string;
  prevAddress?: string;
  prevYear?: string;
  prevMonthId?: string;
  prevAddressTypeId?: string;
  prevRentMort?: string;
  prevStreet?: string;
  prevCity?: string;
  prevState?: string;
  prevStateId?: string;
  prevZip?: string;
  prevCounty?: string;
  showOptions?: boolean;
}

interface PreviousAddressState {
  previousAddressForms: PreviousAddressForm[];
  addPreviousAddressForm: () => void;
  updatePreviousAddressForm: (
    index: number,
    name: string,
    value: string,
  ) => void;
  togglePrevOptions: (index: number, closeOptions?: boolean) => void;
  removePreviousAddressForm: (index: number) => void;
}

export const usePreviousAddressStore = create<PreviousAddressState>(
  (set, get) => ({
    previousAddressForms: [
      {
        id: "",
        prevAddress: "",
        prevYear: "0",
        prevMonthId: "1",
        prevAddressTypeId: "",
        prevRentMort: "",
        prevStreet: "",
        prevCity: "",
        prevState: "",
        prevStateId: "",
        prevZip: "",
        prevCounty: "",
        showOptions: false,
      },
    ],
    addPreviousAddressForm: () =>
      set((state) => ({
        previousAddressForms: [
          ...state.previousAddressForms,
          {
            id: "",
            prevAddress: "",
            prevYear: "0",
            prevMonthId: "1",
            prevAddressTypeId: "",
            prevRentMort: "",
            prevStreet: "",
            prevCity: "",
            prevState: "",
            prevStateId: "",
            prevZip: "",
            prevCounty: "",
            showOptions: false,
          },
        ],
      })),
    updatePreviousAddressForm: (index, name, value) => {
      const handlePrevAddress = (
        prevAddress: string,
        position: number,
        value: string,
      ) => {
        let newAddress = prevAddress;
        const newAddressSplitted = newAddress.split(", ");

        switch (position) {
          case 1:
            newAddress = `${value}${
              newAddressSplitted.slice(1).join(", ")
                ? `, ${newAddressSplitted.slice(1).join(", ")}`
                : ""
            }`;
            break;

          case 2:
            newAddress = `${newAddressSplitted.slice(0, 1)}${value ? `, ${value}` : ""}${
              newAddressSplitted.slice(2).join(", ")
                ? `, ${newAddressSplitted.slice(2).join(", ")}`
                : ""
            }`;
            break;

          case 3:
            newAddress = `${newAddressSplitted.slice(0, 2).join(", ")}${value ? `, ${value}` : ""}${
              newAddressSplitted.slice(3).join(", ")
                ? `, ${newAddressSplitted.slice(3).join(", ")}`
                : ""
            }`;
            break;

          case 4:
            newAddress = `${newAddressSplitted.slice(0, 3).join(", ")}${value ? `, ${value}` : ""}${
              newAddressSplitted.slice(4).join()
                ? `, ${newAddressSplitted.slice(4).join()}`
                : ""
            }`;
            break;

          case 5:
            newAddress = `${newAddressSplitted.slice(0, 4).join(", ")}${value ? `, ${value}` : ""}`;
            break;
        }

        return newAddress;
      };

      const stateText = (value: string) =>
        states.find((el) => el.id === parseInt(value))?.state || "";

      set((state) => {
        const updatedForms = [...state.previousAddressForms];

        switch (name) {
          case "prevStreet":
            updatedForms[index] = {
              ...updatedForms[index],
              prevAddress: handlePrevAddress(
                updatedForms[index].prevAddress || "",
                1,
                value,
              ),
            };
            break;

          case "prevCity":
            updatedForms[index] = {
              ...updatedForms[index],
              prevAddress: handlePrevAddress(
                updatedForms[index].prevAddress || "",
                2,
                value,
              ),
            };
            break;

          case "prevStateId":
            updatedForms[index] = {
              ...updatedForms[index],
              prevAddress: handlePrevAddress(
                updatedForms[index].prevAddress || "",
                3,
                stateText(value),
              ),
            };
            break;

          case "prevZip":
            updatedForms[index] = {
              ...updatedForms[index],
              prevAddress: handlePrevAddress(
                updatedForms[index].prevAddress || "",
                4,
                value,
              ),
            };
            break;

          case "prevCounty":
            updatedForms[index] = {
              ...updatedForms[index],
              prevAddress: handlePrevAddress(
                updatedForms[index].prevAddress || "",
                5,
                value,
              ),
            };
            break;
        }

        updatedForms[index] = {
          ...updatedForms[index],
          [name]: value,
        };

        return { previousAddressForms: updatedForms };
      });
    },
    togglePrevOptions: (index, closeOptions) => {
      if (closeOptions) {
        const { previousAddressForms } = get();

        const newVal: PreviousAddressForm[] = [];

        if (previousAddressForms && previousAddressForms.length > 0) {
          previousAddressForms.forEach((form) => {
            newVal.push({
              ...form,
              showOptions: false,
            });
          });
        }

        set({ previousAddressForms: newVal });
      } else {
        set((state) => {
          const updatedForms = [...state.previousAddressForms];

          updatedForms.map((form, formIindex) =>
            formIindex !== index ? (form.showOptions = false) : form,
          );

          updatedForms[index] = {
            ...updatedForms[index],
            showOptions: !updatedForms[index].showOptions,
          };

          return { previousAddressForms: updatedForms };
        });
      }
    },
    removePreviousAddressForm: (index: number) =>
      set((state) => ({
        previousAddressForms: state.previousAddressForms.filter(
          (_, i) => i !== index,
        ),
      })),
  }),
);

// single user data

interface SingleUserData {
  singleUser: SingleUser;
  getSingleUserData: (id: string) => Promise<void>;
  clearSingleUserData: () => void;
}

export const singleUserDataStore = create<SingleUserData>((set) => ({
  singleUser: undefined,
  getSingleUserData: async (id) => {
    const user = await (await fetch(`/api/adminDashboard/users/${id}`)).json();

    set((state) => ({
      ...state,
      singleUser: user,
    }));
  },
  clearSingleUserData: () => {
    set(() => ({
      singleUser: undefined,
    }));
  },
}));

// single role data

interface SingleRoleData {
  singleRole: SingleRole;
  getSingleRoleData: (id: string) => Promise<void>;
  clearSingleRoleData: () => void;
}

export const singleRoleDataStore = create<SingleRoleData>((set) => ({
  singleRole: undefined,
  getSingleRoleData: async (id) => {
    const role = await (await fetch(`/api/adminDashboard/roles/${id}`)).json();

    set((state) => ({
      ...state,
      singleRole: role,
    }));
  },
  clearSingleRoleData: () => {
    set(() => ({
      singleRole: undefined,
    }));
  },
}));

// consent message

interface ConsentMessage {
  consentLink: string;
  sendCreditAppMessage: string;
  setConsentLink: (id?: number) => Promise<void>;
  setSendCreditAppMessage: (customer: string, id: number) => Promise<void>;
}

export const consentMessageStore = create<ConsentMessage>((set) => ({
  consentLink: "",
  sendCreditAppMessage: "",
  setConsentLink: async (id) => {
    const link = await (
      await fetch(`/api/adminDashboard/consentLink/${id}`, { method: "POST" })
    ).json();

    set({
      consentLink: link ? `${link}` : "",
    });
  },
  setSendCreditAppMessage: async (user, id) => {
    const formData = new FormData();

    formData.append("customerId", id.toString());

    const res = await (
      await fetch(`/api/creditAppCode`, { method: "POST", body: formData })
    ).json();

    console.log(res);

    const link = res.data;

    set({
      sendCreditAppMessage: `
    Dear ${user},\n
    We are pleased to know that you are deciding to proceed further with us. To further assist you in your financing needs, we will need you to fill out a credit application form located on our website. Below is a secure link to the form.\n
    ${link}\n
    We look forward to working with you!
    `,
    });
  },
}));

// daily totals

interface DailyTotals {
  todayAppointments: number | undefined;
  getTodayAppointments: () => Promise<void>;
}

export const dailyTotalsStore = create<DailyTotals>((set) => ({
  todayAppointments: undefined,
  getTodayAppointments: async () => {
    const data = await (
      await fetch("/api/adminDashboard/totalTodayAppointments")
    ).json();

    set(() => ({
      todayAppointments: data,
    }));
  },
}));

// current section

interface CurrentSection {
  section: string | undefined;
  getCurrentSection: (section: string) => void;
}

export const currentSectionStore = create<CurrentSection>((set) => ({
  section: undefined,
  getCurrentSection: (section) => {
    set(() => ({ section }));
  },
}));

// api messages

interface Messages {
  messages: {
    successMessage: string | undefined;
    serverError: string | undefined;
  };
  setMessages: (error?: string, success?: string) => void;
  clearMessages: () => void;
}

export const messagesStore = create<Messages>((set) => ({
  messages: {
    successMessage: undefined,
    serverError: undefined,
  },
  setMessages: (error, success) => {
    set({
      messages: {
        successMessage: success ? success : undefined,
        serverError: error ? error : undefined,
      },
    });
  },
  clearMessages: () => {
    set({
      messages: {
        successMessage: undefined,
        serverError: undefined,
      },
    });
  },
}));

// number formatter

interface NumberFormatter {
  numberFormatter: (
    value: string,
    allowNegative?: boolean,
    format?: number,
  ) => string;
  numberFilter: (value: string, format?: number) => string;
}

export const numberFormatterStore = create<NumberFormatter>(() => ({
  numberFormatter: (value, allowNegative, format) => {
    let numericValue = value ? value.toString() : "";

    let negativeSign = "";

    if (allowNegative && numericValue?.includes("-")) {
      negativeSign = "-";

      numericValue = numericValue?.substring(1);
    }

    numericValue = numericValue?.replace(/[^0-9.]/g, "");

    if (numericValue === "" || numericValue === ".") {
      numericValue = "0";

      negativeSign = "";
    }

    const [integerPart, decimalPart] = numericValue?.split(".");

    let formattedInteger: number | string = "0";

    switch (format) {
      case 1:
        formattedInteger =
          "$" + parseFloat(integerPart || "0").toLocaleString("en-US");
        break;

      default:
        formattedInteger = parseFloat(integerPart || "0");
        break;
    }

    let formattedValue =
      decimalPart !== undefined
        ? `${formattedInteger}.${decimalPart.slice(0, 2)}`
        : formattedInteger;

    return negativeSign + formattedValue;
  },
  numberFilter: (value, format) => {
    let valueFiltered = value?.replace(/[^-\d.]/g, "");

    let negativeSign = "";

    if (valueFiltered && valueFiltered.startsWith("-")) {
      negativeSign = "-";
      valueFiltered = valueFiltered.substring(1);
    }

    switch (format) {
      case 1:
        valueFiltered = `${negativeSign}$${valueFiltered.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
        break;
    }

    return valueFiltered;
  },
}));

// credit app pagination

interface CreditAppPagination {
  currentPage: number;
  creditAppNav: {
    id: number;
    customer_id: number;
    nextToAddress: boolean;
    nextToEmploymentStatus: boolean;
    nextToReferences: boolean;
  } | null;
  availablesPages: {
    address: boolean;
    employmentStatus: boolean;
    references: boolean;
  };
  nextPage: () => void;
  prevPage: () => void;
  resetCurrentPage: () => void;
  setCurrentPage: (identity: string) => void;
  getCreditAppNavigation: (customerId: number) => Promise<void>;
  setCreditAppNavigation: (
    currentPage: number,
    isNextPageAvailable: boolean,
  ) => void;
}

export enum CreditAppPages {
  Start = 1,
  Address = 2,
  EmploymentStatus = 3,
  References = 4,
}

export const creditAppPaginationStore = create<CreditAppPagination>(
  (set, get) => ({
    currentPage: 1,
    creditAppNav: null,
    availablesPages: {
      address: false,
      employmentStatus: false,
      references: false,
    },
    nextPage: () => {
      const { currentPage } = get();
      let newCurrentPage: number = 1;

      switch (currentPage) {
        case 1:
          newCurrentPage = 2;
          break;

        case 2:
          newCurrentPage = 3;
          break;

        case 3:
          newCurrentPage = 4;
          break;
      }

      set({ currentPage: newCurrentPage });
    },
    prevPage: () => {
      const { currentPage } = get();
      let newCurrentPage: number = 1;

      switch (currentPage) {
        case 2:
          newCurrentPage = 1;
          break;

        case 3:
          newCurrentPage = 2;
          break;

        case 4:
          newCurrentPage = 3;
          break;
      }

      set({ currentPage: newCurrentPage });
    },
    resetCurrentPage: () => {
      set({ currentPage: 1 });
    },
    setCurrentPage: (identity) => {
      let currentPage = 1;

      switch (identity) {
        case "start":
          currentPage = 1;
          break;

        case "address":
          currentPage = 2;
          break;

        case "status":
          currentPage = 3;
          break;

        case "references":
          currentPage = 4;
          break;
      }

      set({ currentPage: currentPage });
    },
    getCreditAppNavigation: async (customerId) => {
      const res = await fetch(`/api/creditAppNav/${customerId}`);

      const json = await res.json();

      set({ creditAppNav: json });
    },
    setCreditAppNavigation: (currentPage, isNextPageAvailable) => {
      const { availablesPages } = get();

      let availablesPagesCopy = { ...availablesPages };

      switch (currentPage) {
        case CreditAppPages.Address:
          availablesPagesCopy.address = isNextPageAvailable;

          break;

        case CreditAppPages.EmploymentStatus:
          availablesPagesCopy.employmentStatus = isNextPageAvailable;

          break;

        case CreditAppPages.References:
          availablesPagesCopy.references = isNextPageAvailable;

          break;
      }

      set({ availablesPages: availablesPagesCopy });
    },
  }),
);

// task filter search input value

interface TaskFilterSearchInput {
  taskSearchFilterInput: string;
  taskStatusFilterChecksboxes: string[];
  taskBetweenFrom: string;
  taskBetweenTo: string;
  setTaskBetweenFrom: (value: string) => void;
  setTaskBetweenTo: (value: string) => void;
  setTaskSearchFilterInput: (value: string) => void;
  setTaskStatusFilterChecksboxes: (value: string) => void;
}

export const taskFilterSearchInputStore = create<TaskFilterSearchInput>(
  (set, get) => ({
    taskSearchFilterInput: "",
    taskStatusFilterChecksboxes: [],
    taskBetweenFrom: "",
    taskBetweenTo: "",
    setTaskStatusFilterChecksboxes: (val) => {
      const { taskStatusFilterChecksboxes } = get();

      let newValues = [...taskStatusFilterChecksboxes];

      if (val === "clean") {
        newValues = [];
      } else if (newValues.includes(val)) {
        newValues = newValues.filter((el) => el !== val);
      } else {
        newValues.push(val);
      }

      set({ taskStatusFilterChecksboxes: newValues });
    },
    setTaskSearchFilterInput: (value) => {
      set({ taskSearchFilterInput: value });
    },
    setTaskBetweenFrom: (value) => {
      set({ taskBetweenFrom: value });
    },
    setTaskBetweenTo: (value) => {
      set({ taskBetweenTo: value });
    },
  }),
);

// user permission allowed

interface UserPermissionAllowed {
  returnPermission: (
    roleIdAllowed: number[],
    currentUserRoleId?: number,
  ) => boolean;
}

export const userPermissionAllowedStore = create<UserPermissionAllowed>(
  (set) => ({
    returnPermission: (roleIdAllowed, currentUserRoleId) => {
      let allowed: boolean = false;

      if (currentUserRoleId) {
        if (roleIdAllowed.includes(currentUserRoleId)) {
          allowed = true;
        }
      }

      return allowed;
    },
  }),
);

// dashboard height

export interface DashboardHeight {
  dashboardHeight: number;
  setDashboardHeight: (height: number) => void;
}

export const dashboardHeightStore = create<DashboardHeight>((set) => ({
  dashboardHeight: 0,
  setDashboardHeight: (height) => {
    set({ dashboardHeight: height });
  },
}));

// user session

export interface CurrentUserData {
  id: number;
  name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_has: {
    role_id: number;
    role: {
      role: string;
    };
  }[];
  username?: string;
  img?: string;
}

export interface UserSession {
  currentUser: CurrentUserData | null;
  setCurrentUser: (userSessionData: CurrentUserData) => void;
}

export const userStore = create<UserSession>((set) => ({
  currentUser: null,
  setCurrentUser: (userSessionData) => {
    set({ currentUser: userSessionData });
  },
}));
