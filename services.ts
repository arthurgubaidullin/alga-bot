import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { getFirestore } from "./firebase/client/firestore";
import { Spammer } from "./types/Spammer";
import { UserData } from "./types/UserData";

export const getSpammers = async (): Promise<Spammer[]> => {
  const db = getFirestore();
  const ref = query(collectionGroup(db, "spammers"), orderBy("createdAt"));
  const qs = await getDocs(ref);

  const docs = qs.docs.map((s) => {
    const groupId = s.ref.parent.parent?.id as string;

    return { id: s.id, groupId: groupId, ...s.data() } as Spammer;
  });
  return docs;
};

export const getUserData = async (uid: string) => {
  const db = getFirestore();
  const ref = doc(db, "users", uid);
  const s = await getDoc(ref);
  if (!s.exists) {
    return null;
  }
  return s.data() as UserData;
};
