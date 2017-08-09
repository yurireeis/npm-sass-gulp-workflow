const gulp = require('gulp');
const sass = require('gulp-sass');

// invoque a task
// scss is the common way that you call your sass files folder
// pipes is where the task runs (and where you say what to do with the task)
// outputStyle is a method of sass
// gulp.dest is the destination of where will be compiled
gulp.task('sass', function () {
  return gulp.src('src/scss/app.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('app/css'));
});

// if you run only gulo command will run default task
// the curly brackets tasks will be executed
gulp.task('default', ['sass']);
