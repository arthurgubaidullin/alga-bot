import { AxiosError } from "axios";
import { Logger } from "./logger";

export function logError(P: Logger) {
  return (error: AxiosError | Error) => {
    if ("response" in error) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      error.response && P.error(error.response.data);
      error.response && P.error(error.response.status);
      error.response && P.error(error.response.headers);
    } else if ("request" in error) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      P.error(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      P.error(error.message);
    }
    "config" in error && P.error(error.config);
  };
}
