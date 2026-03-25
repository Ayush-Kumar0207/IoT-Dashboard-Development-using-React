const https = require('https');
const fs = require('fs');

const K = 'gpHODkU4IJr6mXPLcZPIXc04T1FFoMW4AumWbFBR9kXs46LnSDZIvFtuyGzVKnSs';

function test(p) {
  return new Promise((res) => {
    const req = https.request({
      hostname: 'api.ap-in-1.anedya.io',
      path: p,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + K
      }
    }, (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(d));
    });
    req.on('error', e => res(JSON.stringify({ error: e.message })));
    req.write('{}');
    req.end();
  });
}

async function run() {
  const d = await test('/v1/project/get');
  console.log('Project Info:', d);
  fs.writeFileSync('project-info.json', d);
  
  const nodes = await test('/v1/node/list');
  console.log('Nodes Info:', nodes);
  fs.writeFileSync('nodes-info.json', nodes);
}

run();
