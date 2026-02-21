
import type { Metadata } from 'next';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export const metadata: Metadata = {
  title: 'My Dashboard | VSD Network',
  description: 'Your personal VSD Network banking suite. View your balance, transaction history, and manage your assets.',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
