var _ = require('lodash'),
    wd = require('wd');

require('colors');

module.exports = function(options){
  var env = options.environment;

  wd.configureHttp({
    timeout: 60000,
    retryDelay: 15000,
    retries: 5
  });

  var sauceUsername = process.env.SAUCE_USERNAME,
      sauceAccessKey = process.env.SAUCE_ACCESS_KEY;

  if (env.sauce) {
    env.remote = _.defaults(env.remote, {
      username: sauceUsername,
      accessKey: sauceAccessKey
    });
  }

  var browser = wd.promiseChainRemote(env.remote);

  if (env.debug) {
    browser.on('status', function(info) {
      console.log(info.cyan);
    });
    browser.on('command', function(eventType, command, response) {
      console.log(' > ' + eventType.cyan, command, (response || '').grey);
    });
    browser.on('http', function(meth, path, data) {
      console.log(' > ' + meth.magenta, path, (data || '').grey);
    });
  }

  return browser.init(env.capabilities);
};