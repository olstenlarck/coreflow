var exec = require('child_process').exec;
var args = require('minimist')(process.argv.slice(2))
var request = require('superagent');

var api = 'https://api.github.com/user/repos';
var pkg = require('./package.json');

var token = args.ghtoken || args.g || args['github-token'] || '93408092b5dd1a0480ee2af345c201df662c8532';
var pkgName = args.name || args.n || pkg.name;
var pkgDesc = args.desc || args.description || pkg.description;
var pkgHome = args.home || args.homepage || pkg.homepage;

var data = {
  name: pkgName,
  homepage: pkgHome,
  description: pkgDesc,
  auto_init: true
};

if (args._[0] && args._[0] === 'remove') {
  request
    .del('https://api.github.com/repos/'+args._[1])
    .set('Authorization', 'token '+token)
    .end(function(err, res){
      if (err) {console.error(err); return false;}
      console.log('deleted');
      return true;
    });
} else if (args._[0] && args._[0] === 'add') {
    var repoName = args._[1].split('/')[1];
    data.name = repoName;
    start(nextFlow);
} else {
  start(nextFlow);
}

function start(next) {
  request
    .post(api)
    .send(data)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Content-Length', JSON.stringify(data).length)
    .set('Authorization', 'token '+token)
    .end(function(err, res){
      if (err) {console.error(err); return false;}
      console.log('create: '+res.body.html_url);
      next(res.body);
      return true;
    });
}

function nextFlow(resBody) {
  exec('npm run lint', function nextFlowCb(err, stdout, stderr) {
    if (err || stderr) {console.error(err || stderr);}
    console.log('continue to `npm run`');
  });
}
