import { FieldValue, Firestore } from "firebase-admin/firestore";
import { isSpam } from "../spam-detector";
import { banChatMember } from "../telegram-bot/methods";
import { Update } from "../telegram-bot/types/Update";

export async function findAndBanSpammers(
  db: Firestore,
  update: Update
): Promise<void> {
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
      .filter(<T>(spammer: T): spammer is NonNullable<T> => spammer !== null);

    await Promise.all(
      spammers.map(async (spammer) => {
        const uid = spammer.id;
        const ref = db
          .collection(`telegram_${chat.type}s`)
          .doc(chat.id.toString())
          .collection("spammers")
          .doc(uid.toString());

        const banTask = banChatMember({
          chatId: chat.id,
          userId: uid,
        });

        const createDocTask = ref.create({
          id: uid.toString(),
          firstName: spammer.firstName,
          lastName: spammer.lastName || "",
          createdAt: FieldValue.serverTimestamp(),
        });

        await Promise.all([createDocTask, banTask]);
      })
    );
  }
}
