const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
// const sourcemaps = require('gulp-sourcemaps');
// const uncss = require('gulp-uncss');

function minifyJS() {
  return src('scripts/*.js')
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(dest('scripts/min'));
}

function convertCSS() {
  return src('CSS/sass/main.scss')
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(dest('CSS/sass/'));
}

function minifyCSS() {
  return src('CSS/sass/main.css')
  .pipe(cssnano())
  .pipe(rename({extname: '.min.css'}))
  .pipe(dest('CSS/min/'));
}

// function watchChanges() {
//   watch(['scripts/*.js', 'CSS/sass/**/*.scss']);
// }

exports.minifyJS = minifyJS;
exports.convertCSS = convertCSS;
exports.minifyCSS = minifyCSS;
exports.default = series(convertCSS, minifyCSS, minifyJS);