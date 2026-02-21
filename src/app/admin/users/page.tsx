import type { Metadata } from 'next';
import { UserManagementClient } from './UserManagementClient';

export const metadata: Metadata = {
    title: 'User Management | VSD Admin',
    description: 'Manage user roles, statuses, and advertiser applications.',
};

export default function UserManagementPage() {
    return <UserManagementClient />;
}
