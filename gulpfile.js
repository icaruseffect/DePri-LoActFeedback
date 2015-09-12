var gulp = require('gulp');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('default', function () {
  //some default task function
});

gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], {
    cwd: 'app'
  }, reload);
});

var gulp = require('gulp');
var bower = require('gulp-bower');

gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('app/bower_components'))
});

var ghPages = require('gulp-gh-pages');
var ghPagesOptions = {
	branch: ""
}


gulp.task('deploy', function() {
  return gulp.src('./app/**/*')
    .pipe(ghPages());
});
