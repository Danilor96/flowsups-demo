type DecimalInput = number | string | MockDecimal | { value: number };

function toNumber(value: DecimalInput): number {
  if (value instanceof MockDecimal) return value.value;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value.replaceAll(',', '')) || 0;
  if (value && typeof value === 'object') {
    if (typeof (value as any).toNumber === 'function') {
      return Number((value as any).toNumber());
    }
    if ('value' in value) return Number((value as { value: number }).value) || 0;
  }
  return Number(value) || 0;
}

export class MockDecimal {
  value: number;

  constructor(value: DecimalInput = 0) {
    this.value = toNumber(value);
  }

  plus(other: DecimalInput): MockDecimal {
    return new MockDecimal(this.value + toNumber(other));
  }

  add(other: DecimalInput): MockDecimal {
    return new MockDecimal(this.value + toNumber(other));
  }

  minus(other: DecimalInput): MockDecimal {
    return new MockDecimal(this.value - toNumber(other));
  }

  mul(other: DecimalInput): MockDecimal {
    return new MockDecimal(this.value * toNumber(other));
  }

  div(other: DecimalInput): MockDecimal {
    return new MockDecimal(this.value / toNumber(other));
  }

  toNumber(): number {
    return this.value;
  }

  toString(): string {
    return String(this.value);
  }

  valueOf(): number {
    return this.value;
  }

  toJSON(): string {
    return this.toString();
  }
}

export const Decimal = (value: DecimalInput = 0): MockDecimal => new MockDecimal(value);

export type Decimal = MockDecimal;