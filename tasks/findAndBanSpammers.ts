import { FieldValue } from "firebase-admin/firestore";
import { isSpam } from "../spam-detector";
import { TelegramPost } from "../telegram-bot/post";
import { Chat } from "../telegram-bot/types/Chat";
import { Message } from "../telegram-bot/types/Message";
import { Response } from "../telegram-bot/types/Response";
import { Update } from "../telegram-bot/types/Update";

export const findAndBanSpammers =
  (
    P: TelegramPost & {
      getFirestore(): FirebaseFirestore.Firestore;
    }
  ) =>
  async (update: Update): Promise<void> => {
    const db = P.getFirestore();
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
          isSpam(m.first_name + (m.last_name || ""))
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
          ? deleteMessage(P)({ chat, message })
          : Promise.resolve(undefined);

      await Promise.all(
        spammers.map(async (spammer) => {
          const uid = spammer.id;
          const ref = db
            .collection(`telegram_groups`)
            .doc(chat.id.toString())
            .collection("spammers")
            .doc(uid.toString());

          const banTask = P.post("banChatMember")({
            chat_id: chat.id,
            user_id: uid,
            revoke_messages: true,
          }).then((a) => console.log("ban result", a));

          const createDocTask = ref.create({
            id: uid.toString(),
            firstName: spammer.firstName,
            lastName: spammer.lastName || "",
            createdAt: FieldValue.serverTimestamp(),
          });

          await Promise.all([createDocTask, banTask]);
        })
      );
      await maybeDeleteMessageTask;
    }
  };

function deleteMessage(
  P: TelegramPost
): (params: {
  chat: Chat;
  message: Message;
}) => Promise<Response<boolean>> {
  return (params) =>
    P.post("deleteMessage")({
      chat_id: params.chat.id,
      message_id: params.message.message_id,
    });
}
