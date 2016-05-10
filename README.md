# gulp-date-rev
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

const distJS = 'dist';

gulp.task('default', function () {
	return gulp.src('src/*.js')
		.pipe(rev(distJS))
		.pipe(gulp.dest(distJS));
});
```


## API

### rev(destination)

#### destination

The directory which stores the old version and the new will be created (if necessary).