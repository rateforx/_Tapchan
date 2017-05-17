const express         = require('express');
const io              = require("socket.io");
const path            = require('path');
const favicon         = require('serve-favicon');
const logger          = require('morgan');
const cookieParser    = require('cookie-parser');
const bodyParser      = require('body-parser');
const browserify      = require('browserify');
const watchify        = require('watchify');

const index           = require('./routes/index');
const users           = require('./routes/users');

const app             = express();

const fs  = require('fs');
let b   = browserify({
    entries: ['./src/client/clientMain.js'],
    cache: {},
    packageCache:{},
    plugin: [watchify]
});
b.plugin(bundle, {
    delay: 1000/*,
    ignoreWatch: true,
    poll: false*/
});
b.on('update', bundle);
bundle();
function bundle() {
    b.bundle().pipe((fs.createWriteStream('./public/scripts/bundle.js')));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
