export function returnLeadPrismaClauses({
  leadId,
  customerId,
  whereLeadRelationName,
  noOrderBy,
}: {
  leadId?: string | null;
  customerId: number;
  whereLeadRelationName?: string;
  noOrderBy?: boolean;
}) {
  const whereLeadName = whereLeadRelationName ? whereLeadRelationName : 'lead';

  if (noOrderBy) {
    const relatedLeadInfo = leadId
      ? {
          where: {
            [whereLeadName]: {
              some: {
                id: Number(leadId),
              },
            },
          },
        }
      : {
          where: {
            [whereLeadName]: {
              some: {
                customer_id: customerId,
                is_active: true,
              },
            },
          },
        };

    return relatedLeadInfo;
  }

  const relatedLeadInfo = leadId
    ? {
        where: {
          [whereLeadName]: {
            some: {
              id: Number(leadId),
            },
          },
        },
        take: 1,
        orderBy: {
          created_at: 'desc' as const,
        },
      }
    : {
        where: {
          [whereLeadName]: {
            some: {
              customer_id: customerId,
              is_active: true,
            },
          },
        },
        take: 1,
        orderBy: {
          created_at: 'desc' as const,
        },
      };

  return relatedLeadInfo;
}
