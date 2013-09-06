var db      = require('../db').base;
var work    = require('../db').work;
var pending = require('../db').pending;
var log     = require('util').log;

module.exports = next;

work.hooks.post(onWorkInsert);

var queue = [];

function onWorkInsert(ch) {
  if (ch.type == 'put' && queue.length) {
    console.log('work inserted:', ch);
    flush();
  }
}

var polling = false;

function next(args, cb) {
  if (polling) enqueue();
  else {
    polling = true;

    var s = work.createReadStream({limit: 1});
    s.once('end', onEnd);
    s.once('data', onData);

  }

  var gotData = false;

  function onEnd() {
    if (! gotData) {
      polling = false;
      enqueue();
    }
  }

  function enqueue() {
    log('queueing');
    queue.push(cb);
  }

  function onData(d) {
    console.log('onData', d);
    log('next work will be', d);
    gotData = true;
    db.batch([
      { type: 'del', key: d.key, prefix: work },
      { type: 'put', key: d.key, value: d.value, prefix: pending }
    ], allDone);

    function allDone(err) {
      polling = false;
      if (err) cb(err);
      else {
        console.log('replying to next:', d.value);
        cb(null, JSON.parse(d.value));
      }
      flush();
    }
  }
}

function flush() {
  if (! polling && queue.length) {
    next([], queue.shift());
  }
}