import test from 'ava';
import { MatrixAuth, MatrixClient } from 'matrix-bot-sdk';
import sinon from 'sinon';

import { Client, getClient } from './matrix'; //Client, getClient } from './matrix';

test('start client', async (t) => {
  const c = new Client('https://matrix.org', 'token');
  const stub = sinon.stub(MatrixClient.prototype, 'start').resolves();

  await c.start('filter');

  t.true(stub.calledOnceWith('filter'));
});

test('username auth', async (t) => {
  const server = 'https://matrix.org';
  sinon
    .stub(MatrixAuth.prototype, 'passwordLogin')
    .resolves(new MatrixClient(server, 'login'));
  const client = await getClient(server, {
    username: 'user',
    password: 'password',
  });
  t.like(client, {
    accessToken: 'login',
  });
});

test('token auth', async (t) => {
  const client = await getClient('https://matrix.org', {
    access_token: 'token',
  });
  t.like(client, {
    accessToken: 'token',
  });
});
