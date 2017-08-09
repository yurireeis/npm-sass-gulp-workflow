const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const reload = browserSync.reload;

// sourcepaths and apppath is config object to be used in overall gulpfile

// point all the path files in the source (src) folder
const SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html'
}

// point all the path files in the aplication (app) folder
const APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
}

// invoque a task
// scss is the common way that you call your sass files folder
// pipes is where the task runs (and where you say what to do with the task)
// outputStyle is a method of sass
// gulp.dest is the destination of where will be compiled
gulp.task('sass', function () {
  return gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest(APPPATH.css));
});

// copying html files to another folder (called by watch task)
gulp.task('copy', function () {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root))
});

// browserSync will create a server for us
gulp.task('serve', ['sass'], function () {
  // if tou
  browserSync.init([
    APPPATH.root + '/*.html',
    APPPATH.css + '/*.css',
    APPPATH.js + '/*.js'
  ], { server: { baseDir: APPPATH.root }});
  // baseDir set to browserSync initialize in this folder
});

gulp.task('watch', ['serve', 'sass', 'copy'], function () {
  // watch method belogs to gulp
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
});

// if you run only gulo command will run default task
// the square brackets tasks will be executed
// the sass/serve task is removed because watch task already call sass
gulp.task('default', ['watch']);
