import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert('./lib/edflow-2024-firebase-admin.json'),
  });
}

const db = admin.firestore();
export { db, admin };
