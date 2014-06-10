/*
 * grunt-css-test
 * https://github.com/adcarabajal/grunt-css-test
 *
 * Copyright (c) 2014 adcarabajal
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'tasks/lib/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: ['tmp'],

    nodeunit: {
      tests: ['test/*_test.js']
    },

    css_test: {
      options:{
        pages: [{ name:'googleHome', url:'https://www.google.com'}]
      },
      local: {
        options: {
          screenshotsPath: 'tmp/screenshots/chrome',
          resultsPath: 'tmp/results/chrome'
        }
      },
      sauce_chrome: {
        options: {
          environment: {
            description: 'Chrome VM at Sauce Labs',
            sauce: true,
            debug: false,
            remote: {
              host: "ondemand.saucelabs.com",
              port: 80
            },
            capabilities: {
              name: 'styles test',
              tags: ['styles testing'],
              'tunnel-identifier': 'tunnel-id',
              'screen-resolution': '1024x768',
              platform: 'Windows 7',
              browserName: 'chrome',
              version: '34',
              build: 'build #'
            }
          },
          screenshotsPath: 'tmp/screenshots/sauce/chrome',
          resultsPath: 'tmp/results/sauce/chrome'
        }
      }
    }

  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['clean', 'css_test', 'nodeunit']);

  grunt.registerTask('default', ['jshint', 'test']);

};
