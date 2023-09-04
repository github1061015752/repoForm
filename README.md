## 前端报表

### 一些约定 ★★★：

- 缩进 2 空格
- 每个方法都要写 jsdoc，标题形式：在完成哪个任务的时候，使用当前方法实现什么效果（在什么时候，做了什么事）
- 组件命名使用大驼峰式命名法，如：MyComponent
- 组件内部，先写 script，再写 template，最后写 style，参考 TestTemplate.vue
- 提交时，尽量让代码更容易 review，即更容易看出两次提交之间的关键差异

### 目录结构

```
report-v2
├ build                       webpack 配置
├ src
│ ├ assets                    公共资源：样式、主题、图片等
│ ├ views                     所有页面
│ │ ├ page                    「某类别的所有页面」，存放所有属于该类的所有单页和所有单页的公共数据、方法
│ │ │ ├ Page.vue              此类页面的公共视图组件
│ │ │ ├ page.js               此类页面的公共数据、方法
│ │ │ ├ overview              某个「单页」的文件夹，名称小写，多个单词时中间短横连接
│ │ │ │ ├ Index.vue           该单页的视图组件，命名为「Index」或「文件夹大驼峰」名称
│ │ │ │ ├ Table.vue           该单页的控件组件
│ │ │ │ ┕ helper.js           该单页的转换数据方法
│ │   ┕ popup
│ ├ components                公共控件类组件
│ │ ┕ CommonComponent.vue     大驼峰命名，命名规律：St+功能+特点，特点为可选
│ ├ pages                     多页，每个文件夹为多页的一个页面
│ │ ├ Page1
│ │ │ ├ App.vue
│ │ │ ├ index.html
│ │ │ ├ index.js
│ │ │ ┕ router.js
│ │ ┕ Page2
│ │   ├ App.vue
│ │   ├ index.html
│ │   ├ index.js
│ │   ┕ router.js
│ ┕ services                  全局服务
│   ├ api                     全局公共 api，发送并返回 api 请求
│   │ ┕ analysis.js           各类页面的 api
│   ├ data                    全局共享数据
│   │ ┕ analysis.js           各类页面的 api
│   ┕ data                    特定功能的方法
│     ├ util.js
│     ┕ http.js
├ static                      静态资源，整个目录自动放到打包结果根目录
┕ 其他                         配置文件
```

### 启动

```shell
# 安装 pnpm
npm i -g pnpm

# 安装依赖
pnpm i

# 启动本地预览
pnpm run dev

# 编译项目（编译时，需要修改 package.json 中 build 传递的参数）
pnpm run build

# 添加依赖
pnpm add <pkg>
```

### 打包

○ 检查：

- map 提取到单独的文件夹
- 移除隐私配置
- 移除 log
- 开启 tailwind 的 purge

### 项目搭建记录

○ 参考

https://juejin.cn/post/6955430382485553166

https://pnpm.io/

https://jsdoc.app/

https://webpack.js.org/guides/

https://v3.vuejs.org/

https://next.router.vuejs.org/

https://element-plus.gitee.io/#/zh-CN/component/color

```shell
pnpm add -D webpack webpack-cli webpack-dev-server webpack-merge
pnpm add -D vue-loader@next @vue/compiler-sfc
pnpm add -D html-webpack-plugin css-loader mini-css-extract-plugin css-minimizer-webpack-plugin copy-webpack-plugin
pnpm add -D tailwindcss@latest postcss@latest autoprefixer@latest postcss-loader
pnpm add -D prettier
pnpm add -D typescript

pnpm add vue@next vue-router@4 element-plus
pnpm add axios
pnpm add blueimp-md5

pnpm add vue-router@4 element-plus @floating-ui/dom vue3-date-time-picker vue3-video-play vxe-table xe-utils
pnpm add axios blueimp-md5 element-resize-detector xlsx echarts heatmap.js
```