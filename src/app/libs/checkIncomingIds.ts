export function checkIncomingId(id?: string | null) {
  if (!id) return null;

  return parseInt(id);
}
