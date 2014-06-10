var
  Q = require('q'),
  assert = require('assert'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  path = require('path'),
  asserters = require('wd').asserters,
  express = require('express');

var app = express();
app.use(express.static(path.resolve('/')));
app.listen(3000);

var PageTestCase = function(browser, options, page) {
    this.options = options;
    this.page = page;
    this.browser = browser;
};

var CreateReferenceScreenshot = function(browser, options, page) {
  this.options = options;
  this.page = page;
  this.browser = browser;
};

PageTestCase.prototype.addBatchTo = function (suite, deferred) {
  var batch = {};
  var that = this;

  batch[this.page.name] = {
    topic: function(){
      var
        callback = this.callback,
        resultImage = that.options.resultsPath + '/' + that.page.name + '.png',
        resultImageFileName = path.resolve(resultImage),
        previousImage = that.options.screenshotsPath + '/' + that.page.name + '.png',
        diffImageFileName = path.resolve(that.options.resultsPath + '/' + that.page.name + '.diff.png');

      mkdirp(path.dirname(resultImageFileName));

      that.browser.
        get(that.page.url).
        waitFor(asserters.jsCondition('loaded === true')).
        saveScreenshot(resultImageFileName).
        get('http://localhost:3000' + path.resolve(__dirname, 'image-comparison.html')).
        execute('compare("' + path.resolve(previousImage) + '","' + path.resolve(resultImage) + '")').
        waitForElementById('result', 30000).
        text().
        then(function (value) {
          if (value === '0.00') {
            callback(null, value);
            return;
          }

          that.browser.
            execute('return window.diffImageData').
            then(function (data) {
              var writeFile = Q.denodeify(fs.writeFile);

              return writeFile(diffImageFileName, data, 'base64');
            }).then(function () {
              callback(null, value);
            });

        });
    },
    'should match previous screenshot': function(err, value) {
      assert(parseFloat(value) <= 0.3, 'Mismatch of ' + value + ' found for ' + that.page.name);
    }
  };

  suite.addBatch(batch);

  deferred.resolve();

};

CreateReferenceScreenshot.prototype.addBatchTo = function (suite, deferred) {
  console.log("Saving screenshot not exists for " + this.page.name);

  var fileName = path.resolve(this.options.screenshotsPath, this.page.name + '.png');
  mkdirp(path.dirname(fileName));

  this.browser.
    get(this.page.url).
    saveScreenshot(fileName).nodeify(function(){
      deferred.resolve();
    });
};

module.exports = {
  create: function (browser, options, page) {
    if(fs.existsSync(path.resolve(options.screenshotsPath, page.name + '.png'))){
      return new PageTestCase(browser, options, page);
    }else{
      return new CreateReferenceScreenshot(browser, options, page);
    }
  }
};