import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseApp } from "./firebase/server/app";
import { echoInPrivateChat } from "./tasks/echoInPrivateChat";
import { findAndBanSpammers } from "./tasks/findAndBanSpammers";
import { logUpdateToFirestore } from "./tasks/logUpdateToFirestore";
import { Update } from "./telegram-bot/types/Update";

export interface TelegramBot {
  (update: Update): Promise<void>;
}

export const handleUpdate: TelegramBot = async (
  update: Update
): Promise<void> => {
  const app = getFirebaseApp();
  const db = getFirestore(app);

  const findAndBanSpammerTask = findAndBanSpammers(db, update);
  const logUpdateTask = logUpdateToFirestore(db, update);
  const echoInPrivateChatTask = echoInPrivateChat(update);

  await Promise.all([
    logUpdateTask,
    findAndBanSpammerTask,
    echoInPrivateChatTask,
  ]);
};
