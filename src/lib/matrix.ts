import {
  AutojoinRoomsMixin,
  IStorageProvider,
  MatrixAuth,
  MatrixClient,
  SimpleFsStorageProvider,
} from 'matrix-bot-sdk';

import { MatrixTokenConfig, MatrixUserConfig } from './config';

/* eslint-disable-next-line functional/no-class */
export class Client extends MatrixClient {
  /* eslint-disable-next-line functional/prefer-readonly-type */
  protected persistTokenAfterSync = true;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  async start(filter?: any): Promise<any> {
    await super.start(filter);
  }
}

export const run = async (client: Client): Promise<void> => {
  AutojoinRoomsMixin.setupOnClient(client);

  await client.start();
  return;
};

export const getClient = async (
  homeserver: string,
  config: MatrixUserConfig | MatrixTokenConfig,
  storage: IStorageProvider = new SimpleFsStorageProvider('quarid.json')
): Promise<Client> => {
  const access_token = await login(homeserver, config);
  const client = new Client(homeserver, access_token, storage);
  return client;
};

const login = async (
  homeserver: string,
  config: MatrixUserConfig | MatrixTokenConfig
): Promise<string> => {
  const { username, password } = <MatrixUserConfig>config || {};
  const { access_token } = <MatrixTokenConfig>config || {};
  if (access_token) {
    return Promise.resolve(access_token);
  }

  if (username !== undefined && password !== undefined) {
    const auth: MatrixAuth = new MatrixAuth(homeserver);
    const authClient = await auth.passwordLogin(
      username,
      password,
      'Quarid-ts'
    );
    return Promise.resolve(authClient.accessToken);
  }

  return Promise.reject(new Error('no authentication'));
};
