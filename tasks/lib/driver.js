var
  Q = require('q'),
  _ = require('lodash'),
  SauceTunnel = require('sauce-tunnel'),
  chromeDriver = require('chromedriver'),
  sauceUsername = process.env.SAUCE_USERNAME,
  sauceAccessKey = process.env.SAUCE_ACCESS_KEY;

require('colors');

module.exports = function(){

  var
    tunnel,
    chromeDriverProcess;

  function isSauce(env){
    return _.find(env, function(v, key){
      if(key === 'sauce'){ return v; }
    }) != null;
  }

  function startChromeDriverIfNeeded(options) {
    var chromeDriverDefer = Q.defer();

    if (!isSauce(options.environment) && _.any(options.environment, {browserName: 'chrome'})) {
      console.log(' > ' + 'DRIVER'.cyan, 'starting chromedriver');

      chromeDriverProcess = chromeDriver.start();
      chromeDriverProcess.stdout.on('data', function () {
        console.log(' > ' + 'DRIVER'.cyan, 'chromedriver started');
        chromeDriverDefer.resolve();
      });

    } else {
      chromeDriverDefer.resolve();
    }

    return chromeDriverDefer.promise;
  }

  function startSauceTunnelIfNeeded(options) {
    var sauceTunnelDefer = Q.defer();

    if(isSauce(options.environment)) {
      console.log(' > ' + 'SAUCE'.cyan, 'starting tunnel');
      startSauceTunnel(options.environment.capabilities['tunnel-identifier'] ,function () {
        console.log(' > ' + 'SAUCE'.cyan, 'tunnel started');
        sauceTunnelDefer.resolve();
      });
    } else {
      sauceTunnelDefer.resolve();
    }

    return sauceTunnelDefer.promise;
  }

  function startSauceTunnel(tunnelId, done) {
    if(!sauceUsername || !sauceAccessKey){
      console.warn(
          '\nPlease configure your Sauce Labs credentials:\n\n' +
          'export SAUCE_USERNAME=<SAUCE_USERNAME>\n' +
          'export SAUCE_ACCESS_KEY=<SAUCE_ACCESS_KEY>\n\n'
      );
      throw new Error("Missing Sauce Labs credentials");
    }

    tunnel = new SauceTunnel(sauceUsername, sauceAccessKey, tunnelId, true, ['--verbose']);
    tunnel.start(function (status) {
      if (status === false) {
        throw new Error('Something went wrong with the Sauce Labs tunnel');
      }
      done();
    });
  }

  return {
    start: function (options){
      return Q.all(
        [startChromeDriverIfNeeded(options), startSauceTunnelIfNeeded(options)]
      );
    },
    stop: function(done){
      if (chromeDriverProcess) {
        console.log(' > ' + 'DRIVER'.cyan, 'stopping chromedriver');
        chromeDriver.stop();
        done();
      }
      if (tunnel) {
        console.log(' > ' + 'SAUCE'.cyan, 'stopping tunnel');
        tunnel.stop(done);
      }
    }
  };
};