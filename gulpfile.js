'use strict';

var fs = require('fs')
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var babel = require('gulp-babel');
var clean = require('gulp-clean');

var PATHS = {
    "ax5core": {
        isPlugin: true,
        root: "src/ax5core",
        src: "src/ax5core/src",
        dest: "src/ax5core/dist",
        js: "ax5core"
    },
    "ax5ui-dialog": {
        isPlugin: true,
        root: "src/ax5ui-dialog",
        src: "src/ax5ui-dialog/src",
        dest: "src/ax5ui-dialog/dist",
        scss: "ax5dialog.scss",
        js: "ax5dialog"
    },
    "ax5ui-mask": {
        isPlugin: true,
        root: "src/ax5ui-mask",
        src: "src/ax5ui-mask/src",
        dest: "src/ax5ui-mask/dist",
        scss: "ax5mask.scss",
        js: "ax5mask"
    },
    "ax5ui-toast": {
        isPlugin: true,
        root: "src/ax5ui-toast",
        src: "src/ax5ui-toast/src",
        dest: "src/ax5ui-toast/dist",
        scss: "ax5toast.scss",
        js: "ax5toast"
    },
    "ax5ui-modal": {
        isPlugin: true,
        root: "src/ax5ui-modal",
        src: "src/ax5ui-modal/src",
        dest: "src/ax5ui-modal/dist",
        scss: "ax5modal.scss",
        js: "ax5modal"
    },
    "ax5ui-calendar": {
        isPlugin: true,
        root: "src/ax5ui-calendar",
        src: "src/ax5ui-calendar/src",
        dest: "src/ax5ui-calendar/dist",
        scss: "ax5calendar.scss",
        js: "ax5calendar"
    },
    "ax5ui-picker": {
        isPlugin: true,
        root: "src/ax5ui-picker",
        src: "src/ax5ui-picker/src",
        dest: "src/ax5ui-picker/dist",
        scss: "ax5picker.scss",
        js: "ax5picker"
    },
    "ax5ui-formatter": {
        isPlugin: true,
        root: "src/ax5ui-formatter",
        src: "src/ax5ui-formatter/src",
        dest: "src/ax5ui-formatter/dist",
        scss: "ax5formatter.scss",
        js: "ax5formatter"
    },
    "ax5ui-menu": {
        isPlugin: true,
        root: "src/ax5ui-menu",
        src: "src/ax5ui-menu/src",
        dest: "src/ax5ui-menu/dist",
        scss: "ax5menu.scss",
        js: "ax5menu"
    },
    "ax5ui-select": {
        isPlugin: true,
        root: "src/ax5ui-select",
        src: "src/ax5ui-select/src",
        dest: "src/ax5ui-select/dist",
        scss: "ax5select.scss",
        js: "ax5select"
    },
    "ax5ui-grid": {
        isPlugin: true,
        root: "src/ax5ui-grid",
        src: "src/ax5ui-grid/src",
        dest: "src/ax5ui-grid/dist",
        scss: "ax5grid.scss",
        js: "ax5grid"
    },
    "ax5ui-media-viewer": {
        isPlugin: true,
        root: "src/ax5ui-media-viewer",
        src: "src/ax5ui-media-viewer/src",
        dest: "src/ax5ui-media-viewer/dist",
        scss: "ax5media-viewer.scss",
        js: "ax5media-viewer"
    },
    "ax5ui-uploader": {
        isPlugin: true,
        root: "src/ax5ui-uploader",
        src: "src/ax5ui-uploader/src",
        dest: "src/ax5ui-uploader/dist",
        scss: "ax5uploader.scss",
        js: "ax5uploader"
    }
};

function errorAlert(error) {
    notify.onError({title: "Gulp Error", message: "Check your terminal", sound: "Purr"})(error); //Error Notification
    console.log(error.toString());//Prints Error to Console
    this.emit("end"); //End function
}

/**
 * SASS
 */
for (var k in PATHS) {
    var __p = PATHS[k];
    if (__p.isPlugin && __p.scss) {
        gulp.task(k + '-scss', (function (k, __p) {
            return function () {
                gulp.src(PATHS[k].src + '/' + __p.scss)
                    .pipe(plumber({errorHandler: errorAlert}))
                    .pipe(sass({outputStyle: 'compressed'}))
                    .pipe(gulp.dest(PATHS[k].dest));
            }
        })(k, __p));
    }
}

/**
 * for JS
 */
for (var k in PATHS) {
    var __p = PATHS[k];
    if (__p.isPlugin && __p.js) {
        gulp.task(k + '-scripts', (function (k, __p) {
            return function () {
                gulp.src(PATHS[k].src + '/*.js')
                    .pipe(plumber({errorHandler: errorAlert}))
                    .pipe(concat(__p.js + '.js'))
                    .pipe(babel({
                        presets: ['es2015']
                    }))
                    .pipe(gulp.dest(PATHS[k].dest))
                    .pipe(concat(__p.js + '.min.js'))
                    .pipe(uglify())
                    .pipe(gulp.dest(PATHS[k].dest));
            }
        })(k, __p));
    }
}

/**
 * watch
 */
gulp.task('default', function () {

    // scripts
    for (var k in PATHS) {

        var __p = PATHS[k];
        if (__p.isPlugin && __p.js) {
            gulp.watch(PATHS[k].src + '/*.js', [k + '-scripts']);
        }
        if (__p.isPlugin && __p.scss) {
            gulp.watch(PATHS[k].src + '/**/*.scss', [k + '-scss']);
        }
    }

});


var jsdoc = require('gulp-jsdoc3');

gulp.task('doc', function (cb) {
    gulp.src(['src/ax5ui-select/src/ax5select.js'], {read: false})
        .pipe(jsdoc(cb));
});
