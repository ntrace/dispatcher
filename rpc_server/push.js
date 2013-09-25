var uuid  = require('node-uuid').v4;
var jobs  = require('../db').jobs;
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

  jobs.push(w, cb);
}