var rpc       = require('rpc-stream');
var rpcServer = require('./rpc_server');

var server = module.exports =
require('net').createServer(handleConnection);

function handleConnection(conn) {
  conn.setKeepAlive(true);
  conn.setNoDelay(true);
  var server = rpc(rpcServer);
  server.pipe(conn).pipe(server);
}

server.on('listening', onListening);

function onListening() {
  console.log('Dispatcher server listening on port', server.address().port);
}

