var gulp = require('gulp');
var uglify = require('gulp-uglify')
var cleanCSS = require('gulp-clean-css')
var rename = require("gulp-rename");
var concat = require('gulp-concat');

gulp.task('default', ['auto', 'jscompress', 'csscompress'])

gulp.task('auto', function () {
    gulp.watch('./pay.js', ['jscompress']);
    gulp.watch('./style.css', ['csscompress'])
});

gulp.task('jscompress', function () {
    return gulp.src(['./zepto.min.js', './pay.js'])
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'))
});
gulp.task('csscompress', function () {
    return gulp.src('./style.css')
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('css'))
})