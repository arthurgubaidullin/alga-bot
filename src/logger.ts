export interface LogError {
  error(...data: unknown[]): void | Promise<void>;
}

export const logError: LogError = {
  error(...data) {
    console.error(...data);
  },
};

export interface LogInfo {
  info(
    message?: string,
    ...optionalParams: unknown[]
  ): void | Promise<void>;
}

export const logInfo: LogInfo = {
  info(message, ...optionalParams) {
    console.info(message, ...optionalParams);
  },
};

export interface JustLog {
  log(
    message?: string,
    ...optionalParams: unknown[]
  ): void | Promise<void>;
}

export const justLog: JustLog = {
  log(message, ...optionalParams) {
    console.log(message, ...optionalParams);
  },
};

export type Logger = LogError & LogInfo & JustLog;

export const logger: Logger = {
  ...logError,
  ...logInfo,
  ...justLog,
};
