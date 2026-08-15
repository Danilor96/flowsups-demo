import { seedUsers } from "./data/users";
import {
  seedRoles,
  seedPermissions,
  seedRolesHasPermissions,
} from "./data/roles";
import { seedClients } from "./data/clients";
import { seedLeads, seedClientHasLead } from "./data/leads";
import { seedAppointments, seedAppointmentStatuses } from "./data/appointments";
import {
  seedVehicles,
  seedVehicleLookups,
  seedInspectionStatusData,
  seedEmissionStatusData,
  seedGeneralInfo,
  seedVehicleDetailsPurchaseInfo,
  seedVehicleDetailsTitleLicense,
  seedVehicleDetailsKeyInfo,
} from "./data/vehicles";
import {
  seedClientStatuses,
  seedLeadSources,
  seedLeadTypes,
  seedSettingsStores,
  seedTaskDueTimeLimits,
} from "./data/settings";
import { seedSystemAccesses } from "./data/systemAccesses";
import { seedEventTypes } from "./data/eventTypes";
import { seedIncidents } from "./data/incidents";
import {
  seedHeaderEmailTemplates,
  seedFooterEmailTemplates,
  seedLetterheads,
} from "./data/letterheads";
import { seedLostReasons } from "./data/lostReasons";
import { seedDisableSelectValues } from "./data/disableSelects";
import { seedEmailTemplates } from "./data/emailTemplates";
import { seedEvents } from "./data/events";
import { seedCounties } from "./data/counties";
import { seedConversations, seedNotes } from "./data/conversations";
import {
  seedBanks,
  seedDeals,
  seedPaymentDates,
  seedAmountPerDates,
  seedChargesBack,
  seedOtherSalesLog,
  seedOtherVehicle,
  seedMarketingCost,
} from "./data/deals";
import {
  seedSalesGoalsConfig,
  seedSalesActivityLog,
  seedComissionInfo,
  seedComissionSpiff,
  seedComissionBonus,
  seedComissionSalary,
  seedClientsHasReferrer,
  seedDealReceipts,
  seedDailyVisitHistory,
  seedMonthlyGoals,
} from "./data/reports";
import {
  seedCreditAppNavigations,
  seedCreditApps,
  seedCreditAppAddresses,
  seedCreditAppPrevAddresses,
  seedCreditAppReferences,
  seedCreditAppOtherIncomes,
  seedCreditAppCodes,
} from "./data/creditApps";
import { seedCustomerEmployments } from "./data/employments";
import { seedNotifications, seedNotificationsPreferences } from "./data/notifications";
import { seedUsersHasCustomers } from "./data/usersHasCustomers";
import {
  seedBusinessPhoneNumbers,
  seedClientCalls,
  seedConferencesNames,
} from "./data/calls";
import {
  seedConsentTerms,
  seedConsentChecks,
  seedConsentCodes,
  seedClientAddresses,
  seedTermsAndConditionsProcessed,
  seedCustomerConsentLogs,
} from "./data/consentTerms";
import { seedClientSms } from "./data/sms";
import {
  seedSmsTemplates,
  seedSmsTemplateCategories,
  seedSmsTemplateVariables,
  seedSmsTemplateVariablesCategories,
  seedSmsTemplateVariablesTagged,
  seedAwaitingUnknowClients,
  seedClientBulkSms,
} from "./data/smsTemplates";
import { seedTasks } from "./data/tasks";
import { seedTaskNotes } from "./data/taskNotes";
import { seedAppointmentSms } from "./data/appointmentSms";
import { seedRescheduleSms } from "./data/rescheduleSms";
import {
  seedAutomatedReviews,
  seedAutomaticEmails,
  seedAutomaticSms,
  seedCustomBeBackReasons,
  seedCustomLostReasons,
  seedCustomNoSaleReasons,
  seedCustomerSettings,
  seedTaskSettings,
  seedEmailToLead,
  seedPaymentTypes,
  seedTrackingCodes,
  seedUnknownAdfElements,
  seedVoiceAndSms,
  seedIncomingCallsOptions,
  seedEmailNameDisplayed,
  seedSmsLimitWarningRecipients,
  seedBusiness,
  seedTimeSpan,
} from "./data/settingsRoutes";

export { DEMO_EMAIL, DEMO_PASSWORD } from "./data/users";
import { MockDecimal } from "./decimal";
export { Decimal, MockDecimal } from "./decimal";

export type MockWhere = Record<string, any>;

export interface Store<T> {
  findMany(params?: {
    where?: MockWhere;
    orderBy?: any;
    skip?: number;
    take?: number;
    cursor?: MockWhere;
    select?: any;
    include?: any;
  }): T[];
  findUnique(params: { where: MockWhere; select?: any; include?: any }): T | null;
  findFirst(params?: { where?: MockWhere; orderBy?: any; select?: any; include?: any }): T | null;
  create(params: { data: any }): T;
  createMany(params: { data: any[] }): { count: number };
  update(params: { where: MockWhere; data: Partial<T> }): T;
  updateMany(params: { where: MockWhere; data: Partial<T> }): { count: number };
  delete(params: { where: MockWhere }): T;
  deleteMany(params: { where: MockWhere }): { count: number };
  upsert(params: { where: MockWhere; create: any; update: any }): T;
  count(params?: { where?: MockWhere }): number;
  groupBy(params?: {
    by?: string[];
    where?: MockWhere;
    _count?: Record<string, boolean>;
    _sum?: Record<string, boolean>;
  }): any[];
  aggregate(params?: { where?: MockWhere; _sum?: Record<string, boolean> }): any;
  all(): T[];
  reset(): void;
}

type AnyRecord = Record<string, any>;

function matchesValue(actual: any, expected: any): boolean {
  if (
    expected &&
    typeof expected === "object" &&
    !(expected instanceof Date) &&
    !Array.isArray(expected)
  ) {
    if ("equals" in expected) return matchesValue(actual, expected.equals);
    if ("not" in expected) return !matchesValue(actual, expected.not);
    if ("isNot" in expected) {
      if (expected.isNot === null) {
        return actual !== null && actual !== undefined;
      }
      return actual !== expected.isNot;
    }
    if ("isEmpty" in expected) {
      if (!Array.isArray(actual)) return false;
      return expected.isEmpty === true ? actual.length === 0 : actual.length > 0;
    }
    if ("in" in expected) {
      return (
        Array.isArray(expected.in) &&
        expected.in.some((value: any) => matchesValue(actual, value))
      );
    }
    if ("notIn" in expected) {
      return !(
        Array.isArray(expected.notIn) &&
        expected.notIn.some((value: any) => matchesValue(actual, value))
      );
    }
    if ("contains" in expected) {
      return (
        actual != null &&
        String(actual)
          .toLowerCase()
          .includes(String(expected.contains).toLowerCase())
      );
    }
    if ("startsWith" in expected) {
      return (
        actual != null &&
        String(actual)
          .toLowerCase()
          .startsWith(String(expected.startsWith).toLowerCase())
      );
    }
    if ("endsWith" in expected) {
      return (
        actual != null &&
        String(actual)
          .toLowerCase()
          .endsWith(String(expected.endsWith).toLowerCase())
      );
    }
    if ("gt" in expected) return actual != null && actual > expected.gt;
    if ("gte" in expected) return actual != null && actual >= expected.gte;
    if ("lt" in expected) return actual != null && actual < expected.lt;
    if ("lte" in expected) return actual != null && actual <= expected.lte;
    if ("has" in expected) {
      return (
        Array.isArray(actual) &&
        actual.some((value: any) => value === expected.has)
      );
    }
    if ("some" in expected && Array.isArray(actual)) {
      return actual.some((item: any) => matchesWhere(item, expected.some));
    }
    if ("every" in expected && Array.isArray(actual)) {
      return actual.every((item: any) => matchesWhere(item, expected.every));
    }
    if ("none" in expected && Array.isArray(actual)) {
      return !actual.some((item: any) => matchesWhere(item, expected.none));
    }
    if (Array.isArray(actual)) {
      return actual.some((item: any) => matchesWhere(item, expected));
    }
    if (actual && typeof actual === "object") {
      return matchesWhere(actual, expected);
    }
    return false;
  }

  if (expected === null) return actual === null || actual === undefined;
  if (expected === undefined) return true;

  return actual === expected;
}

function matchesWhere(
  record: AnyRecord,
  where: MockWhere | undefined,
): boolean {
  if (!where || typeof where !== "object") return true;

  for (const key of Object.keys(where)) {
    const condition = where[key];
    if (condition === undefined) continue;

    if (key === "AND") {
      const clauses = Array.isArray(condition) ? condition : [condition];
      if (!clauses.every((clause: MockWhere) => matchesWhere(record, clause)))
        return false;
      continue;
    }

    if (key === "OR") {
      const clauses = Array.isArray(condition) ? condition : [condition];
      if (!clauses.some((clause: MockWhere) => matchesWhere(record, clause)))
        return false;
      continue;
    }

    if (key === "NOT") {
      const clauses = Array.isArray(condition) ? condition : [condition];
      if (clauses.some((clause: MockWhere) => matchesWhere(record, clause)))
        return false;
      continue;
    }

    if (!matchesValue(record[key], condition)) return false;
  }

  return true;
}

function sortRecords<T>(records: T[], orderBy: any): T[] {
  if (!orderBy) return records;
  const fields = Array.isArray(orderBy) ? orderBy : [orderBy];
  const sorted = [...records];

  sorted.sort((a: any, b: any) => {
    for (const fieldDef of fields) {
      const key =
        typeof fieldDef === "string" ? fieldDef : Object.keys(fieldDef)[0];
      const direction = typeof fieldDef === "string" ? "asc" : fieldDef[key];
      const left = a[key];
      const right = b[key];

      let cmp = 0;
      if (left == null && right == null) cmp = 0;
      else if (left == null) cmp = -1;
      else if (right == null) cmp = 1;
      else if (left < right) cmp = -1;
      else if (left > right) cmp = 1;

      if (cmp !== 0) return direction === "desc" ? -cmp : cmp;
    }
    return 0;
  });

  return sorted;
}

function resolveNestedCreate(data: AnyRecord): AnyRecord {
  const resolved: AnyRecord = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && "create" in value) {
      const child = resolveNestedCreate(value.create);
      if (child.id === undefined) {
        child.id = child.id ?? Math.floor(Math.random() * 1000000) + 1;
      }
      resolved[key] = [child];
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

function applyIncrementDecrement(current: AnyRecord, data: AnyRecord): AnyRecord {
  const merged: AnyRecord = { ...data };
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      if ("increment" in value) {
        const delta = Number(value.increment) || 0;
        const currentValue = current[key];
        merged[key] =
          currentValue instanceof MockDecimal
            ? currentValue.plus(delta)
            : (Number(currentValue) || 0) + delta;
      } else if ("decrement" in value) {
        const delta = Number(value.decrement) || 0;
        const currentValue = current[key];
        merged[key] =
          currentValue instanceof MockDecimal
            ? currentValue.minus(delta)
            : (Number(currentValue) || 0) - delta;
      }
    }
  }
  return merged;
}

export function createStore<T>(initial: T[]): Store<T> {
  const records: T[] = initial.map((record) => ({
    ...(record as AnyRecord),
  })) as T[];
  let nextId =
    initial.reduce(
      (max, record) => Math.max(max, Number((record as AnyRecord).id) || 0),
      0,
    ) + 1;

  const assignId = (data: T): T => {
    const record = data as AnyRecord;
    if (record.id === undefined || record.id === null) {
      record.id = nextId++;
    }
    return data;
  };

  return {
    findMany(params = {}) {
      let result = records.filter((record) =>
        matchesWhere(record as AnyRecord, params.where),
      );
      result = sortRecords(result, params.orderBy);
      let start = params.skip || 0;
      if (params.cursor) {
        const cursorIndex = result.findIndex((record) =>
          matchesWhere(record as AnyRecord, params.cursor),
        );
        start = cursorIndex === -1 ? result.length : cursorIndex + 1 + start;
      }
      if (start || params.take !== undefined) {
        result = result.slice(start, (params.take ?? Infinity) + start);
      }
      return result;
    },
    findUnique({ where }) {
      return (
        records.find((record) => matchesWhere(record as AnyRecord, where)) ??
        null
      );
    },
    findFirst(params = {}) {
      const result = sortRecords(
        records.filter((record) =>
          matchesWhere(record as AnyRecord, params.where),
        ),
        params.orderBy,
      );
      return result[0] ?? null;
    },
    create({ data }) {
      const record = assignId(resolveNestedCreate(data) as T);
      records.push(record);
      return record;
    },
    createMany({ data }) {
      const created = data.map((entry) => assignId(entry));
      records.push(...created);
      return { count: created.length };
    },
    update({ where, data }) {
      const index = records.findIndex((record) =>
        matchesWhere(record as AnyRecord, where),
      );
      if (index === -1) {
        throw new Error(
          `Mock record to update not found: ${JSON.stringify(where)}`,
        );
      }
      const current = records[index] as AnyRecord;
      const updated = {
        ...current,
        ...applyIncrementDecrement(current, data as AnyRecord),
        id: current.id,
      } as T;
      records[index] = updated;
      return updated;
    },
    updateMany({ where, data }) {
      let count = 0;
      records.forEach((record, index) => {
        if (matchesWhere(record as AnyRecord, where)) {
          const current = record as AnyRecord;
          records[index] = {
            ...current,
            ...applyIncrementDecrement(current, data as AnyRecord),
            id: current.id,
          } as T;
          count += 1;
        }
      });
      return { count };
    },
    delete({ where }) {
      const index = records.findIndex((record) =>
        matchesWhere(record as AnyRecord, where),
      );
      if (index === -1) {
        throw new Error(
          `Mock record to delete not found: ${JSON.stringify(where)}`,
        );
      }
      return records.splice(index, 1)[0];
    },
    deleteMany({ where }) {
      const before = records.length;
      for (let index = records.length - 1; index >= 0; index -= 1) {
        if (matchesWhere(records[index] as AnyRecord, where)) {
          records.splice(index, 1);
        }
      }
      return { count: before - records.length };
    },
    upsert({ where, create, update }) {
      const index = records.findIndex((record) =>
        matchesWhere(record as AnyRecord, where),
      );
      if (index === -1) {
        const record = assignId(create);
        records.push(record);
        return record;
      }
      const current = records[index] as AnyRecord;
      const updated = {
        ...current,
        ...applyIncrementDecrement(current, update as AnyRecord),
        id: current.id,
      } as T;
      records[index] = updated;
      return updated;
    },
    count(params = {}) {
      return records.filter((record) =>
        matchesWhere(record as AnyRecord, params.where),
      ).length;
    },
    groupBy(params = {}) {
      const { by = [], where, _count = {}, _sum = {} } = params;
      const filtered = records.filter((record) =>
        matchesWhere(record as AnyRecord, where),
      );

      const groups = new Map<string, AnyRecord[]>();
      filtered.forEach((record) => {
        const key = JSON.stringify(
          by.map((field: string) => (record as AnyRecord)[field]),
        );
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(record as AnyRecord);
      });

      const results: AnyRecord[] = [];
      groups.forEach((group, key) => {
        const byValues = JSON.parse(key) as any[];
        const entry: AnyRecord = {};
        by.forEach((field: string, index: number) => {
          entry[field] = byValues[index];
        });

        const countResult: AnyRecord = {};
        if ("_all" in _count) countResult._all = group.length;
        Object.keys(_count).forEach((field) => {
          if (field === "_all") return;
          countResult[field] = group.filter(
            (record) =>
              record[field] !== null && record[field] !== undefined,
          ).length;
        });
        if (Object.keys(countResult).length > 0) entry._count = countResult;

        const sumResult: AnyRecord = {};
        Object.keys(_sum).forEach((field) => {
          sumResult[field] = new MockDecimal(
            group.reduce((acc: number, record) => {
              const value = record[field];
              if (value == null) return acc;
              if (value instanceof MockDecimal) return acc + value.toNumber();
              return acc + (Number(value) || 0);
            }, 0),
          );
        });
        if (Object.keys(sumResult).length > 0) entry._sum = sumResult;

        results.push(entry);
      });

      return results;
    },
    aggregate(params = {}) {
      const { where, _sum = {} } = params;
      const filtered = records.filter((record) =>
        matchesWhere(record as AnyRecord, where),
      );

      const sumResult: AnyRecord = {};
      Object.keys(_sum).forEach((field) => {
        const total = filtered.reduce((acc: number, record) => {
          const value = (record as AnyRecord)[field];
          if (value == null) return acc;
          if (value instanceof MockDecimal) return acc + value.toNumber();
          return acc + (Number(value) || 0);
        }, 0);
        sumResult[field] = filtered.length === 0 ? null : new MockDecimal(total);
      });

      return { _sum: sumResult };
    },
    all() {
      return records;
    },
    reset() {
      records.splice(
        0,
        records.length,
        ...(initial.map((record) => ({ ...(record as AnyRecord) })) as T[]),
      );
      nextId =
        initial.reduce(
          (max, record) => Math.max(max, Number((record as AnyRecord).id) || 0),
          0,
        ) + 1;
    },
  };
}

const buildStores = (
  sources: Record<string, any[]>,
): Record<string, Store<any>> => {
  const stores: Record<string, Store<any>> = {};
  for (const [key, records] of Object.entries(sources)) {
    stores[key] = createStore(records);
  }
  return stores;
};

export const mockDb: Record<string, Store<any>> = {
  users: createStore<Record<string, any>>(seedUsers),
  roles: createStore(seedRoles),
  permissions: createStore(seedPermissions),
  roles_has_permissions: createStore(seedRolesHasPermissions),
  clients: createStore<Record<string, any>>(seedClients),
  leads: createStore<Record<string, any>>(seedLeads),
  client_has_lead: createStore(seedClientHasLead),
  appointments: createStore(seedAppointments),
  appointments_status: createStore(seedAppointmentStatuses),
  vehicles: createStore(seedVehicles),
  ...buildStores(seedVehicleLookups),
  inspection_status_data: createStore(seedInspectionStatusData),
  emission_status_data: createStore(seedEmissionStatusData),
  general_info: createStore(seedGeneralInfo),
  vehicle_details_purchase_info: createStore(seedVehicleDetailsPurchaseInfo),
  vehicle_details_title_license: createStore(seedVehicleDetailsTitleLicense),
  vehicle_details_key_info: createStore(seedVehicleDetailsKeyInfo),
  ...buildStores(seedSettingsStores),
  task_due_time_limit: createStore(seedTaskDueTimeLimits),
  system_accesses: createStore(seedSystemAccesses),
  events_types: createStore(seedEventTypes),
  incidents: createStore(seedIncidents),
  letterhead: createStore(seedLetterheads),
  header_email_template: createStore(seedHeaderEmailTemplates),
  footer_email_template: createStore(seedFooterEmailTemplates),
  lost_reasons: createStore(seedLostReasons),
  disable_select_values: createStore(seedDisableSelectValues),
  email_template: createStore(seedEmailTemplates),
  events: createStore(seedEvents),
  county: createStore(seedCounties),
  conversation: createStore(seedConversations),
  notes: createStore(seedNotes),
  lead_types: createStore(seedLeadTypes),
  lead_sources: createStore(seedLeadSources),
  client_status: createStore(seedClientStatuses),
  banks: createStore(seedBanks),
  deal: createStore(seedDeals),
  paymentDate: createStore(seedPaymentDates),
  amountPerDate: createStore(seedAmountPerDates),
  charges_back: createStore(seedChargesBack),
  other_sales_log: createStore(seedOtherSalesLog),
  other_vehicle: createStore(seedOtherVehicle),
  marketing_cost: createStore(seedMarketingCost),
  salesGoalsConfig: createStore(seedSalesGoalsConfig),
  sales_activity_log: createStore(seedSalesActivityLog),
  comission_info: createStore(seedComissionInfo),
  comission_spiff: createStore(seedComissionSpiff),
  comission_bonus: createStore(seedComissionBonus),
  comission_salary: createStore(seedComissionSalary),
  clients_has_referrer: createStore(seedClientsHasReferrer),
  dealReceipt: createStore(seedDealReceipts),
  daily_visit_history: createStore(seedDailyVisitHistory),
  monthly_goals: createStore(seedMonthlyGoals),
  credit_app_navigation: createStore(seedCreditAppNavigations),
  credit_app: createStore(seedCreditApps),
  credit_app_address: createStore(seedCreditAppAddresses),
  credit_app_address_prev: createStore(seedCreditAppPrevAddresses),
  credit_app_reference: createStore(seedCreditAppReferences),
  credit_app_other_income: createStore(seedCreditAppOtherIncomes),
  credit_app_code: createStore(seedCreditAppCodes),
  customer_employment: createStore(seedCustomerEmployments),
  notifications: createStore(seedNotifications),
  notifications_preferences: createStore(seedNotificationsPreferences),
  users_has_customers: createStore(seedUsersHasCustomers),
  business_phone_numbers: createStore(seedBusinessPhoneNumbers),
  client_calls: createStore(seedClientCalls),
  conferences_names: createStore(seedConferencesNames),
  consent_terms: createStore(seedConsentTerms),
  consent_checks: createStore(seedConsentChecks),
  consent_code: createStore(seedConsentCodes),
  client_address: createStore(seedClientAddresses),
  terms_and_conditions_processed: createStore(seedTermsAndConditionsProcessed),
  customer_consent_logs: createStore(seedCustomerConsentLogs),
  client_sms: createStore(seedClientSms),
  tasks: createStore(seedTasks),
  task_Notes: createStore(seedTaskNotes),
  sms_template: createStore(seedSmsTemplates),
  sms_template_category: createStore(seedSmsTemplateCategories),
  sms_template_variables: createStore(seedSmsTemplateVariables),
  sms_template_variables_category: createStore(seedSmsTemplateVariablesCategories),
  sms_template_variables_tagged: createStore(seedSmsTemplateVariablesTagged),
  awaiting_unknow_client: createStore(seedAwaitingUnknowClients),
  client_Bulk_sms: createStore(seedClientBulkSms),
  appointmentSms: createStore(seedAppointmentSms),
  rescheduleSms: createStore(seedRescheduleSms),
  automated_review: createStore(seedAutomatedReviews),
  automatic_emails: createStore(seedAutomaticEmails),
  automatic_sms: createStore(seedAutomaticSms),
  custom_be_back_reasons: createStore(seedCustomBeBackReasons),
  custom_lost_reasons: createStore(seedCustomLostReasons),
  custom_no_sale_reasons: createStore(seedCustomNoSaleReasons),
  customer_settings: createStore(seedCustomerSettings),
  task_settings: createStore(seedTaskSettings),
  email_to_lead: createStore(seedEmailToLead),
  payment_types: createStore(seedPaymentTypes),
  tracking_code: createStore(seedTrackingCodes),
  unknown_adf_elements: createStore(seedUnknownAdfElements),
  voice_and_sms: createStore(seedVoiceAndSms),
  incoming_calls_options: createStore(seedIncomingCallsOptions),
  email_name_displayed: createStore(seedEmailNameDisplayed),
  sms_limit_warning_recipients: createStore(seedSmsLimitWarningRecipients),
  business: createStore(seedBusiness),
  time_span: createStore(seedTimeSpan),
};

export function resetMockDb(): void {
  Object.values(mockDb).forEach((store) => store.reset());
}
