'use strict';

var gulp         = require('gulp');
var $            = require('gulp-load-plugins')();
var sass         = require('gulp-sass');
var pagespeed    = require('psi');
var postcss      = require('gulp-postcss');
var plumber      = require('gulp-plumber');
var autoprefixer = require('autoprefixer-core');
var mqpacker     = require('css-mqpacker');
var webserver    = require('gulp-webserver');

var paths = {
  "scss": ['./source/css/**/*.scss'],
  "css": ['./build/css/**/*.css'],
  "build": './build',
  "buildCSS": './build/css',
  "source": "./source/**/*.html",
  "img": ['./source/img/**/*'],
  "imageDest": './build/img',
  "fonts": ['./source/fonts/**']
}

// Scan your HTML for assets & optimize them
gulp.task('html', function () {
  return gulp.src(paths.source)
    .pipe(plumber())
    .pipe(gulp.dest(paths.build))
    .pipe($.size({title: 'html'}));
});

// Copy web fonts to dist
gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('./build/fonts'))
    .pipe($.size({title: 'fonts'}));
});

// Complile sass
gulp.task('sass', function () {
  gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(sass())
    .pipe(sass({errLogToConsole: true}))
    .pipe(gulp.dest(paths.buildCSS));
});

// Run PostCSS
gulp.task('postcss', function () {
  var processors = [
      autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']}),
      mqpacker
  ];

  return gulp.src(paths.css)
    .pipe(plumber())
    .pipe(postcss(processors))
    .on('error', function (error) {
      console.log(error)
    })
    .pipe(gulp.dest(paths.buildCSS));
});

// Optimize images
gulp.task('images', function () {
  return gulp.src(paths.img)
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(paths.imageDest))
    .pipe($.size({title: 'images'}));
});

// Watch Styles
gulp.task('watchStyles', function () {
  gulp.watch(paths.scss, ['sass']);
  gulp.watch(paths.css, ['postcss']);
});

// Watch HTML
gulp.task('watchHTML', function () {
  gulp.watch(paths.source, ['html']);
});

// Watch Images
gulp.task('watchImages', function () {
  gulp.watch(paths.img, ['images']);
});

// Serve Website
gulp.task('serve', function() {
  gulp.src(paths.build)
  .pipe(webserver({
    livereload: true,
    directoryListing: false,
    open: true
  }))
});

// Defaut
gulp.task('default', [
  'html',
  'sass',
  'postcss',
  'images',
  'fonts'
]);

// Watch
gulp.task('watch', [
  'default',
  'watchStyles',
  'watchHTML',
  'watchImages',
  'serve'
]);

// Run PageSpeed Insights
gulp.task('pagespeed', function (cb) {
  // Update the below URL to the public URL of your site
  pagespeed.output('we_are.emersonstone.com', {
    strategy: 'mobile',
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb);
});
