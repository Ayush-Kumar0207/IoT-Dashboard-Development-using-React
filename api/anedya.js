const BASE_URL = 'https://api.ap-in-1.anedya.io/v1';
const REQUIRED_ENV = ['ANEDYA_API_KEY', 'ANEDYA_NODE_ID'];
const MAX_HISTORY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function json(res, status, body) {
  res.status(status).setHeader('Cache-Control', 'no-store').json(body);
}

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw cloudError(`Missing required environment variable: ${name}`, 503);
  return value;
}

function cloudError(message, status = 502) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function post(path, payload) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${requiredEnv('ANEDYA_API_KEY')}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw cloudError(data.error || `Anedya request failed with ${response.status}`, response.status);
  return data;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const missing = REQUIRED_ENV.filter((name) => !process.env[name]?.trim());
    const configured = missing.length === 0;
    return json(res, configured ? 200 : 503, {
      status: configured ? 'ok' : 'misconfigured',
      service: 'anedya-proxy',
      missing,
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const nodeId = requiredEnv('ANEDYA_NODE_ID');
    const { action, variable, from, to, state } = req.body || {};

    if (action === 'status') {
      const health = await post('/health/status', { nodes: [nodeId] });
      const explicit = health.data?.[nodeId];
      if (explicit?.status === 'online' || explicit?.online === true) {
        return json(res, 200, { online: true });
      }
      const latest = await post('/data/latest', { nodes: [nodeId], variable: 'temperature' });
      const timestamp = latest.data?.[nodeId]?.timestamp;
      return json(res, 200, { online: Boolean(timestamp && Math.floor(Date.now() / 1000) - timestamp <= 180) });
    }

    if (action === 'latest') {
      const [temperature, humidity] = await Promise.all([
        post('/data/latest', { nodes: [nodeId], variable: 'temperature' }),
        post('/data/latest', { nodes: [nodeId], variable: 'humidity' }),
      ]);
      return json(res, 200, {
        temperature: temperature.data?.[nodeId]?.value ?? null,
        humidity: humidity.data?.[nodeId]?.value ?? null,
      });
    }

    if (action === 'history') {
      if (!['temperature', 'humidity'].includes(variable)) return json(res, 400, { error: 'Unsupported variable' });
      if (!Number.isFinite(from) || !Number.isFinite(to) || from >= to) {
        return json(res, 400, { error: 'from and to must be valid millisecond timestamps with from before to' });
      }
      if (to - from > MAX_HISTORY_WINDOW_MS) {
        return json(res, 400, { error: 'History requests are limited to 7 days' });
      }
      const result = await post('/data/getData', {
        nodes: [nodeId],
        variable,
        from: Math.floor(from / 1000),
        to: Math.floor(to / 1000),
        order: 'desc',
        limit: 200,
      });
      const rows = (result.data?.[nodeId] || []).reverse().map((entry) => ({
        timestamp: entry.timestamp * 1000,
        value: entry.value,
      }));
      return json(res, 200, rows);
    }

    if (action === 'command') {
      if (typeof state !== 'boolean') return json(res, 400, { error: 'state must be boolean' });
      const result = await post('/commands/send', {
        nodeId,
        command: 'toggle-relay',
        data: state ? 'ON' : 'OFF',
        type: 'string',
        expiry: Date.now() + 30000,
      });
      if (result.success !== true) {
        throw cloudError(result.error || 'Anedya rejected the relay command');
      }
      return json(res, 200, result);
    }

    return json(res, 400, { error: 'Unsupported action' });
  } catch (error) {
    console.error('[Anedya Proxy]', error);
    return json(res, error.status || 502, { error: error.message || 'Cloud API request failed' });
  }
}
