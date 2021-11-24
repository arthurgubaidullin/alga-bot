import type { Firestore } from "firebase-admin/firestore";
import type { Update } from "../telegram-bot/types/Update";

export const logUpdateToFirestore =
  (P: { getFirestore(): Firestore }) =>
  async (update: Update): Promise<void> => {
    await P.getFirestore()
      .collection("telegram_updates")
      .add(update);
  };
