const API_KEY: string = import.meta.env.VITE_ANEDYA_API_KEY ?? '';
const NODE_ID: string = import.meta.env.VITE_ANEDYA_NODE_ID ?? '';

// Anedya Cloud Platform API (AP-IN-1 Region)
const BASE_URL = 'https://api.ap-in-1.anedya.io/v1';

// All Platform API calls use Bearer token with the Project Access Token
function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY.trim()}`,
  };
}

/**
 * Fetch the online/offline status of the configured node
 * PROVEN: POST /health/status { nodes: [NODE_ID] }
 */
export async function getDeviceStatus(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/health/status`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nodes: [NODE_ID] }),
    });
    if (!response.ok) return false;
    const resData = await response.json();
    
    // First, check if the health API gave us an explicit online status
    const nodeInfo = resData.data?.[NODE_ID];
    if (nodeInfo?.status === 'online' || nodeInfo?.online === true) {
      return true;
    }

    // Fallback: The API returns empty data {} for HTTP devices without heartbeat.
    // Instead, check if the latest telemetry was received within the last 3 minutes.
    const tempRes = await fetch(`${BASE_URL}/data/latest`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ nodes: [NODE_ID], variable: 'temperature' }),
    });
    
    if (tempRes.ok) {
      const tempData = await tempRes.json();
      const nodeData = tempData.data?.[NODE_ID];
      if (nodeData && nodeData.timestamp) {
        const nowSecs = Math.floor(Date.now() / 1000);
        // If data is less than 3 minutes (180s) old, consider it ONLINE
        if (nowSecs - nodeData.timestamp <= 180) {
          return true;
        }
      }
    }

    return Object.keys(resData.data || {}).length > 0;
  } catch (e) {
    console.error('[Anedya] Status error:', e);
    return false;
  }
}

/**
 * Fetch latest temperature and humidity values
 * PROVEN: POST /data/latest { nodes: [NODE_ID], variable: "<name>" }
 * Note: This endpoint returns ONE variable at a time, so we make 2 calls.
 */
export async function getLatestTelemetry(): Promise<{ temperature: number | null; humidity: number | null }> {
  try {
    const [tempRes, humRes] = await Promise.all([
      fetch(`${BASE_URL}/data/latest`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ nodes: [NODE_ID], variable: 'temperature' }),
      }),
      fetch(`${BASE_URL}/data/latest`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ nodes: [NODE_ID], variable: 'humidity' }),
      }),
    ]);

    let temperature: number | null = null;
    let humidity: number | null = null;

    if (tempRes.ok) {
      const tempData = await tempRes.json();
      // Response shape: { data: { "<nodeId>": { timestamp, value } } }
      temperature = tempData.data?.[NODE_ID]?.value ?? null;
    }

    if (humRes.ok) {
      const humData = await humRes.json();
      humidity = humData.data?.[NODE_ID]?.value ?? null;
    }

    return { temperature, humidity };
  } catch (e) {
    console.error('[Anedya] Telemetry error:', e);
    return { temperature: null, humidity: null };
  }
}

/**
 * Send an ON/OFF command to the node's relay
 * PROVEN: POST /commands/send { nodeId: NODE_ID, command, data, type, expiry }
 * Note: expiry must be a future Unix timestamp in seconds (>= now + 5s)
 */
export async function sendRelayCommand(state: boolean): Promise<any> {
  const expiryTimestamp = Date.now() + 30000; // 30 seconds from now (milliseconds epoch)

  const payload = {
    nodeId: NODE_ID,
    command: 'toggle-relay',
    data: state ? 'ON' : 'OFF',
    type: 'string',
    expiry: expiryTimestamp,
  };

  const response = await fetch(`${BASE_URL}/commands/send`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const resData = await response.json();

  if (!response.ok || !resData.success) {
    throw new Error(resData.error || 'Failed to send command');
  }
  return resData;
}

/**
 * Fetch historical time-series data for a specific variable
 * PROVEN: POST /data/getData { nodes: [NODE_ID], variable, from, to, order: "asc" }
 * Timestamps in the request/response are Unix seconds.
 * The `from` and `to` params this function receives are JS milliseconds.
 */
export async function getHistoricalData(
  variable: string,
  from: number,
  to: number
): Promise<{ timestamp: number; value: number }[]> {
  try {
    const response = await fetch(`${BASE_URL}/data/getData`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        nodes: [NODE_ID],
        variable,
        from: Math.floor(from / 1000),
        to: Math.floor(to / 1000),
        order: 'desc', // Fetch the 200 *most recent* points
        limit: 200,
      }),
    });

    if (!response.ok) return [];

    const resData = await response.json();
    // Response shape: { data: { "<nodeId>": [ { timestamp, value }, ... ] } }
    let logs: { timestamp: number; value: number }[] = resData.data?.[NODE_ID] || [];

    // Since we fetched desc, the array is newest-first. Reverse it for chronological charting.
    logs = logs.reverse();

    return logs.map((entry) => ({
      timestamp: entry.timestamp * 1000, // Convert back to JS milliseconds
      value: entry.value,
    }));
  } catch (e) {
    console.error(`[Anedya] Historical data error for ${variable}:`, e);
    return [];
  }
}