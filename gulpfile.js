const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const browserify = require('gulp-browserify');
const merge = require('merge-stream');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const injectPartials = require('gulp-inject-partials');

const reload = browserSync.reload;

// sourcepaths and apppath is config object to be used in overall gulpfile

// point all the path files in the source (src) folder
const SOURCEPATHS = {
  sassSource: 'src/scss/*.scss',
  htmlSource: 'src/*.html',
  jsSource: 'src/js/**', // two asteriscs means any file that you find right there
  imgSource: 'src/img/',
  htmlPartialSource: 'src/partial/*.html'  // html partials is html files to be added to all html files
}

// point all the path files in the aplication (app) folder
const APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js',
  fonts: 'app/fonts',
  images: 'app/img'
}

const EXTENSIONS = {
  fonts: 'eot,svg,ttf,woff,woff2',
  images: 'png,jpg,jpeg'
}

const FONTSPATH = {
  bootstrap: './node_modules/bootstrap/dist/fonts/'
}

const CSSPATH = {
  bootstrap: './node_modules/bootstrap/dist/css/'
}

gulp.task('html', function () {
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(injectPartials())
    .pipe(gulp.dest(APPPATH.root));
});

gulp.task('images', function () {
  return gulp.src(SOURCEPATHS.imgSource + '*.' + '{' + EXTENSIONS.images + '}')  // will monitor image source path
    .pipe(newer(APPPATH.images))  // validate if new files exists in APPPATH
    .pipe(imagemin())  // make images minification
    .pipe(gulp.dest(APPPATH.images));  // set the destiny of sourcepath images
});

// task to move allowed fonts
gulp.task('move-fonts', function () {
  gulp.src(FONTSPATH.bootstrap + '*.' + '{' + EXTENSIONS.fonts + '}')  // the second path defines allowed font extensions
    .pipe(gulp.dest(APPPATH.fonts));
});

// invoque a task
// scss is the common way that you call your sass files folder
// pipes is where the task runs (and where you say what to do with the task)
// outputStyle is a method of sass
// gulp.dest is the destination of where will be compiled
gulp.task('sass', function () {

  var bootstrapCSS = gulp.src(CSSPATH.bootstrap + 'bootstrap.css');
  var sassFiles;

  sassFiles = gulp.src(SOURCEPATHS.sassSource)
    .pipe(autoprefixer())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError));

    return merge(sassFiles, bootstrapCSS)  // in this case we added sass and after bootstrap css in app.css file
      .pipe(concat('app.css'))
      .pipe(gulp.dest(APPPATH.css));

});

// copying html files to another folder (called by watch task)
// commented in function of html task
// gulp.task('copy', ['clean-html'], function () {
//   gulp.src(SOURCEPATHS.htmlSource)
//     .pipe(gulp.dest(APPPATH.root))
// });

gulp.task('scripts', ['clean-scripts'], function () {
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))  // the output file of concat
    .pipe(browserify())  // set all libraries on jsSource in just one file (main.js in this case)
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
  'clean-html',
  // 'copy',
  'scripts',
  'clean-scripts',
  'move-fonts',
  'images',
  'html'
], function () {
  // watch method belogs to gulp
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  // gulp.watch([SOURCEPATHS.htmlSource], ['copy']); injectPartials and copy doing the same
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
  gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html']);
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
