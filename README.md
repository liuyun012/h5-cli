# h5-cli
H5活动页面个人脚手架，项目所用工具及技术如下：

- 辅助工具 node、gulp、gulp优化插件(html、js、css、images优化压缩)
- 技术：sass、postcss、swipe.js、jQuery

## 如何使用
克隆项目脚手架到本地目录

```
git clone https://github.com/liuyun012/h5-cli.git
```
删除git来源并添加您的项目新来源

```
git remote remove origin
git remote add origin gitUrlNew
git pull
```
安装项目依赖(推荐使用 淘宝镜像)

```
npm install
```
淘宝镜像安装及使用

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
```
使用NPM脚本开始开发产品测试，首次使用时，将自己依赖的 外部js和css 分别放在对应的 min 文件内，执行 gulp min , 将文件拷贝到 dist 文件夹

```
gulp  启动sever服务，监听js和css,html文件的改变浏览器自动刷新
```
项目进行线上发布时执行

```
gulp bulid  压缩优化生成环境代码
gulp devHash  通过gulp 在原html文件上自动化添加js、css版本号  
```
注：在自动化添加js、css版本号时需要修改gulp-rev和gulp-rev-collector来达到我们想要的版本号格式
默认不修改，执行gulp devHash后：

```
<link rel="stylesheet" href="../css/default-803a7fe4ae.css">
```
修改后显示为：

```
<link rel="stylesheet" href="../css/default.css?v=803a7fe4ae">
```
更改方法：

```
① 打开node_modules\gulp-rev\index.js
   第144行 manifest[originalFile] = revisionedFile;
   更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;
② 打开nodemodules\gulp-rev\nodemodules\rev-path\index.js
   第10行 return filename + '-' + hash + ext;
   更新为: return filename + ext;
③ 打开node_modules\gulp-rev-collector\index.js
   第41行 let cleanReplacement =  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
   更新为: let cleanReplacement =  path.basename(json[key]).split('?')[0];
④ 打开node_modules\gulp-rev-collector\index.js
   第164行，regexp: new RegExp( prefixDelim + pattern, 'g' ),
   更新为: regexp: new RegExp( prefixDelim + pattern + '(\\?v=\\w{10})?', 'g' ),
```

##目录结构

```
|
|----- dist 生产环境文件
|
|
|----- src  开发环境文件
|       |
|       |
|       |----- images       图片存放
|       |
|       |
|       |----- js           js文件
|       |
|       |
|       |----- sass         css预编译文件
|       |
|       |
|       |----- index.html   页面入口
|
|
|----- gulpfile.js          gulp任务配置文件
|
|
|----- package.json         项目依赖配置文件
|
|
```
