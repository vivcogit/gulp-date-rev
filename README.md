<h1 align="center">
	gulp-date-rev
</h1>

<p align="center">
    <a href="https://david-dm.org/vivcogit/gulp-date-rev">
        <img alt="David" src="https://img.shields.io/david/vivcogit/gulp-date-rev.svg?style=flat-square" />
    </a>
    <a href="https://www.npmjs.com/package/gulp-date-rev">
        <img alt="npm" src="https://img.shields.io/npm/v/gulp-date-rev.svg?style=flat-square" />
    </a>
</p>

Static asset revisioning by datestamp (yyyyMMdd) with version number (xx) to filenames: 
index_app.js => index_app.20160510-00.js.
If there is no difference file to be created with the latest version, the file is not created. 
Otherwise, it creates a version with a mask. The first day is numbered as version 00.

## Install
```
$ npm install gulp-date-rev
```

## Usage
```js
var gulp = require('gulp');
var rev = require('gulp-date-rev');

var DIST_FOLDER = 'dist';

gulp.task('default', function () {
	return gulp.src('src/*.js')
		.pipe(rev(DIST_FOLDER))
		.pipe(gulp.dest(DIST_FOLDER));
});
```


## API

### rev(destination)

#### destination

The directory which stores the old version and the new will be created (if necessary).
