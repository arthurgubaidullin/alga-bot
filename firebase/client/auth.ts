import {
  getAuth as _getAuth,
  GithubAuthProvider,
  onAuthStateChanged as _onAuthStateChanged,
  signInWithPopup,
  signOut as _signOut,
  User,
} from "firebase/auth";
import { getFirebaseApp } from "./app";

export const getAuth = () => _getAuth(getFirebaseApp());

export const onAuthStateChanged = (cb: (u: User | null) => void) =>
  _onAuthStateChanged(getAuth(), cb);

export const signInWithGithub = () =>
  signInWithPopup(getAuth(), new GithubAuthProvider()).catch((reason) => {
    if (reason.code === "auth/popup-closed-by-user") {
      console.warn(reason);
      return;
    }
    throw reason;
  });

export const signOut = () => _signOut(getAuth());
