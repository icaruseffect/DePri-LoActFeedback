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
    .pipe(gulp.dest('app/components'));
});

var ghPages = require('gulp-gh-pages');
var ghPagesOptions = {
	remoteUrl: "https://github.com/icaruseffect/DePri-LoActFeedback.git"
}


gulp.task('deploy', ['bower'], function() {
  return gulp.src('./app/**/*.*')
    .pipe(ghPages(ghPagesOptions));
});
