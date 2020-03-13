const express = require('express');
const fs = require('fs');

const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const resolve = file => path.resolve(__dirname, file);

// 挂载静态资源
const serve = (path, cache) => express.static(resolve(path))
//拦截所以api接口设置头部信息（不能放底部，why？）
app.all('*', function(req, res, next) {
  //跨域
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name");
  //设置前端的这些ajax请求方法'GET,POST,PUT,HEAD,DELETE,OPTIONS'，都有权限调接口
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);

  //console.log('前端的请求方法：',req.method,'请求ip为：',getClientIp(req) );
  //console.log(req.url,'前端传进来的参数为===：',req.method == 'GET'?req.query:req.body)

  if ('OPTIONS' == req.method) {
      res.send(200);
  } else {
      next();
  }
});
app.use('/client', serve('../client'));

// 接口参数处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 挂载中间层
let middleware = require('./middleware');
app.use('/middleware', middleware);



// 挂载路由
let routes = require('./route');
app.use('/', routes);

const port = process.env.PORT || 3031; // 端口设置

// 启动服务
app.listen(port, () => {
  	console.log(`server started at localhost:${port}`);
});