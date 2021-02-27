import { Config, loadConfig, MatrixTokenConfig } from './lib/config';
import LogService, { configureLogger } from './lib/logger';
import { getClient, run } from './lib/matrix';

(async () => {
  const c: Config = await loadConfig([configureLogger]);
  const homeserver: string = c.matrix.homeserver.toString();
  const client = await getClient(
    homeserver,
    (c.matrix.token || c.matrix.user) as MatrixTokenConfig | MatrixTokenConfig
  );

  const stop = new Promise<void>((resolve) => {
    process
      .on('SIGHUP', () => resolve())
      .on('SIGINT', () => resolve())
      .on('SIGTERM', () => resolve());
  });

  await Promise.all([run(client), stop]);
})()
  .then((client) => {
    LogService.info('good bye!', client);
    process.exit(0);
  })
  .catch((err) => {
    LogService.error(err);
    process.exit(-1);
  });
