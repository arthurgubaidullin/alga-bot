import { Program } from "./program";
import { echoInPrivateChat } from "./tasks/echoInPrivateChat";
import { findAndBanSpammers } from "./tasks/findAndBanSpammers";
import { Update } from "./telegram-bot/types/Update";

export interface TelegramBot {
  (update: Update): Promise<void>;
}

export const handleUpdate =
  (P: Program): TelegramBot =>
  async (update: Update): Promise<void> => {
    const findAndBanSpammerTask = findAndBanSpammers(P)(update);
    const echoInPrivateChatTask = echoInPrivateChat(P)(update);

    await Promise.all([
      findAndBanSpammerTask,
      echoInPrivateChatTask,
    ]);
  };
