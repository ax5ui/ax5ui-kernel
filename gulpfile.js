'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var marko = require('marko');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');

var gulp_info = {
    assets: {
        src: "src/ax5docs/assets"
    },
    ax5docs: {
        css_src: "src/ax5docs/assets/css",
        css_dest: "src/ax5docs/assets/css",
        ax5core: "src/ax5docs/assets/lib/ax5core"
    },
    ax5core: {
        src: "src/ax5core/js",
        dest: "src/ax5core/dist",
        doc_src: "src/ax5docs/_src_ax5core",
        doc_dest: "src/ax5docs/ax5core"
    },
    "bootstrap-ax5dialog": {
        doc_src: "src/ax5docs/_src_bootstrap-ax5dialog",
        doc_dest: "src/ax5docs/bootstrap-ax5dialog"
    }
};

/**
 * SASS
 */
gulp.task('SASS', function () {
    gulp.src(gulp_info.ax5docs.css_src + '/docs.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(gulp_info.ax5docs.css_dest));
});

/**
 * for ax5core
 */
gulp.task('AX5CORE-scripts', function () {
    gulp.src(gulp_info.ax5core.src + '/*.js')
        .pipe(concat('ax5core.js'))
        .pipe(gulp.dest(gulp_info.ax5core.dest))
        .pipe(concat('ax5core.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(gulp_info.ax5core.dest));
});


/**
 * watch
 */
gulp.task('WATCH', function () {
    gulp.watch(gulp_info.ax5docs.css_src + '/**/*.scss', ['SASS']);
    gulp.watch(gulp_info.ax5core.src + '/*.js', ['AX5CORE-scripts']);
});