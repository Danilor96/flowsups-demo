import { CustomerName } from '../CustomerName';

interface MultipleCustomers {
  customerName?: string | null;
  customerId?: number | null;
  salesRepId?: number | null;
  label?: string | null;
}

interface RenderRules {
  fontSize?: number;
  mxAuto?: boolean;
}

export function MultipleCustomers({
  multipleCustomers,
  renderRules,
}: {
  multipleCustomers: MultipleCustomers[];
  renderRules?: RenderRules;
}) {
  if (!multipleCustomers || multipleCustomers.length === 0) return null;

  return (
    <div className={`${multipleCustomers.length > 1 ? 'flex flex-col gap-0.5 items-start' : ''}`}>
      {multipleCustomers.map((customer, index) => {
        if (!customer.customerId) return null;

        return (
          <aside
            key={`multicustoññññ--${index}`}
            className={`${customer.label ? 'flex flex-row gap-1' : ''}`}
          >
            {customer.label ? <p className="text-white font-semibold">{customer.label}</p> : null}
            <CustomerName
              customer={customer.customerName}
              customerId={customer.customerId}
              salesRepId={customer.salesRepId}
              fontSize={renderRules?.fontSize}
              mxAuto={renderRules?.mxAuto}
            />
          </aside>
        );
      })}
    </div>
  );
}
