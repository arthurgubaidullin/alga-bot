import { getFirestore as _getFirestore } from "firebase-admin/firestore";
import { getFirebaseApp } from "./app";

export const getFirestore = () => _getFirestore(getFirebaseApp());
