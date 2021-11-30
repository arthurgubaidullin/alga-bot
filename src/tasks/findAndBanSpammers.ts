import { Logger } from "../logger";
import type { Program } from "../program";
import { TelegramPost } from "../telegram-bot/post";
import { BanChatMemberParams } from "../telegram-bot/types/methods/banChatMember";
import { deleteMessageParams } from "../telegram-bot/types/methods/deleteMessage";
import type { Update } from "../telegram-bot/types/Update";

export const findAndBanSpammers =
  (P: Program) =>
  async (update: Update): Promise<void> => {
    const message = update.message;
    const chat = message?.chat;
    const newChatMembers = message?.new_chat_members;

    if (
      newChatMembers &&
      chat &&
      (chat.type === "group" || chat.type === "supergroup") &&
      newChatMembers.length > 0
    ) {
      const spammers = newChatMembers
        .map((m) =>
          P.isSpam(`${m.first_name}${m.last_name || ""}`)
            ? {
                id: m.id,
                firstName: m.first_name,
                ...(m.last_name ? { lastName: m.last_name } : {}),
              }
            : null
        )
        .filter(
          <T>(spammer: T): spammer is NonNullable<T> =>
            spammer !== null
        );

      const maybeDeleteMessageTask =
        spammers.length > 0
          ? deleteMessage(P)({
              chat_id: chat.id,
              message_id: message.message_id,
            })
          : Promise.resolve(undefined);

      await Promise.all(
        spammers.map(async (spammer) => {
          const uid = spammer.id;

          const banTask = banChatMember(P)({
            chat_id: chat.id,
            user_id: uid,
            revoke_messages: true,
          });

          await Promise.all([banTask]);
        })
      );
      await maybeDeleteMessageTask;
    }
  };

function banChatMember(
  P: TelegramPost & Logger
): (params: BanChatMemberParams) => Promise<void> {
  return async (params: BanChatMemberParams) => {
    await P.info("Trying to ban a chat member", params);
    const resp = await P.post("banChatMember")(params);
    if (resp.ok && resp.result) {
      await P.info("Chat member banned", params);
    } else {
      await P.info("The chat member was not banned", params);
    }
  };
}

function deleteMessage(
  P: TelegramPost & Logger
): (params: deleteMessageParams) => Promise<void> {
  return async (params) => {
    await P.info("Trying to delete a message", params);
    const resp = await P.post("deleteMessage")(params);
    if (resp.ok && resp.result) {
      await P.info("Message deleted", params);
    } else {
      await P.info("The message was not deleted", params);
    }
  };
}
