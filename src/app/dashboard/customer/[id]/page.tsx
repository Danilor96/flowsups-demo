import { auth } from '@/auth';
import { Metadata } from 'next';
import CustomerDetailWrapper from '../CustomerDetailWrapper';
import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/app/ui/dashboard/admin/AdminDashboard';
import { Roles } from '@/app/libs/definitions/users/users';
import { getCustomerRelatedUsers } from '@/app/libs/data';
import { Permissions } from '@/app/libs/definitions/permissions/permissions';

export const metadata: Metadata = {
  title: 'Dashboard - Customer',
};

export default async function DashboardPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const roleId = session?.user?.user_has[0]?.role_id;
  const userPermissions = session?.user?.user_has[0]?.role.roles_has[0]?.permission_id;
  const userId = session?.user.id;
  const relatedUsers = await getCustomerRelatedUsers(params.id);

  if (!session?.user || !userId) {
    return redirect('/');
  }

  const adminRoles = [Roles.Superuser, Roles.Administrator];

  const isAdmin = !!roleId && adminRoles.includes(roleId);

  const hasPermissionToProceed =
    !!userPermissions && userPermissions.includes(Permissions.CustomerViewAnyCustomer);

  const isAssigned = relatedUsers?.includes(userId);

  if (!isAdmin && !hasPermissionToProceed && !isAssigned) {
    return redirect('/dashboard');
  }

  return (
    <div className="relative">
      <AdminDashboard />
      <CustomerDetailWrapper customerId={Number(params.id)} />
    </div>
  );
}
