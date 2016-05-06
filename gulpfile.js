var gulp = require('gulp');
var haml = require('gulp-haml');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var jshint = require('gulp-jshint');

gulp.task('haml', function(){
	return gulp.src('./app/haml/*.haml')
		.pipe(haml())
		.pipe(gulp.dest('./app'));
});


gulp.task('sass', function(){
	return gulp.src('./app/sass/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('./app/css'))
});

gulp.task('browserify', function(){
	return gulp.src('./app/js/app.js')
		.pipe(browserify())
		.pipe(gulp.dest('./app/js/build'));
});

gulp.task('jshint', function(){
	return gulp.src('./app/js/app.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('default', ['haml', 'sass', 'jshint', 'browserify']);

gulp.task('watch', function(){
	gulp.watch('./app/haml/*.haml', ['haml']);
	gulp.watch('./app/sass/*.sass', ['sass']);
	gulp.watch('./app/js/app.js', ['jshint', 'browserify']);
});