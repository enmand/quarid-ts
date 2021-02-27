import { URL } from 'url';

import test from 'ava';
//import * as dotenv from 'dotenv';
//import dotenvParseVariables from 'dotenv-parse-variables';
import sinon from 'sinon';

const env = Object.seal({ ...process.env });
import { Config, loadConfig } from './config';
import { LogLevel } from './logger';

test('bad env', async (t) => {
  /* eslint-disable-next-line functional/immutable-data */
  process.env.HOMESERVER = '42';
  await t.throwsAsync(() => loadConfig([]));
});

test('loadConfig ok', async (t) => {
  /* eslint-disable-next-line functional/immutable-data */
  process.env = env;
  t.deepEqual(await loadConfig([]), defaultConfig);
});

test('with loader', async (t) => {
  /* eslint-disable-next-line functional/immutable-data */
  process.env = env;
  const loader = sinon.spy(async (c: Config) => {
    c ? '' : ''; // use c for something to avoid compiler complaints
    return;
  });
  t.deepEqual(await loadConfig([loader]), defaultConfig);
  t.true(loader.calledOnce);
});

test('loadConfig with token', async (t) => {
  /* eslint-disable-next-line functional/immutable-data */
  process.env = { ...env, ACCESS_TOKEN: 'token' };
  t.deepEqual(await loadConfig([]), {
    ...defaultConfig,
    matrix: { ...defaultConfig.matrix, token: { access_token: 'token' } },
  });
});

const defaultConfig = {
  matrix: {
    homeserver: new URL('https://matrix.org'),
    user: null,
    token: null,
  },
  logger: { level: LogLevel.TRACE },
};
