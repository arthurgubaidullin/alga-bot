import { ResponseParameters } from "./ResponseParameters";

export type Response<T> =
  | {
      ok: true;
      result: T;
    }
  | {
      ok: false;
      description: string;
      error_code: number;
      parameters?: ResponseParameters;
    };
