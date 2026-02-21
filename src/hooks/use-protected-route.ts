
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ProtectionOptions {
  adminOnly?: boolean;
  advertiserOnly?: boolean;
}

// Hardcoded Super Admin UID for client-side checks
const SUPER_ADMIN_UID = 'eiMBgcJ3KhWGesl8J78oYFHiquy2'; 

export function useProtectedRoute({ adminOnly = false, advertiserOnly = false }: ProtectionOptions = {}) {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdvertiser, setIsAdvertiser] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      // Don't do anything until Firebase auth has loaded.
      if (isAuthLoading) {
        return;
      }
      
      // If auth is loaded and there's no user, redirect to login.
      if (!user) {
        router.push('/login');
        return;
      }

      // --- GUARANTEED SUPER ADMIN ACCESS ---
      // This is the most important check. If the UID matches, grant all access immediately.
      if (user.uid === SUPER_ADMIN_UID) {
        setIsAdmin(true);
        setIsAdvertiser(true); // Super admin is also an advertiser for UI purposes
        setIsLoading(false);
        return; // Stop further checks
      }

      // For all other users, proceed with standard permission checks.
      try {
        let finalIsAdmin = false;
        let finalIsAdvertiser = false;

        // Check for 'admin' role in Firestore 'accounts' collection
        if (firestore) {
            const accountDocRef = doc(firestore, 'accounts', user.uid);
            const accountDoc = await getDoc(accountDocRef);
            if (accountDoc.exists()) {
                const accountData = accountDoc.data();
                finalIsAdmin = accountData.roles?.includes('admin') || false;
                finalIsAdvertiser = accountData.roles?.includes('advertiser') || false;
            }
        }
        
        setIsAdmin(finalIsAdmin);
        setIsAdvertiser(finalIsAdvertiser);
        
        // Enforce route protection based on roles
        if (adminOnly && !finalIsAdmin) {
          console.warn(`Protected Route: Access denied for user ${user.uid}. Required: Admin.`);
          router.push('/dashboard');
        } else if (advertiserOnly && !finalIsAdvertiser) {
          console.warn(`Protected Route: Access denied for user ${user.uid}. Required: Advertiser.`);
          router.push('/dashboard');
        } else {
          // User has sufficient permissions
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        // If there's an error (e.g., Firestore offline), deny access to protected routes as a safety measure.
        if(adminOnly || advertiserOnly) {
          router.push('/login');
        } else {
          setIsLoading(false);
        }
      }
    };

    checkPermissions();

  }, [user, isAuthLoading, firestore, adminOnly, advertiserOnly, router]);

  return { isLoading, isAdmin, isAdvertiser };
}
