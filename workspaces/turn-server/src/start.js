const Turn = require('node-turn')
const config = require('./config.json')

const server = new Turn({
    listeningPort: 3478,
    listeningIps: config.listeningIps,
    relayIps: config.relayIps,
    externalIps: config.externalIps,
    realm: config.realm,
    // set options
    authMech: config.authMech,
    // authMech: 'none',
    credentials: config.credentials,
    debugLevel: config.debugLevel,
});
server.start();
