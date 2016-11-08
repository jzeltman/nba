(() => {
    'use strict';
})();

import gulp from 'gulp';
import gutil from 'gulp-util';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import del from 'del';
import reactify from 'reactify';
import babelify from 'babelify';
import watchify from 'watchify';


// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
let dependencies = [ 'react', 'react-dom' ];

// keep a count of the times a task refires
var scriptsCount = 0;

// Gulp tasks
// ----------------------------------------------------------------------------
gulp.task('scripts', function () { bundleApp(true); });
gulp.task('build-js', function () { bundleApp(true); });
gulp.task('deploy', function (){ bundleApp(true); });
gulp.task('watch', function () { gulp.watch(['./js/*.js'], ['scripts']); });

// When running 'gulp' on the terminal this task will fire.
// It will start watching for changes in every .js file.
// If there's a change, the task 'scripts' defined above will fire.
gulp.task('default', ['scripts','watch']);

// Private Functions
// ----------------------------------------------------------------------------
function bundleApp(isProduction) {
    scriptsCount++;
    // Browserify will bundle all our js files together in to one and will let
    // us use modules in the front end.
    var appBundler = browserify({
        entries: './js/index.js',
        debug: true,
        plugins: ['transform-object-rest-spread']
    });

    // If it's not for production, a separate vendors.js file will be created
    // the first time gulp is run so that we don't have to rebundle things like
    // react everytime there's a change in the js file
    if (!isProduction && scriptsCount === 1){
        // create vendors.js for dev environment.
        browserify({
            require: dependencies,
            debug: true
        })
        .bundle()
        .on('error', gutil.log)
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('./public/js/'));
    }
    if (!isProduction){
        // make the dependencies external so they dont get bundled by the 
        // app bundler. Dependencies are already bundled in vendor.js for
        // development environments.
        dependencies.forEach(function(dep){
            appBundler.external(dep);
        })
    }

    appBundler
        // transform ES6 and JSX to ES5 with babelify
        .transform('babelify', {presets: ['es2015', 'react']})
        .bundle()
        .on('error',gutil.log)
        .pipe(source('index.js'))
        .pipe(gulp.dest('./public/js/'));
}
