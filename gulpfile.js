var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var notify = require("gulp-notify");
var less = require('gulp-less');
var gsm = require('gulp-smake');
var solc = require('solc')
var crypto = require('crypto');
var os = require('os');
var fs = require('fs-extra');
var path = require('path');
var async = require('async');

var solidityPaths = ['./contracts/src/*.sol']
var solidityPath = './contracts/src'
var contractsBuildPath = './contracts/build'

var tmpDir = "./tmp"

gulp.task('build-with-npm-solc', function(cb) {
  fs.readdir(solidityPath, (err, files) => {
    if (err) return cb(err)
    console.log(files)
    async.map(
      files,
      function(file, callback) {
        fs.readFile(solidityPath + '/' + file, (err, data) => {
          if (err) return callback(err)
          return callback(null, data.toString())
        })
      },
      function(err, results) {
        if (err) return cb(err)
        var inputs = {}
        results.forEach(function(result, index) {
          inputs[files[index]] = result
        })
        var output = solc.compile({sources: inputs}, 1)
        async.each(
          Object.keys(output.contracts),
          function(key, callback) {
            fs.writeFile(
              contractsBuildPath + '/' + key + ".sol.js",
              "module.exports = { abi: " + output.contracts[key].interface + ", bytecode: '" + output.contracts[key].bytecode + "'}",
              function(err) {
                if (err) return callback(err) 
                callback()
              })
          },
          function(err) {
            if (err) return cb(err)
            cb()
          })
      })


    // var output = solc.compile(data, 1)
    // console.log(output)
    // cb()

  })
  // var input = "contract x { function g() {} }";
  // var output = solc.compile(input, 1); // 1 activates the optimiser
  // for (var contractName in output.contracts) {
  //   // code and ABI that are needed by web3
  //   console.log(contractName + ': ' + output.contracts[contractName].bytecode);
  //   console.log(contractName + '; ' + JSON.parse( output.contracts[contractName].interface));
  // }
});

gulp.task('build-contracts', function(cb) {
    process.exec('./build_contracts.sh', function (error) {
        if(error) return cb(error);
    });
});

var scriptsDir = '.';
var buildDir = './dist';


function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}


// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(file, watch) {
  var props = {entries: [scriptsDir + '/' + file], debug: true};
  var bundler = watch ? watchify(props) : browserify(props);
  bundler.transform(reactify);
  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', handleErrors)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(buildDir + '/'));
  }
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });
  return rebundle();
}


gulp.task('build', function() {
  return buildScript('app.jsx', false);
});

gulp.task('styles', function() {
  return gulp.src('./style.less')
    .pipe(less())
    .pipe(gulp.dest('dist'))
});


gulp.task('default', ['build-with-npm-solc', 'styles'], function() {
  return buildScript('app.jsx', false);
});