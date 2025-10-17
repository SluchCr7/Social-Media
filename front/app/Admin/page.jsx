import AdminLayout from '../Component/Admin/AdminLayout';
import Admin from './AdminPage';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      {({ activeTab }) => <Admin activeTab={activeTab} />} 
    </AdminLayout>
  );
}
