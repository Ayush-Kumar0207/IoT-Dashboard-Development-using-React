import axios from 'axios';

const API_KEY = '4d9ab843ddeacf8d1286ab3e0ad9fc8039cb9c8d3f9efbc60fc989697a33ee9f';
const NODE_ID = '019d23e9-abbb-7cf6-8b94-1a38b7c69140';
const BASE_URL = 'https://api.ap-in-1.anedya.io/v1';

async function testVariation(name, endpoint, payload) {
    console.log(`\nTesting Variation: ${name} on ${endpoint}`);
    console.log(`Payload: ${JSON.stringify(payload)}`);
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, payload, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`✅ SUCCESS! Status: ${response.status}`);
        console.log(`Data: ${JSON.stringify(response.data)}`);
        return true;
    } catch (e) {
        console.log(`❌ FAILED! Status: ${e.response?.status || 'Unknown'}`);
        console.log(`Error: ${JSON.stringify(e.response?.data) || e.message}`);
        return false;
    }
}

async function run() {
    console.log("--- ANEDYA CLOUD API ESM PROBE ---");
    
    // Test data/latest permutations
    await testVariation("Plural Nodes/Variables", "/data/latest", {
        nodes: [NODE_ID],
        variables: ["temperature"]
    });

    await testVariation("Singular nodeId/variable", "/data/latest", {
        nodeId: NODE_ID,
        variable: "temperature"
    });

    await testVariation("Singular nodeId/variables Array", "/data/latest", {
        nodeId: NODE_ID,
        variables: ["temperature"]
    });

    await testVariation("Simple node/variable", "/data/latest", {
        node: NODE_ID,
        variable: "temperature"
    });

    // Test health/status permutations
    await testVariation("Status Plural Nodes", "/health/status", {
        nodes: [NODE_ID]
    });

    await testVariation("Status Singular nodeId", "/health/status", {
        nodeId: NODE_ID
    });

    // Test data/logs permutations
    await testVariation("Logs Plural nodes", "/data/logs", {
        nodes: [NODE_ID],
        variable: "temperature",
        from: Math.floor(Date.now()/1000) - 3600,
        to: Math.floor(Date.now()/1000)
    });

    await testVariation("Logs Singular nodeId", "/data/logs", {
        nodeId: NODE_ID,
        variable: "temperature",
        from: Math.floor(Date.now()/1000) - 3600,
        to: Math.floor(Date.now()/1000)
    });

}

run();
