import { AxiosError } from "axios";

export function logError(error: AxiosError | Error) {
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
