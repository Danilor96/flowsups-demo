import { useCan } from '@/hooks/permissions';

export function Can({
  children,
  requiredPermission,
  fallback = null,
}: {
  requiredPermission: number | number[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { can } = useCan();

  if (can(requiredPermission)) {
    return children;
  }

  return fallback
}
