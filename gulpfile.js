const {src, dest, watch, series, parallel} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const rename = require('gulp-rename');

function styles() {
    return src('dev/scss/**/*.scss')
    .pipe(scss({outputStyle: 'expanded'})) // nested, expanded, compact, compressed
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 versions'],
        cascade: false // каскадность
    }))
    .pipe(concat('style.css'))
    .pipe(dest('dev/css'))
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS())
    .pipe(dest('dist/css'))
}

// function buildstyles() {
//     return src('dev/css/style.min.css')
//     .pipe(dest('dist/css'))
// }

function scripts(){
    return src('dev/js/**/*.js', {base: 'dev'})
    .pipe(uglify({
        mangle: false, // сжатие имен переменных
        compress: { // cжатие кода
            drop_console: false,
            passes: 2
        },
        output: {
            beautify: false // красивый код
        }
    }))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(dest('dist'))
}

function html() {
    return src('dev/**/*.html', {base: 'dev'})
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    }))
    .pipe(dest('dist'))
}

function watching() {
    watch(['dev/scss/**/*.scss'], styles);
    watch(['dev/js/**/*.js'], scripts);
    watch(['dev/**/*.html'], html);
}

function cleanDist() {
    return src('dist', {read: false})
    .pipe(clean())
}

exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.autoprefixer = autoprefixer;

exports.default = watching;
exports.build = series(cleanDist, styles, scripts, html);