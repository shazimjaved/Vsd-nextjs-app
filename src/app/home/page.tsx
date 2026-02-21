
import type { Metadata } from 'next';
import { HomeClient } from '@/components/home/HomeClient';

export const metadata: Metadata = {
  title: 'VSD Network | The Currency for the AI-Powered Creator Economy',
  description: 'VSD is a decentralized financial network for the Independent Media Group (IMG), providing access to previously gate-kept AI services through a user-centric ad-revenue model and the VSD utility token.',
};

export default function HomePage() {
  return <HomeClient />;
}
