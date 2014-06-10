/*
 * grunt-css-test
 * https://github.com/adcarabajal/grunt-css-test
 *
 * Copyright (c) 2014 adcarabajal
 * Licensed under the MIT license.
 */

'use strict';
var Q = require('q'),
    spec = require('vows/lib/vows/reporters/spec'),
    PageTestCase = require('./lib/PageTestCase'),
    Browser = require('./lib/browser'),
    driver = new require('./lib/driver')();

var vows = require('vows');

module.exports = function(grunt) {

  grunt.registerMultiTask('css_test', 'CSS testing through browsers screenshots comparation', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      environment: {
        description: 'Running locally',
        debug: false,
        remote: 'http://localhost:9515',
        capabilities: {
          browserName: 'chrome'
        }
      },
      screenshotsPath: 'tests/screenshots/' + this.target,
      resultsPath: 'tests/results/' + this.target
    });

    var done = this.async(),
        browser;

    if(options.pages === null || options.pages.length === 0 ){
      grunt.log.writeln('No test URLs found');
    }

    var suite = vows.describe('CSS Tests');

    driver.start(options).nodeify(function(){
      browser = new Browser(options);
      var promise_chain = Q.fcall(function(){});

      browser.nodeify(function(){
        options.pages.forEach(function(page) {
          var promise_link = function() {
            var deferred = Q.defer();
            PageTestCase.create(browser, options, page).addBatchTo(suite, deferred);
            return deferred.promise;
          };

          promise_chain = promise_chain.then(promise_link);
        });

        promise_chain.then(function(){
          suite.run({reporter:spec}, function(){
            browser.quit().nodeify(function(){
              driver.stop(function(){
                done();
              });
            });
          });
        });

      });

    });

  });
};
