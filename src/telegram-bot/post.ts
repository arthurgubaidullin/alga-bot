import axios from "axios";
import { getBotToken } from "./config";
import { Methods } from "./types/methods";
import { Response } from "./types/Response";

export interface TelegramPost {
  post<M extends keyof Methods>(
    methodName: M
  ): (
    params: Methods[M]["params"]
  ) => Promise<Response<Methods[M]["returns"]>>;
}

export const post: TelegramPost = {
  post: (methodName) => async (params) => {
    const url = method(methodName);
    const result = await axios.post(url, params);
    return result.data;
  },
};

function method<T extends keyof Methods>(
  name: T
): `https://api.telegram.org/bot${string}/${T}` {
  return `https://api.telegram.org/bot${getBotToken()}/${name}`;
}
