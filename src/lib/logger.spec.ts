import test from 'ava';

import { loadConfig } from './config';
import LogService, { configureLogger, LogLevel } from './logger';

const env = { ...process.env };

test('configureLogger', async (t) => {
  /* eslint-disable-next-line functional/immutable-data */
  process.env = { ...env, LOG_LEVEL: 'error' };
  await configureLogger(await loadConfig([]));
  t.is(LogService.level, LogLevel.ERROR);
});
