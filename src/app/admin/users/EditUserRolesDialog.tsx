'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { adminProxyWrite, useUser } from '@/firebase';
import type { Account } from '@/types/account';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface EditUserRolesDialogProps {
    user: Account;
    onClose: () => void;
}

const ALL_ROLES = ['user', 'advertiser', 'admin'];

export function EditUserRolesDialog({ user: editingUser, onClose }: EditUserRolesDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [selectedRoles, setSelectedRoles] = React.useState<string[]>(editingUser.roles || ['user']);
    const { toast } = useToast();
    const { user: adminUser } = useUser();

    const handleRoleChange = (role: string, checked: boolean) => {
        setSelectedRoles(prev => {
            if (checked) {
                return [...prev, role];
            } else {
                // Ensure 'user' role is always present
                if (role === 'user') return prev;
                return prev.filter(r => r !== role);
            }
        });
    };

    const handleSubmit = async () => {
        if (!adminUser) return;
        setIsSubmitting(true);
        try {
            const idToken = await adminUser.getIdToken(true);
            await adminProxyWrite(idToken, 'accounts', editingUser.uid, { roles: selectedRoles });
            toast({
                title: 'Roles Updated',
                description: `Successfully updated roles for ${editingUser.displayName}.`,
            });
            onClose();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: error.message || 'An unexpected error occurred.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Roles for {editingUser.displayName}</DialogTitle>
                    <DialogDescription>
                        Assign or remove roles for this user. The 'user' role cannot be removed.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {ALL_ROLES.map(role => (
                        <div key={role} className="flex items-center space-x-2">
                            <Checkbox
                                id={role}
                                checked={selectedRoles.includes(role)}
                                onCheckedChange={(checked) => handleRoleChange(role, !!checked)}
                                disabled={role === 'user'}
                            />
                            <Label htmlFor={role} className="capitalize">{role}</Label>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
