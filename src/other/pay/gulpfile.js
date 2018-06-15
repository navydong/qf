var gulp = require('gulp');
var uglify = require('gulp-uglify')
var cleanCSS = require('gulp-clean-css')
var rename = require("gulp-rename");
var concat = require('gulp-concat');

gulp.task('default', ['auto', 'zfbjscompress', 'wxjscompress', 'csscompress'])

gulp.task('auto', function () {
    gulp.watch(['paywx.js', 'pay.js'], ['wxjscompress']);
    gulp.watch(['payzfb.js', 'pay.js'], ['zfbjscompress']);
    gulp.watch('style.css', ['csscompress'])
});

gulp.task('wxjscompress', function () {
    return gulp.src(['zepto.min.js', 'pay.js', 'paywx.js'])
        .pipe(concat('wx.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'))
});
gulp.task('zfbjscompress', function () {
    return gulp.src(['zepto.min.js', 'pay.js', 'payzfb.js'])
        .pipe(concat('zfb.min.js'))
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