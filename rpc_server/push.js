var uuid  = require('node-uuid').v4;
var work  = require('../db').work;
var log   = require('util').log;

module.exports = push;

function push(args, cb) {
  log('pushing ' + JSON.stringify(args));
  var id = args[3];
  if (! id) id = uuid();
  var w = {
    id: id,
    owner:  args[0],
    repo:   args[1],
    commit: args[2]
  };

  work.put(id, JSON.stringify(w), cb);
}
