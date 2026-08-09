import { Metadata } from 'next';
import { Main } from '&/main/Main';
import { auth } from '@/auth';
// import { AsignTasks } from '&/tasks/AsignTasks';
// import { ReceiveTasks } from '&/tasks/ReceiveTasks';
import { AdminDashboard } from '&/dashboard/admin/AdminDashboard';
// import { IncidentButton } from '&/incidentForm/IncidentButton';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const session = await auth();
  const roleId = session?.user?.user_has[0]?.role_id;

  return (
    <div className="relative">
      {/* incident form */}
      {/* <IncidentButton /> */}
      {/* dashboard */}
      <AdminDashboard />
    </div>
  );
}
