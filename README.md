## 深瑞同华配网项目前端规范


### 项目目录
```
-config                             // 项目配置文件
--config.ts                         // 项目的基本配置
--defaultSetting.ts                 // 项目的主题配置等
--proxy.ts                          // 跨域代理
--routes.ts                         // 路由文件管理
-mock                               // 前端自己模拟接口进行调试的文件夹
--user.ts                           // 模拟接口的示范文件
-node_modules                       // 前端依赖库
-public                             // 打包后依旧可以访问到的静态资源
--favicon.ico                       // 浏览器title显示的.ico文件
-src                                // 跟代码有关的文件都放在这里
--.umi                              // umi框架自动生成
--assests                           // 存放静态资源
--components                        // 公用组件
--locals                            // 国际化可能用到
--pages                             // 页面文件夹
--services                          // 所有的请求在这里书写
--styles                            // 公用的样式文件
--utils                             // 工具函数等
---global.less                      // 需要全局引用的样式文件
-.eslintrc.js                       // eslint管理
-.gitignore                         // git忽略提交文件
-package.json                       // 前端依赖库管理
```

### pages 文件夹目录解释

```
-pages
--module-name                       // 模块名称
---page-name                        // 页面名称 
----components                      // 页面独有的小组件
-----components-name                // 组件名称
------index.tsx
------index.less
----index.tsx                       // 页面的主要显示内容
----index.less                      // 页面的样式文件
---route.ts                         // 模块的路由管理

```

### 文件夹命名

```
文件命名统一用短横杠进行拼接
user-login                          // √
useLogin                            // ×
UserLogin                           // ×
```

### css命名

```
less变量统一为用短横杆进线拼接
@primary-color: #000000             // √
@primarkColor: #000000              // ×
@PrimarkColor: #000000              // ×
less 需要根据层级结构进线书写
.main {
    .content {
        &:before {

        }
    }
}                                   // √
less 命名使用小驼峰
.nameClass                          // √
.name-class                         // ×
.name_class                         // ×
.NameClass                          // ×
```

### js规范参考 airbnb

### 目前依赖说明
```
umi.js                              // 阿里出品的企业级react架构框架
ant-design                          // 阿里出品的开源UI框架
classnames                          // classnames 就是帮助我们快速拼接 class 的名称
lodash                              // 快速进行处理数据的函数库
moment                              // 处理时间格式的函数库
omit.js                             // 快速处理对象的函数库
qs                                  // 处理url参数的函数库
umi-request                         // 请求数据用到的函数库
eslint                              // 代码质量控制
```