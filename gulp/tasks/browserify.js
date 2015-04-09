/**
 * browserify task
 * ---------------
 * Bundle javascripty things with browserify!
 *
 * This task is set up to generate multiple separate bundles, from
 * different sources, and to use Watchify when run from the default task.
 *
 * See browserify.bundleConfigs in gulp/config.js
 */

var browserify   = require('browserify');
var browserSync  = require('browser-sync');
var watchify     = require('watchify');
var mergeStream  = require('merge-stream');
var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var sourceStream = require('vinyl-source-stream');
var config       = require('../config').browserify;
var _            = require('lodash');


/**
 *
 */
var processBundle = function(bundleConfig) {


    /* Create a browserify instance with config for this specific bundle */
    // var b = browserify(bundleConfig);

    return b
        /* Bundle files into a single JS file */
        .bundle()
        /* Report compile errors */
        .on('error', handleErrors)
        /* Specify the desired output filename, using vinyl-source-stream
           to make the stream gulp compatible. */
        .pipe(sourceStream(bundleConfig.outputName))
        /* Specify the output destination */
        .pipe(gulp.dest(bundleConfig.dest))
        /* Notify browserSync */
        .pipe(browserSync.reload({ stream: true }));
};


/**
 *
 */
var browserifyThis = function(bundleConfig, devMode) {
    var b;

    if (devMode) {
        // Add watchify args and debug (sourcemaps) option
        _.extend(bundleConfig, watchify.args, { debug: true });

        // A watchify require/external bug that prevents proper recompiling,
        // so (for now) we'll ignore these options during development. Running
        // `gulp browserify` directly will properly require and externalize.
        bundleConfig = _.omit(bundleConfig, ['external', 'require']);
    }

    // Log when bundling starts
    bundleLogger.start(bundleConfig.outputName);

    b = browserify(bundleConfig);

    if (devMode) {
        // Wrap with watchify and rebundle on changes
        b = watchify(b);

        // Rebundle on update
        b.on('update', processBundle);
        bundleLogger.watch(bundleConfig.outputName);
    }
    else {
        // Sort out shared dependencies.
        // b.require exposes modules externally
        if (bundleConfig.require) {
            b.require(bundleConfig.require);
        }

        // b.external excludes modules from the bundle, and expects
        // they'll be available externally
        if (bundleConfig.external) {
            b.external(bundleConfig.external);
        }
    }

    return processBundle();
};

/**
 * The final exported gulp task.
 * Processes a series of browserify bundles through browserify.
 *
 * @param devMode {Boolean} Watchify this task?
 * @return {Function}
 */
var browserifyTask = function(devMode) {
    // Start bundling with Browserify for each bundleConfig specified
    return mergeStream.apply(gulp, config.bundleConfigs.map(function(bc) {
        return browserifyThis(bc, devMode);
    }));
};


gulp.task('browserify', function() {
    return browserifyTask();
});

/* Export the task so it can be called directly in our watch task with the 'devMode' option */
module.exports = browserifyTask;
