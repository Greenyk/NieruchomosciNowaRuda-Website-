const { src, dest, watch, series, parallel } = require('gulp');

const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const Babelify = require('babelify');

// File paths
const files = {
    scssPath: 'src/scss/**/*.scss',
    // jsPath: 'src/js/**/*.js',
    // htmlPath: 'src/html/**/*.html',
};

// function jsTask() {
//     return src([files.jsPath])
//         .pipe(sourcemaps.init())
//         .pipe(concat('script.js'))
//         .pipe(
//             babel({
//                 presets: ['@babel/preset-env'],
//             })
//         )
//         .pipe(uglify())
//         .pipe(sourcemaps.write())
//         .pipe(dest('dist/js'));
// }
//
// function browserifyTask() {
//     return browserify('dist/js/script.js', {
//         debug: true,
//     })
//         .transform(
//             Babelify.configure({
//                 presets: ['@babel/preset-env'],
//                 sourceMaps: true,
//             })
//         )
//         .bundle()
//         .pipe(source('bundle.js'))
//         .pipe(dest('dist/js/bundle'))
//         .pipe(browserSync.stream());
// }

function scssTask() {
    return src([files.scssPath])
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist/css'));
}

// function includeHTML() {
//     return src([files.htmlPath, '!src/html/partials/**'])
//         .pipe(
//             fileinclude({
//                 prefix: '@@',
//                 basepath: '@file',
//             })
//         )
//         .pipe(dest('dist'));
// }

function watchTask() {
    watch(
        [files.scssPath],
        {
            interval: 500,
            usePolling: true,
        },
        series(parallel(scssTask))
    );
}

exports.default = series(
    parallel(scssTask),
    watchTask
);
