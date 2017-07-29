var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

var fs = require('fs'); //***???

var anyRequest = require('./bin/anyRequest'); // = require('./bin/anyRequest'); etc...
var anyInterval = require('./bin/anyinterval');
var urlPathToConfig = ('./bin/urlPathToConfig.json');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var configSchedule;
var countRepeatLoadSheduleEvery = 0;
var myInterval = anyInterval();
var myRequest = anyRequest(); // first load;
//*************************************

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// section settings param TAIMERS INTERVAL ( myInterval: time - msec, and f - callback)
app.use(function(req, res, next) {
    'use strict';
    //11* Загрузка с локального диска базовой конфигурации  *****
    // И отправка запроса на удаленный сервер 
    // Для получения основной конфигурации расписания
    if (!configSchedule) {
        
        configSchedule = JSON.parse(fs.readFileSync(urlPathToConfig));
        //     myRequest = anyRequest(configSchedule); // first load
        console.log(configSchedule.timeIntervalMsec + "  первая загрузка");
        // myInterval.setConfig(configSchedule.timeIntervalMsec, myRequest.send);
        myRequest.setConfig(configSchedule);
        myRequest.send();
        console.log('myRequest.getConfig()');
        console.log(myRequest.getConfig());
    }
    //22* Загрузка основной конфигурации в модуль ИНТЕРВАЛ ****
    // и в модуль ЗАПРОС, Установка счетчика для обновления 
    //  основной конфигурации через каждые N раз
    else if (configSchedule.firstLoad || (countRepeatLoadSheduleEvery > 10)) {
        countRepeatLoadSheduleEvery = 0;
        configSchedule = myRequest.getConfig();
        console.log(configSchedule.timeIntervalMsec + "  вторая загрузка");
        myInterval.setConfig(configSchedule.timeIntervalMsec, myRequest.send);
        myRequest.setConfig(configSchedule);
        //configSchedule.firstLoad = false;
        console.log(configSchedule.firstLoad);
    }
    //**********************
    countRepeatLoadSheduleEvery += 1;
    console.log(' countRepeatLoadSheduleEvery  ' + countRepeatLoadSheduleEvery);
    next();
});
//******************* end section settings param TAIMERS INTERVAL

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
//************************************************
//
//   app.use(express.static(__dirname + '/public'));
// respond with "hello world" when a GET request is made to the homepage

// section TAIMERS INTERVAL (start myInterval)
app.use('/tms', myInterval.start);

// section TAIMERS INTERVAL (stop myInterval)
app.use('/tms9', myInterval.stop);
//   app.use('/tms9', function(req, res) {
//   res.send(' *** Your Timer is STOPPED! *** ');
//   });
// end section TAIMERS INTERVAL (start, stop)
//app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;