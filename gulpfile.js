const { src, dest, watch, series, parallel } = require('gulp');
// css y sass
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');
// imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const svg = require('gulp-img2svg');
// html
const htmlmin = require('gulp-htmlmin');




function css( done ){
    //compilar sass
    // paso 1 - Identificar el archivo sass, paso 2 - compilarla, paso 3 - guardarla en un archivo .css

    src('src/scss/app.scss')
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss([autoprefixer(), cssnano()]) )
        .pipe( sourcemaps.write('.'))
        .pipe( dest('build/css') )

    done();
}

function imagenes( ){
    return src('src/img/**/*')
        .pipe( imagemin( { optimizationLevel: 3 } ) )
        .pipe( dest('build/img'))
}

function versionWebp(){
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{jpg,png}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )
}

function versionAvif(){
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{jpg,png}')
        .pipe( avif(opciones) )
        .pipe( dest('build/img') )
}

function versionSvg(){
    return src('src/img/parasvg/*.{jpg,png}')
        .pipe( svg() )
        .pipe( dest('build/img') );
}

         
function html(){
    return src('src/*.html')
    .pipe( htmlmin({ collapseWhitespace: true }) )
    .pipe( dest('build') );
}

function dev(){
    watch('src/scss/**/*.scss', css)
    watch('src/img/**/*', imagenes);
    watch('src/img/**/*.{jpg,png}', versionWebp, versionAvif);
    watch('src/*.html', html);
    watch('src/img/parasvg/*.{jpg,png}', versionSvg);
}



exports.imagenes = imagenes;
exports.css = css;
exports.dev = dev;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.versionSvg = versionSvg;
exports.html = html;
exports.default = series(imagenes, versionWebp, versionAvif,versionSvg, css, html, dev);
//series : se inicia una tarea hasta que finalice, luego la otra y asi...
//parallel : todas inician al mismo tiempo