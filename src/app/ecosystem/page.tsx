
import type { Metadata } from 'next';
import { EcosystemClient } from '@/components/ecosystem/EcosystemClient';

export const metadata: Metadata = {
  title: 'VSD Token Ecosystem | The IMG Hub',
  description: 'Explore the diverse range of AI tools, dApps, and partner platforms integrating the VSD utility token within the Independent Media Group (IMG) ecosystem.',
};

export default function EcosystemPage() {
  return <EcosystemClient />;
}
