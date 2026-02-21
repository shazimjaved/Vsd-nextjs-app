
import type { Metadata } from 'next';
import { TokenDistributionClient } from './TokenDistributionClient';

export const metadata: Metadata = {
    title: 'Token Distribution | VSD Admin',
    description: 'Manage and monitor VSD and VSD Lite token distribution.',
};

export default function TokenDistributionPage() {
    return <TokenDistributionClient />;
}
