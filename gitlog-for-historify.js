var exec = require('exec-cmd');
var author = require('author-regex');
var dateformat = require('dateformat');

exec('git', ['log', '--pretty=format:%s <%cn> (%ci) - #%H']).then(function(data) {
  var res = [];
  var commits = data.replace(/\n/g, '---').split('---');

  commits.forEach(function(item) {
    var match = author().exec(item);
    var o = {};
    var sha = item.match(/-\s+?#([a-f0-9]{7,40})$/)[1];
    o.commit = sha.slice(0,7)
    o.sha = sha;
    o.message = match[1];
    o.author = match[2];
    o.date = dateformat(match[3], 'longDate');
    res.push(o)
  })

  data = {};
  data.commits = res;



  console.log(JSON.stringify(data, 0, 2));
})
.catch(console.error)
