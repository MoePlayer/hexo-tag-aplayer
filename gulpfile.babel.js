'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

const LOCAL_ENV_PATH = process.env.HEXO_TAG_APLAYER_LOCAL_PATH;
const sources = ['./index.es', './lib/*.es'];
const resetExt = path => { path.ext = '.js' };

gulp.task('default', ['build']);

gulp.task('build', () => {
    return gulp.src(sources)
        .pipe(babel({
            'presets': ['es2015']
        })) 
        .pipe(rename(resetExt))
        .pipe(gulp.dest('.'));
});

gulp.task('test', () => {
    return gulp.src(sources)
        .pipe(babel({
            'presets': ['es2015']
        }))
        .pipe(rename(resetExt))
        .pipe(gulp.dest(LOCAL_ENV_PATH));
});