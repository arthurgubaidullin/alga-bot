import { ChatMemberUpdated } from "./ChatMemberUpdated";
import { Message } from "./Message";

export type Update = {
  message?: Message;
  my_chat_member?: ChatMemberUpdated;
};
