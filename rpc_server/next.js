var Jobs = require('level-jobs');
var db   = require('../db');
var work = db.work;
var log  = require('util').log;
var jobs = Jobs(work, onWorkInsert, 1);
db.jobs  = jobs;


module.exports = next;

var producerQueue = [];
var consumerQueue = [];

function onWorkInsert(work, cb) {
  producerQueue.push({cb: cb, work: work});
  tryFlush();
}

var polling = false;

function next(args, cb) {
  consumerQueue.push(cb);
  tryFlush();
}

function tryFlush() {
  if (producerQueue.length && consumerQueue.length) {
    var consumer = consumerQueue.shift();
    var producer = producerQueue.shift();
    var cb = producer.cb;
    consumer(null, producer.work);
    cb();
  }
}