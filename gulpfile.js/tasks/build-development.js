var gulp         = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('build:development', function(callback) {
    gulpSequence('clean',
        ['sass', 'webpack:development'],
        ['watch', 'browserSync'],
        callback
    );
});
