var forever = require('forever-monitor');

var child = new (forever.Monitor)('index.js');

child.on('exit', function () {
  console.log('index.js has exited');
});

child.start();
