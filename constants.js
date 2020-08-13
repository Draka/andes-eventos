global._ = require('lodash');
global.moment = require('moment-timezone');
global.async = require('async');
global.validator = require('validator');

global.listErrors = require('./libs/list_errors.lib');
global.checkAuth = require('./libs/check_auth.lib');

const vars = {
  tz: 'America/Bogota',
  minPassword: 6,
};
_.forEach(vars, (v, i) => {
  global[i] = v;
});
