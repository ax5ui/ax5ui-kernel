module.exports = function (config) {
    var configuration = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],

        // list of files / patterns to load in the browser
        files: [
            'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/should.js/11.1.2/should.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.min.js',
            'https://rawgit.com/aeei/aejs/master/dist/ae.min.js',

            'src/ax5core/dist/ax5core.js',
            'src/ax5ui-autocomplete/dist/ax5autocomplete.js',
            'src/ax5ui-binder/dist/ax5binder.js',
            'src/ax5ui-calendar/dist/ax5calendar.js',
            'src/ax5ui-combobox/dist/ax5combobox.js',
            'src/ax5ui-dialog/dist/ax5dialog.js',
            'src/ax5ui-formatter/dist/ax5formatter.js',
            'src/ax5ui-grid/dist/ax5grid.js',
            'src/ax5ui-layout/dist/ax5layout.js',
            'src/ax5ui-mask/dist/ax5mask.js',
            'src/ax5ui-media-viewer/dist/ax5media-viewer.js',
            'src/ax5ui-menu/dist/ax5menu.js',
            'src/ax5ui-modal/dist/ax5modal.js',
            'src/ax5ui-picker/dist/ax5picker.js',
            'src/ax5ui-select/dist/ax5select.js',
            'src/ax5ui-toast/dist/ax5toast.js',
            'src/ax5ui-uploader/dist/ax5uploader.js',
            'src/ax5ui-docker/dist/ax5docker.js',
            'src/ax5ui-palette/dist/ax5palette.js',

            'src/ax5core/test/test.*.js',
            'src/ax5ui-autocomplete/test/test.*.js',
            'src/ax5ui-binder/test/test.*.js',
            'src/ax5ui-calendar/test/test.*.js',
            'src/ax5ui-combobox/test/test.*.js',
            'src/ax5ui-dialog/test/test.*.js',
            'src/ax5ui-formatter/test/test.*.js',
            'src/ax5ui-grid/test/test.*.js',
            'src/ax5ui-layout/test/test.*.js',
            'src/ax5ui-mask/test/test.*.js',
            'src/ax5ui-media-viewer/test/test.*.js',
            'src/ax5ui-menu/test/test.*.js',
            'src/ax5ui-modal/test/test.*.js',
            'src/ax5ui-picker/test/test.*.js',
            'src/ax5ui-select/test/test.*.js',
            'src/ax5ui-toast/test/test.*.js',
            'src/ax5ui-uploader/test/test.*.js',
            'src/ax5ui-docker/test/test.*.js',
            'src/ax5ui-palette/test/test.*.js'
        ],
        // list of files to exclude
        exclude: [],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        //browsers: ['PhantomJS'],
        browsers: ['Chrome'],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        singleRun: true,
        concurrency: Infinity
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['PhantomJS'];
    }

    config.set(configuration);
}


