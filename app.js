/* eslint-disable no-console */
require('./constants');
global.config = require('./config');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const { UniqueConstraintError, Sequelize } = require('sequelize');
const {
  crossdomain,
  auth
} = require('./libs');

// DB
global.sequelize = new Sequelize(config.db);
sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}, (err) => {
  console.error('Unable to connect to the database:', err);
});

// modelos
global.models = require('./models');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.enable('trust proxy');
app.use(morgan(config.log));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(crossdomain);
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth);

// rutas
require('./routes')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  if (err.errors) {
    listErrors(err instanceof UniqueConstraintError ? 409 : 400, res, err.errors.map((e) => ({ field: e.path, msg: e.message })));
  } else if (err instanceof Error) {
    listErrors(err.status || 500, res, err);
  } else {
    res.status(err.status || 500).send(err);
  }
});

module.exports = app;
