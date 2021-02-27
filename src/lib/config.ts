import { URL } from 'url';

import { Combine, parseEnvironmentVariables } from '@absxn/process-env-parser';
import * as dotenv from 'dotenv';

import { LogLevel } from './logger';

export type MatrixTokenConfig = {
  readonly access_token: string;
};

export type MatrixUserConfig = {
  readonly username: string;
  readonly password: string;
};

export type MatrixConfig = {
  readonly homeserver: URL;
  readonly token?: MatrixTokenConfig | null;
  readonly user?: MatrixUserConfig | null;
};

export type LoggerConfig = {
  readonly level: LogLevel;
};

export type Config = {
  readonly matrix: MatrixConfig;
  readonly logger: LoggerConfig;
};

export type ConfigLoader = {
  (c: Config): Promise<void>;
};

const init = () => dotenv.config();

export const loadConfig = async (
  fns: readonly ConfigLoader[]
): Promise<Config> => {
  const envVars = parseEnvironmentVariables({
    HOMESERVER: {
      parser: (env): URL => {
        return new URL('/', env);
      },
      default: new URL('https://matrix.org'),
    },
    ACCESS_TOKEN: { mask: true, default: null },
    USERNAME: { default: null },
    PASSWORD: { default: null },
    LOG_LEVEL: { default: LogLevel.TRACE },
  });
  if (!envVars.success) {
    return Promise.reject(
      new Error(
        `unable to parse environment config: ${JSON.stringify(
          envVars.envPrintable
        )}`
      )
    );
  }

  const {
    HOMESERVER,
    ACCESS_TOKEN,
    USERNAME,
    PASSWORD,
    LOG_LEVEL,
  } = envVars.env;

  const c = {
    matrix: {
      homeserver: HOMESERVER,
      token: Combine.nonNullable({
        access_token: ACCESS_TOKEN,
      }) as NonNullable<MatrixTokenConfig>,
      user: Combine.nonNullable({
        username: USERNAME,
        password: PASSWORD,
      }) as NonNullable<MatrixUserConfig>,
    },
    logger: {
      level: LogLevel.fromString(LOG_LEVEL.toString()),
    },
  };

  // configure services
  fns?.map(async (fn) => await fn(c));

  return c;
};

init();
export default { loadConfig };
