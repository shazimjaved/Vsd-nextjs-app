'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useAuth } from '@/firebase';

const PROXY_URL = process.env.NEXT_PUBLIC_ADMIN_PROXY_URL || 'http://127.0.0.1:5001/vsd-network/us-central1/adminProxy';

async function fetchWithAuth(url: string, options: RequestInit = {}, idToken: string | null) {
    if (!idToken) {
        throw new Error('Authentication required.');
    }

    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${idToken}`);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch from admin proxy' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export function useAdminProxy<T>(collectionName: string, options: { reset_balances?: boolean } = {}) {
    const [data, setData] = useState<T[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, isUserLoading } = useUser();
    
    const fetchData = useCallback(async () => {
        if (isUserLoading || !user) {
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const idToken = await user.getIdToken(true);
            let url = `${PROXY_URL}?collection=${collectionName}`;
            if (options.reset_balances) {
                url += '&reset_balances=true';
            }
            const result = await fetchWithAuth(url, {}, idToken);

            if (result && Array.isArray(result.docs)) {
                setData(result.docs);
            } else {
                setData([]);
            }

        } catch (err: any) {
            setError(err.message);
            console.error(`Failed to fetch collection ${collectionName}:`, err);
        } finally {
            setIsLoading(false);
        }
    }, [collectionName, user, isUserLoading, options.reset_balances]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}


export async function adminProxyCreate(idToken: string, collection: string, data: any) {
    if (!idToken) throw new Error("Authentication required for create operation.");
    return fetchWithAuth(PROXY_URL, {
        method: 'POST',
        body: JSON.stringify({ op: 'create', collection, data }),
    }, idToken);
}

export async function adminProxyWrite(idToken: string, collection: string, docId: string, data: any) {
    if (!idToken) throw new Error("Authentication required for write operation.");
    return fetchWithAuth(PROXY_URL, {
        method: 'POST',
        body: JSON.stringify({ op: 'write', collection, docId, data }),
    }, idToken);
}

export async function adminProxyDelete(idToken: string, collection: string, docId: string) {
    if (!idToken) throw new Error("Authentication required for delete operation.");
    return fetchWithAuth(PROXY_URL, {
        method: 'POST',
        body: JSON.stringify({ op: 'delete', collection, docId }),
    }, idToken);
}
