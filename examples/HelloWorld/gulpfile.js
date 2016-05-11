var gulp = require('gulp');
var rev = require('gulp-date-rev');
var buffer = require('gulp-buffer');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

const distJS = 'dist';

gulp.task('default', function () {
  var b = browserify('index.js');
  return b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(rev(distJS))
    .pipe(gulp.dest(distJS));
});
