import type { Program } from "../program";
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
          ? P.post("deleteMessage")({
              chat_id: chat.id,
              message_id: message.message_id,
            })
          : Promise.resolve(undefined);

      await Promise.all(
        spammers.map(async (spammer) => {
          const uid = spammer.id;

          const banTask = P.post("banChatMember")({
            chat_id: chat.id,
            user_id: uid,
            revoke_messages: true,
          }).then((a) => P.log("ban result", a));

          await Promise.all([banTask]);
        })
      );
      await maybeDeleteMessageTask;
    }
  };
