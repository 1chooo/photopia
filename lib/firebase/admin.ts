import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

export function getAdminApp(): App {
  if (!adminApp) {
    if (getApps().length === 0) {
      // Validate environment variables
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          'Missing Firebase Admin credentials. Please check your .env.local file:\n' +
          `FIREBASE_PROJECT_ID: ${projectId ? '✓' : '✗'}\n` +
          `FIREBASE_CLIENT_EMAIL: ${clientEmail ? '✓' : '✗'}\n` +
          `FIREBASE_PRIVATE_KEY: ${privateKey ? '✓' : '✗'}`
        );
      }

      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      adminApp = getApps()[0];
    }
  }
  return adminApp;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    const app = getAdminApp();
    adminDb = getFirestore(app);
  }
  return adminDb;
}
