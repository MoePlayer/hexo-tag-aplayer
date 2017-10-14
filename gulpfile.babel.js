'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

const LOCAL_ENV_PATH = process.env.HEXO_TAG_APLAYER_LOCAL_PATH;

gulp.task('default', ['build']);

gulp.task('build', () => {
    return gulp.src('./index.es')
        .pipe(babel({
            'presets': ['es2015']
        })) 
        .pipe(rename('index.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('test', () => {
    return gulp.src('./index.es')
        .pipe(babel({
            'presets': ['es2015']
        }))
        .pipe(rename('index.js'))
        .pipe(gulp.dest(LOCAL_ENV_PATH));
});