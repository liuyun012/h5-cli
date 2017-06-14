var gulp = require('gulp');
var del = require('del');                   // 清理文件夹模块
var sass = require('gulp-sass');            // sass文件编译
var postcss = require('gulp-postcss');      // postcss文件编译
var htmlmin = require('gulp-htmlmin');      // html压缩插件
var uglify = require('gulp-uglify');        // js压缩插件
var smushit = require('gulp-smushit');      // 无损压缩图片，只限jpg,png
var browserSync = require('browser-sync');  // 浏览器即时刷新模块
var rev = require('gulp-rev');              //
var runSequence = require('run-sequence');
var revCollector = require('gulp-rev-collector');

// postcss插件包集合
var autoprefixer = require('autoprefixer'); // 自动添加浏览器前缀
var cssnano = require('cssnano');           // css文件压缩优化插件集合包
var px2rem = require('postcss-px2rem');     // px 批量转 rem

// 默认任务启动，直接 gulp 即可
gulp.task('default', ['htmlmin', 'jsmin', 'sassTocss', 'imagesmin', 'serve']);

// 首次使用时，将外引的js和css存放到对应位置，执行 gulp min
gulp.task('min', function () {
    return gulp.src('./src/**/min/**')
        .pipe(gulp.dest('./dist'));
});

// 发布到线上前的压缩优化编译
gulp.task('build', ['sassTocss-build']);

// 实现文件更改后浏览器即时刷新
gulp.task('serve', function() {
    browserSync.init({
        //指定服务器启动根目录
        server: "./dist"
    });
    //监听 html, sass ,js, 图片编译
    gulp.watch("src/*.html", ['htmlmin']);
    gulp.watch("src/sass/**/*.scss", ['sassTocss']);
    gulp.watch("src/js/*.js", ['jsmin']);
    gulp.watch("src/images/*.{jpg,png}", ['imagesmin']);
    //监听任何文件变化，实时刷新页面
    gulp.watch("./src/**/*.*").on('change', browserSync.reload);
});

// sass文件转css, postcss语法功能补充，本地开发阶段
gulp.task('sassTocss', function () {
    var processors = [
        autoprefixer,
        px2rem({remUnit: 16}),
    ];
    return gulp.src('./src/sass/*.scss')
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist/css'));
});

// html文件压缩，本地开发阶段
gulp.task('htmlmin', function () {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'));
});

// js文件压缩，本地开发阶段
gulp.task('jsmin', function() {
    return gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./dist/js'))
});

// 图片文件压缩，本地开发阶段
gulp.task('imagesmin', function () {
    return gulp.src('./src/images/*.{jpg,png}')
        .pipe(smushit())
        .pipe(gulp.dest('./dist/images'));
});

// sass文件转css, postcss语法功能补充，线上发布阶段
gulp.task('sassTocss-build', function () {
    var processors = [
        autoprefixer,
        px2rem({remUnit: 16}),
    ];
    return gulp.src('./src/sass/**/*.scss')
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist/css'));
});

// html文件压缩，发布阶段
gulp.task('htmlmin-build', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('./src/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist'));
});

// html文件压缩，线上发布阶段
gulp.task('jsmin-build', function() {
    gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// 清除dist文件，上线环境编译前执行
gulp.task('clean', function() {
    del(config.build);
});


//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function(){
    return gulp.src('./dist/css/*.css')
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('./dist/css'));
});


//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function(){
    return gulp.src('./dist/js/*.js')
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('./dist/js'));
});


//Html替换css、js文件版本
gulp.task('revHtml', function () {
    return gulp.src(['./dist/**/*.json', './dist/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest('./dist'));
});


//开发构建
gulp.task('devHash', function (done) {
    condition = false;
    runSequence(
        ['revCss'],
        ['revJs'],
        ['revHtml'],
        done);
});
