import { App, cert, initializeApp } from "firebase-admin/app";

let firebaseApp: App | null = null;

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID as string;

export function getFirebaseApp() {
  if (firebaseApp === null) {
    firebaseApp = initializeApp({
      projectId: firebaseProjectId,
      credential: cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
      ),
      databaseURL: `https://${firebaseProjectId}.firebaseio.com`,
    });
  }
  return firebaseApp;
}
