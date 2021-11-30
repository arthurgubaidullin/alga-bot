import axios from "axios";
import { Methods } from "./types/methods";
import { Response } from "./types/Response";

export interface TelegramPost {
  post<M extends keyof Methods>(
    methodName: M
  ): (
    params: Methods[M]["params"]
  ) => Promise<Response<Methods[M]["returns"]>>;
}

export const makePost = (
  getToken: () => string
): TelegramPost => ({
  post: (methodName) => async (params) => {
    const url = method(getToken(), methodName);
    const result = await axios.post(url, params);
    return result.data;
  },
});

function method<T extends keyof Methods>(
  token: string,
  name: T
): `https://api.telegram.org/bot${string}/${T}` {
  return `https://api.telegram.org/bot${token}/${name}`;
}
