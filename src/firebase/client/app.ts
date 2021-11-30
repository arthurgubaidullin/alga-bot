import { initializeApp, getApp, getApps } from "firebase/app";
import { firebaseConfig } from "./config";

export const getFirebaseApp = () =>
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
