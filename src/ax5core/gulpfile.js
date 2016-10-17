'use strict';

var fs = require('fs');
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');

gulp.task('default', function () {

    var json = JSON.parse(fs.readFileSync('package.json'));

    gulp.src(['src/*.js', 'src/modules/*.js'])
        .pipe(concat('ax5core.js'))
        .pipe(replace("${VERSION}", json.version))
        .pipe(babel({
            presets: ['es2015'],
            compact: false
        }))
        .pipe(gulp.dest('dist'))
        .pipe(concat('ax5core.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));

});