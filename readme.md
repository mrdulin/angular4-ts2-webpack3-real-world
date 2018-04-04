
__姿势:__

* `yarn start`启动`webpack-dev-server`（支持异步`chunk`模块加载）
* `yarn run build:dev`, 使用`webpack.dev.ts`配置编译打包出开发环境下的静态资源
* `yarn run build`, 使用`webpack.prod.ts`配置编译打包出生产环境下的静态资源
* `nginx`添加如下配置:

```nginx
#运营后台
server {
  listen 80;
  server_name turin.test.pajkdc.com;
  error_page 500 502 503 504  /50x.html;
  location = /50x.html {
      root   html;
  }
  location / {
      proxy_pass http://localhost:2222/;
  }
}
```

* `hosts`文件添加一条域名映射记录

`127.0.0.1 turin.test.pajkdc.com`  

__注意：__

* AOT编译注意：https://github.com/AngularClass/angular-starter#aot-donts
* 风格指南：https://angular.cn/docs/ts/latest/guide/style-guide.html

__TODO：__

- [x] Angular2中`JIT`和`AOT`编译。使用`AOT`编译替代`JIT`编译

  参考1: https://segmentfault.com/a/1190000008739157
  
  参考2: https://angular.cn/docs/ts/latest/cookbook/aot-compiler.html

- [ ] `sidebar`导航封装成`tree` `component`.
- [ ] `http interceptor`，一次请求触发了两次`catch`方法

__废弃:__

* 运行时动态配置路由表, 现在的方案是静态配置，编译时在`angular`内部生成路由映射 [#4234](https://github.com/angular/angular-cli/issues/4234)

__坑:__

* `MdDialog`注入到`HttpInterceptorService`中，调用`MdDialog`的`open`方法打开全局模态框组件，全局模态框组件的`selector`不能是`dialog`，因为`dialog`是`html`原生标签。

* `paginator`组件，动态设置`pageIndex`没有更新视图, 当前是第2页，显示`11-20 of 400`，通过编程方式设置`pageIndex=0`, 依旧显示`11-20 of 400`，期望应该显示`1-10 of NaN`。已确定是`angular-material2 beta.8`版本的`bug`.
