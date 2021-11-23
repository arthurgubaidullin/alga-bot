import { getFirestore } from "./firebase/server/firestore";
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
  const db = getFirestore();

  const findAndBanSpammerTask = findAndBanSpammers(db, update);
  const logUpdateTask = logUpdateToFirestore(db, update);
  const echoInPrivateChatTask = echoInPrivateChat(update);

  await Promise.all([
    logUpdateTask,
    findAndBanSpammerTask,
    echoInPrivateChatTask,
  ]);
};
