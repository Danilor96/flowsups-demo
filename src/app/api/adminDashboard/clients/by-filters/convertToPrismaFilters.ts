export function buildPrismaWhereClause(filters: AppliedFilter[]): Record<string, any> {
  if (!filters || filters.length === 0) {
    return {};
  }

  const prismaFilters: Record<string, any>[] = [];

  filters.forEach(filter => {
    if (
      !filter.field ||
      !filter.condition ||
      (filter.value === null && filter.condition !== 'isTrue' && filter.condition !== 'isFalse')
    ) {
      return;
    }

    const fieldParts = filter.field.split('.');
    let conditionObject: any = {};
    let currentLevel = conditionObject;

    const nonParsedValues = ['work_phone', 'home_phone', 'mobile_phone'];

    // Construir el objeto anidado para campos como 'client_address.city'
    fieldParts.forEach((part, index) => {
      if (index === fieldParts.length - 1) {
        const parsedValue = nonParsedValues.includes(filter.field) ? filter.value : parseFilterValue(filter.value, filter.condition as FilterCondition);
        const parsedValue2 = filter.value2
          ? parseFilterValue(filter.value2, filter.condition as FilterCondition)
          : undefined;
        const valueIsDate =
          parsedValue instanceof Date || (typeof parsedValue === 'string' && !isNaN(Date.parse(parsedValue)));
        const mode = valueIsDate ? undefined : 'insensitive';

        switch (filter.condition) {
          case 'equals':
            currentLevel[part] = { equals: parsedValue as string, mode: mode };
            break;
          case 'notEquals':
            currentLevel[part] = { mode, not: { equals: parsedValue as string } };
            break;
          case 'contains':
            currentLevel[part] = { contains: parsedValue as string, mode: 'insensitive' };
            break;
          case 'doesNotContain':
            currentLevel[part] = { mode: 'insensitive', not: { contains: parsedValue as string } };
            break;
          case 'startsWith':
            currentLevel[part] = { startsWith: parsedValue as string, mode: 'insensitive' };
            break;
          case 'endsWith':
            currentLevel[part] = { endsWith: parsedValue as string, mode: 'insensitive' };
            break;

          // Condiciones de Número y Fecha
          case 'greaterThan':
            currentLevel[part] = { gt: parsedValue };
            break;
          case 'lessThan':
            currentLevel[part] = { lt: parsedValue };
            break;
          case 'greaterThanOrEqual':
            currentLevel[part] = { gte: parsedValue };
            break;
          case 'lessThanOrEqual':
            currentLevel[part] = { lte: parsedValue };
            break;
          case 'between':
            if (parsedValue !== undefined && parsedValue2 !== undefined) {
              currentLevel[part] = { gte: parsedValue, lte: parsedValue2 };
            }
            break;

          case 'isTrue':
            currentLevel[part] = { equals: true };
            break;
          case 'isFalse':
            currentLevel[part] = { equals: false };
            break;

          // Condiciones para Select/Enum (string o number)
          case 'is':
            currentLevel[part] = { equals: parsedValue };
            break;
          case 'isNot':
            currentLevel[part] = { not: { equals: parsedValue } };
            break;

          default:
            console.warn(`Condición no manejada: ${filter.condition} para el campo ${filter.field}`);
        }
      } else {
        // Parte intermedia, crear objeto anidado
        currentLevel[part] = {};
        currentLevel = currentLevel[part];
      }
    });
    if (Object.keys(conditionObject).length > 0) {
      prismaFilters.push(conditionObject);
    }
  });

  if (prismaFilters.length === 0) return {};
  return { AND: prismaFilters };
}

function parseFilterValue(value: FilterValue, condition: FilterCondition): any {
  if (value === null || value === undefined || value === '') return null;

  const dateConditions: FilterCondition[] = [
    'equals',
    'notEquals',
    'greaterThan',
    'lessThan',
    'greaterThanOrEqual',
    'lessThanOrEqual',
    'between'
  ];
  if (typeof value === 'string' && dateConditions.includes(condition)) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      // Es una fecha válida
      return d.toISOString();
    }
  }

  if (typeof value === 'string' && !isNaN(parseFloat(value)) && isFinite(Number(value))) {
    const numericConditions: FilterCondition[] = [
      'greaterThan',
      'lessThan',
      'greaterThanOrEqual',
      'lessThanOrEqual',
      'between'
    ];
    if (
      numericConditions.includes(condition) ||
      ((condition === 'equals' || condition === 'notEquals') && !isNaN(Number(value)))
    ) {
      return parseFloat(value);
    }
  }

  return value;
}
