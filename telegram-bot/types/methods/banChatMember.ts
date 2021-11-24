import { Message } from "../Message";

type BanChatMemberParams = {
  chat_id: number | string;
  user_id: number;
  revoke_messages?: boolean;
};

type BanChatMemberReturns = Message;

export type BanChatMember = {
  banChatMember: {
    params: BanChatMemberParams;
    returns: BanChatMemberReturns;
  };
};
