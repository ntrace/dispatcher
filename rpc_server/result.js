var assert  = require('assert');
var results = require('../out_queue');
var log     = console.log;

module.exports = result;

function result(args, cb) {
  var doc = args[0];
  log('result:', doc);

  assert(doc.id,     'need doc.id');
  assert(doc.run_id, 'need doc.run_id');
  assert(doc.repo,   'need doc.repo');
  assert(doc.commit, 'need doc.commit');
  assert(doc.stream, 'need doc.stream');
  assert(doc.data,   'need doc.data');
  assert(doc.when,   'need doc.when');

  results.push(doc, cb);
}