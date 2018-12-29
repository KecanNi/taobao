var gulp = require('gulp');
var sass = require('gulp-sass'); //编译scss
var autoprefixer = require('gulp-autoprefixer'); //自动添加前缀
var clean = require('gulp-clean-css'); //压缩css
var concat = require('gulp-concat'); //合并文件
var uglify = require('gulp-uglify'); //压缩js
var babel = require('gulp-babel'); //es6 ----> es5
var htmlmin = require('gulp-htmlmin'); //压缩html插件
var server = require('gulp-webserver'); //起服务

var url = require('url');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');

var data = require('./src/data/data.json');//json数据

//编译SASS
gulp.task('devSass', function () {
    return gulp.src('./src/styles/*.scss')
        .pipe(sass())
        .pipe(concat('index.css'))
        .pipe(clean())
        .pipe(gulp.dest('./src/css'))
})
//监听文件变化
gulp.task('watch', function () {
    return gulp.watch('./src/styles/*.scss', gulp.series('devSass'));
})
//启服务拦截请求
function serverFun(servers) {
    return gulp.src(servers)
        .pipe(server({
            port: 8080,
            open: true,
            middleware: function (req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    return res.end('');
                }
                if (pathname === '/api/list') {
                    var name = url.parse(req.url, true).query.name;
                    var target = [];
                    data.forEach(function (file) {
                        if (file.type.match(name) != null) {
                            target.push(file)
                        }
                    });
                    res.end(JSON.stringify({
                        code: 1,
                        data: target
                    }))
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, servers, pathname)));
                }
            }
        }))
}
gulp.task('devServer', function () {
    return serverFun('src')
})

//开发环境
gulp.task('dev', gulp.series('devSass', 'devServer', 'watch'));

