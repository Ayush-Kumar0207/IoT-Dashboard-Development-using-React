import test from 'node:test';
import assert from 'node:assert/strict';

import handler from './anedya.js';

const ENV_NAMES = ['ANEDYA_API_KEY', 'ANEDYA_NODE_ID'];

function createResponse() {
  return {
    statusCode: null,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

function configureEnvironment(t, values = {}) {
  const original = Object.fromEntries(ENV_NAMES.map((name) => [name, process.env[name]]));
  for (const name of ENV_NAMES) delete process.env[name];
  Object.assign(process.env, values);
  t.after(() => {
    for (const name of ENV_NAMES) {
      if (original[name] === undefined) delete process.env[name];
      else process.env[name] = original[name];
    }
  });
}

function mockFetch(t, implementation) {
  const original = global.fetch;
  global.fetch = implementation;
  t.after(() => {
    global.fetch = original;
  });
}

function upstream(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

async function invoke(body, method = 'POST') {
  const res = createResponse();
  await handler({ method, body }, res);
  return res;
}

test('health reports missing server configuration', async (t) => {
  configureEnvironment(t);

  const res = await invoke(undefined, 'GET');

  assert.equal(res.statusCode, 503);
  assert.equal(res.body.status, 'misconfigured');
  assert.deepEqual(res.body.missing, ENV_NAMES);
});

test('latest telemetry is normalized for the dashboard', async (t) => {
  configureEnvironment(t, { ANEDYA_API_KEY: 'secret', ANEDYA_NODE_ID: 'node-1' });
  mockFetch(t, async (_url, options) => {
    const { variable } = JSON.parse(options.body);
    return upstream({ data: { 'node-1': { value: variable === 'temperature' ? 24.5 : 61 } } });
  });

  const res = await invoke({ action: 'latest' });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { temperature: 24.5, humidity: 61 });
});

test('invalid history timestamps are rejected before calling Anedya', async (t) => {
  configureEnvironment(t, { ANEDYA_API_KEY: 'secret', ANEDYA_NODE_ID: 'node-1' });
  mockFetch(t, async () => {
    throw new Error('fetch should not be called');
  });

  const res = await invoke({ action: 'history', variable: 'temperature', from: 'invalid', to: Date.now() });

  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /valid millisecond timestamps/);
});

test('a rejected relay command is returned as a gateway error', async (t) => {
  configureEnvironment(t, { ANEDYA_API_KEY: 'secret', ANEDYA_NODE_ID: 'node-1' });
  mockFetch(t, async () => upstream({ success: false, error: 'command rejected' }));
  const originalConsoleError = console.error;
  console.error = () => {};
  t.after(() => {
    console.error = originalConsoleError;
  });

  const res = await invoke({ action: 'command', state: true });

  assert.equal(res.statusCode, 502);
  assert.equal(res.body.error, 'command rejected');
});

test('an accepted relay command remains successful', async (t) => {
  configureEnvironment(t, { ANEDYA_API_KEY: 'secret', ANEDYA_NODE_ID: 'node-1' });
  mockFetch(t, async () => upstream({ success: true, commandId: 'cmd-1' }));

  const res = await invoke({ action: 'command', state: false });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { success: true, commandId: 'cmd-1' });
});
