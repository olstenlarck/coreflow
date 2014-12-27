var mm = require('micromatch');
var relative = require('relative');
var unique = require('array-unique');
var flatten = require('arr-flatten');
var path = require('path');
var fs = require('fs');

//buggy
telenor(['*', '!node_modules', '!.*', '!fixtures'], function(err, filepaths) {
  console.log(filepaths);
})

function telenor(patterns, callback) {
  patterns = Array.isArray(patterns) ? patterns : [patterns];
  var paths = unique(patterns.map(function(pattern) {
    pattern = path.resolve(relative(pattern, process.cwd()));
    if (pattern === path.resolve(__dirname, '..')) {
      return false;
    }
    return pattern;
  }).filter(function(pattern) {
    return pattern !== false;
  }))
  .reduce(function(arr, readpath) {
    return readdir(readpath, patterns)
  }, []);

  callback(null, flatten(paths))
}

function readdir(dir, patterns) {
  return mm(fs.readdirSync(dir), patterns).map(function(fp) {
    fp = path.resolve(dir, fp);
    if (fs.statSync(fp).isDirectory()) {
      return readdir(fp, patterns);
    }
    return fp;
  })
}
