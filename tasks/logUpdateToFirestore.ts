import { Firestore } from "firebase-admin/firestore";
import { Update } from "../telegram-bot/types/Update";

export async function logUpdateToFirestore(
  db: Firestore,
  update: Update
): Promise<void> {
  await db.collection("telegram_updates").add(update);
}
