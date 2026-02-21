
import type { Metadata } from 'next';
import { NotificationsClient } from './NotificationsClient';

export const metadata: Metadata = {
    title: 'Notifications | VSD Admin',
    description: 'View system notifications and alerts.',
};

export default function NotificationsPage() {
    return <NotificationsClient />;
}
