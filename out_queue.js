var rpc        = require('rpc-stream');
var reconnect  = require('reconnect');
var Jobs       = require('level-jobs');

var db         = require('./db').base;
var results    = db.sublevel('results');
var queue      = Jobs(results, send, 1);
module.exports = queue;

var central;

function send(doc, cb) {
  var canceled = false;
  var timeout = setTimeout(function() {
    cb(new Error('timeout'));
  }, 1000);

  if (central) {
    central.result(doc, function(err) {
      if (! canceled) {
        clearTimeout(timeout);
        cb(err);
      }
    });
  }
}

var centralPort = 9190;

reconnect(function(conn) {

  conn.setKeepAlive(true);
  conn.setNoDelay(true);
  conn.on('error', onError);
  var client = rpc();
  client.pipe(conn).pipe(client);
  central = client.wrap(['result']);

  function onError(err) {
    conn.end();
    central = null;
  }

}).connect(9190);

