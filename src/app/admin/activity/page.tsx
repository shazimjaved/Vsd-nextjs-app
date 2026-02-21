import type { Metadata } from 'next';
import { ActivityLogsClient } from './ActivityLogsClient';

export const metadata: Metadata = {
    title: 'Activity Logs | VSD Admin',
    description: 'View and search API usage and system activity logs.',
};

export default function ActivityLogsPage() {
    return <ActivityLogsClient />;
}
