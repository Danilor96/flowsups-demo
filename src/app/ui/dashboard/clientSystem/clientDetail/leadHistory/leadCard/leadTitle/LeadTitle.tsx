import { LeadHistoryCategoriesEnum, CategoriesEnumToString, subcategoryToGroupMap } from '../../categoriesIdMap';

const leadTitle = (leadId: number, lead?: string) => {
  const title = subcategoryToGroupMap[leadId] || null;
  if (title) {
    return { title: `${title}`, subTitle: `${CategoriesEnumToString[leadId as LeadHistoryCategoriesEnum]}` };
  }

  if (lead) {
    return {
      title: `${lead.replace(lead[0], lead[0].toUpperCase())}:`,
    };
  }

  return { title: 'Other:' };
};

export function LeadTitle({ leadId, lead }: { leadId: number; lead?: string }) {
  // ----- global states -----

  // ----- local states -----
  const { title, subTitle } = leadTitle(leadId, lead);
  return (
    <p className="text-[2vh] font-bold leading-[2.314815vh] text-[#00A78B] flex flex-col">
      {title}
      {subTitle && subTitle !== title && (
        <span className="text-[1.7vh] font-light leading-[2.314815vh] text-[#00A78B]">{subTitle}</span>
      )}
    </p>
  );
}
