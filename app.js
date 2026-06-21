require("./configuration/associations");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');

var indexRouter = require('./routes/index');
var userRouter = require('./modules/users/userRoutes');
var videoRoutes = require("./modules/video/videoRoutes");
var likeRoutes = require("./modules/like/likeRoutes");
var commentRoutes = require("./modules/comment/commentRoutes");

var app = express();
var expressLayouts = require("express-ejs-layouts");

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('layout', path.join(__dirname, 'views/layouts/main'));
app.use(expressLayouts)
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 dia
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.session.user || null;
  next();
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', userRouter);
app.use("/", videoRoutes);
app.use("/", likeRoutes);
app.use("/", commentRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // Define variáveis básicas para o layout não quebrar
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // GARANTIA: Define user e messages caso o erro tenha ocorrido antes do middleware global
  res.locals.user = req.session ? req.session.user : null;
  res.locals.messages = { error: [], success: [] };

  res.status(err.status || 500);
  res.render('error');
});


const sequelize = require('./configuration/database');
// Sincroniza os modelos com o banco de dados
if (process.env.NODE_ENV !== 'test') {
  sequelize.sync({ alter: true })
    .then(() => console.log("Banco de dados sincronizado!"))
    .catch(err => console.error("Erro ao sincronizar banco:", err));
}

// sequelize.authenticate()
//   .then(() => console.log("Database Connection was established."))
//   .catch((error) => console.error("It wasn't possible to connect to your database", error));

module.exports = app;