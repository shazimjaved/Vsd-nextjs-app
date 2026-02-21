
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// --- DO NOT MODIFY THIS FUNCTION ---
// This function is designed to work with Firebase App Hosting's automatic configuration.
// It safely initializes Firebase, falling back to the local config for development.
function initializeFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }
  try {
    // This will succeed in a deployed Firebase App Hosting environment.
    // It uses the server-provided configuration.
    return initializeApp();
  } catch (e) {
    // This will fail in local development or other environments.
    // We fall back to the explicit config object.
    if (process.env.NODE_ENV !== 'production') {
       console.warn(
        "Firebase automatic initialization failed, likely because you're in a non-production environment. Falling back to the firebaseConfig object. This is expected during local development.",
      );
    }
    return initializeApp(firebaseConfig);
  }
}

/**
 * Initializes and returns the core Firebase SDKs.
 * This function is idempotent and safe to call multiple times.
 */
export function initializeFirebase(): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore } {
  const firebaseApp = initializeFirebaseApp();
  
  // Return the initialized services.
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

// --- End of Initialization Logic ---


export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
// Export useUser from auth/use-user.ts (not from provider to avoid conflicts)
export { useUser, type UserHookResult } from './auth/use-user';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
export * from './admin-proxy';
// Export useMemoFirebase from provider
export { useMemoFirebase } from './provider';

