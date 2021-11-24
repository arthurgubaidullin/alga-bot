import { getFirestore } from "./firebase/server/firestore";
import { echoInPrivateChat } from "./tasks/echoInPrivateChat";
import { findAndBanSpammers } from "./tasks/findAndBanSpammers";
import { logUpdateToFirestore } from "./tasks/logUpdateToFirestore";
import { post } from "./telegram-bot/post";
import { Update } from "./telegram-bot/types/Update";

export interface TelegramBot {
  (update: Update): Promise<void>;
}

const firestore = {
  getFirestore,
};

const telegramPost = post;

const program = {
  ...firestore,
  ...telegramPost,
};

export const makeBot =
  (P: typeof program): TelegramBot =>
  async (update: Update): Promise<void> => {
    const findAndBanSpammerTask = findAndBanSpammers(P)(update);
    const logUpdateTask = logUpdateToFirestore(P)(update);
    const echoInPrivateChatTask = echoInPrivateChat(P)(update);

    await Promise.all([
      logUpdateTask,
      findAndBanSpammerTask,
      echoInPrivateChatTask,
    ]);
  };

export const handleUpdate: TelegramBot = makeBot(program);
