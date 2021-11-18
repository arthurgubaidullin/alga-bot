import { getFirestore as _getFirestore } from "firebase/firestore";
import { getFirebaseApp } from "./app";

export const getFirestore = () => _getFirestore(getFirebaseApp());
