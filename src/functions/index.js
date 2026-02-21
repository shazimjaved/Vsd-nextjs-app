
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json());

// List of UIDs that are granted permanent admin access, regardless of claims.
const ALLOWED_ADMINS = ["eiMBgcJ3KhWGesl8J78oYFHiquy2", "lzNhwweRAndUfVzCzrAEcXLSrcs1"];
const BANK_UID = "eiMBgcJ3KhWGesl8J78oYFHiquy2";

/**
 * Express middleware that checks if a user is an admin.
 * It verifies the Firebase ID token and checks for a `superAdmin` claim
 * or if the UID is in the hardcoded `ALLOWED_ADMINS` list.
 */
async function authAdminMiddleware(req, res, next) {
  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'Missing ID token' });
    }

    const decoded = await admin.auth().verifyIdToken(idToken, true); // Check for revocation
    
    // --- VSD TOKEN RESET LOGIC ---
    // This is a temporary, one-time operation triggered by the admin login
    // to reset balances as per the user's request.
    if (decoded.uid === BANK_UID && req.query.reset_balances === 'true') {
        const resetFlagRef = db.collection('internal_state').doc('balanceReset');
        const resetFlagDoc = await resetFlagRef.get();

        if (!resetFlagDoc.exists || !resetFlagDoc.data().completed) {
            console.log('Admin login detected. Initiating balance reset...');
            const accountsSnapshot = await db.collection('accounts').get();
            const batch = db.batch();
            let totalLiteBalance = 0;

            accountsSnapshot.forEach(doc => {
                const data = doc.data();
                if (doc.id !== BANK_UID) {
                    totalLiteBalance += data.vsdLiteBalance || 0;
                    batch.update(doc.ref, { vsdBalance: 0, vsdLiteBalance: 0 });
                }
            });

            const bankRef = db.collection('accounts').doc(BANK_UID);
            
            // FIX: Use .set() with merge:true to prevent failure if doc doesn't exist.
            batch.set(bankRef, { 
                vsdBalance: 0, 
                vsdLiteBalance: totalLiteBalance
            }, { merge: true });
            
            await batch.commit();
            await resetFlagRef.set({ completed: true, timestamp: admin.firestore.FieldValue.serverTimestamp() });
            console.log(`Balance reset complete. Consolidated ${totalLiteBalance} VSD Lite to bank.`);
        }
    }
    // --- END OF RESET LOGIC ---

    // Check for superAdmin claim or if UID is in the allowed list.
    const isSuperAdmin = decoded.superAdmin === true || ALLOWED_ADMINS.includes(decoded.uid);
    let isAdminByCollection = false;

    if (!isSuperAdmin) {
        const adminDoc = await db.collection('admins').doc(decoded.uid).get();
        isAdminByCollection = adminDoc.exists;
    }
    
    if (isSuperAdmin || isAdminByCollection) {
        req.adminUid = decoded.uid;
        req.adminClaims = decoded;
        return next();
    }

    // If none of the checks pass, deny access.
    return res.status(403).json({ error: 'Not authorized as admin' });

  } catch (e) {
    console.error('Admin authentication error:', e.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Define the GET endpoint to read collections
app.get('/', authAdminMiddleware, async (req, res) => {
  try {
    const collectionName = req.query.collection;
    if (!collectionName || typeof collectionName !== 'string') {
      return res.status(400).json({ error: '`collection` query parameter is required' });
    }
    
    const snap = await db.collection(collectionName).limit(1000).get();
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Log the admin read activity
    await db.collection('vsd_api_logs').add({
        type: 'admin_read',
        collection: collectionName,
        adminUid: req.adminUid,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        count: docs.length
    });

    res.json({ ok: true, docs });
  } catch (e) {
    console.error('Admin Proxy GET Error:', e);
    res.status(500).json({ error: String(e) });
  }
});

// Define the POST endpoint for write, create, and delete operations
app.post('/', authAdminMiddleware, async (req, res) => {
  try {
    const { op, collection, docId, data } = req.body;
    if (!op || !collection) {
      return res.status(400).json({ error: '`op` and `collection` are required' });
    }

    let logData = {
        collection,
        docId: docId || null,
        adminUid: req.adminUid,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    if (op === 'write') {
      if (!docId) return res.status(400).json({error: 'docId required for write op'});
      await db.collection(collection).doc(docId).set(data, { merge: true });
      await db.collection('vsd_api_logs').add({ ...logData, type: 'admin_write' });
      return res.json({ ok: true });
    }

    if (op === 'create') {
      const snap = await db.collection(collection).add(data);
      await db.collection('vsd_api_logs').add({ ...logData, type: 'admin_create', docId: snap.id });
      return res.json({ ok: true, id: snap.id });
    }

    if (op === 'delete') {
      if (!docId) return res.status(400).json({error: 'docId required for delete op'});
      await db.collection(collection).doc(docId).delete();
      await db.collection('vsd_api_logs').add({ ...logData, type: 'admin_delete' });
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: 'Unsupported operation' });
  } catch (e) {
    console.error('Admin Proxy POST Error:', e);
    res.status(500).json({ error: String(e) });
  }
});

// Export the Express app as a Cloud Function
exports.adminProxy = functions.https.onRequest(app);
