const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const htmlreplace = require('gulp-html-replace');
const del = require('del');

gulp.task('clean', () => {
  const env = process.env.NODE_ENV || 'dev';
  const deletions =
    env === 'prod'
      ? ['dist/css/*.css', 'dist/js/*.js']
      : ['js/scripts.js', 'css/main.css'];

  console.log(deletions);

  return del(deletions);
});

gulp.task('css-min', () => {
  return gulp
    .src('sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('css', () => {
  return gulp
    .src('sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(rename('main.css'))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

gulp.task('js-min', () =>
  gulp
    .src('./js/scripts/*.js')
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js')),
);

gulp.task('js', () =>
  gulp
    .src('./js/scripts/*.js')
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./js')),
);

gulp.task('watch-sass', () => {
  gulp.watch('sass/**/*.scss', gulp.series(['css', 'css-min']));
});

gulp.task('images', async () => {
  const imagemin = await import('gulp-imagemin');

  return gulp.src('img/*').pipe(imagemin.default()).pipe(gulp.dest('dist/img'));
});

gulp.task('dev', () => {
  browserSync.init({
    server: './',
    port: 3000,
  });

  gulp.series(['js', 'css'])();
  gulp.watch('sass/**/*.scss', gulp.task('css'));
  gulp.watch(['js/*.js', '!js/scripts.js'], gulp.task('js'));
  gulp.watch('img/*', gulp.task('images'));
  gulp.watch('*.html').on('change', browserSync.reload);
  gulp.watch('css/*.css').on('change', browserSync.reload);
  gulp.watch(['js/*.js']).on('change', browserSync.reload);
});

gulp.task('build', () => {
  const env = process.env.NODE_ENV || 'dev';

  const js = env === 'prod' ? 'js/scripts.min.js' : '../js/scripts.js';
  const css = env === 'prod' ? 'css/main.min.css' : '../css/main.css';

  gulp.series(['clean', 'js-min', 'css-min', 'images'])();

  return gulp
    .src('index.html')
    .pipe(
      htmlreplace({
        js,
        css,
      }),
    )
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', () => {
  browserSync.init({
    server: './dist',
    port: 3001,
  });

  gulp.task('build')();
});
