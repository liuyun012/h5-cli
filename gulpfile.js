var gulp = require('gulp');
var del = require('del');                   // 清理文件夹模块
var less = require('gulp-less');            // less文件编译
var postcss = require('gulp-postcss');      // postcss文件编译
var htmlmin = require('gulp-htmlmin');      // html压缩插件
var uglify = require('gulp-uglify');        // js压缩插件
var smushit = require('gulp-smushit');      // 无损压缩图片，只限jpg,png
var browserSync = require('browser-sync');  // 浏览器即时刷新模块

// postcss插件包集合
var autoprefixer = require('autoprefixer'); // 自动添加浏览器前缀
var cssnano = require('cssnano');           // css文件压缩优化插件集合包
var px2rem = require('postcss-px2rem');     // px 批量转 rem

// 默认任务启动，直接 gulp 即可
gulp.task('default', ['htmlmin', 'jsmin', 'lessTocss', 'imagesmin', 'serve']);

// 首次使用时，将外引的js和css存放到对应位置，执行 gulp min
gulp.task('min', function () {
    return gulp.src('./src/**/min/**')
        .pipe(gulp.dest('./dist'));
});

// 发布到线上前的压缩优化编译
gulp.task('build', ['lessTocss-build']);

// 实现文件更改后浏览器即时刷新
gulp.task('serve', function() {
    browserSync.init({
        //指定服务器启动根目录
        server: "./dist"
    });
    //监听 html, Less ,js, 图片编译
    gulp.watch("src/*.html", ['htmlmin']);
    gulp.watch("src/less/**/*.less", ['lessTocss']);
    gulp.watch("src/js/*.js", ['jsmin']);
    gulp.watch("src/images/*.{jpg,png}", ['imagesmin']);
    //监听任何文件变化，实时刷新页面
    gulp.watch("./src/**/*.*").on('change', browserSync.reload);
});

// less文件转css, postcss语法功能补充，本地开发阶段
gulp.task('lessTocss', function () {
    var processors = [
        autoprefixer,
        px2rem({remUnit: 16}),
    ];
    return gulp.src('./src/less/*.less')
    .pipe(less())
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

// less文件转css, postcss语法功能补充，线上发布阶段
gulp.task('lessTocss-build', function () {
    var processors = [
        autoprefixer,
        px2rem({remUnit: 16}),
    ];
    return gulp.src('./src/less/**/*.less')
    .pipe(less())
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

// 清除dist文件，上线环境编译前执行  -- 备用
gulp.task('clean', function() {
    del(config.build);
});
