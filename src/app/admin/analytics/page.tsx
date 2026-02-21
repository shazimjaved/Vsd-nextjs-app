
import type { Metadata } from 'next';
import { AnalyticsClient } from './AnalyticsClient';

export const metadata: Metadata = {
    title: 'Analytics | VSD Admin',
    description: 'Visualize token distribution and API usage trends.',
};

export default function AnalyticsPage() {
    return <AnalyticsClient />;
}
