import { sendMessage } from "../telegram-bot/methods";
import { Update } from "../telegram-bot/types/Update";

export async function echoInPrivateChat(update: Update) {
  if (
    update.message &&
    update.message.chat &&
    update.message.from &&
    update.message.text &&
    !update.message.from.is_bot &&
    update.message.chat.type === "private"
  ) {
    await sendMessage({
      chatId: update.message.chat.id,
      text: update.message.text,
      replyToMessageId: update.message.message_id,
    });
  }
}
