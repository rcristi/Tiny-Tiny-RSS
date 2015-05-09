var $ = require('gulp-load-plugins') ();

var pkg = require('./package.json');

var gulp = require('gulp');
$.runSequence = require('run-sequence');
$.streamqueue = require('streamqueue');

gulp.task('build', function() {
  $.runSequence(
    'backupConfig',
    'setDefaultConfig',
    'styles',
    'setTempConfig'
  );
});

gulp.task('backupConfig', function() {
  // move the custom config
  gulp.src('./css/_config.scss')
  .pipe($.clean())
  .pipe($.rename('_config.scss.tmp'))
  .pipe(gulp.dest('./css/'));
});

gulp.task('setDefaultConfig', function() {
  // get the default config
  return gulp.src('./css/_config.scss.sample')
  .pipe($.rename('_config.scss'))
  .pipe(gulp.dest('./css/'));
});

gulp.task('setTempConfig', function() {
  // put the custom config back
  return gulp.src('./css/_config.scss.tmp')
  .pipe($.clean())
  .pipe($.rename('_config.scss'))
  .pipe(gulp.dest('./css/'));
});

var sass = function () {
  return gulp.src('./css/main.scss')
  .pipe($.sass({ compress: true, sourceMap: true }))
  .on('error', $.util.log);
};

gulp.task('styles', function() {
  return $.streamqueue(
    { objectMode: true },
    gulp.src('css/normalize.css'),
    sass()
  )
  .pipe($.cssmin())
  .pipe($.header('/* supports-version:<%= pkg.version %> */\n\n', { pkg : pkg }))
  .pipe($.rename({ basename: 'clean-greader' }))
  .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
  var server = $.livereload();
  gulp.watch([
    './css/**/*.css'
  ], function(evt) {
    server.changed(evt.path);
  });

  gulp.watch([
    './css/**/*.scss'
  ], [
    'styles'
  ]);
});