'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import clean from 'gulp-clean';

const LOCAL_ENV_PATH = process.env.HEXO_TAG_APLAYER_LOCAL_PATH;
const sources = ['index.es', 'lib/**/*.es', 'common/**/*.es'];
const resetExt = (path) => {
    path.extname = '.js';
    console.log(JSON.stringify(path))
};

gulp.task('default', ['build']);

gulp.task('build', () => {
    return gulp.src(sources, {base: '.'})
        .pipe(babel({
            'presets': ['es2015']
        })) 
        .pipe(rename(resetExt))
        .pipe(gulp.dest('.'));
});

gulp.task('test', () => {
    return gulp.src(sources, {base: '.'})
        .pipe(babel({
            'presets': ['es2015']
        }))
        .pipe(rename(resetExt))
        .pipe(gulp.dest(LOCAL_ENV_PATH));
});

gulp.task('clean', () => {
    const builds = sources.map((s) => s.replace('es', 'js'));
    return gulp.src(builds, {read: false})
        .pipe(clean());
});