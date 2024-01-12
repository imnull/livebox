var Turn = require('node-turn');
var server = new Turn({
    listeningPort: 3478,
    listeningIps: [
        '8.130.9.126',
        '172.22.137.20',
    ],
    realm: 'turn.mkjs.net',
    // set options
    authMech: 'long-term',
    // authMech: 'none',
    credentials: {
        username: "password"
    },
    debugLevel: 'ALL',
});
server.start();
