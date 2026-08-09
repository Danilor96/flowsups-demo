type FilterValue =
  | string
  | number
  | Date
  | boolean
  | null
  | [Date | null, Date | null]
  | [number | null, number | null];

type FilterCondition =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'doesNotContain'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'isTrue'
  | 'isFalse'
  | 'is'
  | 'isNot';

interface AppliedFilter {
  id: string;
  field: string;
  condition: FilterCondition | '';
  value: FilterValue;
  value2?: FilterValue;
}