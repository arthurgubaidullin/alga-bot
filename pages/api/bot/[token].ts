import { Axios, AxiosError } from "axios";
import { App, cert, initializeApp } from "firebase-admin/app";
import { FieldValue, Firestore, getFirestore } from "firebase-admin/firestore";
import type { NextApiRequest, NextApiResponse } from "next";
import { isSpam } from "../../../spam-detector";
import { getBotToken } from "../../../telegram-bot/config";
import { banChatMember, sendMessage } from "../../../telegram-bot/methods";
import { Update } from "../../../telegram-bot/types/Update";

let firebaseApp: App | null = null;

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID as string;

function getFirebaseApp() {
  if (firebaseApp === null) {
    firebaseApp = initializeApp({
      projectId: firebaseProjectId,
      credential: cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
      ),
      databaseURL: `https://${firebaseProjectId}.firebaseio.com`,
    });
  }
  return firebaseApp;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.query?.token && req.query.token !== getBotToken()) {
      res.status(403).end();
      return;
    }

    const app = getFirebaseApp();
    const db = getFirestore(app);

    const update = req.body as Update;

    console.log("Update", update);

    const findAndBanSpammerTask = findAndBanSpammers(db, update);
    const logUpdateTask = logUpdateToFirestore(db, update);
    const echoInPrivateChatTask = echoInPrivateChat(update);

    await Promise.all([
      logUpdateTask,
      findAndBanSpammerTask,
      echoInPrivateChatTask,
    ]);

    res.status(200).end();
  } catch (error: unknown) {
    logError(error as AxiosError | Error);

    // console.error(error);
    res.status(500).end();
  }
}

function logError(error: AxiosError | Error) {
  if ("response" in error) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    error.response && console.error(error.response.data);
    error.response && console.error(error.response.status);
    error.response && console.error(error.response.headers);
  } else if ("request" in error) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error(error.message);
  }
  "config" in error && console.error(error.config);
}

async function echoInPrivateChat(update: Update) {
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

async function findAndBanSpammers(
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

async function logUpdateToFirestore(db: Firestore, update: Update) {
  await db.collection("telegram_updates").add(update);
}
