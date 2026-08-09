import { SpecificClient } from '@/app/libs/definitions';

interface SplitSellersInfoProps {
  client: {
    seller?: {
      id: number;
      name: string | null;
      last_name: string | null;
    } | null;
    lead?:
      | {
          isSplitSold?: boolean;
          sellersInSplitDeal?: {
            id: number;
            name: string | null;
            last_name: string | null;
          }[];
        }[]
      | {
          isSplitSold?: boolean;
          sellersInSplitDeal?: {
            id: number;
            name: string | null;
            last_name: string | null;
          }[];
        }
      | null;
  };
}

export function SplitSellersInfo({ client }: SplitSellersInfoProps) {
  const activeLead = Array.isArray(client.lead) 
    ? (client.lead.length > 0 ? client.lead[0] : null)
    : client.lead;

  if (activeLead && activeLead.isSplitSold && activeLead.sellersInSplitDeal && activeLead.sellersInSplitDeal.length > 0) {
    return (
      <div className="flex flex-col gap-0.5">
        {activeLead.sellersInSplitDeal.map((seller, index) => (
          <div key={seller.id}>
            <span className={`leading-tight ${index === 0 ? 'font-medium' : ''}`}>
              {seller.name || ''} {seller.last_name || ''}
            </span>
            {activeLead.sellersInSplitDeal && index < activeLead.sellersInSplitDeal.length - 1 && (
              <div className="w-full border-t border-white/50 my-0.5" />
            )}
          </div>
        ))}
      </div>
    );
  }

  const sellerFullName = client.seller?.id 
    ? `${client.seller.name || ''} ${client.seller.last_name || ''}` 
    : '';

  return <p>{sellerFullName}</p>;
}

export function UsersAssignedTo({ users }: { users: { id: number; name: string | null; last_name: string | null }[] }) {
  if (
    users &&
    users.length > 0
  ) {
    return (
      <div className="flex flex-col gap-0.5">
        {users.map((user, index) => (
          <div key={user.id}>
            <span className={`leading-tight ${index === 0 ? 'font-medium' : ''}`}>
              {user.name || ''} {user.last_name || ''}
            </span>
            {users && index < users.length - 1 && (
              <div className="w-full border-t border-white/50 my-0.5" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return <p></p>;
}
