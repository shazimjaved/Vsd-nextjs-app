
'use client';

import * as React from 'react';
import {
  DollarSign,
  Users,
  KeyRound,
  Coins,
  Library,
  Banknote,
  Globe,
  Wallet,
  Send,
  Loader2
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useTokenMetrics } from '@/hooks/useTokenMetrics';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const StatCard = ({ title, value, icon: Icon, description, isLoading, valueClassName }: { title: string, value: string, icon: React.ElementType, description: string, isLoading: boolean, valueClassName?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>}
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
)

export function AdminDashboard() {
  useProtectedRoute({ adminOnly: true });
  const { metrics, airdropPreview, simulateAirdrop } = useTokenMetrics();
  const [airdropInput, setAirdropInput] = React.useState('');
  const { toast } = useToast();

  const handleAirdropSimulation = () => {
    if (!airdropInput) {
      toast({ variant: 'destructive', title: 'Input Required', description: 'Please enter a valid JSON distribution.' });
      return;
    }
    try {
      const distribution = JSON.parse(airdropInput);
      const resultMessage = simulateAirdrop(distribution);
      toast({
        title: 'Airdrop Simulation',
        description: resultMessage,
        variant: resultMessage.includes('exceeds') ? 'destructive' : 'default'
      });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Invalid JSON', description: 'Please check the format. Example: {"uid1":1000, "uid2":500}' });
    }
  };


  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard &amp; Token Metrics</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard 
            title="Total VSD Supply" 
            value={metrics.totalSupply.toLocaleString()}
            icon={Library}
            description="The maximum and total supply of VSD."
            isLoading={metrics.loading}
        />
        <StatCard 
            title="Circulating VSD" 
            value={metrics.circulatingVSD.toLocaleString()}
            icon={Globe}
            description="Total VSD held by all users."
            isLoading={metrics.loading}
        />
         <StatCard 
            title="VSD in Treasury" 
            value={metrics.treasuryVSD.toLocaleString()}
            icon={Banknote}
            description="Total Supply - Circulating Supply."
            isLoading={metrics.loading}
        />
         <StatCard 
            title="Circulating VSD Lite" 
            value={metrics.circulatingVSDLite.toLocaleString()}
            icon={Coins}
            description="Total rewards points across all users."
            isLoading={metrics.loading}
            valueClassName="text-yellow-400"
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
                <CardTitle>Airdrop Simulator</CardTitle>
                <CardDescription>
                    Enter a JSON object of user UIDs and token amounts to simulate a VSD airdrop from the treasury.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder='{"uid1": 1000, "uid2": 5000}'
                    value={airdropInput}
                    onChange={(e) => setAirdropInput(e.target.value)}
                    className="h-24 font-mono text-xs"
                />
            </CardContent>
            <CardFooter className="justify-between">
                 <Button onClick={handleAirdropSimulation}>
                    <Send className="mr-2 h-4 w-4" />
                    Simulate Airdrop
                </Button>
                <Button variant="secondary" disabled>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Execute Airdrop (Coming Soon)
                </Button>
            </CardFooter>
        </Card>
        
        {Object.keys(airdropPreview).length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Airdrop Preview</CardTitle>
                    <CardDescription>
                        This is a preview of the distribution. No balances have been changed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="max-h-48 overflow-y-auto">
                    <ul className="space-y-2">
                        {Object.entries(airdropPreview).map(([uid, amount]) => (
                            <li key={uid} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded-md">
                                <span className="font-mono text-xs text-muted-foreground">{uid}</span>
                                <span className="font-bold">{amount.toLocaleString()} VSD</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        )}
      </div>
    </>
  );
}
