'use-strict';

var path = require('path');
var logger = require('fancy-log')
var through = require('through2');
var vfile = require('vinyl-file');
var revHash = require('rev-hash');
var modifyFilename = require('modify-filename');
var glob = require('glob');

function transformFilename(file, lastVersionFile) {
  file.versionStamp = getVersionStamp(lastVersionFile);
  file.path = modifyFilename(file.path, function (filename, extension) {
    var extIndex = filename.indexOf('.');

    filename = extIndex === -1
      ? filename + '.' + file.versionStamp
      : filename.slice(0, extIndex) + '.' + file.versionStamp + filename.slice(extIndex);

    return filename + extension;
  });
}

function getVersionStamp(file) {
  var currentDatespamp = getUTCDatestamp();
  if (file == null) {
    return currentDatespamp + '-' + '00';
  }

  var filename = path.basename(file.path);

  var stamp = filename
                .slice(filename.indexOf('.')+1)
                .slice(0, stamp.indexOf('.'))
                .split('-');

  if (stamp[0] == currentDatespamp) {
    return currentDatespamp + '-' + ('0'+(parseInt(stamp[1])+1)).slice(-2);
  } else {
    return currentDatespamp + '-' + '00';
  }
}

function getLastVersionFile(file, destination) {
  const baseFilename = path.basename(file.path);
  const extIndex = baseFilename.indexOf('.');

  const fileMask = extIndex === -1
    ? baseFilename + '.????????-??'
    : baseFilename.slice(0, extIndex) + '.????????-??' + baseFilename.slice(extIndex);

  const versionFiles = glob.sync(path.join(destination, fileMask)).sort();

  return versionFiles[versionFiles.length-1];
}

function isNeedNewVersion(currentFile, lastVersionFile) {
  return lastVersionFile == null || revHash(currentFile.contents) != revHash(lastVersionFile.contents);
}

function getUTCDatestamp() {
  var date = new Date();
  return date.getUTCFullYear() + ('0' + (date.getUTCMonth() + 1)).slice(-2) + ('0' + date.getUTCDate()).slice(-2);
}

var plugin = function (destination) {
  var sourcemaps = [];

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new Error('gulp-date-rev: Streaming not supported'));
      return;
    }

    if (path.extname(file.path) === '.map') {
      sourcemaps.push(file);
      cb();
      return;
    }

    var lastVersionFilename = getLastVersionFile(file, destination);
    var lastVersionFile = lastVersionFilename ? vfile.readSync(lastVersionFilename) : null;
    if (isNeedNewVersion(file, lastVersionFile)) {
      transformFilename(file, lastVersionFile);
      logger('gulp-date-rev:', 'Created new version:', path.basename(file.path));
      cb(null, file);
    } else {
      logger('gulp-date-rev:', 'Version of file', path.basename(lastVersionFilename), 'is actual');
      cb(null, null);
    }
  });
};

module.exports = plugin;
