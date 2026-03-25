const https = require('https');

const API_KEY = 'gpHODkU4IJr6mXPLcZPIXc04T1FFoMW4AumWbFBR9kXs46LnSDZIvFtuyGzVKnSs';
const NODE_ID = '019d23e9-abbb-7cf6-8b94-1a38b7c69140';

function testEndpoint(path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: 'api.ap-in-1.anedya.io',
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    }, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, body: responseBody, headers: res.headers });
      });
    });
    req.on('error', (e) => resolve({ path, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('=== Testing Anedya Cloud API Endpoints ===\n');

  // Test data endpoints
  const dataEndpoints = [
    ['/v1/data/getsnapshot', { nodeId: NODE_ID, variable: 'temperature' }],
    ['/v1/data/getlatest', { nodeId: NODE_ID, variable: 'temperature' }],
    ['/v1/data/latest', { nodeId: NODE_ID, variable: 'temperature' }],
    ['/v1/data/latest', { nodes: [NODE_ID], variables: ['temperature'] }],
    ['/v1/data/gethistorical', { nodeId: NODE_ID, variable: 'temperature', from: Date.now() - 3600000, to: Date.now() }],
  ];

  for (const [path, body] of dataEndpoints) {
    const result = await testEndpoint(path, body);
    console.log(`${path} -> ${result.status}`);
    console.log(`  Body: ${result.body}`);
    if (result.headers && result.headers['access-control-allow-origin']) {
      console.log(`  CORS: ${result.headers['access-control-allow-origin']}`);
    }
    console.log('');
  }

  // Test health endpoints
  const healthEndpoints = [
    ['/v1/health/getstatus', { nodeId: NODE_ID }],
    ['/v1/health/gethbstats', { nodeId: NODE_ID }],
    ['/v1/health/status', { nodes: [NODE_ID] }],
  ];

  for (const [path, body] of healthEndpoints) {
    const result = await testEndpoint(path, body);
    console.log(`${path} -> ${result.status}`);
    console.log(`  Body: ${result.body}`);
    console.log('');
  }

  // Test commands endpoint
  const cmdResult = await testEndpoint('/v1/commands/send', {
    nodeId: NODE_ID, command: 'test', data: 'ping', type: 'string', expiry: 10
  });
  console.log(`/v1/commands/send -> ${cmdResult.status}`);
  console.log(`  Body: ${cmdResult.body}`);
}

main();
