'use strict';

var grunt = require('grunt');

exports.css_test = {
  setUp: function(done) {
    done();
  },
  local: function(test) {
    test.expect(1);

    test.ok(grunt.file.exists('tmp/screenshots/chrome/googleHome.png'), 'screenshot should be created for google home page');

    test.done();
  },
  sauce: function(test) {
    test.expect(1);

    test.ok(grunt.file.exists('tmp/screenshots/sauce/chrome/googleHome.png'), 'screenshot should be created for google home page');

    test.done();
  }
};
