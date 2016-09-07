const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const watch = require('gulp-watch');
const excludeGitignore = require('gulp-exclude-gitignore');
const tape = require('gulp-tape');
const tap = require('tap-spec');
const istanbul = require('gulp-istanbul');
const nsp = require('gulp-nsp');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const del = require('del');
const isparta = require('isparta');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
const babelrc = fs.readFileSync(path.join(__dirname, '.babelrc'));
const config = JSON.parse(babelrc);
require('babel-register')(config);

gulp.task('static', () => gulp.src('**/*.js')
  .pipe(excludeGitignore()));
  // .pipe(eslint())
  // .pipe(eslint.format())
  // .pipe(eslint.failAfterError()));

gulp.task('nsp', (cb) => {
  nsp({ package: path.resolve('package.json') }, cb);
});

gulp.task('pre-test', () => gulp.src('lib/**/*.js')
  .pipe(excludeGitignore())
  .pipe(istanbul({
    includeUntested: true,
    instrumenter: isparta.Instrumenter,
  }))
  .pipe(istanbul.hookRequire()));

gulp.task('test', (cb) => {
  let testErr;

  gulp.src('test/**/*.js')
    // .pipe(plumber())
    .pipe(tape({ reporter: tap() }))
    .on('error', (err) => (testErr = err))
    .on('end', () => {
      cb(testErr);
    });
});

gulp.task('watch', () => {
  gulp.watch(['lib/**/*.js', 'test/**'], ['test']);
});

gulp.task('babel', ['clean'], () => gulp.src('lib/**/*.js')
  .pipe(babel())
  .pipe(gulp.dest('dist')));

gulp.task('clean', () => del('dist'));

gulp.task('prepublish', ['nsp', 'babel']);
gulp.task('default', ['static', 'test']);
