# grunt-css-test
[![Build Status](https://travis-ci.org/adcarabajal/grunt-css-test.png)](https://travis-ci.org/adcarabajal/grunt-css-test)
[![NPM version](https://badge.fury.io/js/grunt-css-test.png)](http://badge.fury.io/js/grunt-css-test)
[![devDependency Status](https://david-dm.org/adcarabajal/grunt-css-test/dev-status.png)](https://david-dm.org/adcarabajal/grunt-css-test)

> CSS testing through browsers screenshots comparation

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-css-test --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-css-test');
```

## The "css_test" task

### Overview
In your project's Gruntfile, add a section named `css_test` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  css_test: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.screenshotsPath
Type: `String`
Default value: `tests/screenshots/target`

Path that is used to save testing pages screenshots. These screenshots are used later as expected images.

#### options.resultsPath
Type: `String`
Default value: `tests/results/target`

Path that is used to save current pages screenshots and diff images from previously saved images.

### options.pages
Type: `Array`

A list of pages to test.

### options.environment.sauce
Type: `Boolean`

Target environment uses saucelabs connection.

### options.environment.debug
Type: `Boolean`

Debug information is displayed on console if enabled. This includes webdriver commands.

### options.environment.remote
type: `Object`
Default value: `http://localhost:9515`

WebDriver remote connection information. 
For example if you want to use sauce onDemand:

```js
remote: {
  host: "ondemand.saucelabs.com",
  port: 80
},
```

### options.environment.capabilities
type: `Object`

An object that describes the capabilities to instantiate a new webdriver.
[more info](https://code.google.com/p/selenium/wiki/DesiredCapabilities).

There is an important property if you decide to choose sauceLabs, the `tunnel-identifier`, this will be the map between sauce connect and your test.

### Usage Examples

#### Default Options
In this example, there is just one page to test.

The webdriver will try to connect remote: `http://localhost:9515`, using chrome.
Images will be stored on `tests/screenshots/local`.      

```js
grunt.initConfig({
  css_test: {
    options:{
      pages: [{ name:'googleHome', url:'https://www.google.com'}]
    },
    local: {
      options: {
      }
    }
  },
});
```

#### Custom Options
In this example, a browser from sauceLabs is instantiated.

```js
grunt.initConfig({
  css_test: {
      options:{
        pages: [{ name:'googleHome', url:'https://www.google.com'}]
      },
      sauce_chrome: {
        options: {
          environment: {
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
    },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

[Grunt]: http://gruntjs.com/
[Gruntfile.js]: https://github.com/dfernandez79/grunt-filetransform/blob/master/Gruntfile.js
