'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useAdminProxy } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { KeyRound, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface AdvertiserApplication {
    id: string;
    userName: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
}

interface Tenant {
    id: string;
    name: string;
    createdAt: string;
}

type NotificationItem = {
    id: string;
    type: 'new_application' | 'new_tenant';
    text: string;
    timestamp: Date;
    href: string;
    icon: React.ElementType;
};

const NotificationRowSkeleton = () => (
    <div className="flex items-center space-x-4 p-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 flex-grow">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/4" />
        </div>
    </div>
);


export function NotificationsClient() {
    useProtectedRoute({ adminOnly: true });

    const { data: applications, isLoading: appsLoading } = useAdminProxy<AdvertiserApplication>('advertiserApplications');
    const { data: tenants, isLoading: tenantsLoading } = useAdminProxy<Tenant>('tenants');
    
    const notifications = React.useMemo(() => {
        const allNotifications: NotificationItem[] = [];

        applications?.forEach(app => {
            if (app.status === 'pending') {
                allNotifications.push({
                    id: `app-${app.id}`,
                    type: 'new_application',
                    text: `${app.userName} submitted an advertiser application.`,
                    timestamp: new Date(app.submittedAt),
                    href: '/admin/users',
                    icon: UserPlus
                });
            }
        });
        
        tenants?.forEach(tenant => {
             allNotifications.push({
                id: `tenant-${tenant.id}`,
                type: 'new_tenant',
                text: `A new tenant, ${tenant.name}, was created.`,
                timestamp: new Date(tenant.createdAt),
                href: '/admin/api-management',
                icon: KeyRound
            });
        });

        return allNotifications.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());

    }, [applications, tenants]);

    const isLoading = appsLoading || tenantsLoading;

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Notifications</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>System Notifications</CardTitle>
                    <CardDescription>A log of important events like new applications and tenant registrations.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                        {isLoading ? (
                            Array.from({length: 5}).map((_, i) => <NotificationRowSkeleton key={i} />)
                        ) : notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div key={notification.id} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/80">
                                    <notification.icon className="h-6 w-6 text-primary" />
                                    <div className="flex-grow">
                                        <p className="font-medium">{notification.text}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                        </p>
                                    </div>
                                    <Button asChild variant="secondary" size="sm">
                                        <Link href={notification.href}>View</Link>
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                No notifications to display.
                            </div>
                        )}
                   </div>
                </CardContent>
            </Card>
        </>
    );
}
