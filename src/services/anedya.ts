const PROXY_URL = '/api/anedya';

async function callProxy<T>(payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Cloud API request failed');
  return data as T;
}

export async function getDeviceStatus(): Promise<boolean> {
  try {
    const result = await callProxy<{ online: boolean }>({ action: 'status' });
    return result.online;
  } catch (error) {
    console.error('[Anedya] Status error:', error);
    return false;
  }
}

export async function getLatestTelemetry(): Promise<{ temperature: number | null; humidity: number | null }> {
  try {
    return await callProxy({ action: 'latest' });
  } catch (error) {
    console.error('[Anedya] Telemetry error:', error);
    return { temperature: null, humidity: null };
  }
}

export async function sendRelayCommand(state: boolean): Promise<unknown> {
  return callProxy({ action: 'command', state });
}

export async function getHistoricalData(
  variable: string,
  from: number,
  to: number
): Promise<{ timestamp: number; value: number }[]> {
  try {
    return await callProxy({ action: 'history', variable, from, to });
  } catch (error) {
    console.error(`[Anedya] Historical data error for ${variable}:`, error);
    return [];
  }
}
