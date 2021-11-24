import { TelegramPost } from "../telegram-bot/post";
import { Update } from "../telegram-bot/types/Update";

export const echoInPrivateChat =
  (P: TelegramPost) => async (update: Update) => {
    if (
      update.message &&
      update.message.chat &&
      update.message.from &&
      update.message.text &&
      !update.message.from.is_bot &&
      update.message.chat.type === "private"
    ) {
      await P.post("sendMessage")({
        chat_id: update.message.chat.id,
        text: update.message.text,
        reply_to_message_id: update.message.message_id,
      });
    }
  };
