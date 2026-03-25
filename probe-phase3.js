const https = require('https');

const API_KEY = 'gpHODkU4IJr6mXPLcZPIXc04T1FFoMW4AumWbFBR9kXs46LnSDZIvFtuyGzVKnSs';

function test(host, path, body = {}) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: host,
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
        resolve({ host, path, status: res.statusCode, body: responseBody });
      });
    });
    req.on('error', (e) => resolve({ host, path, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function main() {
  const hosts = ['api.ap-in-1.anedya.io', 'api.anedya.io'];
  const paths = [
    '/v1/node/list',
    '/v1/project/get',
    '/v1/listNodes',
    '/v1/data/snapshot',
    '/v1/health/status'
  ];

  console.log('--- Phase 3: Project Probe ---');
  for (const h of hosts) {
    for (const p of paths) {
      const result = await test(h, p);
      console.log(`[${h}] ${p} -> ${result.status}`);
      if (result.status === 200 || result.status === 401) {
          console.log(`  Body: ${result.body.substring(0, 200)}`);
      }
    }
  }
}

main();
