var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var csslint = require('gulp-csslint');
var minifyCSS = require('gulp-minify-css');

// Lint JS

// Lint Task
gulp.task('lint', function() {
    gulp.src('js/gcgpxviewer.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('minify-js', function() {
    gulp.src(['js/underscore-min.js',
              'js/leaflet/leaflet-src.js',
              'js/tile.stamen.js',
              'js/Control.FullScreen.js',
              'js/L.Control.Locate.js',
              'js/Control.Options.js',
              'js/L.Control.Sidebar.js',
              'js/leaflet.label.js',
              'js/ActiveLayers.js',
              'js/Bing.js',
              'js/date.format.js',
              'js/gcgpxviewer.js'
    ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('js'))
        .pipe(rename('gcgpxviewer.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});



gulp.task('css', function() {
  gulp.src(['css/*.css', 'js/leaflet/leaflet.css'])
    .pipe(csslint())
    .pipe(csslint.reporter());
});


// Concat & Minify JS
gulp.task('minify-css', function() {
    gulp.src(['js/leaflet/leaflet.css',
              'css/L.Control.Sidebar.css',
              'css/Control.FullScreen.css',
              'css/leaflet.label.css',
              'css/L.Control.Locate.css',
              'css/design.css'
    ])
        .pipe(concat('gcgpxviewer.css'))
        .pipe(gulp.dest('css'))
        .pipe(rename('gcgpxviewer.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('.'));
});
