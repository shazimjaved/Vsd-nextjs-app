
import type { Metadata } from 'next';
import { AdminDashboard } from '@/app/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | VSD Network',
  description: 'Manage the VSD Network ecosystem, including tenants, users, and API activity.',
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
