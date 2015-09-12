var gulp = require('gulp');

// Default task when Gulp is started without specific task
gulp.task('default', ['bower', 'serve']);

// Task for serving the website for the browser with auto-update
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch(['*.html', 'css/**/*.css', 'js/**/*.js'], {
    cwd: 'app'
  }, reload);
});

// Task for getting dependencies with bower
var bower = require('gulp-bower');

gulp.task('bower', function () {
  return bower()
    .pipe(gulp.dest('app/components'));
});

// Task for pushing changes to gh-pages
var ghPages = require('gulp-gh-pages');
var ghPagesOptions = {
	remoteUrl: "https://github.com/icaruseffect/DePri-LoActFeedback.git"
};

gulp.task('deploy', ['bower'], function() {
  return gulp.src('./app/**/*.*')
    .pipe(ghPages(ghPagesOptions));
});
