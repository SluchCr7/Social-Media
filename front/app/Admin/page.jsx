import AdminLayout from '../Component/Admin/AdminLayout';
import Admin from './AdminPage';

export const metadata = {
  title: 'Admin Dashboard',
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <Admin /> 
    </AdminLayout>
  );
}
