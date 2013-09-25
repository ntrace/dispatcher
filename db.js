var level       = require('level');
var sublevel    = require('level-sublevel');

var db          = exports.base = sublevel(level(__dirname + '/db'));
exports.work    = db.sublevel('work');