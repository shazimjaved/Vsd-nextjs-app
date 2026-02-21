
import type { Metadata } from 'next';
import { AdvertiserDashboard } from '@/app/advertiser/AdvertiserDashboard';

export const metadata: Metadata = {
  title: 'Advertiser Dashboard | VSD Network',
  description: 'Manage your advertising campaigns and view performance reports on the VSD Network.',
};

export default function AdvertiserDashboardPage() {
  return <AdvertiserDashboard />;
}
