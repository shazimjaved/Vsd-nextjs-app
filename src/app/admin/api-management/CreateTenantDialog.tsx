'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminProxyCreate, useUser } from '@/firebase';

const tenantSchema = z.object({
    name: z.string().min(3, "Tenant name must be at least 3 characters."),
    domain: z.string().url("Please enter a valid domain (e.g., https://example.com)."),
});

type TenantFormValues = z.infer<typeof tenantSchema>;

function generateApiKey() {
    const prefix = 'vsd_';
    const randomPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return prefix + randomPart;
}

export function CreateTenantDialog() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { toast } = useToast();
    const { user } = useUser();
    
    const form = useForm<TenantFormValues>({
        resolver: zodResolver(tenantSchema),
        defaultValues: { name: '', domain: '' },
    });

    const onSubmit = async (data: TenantFormValues) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in.' });
            return;
        }
        setIsSubmitting(true);
        const newTenant = {
            ...data,
            apiKey: generateApiKey(),
            status: 'Active' as const,
            createdAt: new Date().toISOString(),
        };

        try {
            const idToken = await user.getIdToken(true);
            await adminProxyCreate(idToken, 'tenants', newTenant);
            toast({
                title: 'Tenant Created',
                description: `Successfully created tenant "${data.name}".`,
            });
            form.reset();
            setIsOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Creation Failed',
                description: error.message || 'An unexpected error occurred.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Create Tenant
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Tenant</DialogTitle>
                    <DialogDescription>
                        Register a new partner application to generate an API key for them.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tenant Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., My Awesome App" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="domain"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tenant Domain</FormLabel>
                                    <FormControl>
                                        <Input type="url" placeholder="https://example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSubmitting ? 'Creating...' : 'Create Tenant'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
