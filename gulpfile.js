var gulp = require('gulp');
var sass = require('gulp-sass');
var prettify = require('gulp-html-prettify');

gulp.task('styles', function () {
  gulp.src('./css/sass/style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./css/'));
});

gulp.task('default', function () {
  gulp.watch('./css/sass/style.scss', ['styles']);
});

gulp.task('templates', function () {
  gulp.src('./*.html')
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('./'));
});