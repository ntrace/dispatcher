var uuid  = require('node-uuid').v4;
var jobs  = require('../db').jobs;
var log   = require('util').log;

module.exports = push;

function push(args, cb) {
  log('pushing ' + JSON.stringify(args));
  var payload = args[0];

  var w = {
  	commit: payload.after,
  	owner: payload.repository.owner.name,
  	repo: payload.repository.name,
  	uuid: payload.uuid,
  	payload: payload
  };

  if (! w.uuid) w.uuid = uuid();
  w.id = w.uuid;
  jobs.push(w, cb);
}