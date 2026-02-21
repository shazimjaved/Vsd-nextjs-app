
import { NextResponse } from 'next/server';
import { getApps, getApp, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, Firestore, FieldValue, type Transaction as FirestoreTransaction } from 'firebase-admin/firestore';
import { siteConfig } from '@/config/site';

const { CONVERSION_RATE } = siteConfig.tokenValues;

// --- Memoized Firebase Admin SDK Initialization ---
let adminApp: App | undefined;
let db: Firestore | undefined;

function getDb(): Firestore {
  if (!db) {
    if (getApps().length === 0) {
      // In a deployed Firebase App Hosting environment, initializeApp() with no arguments
      // automatically uses the project's service account credentials.
      // For local development, you can either:
      // 1. Set GOOGLE_APPLICATION_CREDENTIALS environment variable pointing to your service account JSON
      // 2. Or pass the credentials directly here
      try {
        adminApp = initializeApp();
      } catch (error) {
        // If automatic initialization fails (local dev), try with explicit credentials
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          // Credentials will be loaded from the file path in GOOGLE_APPLICATION_CREDENTIALS
          adminApp = initializeApp();
        } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
          // Alternative: use base64 encoded service account key from env
          const serviceAccount = JSON.parse(
            Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString()
          );
          adminApp = initializeApp({
            credential: cert(serviceAccount),
          });
        } else {
          console.warn('Firebase Admin: No credentials found. Some features may not work in local development.');
          // Try to initialize anyway - might work in deployed environments
          adminApp = initializeApp();
        }
      }
    } else {
      adminApp = getApp();
    }
    db = getFirestore(adminApp);
  }
  return db;
}
// --- End Firebase Admin SDK Initialization ---

async function logApiRequest(logData: Omit<any, 'id' | 'timestamp'>) {
    try {
        const firestore = getDb();
        const logEntry = {
            ...logData,
            timestamp: new Date().toISOString(),
        };
        await firestore.collection('api_logs').add(logEntry);
    } catch (error) {
        console.error('API_LOGGING_FAILED: Could not write to api_logs collection.', {
            error,
            logData,
        });
    }
}


export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const apiKey = authHeader?.split(' ')[1];
  const requestUrl = new URL(request.url);
  const endpoint = requestUrl.pathname;
  let tenantDoc;
  let tenant;

  // 1. Authenticate the Tenant (your Deepsound site)
  if (!apiKey) {
    await logApiRequest({ status: 'Failure', endpoint, message: 'Authentication error: Missing API key.' });
    return NextResponse.json({ error: 'Unauthorized: API key is required.' }, { status: 401 });
  }

  try {
    const firestore = getDb();
    const tenantsSnapshot = await firestore.collection('tenants').where('apiKey', '==', apiKey).limit(1).get();
    
    if (tenantsSnapshot.empty) {
        await logApiRequest({ status: 'Failure', endpoint, message: 'Authentication error: Invalid API key provided.' });
        return NextResponse.json({ error: 'Unauthorized: Invalid API key.' }, { status: 401 });
    }

    tenantDoc = tenantsSnapshot.docs[0];
    tenant = tenantDoc?.data();

  } catch (dbError: any) {
      console.error('FIRESTORE_CONNECTION_ERROR: Failed to validate API key.', { errorMessage: dbError.message, endpoint });
      return NextResponse.json({ error: 'Internal Server Error: Could not verify credentials.' }, { status: 500 });
  }

  await logApiRequest({
      status: 'Success',
      tenantId: tenantDoc.id,
      tenantName: tenant.name,
      endpoint,
      message: `VSD Lite payment request from ${tenant.name}`,
  });
  
  // 2. Process the Payment
  try {
    const body = await request.json();
    const { userId, amount: vsdAmount, description } = body;

    if (!userId || typeof vsdAmount !== 'number' || vsdAmount <= 0) {
      return NextResponse.json({ error: 'Invalid request: userId and a positive amount (in VSD) are required.' }, { status: 400 });
    }

    const firestore = getDb();
    const userAccountRef = firestore.collection('accounts').doc(userId);
    
    // Convert the VSD amount to the VSD Lite amount
    const vsdLiteAmount = vsdAmount * CONVERSION_RATE;

    const result = await firestore.runTransaction(async (transaction: FirestoreTransaction) => {
        const userDoc = await transaction.get(userAccountRef);
        if (!userDoc.exists) {
            throw new Error('User account not found.');
        }

        const currentBalance = userDoc.data()?.vsdLiteBalance || 0;
        if (currentBalance < vsdLiteAmount) {
            throw new Error('Insufficient VSD Lite balance.');
        }

        // Debit the user's VSD Lite balance
        transaction.update(userAccountRef, {
            vsdLiteBalance: FieldValue.increment(-vsdLiteAmount)
        });

        // Log the transaction in the user's subcollection
        const userTransactionsRef = userAccountRef.collection('transactions').doc();
        transaction.set(userTransactionsRef, {
            type: 'out',
            amount: vsdLiteAmount,
            date: new Date().toISOString(),
            status: 'Completed',
            description: description || `Payment on ${tenant.name}`,
            to: tenant.name,
        });

        return { success: true, newBalance: currentBalance - vsdLiteAmount, amountDebited: vsdLiteAmount, currency: 'VSD Lite' };
    });

    // Return a success response
    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('VSD_LITE_PAYMENT_ERROR:', { errorMessage: error.message });
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
