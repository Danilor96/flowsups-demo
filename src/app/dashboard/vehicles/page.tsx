import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function vehiclesPage() {
  const session = await auth();
  const roleId = session?.user?.user_has[0]?.role_id;

  if (roleId == 3) {
    return redirect('/dashboard');
  }

  return <h2>Hola</h2>;
}
