var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var wechat = require('wechat')

var routes = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var info = require('./routes/info');
var shop = require('./routes/shop');
//2016/3/3 16:29:55
var newroutes = require('./routes/newindex');

//2016/3/3 16:37:38 mongoDb
var multer = require('multer');
var mongoose = require('mongoose');

global.dbHandel = require('./database/dbHandel');
global.db = mongoose.connect("mongodb://localhost:27017/nodedb");

//2016/3/3 16:37:51 express-session
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('html',require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.use('/index', routes);
app.use('/users', users);
app.use('/register', register);
app.use('/info', info);
app.use('/shop', shop);

//2016/3/3 16:29:48
app.use('/', newroutes);
app.use('/newhome', newroutes);
app.use('/newindex', newroutes);
app.use('/newlogin', newroutes);
app.use('/newregister', newroutes);

//2016/3/3 16:29:46 下边这里也加上 use(multer())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

//2016/3/3 16:37:07 express-session
app.use(session({ 
    secret: '123456',
    cookie:{ 
        maxAge: 1000*60*30,
    }
}));

app.use(function(req,res,next){ 
    res.locals.user = req.session.user;   // 从session 获取 user对象
    var err = req.session.error;   //获取错误信息
    delete req.session.error;
    res.locals.message = "";   // 展示的信息 message
    if(err){ 
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
    }
    next();  //中间件传递
});

//wechat addby 2016/2/21 22:14:55
var WECHAT_APP_TOKEN = "macaorestore"
var ENCODINGAES_KEY = "addfadfa2Ea87QDG55ARTFADFAJKAK23481JADGFJ19"
var wechat_config = {
    token: WECHAT_APP_TOKEN,
    appid: 'wx38108dfb53c6e504',
    encodingAESKey: ENCODINGAES_KEY
};

app.use(express.query());

//app.use('/wechat', wechat(wechat_config, function (req, res, next) {
app.use('/wechat', wechat(WECHAT_APP_TOKEN, function (req, res, next) {
    console.log("wechat!!!")
    var message = req.weixin;
    if(message.MsgType == 'text'){
        res.reply({ type: "text", content: "you input " + message.Content});
        /*res.reply([
         {
         title: 'come to my home',
         description: 'girl and rich',
         picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
         url: 'http://nodeapi.cloudfoundry.com/'
         }
         ]);
         */
    }
}));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
