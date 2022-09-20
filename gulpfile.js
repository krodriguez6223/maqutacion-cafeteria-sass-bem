
const { src, dest, watch, series, parallel} = require('gulp');

//Dependencias  de CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

//Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done){
    //compilar sass
    //paso1: identificar el archivo, 2- compilarla, 3- guardar el css
    src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss( [ autoprefixer(), cssnano() ] ))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))
        
        done();
}

function dev(){
    //escucha todos los arcihos que comienza con ejm... '_header'
    watch('src/scss/**/*.scss', css );
    watch('src/img/**/*', imagenes);
   
}

// Funcion para cargar las imagenes
function imagenes() {
    return src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 5 }) )
        .pipe( dest('build/img') )
}
function versionWebp() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( webp( opciones ) )
        .pipe( dest('build/img') )
}
function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
        .pipe( dest('build/img'))
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;

exports.default = series(imagenes, versionWebp, versionAvif, css, dev);

// series - Se inicia una tarea, hasta que finaliza, inicia la siguiente
// parallel - Todas inician al mismo tiempo