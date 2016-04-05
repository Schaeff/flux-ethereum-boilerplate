'use strict';

var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var solc = require('solc')
var crypto = require('crypto');
var os = require('os');
var fs = require('fs-extra');
var path = require('path');
var async = require('async');

var babelify = require('babelify'); // Used to convert ES6 & JSX to ES5
var browserify = require('browserify'); // Providers "require" support, CommonJS
var notify = require('gulp-notify'); // Provides notification to both the console and Growel
var rename = require('gulp-rename'); // Rename sources
var sourcemaps = require('gulp-sourcemaps'); // Provide external sourcemap files
var livereload = require('gulp-livereload'); // Livereload support for the browser
var chalk = require('chalk'); // Allows for coloring for logging
var source = require('vinyl-source-stream'); // Vinyl stream support
var buffer = require('vinyl-buffer'); // Vinyl stream support
var watchify = require('watchify'); // Watchify for source changes
var merge = require('utils-merge'); // Object merge tool
var duration = require('gulp-duration'); // Time aspects of your gulp process

var config = {
  js: {
    src: './app.jsx',
    watch: './*',
    outputDir: './dist/',
    outputFile: 'bundle.js',
  },
  sol: {
    src: './contracts/src',
    outputDir: './contracts/build',
  }
};

// This task builds contracts using the npm solc package  
gulp.task('build-with-npm-solc', function(cb) {
  fs.readdir(config.sol.src, (err, files) => {
    if (err) return cb(err)
    gutil.log("Found contracts " + files.map((file) => (chalk.green(file))).join(', '))
    async.map(
      files,
      function(file, callback) {
        fs.readFile(config.sol.src + '/' + file, (err, data) => {
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
        async.map(
          Object.keys(output.contracts),
          function(key, callback) {
            fs.writeFile(
              config.sol.outputDir + '/' + key + ".sol.js",
              "module.exports = { abi: " + output.contracts[key].interface + ", bytecode: '" + output.contracts[key].bytecode + "'}",
              function(err) {
                if (err) return callback(err) 
                callback(null, key)
              })
          },
          function(err, res) {
            if (err) {
              gutil.log(chalk.red("Contracts compilation failed: " + err))
              return cb(err)
            }
            gutil.log("Contracts compilation succeeded: " + res.map((file) => (chalk.green(file))).join(', '))
            cb()
          })
      })
  })
});

gulp.task('styles', function() {
  return gulp.src('./style.less')
    .pipe(less())
    .pipe(gulp.dest('dist'))
});

// Error reporting function
function mapError(err) {
  if (err.fileName) {
    // Regular error
    gutil.log(chalk.red(err.name)
      + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
      + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
      + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
      + ': ' + chalk.blue(err.description));
  } else {
    // Browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message));
  }
}

// Completes the final file outputs
function bundle(bundler) {
  var bundleTimer = duration('Javascript bundle time');

  bundler
    .bundle()
    .on('error', mapError) // Map error reporting
    .pipe(source('app.jsx')) // Set source name
    .pipe(buffer()) // Convert to gulp pipeline
    .pipe(rename(config.js.outputFile)) // Rename the output file
    .pipe(sourcemaps.init({loadMaps: true})) // Extract the inline sourcemaps
    .pipe(sourcemaps.write('./map')) // Set folder for sourcemaps to output to
    .pipe(gulp.dest(config.js.outputDir)) // Set the output folder
    .pipe(notify({
      message: 'Generated file: <%= file.relative %>',
    })) // Output the file being created
    .pipe(bundleTimer) // Output time timing of the file creation
    .pipe(livereload()); // Reload the view in the browser
}

// Gulp task for build
gulp.task('default',['build-with-npm-solc', 'styles'], function() {
  livereload.listen(); // Start livereload server
  var args = merge(watchify.args, { debug: true }); // Merge in default watchify args with browserify arguments

  var bundler = browserify(config.js.src, args) // Browserify
    .plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/bower_components/**']}) // Watchify to watch source file changes
    .transform(babelify, {presets: ['es2015', 'react']}); // Babel tranforms

  bundle(bundler); // Run the bundle the first time (required for Watchify to kick in)

  bundler.on('update', function() {
    bundle(bundler); // Re-run bundle on source updates
  });
});