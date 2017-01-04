module.exports = function (config) {
    var configuration = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/lodash/lodash.min.js',
            'node_modules/should/should.js',
            'dist/ax5ui.all.css',
            'dist/ax5ui.all.min.js',
            'src/ax5core/test/test.*.js',
            'src/ax5ui-autocomplete/test/test.*.js',
            'src/ax5ui-binder/test/test.*.js'
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


