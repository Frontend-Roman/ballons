"use strict";
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const sourceMaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const typograf = require('gulp-typograf');
const htmlmin = require('gulp-htmlmin');
const {series} = require('gulp');


function sassDev() {
    return gulp.src('src/assets/scss/**/*.*')
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('build/assets/css'))
        .pipe(browserSync.reload({stream: true}));
}

function htmlDev() {
    return gulp.src('src/*.html')
        .pipe(typograf({locale: ['ru', 'en-US']}))
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.reload({stream: true}));
}

function imgDev() {
    return gulp.src('src/assets/img/**/*')
        .pipe(gulp.dest('build/assets/img'));
}

function jsDev() {
    return gulp.src('src/assets/js/**/*.js', {sourcemaps: true})
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('build/assets/js'));
}
function fontsDev() {
    return gulp.src('src/assets/fonts/**/*.*')
        .pipe(gulp.dest('build/assets/fonts/'));
}

exports.htmlDev = htmlDev;
exports.sassDev = sassDev;
exports.jsDev = jsDev;
exports.imgDev = imgDev;
exports.fontsDev = fontsDev;

gulp.task("default", gulp.series(htmlDev, sassDev, imgDev, jsDev,fontsDev, function () {
    browserSync.init({
        server: "build"
    });
    gulp.watch("src/assets/scss/**/*.scss", gulp.parallel(sassDev));
    gulp.watch("src/*.html", gulp.parallel(htmlDev));
    gulp.watch("src/assets/img/**/*", gulp.parallel(imgDev));
    gulp.watch("src/assets/js/**/*.js", gulp.parallel(jsDev));
    gulp.watch("src/assets/fonts/**/*.*", gulp.parallel(fontsDev));
}));

function htmlProd() {
    return gulp.src('src/*.html')
        .pipe(typograf({locale: ['ru', 'en-US']}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
}

function cssProd() {
    return gulp.src('src/assets/scss/**/*.*')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/assets/css'));
}

function jsProd() {
    return gulp.src('src/assets/js/**/*.js', {sourcemaps: false})
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('dist/assets/js'));
}

function imgProd() {
    return gulp.src('src/assets/img/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('dist/assets/img'));
}
function fontsProd() {
    return gulp.src('src/assets/fonts/**/*.*')
        .pipe(gulp.dest('build/assets/fonts/'));
}

exports.htmlProd = htmlProd;
exports.cssProd = cssProd;
exports.jsProd = jsProd;
exports.imgProd = imgProd;
exports.fontsProd = fontsProd;

exports.build = series(htmlProd, cssProd, jsProd, imgProd, fontsProd);