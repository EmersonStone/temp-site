'use strict';

var gulp         = require('gulp');
var $            = require('gulp-load-plugins')();
var sass         = require('gulp-sass');
var pagespeed    = require('psi');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var mqpacker     = require('css-mqpacker');

var paths = {
  scss: [
    './source/css/**/*.scss'
  ],
  css: [
    './build/css/style.css'
  ]
}

// Complile sass
gulp.task('sass', function () {
  gulp.src(paths.scss)
    .pipe(sass())
    .pipe(gulp.dest(paths.css));
});

// Run PostCSS
gulp.task('postcss', function () {
  var processors = [
      autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']}),
      mqpacker
  ];

  return gulp.src(paths.css)
    .pipe(postcss(processors))
    .pipe(gulp.dest(paths.css));
});

// Optimize images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

// Watch Styles
gulp.task('watchStyles', function () {
  gulp.watch(paths.scss, ['sass']);
  gulp.watch(paths.css, ['postcss']);
});

// Defaut
gulp.task('default', [
  'sass',
  'postcss'
]);

// Watch
gulp.task('watch', [
  'watchStyles'
]);

// Run PageSpeed Insights
gulp.task('pagespeed', function (cb) {
  // Update the below URL to the public URL of your site
  pagespeed.output('example.com', {
    strategy: 'mobile',
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb);
});
