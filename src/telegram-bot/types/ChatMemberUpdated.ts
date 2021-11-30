import { Chat } from "./Chat";
import { User } from "./User";

export type ChatMemberUpdated = {
  chat: Chat;
  from: User;
  date: number;
};
