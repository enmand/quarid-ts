import { createLogger, LogLevel as NLogLevel } from 'bunyan';
import { LogLevel, LogService } from 'matrix-bot-sdk';

import { Config } from './config';

export const configureLogger = async (c: Config) => {
  LogService.setLevel(c.logger.level);

  LogService.setLogger(
    createLogger({
      name: 'matrix',
      level: (c.logger.level.toString() as unknown) as NLogLevel,
    })
  );
};
export { LogLevel };
export default LogService;
