interface SellerProp {
  id: number;
  last_name: string | null;
  email: string;
  name: string | null;
}

export function UserAssignedName({
  userName,
  userLastname,
  seller,
}: {
  userName?: string;
  userLastname?: string;
  seller?: SellerProp | null;
}) {
  // ----- global states -----

  // ----- local states -----
  if (!userName && !userLastname && !seller) return <p>No user assigned</p>;

  const sellerFullName = seller ? `${seller.name || ''} ${seller.last_name || ''}` : `${userName} ${userLastname}`;

  return <p>{sellerFullName}</p>;
}
