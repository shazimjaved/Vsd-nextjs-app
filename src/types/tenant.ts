
export interface Tenant {
    id: string;
    name: string;
    domain: string;
    apiKey: string;
    status: 'Active' | 'Inactive';
    createdAt: string;
}
