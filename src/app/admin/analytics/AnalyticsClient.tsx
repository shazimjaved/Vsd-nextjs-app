'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useAdminProxy } from '@/firebase';
import type { Account } from '@/types/account';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';

interface ApiLog {
    id: string;
    timestamp: { _seconds: number; _nanoseconds: number } | string;
    status: 'Success' | 'Failure';
}

const formatTimestamp = (timestamp: ApiLog['timestamp']): Date => {
    if (typeof timestamp === 'string') {
        return parseISO(timestamp);
    }
    if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp) {
        return new Date(timestamp._seconds * 1000);
    }
    return new Date();
};


export function AnalyticsClient() {
    useProtectedRoute({ adminOnly: true });

    const { data: accounts, isLoading: accountsLoading } = useAdminProxy<Account>('accounts');
    const { data: logs, isLoading: logsLoading } = useAdminProxy<ApiLog>('vsd_api_logs');

    const userGrowthData = React.useMemo(() => {
        if (!accounts) return [];
        const monthlyCounts = accounts.reduce((acc, account) => {
            const month = format(parseISO(account.joined), 'yyyy-MM');
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        let cumulativeUsers = 0;
        return Object.keys(monthlyCounts).sort().map(month => {
            cumulativeUsers += monthlyCounts[month];
            return { month: format(new Date(month), 'MMM yy'), users: cumulativeUsers };
        });
    }, [accounts]);
    
    const apiStatusData = React.useMemo(() => {
        if (!logs) return [{ name: 'Success', value: 0 }, { name: 'Failure', value: 0 }];
        const statusCounts = logs.reduce((acc, log) => {
            acc[log.status] = (acc[log.status] || 0) + 1;
            return acc;
        }, { Success: 0, Failure: 0 } as Record<'Success' | 'Failure', number>);
        
        return [{ name: 'Success', value: statusCounts.Success }, { name: 'Failure', value: statusCounts.Failure }];
    }, [logs]);

    const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--destructive))'];

    const isLoading = accountsLoading || logsLoading;

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>User Growth Over Time</CardTitle>
                        <CardDescription>Cumulative number of registered users per month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-[250px] w-full" /> : userGrowthData.length > 0 ? (
                             <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={userGrowthData}>
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))'
                                        }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Users" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : <p className="text-muted-foreground text-center py-10">No user data available.</p>}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>API Request Status</CardTitle>
                        <CardDescription>Distribution of successful vs. failed API requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         {isLoading ? <Skeleton className="h-[250px] w-full" /> : logs && logs.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={apiStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {apiStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))'
                                        }}
                                     />
                                </PieChart>
                            </ResponsiveContainer>
                         ) : <p className="text-muted-foreground text-center py-10">No API log data available.</p>}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
