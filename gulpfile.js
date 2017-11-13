'use strict';

var fs = require('fs');
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var replace = require('gulp-replace');
var jeditor = require("gulp-json-editor");
var sourcemaps = require('gulp-sourcemaps');

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
    },
    "ax5ui-combobox": {
        isPlugin: true,
        root: "src/ax5ui-combobox",
        src: "src/ax5ui-combobox/src",
        dest: "src/ax5ui-combobox/dist",
        scss: "ax5combobox.scss",
        js: "ax5combobox"
    },
    "ax5ui-layout": {
        isPlugin: true,
        root: "src/ax5ui-layout",
        src: "src/ax5ui-layout/src",
        dest: "src/ax5ui-layout/dist",
        scss: "ax5layout.scss",
        js: "ax5layout"
    },
    "ax5ui-binder": {
        isPlugin: true,
        root: "src/ax5ui-binder",
        src: "src/ax5ui-binder/src",
        dest: "src/ax5ui-binder/dist",
        scss: "ax5binder.scss",
        js: "ax5binder"
    },
    "ax5ui-autocomplete": {
        isPlugin: true,
        root: "src/ax5ui-autocomplete",
        src: "src/ax5ui-autocomplete/src",
        dest: "src/ax5ui-autocomplete/dist",
        scss: "ax5autocomplete.scss",
        js: "ax5autocomplete"
    },
    "ax5ui-docker": {
        isPlugin: true,
        root: "src/ax5ui-docker",
        src: "src/ax5ui-docker/src",
        dest: "src/ax5ui-docker/dist",
        scss: "ax5docker.scss",
        js: "ax5docker"
    },
    "ax5ui-palette": {
        isPlugin: true,
        root: "src/ax5ui-palette",
        src: "src/ax5ui-palette/src",
        dest: "src/ax5ui-palette/dist",
        scss: "ax5palette.scss",
        js: "ax5palette"
    }
};

function errorAlert(error) {
    notify.onError({title: "Gulp Error", message: "Check your terminal", sound: "Purr"})(error); //Error Notification
    console.log(error.toString());//Prints Error to Console
    this.emit("end"); //End function
}


/**
 * watch
 */
gulp.task('default', function () {

    // scripts
    for (var k in PATHS) {

        var __p = PATHS[k];
        if (__p.isPlugin && __p.js) {
            gulp.watch(PATHS[k].src + '/**/*.js', [k + '-scripts']);
        }
        if (__p.isPlugin && __p.scss) {
            gulp.watch(PATHS[k].src + '/**/*.scss', [k + '-scss']);
        }
    }
});

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
                gulp.src([PATHS[k].src + '/*.js', PATHS[k].src + '/modules/*.js'])
                    .pipe(plumber({errorHandler: errorAlert}))
                    .pipe(sourcemaps.init())
                    .pipe(concat(__p.js + '.js'))
                    .pipe(babel({
                        presets: ['es2015'],
                        compact: false
                    }))
                    .pipe(gulp.dest(PATHS[k].dest))
                    .pipe(concat(__p.js + '.min.js'))
                    .pipe(uglify())
                    .pipe(sourcemaps.write('.'))
                    .pipe(gulp.dest(PATHS[k].dest));
            }
        })(k, __p));
    }
}


 /**
 * concat all src for dist
 */
gulp.task('dist-all-in-one', function () {
    var packageJSON = JSON.parse(fs.readFileSync('package.json'));
    var jsSrcs = [];
    var scssSrcs = [];
    for (var k in PATHS) {
        var __p = PATHS[k];
        if (__p.isPlugin) {
            if (__p.js)   jsSrcs.push(PATHS[k].src + '/*.js', PATHS[k].src + '/modules/*.js');
            if (__p.scss) scssSrcs.push(PATHS[k].src + '/' + __p.scss);
        }
    }

    gulp.src(jsSrcs)
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(replace("${VERSION}", packageJSON.version))
        .pipe(sourcemaps.init())
        .pipe(concat('ax5ui.all.js'))
        .pipe(babel({
            presets: ['es2015'],
            compact: false
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(concat('ax5ui.all.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/'));

    gulp.src(scssSrcs)
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('ax5ui.all.css'))
        .pipe(gulp.dest('dist/'));
});

/**
 * src/{module}/test `npm install` auto run.
 * this task require very long time.(5 ~ 10 minutes. maybe more :p)
 */
gulp.task('test-npm-install', function(){
    var commands = [];
    for (var k in PATHS) {
        commands.push('cd ' + PATHS[k].root + ' && npm install');
    }

    gulp.src('').pipe(shell(commands));
});

/**
 *
 */
gulp.task('version', function () {
    var packageJSON = JSON.parse(fs.readFileSync('package.json'));

    gulp.src([PATHS["ax5core"].src + '/*.js'])
        .pipe(concat(PATHS["ax5core"].js + '.js'))
        .pipe(replace("${VERSION}", packageJSON.version))
        .pipe(babel({
            presets: ['es2015'],
            compact: false
        }))
        .pipe(gulp.dest(PATHS["ax5core"].dest))
        .pipe(concat(PATHS["ax5core"].js + '.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(PATHS["ax5core"].dest));

    for (var k in PATHS) {
        var __p = PATHS[k];
        if (__p.isPlugin) {

            gulp.src([PATHS[k].root + "/bower.json", PATHS[k].root + "/package.json"])
                .pipe(jeditor({
                    'version': packageJSON.version
                }))
                .pipe(gulp.dest(PATHS[k].root));

        }
    }
});


// npm version patch -m "버전 메세지"
// gulp version
// git push