import { DeleteMessage } from "./deleteMessage";
import { SendMessage } from "./sendMessage";
import { Response } from "../Response";
import { BanChatMember } from "./banChatMember";
import { setWebhook } from "./setWebhook";
import { getWebhookInfo } from "./getWebhookInfo";

export type Methods = SendMessage &
  DeleteMessage &
  BanChatMember &
  setWebhook &
  getWebhookInfo;

export type allMethods<M extends keyof Methods> = (
  method: M,
  params: Methods[M]["params"]
) => Promise<Response<Methods[M]["returns"]>>;
