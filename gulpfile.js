'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');

var marko_ax5 = require('gulp-marko-ax5');

var PATHS = {
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
    return gulp.src(PATHS.ax5docs.css_src + '/docs.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(PATHS.ax5docs.css_dest));
});

/**
 * for ax5core
 */
gulp.task('AX5CORE-scripts', function () {
    return gulp.src(PATHS.ax5core.src + '/*.js')
        .pipe(concat('ax5core.js'))
        .pipe(gulp.dest(PATHS.ax5core.dest))
        .pipe(concat('ax5core.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(PATHS.ax5core.dest));
});

/**
 * ax5docs templete render
 */
gulp.task('AX5CORE-docs', function () {
    return gulp.src(PATHS.ax5core.doc_src + '/**/*.html')
        .pipe(changed(PATHS.ax5core.doc_dest))
        .pipe(marko_ax5({
            projectName: "ax5core",
            layoutPath: PATHS.assets.src + '/_layouts/index.marko'
        }, {
            /*
             options: {
                 preserveWhitespace: true,
                 allowSelfClosing: {},
                 checkUpToDate: true,
                 writeToDisk: true
             },
             */
            flatten: false,
            /*
            flatten: {
                src_root: PATHS.ax5core.doc_src
            },
            */
            //extension: 'html'
        }))
        .pipe(gulp.dest(PATHS.ax5core.doc_dest));
});

/**
 * watch
 */
gulp.task('default', function () {
    gulp.watch(PATHS.ax5docs.css_src + '/**/*.scss', ['SASS']);
    gulp.watch(PATHS.ax5core.src + '/*.js', ['AX5CORE-scripts']);
    gulp.watch(PATHS.ax5core.doc_src + '/**/*.html', ['AX5CORE-docs']);
});