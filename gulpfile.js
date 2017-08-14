const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const reload = browserSync.reload;

// sourcepaths and apppath is config object to be used in overall gulpfile

// point all the path files in the source (src) folder
const SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  jsSource: 'src/js/**' // two asteriscs means any file that you find right there
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
gulp.task('copy', ['clean-html'], function () {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root))
});

gulp.task('scripts', ['clean-scripts'], function () {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))  // the output file of concat
    .pipe(gulp.dest(APPPATH.js));
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

gulp.task('watch', [
  'serve',
  'sass',
  'copy',
  'clean-html',
  'scripts',
  'clean-scripts'
], function () {
  // watch method belogs to gulp
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

// remove files
gulp.task('clean-html', function () {
  return gulp.src(APPPATH.root + '/*.html', {
    read: false, // set to true if you want to read the file content
    force: true // forced removing
  }).pipe(clean());
});

gulp.task('clean-scripts', function () {
  return gulp.src(APPPATH.js + '/*.js', {
    read: false, // set to true if you want to read the file content
    force: true // forced removing
  }).pipe(clean());
});

// if you run only gulo command will run default task
// the square brackets tasks will be executed
// the sass/serve task is removed because watch task already call sass
gulp.task('default', ['watch']);
