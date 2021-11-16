import { User } from "./User";
import { Chat } from "./Chat";

export type Message = {
  message_id: number;
  from?: User;
  text?: string;
  chat?: Chat;
};
