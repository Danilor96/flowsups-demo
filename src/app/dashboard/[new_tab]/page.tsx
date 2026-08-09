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

export default async function DashboardPage({ params }: { params: { new_tab: string } }) {
  const session = await auth();
  const roleId = session?.user?.user_has[0]?.role_id;

  const urlArray = params.new_tab.split('/');
  const url = urlArray[urlArray.length - 1];

  return (
    <Main>
      {/* incident form */}
      {/* <IncidentButton /> */}
      {/* dashboard */}
      <AdminDashboard newTabUrl={url} />
    </Main>
  );
}
