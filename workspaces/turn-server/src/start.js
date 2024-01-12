var Turn = require('node-turn');
var server = new Turn({
    listeningPort: 3478,
    // realm: 'mkjs.net',
    // set options
    authMech: 'long-term',
    // authMech: 'none',
    credentials: {
        username: "password"
    },
    debugLevel: 'ALL',
});
server.start();
