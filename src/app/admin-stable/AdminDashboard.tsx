'use client';

import * as React from 'react';
import {
  ArrowUpRight,
  DollarSign,
  Users,
  KeyRound,
  Coins
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAdminProxy } from '@/firebase';
import type { Account } from '@/types/account';
import type { Tenant } from '@/types/tenant';

interface AdvertiserApplication {
    id: string;
    userName: string;
    companyName: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
}

const StatCard = ({ title, value, icon: Icon, description, isLoading }: { title: string, value: string, icon: React.ElementType, description: string, isLoading: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{value}</div>}
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
)

export function AdminDashboard() {
  useProtectedRoute({ adminOnly: true });

  const { data: tenants, isLoading: tenantsLoading } = useAdminProxy<Tenant>('tenants');
  const { data: accounts, isLoading: accountsLoading } = useAdminProxy<Account>('accounts');
  const { data: applications, isLoading: applicationsLoading } = useAdminProxy<AdvertiserApplication>('advertiserApplications');

  const totalVSD = accounts?.reduce((sum, acc) => sum + (acc.vsdBalance || 0), 0) ?? 0;
  const totalVSDLite = accounts?.reduce((sum, acc) => sum + (acc.vsdLiteBalance || 0), 0) ?? 0;

  const recentApplications = applications
    ?.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);
  
  const recentTenants = tenants
    ?.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const isLoading = tenantsLoading || accountsLoading || applicationsLoading;

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard 
            title="Total Users" 
            value={accounts?.length.toLocaleString() ?? '0'}
            icon={Users}
            description="Total registered accounts in the network."
            isLoading={isLoading}
        />
         <StatCard 
            title="Connected Tenants" 
            value={tenants?.length.toLocaleString() ?? '0'}
            icon={KeyRound}
            description="Number of integrated partner applications."
            isLoading={isLoading}
        />
         <StatCard 
            title="Total VSD Supply" 
            value={totalVSD.toLocaleString()}
            icon={DollarSign}
            description="Total circulating VSD across all users."
            isLoading={isLoading}
        />
         <StatCard 
            title="Total VSD Lite Supply" 
            value={totalVSDLite.toLocaleString()}
            icon={Coins}
            description="Total rewards points across all users."
            isLoading={isLoading}
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Recent Tenants</CardTitle>
                    <CardDescription>
                        Newly integrated partner applications.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="/admin-stable/api-management">
                        View All
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16"/></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto"/></TableCell>
                                </TableRow>
                            ))
                        ) : recentTenants?.map((tenant) => (
                            <TableRow key={tenant.id}>
                                <TableCell className="font-medium">{tenant.name}</TableCell>
                                <TableCell>
                                    <Badge variant={tenant.status === 'Active' ? 'default' : 'secondary'}>{tenant.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{new Date(tenant.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Advertiser Applications</CardTitle>
                    <CardDescription>
                        Recent applications from users to become advertisers.
                    </CardDescription>
                </div>
                 <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="/admin-stable/users">
                        View All
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Applicant</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Submitted</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {isLoading ? (
                            Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16"/></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto"/></TableCell>
                                </TableRow>
                            ))
                        ) : recentApplications?.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell>
                                    <div className="font-medium">{app.userName}</div>
                                    <div className="text-sm text-muted-foreground">{app.companyName}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={app.status === 'pending' ? 'destructive' : 'default'}>{app.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{new Date(app.submittedAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
