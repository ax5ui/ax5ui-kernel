'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var marko_ax5 = require('gulp-marko-ax5');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");

var PATHS = {
    assets: {
        src: "src/ax5docs/assets"
    },
    ax5docs: {
        css_src: "src/ax5docs/assets/css",
        css_dest: "src/ax5docs/assets/css",
        ax5core: "src/ax5docs/assets/lib/ax5core",
        doc_src: "src/ax5docs/_src_",
        doc_dest: "src/ax5docs"
    },
    ax5core: {
        isPlugin: true,
        root: "src/ax5core",
        src: "src/ax5core/src",
        dest: "src/ax5core/dist",
        js: "ax5core",
        doc_src: "src/ax5docs/_src_ax5core",
        doc_dest: "src/ax5docs/ax5core"
    },
    "bootstrap-ax5dialog": {
        isPlugin: true,
        root: "src/bootstrap-ax5dialog",
        src: "src/bootstrap-ax5dialog/src",
        dest: "src/bootstrap-ax5dialog/dist",
        scss: "ax5dialog.scss",
        js: "ax5dialog",
        doc_src: "src/ax5docs/_src_bootstrap-ax5dialog",
        doc_dest: "src/ax5docs/bootstrap-ax5dialog"
    },
    "bootstrap-ax5mask": {
        isPlugin: true,
        root: "src/bootstrap-ax5mask",
        src: "src/bootstrap-ax5mask/src",
        dest: "src/bootstrap-ax5mask/dist",
        scss: "ax5mask.scss",
        js: "ax5mask",
        doc_src: "src/ax5docs/_src_bootstrap-ax5mask",
        doc_dest: "src/ax5docs/bootstrap-ax5mask"
    },
    "bootstrap-ax5toast": {
        isPlugin: true,
        root: "src/bootstrap-ax5toast",
        src: "src/bootstrap-ax5toast/src",
        dest: "src/bootstrap-ax5toast/dist",
        scss: "ax5toast.scss",
        js: "ax5toast",
        doc_src: "src/ax5docs/_src_bootstrap-ax5toast",
        doc_dest: "src/ax5docs/bootstrap-ax5toast"
    },
    "bootstrap-ax5modal": {
        isPlugin: true,
        root: "src/bootstrap-ax5modal",
        src: "src/bootstrap-ax5modal/src",
        dest: "src/bootstrap-ax5modal/dist",
        scss: "ax5modal.scss",
        js: "ax5modal",
        doc_src: "src/ax5docs/_src_bootstrap-ax5modal",
        doc_dest: "src/ax5docs/bootstrap-ax5modal"
    },
    "bootstrap-ax5calendar": {
        isPlugin: true,
        root: "src/bootstrap-ax5calendar",
        src: "src/bootstrap-ax5calendar/src",
        dest: "src/bootstrap-ax5calendar/dist",
        scss: "ax5calendar.scss",
        js: "ax5calendar",
        doc_src: "src/ax5docs/_src_bootstrap-ax5calendar",
        doc_dest: "src/ax5docs/bootstrap-ax5calendar"
    }
};

function errorAlert(error) {
    notify.onError({title: "Gulp Error", message: "Check your terminal", sound: "Purr"})(error); //Error Notification
    console.log(error.toString());//Prints Error to Console
    this.emit("end"); //End function
};

/**
 * SASS
 */
gulp.task('docs-scss', function () {
    gulp.src(PATHS.ax5docs.css_src + '/docs.scss')
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(PATHS.ax5docs.css_dest));
});

for (var k in PATHS) {
    var __p = PATHS[k];
    if (__p.isPlugin && __p.scss) {
        gulp.task(k + '-scss', (function (k, __p) {
            return function () {
                gulp.src(PATHS[k].src + '/' + __p.scss)
                    .pipe(plumber({errorHandler: errorAlert}))
                    .pipe(sass({outputStyle: 'compressed'}))
                    .pipe(gulp.dest(PATHS[k].dest))
                    .pipe(gulp.dest(PATHS.assets.src + '/lib/' + k));
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
                    .pipe(concat(__p.js + '.js'))
                    .pipe(gulp.dest(PATHS[k].dest))
                    .pipe(gulp.dest(PATHS.assets.src + '/lib/' + k))
                    .pipe(concat(__p.js + '.min.js'))
                    .pipe(plumber({errorHandler: errorAlert}))
                    .pipe(uglify())
                    .pipe(gulp.dest(PATHS[k].dest))
                    .pipe(gulp.dest(PATHS.assets.src + '/lib/' + k));
            }
        })(k, __p));
    }
}

/**
 * ax5docs templete render
 */
gulp.task('AX5UI-docs', function () {
    return gulp.src(PATHS['ax5docs'].doc_src + '/**/*.html')
        .pipe(changed(PATHS['ax5docs'].doc_dest, {extension: '.html', hasChanged: changed.compareSha1Digest}))
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(marko_ax5({
            projectName: "ax5ui",
            layoutPath: PATHS.assets.src + '/_layouts/root.marko',
            layoutModalPath: PATHS.assets.src + '/_layouts/modal.marko'
        }))
        .pipe(gulp.dest(PATHS['ax5docs'].doc_dest));
});

for (var k in PATHS) {
    var __p = PATHS[k];
    if (__p.isPlugin) {
        gulp.task(k + '-docs', (function(k, __p){
            return function () {
                return gulp.src(PATHS[k].doc_src + '/**/*.html')
                    .pipe(changed(PATHS[k].doc_dest, {extension: '.html', hasChanged: changed.compareSha1Digest}))
                    .pipe(plumber({errorHandler: errorAlert}))
                    .pipe(marko_ax5({
                        projectName: k,
                        layoutPath: PATHS.assets.src + '/_layouts/index.marko',
                        layoutModalPath: PATHS.assets.src + '/_layouts/modal.marko'
                    }))
                    .pipe(gulp.dest(PATHS[k].doc_dest));
            }
        })(k, __p) );
    }
}

gulp.task('docs:all', function () {

    gulp.src(PATHS['ax5docs'].doc_src + '/**/*.html')
        .pipe(marko_ax5({
            projectName: "ax5ui",
            layoutPath: PATHS.assets.src + '/_layouts/root.marko',
            layoutModalPath: PATHS.assets.src + '/_layouts/modal.marko'
        }))
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(gulp.dest(PATHS['ax5docs'].doc_dest));

    for (var k in PATHS) {
        var __p = PATHS[k];
        if (__p.isPlugin) {
            gulp.src(PATHS[k].doc_src + '/**/*.html')
                .pipe(marko_ax5({
                    projectName: k,
                    layoutPath: PATHS.assets.src + '/_layouts/index.marko',
                    layoutModalPath: PATHS.assets.src + '/_layouts/modal.marko'
                }))
                .pipe(plumber({errorHandler: errorAlert}))
                .pipe(gulp.dest(PATHS[k].doc_dest));
        }
    }
});

/**
 * watch
 */
gulp.task('default', function () {

    // SASS
    gulp.watch(PATHS.ax5docs.css_src + '/**/*.scss', ['docs-scss']);

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

    // docs watch
    gulp.watch(PATHS.assets.src + '/_layouts/root.marko', ['default', 'AX5UI-docs']);

    var docs_list = [];
    for (var k in PATHS) {
        var __p = PATHS[k];
        if (__p.isPlugin) {
            docs_list.push(k + '-docs');
        }
    }
    gulp.watch(PATHS.assets.src + '/_layouts/index.marko', docs_list);
    gulp.watch(PATHS.assets.src + '/components/**/*.js', docs_list);

    // for MD
    gulp.watch(PATHS.ax5docs.doc_src + '/**/*.html', ['AX5UI-docs']);
    for (var k in PATHS) {
        var __p = PATHS[k];
        if (__p.isPlugin) {
            //console.log(k);
            gulp.watch([PATHS[k].doc_src + '/**/*.html', PATHS[k].root + '/**/*.md'], [k + '-docs']);
        }
    }

});