'use strict';

var grunt = require('grunt');

exports.css_test = {
  setUp: function(done) {
    done();
  },
  local: function(test) {
    test.expect(1);

    if(process.env.TRAVIS){
      test.ok(true, 'travis does not have browser');
    }else{
      test.ok(grunt.file.exists('tmp/screenshots/chrome/googleHome.png'), 'screenshot should be created for google home page');
    }

    test.done();
  }
};
