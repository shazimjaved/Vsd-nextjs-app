import type { Metadata } from 'next';
import { ApiManagementClient } from './ApiManagementClient';

export const metadata: Metadata = {
    title: 'API Management | VSD Admin',
    description: 'Manage tenant API keys and integrations.',
};

export default function ApiManagementPage() {
    return <ApiManagementClient />;
}
